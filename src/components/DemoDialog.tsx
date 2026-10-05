import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { usePreferences } from "../hooks/usePreferences";

export interface VideoDemo { url: string; title: string }

export default function DemoDialog({ video, onClose }: { video: VideoDemo | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { t } = usePreferences();
  useEffect(() => {
    const dialog = ref.current;
    if (!video || !dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [video]);

  if (!video) return null;
  return <dialog ref={ref} className="demo-dialog" aria-labelledby="demo-dialog-title" onCancel={onClose} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="demo-dialog-inner">
      <div className="demo-dialog-header"><h3 id="demo-dialog-title">{video.title} — {t.common.demo}</h3><button type="button" className="icon-button" onClick={onClose} aria-label={t.common.close} title={t.common.close} autoFocus><X aria-hidden="true" size={20} /></button></div>
      <div className="demo-frame"><iframe src={video.url} title={`${video.title} — ${t.common.demo}`} allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
      <div className="demo-dialog-footer"><button type="button" className="action-secondary" onClick={onClose}>{t.common.close}</button></div>
    </div>
  </dialog>;
}
