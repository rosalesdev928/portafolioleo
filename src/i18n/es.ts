export const es = {
  seo: {
    title: "Leonardo Rosales | Backend Developer",
    description: "Portafolio de Leonardo Rosales, desarrollador backend especializado en APIs, bases de datos y soluciones cloud.",
  },
  common: {
    contact: "Contáctame", close: "Cerrar", email: "Correo", demo: "Demo",
    newTab: "se abre en una nueva pestaña", skip: "Saltar al contenido",
    emailLink: "Enviar correo a Leonardo Rosales", github: "Perfil de GitHub", linkedin: "Perfil de LinkedIn",
  },
  nav: { home: "Inicio", about: "Sobre mí", projects: "Proyectos", services: "Servicios", contact: "Contacto", label: "Navegación principal", open: "Abrir menú", close: "Cerrar menú" },
  preferences: { language: "Idioma", spanish: "Español", english: "English", light: "Activar tema claro", dark: "Activar tema oscuro" },
  music: { play: "Reproducir música", pause: "Pausar música", unavailable: "Música disponible próximamente", checking: "Comprobando disponibilidad de música", volume: "Volumen de la música" },
  hero: {
    eyebrow: "INGENIERO DE SISTEMAS · DESARROLLADOR JUNIOR FULL-STACK",
    greeting: "Hola, soy", headline: "Implemento aplicaciones web prácticas y escalables.",
    description: "Me enfoco en back-end con Node.js/Express y MySQL; en el front creo interfaces rápidas y accesibles.",
    projects: "Ver proyectos", available: "Disponible para oportunidades y proyectos freelance.",
    cv: "Descargar CV", technologies: "Tecnologías", pauseTechnologies: "Pausar carrusel de tecnologías", resumeTechnologies: "Reanudar carrusel de tecnologías",
  },
  about: {
    title: "Sobre mí",
    description: "Soy desarrollador junior full-stack con base en Lima. Me gusta construir aplicaciones claras, rápidas y seguras. Disfruto trabajar con JavaScript/Node y bases de datos MySQL. También tengo experiencia llevando proyectos end-to-end: desde el modelado de datos, APIs y autenticación hasta el despliegue.",
    available: "Actualmente busco oportunidades donde aportar valor real.",
    practices: ["⚙️ 2+ años practicando desarrollo web", "🗄️ CRUDs, auth JWT, subida de archivos", "🚀 Deploy en Vercel/Render y GitHub Pages", "✅ Buenas prácticas: MVC, SOLID básico"],
  },
  projects: {
    title: "Proyectos recientes", subtitle: "Proyectos reales, desde los datos y las APIs hasta la experiencia de usuario.",
    featured: "Proyecto destacado", stack: "Stack del proyecto", repository: "Repositorio", liveDemo: "Ver demo", visit: "Ver proyecto",
    fallback: "PORTAFOLIO / DESARROLLO", image: "Captura del proyecto {title}",
    carousel: "carrusel", slideRole: "diapositiva", previous: "Proyectos anteriores", next: "Proyectos siguientes", first: "Primer proyecto", last: "Último proyecto", slide: "Proyecto {{index}} de {{slidesLength}}", goTo: "Ir al grupo {index} de {total}", position: "Grupo {index} de {total}", pagination: "Posición del carrusel",
    items: {
      checabien: { description: "Plataforma de información electoral del Perú. Desarrollo backend orientado a datos de candidatos, modelado electoral, migraciones, territorios y procesamiento de información oficial.", role: "Backend Developer", context: "", imageAlt: "Plataforma ChecaBien - consulta de candidatos", extra: "" },
      radar: { description: "Mapa en vivo de emergencias reales de Lima Metropolitana, construido para The Realtime Hackathon by Portal. Integra alertas por cercanía, hilos ciudadanos y análisis con IA para contrastar reportes de vecinos con el parte oficial.", role: "Full Stack / Realtime", context: "The Realtime Hackathon by Portal · 2026", imageAlt: "Radar - mapa en vivo de emergencias de Lima Metropolitana", extra: "" },
      boticlic: { description: "Plataforma e-commerce para farmacia con gestión de productos, pedidos, recetas médicas y delivery. Incluye autenticación JWT y paneles diferenciados para clientes, administradores, farmacéuticos y repartidores.", role: "", context: "", imageAlt: "BotiClic - plataforma e-commerce de farmacia", extra: "Backend REST con arquitectura en capas, seguridad por roles y persistencia en MySQL." },
      "sistema-farmacia": { description: "Inventario, ventas y usuarios. Node.js + MySQL.", role: "", context: "", imageAlt: "Sistema de Farmacia - gestión de inventario y ventas", extra: "" },
      calificaciones: { description: "Gestión de calificaciones web, estudiantes y materias.", role: "", context: "", imageAlt: "Sistema de Calificaciones - gestión de estudiantes y materias", extra: "" },
      "ey-fit-pack": { description: "Aplicación fullstack, Minimal API, CRUD, Swagger, CORS", role: "", context: "", imageAlt: "Ey-Fit-Pack - aplicación cliente-servidor", extra: "" },
    },
  },
  services: { title: "Servicios", web: { title: "Desarrollo web", description: "Aplicaciones a medida (frontend + backend) con despliegue." }, api: { title: "Integraciones API", description: "Diseño, consumo y documentación de APIs REST." }, automation: { title: "Automatización", description: "Jobs y scripts que ahorran tiempo en procesos." } },
  contact: {
    title: "Contacto", name: "Nombre", email: "Correo", message: "¿Cómo puedo ayudarte?", send: "Enviar mensaje", talk: "¿Hablamos?", emailLabel: "Email", githubLabel: "GitHub",
    publish: "También puedo ayudarte a publicar tu sitio en GitHub Pages o Vercel.",
    messages: { missing: "Completa los 3 campos antes de enviar.", email: "Correo inválido. Ejemplo: nombre@gmail.com", opened: "Abriendo WhatsApp. Confirma el envío allí.", blocked: "No se pudo abrir WhatsApp. Permite ventanas emergentes e inténtalo de nuevo." },
    whatsapp: "Hola Leonardo, soy {name}.\nEmail: {email}\nMensaje: {message}",
  },
  assistant: {
    title: "Asistente de Leonardo", launcher: "¡Pregúntame sobre Leonardo!", close: "Cerrar asistente",
    welcome: "Hola. Puedo contarte sobre Leonardo, sus proyectos y experiencia.",
    typing: "Escribiendo...", suggestions: "Preguntas sugeridas", more: "Más preguntas", less: "Menos preguntas",
    input: "Tu pregunta", placeholder: "Pregunta sobre sus proyectos o experiencia…", send: "Enviar pregunta",
    conversation: "Conversación con el asistente", you: "Tú", source: "Información del portafolio de Leonardo.",
    fallback: "Puedo contarte sobre los proyectos, tecnologías, experiencia backend y formas de contactar a Leonardo. Prueba una de las preguntas sugeridas.",
    assetError: "No se pudo cargar el personaje. Abrir asistente de Leonardo.",
    questions: {
      checabien: "¿Qué hizo Leonardo en ChecaBien?", radar: "Explícame Radar",
      technologies: "¿Qué tecnologías domina?", backend: "¿Qué experiencia tiene con backend?",
      featured: "Ver proyectos destacados", contact: "¿Cómo contacto a Leonardo?", boticlic: "Explícame BotiClic",
    },
    keywords: {
      checabien: ["checabien", "checa bien"], radar: ["radar"], boticlic: ["boticlic", "boticlick"],
      backend: ["backend", "back end", "experiencia", "apis", "api", "autenticacion"],
      technologies: ["tecnologia", "tecnologias", "stack", "lenguaje", "lenguajes", "java", "typescript", "react", "mysql", "aws", "herramientas"],
      featured: ["proyecto", "proyectos", "destacado", "destacados", "portafolio"],
      contact: ["contacto", "contactar", "correo", "email", "whatsapp", "linkedin", "contratar", "hablar"],
    },
  },
  footer: "Leonardo Rosales — Lima 💚",
};

export type Translations = typeof es;
