type SpeakOptions = { pitch?: number; rate?: number };

let currentUtterance: SpeechSynthesisUtterance | null = null;

function getBestVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  // Prefer child-friendly / US English voices
  const preferred = voices.find(
    (v) =>
      v.lang.startsWith("en") &&
      /samantha|karen|moira|victoria|zira|aria|jenny|guy|emma|brian/i.test(v.name)
  );
  return preferred ?? voices.find((v) => v.lang.startsWith("en")) ?? voices[0] ?? null;
}

export function stopSpeaking() {
  if (typeof window === "undefined") return;
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

function playUtterance(
  text: string,
  opts?: SpeakOptions,
  onWord?: (index: number) => void
): Promise<void> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return Promise.resolve();
  }

  stopSpeaking();

  return new Promise((resolve) => {
    const utter = new SpeechSynthesisUtterance(text);
    currentUtterance = utter;

    utter.pitch = Math.min(2, Math.max(0, opts?.pitch ?? 1.1));
    utter.rate = Math.min(2, Math.max(0.5, opts?.rate ?? 0.88));
    utter.volume = 1;

    // Set voice — voices may not be loaded yet, so try after a tick
    const assignVoice = () => {
      const voice = getBestVoice();
      if (voice) utter.voice = voice;
    };
    assignVoice();
    if (!utter.voice) {
      window.speechSynthesis.onvoiceschanged = () => {
        assignVoice();
        window.speechSynthesis.onvoiceschanged = null;
      };
    }

    if (onWord) {
      const words = text.split(/\s+/).filter(Boolean);
      let idx = 0;
      utter.onboundary = (e) => {
        if (e.name === "word" && idx < words.length) {
          onWord(idx++);
        }
      };
    }

    utter.onend = () => {
      currentUtterance = null;
      resolve();
    };
    utter.onerror = () => {
      currentUtterance = null;
      resolve();
    };

    window.speechSynthesis.speak(utter);
  });
}

export function speak(text: string, opts?: SpeakOptions) {
  void playUtterance(text, opts);
}

/** Speak with optional per-word callback. Resolves when finished. */
export function speakText(
  text: string,
  onWord?: (index: number) => void,
  opts?: SpeakOptions
): Promise<void> {
  return playUtterance(text, opts, onWord);
}

// No-op: Web Speech API doesn't need pre-warming
export function prewarm(_texts: string[]) {}
