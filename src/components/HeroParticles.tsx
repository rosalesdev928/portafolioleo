import { useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import type { RefObject } from "react";
import { createPortal } from "react-dom";
import Particles from "react-tsparticles";
import type { Container, Engine, IParticleMover, ISourceOptions, Particle } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";
import { usePreferences } from "../hooks/usePreferences";
import { useMediaQuery } from "../hooks/useMediaQuery";
import { ASSISTANT_PULSE_EVENT, readAssistantPulse } from "../lib/assistantPulse";
import type { ActiveAssistantPulse } from "../lib/assistantPulse";

function subscribeViewport(notify: () => void) {
  window.addEventListener("resize", notify, { passive: true });
  return () => window.removeEventListener("resize", notify);
}
const viewportArea = () => window.innerWidth * window.innerHeight;
const serverArea = () => 1440 * 900;

function createCursorRepulsion(container: Container, pulseRef: RefObject<ActiveAssistantPulse | null>): IParticleMover {
  const velocities = new WeakMap<Particle, { x: number; y: number }>();
  const axes = ["x", "y"] as const;
  return {
    init(particle) {
      particle.offset.x = 0;
      particle.offset.y = 0;
      velocities.set(particle, { x: 0, y: 0 });
    },
    isEnabled(particle) {
      const hover = container.actualOptions.interactivity.events.onHover;
      const velocity = velocities.get(particle);
      const settling = Math.abs(particle.offset.x) + Math.abs(particle.offset.y) + Math.abs(velocity?.x ?? 0) + Math.abs(velocity?.y ?? 0) > 0.01;
      return !particle.destroyed && particle.options.move.enable && ((hover.enable && hover.mode === "portfolio-repulse") || pulseRef.current !== null || settling);
    },
    move(particle, delta) {
      // Runs inside the engine's existing requestAnimationFrame loop, before
      // link calculation. Window pointer events never trigger React renders.
      const mouse = container.interactivity.mouse.position;
      const ratio = container.retina.pixelRatio;
      const radius = 230 * ratio;
      let targetX = 0;
      let targetY = 0;
      if (mouse) {
        // Keep the ambient position/velocity intact so the displaced node can
        // ease back to its continuously moving natural trajectory.
        const dx = particle.position.x - mouse.x;
        const dy = particle.position.y - mouse.y;
        const distance = Math.hypot(dx, dy);
        if (distance < radius) {
          const strength = 140 * ratio * (1 - distance / radius) ** 1.6;
          // Stable directions also separate nodes exactly under the cursor.
          const angle = particle.id * 2.399963229728653;
          targetX = (distance > 0 ? dx / distance : Math.cos(angle)) * strength;
          targetY = (distance > 0 ? dy / distance : Math.sin(angle)) * strength;
        }
      }
      const pulse = pulseRef.current;
      if (pulse) {
        const progress = Math.max(0, performance.now() - pulse.startedAt) / 900;
        if (progress >= 1) pulseRef.current = null;
        else {
          const dx = particle.position.x - pulse.x * ratio;
          const dy = particle.position.y - pulse.y * ratio;
          const distance = Math.hypot(dx, dy);
          const pulseRadius = pulse.radius * ratio;
          if (distance < pulseRadius) {
            const strength = 22 * ratio * pulse.strength * Math.sin(Math.PI * progress) * (1 - distance / pulseRadius) ** 1.4;
            const angle = particle.id * 2.399963229728653;
            targetX += (distance > 0 ? dx / distance : Math.cos(angle)) * strength;
            targetY += (distance > 0 ? dy / distance : Math.sin(angle)) * strength;
          }
        }
      }
      // Critically damped spring: preserve momentum when the target changes,
      // with a slower release. Exact integration avoids frame-rate jitter.
      const velocity = velocities.get(particle) ?? { x: 0, y: 0 };
      velocities.set(particle, velocity);
      const elapsed = Math.min(Math.max(delta.value, 0), 50) / 1000;
      const response = targetX !== 0 || targetY !== 0 ? 14 : 8;
      const decay = Math.exp(-response * elapsed);
      for (const axis of axes) {
        const target = axis === "x" ? targetX : targetY;
        const displacement = particle.offset[axis] - target;
        const impulse = velocity[axis] + response * displacement;
        particle.offset[axis] = target + (displacement + impulse * elapsed) * decay;
        velocity[axis] = (velocity[axis] - response * impulse * elapsed) * decay;
      }
    },
  };
}

export default function HeroParticles() {
  const { theme } = usePreferences();
  const mobile = useMediaQuery("(max-width: 767px)");
  const desktop = useMediaQuery("(min-width: 1024px)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const area = useSyncExternalStore(subscribeViewport, viewportArea, serverArea);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const pulseRef = useRef<ActiveAssistantPulse | null>(null);
  useEffect(() => {
    pulseRef.current = null;
    if (reducedMotion) return;
    const receivePulse = (event: Event) => {
      const pulse = readAssistantPulse(event);
      if (pulse) pulseRef.current = { ...pulse, startedAt: performance.now() };
    };
    window.addEventListener(ASSISTANT_PULSE_EVENT, receivePulse);
    return () => { window.removeEventListener(ASSISTANT_PULSE_EVENT, receivePulse); pulseRef.current = null; };
  }, [reducedMotion]);
  const count = mobile ? 18 : desktop ? Math.min(220, Math.max(64, Math.round(80 * area / (900 * 1080)))) : 52;
  const init = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
    await engine.addMover("portfolio-cursor-repulsion", (container) => createCursorRepulsion(container, pulseRef), false);
  }, []);
  const options = useMemo<ISourceOptions>(() => ({
    fullScreen: { enable: false }, fpsLimit: reducedMotion ? 12 : mobile ? 18 : desktop ? 30 : 24,
    detectRetina: desktop, pauseOnBlur: true, pauseOnOutsideViewport: true,
    interactivity: {
      // Observe the cursor without intercepting page clicks/touch/scroll.
      detectsOn: "window",
      events: { onHover: { enable: desktop && finePointer && !reducedMotion, mode: "portfolio-repulse" }, onClick: { enable: false }, resize: true },
    },
    particles: {
      // About 1.9x the old desktop density, capped on very large screens.
      // Explicit counts also prevent density scaling from emptying mobile.
      number: { value: count, density: { enable: false } },
      color: { value: theme === "dark" ? "#34d399" : "#059669" },
      links: {
        enable: true, color: theme === "dark" ? "#34d399" : "#059669",
        distance: mobile ? 115 : desktop ? 175 : 150,
        opacity: theme === "dark" ? 0.29 : 0.28, width: 1,
        shadow: { enable: desktop && theme === "dark", color: "#065f46", blur: 2 },
      },
      move: {
        enable: !reducedMotion,
        // A separate positive speed per node, not a translating background.
        speed: mobile ? { min: 0.12, max: 0.3 } : desktop ? { min: 0.4, max: 1 } : { min: 0.2, max: 0.5 },
        random: true, straight: false, outModes: { default: "bounce" },
      },
      opacity: { value: theme === "dark" ? { min: 0.35, max: 0.55 } : { min: 0.3, max: 0.46 } },
      size: { value: { min: 1, max: mobile ? 2 : 2.7 } },
    },
  }), [theme, mobile, desktop, finePointer, count, reducedMotion]);
  // Escape the Hero's isolated stacking context without changing its layout.
  // One fixed canvas remains behind every section as the page scrolls.
  if (typeof document === "undefined") return null;
  return createPortal(<div className="hero-particles" aria-hidden="true"><Particles id="tsparticles" init={init} options={options} /></div>, document.body);
}
