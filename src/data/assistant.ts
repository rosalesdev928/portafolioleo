import { projects } from "./projects";
import type { Project, ProjectId } from "./projects";
import { profile } from "./profile";
import type { Translations } from "../i18n/es";

export const assistantCharacter = { src: "/assistant/leonardo-bot.gif", width: 320, height: 320 } as const;
export type AssistantQuestionId = keyof Translations["assistant"]["questions"];
export type AssistantTopic = AssistantQuestionId | ProjectId;
export const suggestedQuestions: readonly AssistantQuestionId[] = ["checabien", "radar", "technologies", "backend", "featured", "contact", "boticlic"];

export type AssistantPrompt = { kind: "suggestion"; topic: AssistantQuestionId } | { kind: "text"; text: string };
export interface AssistantTurn { id: number; prompt: AssistantPrompt; topic: AssistantTopic | null }
export interface AssistantAction { label: string; href: string }
export interface AssistantProjectSummary { id: ProjectId; title: string; role: string; description: string; extra: string; technologies: readonly string[]; actions: readonly AssistantAction[] }
export interface AssistantAnswer { paragraphs: readonly string[]; technologies: readonly string[]; projects: readonly AssistantProjectSummary[]; actions: readonly AssistantAction[] }

function normalize(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

export function resolveAssistantTopic(text: string, t: Translations): AssistantTopic | null {
  const input = ` ${normalize(text)} `;
  if (!input.trim()) return null;
  // Specific project names win over broad words such as "project" or "backend".
  for (const project of projects) {
    if ([project.id, project.title].some((name) => input.includes(` ${normalize(name)} `))) return project.id;
  }
  const order: readonly AssistantQuestionId[] = ["checabien", "radar", "boticlic", "contact", "technologies", "backend", "featured"];
  const topic = order.find((entry) => t.assistant.keywords[entry].some((keyword) => input.includes(` ${normalize(keyword)} `)));
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
    id: project.id, title: project.title, role: copy.role, description: copy.description, extra: copy.extra,
    technologies: project.technologyHighlights ?? project.technologies, actions,
  };
}

export function getAssistantAnswer(topic: AssistantTopic | null, t: Translations): AssistantAnswer {
  const answer: AssistantAnswer = { paragraphs: [], technologies: [], projects: [], actions: [] };
  const project = projects.find((entry) => entry.id === topic);
  if (project) return { ...answer, projects: [summarizeProject(project, t)] };
  if (topic === "featured") return { ...answer, paragraphs: [t.projects.subtitle], projects: projects.filter((entry) => entry.featured).map((entry) => summarizeProject(entry, t)) };
  if (topic === "technologies") return {
    ...answer, paragraphs: [t.hero.description],
    technologies: [...new Set(projects.flatMap((entry) => entry.technologyHighlights ?? entry.technologies))],
  };
  if (topic === "backend") return {
    ...answer, paragraphs: [t.about.description, t.services.api.description, t.projects.items.boticlic.extra],
    technologies: [...new Set(projects.filter((entry) => ["checabien", "boticlic", "sistema-farmacia"].includes(entry.id)).flatMap((entry) => entry.technologyHighlights ?? entry.technologies))],
  };
  if (topic === "contact") return {
    ...answer, paragraphs: [t.hero.available], actions: [
      { label: t.common.contact, href: "#contacto" }, { label: t.common.email, href: `mailto:${profile.email}` },
      { label: t.common.github, href: profile.githubUrl }, { label: t.common.linkedin, href: profile.linkedinUrl },
    ],
  };
  return { ...answer, paragraphs: [t.assistant.fallback] };
}
