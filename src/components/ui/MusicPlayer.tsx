import { useEffect, useRef, useState } from "react";
import { Music2, Pause, Play, Volume2 } from "lucide-react";
import { usePreferences } from "../../hooks/usePreferences";
import { audioTracks, checkAudio, markAudioUnavailable } from "../../lib/audio";
import { readPreference, writePreference } from "../../lib/preferences";
import type { Language } from "../../lib/preferences";

function initialVolume() {
  const stored = readPreference("portfolio-volume");
  const value = stored === null ? NaN : Number(stored);
  return Number.isFinite(value) && value >= 0 && value <= 1 ? value : 0.35;
}

export default function MusicPlayer() {
  const { language, t } = usePreferences();
  const audioRef = useRef<HTMLAudioElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hintRef = useRef<HTMLButtonElement>(null);
  const playbackIntent = useRef(false);
  const playbackRequest = useRef(0);
  const [track, setTrack] = useState<{ language: Language; available: boolean }>({ language, available: false });
  const [playing, setPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [checkedLanguage, setCheckedLanguage] = useState<Language | null>(null);
  const [volume, setVolume] = useState(initialVolume);
  const available = track.language === language && track.available;
  const showHint = available && !hasStarted;

  useEffect(() => {
    const audio = audioRef.current;
    playbackIntent.current = false;
    playbackRequest.current++;
    audio?.pause();
    setPlaying(false);
    if (audio) { audio.removeAttribute("src"); audio.load(); }
    let active = true;
    checkAudio(language).then((exists) => {
      if (active) { setTrack({ language, available: exists }); setCheckedLanguage(language); }
    });
    return () => {
      active = false;
      audio?.pause();
      // Release the previous track on language changes and unmount.
      if (audio) { audio.removeAttribute("src"); audio.load(); }
    };
  }, [language]);

  useEffect(() => { if (audioRef.current) audioRef.current.volume = volume; }, [volume, language]);

  const unavailable = () => {
    playbackIntent.current = false;
    playbackRequest.current++;
    markAudioUnavailable(language);
    setTrack({ language, available: false });
    setPlaying(false);
  };
  const toggle = () => {
    const audio = audioRef.current;
    if (!audio || !available) return;
    const request = ++playbackRequest.current;
    // Also allow pausing while play() is still waiting for the network.
    if (!playbackIntent.current) {
      playbackIntent.current = true;
      // Assign a source only after an explicit user gesture. Never autoplay.
      if (!audio.getAttribute("src")) audio.src = audioTracks[language];
      void audio.play().then(() => {
        if (audioRef.current !== audio || !playbackIntent.current) audio.pause();
      }).catch((error: unknown) => {
        if (audioRef.current !== audio || request !== playbackRequest.current) return;
        playbackIntent.current = false;
        setPlaying(false);
        // An interrupted play or a browser policy rejection is retryable;
        // only an actual media/load failure makes this track unavailable.
        if (audio.error || (error instanceof DOMException && error.name === "NotSupportedError")) unavailable();
      });
    } else {
      playbackIntent.current = false;
      audio.pause();
      setPlaying(false);
    }
  };
  const label = !available ? (checkedLanguage === language ? t.music.unavailable : t.music.checking) : playing ? t.music.pause : t.music.play;

  return <div className="music-control" data-play-hint={showHint}>
    <audio key={language} ref={audioRef} preload="none" id="portfolio-audio" onPlay={(event) => { if (playbackIntent.current) setPlaying(true); else event.currentTarget.pause(); }} onPlaying={(event) => {
      if (event.currentTarget !== audioRef.current || !playbackIntent.current || event.currentTarget.paused) return;
      setHasStarted(true);
      // Keep keyboard focus on the playback control when its hint disappears.
      if (hintRef.current && document.activeElement === hintRef.current) buttonRef.current?.focus({ preventScroll: true });
    }} onPause={(event) => { if (event.currentTarget === audioRef.current && event.currentTarget.paused) { playbackIntent.current = false; setPlaying(false); } }} onEnded={() => { playbackIntent.current = false; setPlaying(false); }} onError={(event) => { if (event.currentTarget === audioRef.current && event.currentTarget.getAttribute("src") === audioTracks[language]) unavailable(); }} />
    <button ref={buttonRef} type="button" className="icon-button music-button" onClick={toggle} aria-label={label} title={label} aria-controls="portfolio-audio" aria-describedby={showHint ? "music-play-hint" : undefined} aria-pressed={available && playing} disabled={!available}>
      {!available ? <Music2 aria-hidden="true" size={18} /> : playing ? <Pause aria-hidden="true" size={18} /> : <Play aria-hidden="true" size={18} />}
    </button>
    <span className="sr-only" role="status">{!available ? label : ""}</span>
    {showHint && <button ref={hintRef} id="music-play-hint" type="button" className="music-play-hint" onClick={toggle} aria-label={t.music.play} aria-controls="portfolio-audio">PLAY</button>}
    {available && <div className="music-volume">
      <Volume2 aria-hidden="true" size={16} />
      <input type="range" min="0" max="1" step="0.05" value={volume} aria-label={t.music.volume} title={t.music.volume} onChange={(event) => { const value = Number(event.target.value); setVolume(value); writePreference("portfolio-volume", String(value)); }} />
    </div>}
  </div>;
}
