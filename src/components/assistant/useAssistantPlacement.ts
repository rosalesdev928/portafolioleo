import { useEffect } from "react";
import type { RefObject } from "react";

// Keep the closed launcher away from visible links/form controls without
// changing any section's layout. Scroll/viewport updates share one RAF.
export function useAssistantPlacement(dockRef: RefObject<HTMLDivElement | null>, launcherRef: RefObject<HTMLButtonElement | null>, open: boolean, invitationRef: RefObject<HTMLButtonElement | null>) {
  useEffect(() => {
    const dock = dockRef.current;
    if (!dock) return;
    let frame = 0;
    let trailingTimer = 0;
    let lastMeasure = -Infinity;
    let clearance = 0;
    let shift = 0;
    dock.style.setProperty("--assistant-clearance", "0px");
    dock.style.setProperty("--assistant-shift", "0px");
    const measure = (time: number) => {
      frame = 0;
      if (time - lastMeasure < 100) {
        if (!trailingTimer) trailingTimer = window.setTimeout(() => { trailingTimer = 0; schedule(); }, 100 - (time - lastMeasure));
        return;
      }
      lastMeasure = time;
      const viewport = window.visualViewport;
      const height = viewport?.height ?? window.innerHeight;
      const keyboard = Math.max(0, window.innerHeight - height - (viewport?.offsetTop ?? 0));
      dock.style.setProperty("--assistant-viewport-height", `${height}px`);
      dock.style.setProperty("--assistant-keyboard-inset", `${keyboard}px`);
      dock.dataset.short = String(height < 500);
      if (open || !launcherRef.current) return;
      const box = launcherRef.current.getBoundingClientRect();
      const base = { left: box.left + shift, top: box.top + clearance, width: box.width, height: box.height };
      // Reserve the bubble even while hidden so hover cannot cause the dock
      // to jump away from the pointer or cover a link above the character.
      const invitationWidth = invitationRef.current?.offsetWidth ?? 0;
      const invitationHeight = invitationRef.current?.offsetHeight ?? 0;
      const obstacles = [...document.querySelectorAll<HTMLElement>("main a[href], main button, main input, main textarea")]
        .filter((element) => !element.closest("[inert]"))
        .map((element) => element.getBoundingClientRect())
        .filter((rect) => rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight);
      let best = { shift: 0, clearance: 0, score: Infinity };
      for (const x of [0, base.width + 12]) {
        for (const y of [0, base.height + 12, (base.height + 12) * 2]) {
          const left = base.left - x, top = base.top - y;
          if (left < 12 || top < 88) continue;
          const footprints = [{ left, top, width: base.width, height: base.height }];
          if (invitationWidth > 0) {
            const invitationLeft = left + base.width - invitationWidth, invitationTop = top - 14 - invitationHeight;
            if (invitationLeft < 12 || invitationTop < 88) continue;
            footprints.push({ left: invitationLeft, top: invitationTop, width: invitationWidth, height: invitationHeight });
          }
          const score = footprints.reduce((sum, footprint) => sum + obstacles.reduce((total, rect) => total + Math.max(0, Math.min(footprint.left + footprint.width + 6, rect.right) - Math.max(footprint.left - 6, rect.left)) * Math.max(0, Math.min(footprint.top + footprint.height + 6, rect.bottom) - Math.max(footprint.top - 6, rect.top)), 0), 0);
          if (score < best.score) best = { shift: x, clearance: y, score };
          if (score === 0) break;
        }
        if (best.score === 0) break;
      }
      if (best.clearance !== clearance) { clearance = best.clearance; dock.style.setProperty("--assistant-clearance", `${clearance}px`); }
      if (best.shift !== shift) { shift = best.shift; dock.style.setProperty("--assistant-shift", `${shift}px`); }
    };
    const schedule = () => { if (!frame) frame = window.requestAnimationFrame(measure); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.visualViewport?.addEventListener("resize", schedule, { passive: true });
    window.visualViewport?.addEventListener("scroll", schedule, { passive: true });
    // Recheck when translated copy, form messages or active project slides
    // change. Ignore animated style/class attributes and the assistant itself.
    const observer = !open && typeof MutationObserver !== "undefined" ? new MutationObserver(schedule) : null;
    const main = observer ? document.getElementById("main-content") : null;
    if (main) observer?.observe(main, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ["inert"] });
    return () => {
      observer?.disconnect();
      window.cancelAnimationFrame(frame);
      window.clearTimeout(trailingTimer);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("scroll", schedule);
    };
  }, [dockRef, launcherRef, open, invitationRef]);
}
