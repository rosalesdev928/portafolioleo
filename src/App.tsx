import { useMemo, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Github, Linkedin, Mail, ArrowRight, Code, Server, ShieldCheck, Link } from "lucide-react";
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button";
import Hero from "./components/Hero";
import Preloader from "./components/Preloader";



const nav = [
  { href: "#inicio", label: "Inicio" },
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#servicios", label: "Servicios" },
  { href: "#contacto", label: "Contacto" },
];

const skills = ["Node.js", "Express", "MySQL", "HTML/CSS", "Git/GitHub", "Postman", "JWT", "MVC", "React/Vite", "TypeScript"];

const projects = [
  { title: "Sistema de Farmacia", desc: "Inventario, ventas y usuarios. Node.js + MySQL.", tags: ["Node", "Express", "MySQL"], link: "https://github.com/rosalesdev928/sistema-farmacia"},
  { title: "Gestión de Clientes", desc: "CRUD con filtros, paginación y exportaciones.", tags: ["Node", "EJS", "Bootstrap"] },
  { title: "API de Productos", desc: "API JSON con auth JWT y roles.", tags: ["Express", "JWT", "Pruebas"] },
];

const services = [
  { icon: Code, title: "Desarrollo web", desc: "Aplicaciones a medida (frontend + backend) con despliegue." },
  { icon: Server, title: "Integraciones API", desc: "Diseño, consumo y documentación de APIs REST." },
  { icon: ShieldCheck, title: "Automatización", desc: "Jobs y scripts que ahorran tiempo en procesos." },
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[1.7rem] font-semibold tracking-tight mb-6 text-emerald-200">{children}</h2>;
}
function Shell({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <section id={id} className="border-t border-emerald-900/40 py-16">
      <div className="mx-auto w-[min(1150px,92%)]">{children}</div>
    </section>
  );
}

export default function App() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, 40]);
  const year = useMemo(() => new Date().getFullYear(), []);
  // ⬅️ 1) control del preloader (cuándo “termina” tu app)
  const [ready, setReady] = useState(false);
  useEffect(() => {
    // simula carga de datos/imagenes; reemplaza por tu lógica real si quieres
    const t = setTimeout(() => setReady(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen text-emerald-50 bg-[radial-gradient(1000px_700px_at_80%_-10%,#0f261e_0%,transparent_60%),#0a0f0e]">
      {/* 2) y 3) Preloader: más tiempo, verde y fondo blanco */}
      <div style={{ ["--preloader-bg" as any]: "#ffffff" }}>
        <Preloader
          done={ready}
          minDuration={2400}  // ⬅️ dura más (3.6s visible mínimo)
          color="#22c55e"     // ⬅️ verde (emerald-500)
          size={92}           // ⬅️ un poco más grande
          text="LR"
        />
      </div>
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-emerald-900/40 backdrop-blur bg-black/40">
        <div className="mx-auto w-[min(1150px,92%)] flex items-center justify-between py-3">
          <a href="#inicio" className="flex items-center gap-2 font-semibold">
            <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-300 shadow-[0_8px_24px_rgba(16,185,129,.45)]" />
            <span>ROSALESDEV928</span>
          </a>
          <nav className="hidden md:flex gap-5 text-emerald-200/80">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="hover:text-emerald-100">
                {n.label}
              </a>
            ))}
          </nav>
          <a
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-emerald-400 to-emerald-500 text-emerald-950 font-semibold px-4 py-2 shadow-[0_8px_24px_rgba(16,185,129,.35)]"
            href="#contacto"
          >
            Contáctame <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </header>
      {/* Hero */}
    <Hero />
      {/* Sobre mí */}
      <Shell id="sobre-mi">
        <SectionTitle>Sobre mí</SectionTitle>
        <div className="grid md:grid-cols-2 gap-5">
          <Card><CardContent>
            <p>Soy desarrollador junior full‑stack con base en Lima. Me gusta construir aplicaciones claras, rápidas y seguras. Disfruto trabajar con <strong>JavaScript/Node</strong> y bases de datos <strong>MySQL</strong>. También tengo experiencia llevando proyectos end‑to‑end: desde el modelado de datos, APIs y autenticación hasta el despliegue.</p>
            <p className="text-emerald-200/80 mt-3">Actualmente busco oportunidades donde aportar valor real.</p>
          </CardContent></Card>
          <Card><CardContent>
            <ul className="space-y-2 list-disc list-inside text-emerald-200/90">
              <li>⚙️ 2+ años practicando desarrollo web</li>
              <li>🗄️ CRUDs, auth JWT, subida de archivos</li>
              <li>🚀 Deploy en Vercel/Render y GitHub Pages</li>
              <li>✅ Buenas prácticas: MVC, SOLID básico</li>
              </ul>
          </CardContent></Card>
        </div>
      </Shell>

      {/* Proyectos */}
      <Shell id="proyectos">
        <SectionTitle>Proyectos recientes</SectionTitle>
        <div className="grid md:grid-cols-3 gap-5">
          {projects.map((p) => (
            <Card key={p.title} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="h-44 grid place-items-center bg-gradient-to-br from-emerald-950 to-emerald-900 text-emerald-200 font-semibold tracking-wide">
                  {p.title}
                </div>
                <div className="p-5">
                  <p className="text-emerald-100/90">{p.desc}</p>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {p.tags.map((t) => (
                      <span key={t} className="text-xs px-2 py-1 rounded-full border border-emerald-900 bg-emerald-950/40">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Shell>

      {/* Servicios */}
      <Shell id="servicios">
        <SectionTitle>Servicios</SectionTitle>
        <div className="grid md:grid-cols-3 gap-5">
          {services.map((s) => (
            <Card key={s.title}>
              <CardContent>
                <div className="w-10 h-10 grid place-items-center rounded-xl bg-emerald-900/40 border border-emerald-800 text-emerald-200">
                  <s.icon className="w-5 h-5" />
                </div>
                <h3 className="mt-3 font-semibold text-emerald-100">{s.title}</h3>
                <p className="text-emerald-200/80 mt-1">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Shell>

  {/* Contacto */}
<Shell id="contacto">
  <SectionTitle>Contacto</SectionTitle>

  <div className="grid gap-6 md:grid-cols-2">
    {/* Izquierda: Formulario */}
    <Card className="bg-zinc-950/40 border-emerald-700/20">
      <CardContent className="p-6">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            // TODO: manejar envío (email service / endpoint)
          }}
        >
          <div>
            <label htmlFor="name" className="sr-only">Nombre</label>
            <input
              id="name"
              type="text"
              placeholder="Nombre"
              className="w-full rounded-xl bg-zinc-900/70 border border-emerald-700/20 px-4 py-3 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/60"
            />
          </div>

          <div>
            <label htmlFor="email" className="sr-only">Correo</label>
            <input
              id="email"
              type="email"
              placeholder="Correo"
              className="w-full rounded-xl bg-zinc-900/70 border border-emerald-700/20 px-4 py-3 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/60"
            />
          </div>

          <div>
            <label htmlFor="message" className="sr-only">¿Cómo puedo ayudarte?</label>
            <textarea
              id="message"
              rows={6}
              placeholder="¿Cómo puedo ayudarte?"
              className="w-full rounded-xl bg-zinc-900/70 border border-emerald-700/20 px-4 py-3 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/60 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl px-4 py-3 font-medium text-zinc-900 bg-emerald-500 hover:bg-emerald-400 transition-colors shadow-[0_0_0_1px_rgba(16,185,129,.25)]"
          >
            Enviar mensaje
          </button>
        </form>
      </CardContent>
    </Card>

  {/* Derecha: Panel info */}
<Card className="bg-zinc-950/40 border-emerald-700/20">
  <CardContent className="p-6">
    <h3 className="text-xl font-bold text-zinc-100 mb-4">¿Hablamos?</h3>

    <ul className="space-y-3 text-zinc-300">
      <li className="flex items-center gap-3">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
        <span className="font-bold">Email:</span>
        <a
          href="mailto:leonardo1234arg@gmail.com"
          className="font-semibold underline decoration-emerald-700/60 hover:decoration-emerald-500"
        >
          leonardo1234arg@gmail.com
        </a>
      </li>

      <li className="flex items-center gap-3">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
        <span className="font-bold">GitHub:</span>
        <a
          href="https://github.com/rosalesdev928"
          target="_blank"
          rel="noreferrer"
          className="font-semibold underline decoration-emerald-700/60 hover:decoration-emerald-500"
        >
          @rosalesdev928
        </a>
      </li>
    </ul>

    <p className="mt-6 text-zinc-400 leading-relaxed font-semibold">
      También puedo ayudarte a publicar tu sitio en{" "}
      <span className="font-bold text-zinc-200">GitHub Pages</span> o{" "}
      <span className="font-bold text-zinc-200">Vercel</span>.
    </p>
  </CardContent>
</Card>

  </div>
</Shell>


      <footer className="border-t border-emerald-900/40 py-6 text-sm text-emerald-200/80">
        <div className="mx-auto w-[min(1150px,92%)]">© {year} Leonardo Rosales — Lima 💚</div>
      </footer>
    </div>
  );
}
