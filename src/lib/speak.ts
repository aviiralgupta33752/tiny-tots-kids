import meSpeak from "mespeak";
import meSpeakConfig from "mespeak/src/mespeak_config.json";
import usVoice from "mespeak/voices/en/en-us.json";

type SpeakOptions = { pitch?: number; rate?: number };

// Offline generated audio: no paid credits and no dependency on browser voices.
let audio: HTMLAudioElement | null = null;
let ready = false;
let playId = 0;
const cache = new Map<string, string>();

function ensureReady() {
  if (ready || typeof window === "undefined") return;
  meSpeak.loadConfig(meSpeakConfig);
  meSpeak.loadVoice(usVoice);
  ready = true;
}

function toVoiceOptions(opts?: SpeakOptions) {
  return {
    rawdata: "mime" as const,
    amplitude: 100,
    pitch: Math.round(Math.min(99, Math.max(25, (opts?.pitch ?? 1.12) * 50))),
    speed: Math.round(Math.min(220, Math.max(120, (opts?.rate ?? 0.9) * 175))),
    wordgap: 2,
    volume: 1,
    variant: "f2",
  };
}

function cacheKey(text: string, opts?: SpeakOptions) {
  const voice = toVoiceOptions(opts);
  return `${text}|${voice.pitch}|${voice.speed}`;
}

function getAudioSrc(text: string, opts?: SpeakOptions) {
  ensureReady();
  const key = cacheKey(text, opts);
  const cached = cache.get(key);
  if (cached) return cached;
  const src = meSpeak.speak(text, toVoiceOptions(opts));
  if (typeof src !== "string") return null;
  cache.set(key, src);
  return src;
}

export function stopSpeaking() {
  playId += 1;
  meSpeak.resetQueue?.();
  meSpeak.stop?.();
  if (!audio) return;
  audio.pause();
  audio.removeAttribute("src");
  audio = null;
}

function playGeneratedAudio(
  text: string,
  opts?: SpeakOptions,
  onWord?: (index: number) => void,
): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const src = getAudioSrc(text, opts);
  if (!src) return Promise.resolve();

  stopSpeaking();
  const id = playId + 1;
  playId = id;
  const words = text.split(/\s+/).filter(Boolean);
  const player = new Audio(src);
  player.volume = 1;
  audio = player;

  return new Promise((resolve) => {
    let timer = 0;
    let resolved = false;
    const cleanup = () => {
      if (resolved) return;
      resolved = true;
      if (timer) window.clearInterval(timer);
      if (audio === player) audio = null;
      resolve();
    };

    player.onplay = () => {
      if (!onWord || !words.length || id !== playId) return;
      let idx = 0;
      onWord(idx);
      const interval = Math.max(260, Math.min(560, (player.duration * 1000) / Math.max(words.length, 1)) || 430);
      timer = window.setInterval(() => {
        idx += 1;
        if (idx < words.length && id === playId) onWord(idx);
      }, interval);
    };
    player.onended = cleanup;
    player.onerror = cleanup;
    void player.play().catch((error) => {
      console.warn("Audio failed:", error);
      cleanup();
    });
  });
}

export function speak(text: string, opts?: SpeakOptions) {
  void playGeneratedAudio(text, opts);
}

/** Speak with optional per-word callback. Resolves when finished. */
export function speakText(
  text: string,
  onWord?: (index: number) => void,
  opts?: SpeakOptions,
): Promise<void> {
  return playGeneratedAudio(text, opts, onWord);
}

export function prewarm(texts: string[]) {
  if (typeof window === "undefined") return;
  ensureReady();
  for (const text of texts) getAudioSrc(text);
}
