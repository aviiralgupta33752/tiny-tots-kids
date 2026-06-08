// Browser-native speech: instant, no quota, works offline.
// Runs synchronously inside click handlers so browsers don't block it.

let current: SpeechSynthesisUtterance | null = null;
let voicesReady = false;
let preferredVoice: SpeechSynthesisVoice | null = null;

function pickVoice() {
  if (typeof window === "undefined") return null;
  const synth = window.speechSynthesis;
  if (!synth) return null;
  const voices = synth.getVoices();
  if (!voices.length) return null;
  // Prefer warm/child-friendly english voices
  const preferred = [
    /Google US English/i,
    /Samantha/i,
    /Karen/i,
    /Microsoft (Zira|Aria|Jenny)/i,
    /English \(United States\)/i,
    /en-US/i,
    /en-GB/i,
  ];
  for (const re of preferred) {
    const v = voices.find((v) => re.test(v.name) || re.test(v.lang));
    if (v) return v;
  }
  return voices.find((v) => v.lang?.startsWith("en")) ?? voices[0];
}

if (typeof window !== "undefined" && window.speechSynthesis) {
  const load = () => {
    preferredVoice = pickVoice();
    voicesReady = true;
  };
  load();
  window.speechSynthesis.onvoiceschanged = load;
}

export function stopSpeaking() {
  if (typeof window === "undefined") return;
  window.speechSynthesis?.cancel();
  current = null;
}

export function speak(text: string, opts?: { pitch?: number; rate?: number }) {
  if (typeof window === "undefined") return;
  const synth = window.speechSynthesis;
  if (!synth) return;
  // Must run synchronously inside the gesture — no awaits before .speak().
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  if (!preferredVoice && voicesReady) preferredVoice = pickVoice();
  if (preferredVoice) u.voice = preferredVoice;
  u.lang = preferredVoice?.lang ?? "en-US";
  u.rate = opts?.rate ?? 0.95;
  u.pitch = opts?.pitch ?? 1.25;
  u.volume = 1;
  current = u;
  synth.speak(u);
}

/** Speak with optional per-word callback. Resolves when finished. */
export function speakText(
  text: string,
  onWord?: (index: number) => void,
  opts?: { pitch?: number; rate?: number },
): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const synth = window.speechSynthesis;
  if (!synth) return Promise.resolve();
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  if (!preferredVoice && voicesReady) preferredVoice = pickVoice();
  if (preferredVoice) u.voice = preferredVoice;
  u.lang = preferredVoice?.lang ?? "en-US";
  u.rate = opts?.rate ?? 0.95;
  u.pitch = opts?.pitch ?? 1.25;
  current = u;

  return new Promise((resolve) => {
    let timer = 0;
    const words = text.split(/\s+/).filter(Boolean);
    const cleanup = () => {
      if (timer) window.clearInterval(timer);
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
        // Fallback timer if onboundary doesn't fire (some browsers)
        let idx = 0;
        onWord(idx);
        timer = window.setInterval(() => {
          idx += 1;
          if (idx < words.length) onWord(idx);
        }, 420);
      };
    }
    u.onend = cleanup;
    u.onerror = cleanup;
    synth.speak(u);
  });
}

export function prewarm(_texts: string[]) {
  /* no-op with browser TTS */
}
