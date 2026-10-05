// Run with: node scripts/verify-portfolio.cjs
// Uses existing dependencies and Node's assertions; does not start a browser.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
for (const extension of [".ts", ".tsx"]) {
  require.extensions[extension] = (module, filename) => {
    const output = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
    }).outputText;
    module._compile(output, filename);
  };
}
require.extensions[".css"] = () => {};
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const { es } = require("../src/i18n/es.ts");
const { en } = require("../src/i18n/en.ts");
const { PreferencesContext } = require("../src/context/PreferencesContext.ts");
const preferences = require("../src/lib/preferences.ts");
const audio = require("../src/lib/audio.ts");
const { projects } = require("../src/data/projects.ts");
const App = require("../src/App.tsx").default;

function shape(value) {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, shape(entry)]));
  return typeof value;
}

function contrast(first, second) {
  const luminance = (hex) => {
    const rgb = hex.slice(1).match(/.{2}/g).map((part) => parseInt(part, 16) / 255).map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  const a = luminance(first), b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

async function run() {
  assert.deepEqual(shape(es), shape(en), "Translation dictionaries must have identical keys and types");
  const css = fs.readFileSync("src/index.css", "utf8");
  const tokens = (block) => Object.fromEntries([...block.matchAll(/(--[\w-]+):\s*(#[0-9a-f]{6});/g)].map((match) => [match[1], match[2]]));
  const dark = tokens(css.match(/:root\s*\{([^}]+)\}/)[1]);
  const light = { ...dark, ...tokens(css.match(/:root\[data-theme="light"\]\s*\{([^}]+)\}/)[1]) };
  for (const palette of [dark, light]) {
    for (const [foreground, background] of [["--text-primary", "--surface"], ["--text-secondary", "--surface"], ["--accent", "--bg-primary"], ["--badge-text", "--badge-bg"], ["--action-text", "--action-bg"]]) {
      assert.ok(contrast(palette[foreground], palette[background]) >= 4.5, foreground + " must meet AA contrast on " + background);
    }
  }
  const ids = ["checabien", "radar", "boticlic", "sistema-farmacia", "calificaciones", "ey-fit-pack"];
  assert.deepEqual(projects.map((project) => project.id), ids);
  assert.deepEqual(projects.filter((project) => project.featured).map((project) => project.id), ids.slice(0, 3));
  assert.equal(projects[0].repoUrl, undefined);
  assert.equal(projects[0].liveUrl, "https://checabien.com/regionales-2026?departamento=15&provincia=1501&ubicacion=ejemplo");
  assert.equal(projects[1].repoUrl, "https://github.com/rosalesdev928/radar");
  assert.equal(projects[1].liveUrl, "https://radar-lovat-ten.vercel.app");
  for (const project of projects) {
    assert.ok(fs.existsSync("public" + project.image));
    assert.ok((project.technologyHighlights ?? project.technologies).every((technology) => project.technologies.includes(technology)));
    assert.ok(es.projects.items[project.id] && en.projects.items[project.id]);
  }
  assert.ok(["AWS", "Amazon EC2", "Amazon RDS", "Amazon S3"].every((technology) => projects[0].technologyHighlights.includes(technology)));

  const saved = new Map();
  global.window = { localStorage: { getItem: (key) => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value) }, matchMedia: () => ({ matches: true }) };
  assert.equal(preferences.initialTheme(), "light");
  assert.equal(preferences.initialLanguage(), "es");
  preferences.writePreference("portfolio-theme", "dark");
  preferences.writePreference("portfolio-language", "en");
  assert.equal(preferences.initialTheme(), "dark");
  assert.equal(preferences.initialLanguage(), "en");
  window.localStorage.getItem = () => { throw new Error("Storage unavailable"); };
  window.localStorage.setItem = () => { throw new Error("Storage unavailable"); };
  assert.equal(preferences.initialTheme(), "light");
  assert.equal(preferences.initialLanguage(), "es");
  assert.doesNotThrow(() => preferences.writePreference("portfolio-theme", "light"));
  delete global.window;

  const boot = fs.readFileSync("index.html", "utf8").match(/<script>([\s\S]*?)<\/script>/)[1];
  const root = { dataset: {}, lang: "" };
  vm.runInNewContext(boot, { window: { matchMedia: () => ({ matches: true }) }, localStorage: { getItem: () => { throw new Error("blocked"); } }, document: { documentElement: root, querySelector: () => ({ setAttribute() {} }) } });
  assert.equal(root.dataset.theme, "light");
  assert.equal(root.lang, "es");

  const originalFetch = global.fetch;
  let requests = 0;
  global.fetch = async (url, options) => {
    requests++;
    assert.equal(options.method, "HEAD");
    return new Response(null, { status: 200, headers: { "content-type": url.includes("-es") ? "audio/mpeg" : "text/html" } });
  };
  assert.equal(await audio.checkAudio("es"), true);
  assert.equal(await audio.checkAudio("es"), true);
  assert.equal(requests, 1, "Availability is checked only once per language/session");
  assert.equal(await audio.checkAudio("en"), false, "HTML fallback must not be played as audio");
  audio.markAudioUnavailable("es");
  assert.equal(await audio.checkAudio("es"), false);
  assert.equal(requests, 2, "A failed track must not cause retry loops");
  assert.equal(audio.isAudioResponse(new Response(null, { status: 404 })), false);
  global.fetch = originalFetch;

  for (const theme of ["dark", "light"]) for (const [language, t] of [["es", es], ["en", en]]) {
    const markup = renderToStaticMarkup(React.createElement(PreferencesContext.Provider, { value: { theme, language, t, toggleTheme() {}, setLanguage() {} } }, React.createElement(App)));
    assert.equal((markup.match(/<article\b/g) ?? []).length, 6);
    assert.equal((markup.match(new RegExp(">" + t.projects.featured + "<", "g")) ?? []).length, 3);
    assert.ok(markup.includes(t.hero.headline));
    assert.ok(markup.includes(t.about.description.replace(/'/g, "&#x27;")));
    assert.ok(markup.includes(t.services.web.description));
    assert.ok(markup.includes(t.contact.message));
    const cvFileName = `CV-Leonardo-Rosales-${language.toUpperCase()}.pdf`;
    const cvLinks = [...markup.matchAll(/<a\b[^>]*\bdownload="([^"]+)"[^>]*>[^<]*<\/a>/g)];
    assert.equal(cvLinks.length, 1, "The CV download must use the selected language");
    assert.equal(cvLinks[0][1], cvFileName);
    assert.ok(cvLinks[0][0].includes(`href="/cv/${cvFileName}"`));
    assert.ok(cvLinks[0][0].includes(`>${t.hero.cv}</a>`));
    const cv = fs.readFileSync(`public/cv/${cvFileName}`);
    assert.equal(cv.subarray(0, 5).toString(), "%PDF-", "Download must point to a real PDF");
    for (const project of projects) assert.ok(markup.includes(t.projects.items[project.id].imageAlt));
    assert.ok(markup.includes('<audio preload="none"'));
    assert.equal((markup.match(/href="mailto:leonardo1234rag@gmail.com"/g) ?? []).length, 2, "Hero and Contact must use the confirmed email");
    assert.ok(!/<audio\b[^>]*(?:autoplay|src=)/.test(markup), "Audio cannot load/play before a user gesture");
    for (const link of markup.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert.ok(link[0].includes('rel="noopener noreferrer"'));
    for (const id of ["inicio", "sobre-mi", "proyectos", "servicios", "contacto"]) assert.ok(markup.includes('id="' + id + '"'));
    console.log("PASS: render " + theme + " + " + language);
  }
  console.log("PASS: dictionaries, projects, safe storage, theme bootstrap, audio availability and external links");
}
run().catch((error) => { console.error(error); process.exitCode = 1; });
