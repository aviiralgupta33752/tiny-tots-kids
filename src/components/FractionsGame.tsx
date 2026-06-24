import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

type Mode = "learn" | "quiz";

interface FractionDef { num: number; den: number; label: string; }
const FRACTIONS: FractionDef[] = [
  { num: 1, den: 2, label: "one half" },
  { num: 1, den: 4, label: "one quarter" },
  { num: 3, den: 4, label: "three quarters" },
  { num: 1, den: 3, label: "one third" },
  { num: 2, den: 4, label: "two quarters" },
];

function PieChart({ num, den, size = 160 }: { num: number; den: number; size?: number }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 8;
  const slices = [];
  const anglePer = 360 / den;

  for (let i = 0; i < den; i++) {
    const startAngle = (i * anglePer - 90) * (Math.PI / 180);
    const endAngle = ((i + 1) * anglePer - 90) * (Math.PI / 180);
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const filled = i < num;
    slices.push(
      <path key={i}
        d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 0,1 ${x2},${y2} Z`}
        fill={filled ? "#ff8fab" : "white"}
        stroke="#333" strokeWidth={2} />
    );
  }
  return <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>{slices}</svg>;
}

export function FractionsGame() {
  const [mode, setMode] = useState<Mode>("learn");
  return (
    <div className="card-soft mx-auto max-w-2xl p-6">
      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => setMode("learn")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "learn" ? "bg-pink text-white" : "bg-muted"}`}>
          📖 Learn
        </button>
        <button onClick={() => setMode("quiz")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "quiz" ? "bg-pink text-white" : "bg-muted"}`}>
          ❓ Quiz
        </button>
      </div>
      {mode === "learn" ? <LearnFractions /> : <FractionsQuiz />}
    </div>
  );
}

function LearnFractions() {
  const [index, setIndex] = useState(0);
  const f = FRACTIONS[index];

  return (
    <div className="text-center">
      <p className="mb-4 text-sm font-semibold text-muted-foreground">A fraction shows part of a whole!</p>
      <div className="flex justify-center mb-4">
        <PieChart num={f.num} den={f.den} />
      </div>
      <div className="font-display text-3xl font-bold mb-1">
        <span className="inline-block border-b-2 border-foreground px-2">{f.num}</span>
        <br />
        <span className="inline-block px-2">{f.den}</span>
      </div>
      <p className="text-sm text-muted-foreground mb-4">{f.label}</p>
      <button onClick={() => speak(`This is ${f.label}. ${f.num} out of ${f.den} parts are colored.`)}
        className="mb-4 rounded-xl bg-lilac px-5 py-2 font-bold text-sm">
        🔊 Hear it
      </button>
      <div className="flex justify-center gap-2 flex-wrap">
        {FRACTIONS.map((fr, i) => (
          <button key={i} onClick={() => setIndex(i)}
            className={`rounded-xl px-3 py-2 text-sm font-bold transition ${index === i ? "bg-pink text-white" : "bg-muted"}`}>
            {fr.num}/{fr.den}
          </button>
        ))}
      </div>
    </div>
  );
}

function FractionsQuiz() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  function buildRound(r: number) {
    const correctF = FRACTIONS[r % FRACTIONS.length];
    const others = FRACTIONS.filter(f => f.label !== correctF.label).sort(() => Math.random() - 0.5).slice(0, 2);
    const options = [correctF, ...others].sort(() => Math.random() - 0.5);
    return { correctF, options };
  }

  const [data, setData] = useState(() => buildRound(0));

  function pick(label: string) {
    if (selected) return;
    setSelected(label);
    if (label === data.correctF.label) {
      addStars(2);
      setScore(s => s + 1);
      speak(`Yes! That's ${data.correctF.label}!`);
    } else {
      speak(`That's ${data.correctF.label}.`);
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
      <p className="mb-4 text-lg font-bold">Which fraction is shown?</p>
      <div className="flex justify-center mb-4">
        <PieChart num={data.correctF.num} den={data.correctF.den} size={140} />
      </div>
      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-4">
        {data.options.map(f => {
          const showState = selected !== null;
          const isCorrect = f.label === data.correctF.label;
          return (
            <button key={f.label} onClick={() => pick(f.label)} disabled={!!selected}
              className={`font-display text-lg font-bold rounded-2xl p-4 transition ${
                showState && isCorrect ? "bg-green-200 scale-105" :
                showState && selected === f.label ? "bg-red-200" :
                "bg-sky/30 hover:scale-105"
              }`}>
              {f.num}/{f.den}
            </button>
          );
        })}
      </div>
      {selected && (
        <button onClick={next} className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white">Next →</button>
      )}
    </div>
  );
}
