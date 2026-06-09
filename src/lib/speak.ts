import meSpeak from "mespeak";
import meSpeakConfig from "mespeak/src/mespeak_config.json";
import usVoice from "mespeak/voices/en/en-us.json";

// Offline generated audio first, with browser-native speech kept as a backup.
// IMPORTANT: speak() must be called directly from a tap/click handler.

let current: SpeechSynthesisUtterance | null = null;
let preferredVoice: SpeechSynthesisVoice | null = null;
let fallbackAudio: HTMLAudioElement | null = null;
let fallbackReady = false;
let speakId = 0;

function ensureFallbackReady() {
  if (fallbackReady || typeof window === "undefined") return;
  meSpeak.loadConfig(meSpeakConfig);
  meSpeak.loadVoice(usVoice);
  fallbackReady = true;
}

function stopFallbackAudio() {
  meSpeak.resetQueue?.();
  meSpeak.stop?.();
  if (!fallbackAudio) return;
  fallbackAudio.pause();
  fallbackAudio.src = "";
  fallbackAudio = null;
}

function speakWithFallback(
  text: string,
  opts?: { pitch?: number; rate?: number },
  onWord?: (index: number) => void,
): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  ensureFallbackReady();
  stopFallbackAudio();
  const words = text.split(/\s+/).filter(Boolean);
  const pitch = Math.round(Math.min(99, Math.max(25, (opts?.pitch ?? 1.08) * 50)));
  const speed = Math.round(Math.min(220, Math.max(120, (opts?.rate ?? 0.88) * 175)));
  const src = meSpeak.speak(text, {
    rawdata: "mime",
    amplitude: 100,
    pitch,
    speed,
    wordgap: 2,
    volume: 1,
    variant: "f2",
  });
  if (typeof src !== "string") return Promise.resolve();
  const audio = new Audio(src);
  audio.volume = 1;
  fallbackAudio = audio;

  return new Promise((resolve) => {
    let timer = 0;
    let resolved = false;
    const cleanup = () => {
      if (resolved) return;
      resolved = true;
      if (timer) window.clearInterval(timer);
      if (fallbackAudio === audio) fallbackAudio = null;
      resolve();
    };
    audio.onplay = () => {
      if (!onWord || !words.length) return;
      let idx = 0;
      onWord(idx);
      timer = window.setInterval(() => {
        idx += 1;
        if (idx < words.length) onWord(idx);
      }, 430);
    };
    audio.onended = cleanup;
    audio.onerror = cleanup;
    void audio.play().catch((error) => {
      console.warn("Fallback audio failed:", error);
      cleanup();
    });
  });
}

function getSynth() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return null;
  if (typeof SpeechSynthesisUtterance === "undefined") return null;
  return window.speechSynthesis;
}

function pickVoice() {
  const synth = getSynth();
  if (!synth) return null;
  const voices = synth.getVoices();
  if (!voices.length) return null;

  // Only force local voices. Some browser-provided remote voices look selectable
  // but fail silently in embedded previews, which made all audio seem broken.
  const localEnglish = voices.filter((v) => v.localService && /^en[-_]/i.test(v.lang));
  const candidates = localEnglish.length ? localEnglish : voices.filter((v) => v.localService);
  const friendly = [/Samantha/i, /Karen/i, /Jenny/i, /Aria/i, /Zira/i, /Female/i];

  for (const re of friendly) {
    const match = candidates.find((v) => re.test(v.name));
    if (match) return match;
  }

  return candidates.find((v) => /^en[-_]/i.test(v.lang)) ?? null;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  const loadVoices = () => {
    preferredVoice = pickVoice();
  };
  loadVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged", loadVoices);
}

function detachCurrent() {
  if (!current) return;
  current.onboundary = null;
  current.onerror = null;
  current.onend = null;
  current.onstart = null;
  current = null;
}

export function stopSpeaking() {
  const synth = getSynth();
  speakId += 1;
  detachCurrent();
  synth?.cancel();
  stopFallbackAudio();
}

function makeUtterance(text: string, opts?: { pitch?: number; rate?: number }, useVoice = true) {
  const u = new SpeechSynthesisUtterance(text);
  preferredVoice = pickVoice() ?? preferredVoice;
  if (useVoice && preferredVoice) u.voice = preferredVoice;
  u.lang = preferredVoice?.lang ?? "en-US";
  u.rate = opts?.rate ?? 0.88;
  u.pitch = opts?.pitch ?? 1.08;
  u.volume = 1;
  return u;
}

function startUtterance(
  synth: SpeechSynthesis,
  text: string,
  opts: { pitch?: number; rate?: number } | undefined,
  id: number,
  useVoice = true,
) {
  const utterance = makeUtterance(text, opts, useVoice);
  current = utterance;

  utterance.onend = () => {
    if (id === speakId) current = null;
  };
  utterance.onerror = (event) => {
    if (id !== speakId) return;
    current = null;

    // cancel()/rapid retaps report "canceled" or "interrupted"; retrying those
    // cancels the new sound. Only retry once for an unavailable selected voice.
    if (event.error === "voice-unavailable" && useVoice) {
      startUtterance(synth, text, opts, id, false);
      synth.resume();
      return;
    }

    console.warn(`Speech failed: ${event.error}`);
  };

  synth.speak(utterance);
  synth.resume();
}

export function speak(text: string, opts?: { pitch?: number; rate?: number }) {
  void speakWithFallback(text, opts);
  return;

  const synth = getSynth();
  if (!synth) {
    return;
  }

  // Must stay synchronous inside the click/tap handler.
  const id = speakId + 1;
  speakId = id;
  detachCurrent();
  if (synth.speaking || synth.pending || synth.paused) synth.cancel();
  synth.resume();
  startUtterance(synth, text, opts, id);
}

/** Speak with optional per-word callback. Resolves when finished. */
export function speakText(
  text: string,
  onWord?: (index: number) => void,
  opts?: { pitch?: number; rate?: number },
): Promise<void> {
  return speakWithFallback(text, opts, onWord);

  const synth = getSynth();
  if (!synth) return Promise.resolve();

  const id = speakId + 1;
  speakId = id;
  detachCurrent();
  if (synth.speaking || synth.pending || synth.paused) synth.cancel();
  synth.resume();

  return new Promise((resolve) => {
    let timer = 0;
    let resolved = false;
    const words = text.split(/\s+/).filter(Boolean);
    const u = makeUtterance(text, opts);
    current = u;

    const cleanup = () => {
      if (resolved) return;
      resolved = true;
      if (timer) window.clearInterval(timer);
      if (id === speakId) current = null;
      resolve();
    };

    if (onWord) {
      let i = 0;
      u.onboundary = (e) => {
        if (e.name === "word") {
          onWord(i);
          i += 1;
        }
      };
      u.onstart = () => {
        let idx = 0;
        onWord(idx);
        timer = window.setInterval(() => {
          idx += 1;
          if (idx < words.length) onWord(idx);
        }, 420);
      };
    }

    u.onend = cleanup;
    u.onerror = (event) => {
      if (event.error !== "canceled" && event.error !== "interrupted") {
        console.warn(`Speech failed: ${event.error}`);
      }
      cleanup();
    };

    synth.speak(u);
    synth.resume();
  });
}

export function prewarm(_texts: string[]) {
  preferredVoice = pickVoice() ?? preferredVoice;
}
