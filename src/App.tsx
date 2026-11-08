import { lazy, Suspense, useState } from "react";
import type { ReactNode } from "react";
import { Card, CardContent } from "./components/ui/card";
import Hero from "./components/Hero";
import Header from "./components/Header";
import Preloader from "./components/Preloader";
import DemoDialog from "./components/DemoDialog";
import type { VideoDemo } from "./components/DemoDialog";
import ProjectsCarousel from "./components/projects/ProjectsCarousel";
import Services from "./components/Services";
import Contact from "./components/Contact";
import { projects } from "./data/projects";
import { usePreferences } from "./hooks/usePreferences";

const PortfolioAssistant = lazy(() => import("./components/assistant/PortfolioAssistant"));

function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="section-title">{children}</h2>;
}
function Shell({ children, id }: { children: ReactNode; id: string }) {
  return <section id={id} className="page-section"><div className="shell">{children}</div></section>;
}

export default function App() {
  const { t } = usePreferences();
  const year = new Date().getFullYear();
  const [video, setVideo] = useState<VideoDemo | null>(null);

  return <div className="app">
    <a className="skip-link" href="#main-content">{t.common.skip}</a>
    <Preloader />
    <Header />
    <main id="main-content" tabIndex={-1}>
      <Hero />
      <Shell id="sobre-mi">
        <SectionTitle>{t.about.title}</SectionTitle>
        <div className="grid md:grid-cols-2 gap-5">
          <Card><CardContent><p className="body-copy">{t.about.description}</p><p className="secondary-text mt-3">{t.about.available}</p></CardContent></Card>
          <Card><CardContent><ul className="about-practices">{t.about.practices.map((practice) => <li key={practice}>{practice}</li>)}</ul></CardContent></Card>
        </div>
      </Shell>
      <Shell id="proyectos">
        <ProjectsCarousel projects={projects} onVideo={(url, title) => setVideo({ url, title })} />
      </Shell>
      <Shell id="servicios"><Services /></Shell>
      <Shell id="contacto"><Contact /></Shell>
    </main>
    <footer className="site-footer"><div className="shell">© {year} {t.footer}</div></footer>
    <DemoDialog video={video} onClose={() => setVideo(null)} />
    <Suspense fallback={null}><PortfolioAssistant /></Suspense>
  </div>;
}
