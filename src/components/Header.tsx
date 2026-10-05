import { useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { usePreferences } from "../hooks/usePreferences";
import { useMediaQuery } from "../hooks/useMediaQuery";
import LanguageToggle from "./ui/LanguageToggle";
import ThemeToggle from "./ui/ThemeToggle";
import MusicPlayer from "./ui/MusicPlayer";

export default function Header() {
  const { t } = usePreferences();
  const desktop = useMediaQuery("(min-width: 1280px)");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const nav = [ ["#inicio", t.nav.home], ["#sobre-mi", t.nav.about], ["#proyectos", t.nav.projects], ["#servicios", t.nav.services], ["#contacto", t.nav.contact] ];

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    observer.observe(target);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { if (open && !desktop) menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus(); }, [open, desktop]);
  useEffect(() => {
    if (!open || desktop) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setOpen(false); toggleRef.current?.focus(); }
    };
    const onOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onOutside);
    return () => { document.removeEventListener("keydown", onKeyDown); document.removeEventListener("pointerdown", onOutside); };
  }, [open, desktop]);
  useEffect(() => { if (desktop) setOpen(false); }, [desktop]);

  const close = () => { setOpen(false); toggleRef.current?.focus(); };
  const navigate = (href: string) => {
    setOpen(false);
    if (!desktop) {
      const target = document.querySelector<HTMLElement>(href);
      if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }); }
    }
  };
  return <>
    <div ref={sentinelRef} className="header-sentinel" aria-hidden="true" />
    <header ref={headerRef} className="site-header" data-scrolled={scrolled}>
      <div className="shell header-inner">
        <a href="#inicio" className="brand" onClick={() => setOpen(false)}><span className="brand-mark" aria-hidden="true">LR</span><span>ROSALESDEV928</span></a>
        <div ref={menuRef} id="navigation-panel" className="navigation-panel" data-open={open} inert={!desktop && !open}>
          <nav aria-label={t.nav.label}>
            {nav.map(([href, label]) => <a key={href} href={href} onClick={() => navigate(href)}>{label}</a>)}
          </nav>
          <div className="header-controls"><LanguageToggle /><ThemeToggle /><MusicPlayer /></div>
        </div>
        <a href="#contacto" className="action-primary header-contact" onClick={() => setOpen(false)}>{t.common.contact}<ArrowRight size={16} aria-hidden="true" /></a>
        <button ref={toggleRef} type="button" className="icon-button menu-toggle" aria-controls="navigation-panel" aria-expanded={open} aria-label={open ? t.nav.close : t.nav.open} title={open ? t.nav.close : t.nav.open} onClick={() => open ? close() : setOpen(true)}>{open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}</button>
      </div>
    </header>
  </>;
}
