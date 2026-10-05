import type { Language } from "./preferences";

export const audioTracks: Record<Language, string> = {
  es: "/audio/portfolio-es.mp3",
  en: "/audio/portfolio-en.mp3",
};
const availability = new Map<Language, Promise<boolean>>();

export function isAudioResponse(response: Response): boolean {
  // Vite and SPA hosts may return index.html with HTTP 200 for a missing file.
  const type = response.headers.get("content-type")?.toLowerCase() ?? "";
  return response.ok && (type.startsWith("audio/") || type.startsWith("application/octet-stream"));
}
export function checkAudio(language: Language): Promise<boolean> {
  let check = availability.get(language);
  if (!check) {
    check = fetch(audioTracks[language], {
      method: "HEAD",
      // Revalidate a previously missing asset after the MP3s are added/replaced.
      cache: "no-cache",
      signal: typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(10000) : undefined,
    }).then(isAudioResponse).catch(() => false);
    availability.set(language, check);
  }
  return check;
}
export function markAudioUnavailable(language: Language): void {
  availability.set(language, Promise.resolve(false));
}
