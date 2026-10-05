import { useEffect, useRef, useState } from "react";
import { Send, X } from "lucide-react";
import { getAssistantAnswer, suggestedQuestions } from "../../data/assistant";
import type { AssistantPrompt, AssistantTurn } from "../../data/assistant";
import { usePreferences } from "../../hooks/usePreferences";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import AssistantCharacter from "./AssistantCharacter";
import AssistantMessage from "./AssistantMessage";

interface Props {
  turns: readonly AssistantTurn[];
  pendingId: number | null;
  onAsk: (prompt: AssistantPrompt) => void;
  onClose: () => void;
  onNavigate: (hash: string) => void;
}

export default function AssistantPanel({ turns, pendingId, onAsk, onClose, onNavigate }: Props) {
  const { t, language } = usePreferences();
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const closeRef = useRef<HTMLButtonElement>(null);
  const latestRef = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  useEffect(() => { closeRef.current?.focus({ preventScroll: true }); }, []);
  useEffect(() => {
    const log = logRef.current;
    const latest = latestRef.current;
    if (log && latest) log.scrollTo({ top: Math.max(0, latest.offsetTop - 12), behavior: reducedMotion ? "instant" : "smooth" });
  }, [turns.length, pendingId, language, reducedMotion]);

  return <section id="portfolio-assistant-panel" className="assistant-panel" role="dialog" aria-modal="false" aria-labelledby="portfolio-assistant-title">
    <header className="assistant-panel-header">
      <div className="assistant-panel-avatar"><AssistantCharacter staticFrame /></div>
      <h2 id="portfolio-assistant-title">{t.assistant.title}</h2>
      <button ref={closeRef} type="button" className="icon-button" aria-label={t.assistant.close} title={t.assistant.close} onClick={onClose}><X aria-hidden="true" size={18} /></button>
    </header>
    <div ref={logRef} className="assistant-log" role="log" aria-label={t.assistant.conversation} aria-live="polite" aria-relevant="additions text" tabIndex={0}>
      <div className="assistant-answer"><p>{t.assistant.welcome}</p></div>
      {turns.map((turn) => <div key={turn.id} className="assistant-turn" ref={turn.id === turns[turns.length - 1]?.id ? latestRef : undefined}>
        <p className="assistant-question"><span className="sr-only">{t.assistant.you}: </span>{turn.prompt.kind === "suggestion" ? t.assistant.questions[turn.prompt.topic] : turn.prompt.text}</p>
        {pendingId === turn.id
          ? <div className="assistant-typing" role="status"><span>{t.assistant.typing}</span><span className="assistant-typing-dots" aria-hidden="true"><i /><i /><i /></span></div>
          : <AssistantMessage answer={getAssistantAnswer(turn.topic, t)} onNavigate={onNavigate} />}
      </div>)}
    </div>
    <div className="assistant-suggestions">
      <p>{t.assistant.suggestions}</p>
      <div id="assistant-questions" className="assistant-question-chips">{suggestedQuestions.slice(0, expanded ? undefined : 4).map((topic) => <button key={topic} type="button" onClick={() => { if (pendingId === null) onAsk({ kind: "suggestion", topic }); }} aria-disabled={pendingId !== null}>{t.assistant.questions[topic]}</button>)}</div>
      <button type="button" className="assistant-more" aria-expanded={expanded} aria-controls="assistant-questions" onClick={() => setExpanded((value) => !value)}>{expanded ? t.assistant.less : t.assistant.more}</button>
    </div>
    <form className="assistant-composer" onSubmit={(event) => {
      event.preventDefault();
      if (!input.trim() || pendingId !== null) return;
      onAsk({ kind: "text", text: input.trim() }); setInput("");
    }}>
      <label htmlFor="assistant-input" className="sr-only">{t.assistant.input}</label>
      <input id="assistant-input" type="text" value={input} onChange={(event) => setInput(event.target.value)} maxLength={240} placeholder={t.assistant.placeholder} autoComplete="off" />
      <button type="submit" className="action-primary" disabled={!input.trim() || pendingId !== null} aria-label={t.assistant.send} title={t.assistant.send}><Send size={18} aria-hidden="true" /></button>
    </form>
    <p className="assistant-source">{t.assistant.source}</p>
  </section>;
}
