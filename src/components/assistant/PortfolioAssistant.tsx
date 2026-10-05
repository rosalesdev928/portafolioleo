import { useCallback, useEffect, useRef, useState } from "react";
import type { AssistantPrompt, AssistantTurn } from "../../data/assistant";
import { resolveAssistantTopic } from "../../data/assistant";
import { usePreferences } from "../../hooks/usePreferences";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { emitAssistantPulse } from "../../lib/assistantPulse";
import AssistantCharacter from "./AssistantCharacter";
import AssistantPanel from "./AssistantPanel";
import { useAssistantPlacement } from "./useAssistantPlacement";
import "./assistant.css";

export default function PortfolioAssistant() {
  const { t } = usePreferences();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const mobile = useMediaQuery("(max-width: 767px)");
  const dockRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const invitationRef = useRef<HTMLButtonElement>(null);
  const invitationDismissed = useRef(false);
  const typingTimer = useRef<number | null>(null);
  const nextId = useRef(0);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<AssistantTurn[]>([]);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [invitation, setInvitation] = useState(false);
  const characterReady = useCallback(() => setReady(true), []);
  useAssistantPlacement(dockRef, launcherRef, open, invitationRef);

  const pulse = useCallback((strong = false) => {
    const launcher = launcherRef.current;
    if (reducedMotion || !ready || !launcher || document.hidden || document.querySelector("dialog[open]")) return;
    const box = launcher.getBoundingClientRect();
    if (box.top < 0 || box.bottom > window.innerHeight) return;
    emitAssistantPulse({ x: box.left + box.width * 0.53, y: box.top + box.height * 0.63, radius: mobile ? 115 : 170, strength: strong ? 1.4 : mobile ? 0.65 : 1 });
  }, [reducedMotion, ready, mobile]);

  useEffect(() => {
    if (reducedMotion || !ready) return;
    const interval = window.setInterval(() => pulse(), mobile ? 6000 : 5500);
    return () => window.clearInterval(interval);
  }, [pulse, reducedMotion, ready, mobile]);
  useEffect(() => () => { if (typingTimer.current !== null) window.clearTimeout(typingTimer.current); }, []);
  useEffect(() => {
    let hideTimer: number | undefined;
    const showTimer = window.setTimeout(() => {
      if (invitationDismissed.current || document.hidden || document.querySelector("dialog[open]")) return;
      setInvitation(true);
      hideTimer = window.setTimeout(() => setInvitation(false), 5000);
    }, 2500);
    return () => { window.clearTimeout(showTimer); if (hideTimer !== undefined) window.clearTimeout(hideTimer); };
  }, []);

  const openPanel = () => {
    invitationDismissed.current = true;
    setInvitation(false);
    setOpen(true);
    pulse(true);
  };

  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented && !document.querySelector("dialog[open]")) {
        event.preventDefault(); close();
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open, close]);

  const ask = (prompt: AssistantPrompt) => {
    if (typingTimer.current !== null) return;
    const id = ++nextId.current;
    const topic = prompt.kind === "suggestion" ? prompt.topic : resolveAssistantTopic(prompt.text, t);
    setTurns((previous) => [...previous, { id, prompt, topic }]);
    setPendingId(id);
    typingTimer.current = window.setTimeout(() => { typingTimer.current = null; setPendingId(null); }, 550);
  };
  const navigate = (hash: string) => {
    setOpen(false);
    const section = document.getElementById(hash.slice(1));
    if (section) {
      const previous = section.getAttribute("tabindex");
      section.setAttribute("tabindex", "-1"); section.focus({ preventScroll: true });
      section.addEventListener("blur", () => { if (previous === null) section.removeAttribute("tabindex"); else section.setAttribute("tabindex", previous); }, { once: true });
    }
  };

  return <div ref={dockRef} className="assistant-dock" data-open={open} data-invitation={invitation && !open}>
    <button ref={launcherRef} type="button" className="assistant-launcher" aria-label={open ? t.assistant.close : t.assistant.title} aria-describedby={open ? undefined : "assistant-invitation-label"} aria-expanded={open} aria-controls={open ? "portfolio-assistant-panel" : undefined} aria-haspopup="dialog" onPointerEnter={(event) => { if (event.pointerType === "mouse") pulse(); }} onClick={() => { if (open) close(); else openPanel(); }}>
      <span className="assistant-character"><span className="assistant-character-visual"><AssistantCharacter onReady={characterReady} /></span></span>
    </button>
    {open && <AssistantPanel turns={turns} pendingId={pendingId} onAsk={ask} onClose={close} onNavigate={navigate} />}
    {!open && <button ref={invitationRef} type="button" className="assistant-invitation" aria-label={t.assistant.launcher} aria-haspopup="dialog" onClick={openPanel}><span id="assistant-invitation-label">{t.assistant.launcher}</span></button>}
  </div>;
}
