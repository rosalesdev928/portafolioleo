import { es } from "../i18n/es";

export type ProjectId = keyof typeof es.projects.items;

export interface Project {
  id: ProjectId;
  title: string;
  description: string;
  extra?: string;
  role?: string;
  context?: string;
  technologies: readonly string[];
  technologyHighlights?: readonly string[];
  image?: string;
  imageAlt?: string;
  liveUrl?: string;
  liveAction?: "project" | "demo";
  repoUrl?: string;
  videoUrl?: string;
  featured?: boolean;
  // Future case studies can use this without expanding the cards.
  detailsUrl?: string;
}

// Keep the three featured projects first, in this order.
export const projects: readonly Project[] = [
  {
    id: "checabien",
    title: "ChecaBien",
    role: "Backend Developer",
    description: es.projects.items.checabien.description,
    technologies: ["NestJS", "TypeScript", "Node.js", "TypeORM", "MySQL", "Redis", "BullMQ", "Puppeteer", "AWS", "Amazon EC2", "Amazon RDS", "Amazon S3"],
    technologyHighlights: ["NestJS", "TypeScript", "TypeORM", "MySQL", "AWS", "Amazon EC2", "Amazon RDS", "Amazon S3"],
    image: "/fotos/CHECABIEN.jpeg",
    imageAlt: es.projects.items.checabien.imageAlt,
    liveUrl: "https://checabien.com/regionales-2026?departamento=15&provincia=1501&ubicacion=ejemplo",
    liveAction: "demo",
    featured: true,
  },
  {
    id: "radar",
    title: "Radar",
    role: "Full Stack / Realtime",
    description: es.projects.items.radar.description,
    context: "The Realtime Hackathon by Portal · 2026",
    technologies: ["React", "TypeScript", "Node.js", "Express", "Leaflet", "Portal SDK", "Anthropic API", "Vercel", "Render", "Vite", "Tailwind CSS"],
    repoUrl: "https://github.com/rosalesdev928/radar",
    liveUrl: "https://radar-lovat-ten.vercel.app",
    liveAction: "demo",
    image: "/fotos/RADAR (3).jpeg",
    imageAlt: es.projects.items.radar.imageAlt,
    featured: true,
  },
  {
    id: "boticlic",
    title: "BotiClic — Farmacia Online",
    description: es.projects.items.boticlic.description,
    extra: es.projects.items.boticlic.extra,
    technologies: ["Java 21", "Spring Boot", "Spring Security", "JWT", "Hibernate", "JPA", "Maven", "MySQL 8", "HTML5", "CSS3", "JavaScript", "SMTP", "Carga de archivos"],
    technologyHighlights: ["Java 21", "Spring Boot", "Spring Security", "JWT", "JPA", "Hibernate", "MySQL 8", "JavaScript"],
    repoUrl: "https://github.com/rosalesdev928/boticlic",
    image: "/fotos/BOTICLIC.jpeg",
    imageAlt: es.projects.items.boticlic.imageAlt,
    featured: true,
  },
  {
    id: "sistema-farmacia",
    title: "Sistema de Farmacia",
    description: es.projects.items["sistema-farmacia"].description,
    technologies: ["Node", "Express", "MySQL"],
    repoUrl: "https://github.com/rosalesdev928/sistema-farmacia",
    videoUrl: "https://www.youtube.com/embed/-G3Ar0n8VOk",
    image: "/fotos/DEMOSISTEMAFARMACIA.png",
    imageAlt: es.projects.items["sistema-farmacia"].imageAlt,
  },
  {
    id: "calificaciones",
    title: "Sistema de Calificaciones de estudiantes y materias",
    description: es.projects.items.calificaciones.description,
    technologies: ["PHP", "MySQL", "Bootstrap"],
    repoUrl: "https://github.com/rosalesdev928/resultados-estudiantes",
    videoUrl: "https://www.youtube.com/embed/BJ4aX83eKvY",
    image: "/fotos/CALIFICACIONES.png",
    imageAlt: es.projects.items.calificaciones.imageAlt,
  },
  {
    id: "ey-fit-pack",
    title: "Ey-Fit-Pack: CLIENTE-SERVIDOR",
    description: es.projects.items["ey-fit-pack"].description,
    technologies: [".NET 8", "EF Core", "React", "Vite", "CI/CD"],
    repoUrl: "https://github.com/rosalesdev928/ey-fit-pack",
    videoUrl: "https://www.youtube.com/embed/CI2ry7RA2jE",
    image: "/fotos/APIPRO.png",
    imageAlt: es.projects.items["ey-fit-pack"].imageAlt,
  },
];
