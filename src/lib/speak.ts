type SpeakOptions = { pitch?: number; rate?: number };

let voicesLoaded = false;

function loadVoices(): Promise<void> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      voicesLoaded = true;
      resolve();
      return;
    }
    window.speechSynthesis.onvoiceschanged = () => {
      voicesLoaded = true;
      resolve();
    };
    // Fallback: resolve after 1s even if no event fires
    setTimeout(resolve, 1000);
  });
}

function getBestVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang.startsWith("en-US") && v.localService) ??
    voices.find((v) => v.lang.startsWith("en")) ??
    voices[0] ??
    null
  );
}

export function stopSpeaking() {
  if (typeof window === "undefined") return;
  window.speechSynthesis.cancel();
}

async function playUtterance(
  text: string,
  opts?: SpeakOptions,
  onWord?: (index: number) => void
): Promise<void> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  if (!voicesLoaded) await loadVoices();

  return new Promise((resolve) => {
    const utter = new SpeechSynthesisUtterance(text);
    utter.pitch = Math.min(2, Math.max(0, opts?.pitch ?? 1.1));
    utter.rate = Math.min(1.5, Math.max(0.5, opts?.rate ?? 0.85));
    utter.volume = 1;

    const voice = getBestVoice();
    if (voice) utter.voice = voice;

    if (onWord) {
      const words = text.split(/\s+/).filter(Boolean);
      let idx = 0;
      utter.onboundary = (e) => {
        if (e.name === "word" && idx < words.length) onWord(idx++);
      };
    }

    utter.onend = () => resolve();
    utter.onerror = (e) => {
      console.warn("Speech error:", e.error);
      resolve();
    };

    window.speechSynthesis.speak(utter);
  });
}

export function speak(text: string, opts?: SpeakOptions) {
  void playUtterance(text, opts);
}

export function speakText(
  text: string,
  onWord?: (index: number) => void,
  opts?: SpeakOptions
): Promise<void> {
  return playUtterance(text, opts, onWord);
}

export function prewarm(_texts: string[]) {
  if (typeof window !== "undefined") loadVoices();
}
