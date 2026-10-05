export const ASSISTANT_PULSE_EVENT = "portfolio-assistant-pulse";
export interface AssistantPulse { x: number; y: number; radius: number; strength: number }
export interface ActiveAssistantPulse extends AssistantPulse { startedAt: number }

export function readAssistantPulse(event: Event): AssistantPulse | null {
  const detail: unknown = (event as CustomEvent<unknown>).detail;
  if (!detail || typeof detail !== "object") return null;
  const value = detail as Record<string, unknown>;
  if (![value.x, value.y, value.radius, value.strength].every((entry) => typeof entry === "number" && Number.isFinite(entry))) return null;
  return {
    x: value.x as number, y: value.y as number,
    radius: Math.min(220, Math.max(80, value.radius as number)),
    strength: Math.min(1.5, Math.max(0, value.strength as number)),
  };
}

export function emitAssistantPulse(pulse: AssistantPulse): void {
  window.dispatchEvent(new CustomEvent<AssistantPulse>(ASSISTANT_PULSE_EVENT, { detail: pulse }));
}
