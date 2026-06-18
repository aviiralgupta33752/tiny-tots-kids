import { useRef, useState } from "react";
import { speak } from "@/lib/speak";

// Twinkle Twinkle / ABC Song melody - public domain (18th c. French folk tune
// "Ah! vous dirai-je, maman"). Notes in Hz for octave 4-5.
const NOTE_FREQ: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88, C5: 523.25,
};

// "Twinkle Twinkle" / ABC Song melody line: C C G G A A G  F F E E D D C  G G F F E E D  G G F F E E D  C C G G A A G  F F E E D D C
const ABC_MELODY: [string, number][] = [
  ["C4",1],["C4",1],["G4",1],["G4",1],["A4",1],["A4",1],["G4",2],
  ["F4",1],["F4",1],["E4",1],["E4",1],["D4",1],["D4",1],["C4",2],
  ["G4",1],["G4",1],["F4",1],["F4",1],["E4",1],["E4",1],["D4",2],
  ["G4",1],["G4",1],["F4",1],["F4",1],["E4",1],["E4",1],["D4",2],
  ["C4",1],["C4",1],["G4",1],["G4",1],["A4",1],["A4",1],["G4",2],
  ["F4",1],["F4",1],["E4",1],["E4",1],["D4",1],["D4",1],["C4",2],
];

const ABC_LYRICS = [
  "A","B","C","D","E","F","G",
  "H","I","J","K","L","M","N","O","P",
  "Q","R","S",
  "T","U","V",
  "W","X","Y","and Z",
  "Now I","know my","A","B","C's",
  "Next time","won't you","sing with","me",
];

// Counting song melody (same tune, numbers 1-10 + "Count with me!")
const COUNT_LYRICS = [
  "One,","two,","three,","four,","five,",
  "six,","seven,","eight,",
  "nine and","ten,",
  "Let's count","a-","gain!",
  "One,","two,","three,","four,","five,",
  "six,","seven,","eight,",
  "nine and","ten,",
  "Count with","me, my","friend!",
];

function playMelody(
  melody: [string, number][],
  lyrics: string[],
  onNote: (i: number) => void,
  onDone: () => void,
  tempo = 420
) {
  const ctx = new AudioContext();
  let t = ctx.currentTime + 0.1;
  const noteCount = Math.min(melody.length, lyrics.length);

  for (let i = 0; i < noteCount; i++) {
    const [note, beats] = melody[i % melody.length];
    const freq = NOTE_FREQ[note];
    const dur = beats * (tempo / 1000);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.03);
    gain.gain.linearRampToValueAtTime(0, t + dur - 0.04);
    osc.start(t);
    osc.stop(t + dur);
    const delay = (t - ctx.currentTime) * 1000;
    setTimeout(() => onNote(i), Math.max(0, delay));
    t += dur;
  }

  const totalMs = (t - ctx.currentTime) * 1000;
  setTimeout(() => { ctx.close().catch(()=>{}); onDone(); }, totalMs + 100);
}

export function SongPlayer() {
  const [playing, setPlaying] = useState<"abc" | "count" | null>(null);
  const [activeWord, setActiveWord] = useState(-1);
  const stopRef = useRef(false);

  function play(kind: "abc" | "count") {
    if (playing) return;
    setPlaying(kind);
    setActiveWord(-1);
    stopRef.current = false;
    const lyrics = kind === "abc" ? ABC_LYRICS : COUNT_LYRICS;
    playMelody(
      ABC_MELODY,
      lyrics,
      (i) => { if (!stopRef.current) setActiveWord(i); },
      () => { if (!stopRef.current) { setPlaying(null); setActiveWord(-1); } }
    );
  }

  function stop() {
    stopRef.current = true;
    setPlaying(null);
    setActiveWord(-1);
  }

  const lyrics = playing === "abc" ? ABC_LYRICS : playing === "count" ? COUNT_LYRICS : [];

  return (
    <div className="card-soft mx-auto max-w-2xl p-6 text-center">
      <p className="mb-4 text-sm font-semibold text-muted-foreground">Sing along and learn!</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <button onClick={() => play("abc")} disabled={!!playing}
          className={`rounded-3xl p-6 transition ${playing === "abc" ? "bg-pink scale-105 shadow-lg" : "bg-butter hover:scale-105"} disabled:opacity-50`}>
          <div className="text-4xl mb-2">🔤</div>
          <div className="font-display text-lg font-bold">ABC Song</div>
        </button>
        <button onClick={() => play("count")} disabled={!!playing}
          className={`rounded-3xl p-6 transition ${playing === "count" ? "bg-pink scale-105 shadow-lg" : "bg-sky hover:scale-105"} disabled:opacity-50`}>
          <div className="text-4xl mb-2">🔢</div>
          <div className="font-display text-lg font-bold">Counting Song</div>
        </button>
      </div>

      {playing && (
        <div className="rounded-3xl bg-mint/30 p-6 mb-4 min-h-32 flex flex-wrap gap-2 justify-center items-center content-center">
          {lyrics.map((word, i) => (
            <span key={i}
              className={`font-display text-xl font-bold transition-all px-1 rounded-lg ${
                i === activeWord ? "bg-pink text-white scale-125" :
                i < activeWord ? "text-muted-foreground" : "text-foreground/40"
              }`}>
              {word}
            </span>
          ))}
        </div>
      )}

      {playing && (
        <button onClick={stop} className="rounded-2xl bg-muted px-6 py-3 font-bold">
          ⏹️ Stop
        </button>
      )}

      {!playing && (
        <p className="text-xs text-muted-foreground mt-2">Tap a song above to start singing along!</p>
      )}
    </div>
  );
}
