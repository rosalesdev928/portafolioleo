// src/components/Hero.tsx
import { useCallback } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function Hero() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine); // build ligero
  }, []);

  return (
    <section id="inicio" className="relative overflow-hidden">
      {/* Fondo animado */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        className="absolute inset-0 -z-10"
        options={{
          background: { color: "#0a0f0e" },
          fpsLimit: 60,
          detectRetina: true,
          interactivity: {
            events: { onHover: { enable: true, mode: "repulse" }, resize: true },
            modes: { repulse: { distance: 120, duration: 0.4 } }
          },
          particles: {
            number: { value: 55, density: { enable: true, area: 900 } },
            color: { value: "#34d399" }, // emerald-400
            links: {
              enable: true, color: "#34d399", distance: 140, opacity: 0.35, width: 1
            },
            move: { enable: true, speed: 1.2, outModes: { default: "bounce" } },
            opacity: { value: 0.55 },
            size: { value: { min: 1, max: 3 } },
          },
        }}
      />

      <div className="mx-auto w-[min(1150px,92%)] grid md:grid-cols-[1.2fr_.8fr] gap-8 items-center pt-16 pb-10 relative z-10">
        {/* Texto del hero */}
        <div>
          <span className="inline-block text-xs tracking-[.18em] text-emerald-300/80 bg-emerald-900/30 border border-emerald-800 rounded-full px-3 py-1 mb-3">
            INGENIERO DE SISTEMAS • DESARROLLADOR JUNIOR FULL-STACK
          </span>
          <h1 className="text-[clamp(2.1rem,4vw+1rem,4rem)] leading-[1.05] font-bold">
            Hola, soy <span className="text-emerald-300">Leonardo Rosales</span>.
            <br /> Implemento aplicaciones web prácticas y escalables.
          </h1>
          <p className="max-w-prose mt-3 text-emerald-200/90">
            Me enfoco en back-end con Node.js/Express y MySQL; en el front creo interfaces rápidas y accesibles.
          </p>
          <div className="flex gap-3 mt-5 flex-wrap">
            <a
              href="#proyectos"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-b from-emerald-400 to-emerald-500 text-emerald-950 font-semibold px-4 py-2 shadow-[0_8px_24px_rgba(16,185,129,.35)]"
            >
              Ver proyectos
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-800 bg-emerald-950/30 text-emerald-100 hover:bg-emerald-900/50 px-4 py-2"
            >
              Contáctame
            </a>
          </div>
        </div>

        {/* Foto tipo “hero” */}
        <motion.div
          className="relative mx-auto w-full grid place-items-center"
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          whileHover={{ y: -4 }}
        >
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-[radial-gradient(800px_420px_at_70%_20%,rgba(16,185,129,0.12),transparent_60%)]" />
          <div className="rounded-[1.75rem] p-[6px] bg-gradient-to-b from-emerald-400/20 via-emerald-500/15 to-emerald-400/10 shadow-[0_20px_60px_-20px_rgba(16,185,129,.35)]">
            <div className="rounded-[1.45rem] bg-zinc-950/50 border border-emerald-900/60 backdrop-blur-sm">
              <img
                src="/fotos/leonard.png"  // usa tu PNG transparente aquí
                alt="Leonardo Rosales"
                className="block w-[320px] h-[420px] md:w-[360px] md:h-[480px] object-cover object-center rounded-[1.35rem] ring-1 ring-emerald-400/15 shadow-2xl"
              />
            </div>
          </div>
          <p className="mt-4 text-emerald-200/80 text-sm md:text-base">
            Disponible para oportunidades y proyectos freelance.
          </p>
        </motion.div>
      </div>

{/* Botón CV + Redes */}
<div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-6">
  {/* Descargar CV */}
  <a
    href="/cv/LeonardoRosalesCV.pdf"
    download
    className="px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-bold text-lg shadow-lg 
               transition-transform duration-300 hover:scale-110"
  >
    DESCARGAR CV
  </a>

  {/* Redes */}
  <div className="flex gap-5">
    <a
      href="mailto:leonardo1234rag@gmail.com"
      className="w-14 h-14 grid place-items-center rounded-full bg-emerald-900/40 border border-emerald-700 
                 hover:bg-emerald-700/50 transition-transform duration-300 hover:scale-125"
    >
      <Mail className="w-7 h-7 text-emerald-300" />
    </a>
    <a
      href="https://github.com/rosalesdev928"
      target="_blank"
      rel="noreferrer"
      className="w-14 h-14 grid place-items-center rounded-full bg-emerald-900/40 border border-emerald-700 
                 hover:bg-emerald-700/50 transition-transform duration-300 hover:scale-125"
    >
      <Github className="w-7 h-7 text-emerald-300" />
    </a>
    <a
      href="https://www.linkedin.com/in/jose-leonardo-rosales-gutierrez-867b901b6/"
      target="_blank"
      rel="noreferrer"
      className="w-14 h-14 grid place-items-center rounded-full bg-emerald-900/40 border border-emerald-700 
                 hover:bg-emerald-700/50 transition-transform duration-300 hover:scale-125"
    >
      <Linkedin className="w-7 h-7 text-emerald-300" />
    </a>
  </div>
</div>
{/* Carrusel de Tecnologías con fondo */}
<div className="mt-12 px-6">
  <div className="bg-emerald-900/20 rounded-xl py-8 shadow-lg">
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 2000, disableOnInteraction: false }}
      loop
      spaceBetween={40}
      slidesPerView={2}
      breakpoints={{
        640: { slidesPerView: 3 },
        1024: { slidesPerView: 5 },
      }}
      className="flex items-center"
    >
      <SwiperSlide className="flex justify-center">
        <img src="/logos/nodejs.png" alt="Node.js" 
             className="h-20 object-contain transition-transform duration-300 hover:scale-125" />
      </SwiperSlide>
      <SwiperSlide className="flex justify-center">
        <img src="/logos/react.png" alt="React" 
             className="h-20 object-contain transition-transform duration-300 hover:scale-125" />
      </SwiperSlide>
      <SwiperSlide className="flex justify-center">
        <img src="/logos/php.png" alt="PHP" 
             className="h-20 object-contain transition-transform duration-300 hover:scale-125" />
      </SwiperSlide>
      <SwiperSlide className="flex justify-center">
        <img src="/logos/laravel.png" alt="Laravel" 
             className="h-20 object-contain transition-transform duration-300 hover:scale-125" />
      </SwiperSlide>
      <SwiperSlide className="flex justify-center">
        <img src="/logos/sqlserver.png" alt="SQL Server" 
             className="h-20 object-contain transition-transform duration-300 hover:scale-125" />
      </SwiperSlide>
      <SwiperSlide className="flex justify-center">
        <img src="/logos/mongodb.png" alt="MongoDB" 
             className="h-20 object-contain transition-transform duration-300 hover:scale-125" />
      </SwiperSlide>
      <SwiperSlide className="flex justify-center">
        <img src="/logos/docker.png" alt="Docker" 
             className="h-20 object-contain transition-transform duration-300 hover:scale-125" />
      </SwiperSlide>
      <SwiperSlide className="flex justify-center">
        <img src="/logos/microsoftazure.png" alt="Microsoft Azure" 
             className="h-20 object-contain transition-transform duration-300 hover:scale-125" />
      </SwiperSlide>
    </Swiper>
  </div>
</div>

    </section>
  );
}
