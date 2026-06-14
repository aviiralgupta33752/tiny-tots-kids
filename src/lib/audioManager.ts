let currentAnimal: HTMLAudioElement | null = null;
let bgCtx: AudioContext | null = null;
let bgNodes: AudioNode[] = [];
let bgPlaying = false;
let bgEnabled = true;
let bgInterval: ReturnType<typeof setInterval> | null = null;

const ANIMAL_SOUNDS: Record<string, string> = {
  "Dog":     "/dog.mp3",
  "Cat":     "/cat.mp3",
  "Cow":     "/cow.mp3",
  "Horse":   "/horse.mp3",
  "Duck":    "/duck.mp3",
  "Sheep":   "/sheep.mp3",
  "Pig":     "/pig.mp3",
  "Lion":    "/lion.mp3",
  "Monkey":  "/monkey.mp3",
  "Owl":     "/owl.mp3",
  "Frog":    "/frog.mp3",
  "Rooster": "/rooster.mp3",
};

export function playAnimalSound(name: string): void {
  const url = ANIMAL_SOUNDS[name];
  if (!url) return;
  stopAnimalSound();
  const audio = new Audio(url);
  audio.volume = 1;
  currentAnimal = audio;
  audio.play().catch(() => {
    import("@/lib/speak").then(({ speak }) => speak(name));
  });
}

export function stopAnimalSound(): void {
  if (currentAnimal) {
    currentAnimal.pause();
    currentAnimal.currentTime = 0;
    currentAnimal = null;
  }
}

export function stopAllSounds(): void {
  stopAnimalSound();
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

// Background Music via Web Audio API
const MELODY = [261.63,293.66,329.63,349.23,392.00,440.00,493.88,523.25];
const TUNE   = [0,2,4,2,0,0,0,2,2,2,0,4,4,0,2,4,2,0,0,0,2,2,0,2,0];

function playNote(freq: number, start: number, dur: number, ctx: AudioContext) {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain); gain.connect(ctx.destination);
  osc.type = "sine"; osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(0.05, start + 0.02);
  gain.gain.linearRampToValueAtTime(0, start + dur - 0.02);
  osc.start(start); osc.stop(start + dur);
  bgNodes.push(osc, gain);
}

function scheduleMelody() {
  if (!bgCtx || !bgPlaying) return;
  const ctx = bgCtx; const now = ctx.currentTime; const len = 0.45;
  TUNE.forEach((idx, i) => playNote(MELODY[idx], now + i * len, len * 0.85, ctx));
}

export function startBgMusic(): void {
  if (bgPlaying || !bgEnabled) return;
  try {
    bgCtx = new AudioContext(); bgPlaying = true;
    scheduleMelody();
    const total = TUNE.length * 0.45 * 1000;
    bgInterval = setInterval(scheduleMelody, total);
  } catch(_) {}
}

export function stopBgMusic(): void {
  bgPlaying = false;
  if (bgInterval) { clearInterval(bgInterval); bgInterval = null; }
  bgNodes.forEach(n => { try { (n as OscillatorNode).stop?.(); } catch(_) {} });
  bgNodes = [];
  if (bgCtx) { bgCtx.close().catch(()=>{}); bgCtx = null; }
}

export function toggleBgMusic(): boolean {
  bgEnabled = !bgEnabled;
  if (bgEnabled) startBgMusic(); else stopBgMusic();
  return bgEnabled;
}

export function isBgMusicEnabled(): boolean { return bgEnabled; }
