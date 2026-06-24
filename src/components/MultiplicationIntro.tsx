import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

type Mode = "learn" | "arrays" | "quiz";

export function MultiplicationIntro() {
  const [mode, setMode] = useState<Mode>("learn");
  return (
    <div className="card-soft mx-auto max-w-2xl p-6">
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        <button onClick={() => setMode("learn")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "learn" ? "bg-pink text-white" : "bg-muted"}`}>
          📖 Learn
        </button>
        <button onClick={() => setMode("arrays")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "arrays" ? "bg-pink text-white" : "bg-muted"}`}>
          🔢 Groups
        </button>
        <button onClick={() => setMode("quiz")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "quiz" ? "bg-pink text-white" : "bg-muted"}`}>
          ❓ Quiz
        </button>
      </div>
      {mode === "learn" && <LearnMultiplication />}
      {mode === "arrays" && <GroupsMode />}
      {mode === "quiz" && <MultiplicationQuiz />}
    </div>
  );
}

function LearnMultiplication() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);

  return (
    <div className="text-center">
      <p className="mb-4 text-sm font-semibold text-muted-foreground">
        Multiplication means adding equal groups together!
      </p>
      <div className="font-display text-4xl font-bold mb-4">{a} × {b} = {a * b}</div>
      <div className="flex flex-wrap gap-2 justify-center mb-4 max-w-md mx-auto">
        {Array.from({ length: a }).map((_, i) => (
          <div key={i} className="flex gap-1 rounded-xl bg-butter/30 p-2">
            {Array.from({ length: b }).map((_, j) => (
              <span key={j} className="text-xl">🍎</span>
            ))}
          </div>
        ))}
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        {a} groups of {b} = {a * b} apples!
      </p>
      <button onClick={() => speak(`${a} times ${b} equals ${a * b}.`)}
        className="mb-4 rounded-xl bg-lilac px-5 py-2 font-bold text-sm">
        🔊 Hear it
      </button>
      <div className="flex justify-center gap-4">
        <div>
          <div className="text-xs font-bold mb-1">Groups</div>
          <div className="flex gap-2">
            <button onClick={() => setA(x => Math.max(1, x - 1))} className="rounded-lg bg-muted w-8 h-8 font-bold">-</button>
            <span className="font-bold w-6">{a}</span>
            <button onClick={() => setA(x => Math.min(5, x + 1))} className="rounded-lg bg-pink/70 text-white w-8 h-8 font-bold">+</button>
          </div>
        </div>
        <div>
          <div className="text-xs font-bold mb-1">Per Group</div>
          <div className="flex gap-2">
            <button onClick={() => setB(x => Math.max(1, x - 1))} className="rounded-lg bg-muted w-8 h-8 font-bold">-</button>
            <span className="font-bold w-6">{b}</span>
            <button onClick={() => setB(x => Math.min(5, x + 1))} className="rounded-lg bg-sky/70 text-white w-8 h-8 font-bold">+</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function GroupsMode() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  function buildRound(r: number) {
    const a = Math.floor(Math.random() * 4) + 2;
    const b = Math.floor(Math.random() * 4) + 2;
    const answer = a * b;
    const others = new Set<number>();
    while (others.size < 2) {
      const c = answer + (Math.floor(Math.random() * 5) - 2);
      if (c !== answer && c > 0) others.add(c);
    }
    const options = [answer, ...others].sort(() => Math.random() - 0.5);
    return { a, b, answer, options };
  }

  const [data, setData] = useState(() => buildRound(0));

  function pick(n: number) {
    if (selected !== null) return;
    setSelected(n);
    if (n === data.answer) {
      addStars(2);
      setScore(s => s + 1);
      speak(`Yes! ${data.a} times ${data.b} equals ${data.answer}!`);
    } else {
      speak(`${data.a} times ${data.b} equals ${data.answer}.`);
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
      <p className="mb-4 text-sm font-semibold text-muted-foreground">How many in total?</p>
      <div className="flex flex-wrap gap-2 justify-center mb-4 max-w-md mx-auto">
        {Array.from({ length: data.a }).map((_, i) => (
          <div key={i} className="flex gap-1 rounded-xl bg-mint/30 p-2">
            {Array.from({ length: data.b }).map((_, j) => (
              <span key={j} className="text-xl">⭐</span>
            ))}
          </div>
        ))}
      </div>
      <p className="mb-4 font-bold">{data.a} groups of {data.b}</p>
      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-4">
        {data.options.map(n => {
          const showState = selected !== null;
          const isCorrect = n === data.answer;
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

function MultiplicationQuiz() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  function buildRound(r: number) {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    const answer = a * b;
    const others = new Set<number>();
    while (others.size < 2) {
      const c = answer + (Math.floor(Math.random() * 7) - 3);
      if (c !== answer && c > 0) others.add(c);
    }
    const options = [answer, ...others].sort(() => Math.random() - 0.5);
    return { a, b, answer, options };
  }

  const [data, setData] = useState(() => buildRound(0));

  function pick(n: number) {
    if (selected !== null) return;
    setSelected(n);
    if (n === data.answer) {
      addStars(2);
      setScore(s => s + 1);
      speak("Yes! Great multiplying!");
    } else {
      speak(`${data.a} times ${data.b} equals ${data.answer}.`);
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
      <div className="font-display text-4xl font-bold mb-6">{data.a} × {data.b} = ?</div>
      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-4">
        {data.options.map(n => {
          const showState = selected !== null;
          const isCorrect = n === data.answer;
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
