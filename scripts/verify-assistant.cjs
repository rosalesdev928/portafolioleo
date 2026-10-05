// Local/SSR checks using the dependencies already installed. No browser/API.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const React = require("react");
const jsx = require("react/jsx-runtime");
const { renderToStaticMarkup } = require("react-dom/server");
const compile = (source) => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
for (const extension of [".ts", ".tsx"]) require.extensions[extension] = (module, filename) => module._compile(compile(fs.readFileSync(filename, "utf8")), filename);
require.extensions[".css"] = () => {};
const data = require("../src/data/assistant.ts");
const { projects } = require("../src/data/projects.ts");
const { profile } = require("../src/data/profile.ts");
const { es } = require("../src/i18n/es.ts");
const { en } = require("../src/i18n/en.ts");
const pulse = require("../src/lib/assistantPulse.ts");
const { PreferencesContext } = require("../src/context/PreferencesContext.ts");
const Panel = require("../src/components/assistant/AssistantPanel.tsx").default;
const Message = require("../src/components/assistant/AssistantMessage.tsx").default;
const Assistant = require("../src/components/assistant/PortfolioAssistant.tsx").default;

function verifyAnswers() {
  const allowedUrls = new Set(["#proyectos", "#contacto", `mailto:${profile.email}`, profile.githubUrl, profile.linkedinUrl]);
  for (const project of projects) for (const key of ["repoUrl", "liveUrl", "videoUrl", "detailsUrl"]) if (project[key]) allowedUrls.add(project[key]);
  const technologies = new Set(projects.flatMap((project) => project.technologies));
  for (const [language, t] of [["es", es], ["en", en]]) {
    for (const theme of ["dark", "light"]) {
      const launcher = renderToStaticMarkup(React.createElement(PreferencesContext.Provider, { value: { theme, language, t } }, React.createElement(Assistant)));
      assert.equal((launcher.match(/<button\b/g) ?? []).length, 2, "Character and invitation are separate native keyboard buttons");
      assert.ok(launcher.includes(t.assistant.launcher) && launcher.includes('aria-haspopup="dialog"'));
      assert.ok(launcher.includes('class="assistant-character"'));
      assert.ok(!/assistant-(?:ground-rings|music-notes|wave)/.test(launcher), "The GIF supplies its own notes and visual effects");
      assert.ok(!launcher.includes('role="tooltip"'), "Clickable invitation must retain button semantics");
    }
    for (const topic of [...data.suggestedQuestions, ...projects.map((project) => project.id), null]) {
      const answer = data.getAssistantAnswer(topic, t);
      for (const summary of answer.projects) {
        const project = projects.find((entry) => entry.id === summary.id);
        assert.equal(summary.description, t.projects.items[project.id].description);
        assert.equal(summary.extra, t.projects.items[project.id].extra);
        for (const technology of summary.technologies) assert.ok(project.technologies.includes(technology));
      }
      for (const technology of answer.technologies) assert.ok(technologies.has(technology));
      for (const action of [...answer.actions, ...answer.projects.flatMap((project) => project.actions)]) assert.ok(allowedUrls.has(action.href));
      for (const theme of ["dark", "light"]) {
        const markup = renderToStaticMarkup(React.createElement(PreferencesContext.Provider, { value: { theme, language, t } }, React.createElement(Message, { answer, onNavigate() {} })));
        assert.ok(!markup.includes("undefined"));
        for (const link of markup.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) assert.ok(link[0].includes('rel="noopener noreferrer"'));
      }
    }
    const checa = data.getAssistantAnswer("checabien", t).projects[0];
    assert.ok(!checa.actions.some((action) => action.label === t.projects.repository));
    assert.ok(checa.actions.some((action) => action.href === projects[0].liveUrl));
    const boti = data.getAssistantAnswer("boticlic", t).projects[0];
    assert.ok(!boti.actions.some((action) => action.label === t.projects.liveDemo));
    assert.equal(data.getAssistantAnswer("featured", t).projects.map((project) => project.id).join(","), "checabien,radar,boticlic");
    assert.equal(data.resolveAssistantTopic(t.assistant.questions.checabien, t), "checabien");
    assert.equal(data.resolveAssistantTopic(t.assistant.questions.contact, t), "contact");
    assert.equal(data.resolveAssistantTopic("NestJS", t), "technologies");
    assert.equal(data.resolveAssistantTopic("Which salary does Leonardo earn?", t), null);
    const markup = renderToStaticMarkup(React.createElement(PreferencesContext.Provider, { value: { theme: "dark", language, t } }, React.createElement(Panel, { turns: [{ id: 1, prompt: { kind: "suggestion", topic: "radar" }, topic: "radar" }], pendingId: 1, onAsk() {}, onClose() {}, onNavigate() {} })));
    assert.ok(markup.includes('role="dialog"') && markup.includes('aria-modal="false"'));
    assert.ok(markup.includes(t.assistant.welcome) && markup.includes(t.assistant.typing));
    assert.ok(markup.includes(t.assistant.questions.radar));
    assert.ok(markup.includes('aria-label="' + t.assistant.close + '"'));
    assert.equal((markup.match(/class="assistant-question-chips"/g) ?? []).length, 1);
  }
  assert.equal(pulse.readAssistantPulse(new CustomEvent("pulse", { detail: { x: NaN, y: 0, radius: 100, strength: 1 } })), null);
  assert.equal(pulse.readAssistantPulse(new Event("pulse")), null);
  const sanitized = pulse.readAssistantPulse(new CustomEvent("pulse", { detail: { x: 10, y: 20, radius: 10000, strength: 100 } }));
  assert.equal(sanitized.radius, 220); assert.equal(sanitized.strength, 1.5);
  const gif = fs.readFileSync("public" + data.assistantCharacter.src);
  assert.equal(data.assistantCharacter.src, "/assistant/leonardo-bot.gif");
  assert.equal(gif.subarray(0, 6).toString(), "GIF89a");
  assert.equal(gif.readUInt16LE(6), data.assistantCharacter.width);
  assert.equal(gif.readUInt16LE(8), data.assistantCharacter.height);
  // Walk GIF blocks, skipping compressed image data, to check genuine alpha
  // flags rather than accidentally matching byte sequences inside a frame.
  let offset = 13 + ((gif[10] & 128) ? 3 * 2 ** ((gif[10] & 7) + 1) : 0), transparentFrames = 0;
  const skipSubBlocks = () => { while (gif[offset]) offset += gif[offset] + 1; offset++; };
  while (offset < gif.length && gif[offset] !== 0x3b) {
    const marker = gif[offset++];
    if (marker === 0x21) {
      const label = gif[offset++];
      if (label === 0xf9 && (gif[offset + 1] & 1)) transparentFrames++;
      skipSubBlocks();
    } else if (marker === 0x2c) {
      const packed = gif[offset + 8];
      offset += 9 + ((packed & 128) ? 3 * 2 ** ((packed & 7) + 1) : 0);
      offset++; skipSubBlocks();
    } else assert.fail("Unexpected GIF block");
  }
  assert.ok(transparentFrames > 0, "New GIF must include transparent frames");
  console.log("PASS: local answers/intent matching, source-only links/technologies, ES/EN, theme rendering, pending status, native dialog semantics and real GIF");
}

function verifyController({ reducedMotion = false, mobile = false, earlyScenario } = {}) {
  let cursor = 0, tree, language = "es", nextTimer = 0;
  const slots = [], effects = [], timers = new Map(), intervals = new Map(), handlers = new Map(), pulses = [];
  let focusCount = 0;
  const launcher = { focus() { focusCount++; }, getBoundingClientRect: () => ({ left: 1296, top: 758, width: 128, height: 128, bottom: 886 }) };
  const dock = { style: { setProperty() {} } };
  const hooks = {
    useRef(value) { return slots[cursor++] ??= { current: value }; },
    useCallback(fn, dependencies) {
      const index = cursor++, previous = slots[index];
      if (!previous || dependencies.some((value, i) => value !== previous.dependencies[i])) slots[index] = { dependencies, value: fn };
      return slots[index].value;
    },
    useState(initial) {
      const index = cursor++, slot = slots[index] ??= { value: typeof initial === "function" ? initial() : initial };
      return [slot.value, (value) => { slot.value = typeof value === "function" ? value(slot.value) : value; }];
    },
    useEffect(fn, dependencies) {
      const index = cursor++, previous = slots[index];
      if (!previous || dependencies.some((value, i) => value !== previous.dependencies[i])) effects.push(() => { previous?.cleanup?.(); slots[index] = { dependencies, cleanup: fn() }; });
    },
  };
  const imports = {
    react: hooks, "react/jsx-runtime": jsx, "../../data/assistant": data,
    "../../hooks/usePreferences": { usePreferences: () => ({ t: language === "es" ? es : en }) },
    "../../hooks/useMediaQuery": { useMediaQuery: (query) => query.includes("reduced-motion") ? reducedMotion : mobile },
    "../../lib/assistantPulse": { emitAssistantPulse: (value) => pulses.push(value) },
    "./AssistantCharacter": { default: () => null }, "./AssistantPanel": { default: () => null },
    "./useAssistantPlacement": { useAssistantPlacement() {} }, "./assistant.css": {},
  };
  const module = { exports: {} };
  vm.runInNewContext(compile(fs.readFileSync("src/components/assistant/PortfolioAssistant.tsx", "utf8")), {
    module, exports: module.exports, require: (name) => imports[name],
    window: { innerHeight: 900, setTimeout(fn, delay) { assert.ok([550, 2500, 5000].includes(delay)); timers.set(++nextTimer, { fn, delay }); return nextTimer; }, clearTimeout: (id) => timers.delete(id), setInterval(fn, delay) { assert.equal(delay, mobile ? 6000 : 5500); intervals.set(++nextTimer, fn); return nextTimer; }, clearInterval: (id) => intervals.delete(id) },
    document: { hidden: false, querySelector: () => null, addEventListener: (name, fn) => handlers.set(name, fn), removeEventListener: (name) => handlers.delete(name) },
  });
  function render() {
    cursor = 0; tree = module.exports.default();
    tree.props.ref.current = dock;
    const button = tree.props.children[0];
    button.props.ref.current = launcher;
    for (const effect of effects.splice(0)) effect();
    return button.props;
  }
  const panel = () => tree.props.children[1].props;
  const invitation = () => tree.props.children[2];
  const finishTimer = (delay) => {
    const entry = [...timers].find(([, timer]) => timer.delay === delay);
    assert.ok(entry, `Expected ${delay}ms timer`);
    timers.delete(entry[0]); entry[1].fn(); render();
  };
  const cleanup = () => {
    for (const slot of slots) slot?.cleanup?.();
    assert.equal(timers.size, 0); assert.equal(intervals.size, 0); assert.equal(handlers.size, 0);
  };
  render();
  assert.equal(tree.props["data-invitation"], false);
  assert.equal(invitation().type, "button");
  assert.equal(invitation().props["aria-label"], es.assistant.launcher);
  if (earlyScenario === "before-show") { cleanup(); console.log("PASS: unmount cancels pending invitation"); return; }
  if (earlyScenario === "opened-before-show") {
    tree.props.children[0].props.onClick(); render();
    finishTimer(2500);
    assert.equal(tree.props["data-invitation"], false);
    handlers.get("keydown")({ key: "Escape", defaultPrevented: false, preventDefault() {} }); render();
    assert.equal(tree.props["data-invitation"], false, "Opening dismisses the queued invitation permanently");
    cleanup(); console.log("PASS: opening before the notification suppresses its queued appearance"); return;
  }
  finishTimer(2500);
  assert.equal(tree.props["data-invitation"], true, "Invitation appears automatically without hover");
  if (earlyScenario === "visible") { cleanup(); console.log("PASS: unmount cancels invitation hide timer"); return; }
  finishTimer(5000);
  assert.equal(tree.props["data-invitation"], false, "Automatic invitation hides after five seconds");
  tree.props.children[0].props.children.props.children.props.children.props.onReady();
  let button = render();
  assert.equal(button["aria-expanded"], false); assert.equal(intervals.size, reducedMotion ? 0 : 1);
  for (const fn of intervals.values()) fn();
  assert.equal(pulses.length, reducedMotion ? 0 : 1);
  if (!reducedMotion) assert.equal(pulses[0].strength, mobile ? .65 : 1);
  button.onClick(); render();
  assert.equal(tree.props.children[0].props["aria-expanded"], true);
  assert.equal(invitation(), false, "Open panel removes the speech bubble");
  assert.equal(tree.props["data-invitation"], false);
  assert.equal(pulses.some((value) => value.strength === 1.4), !reducedMotion);
  panel().onAsk({ kind: "suggestion", topic: "checabien" }); render();
  assert.equal(panel().turns.length, 1); assert.equal(panel().pendingId, 1);
  panel().onAsk({ kind: "suggestion", topic: "radar" }); render();
  assert.equal(panel().turns.length, 1, "Pending replies cannot be duplicated by rapid clicks");
  handlers.get("keydown")({ key: "Escape", defaultPrevented: false, preventDefault() {} }); render();
  assert.equal(tree.props.children[0].props["aria-expanded"], false); assert.ok(focusCount > 0);
  finishTimer(550);
  invitation().props.onClick(); render();
  assert.equal(panel().turns.length, 1); assert.equal(panel().pendingId, null);
  language = "en"; render();
  assert.equal(tree.props.children[0].props["aria-label"], en.assistant.close);
  assert.equal(panel().turns[0].prompt.topic, "checabien", "Store topic IDs so history can translate when locale changes");
  panel().onAsk({ kind: "text", text: "Tell me about Radar" }); render();
  assert.equal(panel().turns[1].topic, "radar");
  cleanup();
  console.log(`PASS: ${mobile ? "mobile" : "desktop"}${reducedMotion ? " reduced motion" : ""}, automatic/clickable invitation, pulse cadence, launcher open/close/Escape, focus return, 550ms typing, quick questions, free text, session history, locale switch and cleanup`);
}

function verifyPlacement() {
  const css = fs.readFileSync("src/components/assistant/assistant.css", "utf8");
  assert.ok(css.includes("pointer-events: none"));
  const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
  for (const selector of [".assistant-character-visual", ".assistant-invitation", ".assistant-panel", ".assistant-typing-dots i"]) assert.ok(reduced.includes(selector));
  assert.ok(!/mask-image|assistant-(?:ground-rings|music-notes|wave|groove|halo)|@keyframes assistant-float/.test(css), "Remove masking and duplicated GIF effects");
  for (const [width, height, size, edge] of [[320, 700, 96, 12], [375, 812, 96, 12], [768, 1024, 128, 16], [1024, 768, 180, 16], [1440, 900, 180, 16]]) {
    const variables = new Map(), frames = new Map(), timers = new Map(), handlers = new Map();
    let next = 0, cleanup;
    const box = { left: width - edge - size, top: height - edge - size, width: size, height: size };
    const invitationWidth = Math.min(240, width - edge * 2 - size - 12), invitationHeight = 60;
    // Both a button under the sprite and a link where the bubble first appears.
    const obstacles = [
      { left: box.left, right: box.left + size, top: box.top + 16, bottom: box.top + 48, width: size, height: 32 },
      { left: box.left + size - invitationWidth, right: box.left + size, top: box.top - 70, bottom: box.top - 32, width: invitationWidth, height: 38 },
    ];
    const module = { exports: {} };
    vm.runInNewContext(compile(fs.readFileSync("src/components/assistant/useAssistantPlacement.ts", "utf8")), {
      module, exports: module.exports, require: () => ({ useEffect: (fn) => { cleanup = fn(); } }),
      document: { querySelectorAll: () => obstacles.map((rect) => ({ closest: () => null, getBoundingClientRect: () => rect })) },
      window: { innerHeight: height, requestAnimationFrame: (fn) => { frames.set(++next, fn); return next; }, cancelAnimationFrame: (id) => frames.delete(id), setTimeout: (fn) => { timers.set(++next, fn); return next; }, clearTimeout: (id) => timers.delete(id), addEventListener: (name, fn) => handlers.set(name, fn), removeEventListener: (name) => handlers.delete(name) },
    });
    module.exports.useAssistantPlacement({ current: { style: { setProperty: (key, value) => variables.set(key, value) }, dataset: {} } }, { current: { getBoundingClientRect: () => box } }, false, { current: { offsetWidth: invitationWidth, offsetHeight: invitationHeight } });
    for (const [id, fn] of [...frames]) { frames.delete(id); fn(0); }
    const x = parseFloat(variables.get("--assistant-shift")), y = parseFloat(variables.get("--assistant-clearance"));
    const footprints = [
      { left: box.left - x, top: box.top - y, width: size, height: size },
      { left: box.left - x + size - invitationWidth, top: box.top - y - 14 - invitationHeight, width: invitationWidth, height: invitationHeight },
    ];
    for (const rect of footprints) {
      assert.ok(rect.left >= 12 && rect.left + rect.width <= width - edge && rect.top >= 88);
      for (const obstacle of obstacles) assert.ok(rect.left + rect.width <= obstacle.left || rect.left >= obstacle.right || rect.top + rect.height <= obstacle.top || rect.top >= obstacle.bottom, `${width}px: assistant and bubble must avoid both controls`);
    }
    handlers.get("scroll")();
    cleanup();
    assert.equal(frames.size, 0); assert.equal(timers.size, 0); assert.equal(handlers.size, 0);
  }
  console.log("PASS: 320/375/768/1024/1440px placement, launcher/bubble avoid controls, viewport bounds, reduced-motion CSS and scroll/RAF cleanup");
}

function verifyCharacter() {
  for (const [reducedMotion, staticFrame] of [[false, false], [true, false], [false, true]]) {
    const effects = [], images = [], draws = [];
    let ready = 0;
    const imports = {
      react: { useEffect: (fn) => effects.push(fn), useRef: (current) => ({ current }), useState: (value) => [value, () => {}] },
      "react/jsx-runtime": jsx, "../../data/assistant": data,
      "../../hooks/useMediaQuery": { useMediaQuery: () => reducedMotion },
      "../../hooks/usePreferences": { usePreferences: () => ({ t: es }) },
    };
    const module = { exports: {} };
    vm.runInNewContext(compile(fs.readFileSync("src/components/assistant/AssistantCharacter.tsx", "utf8")), {
      module, exports: module.exports, require: (name) => imports[name],
      Image: class { constructor() { images.push(this); } removeAttribute(name) { assert.equal(name, "src"); this.src = null; } },
    });
    const character = module.exports.default({ staticFrame, onReady: () => ready++ });
    if (!reducedMotion && !staticFrame) {
      assert.equal(character.type, "img"); assert.equal(character.props.src, data.assistantCharacter.src);
      for (const effect of effects) effect();
      assert.equal(images.length, 0);
    } else {
      assert.equal(character.type, "canvas");
      character.props.ref.current = { getContext: () => ({ drawImage: (...args) => draws.push(args) }) };
      const cleanups = effects.map((effect) => effect());
      assert.equal(images[0].src, data.assistantCharacter.src);
      const load = images[0].onload;
      load();
      assert.equal(draws.length, 1); assert.deepEqual(draws[0].slice(1), [0, 0, 320, 320]);
      assert.equal(ready, 1); assert.equal(images[0].src, null);
      assert.equal(images[0].onload, null); assert.equal(images[0].onerror, null);
      for (const cleanup of cleanups) cleanup?.();
      load(); assert.equal(draws.length, 1, "Late image callback cannot draw after unmount");
    }
    assert.equal(character.props.width, 320); assert.equal(character.props.height, 320);
  }
  console.log("PASS: shared transparent GIF source, animated launcher and static reduced-motion/panel avatar, dimensions and image callback cleanup");
}

function verifyPulseMotion() {
  const source = fs.readFileSync("src/components/HeroParticles.tsx", "utf8");
  const module = { exports: {} };
  let now = 0;
  vm.runInNewContext(compile(source + "\nexport { createCursorRepulsion };"), {
    module, exports: module.exports, require: () => ({}), performance: { now: () => now },
  });
  const pulseRef = { current: { x: 0, y: 0, radius: 170, strength: 1, startedAt: 0 } };
  const container = { actualOptions: { interactivity: { events: { onHover: { enable: false } } } }, retina: { pixelRatio: 1 }, interactivity: { mouse: {} } };
  const mover = module.exports.createCursorRepulsion(container, pulseRef);
  const node = (x) => ({ id: 1, destroyed: false, position: { x, y: 0 }, offset: { x: 0, y: 0 }, options: { move: { enable: true } } });
  const nearby = node(70), far = node(300);
  mover.init(nearby); mover.init(far);
  assert.equal(mover.isEnabled(nearby), true);
  for (let frame = 0; frame < 32; frame++) { now = frame * 16; mover.move(nearby, { value: 16 }); mover.move(far, { value: 16 }); }
  assert.ok(nearby.offset.x > 5, "Guitar pulse must physically displace a nearby node");
  assert.equal(far.offset.x, 0, "Pulse stays local");
  assert.equal(nearby.position.x, 70, "Ambient trajectory stays intact");
  for (let frame = 32; frame < 240; frame++) { now = frame * 16; mover.move(nearby, { value: 16 }); }
  assert.equal(pulseRef.current, null);
  assert.ok(Math.abs(nearby.offset.x) < .01, "Node smoothly returns after the pulse");
  assert.equal(mover.isEnabled(nearby), false);
  console.log("PASS: existing particle mover physically reacts locally and settles without resetting the ambient trajectory");
}

verifyAnswers();
verifyController();
verifyController({ mobile: true });
verifyController({ reducedMotion: true });
verifyController({ earlyScenario: "before-show" });
verifyController({ earlyScenario: "visible" });
verifyController({ earlyScenario: "opened-before-show" });
verifyPlacement();
verifyCharacter();
verifyPulseMotion();
