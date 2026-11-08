import { Check, Code, Database, Plug, Rocket } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { services } from "../data/services";
import type { ServiceId } from "../data/services";
import { usePreferences } from "../hooks/usePreferences";

const icons: Record<ServiceId, typeof Code> = { web: Code, backend: Database, integrations: Plug, deployment: Rocket };

export default function Services() {
  const { t } = usePreferences();

  return <>
    <div className="section-heading">
      <div>
        <span className="eyebrow">{t.services.eyebrow}</span>
        <h2 className="section-title">{t.services.title}</h2>
        <p className="secondary-text">{t.services.subtitle}</p>
      </div>
      <a href="#contacto" className="action-secondary">{t.services.cta}</a>
    </div>
    <div className="services-grid">
      {services.map((service) => {
        const Icon = icons[service.id];
        const copy = t.services.items[service.id];
        return <Card key={service.id}><CardContent className="service-card-body">
          <div className="service-icon"><Icon aria-hidden="true" size={21} /></div>
          <h3 className="service-title">{copy.title}</h3>
          <p className="secondary-text service-description">{copy.description}</p>
          <ul className="service-points">{copy.points.map((point) => <li key={point}><Check aria-hidden="true" size={16} />{point}</li>)}</ul>
          <ul className="service-chips" aria-label={`${t.projects.stack} — ${copy.title}`}>{service.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
        </CardContent></Card>;
      })}
    </div>
    <ol className="process-strip" aria-label={t.services.process}>
      {t.services.steps.map((step, index) => <li key={step.title}>
        <span className="process-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <div><h3>{step.title}</h3><p>{step.description}</p></div>
      </li>)}
    </ol>
  </>;
}
