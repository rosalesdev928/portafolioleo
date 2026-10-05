# Portafolio – rosalesdev928
React + Vite + Tailwind.  
Scripts: `npm run dev` | `npm run build` | `npm run preview`.

Sitio: https://rosalesdev.com

## Preferencias y modernización frontend

- Tema: tokens en `src/index.css`, activados por `html[data-theme]`.
  `index.html` aplica la preferencia antes de cargar React. Primera visita:
  tema del sistema. Selección explícita: `portfolio-theme` en localStorage.
- Idioma: ES por defecto; diccionarios locales tipados en `src/i18n/es.ts`
  y `src/i18n/en.ts`. `portfolio-language` recuerda la selección y actualiza
  `html.lang`, la descripción SEO y todos los textos de interfaz.
- Audio: ver `public/audio/README.md`. Agregar `portfolio-es.mp3` y
  `portfolio-en.mp3` allí, sin cambiar código, y recargar. No hay autoplay.
  El control queda deshabilitado si la pista no existe; un cambio de idioma
  pausa la pista. Solo se guarda `portfolio-volume`.
- CV: PDFs en `public/cv/CV-Leonardo-Rosales-ES.pdf` y
  `public/cv/CV-Leonardo-Rosales-EN.pdf`. El enlace y el nombre de descarga
  cambian con el idioma seleccionado, sin recargar la página.
- Asistente: carga diferida, respuestas locales basadas en los datos del
  portafolio y personaje transparente en `public/assistant/leonardo-bot.gif`.
  Respeta teclado, idioma y movimiento reducido.
- Proyectos: datos en `src/data/projects.ts`; copy localizado en los diccionarios.
  `technologyHighlights` controla badges prioritarios sin perder el stack completo.
  `detailsUrl` reserva una extensión para futuros case studies; no activa enlaces
  ni páginas inexistentes. El carrusel muestra 1/2/3 cards y avanza por grupos.
- Animaciones: CSS + IntersectionObserver; reduced motion desactiva desplazamientos,
  zoom y el avance automático del carrusel de tecnologías. Partículas cargadas
  de forma diferida, con límites de FPS y menos nodos en móvil.

### Validación

```bash
npm run build
npm run lint
node node_modules/typescript/bin/tsc --noEmit --project tsconfig.app.json
node scripts/verify-portfolio.cjs
node scripts/verify-assistant.cjs
git diff --check
```

El script verifica diccionarios, proyectos, enlaces, almacenamiento bloqueado,
bootstrap del tema, audio ausente y render en DARK/LIGHT × ES/EN. No sustituye
una revisión interactiva en navegador. Revisar localhost en 1440, 1024, 768,
480 y 375 px, teclado, menú móvil, carruseles, formulario y reduced motion.


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
