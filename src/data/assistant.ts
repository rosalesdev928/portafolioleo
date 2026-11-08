import { projects } from "./projects";
import type { Project, ProjectId } from "./projects";
import { profile } from "./profile";
import { services } from "./services";
import type { ServiceId } from "./services";
import type { Translations } from "../i18n/es";

export const assistantCharacter = { src: "/assistant/leonardo-bot.gif", width: 320, height: 320 } as const;
export type AssistantQuestionId = keyof Translations["assistant"]["questions"];
export type AssistantTopic = AssistantQuestionId | ProjectId;
export type AssistantLanguage = keyof typeof profile.cv;
export const suggestedQuestions: readonly AssistantQuestionId[] = ["services", "clients", "contact", "cv", "featured", "projects", "technologies", "backend", "profile", "process", "checabien", "radar", "boticlic"];

export type AssistantPrompt = { kind: "suggestion"; topic: AssistantQuestionId } | { kind: "text"; text: string };
export interface AssistantTurn { id: number; prompt: AssistantPrompt; topic: AssistantTopic | null }
export interface AssistantAction { label: string; href: string; download?: string }
export interface AssistantProjectSummary { id: ProjectId; title: string; role: string; description: string; extra: string; technologies: readonly string[]; actions: readonly AssistantAction[] }
export interface AssistantServiceSummary { id: ServiceId; title: string; description: string; points: readonly string[]; technologies: readonly string[] }
export interface AssistantAnswer { paragraphs: readonly string[]; technologies: readonly string[]; services: readonly AssistantServiceSummary[]; projects: readonly AssistantProjectSummary[]; steps: readonly string[]; actions: readonly AssistantAction[] }

// Projects whose card says "Cliente real" / "Real client".
const realClientProjects: readonly ProjectId[] = ["sentirse-bien", "gym-valencia"];
const frontendOnly: readonly string[] = ["HTML5", "CSS3", "Bootstrap", "AdminLTE", "JavaScript"];

function normalize(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function resolveAssistantTopic(text: string, t: Translations): AssistantTopic | null {
  const input = ` ${normalize(text)} `;
  if (!input.trim()) return null;
  // Specific project names win over broad words such as "project" or "backend".
  for (const project of projects) {
    if ([project.id, project.title].some((name) => input.includes(` ${normalize(name)} `))) return project.id;
  }
  // Narrow intents first: "servicios" or "proyectos" only apply when nothing more specific matched.
  const order: readonly AssistantQuestionId[] = ["checabien", "radar", "boticlic", "pricing", "clients", "cv", "linkedin", "aws", "deployment", "contact", "process", "integrations", "web", "technologies", "backend", "services", "profile", "featured", "projects"];
  const topic = order.find((entry) => (t.assistant.keywords as Record<string, readonly string[]>)[entry].some((keyword) => input.includes(` ${normalize(keyword)} `)));
  if (topic) return topic;
  if (projects.some((entry) => entry.technologies.some((technology) => input.includes(` ${normalize(technology)} `)))) return "technologies";
  return null;
}

function summarizeProject(project: Project, t: Translations): AssistantProjectSummary {
  const copy = t.projects.items[project.id];
  const actions: AssistantAction[] = [{ label: t.projects.visit, href: project.detailsUrl ?? "#proyectos" }];
  if (project.repoUrl) actions.push({ label: t.projects.repository, href: project.repoUrl });
  if (project.liveUrl) actions.push({ label: t.projects.liveDemo, href: project.liveUrl });
  if (project.videoUrl) actions.push({ label: t.projects.liveDemo, href: project.videoUrl });
  return {
    id: project.id, title: project.title, role: copy.role, description: (t.assistant.projectDescriptions as Partial<Record<ProjectId, string>>)[project.id] ?? copy.description, extra: copy.extra,
    technologies: project.technologyHighlights ?? project.technologies, actions,
  };
}

function summarizeServices(ids: readonly ServiceId[], t: Translations): AssistantServiceSummary[] {
  const descriptions: Partial<Record<ServiceId, string>> = t.assistant.serviceDescriptions;
  return services.filter((service) => ids.includes(service.id)).map((service) => {
    const copy = t.services.items[service.id];
    return { id: service.id, ...copy, description: descriptions[service.id] ?? copy.description, technologies: service.technologies };
  });
}

function processSteps(t: Translations) {
  return t.services.steps.map((step, index) => `${String(index + 1).padStart(2, "0")} ${step.title}: ${step.description}`);
}

export function getAssistantAnswer(topic: AssistantTopic | null, t: Translations, language: AssistantLanguage): AssistantAnswer {
  const answer: AssistantAnswer = { paragraphs: [], technologies: [], services: [], projects: [], steps: [], actions: [] };
  const copy = t.assistant.answers;
  const cv = profile.cv[language];
  const cvAction: AssistantAction = { label: t.hero.cv, href: cv.url, download: cv.fileName };
  const formAction: AssistantAction = { label: t.assistant.formAction, href: "#contacto" };
  const emailAction: AssistantAction = { label: t.common.email, href: `mailto:${profile.email}` };
  const linkedinAction: AssistantAction = { label: t.common.linkedin, href: profile.linkedinUrl };
  const project = projects.find((entry) => entry.id === topic);
  if (project) return { ...answer, projects: [summarizeProject(project, t)] };
  if (topic === "featured") return { ...answer, paragraphs: [t.projects.subtitle], projects: projects.filter((entry) => entry.featured).map((entry) => summarizeProject(entry, t)) };
  if (topic === "projects") return { ...answer, paragraphs: [copy.projects.replace("{count}", String(projects.length))], projects: projects.map((entry) => summarizeProject(entry, t)) };
  if (topic === "clients") return { ...answer, paragraphs: [copy.clients], projects: projects.filter((entry) => realClientProjects.includes(entry.id)).map((entry) => summarizeProject(entry, t)) };
  if (topic === "technologies") return {
    ...answer, paragraphs: [copy.technologies],
    technologies: [...new Set(projects.flatMap((entry) => entry.technologyHighlights ?? entry.technologies))],
  };
  if (topic === "backend") return {
    ...answer, paragraphs: [copy.backend, t.projects.items.boticlic.extra], services: summarizeServices(["backend"], t),
    technologies: [...new Set(projects.filter((entry) => ["checabien", "boticlic", "sistema-farmacia"].includes(entry.id)).flatMap((entry) => entry.technologyHighlights ?? entry.technologies))].filter((technology) => !frontendOnly.includes(technology)),
  };
  if (topic === "services") return { ...answer, paragraphs: [copy.services], services: summarizeServices(services.map((service) => service.id), t), steps: processSteps(t), actions: [formAction] };
  if (topic === "web" || topic === "integrations" || topic === "deployment") return { ...answer, services: summarizeServices([topic], t), actions: [formAction] };
  if (topic === "aws") return { ...answer, paragraphs: [copy.aws], services: summarizeServices(["deployment"], t), projects: projects.filter((entry) => entry.technologies.includes("AWS")).map((entry) => summarizeProject(entry, t)) };
  if (topic === "process") return { ...answer, paragraphs: [copy.process], steps: processSteps(t) };
  if (topic === "profile") return { ...answer, paragraphs: [copy.profile], actions: [formAction, cvAction] };
  if (topic === "cv") return { ...answer, paragraphs: [copy.cv], actions: [cvAction] };
  if (topic === "linkedin") return { ...answer, paragraphs: [copy.linkedin], actions: [linkedinAction] };
  if (topic === "pricing") return { ...answer, paragraphs: [copy.pricing.replace("{email}", profile.email)], actions: [formAction, emailAction] };
  if (topic === "contact") return {
    ...answer, paragraphs: [copy.contact.replace("{email}", profile.email).replace("{github}", profile.githubHandle)], actions: [
      formAction, emailAction, linkedinAction, { label: t.common.github, href: profile.githubUrl }, cvAction,
    ],
  };
  return { ...answer, paragraphs: [t.assistant.fallback] };
}
