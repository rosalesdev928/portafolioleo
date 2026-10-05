import { usePreferences } from "../../hooks/usePreferences";
import type { AssistantAction, AssistantAnswer } from "../../data/assistant";

function Actions({ actions, onNavigate }: { actions: readonly AssistantAction[]; onNavigate: (hash: string) => void }) {
  const { t } = usePreferences();
  return <div className="assistant-actions">{actions.map((action) => {
    const internal = action.href.startsWith("#");
    const external = /^https?:\/\//.test(action.href);
    return <a key={`${action.href}-${action.label}`} href={action.href} className="action-primary" target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} aria-label={external ? `${action.label} (${t.common.newTab})` : action.label} onClick={() => { if (internal) onNavigate(action.href); }}>{action.label}</a>;
  })}</div>;
}

function Technologies({ values }: { values: readonly string[] }) {
  const { t } = usePreferences();
  if (!values.length) return null;
  return <ul className="assistant-technologies" aria-label={t.projects.stack}>{values.map((value) => <li key={value}>{value}</li>)}</ul>;
}

export default function AssistantMessage({ answer, onNavigate }: { answer: AssistantAnswer; onNavigate: (hash: string) => void }) {
  return <div className="assistant-answer">
    {answer.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    <Technologies values={answer.technologies} />
    {answer.projects.map((project) => <div key={project.id} className="assistant-project-answer">
      <h3>{project.title}</h3>
      {project.role && <p className="assistant-project-role">{project.role}</p>}
      <p>{project.description}</p>
      {project.extra && <p>{project.extra}</p>}
      <Technologies values={project.technologies} />
      <Actions actions={project.actions} onNavigate={onNavigate} />
    </div>)}
    {answer.actions.length > 0 && <Actions actions={answer.actions} onNavigate={onNavigate} />}
  </div>;
}
