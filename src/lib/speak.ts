type SpeakOptions = { pitch?: number; rate?: number };

let voicesLoaded = false;
let cancelled = false;

function loadVoices(): Promise<void> {
  return new Promise((resolve) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) { voicesLoaded = true; resolve(); return; }
    window.speechSynthesis.onvoiceschanged = () => { voicesLoaded = true; resolve(); };
    setTimeout(resolve, 1000);
  });
}

function getBestVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const preferred = ["Samantha","Karen","Moira","Tessa","Victoria","Aria","Jenny","Emma","Zira"];
  for (const name of preferred) {
    const match = voices.find(v => v.name.includes(name) && v.lang.startsWith("en"));
    if (match) return match;
  }
  return voices.find(v => v.lang.startsWith("en-US") && v.localService)
    ?? voices.find(v => v.lang.startsWith("en"))
    ?? voices[0] ?? null;
}

export function stopSpeaking() {
  cancelled = true;
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

async function playUtterance(
  text: string,
  opts?: SpeakOptions,
  onWord?: (index: number) => void
): Promise<void> {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  cancelled = false;
  if (!voicesLoaded) await loadVoices();
  if (cancelled) return;

  return new Promise((resolve) => {
    if (cancelled) { resolve(); return; }
    const utter = new SpeechSynthesisUtterance(text);
    // Normal speed — not too slow or it garbles
    utter.pitch = opts?.pitch ?? 1.1;
    utter.rate  = opts?.rate  ?? 0.9;
    utter.volume = 1;
    const voice = getBestVoice();
    if (voice) utter.voice = voice;

    if (onWord) {
      const words = text.split(/\s+/).filter(Boolean);
      let idx = 0;
      utter.onboundary = (e) => {
        if (cancelled) return;
        if (e.name === "word" && idx < words.length) onWord(idx++);
      };
    }
    utter.onend = () => resolve();
    utter.onerror = () => resolve();
    if (!cancelled) window.speechSynthesis.speak(utter);
    else resolve();
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
