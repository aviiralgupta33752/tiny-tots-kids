import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

const FACTS = [
  { name: "The Sun",  emoji: "☀️", note: "The Sun is a giant star that gives us light and heat. It does not move around us — we move around it!" },
  { name: "The Earth",emoji: "🌍", note: "Earth spins around like a top. One full spin takes 24 hours, which is one day!" },
  { name: "The Moon", emoji: "🌙", note: "The Moon travels around Earth. It takes about a month for the Moon to go all the way around!" },
];

const DAY_NIGHT = [
  { name: "Day",   emoji: "☀️", note: "When our side of Earth faces the Sun, it is daytime!" },
  { name: "Night", emoji: "🌙", note: "When our side of Earth turns away from the Sun, it is nighttime!" },
];

type Mode = "learn" | "quiz";

export function EarthMoonSun() {
  const [mode, setMode] = useState<Mode>("learn");
  const [index, setIndex] = useState(0);
  const fact = FACTS[index];

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

      {mode === "learn" ? (
        <div className="text-center">
          <div className="rounded-3xl bg-sky/20 p-8 mb-4">
            <div className="text-6xl mb-3">{fact.emoji}</div>
            <div className="font-display text-2xl font-bold mb-2">{fact.name}</div>
            <div className="text-sm text-muted-foreground">{fact.note}</div>
          </div>
          <div className="flex justify-center gap-3 mb-6">
            <button onClick={() => { const i = (index - 1 + 3) % 3; setIndex(i); speak(FACTS[i].note); }}
              className="rounded-2xl bg-sky px-5 py-3 font-bold">← Prev</button>
            <button onClick={() => speak(fact.note)} className="rounded-2xl bg-lilac px-5 py-3 font-bold">🔊 Say it</button>
            <button onClick={() => { const i = (index + 1) % 3; setIndex(i); speak(FACTS[i].note); }}
              className="rounded-2xl bg-sky px-5 py-3 font-bold">Next →</button>
          </div>

          <p className="mb-3 font-bold text-sm">Why do we have day and night?</p>
          <div className="flex justify-center gap-4">
            {DAY_NIGHT.map(d => (
              <button key={d.name} onClick={() => speak(d.note)}
                className="rounded-2xl bg-butter/40 p-4 hover:scale-105 transition max-w-40">
                <div className="text-3xl mb-1">{d.emoji}</div>
                <div className="text-xs font-bold mb-1">{d.name}</div>
                <div className="text-[10px] text-muted-foreground">{d.note}</div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <EarthMoonSunQuiz />
      )}
    </div>
  );
}

const QUIZ_QUESTIONS = [
  { q: "What gives us light and heat?", answer: "The Sun", emoji: "☀️" },
  { q: "What spins and gives us day and night?", answer: "The Earth", emoji: "🌍" },
  { q: "What travels around Earth every month?", answer: "The Moon", emoji: "🌙" },
];

function EarthMoonSunQuiz() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const question = QUIZ_QUESTIONS[round % QUIZ_QUESTIONS.length];
  const options = FACTS.map(f => f.name).sort(() => Math.random() - 0.5);

  function pick(name: string) {
    if (selected) return;
    setSelected(name);
    if (name === question.answer) {
      addStars(2);
      setScore(s => s + 1);
      speak(`Yes! ${question.answer} is correct!`);
    } else {
      speak(`The answer was ${question.answer}.`);
    }
  }

  function next() {
    setRound(r => r + 1);
    setSelected(null);
  }

  return (
    <div className="text-center">
      <div className="mb-3 text-sm font-bold">⭐ {score} correct</div>
      <p className="mb-4 text-lg font-bold">{question.q}</p>
      <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-4">
        {options.map(name => {
          const showState = selected !== null;
          const isCorrect = name === question.answer;
          const fact = FACTS.find(f => f.name === name)!;
          return (
            <button key={name} onClick={() => pick(name)} disabled={!!selected}
              className={`rounded-2xl p-4 transition ${
                showState && isCorrect ? "bg-green-200 scale-105" :
                showState && selected === name ? "bg-red-200" :
                "bg-sky/30 hover:scale-105"
              }`}>
              <div className="text-3xl mb-1">{fact.emoji}</div>
              <div className="font-bold text-xs">{name}</div>
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
