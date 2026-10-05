import { useEffect, useRef, useState } from "react";
import { assistantCharacter } from "../../data/assistant";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { usePreferences } from "../../hooks/usePreferences";

export default function AssistantCharacter({ staticFrame = false, onReady }: { staticFrame?: boolean; onReady?: () => void }) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)", true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);
  const { t } = usePreferences();
  const still = reducedMotion || staticFrame;
  useEffect(() => {
    if (!still) return;
    let active = true;
    const image = new Image();
    image.onload = () => {
      if (!active) return;
      const context = canvasRef.current?.getContext("2d");
      try {
        if (context) { context.drawImage(image, 0, 0, assistantCharacter.width, assistantCharacter.height); onReady?.(); }
        else setFailed(true);
      } catch { setFailed(true); }
      image.onload = null; image.onerror = null; image.removeAttribute("src");
    };
    image.onerror = () => { if (active) setFailed(true); };
    image.src = assistantCharacter.src;
    return () => { active = false; image.onload = null; image.onerror = null; image.removeAttribute("src"); };
  }, [still, onReady]);

  if (failed) return <span className="assistant-asset-fallback">{t.assistant.assetError}</span>;
  // A still in-memory rendering respects reduced motion without editing or
  // generating a replacement for the user's original GIF.
  return still
    ? <canvas ref={canvasRef} width={assistantCharacter.width} height={assistantCharacter.height} aria-hidden="true" />
    : <img src={assistantCharacter.src} width={assistantCharacter.width} height={assistantCharacter.height} alt="" aria-hidden="true" onLoad={onReady} onError={() => setFailed(true)} decoding="async" />;
}
