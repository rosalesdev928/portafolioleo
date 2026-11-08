// Titles, descriptions and points live in i18n; this keeps order and stack.
export const services = [
  { id: "web", technologies: ["React", "Next.js", "TypeScript"] },
  { id: "backend", technologies: ["NestJS", "Spring Boot", "MySQL"] },
  { id: "integrations", technologies: ["REST", "OpenAPI", "FastAPI"] },
  { id: "deployment", technologies: ["AWS", "GitHub Actions", "Docker"] },
] as const;

export type ServiceId = (typeof services)[number]["id"];
