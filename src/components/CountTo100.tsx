import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

type Mode = "chart" | "skip" | "quiz";

export function CountTo100() {
  const [mode, setMode] = useState<Mode>("chart");
  return (
    <div className="card-soft mx-auto max-w-3xl p-6">
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        <button onClick={() => setMode("chart")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "chart" ? "bg-pink text-white" : "bg-muted"}`}>
          🔢 100 Chart
        </button>
        <button onClick={() => setMode("skip")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "skip" ? "bg-pink text-white" : "bg-muted"}`}>
          ⏭️ Skip Counting
        </button>
        <button onClick={() => setMode("quiz")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "quiz" ? "bg-pink text-white" : "bg-muted"}`}>
          ❓ What's Next?
        </button>
      </div>
      {mode === "chart" && <HundredChart />}
      {mode === "skip" && <SkipCounting />}
      {mode === "quiz" && <WhatsNextQuiz />}
    </div>
  );
}

function HundredChart() {
  const [lastSpoken, setLastSpoken] = useState<number | null>(null);

  function speakNumber(n: number) {
    setLastSpoken(n);
    speak(String(n));
  }

  return (
    <div className="text-center">
      <p className="mb-4 text-sm font-semibold text-muted-foreground">Tap any number to hear it!</p>
      <div className="grid grid-cols-10 gap-1 max-w-xl mx-auto">
        {Array.from({ length: 100 }, (_, i) => i + 1).map(n => (
          <button key={n} onClick={() => speakNumber(n)}
            className={`rounded-lg p-1.5 text-xs font-bold transition ${
              lastSpoken === n ? "bg-pink text-white scale-110" :
              n % 10 === 0 ? "bg-mint/40" : "bg-sky/20 hover:bg-sky/40"
            }`}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

const SKIP_OPTIONS = [
  { by: 2, label: "Count by 2s", color: "bg-pink" },
  { by: 5, label: "Count by 5s", color: "bg-sky" },
  { by: 10, label: "Count by 10s", color: "bg-mint" },
];

function SkipCounting() {
  const [by, setBy] = useState(2);
  const [revealed, setRevealed] = useState<number[]>([]);
  const sequence = Array.from({ length: 100 / by }, (_, i) => (i + 1) * by);

  function reveal(n: number, idx: number) {
    speak(String(n));
    setRevealed(prev => [...new Set([...prev, n])]);
  }

  function playAll() {
    sequence.slice(0, 10).forEach((n, i) => {
      setTimeout(() => speak(String(n)), i * 700);
    });
  }

  return (
    <div className="text-center">
      <div className="flex justify-center gap-2 mb-4">
        {SKIP_OPTIONS.map(opt => (
          <button key={opt.by} onClick={() => { setBy(opt.by); setRevealed([]); }}
            className={`rounded-2xl px-4 py-2 font-bold text-sm text-white transition ${by === opt.by ? opt.color : "bg-muted text-foreground"}`}>
            {opt.label}
          </button>
        ))}
      </div>
      <button onClick={playAll} className="mb-4 rounded-xl bg-lilac px-5 py-2 font-bold text-sm">
        🔊 Hear the first 10
      </button>
      <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
        {sequence.slice(0, 20).map((n, i) => (
          <button key={n} onClick={() => reveal(n, i)}
            className={`rounded-xl px-3 py-2 font-display font-bold text-lg transition ${
              revealed.includes(n) ? "bg-pink text-white" : "bg-butter/40 hover:scale-105"
            }`}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function WhatsNextQuiz() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  function buildRound(r: number) {
    const start = (r % 9) * 10 + Math.floor(Math.random() * 5) + 1;
    const sequence = [start, start + 1, start + 2];
    const answer = start + 3;
    const others = [answer + 1, answer - 1, answer + 2].filter(n => n !== answer);
    const options = [answer, ...others.slice(0, 2)].sort(() => Math.random() - 0.5);
    return { sequence, answer, options };
  }

  const [data, setData] = useState(() => buildRound(0));

  function pick(n: number) {
    if (selected !== null) return;
    setSelected(n);
    if (n === data.answer) {
      addStars(2);
      setScore(s => s + 1);
      speak(`Yes! ${data.answer} comes next!`);
    } else {
      speak(`Good try! ${data.answer} comes next.`);
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
      <p className="mb-4 text-lg font-bold">What number comes next?</p>
      <div className="mb-6 flex items-center justify-center gap-3">
        {data.sequence.map(n => (
          <span key={n} className="font-display text-3xl font-bold rounded-xl bg-butter/40 px-4 py-2">{n}</span>
        ))}
        <span className="font-display text-3xl font-bold rounded-xl bg-muted px-4 py-2">❓</span>
      </div>
      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-4">
        {data.options.map(n => {
          const showState = selected !== null;
          const isCorrect = n === data.answer;
          return (
            <button key={n} onClick={() => pick(n)} disabled={selected !== null}
              className={`font-display text-2xl font-bold rounded-2xl p-4 transition ${
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
