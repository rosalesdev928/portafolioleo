import { lazy, Suspense, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Code, Server, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "./components/ui/card";
import Hero from "./components/Hero";
import Header from "./components/Header";
import Preloader from "./components/Preloader";
import DemoDialog from "./components/DemoDialog";
import type { VideoDemo } from "./components/DemoDialog";
import ProjectsCarousel from "./components/projects/ProjectsCarousel";
import { projects } from "./data/projects";
import { profile } from "./data/profile";
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
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactStatus, setContactStatus] = useState<"" | keyof typeof t.contact.messages>("");
  const services = [
    { icon: Code, ...t.services.web },
    { icon: Server, ...t.services.api },
    { icon: ShieldCheck, ...t.services.automation },
  ];

  useEffect(() => {
    if (contactStatus !== "opened") return;
    const timer = window.setTimeout(() => setContactStatus(""), 5000);
    return () => window.clearTimeout(timer);
  }, [contactStatus]);

  const handleContactChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setContactForm((previous) => ({ ...previous, [name]: value }));
    setContactStatus("");
  };
  const handleContactSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const name = contactForm.name.trim();
    const email = contactForm.email.trim();
    const message = contactForm.message.trim();
    if (!name || !email || !message) { setContactStatus("missing"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setContactStatus("email"); return; }
    const values = { name, email, message };
    const text = t.contact.whatsapp.replace(/\{(name|email|message)\}/g, (_: string, key: string) => values[key as keyof typeof values]);
    window.open(`https://wa.me/${profile.whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    setContactStatus("opened");
    setContactForm({ name: "", email: "", message: "" });
  };

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
      <Shell id="servicios">
        <SectionTitle>{t.services.title}</SectionTitle>
        <div className="grid md:grid-cols-3 gap-5">
          {services.map((service) => <Card key={service.title}><CardContent><div className="service-icon"><service.icon aria-hidden="true" size={21} /></div><h3 className="service-title">{service.title}</h3><p className="secondary-text mt-2">{service.description}</p></CardContent></Card>)}
        </div>
      </Shell>
      <Shell id="contacto">
        <SectionTitle>{t.contact.title}</SectionTitle>
        <div className="grid gap-6 md:grid-cols-2">
          <Card><CardContent className="p-6">
            <form className="contact-form" onSubmit={handleContactSubmit} noValidate>
              {contactStatus && <div id="contact-status" className="contact-status" data-error={contactStatus !== "opened"} role={contactStatus === "opened" ? "status" : "alert"}>{t.contact.messages[contactStatus]}</div>}
              <div><label htmlFor="name">{t.contact.name}</label><input id="name" name="name" autoComplete="name" required placeholder={t.contact.name} value={contactForm.name} onChange={handleContactChange} aria-invalid={contactStatus === "missing" && !contactForm.name.trim()} aria-describedby={contactStatus ? "contact-status" : undefined} /></div>
              <div><label htmlFor="email">{t.contact.email}</label><input id="email" name="email" type="email" autoComplete="email" required placeholder={t.contact.email} value={contactForm.email} onChange={handleContactChange} aria-invalid={contactStatus === "email" || (contactStatus === "missing" && !contactForm.email.trim())} aria-describedby={contactStatus ? "contact-status" : undefined} /></div>
              <div><label htmlFor="message">{t.contact.message}</label><textarea id="message" name="message" rows={6} required placeholder={t.contact.message} value={contactForm.message} onChange={handleContactChange} aria-invalid={contactStatus === "missing" && !contactForm.message.trim()} aria-describedby={contactStatus ? "contact-status" : undefined} /></div>
              <button type="submit" className="action-primary w-full">{t.contact.send}</button>
            </form>
          </CardContent></Card>
          <Card><CardContent className="p-6"><h3 className="contact-heading">{t.contact.talk}</h3><ul className="contact-links">
            <li><strong>{t.contact.emailLabel}:</strong><a href={`mailto:${profile.email}`}>{profile.email}</a></li>
            <li><strong>{t.contact.githubLabel}:</strong><a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${t.common.github} (${t.common.newTab})`}>@{profile.githubHandle}</a></li>
          </ul><p className="secondary-text mt-6">{t.contact.publish}</p></CardContent></Card>
        </div>
      </Shell>
    </main>
    <footer className="site-footer"><div className="shell">© {year} {t.footer}</div></footer>
    <DemoDialog video={video} onClose={() => setVideo(null)} />
    <Suspense fallback={null}><PortfolioAssistant /></Suspense>
  </div>;
}
