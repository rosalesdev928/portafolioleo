import type { Translations } from "./es";

export const en: Translations = {
  seo: { title: "Leonardo Rosales | Backend Developer", description: "Portfolio of Leonardo Rosales, backend developer focused on APIs, databases and cloud solutions." },
  common: { contact: "Contact me", close: "Close", email: "Email", demo: "Demo", newTab: "opens in a new tab", skip: "Skip to content", emailLink: "Email Leonardo Rosales", github: "GitHub profile", linkedin: "LinkedIn profile" },
  nav: { home: "Home", about: "About", projects: "Projects", services: "Services", contact: "Contact", label: "Main navigation", open: "Open menu", close: "Close menu" },
  preferences: { language: "Language", spanish: "Español", english: "English", light: "Switch to light theme", dark: "Switch to dark theme" },
  music: { play: "Play music", pause: "Pause music", unavailable: "Music coming soon", checking: "Checking music availability", volume: "Music volume" },
  hero: { eyebrow: "SYSTEMS ENGINEER · JUNIOR FULL-STACK DEVELOPER", greeting: "Hi, I'm", headline: "I build practical, scalable web applications.", description: "I focus on back-end development with Node.js/Express and MySQL, and build fast, accessible front-end interfaces.", projects: "View projects", available: "Available for opportunities and freelance projects.", cv: "Download CV", technologies: "Technologies", pauseTechnologies: "Pause technology carousel", resumeTechnologies: "Resume technology carousel" },
  about: {
    title: "About me", description: "I'm a junior full-stack developer based in Lima. I enjoy building clear, fast and secure applications, working with JavaScript/Node and MySQL databases. I also have experience taking projects end-to-end: from data modeling, APIs and authentication to deployment.", available: "I'm currently looking for opportunities to contribute real value.",
    practices: ["⚙️ 2+ years practicing web development", "🗄️ CRUDs, JWT authentication, file uploads", "🚀 Deployment on Vercel/Render and GitHub Pages", "✅ Good practices: MVC, basic SOLID"],
  },
  projects: {
    title: "Recent Projects", subtitle: "Real projects, from data and APIs to the user experience.", featured: "Featured Project", stack: "Project Stack", repository: "Repository", liveDemo: "Live Demo", visit: "View project", fallback: "PORTFOLIO / DEVELOPMENT", image: "Screenshot of {title}", carousel: "carousel", slideRole: "slide", previous: "Previous projects", next: "Next projects", first: "First project", last: "Last project", slide: "Project {{index}} of {{slidesLength}}", goTo: "Go to group {index} of {total}", position: "Group {index} of {total}", pagination: "Carousel position",
    items: {
      checabien: { description: "Peruvian electoral information platform. Backend development focused on candidate data, electoral modeling, migrations, territories and processing official information.", role: "Backend Developer", context: "", imageAlt: "ChecaBien platform - candidate search", extra: "" },
      radar: { description: "Live map of real emergencies in metropolitan Lima, built for The Realtime Hackathon by Portal. Integrates proximity alerts, community threads and AI analysis to compare residents' reports with the official incident report.", role: "Full Stack / Realtime", context: "The Realtime Hackathon by Portal · 2026", imageAlt: "Radar - live emergency map of metropolitan Lima", extra: "" },
      boticlic: { description: "Pharmacy e-commerce platform for product, order, prescription and delivery management. Includes JWT authentication and dedicated dashboards for customers, administrators, pharmacists and delivery staff.", role: "", context: "", imageAlt: "BotiClic - pharmacy e-commerce platform", extra: "Layered REST backend with role-based security and MySQL persistence." },
      "sistema-farmacia": { description: "Inventory, sales and user management. Node.js + MySQL.", role: "", context: "", imageAlt: "Sistema de Farmacia - inventory and sales management", extra: "" },
      calificaciones: { description: "Web-based grade, student and subject management.", role: "", context: "", imageAlt: "Sistema de Calificaciones - student and subject management", extra: "" },
      "ey-fit-pack": { description: "Full-stack application, Minimal API, CRUD, Swagger, CORS", role: "", context: "", imageAlt: "Ey-Fit-Pack - client-server application", extra: "" },
    },
  },
  services: { title: "Services", web: { title: "Web development", description: "Custom applications (frontend + backend), including deployment." }, api: { title: "API integrations", description: "REST API design, integration and documentation." }, automation: { title: "Automation", description: "Jobs and scripts that save time in everyday processes." } },
  contact: { title: "Contact", name: "Name", email: "Email", message: "How can I help you?", send: "Send message", talk: "Let's talk", emailLabel: "Email", githubLabel: "GitHub", publish: "I can also help you publish your site on GitHub Pages or Vercel.", messages: { missing: "Complete all 3 fields before sending.", email: "Invalid email. Example: name@gmail.com", opened: "Opening WhatsApp. Confirm your message there.", blocked: "Could not open WhatsApp. Allow pop-ups and try again." }, whatsapp: "Hi Leonardo, I'm {name}.\nEmail: {email}\nMessage: {message}" },
  assistant: {
    title: "Leonardo's assistant", launcher: "Ask me about Leonardo!", close: "Close assistant",
    welcome: "Hi. I can tell you about Leonardo, his projects and experience.",
    typing: "Typing...", suggestions: "Suggested questions", more: "More questions", less: "Fewer questions",
    input: "Your question", placeholder: "Ask about his projects or experience…", send: "Send question",
    conversation: "Conversation with the assistant", you: "You", source: "Information from Leonardo's portfolio.",
    fallback: "I can tell you about Leonardo's projects, technologies, backend experience and contact options. Try one of the suggested questions.",
    assetError: "The character could not be loaded. Open Leonardo's assistant.",
    questions: {
      checabien: "What did Leonardo do at ChecaBien?", radar: "Tell me about Radar",
      technologies: "What technologies does he use?", backend: "What backend experience does he have?",
      featured: "Show featured projects", contact: "How can I contact Leonardo?", boticlic: "Tell me about BotiClic",
    },
    keywords: {
      checabien: ["checabien", "checa bien"], radar: ["radar"], boticlic: ["boticlic", "boticlick"],
      backend: ["backend", "back end", "experience", "apis", "api", "authentication"],
      technologies: ["technology", "technologies", "stack", "language", "languages", "java", "typescript", "react", "mysql", "aws", "tools"],
      featured: ["project", "projects", "featured", "portfolio", "showcase"],
      contact: ["contact", "email", "whatsapp", "linkedin", "hire", "hiring", "reach", "talk"],
    },
  },
  footer: "Leonardo Rosales — Lima 💚",
};
