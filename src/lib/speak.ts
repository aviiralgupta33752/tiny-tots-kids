import { tts } from "./tts.functions";

const cache = new Map<string, string>();
const inflight = new Map<string, Promise<string>>();
let current: HTMLAudioElement | null = null;

export function stopSpeaking() {
  if (current) {
    current.pause();
    current.onended = null;
    current.onerror = null;
    current = null;
  }
}

async function getUrl(text: string): Promise<string> {
  const hit = cache.get(text);
  if (hit) return hit;
  let p = inflight.get(text);
  if (!p) {
    p = (async () => {
      const { audio } = await tts({ data: { text } });
      const url = `data:audio/mpeg;base64,${audio}`;
      cache.set(text, url);
      return url;
    })();
    inflight.set(text, p);
    p.finally(() => inflight.delete(text));
  }
  return p;
}

function fallback(text: string) {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  if (!synth) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.9;
  u.pitch = 1.2;
  synth.speak(u);
}

/** Fire-and-forget speak. */
export function speak(text: string) {
  void speakText(text).catch(() => {});
}

/** Speak with optional per-word callback. Resolves when audio finishes. */
export async function speakText(
  text: string,
  onWord?: (index: number) => void,
): Promise<void> {
  if (typeof window === "undefined") return;
  stopSpeaking();
  let url: string;
  try {
    url = await getUrl(text);
  } catch {
    fallback(text);
    return;
  }
  const audio = new Audio(url);
  current = audio;
  await new Promise<void>((resolve) => {
    const timers: number[] = [];
    const cleanup = () => {
      timers.forEach((t) => window.clearTimeout(t));
      if (current === audio) current = null;
      resolve();
    };
    audio.onloadedmetadata = () => {
      if (onWord && isFinite(audio.duration) && audio.duration > 0) {
        const words = text.split(/\s+/).filter(Boolean);
        const per = (audio.duration * 1000) / Math.max(1, words.length);
        words.forEach((_, i) => {
          timers.push(
            window.setTimeout(() => {
              if (current === audio) onWord(i);
            }, i * per),
          );
        });
      }
    };
    audio.onended = cleanup;
    audio.onerror = cleanup;
    audio.play().catch(cleanup);
  });
}

/** Pre-warm cache (best effort). */
export function prewarm(texts: string[]) {
  texts.forEach((t) => {
    if (!cache.has(t) && !inflight.has(t)) getUrl(t).catch(() => {});
  });
}
