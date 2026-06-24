import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

type Mode = "learn" | "build" | "quiz";

function blocksFor(n: number) {
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return { tens, ones };
}

export function PlaceValue() {
  const [mode, setMode] = useState<Mode>("learn");
  return (
    <div className="card-soft mx-auto max-w-2xl p-6">
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        <button onClick={() => setMode("learn")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "learn" ? "bg-pink text-white" : "bg-muted"}`}>
          📖 Learn
        </button>
        <button onClick={() => setMode("build")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "build" ? "bg-pink text-white" : "bg-muted"}`}>
          🧱 Build a Number
        </button>
        <button onClick={() => setMode("quiz")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "quiz" ? "bg-pink text-white" : "bg-muted"}`}>
          ❓ Quiz
        </button>
      </div>
      {mode === "learn" && <LearnPlaceValue />}
      {mode === "build" && <BuildNumber />}
      {mode === "quiz" && <PlaceValueQuiz />}
    </div>
  );
}

function LearnPlaceValue() {
  const [num, setNum] = useState(34);
  const { tens, ones } = blocksFor(num);

  return (
    <div className="text-center">
      <p className="mb-4 text-sm font-semibold text-muted-foreground">Every number has tens and ones!</p>
      <div className="font-display text-5xl font-bold mb-4">{num}</div>
      <div className="flex justify-center gap-8 mb-6">
        <div>
          <div className="text-xs font-bold mb-2">{tens} Tens</div>
          <div className="flex flex-wrap gap-1 justify-center max-w-32">
            {Array.from({ length: tens }).map((_, i) => (
              <div key={i} className="w-6 h-12 bg-pink/60 rounded" title="10" />
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-bold mb-2">{ones} Ones</div>
          <div className="flex flex-wrap gap-1 justify-center max-w-32">
            {Array.from({ length: ones }).map((_, i) => (
              <div key={i} className="w-5 h-5 bg-sky/60 rounded" />
            ))}
          </div>
        </div>
      </div>
      <button onClick={() => speak(`${num} has ${tens} tens and ${ones} ones.`)}
        className="mb-4 rounded-xl bg-lilac px-5 py-2 font-bold text-sm">
        🔊 Hear it
      </button>
      <div className="flex justify-center gap-2 flex-wrap">
        {[12, 25, 34, 47, 58, 63, 71, 89, 96].map(n => (
          <button key={n} onClick={() => { setNum(n); const b = blocksFor(n); speak(`${n} has ${b.tens} tens and ${b.ones} ones.`); }}
            className={`rounded-xl px-3 py-2 text-sm font-bold transition ${num === n ? "bg-pink text-white" : "bg-muted"}`}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function BuildNumber() {
  const [target] = useState(() => Math.floor(Math.random() * 89) + 11);
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);
  const [won, setWon] = useState(false);
  const built = tens * 10 + ones;

  function check() {
    if (built === target) {
      setWon(true);
      addStars(3);
      speak(`Yes! You built ${target}!`);
    } else {
      speak(`That makes ${built}. Try to make ${target}!`);
    }
  }

  function reset() {
    setTens(0); setOnes(0); setWon(false);
  }

  return (
    <div className="text-center">
      <p className="mb-2 text-sm font-semibold text-muted-foreground">Build this number using tens and ones blocks:</p>
      <div className="font-display text-5xl font-bold mb-6 text-pink">{target}</div>

      <div className="flex justify-center gap-8 mb-6">
        <div>
          <div className="text-xs font-bold mb-2">Tens: {tens}</div>
          <div className="flex gap-2 mb-2">
            <button onClick={() => setTens(t => Math.max(0, t - 1))} className="rounded-lg bg-muted w-8 h-8 font-bold">-</button>
            <button onClick={() => setTens(t => Math.min(9, t + 1))} className="rounded-lg bg-pink/70 text-white w-8 h-8 font-bold">+</button>
          </div>
          <div className="flex flex-wrap gap-1 justify-center max-w-32">
            {Array.from({ length: tens }).map((_, i) => <div key={i} className="w-6 h-12 bg-pink/60 rounded" />)}
          </div>
        </div>
        <div>
          <div className="text-xs font-bold mb-2">Ones: {ones}</div>
          <div className="flex gap-2 mb-2">
            <button onClick={() => setOnes(o => Math.max(0, o - 1))} className="rounded-lg bg-muted w-8 h-8 font-bold">-</button>
            <button onClick={() => setOnes(o => Math.min(9, o + 1))} className="rounded-lg bg-sky/70 text-white w-8 h-8 font-bold">+</button>
          </div>
          <div className="flex flex-wrap gap-1 justify-center max-w-32">
            {Array.from({ length: ones }).map((_, i) => <div key={i} className="w-5 h-5 bg-sky/60 rounded" />)}
          </div>
        </div>
      </div>

      <div className="font-display text-2xl font-bold mb-4">= {built}</div>

      {!won ? (
        <button onClick={check} className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white">Check ✓</button>
      ) : (
        <div>
          <p className="mb-3 text-xl font-bold">🎉 You built it!</p>
          <button onClick={reset} className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white">New Number →</button>
        </div>
      )}
    </div>
  );
}

function PlaceValueQuiz() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  function buildRound(r: number) {
    const num = Math.floor(Math.random() * 89) + 11;
    const askTens = r % 2 === 0;
    const { tens, ones } = blocksFor(num);
    const answer = askTens ? tens : ones;
    const others = new Set<number>();
    while (others.size < 2) {
      const c = Math.floor(Math.random() * 9);
      if (c !== answer) others.add(c);
    }
    const options = [answer, ...others].sort(() => Math.random() - 0.5);
    return { num, askTens, answer, options };
  }

  const [data, setData] = useState(() => buildRound(0));

  function pick(n: number) {
    if (selected !== null) return;
    setSelected(n);
    if (n === data.answer) {
      addStars(2);
      setScore(s => s + 1);
      speak("Yes! That's correct!");
    } else {
      speak(`The answer was ${data.answer}.`);
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
      <p className="mb-2 text-lg font-bold">
        How many {data.askTens ? "tens" : "ones"} are in
      </p>
      <div className="font-display text-5xl font-bold mb-6 text-pink">{data.num}</div>
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
