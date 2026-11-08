import { useEffect, useState } from "react";
import { ArrowUpRight, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { profile } from "../data/profile";
import { usePreferences } from "../hooks/usePreferences";
import type { Translations } from "../i18n/es";

type Need = keyof Translations["contact"]["needs"];
const needs: readonly Need[] = ["web", "backend", "deployment", "job", "other"];

export default function Contact() {
  const { language, t } = usePreferences();
  const cv = profile.cv[language];
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [need, setNeed] = useState<Need | null>(null);
  const [status, setStatus] = useState<"" | keyof typeof t.contact.messages>("");

  useEffect(() => {
    if (status !== "opened") return;
    const timer = window.setTimeout(() => setStatus(""), 5000);
    return () => window.clearTimeout(timer);
  }, [status]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
    setStatus("");
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();
    if (!name || !email || !message) { setStatus("missing"); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus("email"); return; }
    const values = { name, email, message, need: need ? t.contact.whatsappNeed.replace("{need}", t.contact.needs[need]) : "" };
    const text = t.contact.whatsapp.replace(/\{(name|email|need|message)\}/g, (_: string, key: string) => values[key as keyof typeof values]);
    window.open(`https://wa.me/${profile.whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    setStatus("opened");
    setForm({ name: "", email: "", message: "" });
    setNeed(null);
  };

  const describedBy = status ? "contact-status" : undefined;
  return <div className="contact-layout">
    <div className="contact-intro">
      <span className="eyebrow">{t.contact.eyebrow}</span>
      <h2 className="section-title">{t.contact.title}</h2>
      <p className="secondary-text">{t.contact.intro}</p>
      <ul className="contact-cards">
        <li><a className="contact-card" href={`mailto:${profile.email}`}><span className="service-icon"><Mail aria-hidden="true" size={20} /></span><span className="contact-card-text"><small>{t.contact.emailLabel}</small>{profile.email}</span></a></li>
        <li><a className="contact-card" href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label={`${t.common.linkedin}: ${profile.name} (${t.common.newTab})`}><span className="service-icon"><Linkedin aria-hidden="true" size={20} /></span><span className="contact-card-text"><small>{t.contact.linkedinLabel}</small>{profile.name}</span><ArrowUpRight className="contact-card-arrow" aria-hidden="true" size={18} /></a></li>
        <li><a className="contact-card" href={profile.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${t.common.github}: @${profile.githubHandle} (${t.common.newTab})`}><span className="service-icon"><Github aria-hidden="true" size={20} /></span><span className="contact-card-text"><small>{t.contact.githubLabel}</small>@{profile.githubHandle}</span><ArrowUpRight className="contact-card-arrow" aria-hidden="true" size={18} /></a></li>
      </ul>
      <div className="contact-foot">
        <p><MapPin aria-hidden="true" size={16} />{t.contact.location}</p>
        <a href={cv.url} download={cv.fileName} className="action-secondary">{t.hero.cv}</a>
      </div>
    </div>
    <Card><CardContent className="p-6">
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        {status && <div id="contact-status" className="contact-status" data-error={status !== "opened"} role={status === "opened" ? "status" : "alert"}>{t.contact.messages[status]}</div>}
        <div><label htmlFor="name">{t.contact.name}</label><input id="name" name="name" autoComplete="name" required placeholder={t.contact.name} value={form.name} onChange={handleChange} aria-invalid={status === "missing" && !form.name.trim()} aria-describedby={describedBy} /></div>
        <div><label htmlFor="email">{t.contact.email}</label><input id="email" name="email" type="email" autoComplete="email" required placeholder={t.contact.email} value={form.email} onChange={handleChange} aria-invalid={status === "email" || (status === "missing" && !form.email.trim())} aria-describedby={describedBy} /></div>
        <div role="group" aria-labelledby="contact-need-label">
          <p id="contact-need-label" className="contact-need-label">{t.contact.need}</p>
          <div className="need-chips">{needs.map((id) => <button key={id} type="button" className="need-chip" aria-pressed={need === id} onClick={() => setNeed((current) => current === id ? null : id)}>{t.contact.needs[id]}</button>)}</div>
        </div>
        <div><label htmlFor="message">{t.contact.message}</label><textarea id="message" name="message" rows={6} required placeholder={t.contact.message} value={form.message} onChange={handleChange} aria-invalid={status === "missing" && !form.message.trim()} aria-describedby={describedBy} /></div>
        <button type="submit" className="action-primary w-full">{t.contact.send}</button>
      </form>
    </CardContent></Card>
  </div>;
}
