import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

const DAYS = [
  { name: "Sunday",    emoji: "🌞", note: "Family fun day!" },
  { name: "Monday",    emoji: "📚", note: "Back to learning!" },
  { name: "Tuesday",   emoji: "🎨", note: "Art day!" },
  { name: "Wednesday", emoji: "🏃", note: "Halfway through!" },
  { name: "Thursday",  emoji: "🎵", note: "Music day!" },
  { name: "Friday",    emoji: "🎉", note: "Almost the weekend!" },
  { name: "Saturday",  emoji: "🏖️", note: "Weekend fun!" },
];

type Mode = "learn" | "quiz";

export function DaysOfWeek() {
  const [mode, setMode] = useState<Mode>("learn");
  const [index, setIndex] = useState(0);
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  function speakDay(i: number) {
    speak(`${DAYS[i].name}. ${DAYS[i].note}`);
  }

  function todayIndex() {
    return new Date().getDay();
  }

  // Quiz: "What day comes after X?"
  const quizDay = DAYS[round % 7];
  const nextDay = DAYS[(round + 1) % 7];
  const quizOptions = (() => {
    const others = DAYS.filter(d => d.name !== nextDay.name).map(d => d.name).sort(() => Math.random() - 0.5).slice(0, 2);
    return [nextDay.name, ...others].sort(() => Math.random() - 0.5);
  })();

  function pickAnswer(name: string) {
    if (selected) return;
    setSelected(name);
    if (name === nextDay.name) {
      addStars(2);
      setScore(s => s + 1);
      speak(`Yes! After ${quizDay.name} comes ${nextDay.name}!`);
    } else {
      speak(`Good try! After ${quizDay.name} comes ${nextDay.name}.`);
    }
  }

  function nextQuiz() {
    setRound(r => r + 1);
    setSelected(null);
  }

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
          <p className="mb-2 text-sm font-semibold text-muted-foreground">
            Today is <span className="font-bold text-foreground">{DAYS[todayIndex()].name}</span> {DAYS[todayIndex()].emoji}
          </p>
          <div className="rounded-3xl bg-butter/30 p-8 mb-4">
            <div className="text-6xl mb-3">{DAYS[index].emoji}</div>
            <div className="font-display text-3xl font-bold mb-1">{DAYS[index].name}</div>
            <div className="text-sm text-muted-foreground">{DAYS[index].note}</div>
          </div>
          <div className="flex justify-center gap-3 mb-4">
            <button onClick={() => { const i = (index - 1 + 7) % 7; setIndex(i); speakDay(i); }}
              className="rounded-2xl bg-sky px-5 py-3 font-bold">← Prev</button>
            <button onClick={() => speakDay(index)} className="rounded-2xl bg-lilac px-5 py-3 font-bold">🔊 Say it</button>
            <button onClick={() => { const i = (index + 1) % 7; setIndex(i); speakDay(i); }}
              className="rounded-2xl bg-sky px-5 py-3 font-bold">Next →</button>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {DAYS.map((d, i) => (
              <button key={d.name} onClick={() => { setIndex(i); speakDay(i); }}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition ${i === index ? "bg-pink text-white" : "bg-muted"}`}>
                {d.emoji} {d.name.slice(0,3)}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <div className="mb-3 text-sm font-bold">⭐ {score} correct</div>
          <p className="mb-4 text-lg font-bold">
            What day comes after <span className="text-pink">{quizDay.name}</span> {quizDay.emoji}?
          </p>
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-4">
            {quizOptions.map(name => {
              const showState = selected !== null;
              const isCorrect = name === nextDay.name;
              const dayInfo = DAYS.find(d => d.name === name)!;
              return (
                <button key={name} onClick={() => pickAnswer(name)} disabled={!!selected}
                  className={`rounded-2xl p-4 transition ${
                    showState && isCorrect ? "bg-green-200 scale-105" :
                    showState && selected === name ? "bg-red-200" :
                    "bg-sky/30 hover:scale-105"
                  }`}>
                  <div className="text-2xl mb-1">{dayInfo.emoji}</div>
                  <div className="font-bold text-xs">{name}</div>
                </button>
              );
            })}
          </div>
          {selected && (
            <button onClick={nextQuiz} className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white">Next →</button>
          )}
        </div>
      )}
    </div>
  );
}
