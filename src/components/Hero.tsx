import { lazy, Suspense } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { usePreferences } from "../hooks/usePreferences";
import { profile } from "../data/profile";

const HeroParticles = lazy(() => import("./HeroParticles"));
const technologies = [
  ["nodejs", "Node.js"], ["react", "React"], ["php", "PHP"], ["laravel", "Laravel"],
  ["sqlserver", "SQL Server"], ["mongodb", "MongoDB"], ["docker", "Docker"], ["microsoftazure", "Microsoft Azure"],
];

export default function Hero() {
  const { language, t } = usePreferences();
  const cv = profile.cv[language];

  return <section id="inicio" className="hero">
    <Suspense fallback={null}><HeroParticles /></Suspense>
    <div className="shell hero-grid">
      <div className="hero-copy">
        <span className="eyebrow">{t.hero.eyebrow}</span>
        <h1>{t.hero.greeting} <span className="accent-text">{profile.name}</span>.<br />{t.hero.headline}</h1>
        <p className="hero-description">{t.hero.description}</p>
        <div className="hero-actions"><a href="#proyectos" className="action-primary">{t.hero.projects}</a><a href="#contacto" className="action-secondary">{t.common.contact}</a></div>
      </div>
      <div className="hero-portrait">
        <div className="portrait-frame"><img src="/fotos/leonard.png" alt={profile.name} width={360} height={480} fetchPriority="high" className="portrait" /></div>
        <p className="availability"><span aria-hidden="true" />{t.hero.available}</p>
      </div>
    </div>
    <div className="shell hero-links">
      <a href={cv.url} download={cv.fileName} className="action-primary cv-button">{t.hero.cv}</a>
      <div className="social-links">
        <a href={`mailto:${profile.email}`} className="social-link" aria-label={t.common.emailLink} title={t.common.emailLink}><Mail aria-hidden="true" size={23} /></a>
        <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="social-link" aria-label={`${t.common.github} (${t.common.newTab})`} title={t.common.github}><Github aria-hidden="true" size={23} /></a>
        <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="social-link" aria-label={`${t.common.linkedin} (${t.common.newTab})`} title={t.common.linkedin}><Linkedin aria-hidden="true" size={23} /></a>
      </div>
    </div>
    <div className="shell technology-strip">
      <div className="technology-strip-header"><span>{t.hero.technologies}</span></div>
      <div className="technology-marquee" role="region" aria-label={t.hero.technologies} tabIndex={0}>
        <div className="technology-marquee-track">
          {[0, 1].map((copy) => <ul key={copy} className="technology-marquee-group" aria-hidden={copy === 1 ? true : undefined}>
            {technologies.map(([file, title]) => <li key={file}><img src={`/logos/${file}.png`} alt={copy === 0 ? title : ""} width={176} height={112} decoding="async" /></li>)}
          </ul>)}
        </div>
      </div>
    </div>
  </section>;
}
