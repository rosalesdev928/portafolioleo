import { useState } from "react";
import { ArrowUpRight, Code2, Github, Play, Star } from "lucide-react";
import type { Project } from "../../data/projects";
import { usePreferences } from "../../hooks/usePreferences";

interface ProjectCardProps {
  project: Project;
  onVideo: (url: string, title: string) => void;
}

export default function ProjectCard({ project, onVideo }: ProjectCardProps) {
  const { t } = usePreferences();
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const copy = t.projects.items[project.id];
  const liveLabel = project.liveAction === "demo" ? t.projects.liveDemo : t.projects.visit;
  const technologies = project.technologyHighlights ?? project.technologies;
  const description = copy?.description ?? project.description;
  const role = copy?.role ?? project.role;
  const context = copy?.context ?? project.context;
  const extra = copy?.extra ?? project.extra;

  return <article className="project-card" aria-labelledby={`project-${project.id}`}>
    <div className="project-card-image">
      {project.image && failedImage !== project.image ? <img src={project.image} alt={copy?.imageAlt ?? project.imageAlt ?? t.projects.image.replace("{title}", project.title)} loading="lazy" decoding="async" width={640} height={360} onError={() => setFailedImage(project.image ?? null)} /> :
        <div className="project-image-fallback"><Code2 size={36} aria-hidden="true" /><span>{project.title}</span><small>{t.projects.fallback}</small></div>}
    </div>
    <div className="project-card-body">
      {project.featured && <span className="featured-badge"><Star size={14} aria-hidden="true" />{t.projects.featured}</span>}
      <h3 id={`project-${project.id}`}>{project.title}</h3>
      {role && <p className="project-role">{role}</p>}
      {description && <p className="project-description">{description}</p>}
      {extra && <p className="project-description project-extra">{extra}</p>}
      {context && <p className="project-meta">{context}</p>}
      <div className="project-stack"><p>{t.projects.stack}</p><ul aria-label={`${t.projects.stack} — ${project.title}`}>
        {technologies.map((technology) => <li key={technology}>{technology}</li>)}
      </ul></div>
      {(project.liveUrl || project.repoUrl || project.videoUrl) && <div className="project-card-actions">
        {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="action-primary" aria-label={`${t.projects.repository} — ${project.title} (${t.common.newTab})`}><Github size={16} aria-hidden="true" />{t.projects.repository}</a>}
        {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="action-primary" aria-label={`${liveLabel} — ${project.title} (${t.common.newTab})`}>{project.liveAction === "demo" ? <Play size={16} aria-hidden="true" /> : <ArrowUpRight size={16} aria-hidden="true" />}{liveLabel}</a>}
        {project.videoUrl && <button type="button" className="action-primary" onClick={() => { if (project.videoUrl) onVideo(project.videoUrl, project.title); }} aria-label={`${t.projects.liveDemo} — ${project.title}`}><Play size={16} aria-hidden="true" />{t.projects.liveDemo}</button>}
      </div>}
    </div>
  </article>;
}
