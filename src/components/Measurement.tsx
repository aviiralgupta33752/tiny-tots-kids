import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

type Mode = "learn" | "compare" | "quiz";

interface Obj { name: string; emoji: string; length: number; } // length in "units"
const OBJECTS: Obj[] = [
  { name: "Pencil", emoji: "✏️", length: 3 },
  { name: "Crayon", emoji: "🖍️", length: 2 },
  { name: "Book",   emoji: "📕", length: 5 },
  { name: "Ruler",  emoji: "📏", length: 6 },
  { name: "Shoe",   emoji: "👟", length: 4 },
  { name: "Spoon",  emoji: "🥄", length: 2 },
  { name: "Snake",  emoji: "🐍", length: 8 },
  { name: "Ant",    emoji: "🐜", length: 1 },
];

export function Measurement() {
  const [mode, setMode] = useState<Mode>("learn");
  return (
    <div className="card-soft mx-auto max-w-2xl p-6">
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        <button onClick={() => setMode("learn")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "learn" ? "bg-pink text-white" : "bg-muted"}`}>
          📏 Measure It
        </button>
        <button onClick={() => setMode("compare")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "compare" ? "bg-pink text-white" : "bg-muted"}`}>
          ⚖️ Compare
        </button>
        <button onClick={() => setMode("quiz")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "quiz" ? "bg-pink text-white" : "bg-muted"}`}>
          ❓ Quiz
        </button>
      </div>
      {mode === "learn" && <MeasureIt />}
      {mode === "compare" && <CompareSizes />}
      {mode === "quiz" && <MeasureQuiz />}
    </div>
  );
}

function MeasureIt() {
  const [index, setIndex] = useState(0);
  const obj = OBJECTS[index];

  return (
    <div className="text-center">
      <p className="mb-4 text-sm font-semibold text-muted-foreground">We measure length in units!</p>
      <div className="text-5xl mb-3">{obj.emoji}</div>
      <div className="flex justify-center items-center gap-1 mb-3">
        {Array.from({ length: obj.length }).map((_, i) => (
          <div key={i} className="w-8 h-8 bg-sky/40 border border-sky rounded flex items-center justify-center text-xs font-bold">
            {i + 1}
          </div>
        ))}
      </div>
      <p className="font-display text-xl font-bold mb-4">The {obj.name} is {obj.length} units long!</p>
      <button onClick={() => speak(`The ${obj.name} is ${obj.length} units long.`)}
        className="mb-4 rounded-xl bg-lilac px-5 py-2 font-bold text-sm">
        🔊 Hear it
      </button>
      <div className="flex flex-wrap justify-center gap-2">
        {OBJECTS.map((o, i) => (
          <button key={o.name} onClick={() => setIndex(i)}
            className={`rounded-xl px-3 py-2 text-xs font-bold transition ${i === index ? "bg-pink text-white" : "bg-muted"}`}>
            {o.emoji} {o.name}
          </button>
        ))}
      </div>
    </div>
  );
}

function CompareSizes() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  function buildRound(r: number) {
    const shuffled = [...OBJECTS].sort(() => Math.random() - 0.5);
    const [a, b] = shuffled.slice(0, 2);
    const longer = a.length > b.length ? a : b;
    return { a, b, longer };
  }

  const [data, setData] = useState(() => buildRound(0));

  function pick(name: string) {
    if (selected !== null) return;
    setSelected(name);
    if (name === data.longer.name) {
      addStars(2);
      setScore(s => s + 1);
      speak(`Yes! The ${data.longer.name} is longer!`);
    } else {
      speak(`The ${data.longer.name} is longer.`);
    }
  }

  function next() {
    const newRound = round + 1;
    setRound(newRound);
    setData(buildRound(newRound));
    setSelected(null);
  }

  return (
    <div className="text-center">
      <div className="mb-3 text-sm font-bold">⭐ {score} correct</div>
      <p className="mb-4 text-lg font-bold">Which one is longer?</p>
      <div className="flex justify-center gap-6 mb-6">
        {[data.a, data.b].map(obj => {
          const showState = selected !== null;
          const isCorrect = obj.name === data.longer.name;
          return (
            <button key={obj.name} onClick={() => pick(obj.name)} disabled={selected !== null}
              className={`rounded-2xl p-6 transition ${
                showState && isCorrect ? "bg-green-200 scale-105" :
                showState && selected === obj.name ? "bg-red-200" :
                "bg-butter/40 hover:scale-105"
              }`}>
              <div className="text-5xl mb-2">{obj.emoji}</div>
              <div className="font-bold text-sm">{obj.name}</div>
              {showState && <div className="text-xs text-muted-foreground">{obj.length} units</div>}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <button onClick={next} className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white">Next →</button>
      )}
    </div>
  );
}

function MeasureQuiz() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const obj = OBJECTS[round % OBJECTS.length];
  const options = (() => {
    const others = new Set<number>();
    while (others.size < 2) {
      const c = Math.max(1, obj.length + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1));
      if (c !== obj.length) others.add(c);
    }
    return [obj.length, ...others].sort(() => Math.random() - 0.5);
  })();

  function pick(n: number) {
    if (selected !== null) return;
    setSelected(n);
    if (n === obj.length) {
      addStars(2);
      setScore(s => s + 1);
      speak(`Yes! The ${obj.name} is ${obj.length} units long!`);
    } else {
      speak(`The ${obj.name} is ${obj.length} units long.`);
    }
  }

  function next() {
    setRound(r => r + 1);
    setSelected(null);
  }

  return (
    <div className="text-center">
      <div className="mb-3 text-sm font-bold">⭐ {score} correct</div>
      <div className="text-5xl mb-3">{obj.emoji}</div>
      <p className="mb-4 text-lg font-bold">How many units long is the {obj.name}?</p>
      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-4">
        {options.map(n => {
          const showState = selected !== null;
          const isCorrect = n === obj.length;
          return (
            <button key={n} onClick={() => pick(n)} disabled={selected !== null}
              className={`font-display text-xl font-bold rounded-2xl p-4 transition ${
                showState && isCorrect ? "bg-green-200 scale-105" :
                showState && selected === n ? "bg-red-200" :
                "bg-sky/30 hover:scale-105"
              }`}>
              {n}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <button onClick={next} className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white">Next →</button>
      )}
    </div>
  );
}
