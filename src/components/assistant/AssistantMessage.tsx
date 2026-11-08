import { usePreferences } from "../../hooks/usePreferences";
import type { AssistantAction, AssistantAnswer } from "../../data/assistant";

function Actions({ actions, onNavigate }: { actions: readonly AssistantAction[]; onNavigate: (hash: string) => void }) {
  const { t } = usePreferences();
  return <div className="assistant-actions">{actions.map((action) => {
    const internal = action.href.startsWith("#");
    const external = /^https?:\/\//.test(action.href);
    return <a key={`${action.href}-${action.label}`} href={action.href} download={action.download} className="action-primary" target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} aria-label={external ? `${action.label} (${t.common.newTab})` : action.label} onClick={() => { if (internal) onNavigate(action.href); }}>{action.label}</a>;
  })}</div>;
}

function Technologies({ values }: { values: readonly string[] }) {
  const { t } = usePreferences();
  if (!values.length) return null;
  return <ul className="assistant-technologies" aria-label={t.projects.stack}>{values.map((value) => <li key={value}>{value}</li>)}</ul>;
}

export default function AssistantMessage({ answer, onNavigate }: { answer: AssistantAnswer; onNavigate: (hash: string) => void }) {
  const { t } = usePreferences();
  return <div className="assistant-answer">
    {answer.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    <Technologies values={answer.technologies} />
    {answer.services.map((service) => <div key={service.id} className="assistant-project-answer">
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <ul className="assistant-points">{service.points.map((point) => <li key={point}>{point}</li>)}</ul>
      <Technologies values={service.technologies} />
    </div>)}
    {answer.projects.map((project) => <div key={project.id} className="assistant-project-answer">
      <h3>{project.title}</h3>
      {project.role && <p className="assistant-project-role">{project.role}</p>}
      <p>{project.description}</p>
      {project.extra && <p>{project.extra}</p>}
      <Technologies values={project.technologies} />
      <Actions actions={project.actions} onNavigate={onNavigate} />
    </div>)}
    {answer.steps.length > 0 && <div className="assistant-project-answer">
      {answer.services.length > 0 && <h3>{t.assistant.processTitle}</h3>}
      <ul className="assistant-steps">{answer.steps.map((step) => <li key={step}>{step}</li>)}</ul>
    </div>}
    {answer.actions.length > 0 && <Actions actions={answer.actions} onNavigate={onNavigate} />}
  </div>;
}
