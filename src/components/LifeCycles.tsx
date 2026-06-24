import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

interface Stage { name: string; emoji: string; note: string; }
interface LifeCycle { name: string; emoji: string; stages: Stage[]; }

const CYCLES: LifeCycle[] = [
  {
    name: "Butterfly", emoji: "🦋",
    stages: [
      { name: "Egg",         emoji: "🥚", note: "A tiny egg is laid on a leaf." },
      { name: "Caterpillar", emoji: "🐛", note: "The egg hatches into a hungry caterpillar." },
      { name: "Chrysalis",   emoji: "🛡️", note: "The caterpillar forms a hard shell called a chrysalis." },
      { name: "Butterfly",   emoji: "🦋", note: "A beautiful butterfly comes out and flies away!" },
    ],
  },
  {
    name: "Frog", emoji: "🐸",
    stages: [
      { name: "Egg",     emoji: "🥚", note: "Frog eggs float together in water." },
      { name: "Tadpole", emoji: "🐟", note: "A tadpole hatches and swims using its tail." },
      { name: "Froglet",  emoji: "🐸", note: "Legs grow and the tail starts to shrink." },
      { name: "Frog",    emoji: "🐸", note: "A full grown frog can hop and swim!" },
    ],
  },
  {
    name: "Chicken", emoji: "🐔",
    stages: [
      { name: "Egg",    emoji: "🥚", note: "A hen lays an egg and keeps it warm." },
      { name: "Chick",  emoji: "🐣", note: "A fluffy chick hatches out of the egg." },
      { name: "Pullet", emoji: "🐤", note: "The chick grows feathers and gets bigger." },
      { name: "Hen",    emoji: "🐔", note: "A grown hen can lay its own eggs!" },
    ],
  },
];

type Mode = "learn" | "quiz";

export function LifeCycles() {
  const [mode, setMode] = useState<Mode>("learn");
  const [cycleIndex, setCycleIndex] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const cycle = CYCLES[cycleIndex];
  const stage = cycle.stages[stageIndex];

  function pickCycle(i: number) {
    setCycleIndex(i);
    setStageIndex(0);
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
          <div className="flex justify-center gap-2 mb-4">
            {CYCLES.map((c, i) => (
              <button key={c.name} onClick={() => pickCycle(i)}
                className={`rounded-2xl px-4 py-2 font-bold text-sm transition ${cycleIndex === i ? "bg-pink text-white" : "bg-muted"}`}>
                {c.emoji} {c.name}
              </button>
            ))}
          </div>

          <div className="rounded-3xl bg-mint/30 p-8 mb-4">
            <div className="text-6xl mb-3">{stage.emoji}</div>
            <div className="font-display text-2xl font-bold mb-1">{stage.name}</div>
            <div className="text-sm text-muted-foreground">{stage.note}</div>
          </div>

          <div className="flex justify-center gap-3 mb-4">
            <button onClick={() => { const i = Math.max(0, stageIndex - 1); setStageIndex(i); speak(cycle.stages[i].note); }}
              className="rounded-2xl bg-sky px-5 py-3 font-bold">← Prev</button>
            <button onClick={() => speak(stage.note)} className="rounded-2xl bg-lilac px-5 py-3 font-bold">🔊 Say it</button>
            <button onClick={() => { const i = Math.min(cycle.stages.length - 1, stageIndex + 1); setStageIndex(i); speak(cycle.stages[i].note); }}
              className="rounded-2xl bg-sky px-5 py-3 font-bold">Next →</button>
          </div>

          <div className="flex justify-center gap-2">
            {cycle.stages.map((s, i) => (
              <button key={s.name} onClick={() => { setStageIndex(i); speak(s.note); }}
                className={`text-2xl rounded-xl p-2 transition ${i === stageIndex ? "bg-pink/30 scale-110" : "bg-muted/40"}`}>
                {s.emoji}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <LifeCycleQuiz />
      )}
    </div>
  );
}

function LifeCycleQuiz() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);

  function buildRound(r: number) {
    const cycle = CYCLES[r % CYCLES.length];
    const stageIdx = Math.floor(Math.random() * (cycle.stages.length - 1));
    const current = cycle.stages[stageIdx];
    const answer = cycle.stages[stageIdx + 1];
    const otherStages = CYCLES.flatMap(c => c.stages).filter(s => s.name !== answer.name);
    const others = [...new Set(otherStages.map(s => s.emoji))].sort(() => Math.random() - 0.5).slice(0, 2);
    const options = [answer.emoji, ...others].sort(() => Math.random() - 0.5);
    return { cycle, current, answer, options };
  }

  const [data, setData] = useState(() => buildRound(0));

  function pick(emoji: string) {
    if (selected) return;
    setSelected(emoji);
    if (emoji === data.answer.emoji) {
      addStars(2);
      setScore(s => s + 1);
      speak(`Yes! After ${data.current.name} comes ${data.answer.name}!`);
    } else {
      speak(`Good try! After ${data.current.name} comes ${data.answer.name}.`);
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
      <p className="mb-2 text-sm text-muted-foreground">{data.cycle.name} life cycle</p>
      <div className="text-5xl mb-2">{data.current.emoji}</div>
      <p className="mb-4 text-lg font-bold">What comes after {data.current.name}?</p>
      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-4">
        {data.options.map(emoji => {
          const showState = selected !== null;
          const isCorrect = emoji === data.answer.emoji;
          return (
            <button key={emoji} onClick={() => pick(emoji)} disabled={!!selected}
              className={`text-4xl rounded-2xl p-4 transition ${
                showState && isCorrect ? "bg-green-200 scale-105" :
                showState && selected === emoji ? "bg-red-200" :
                "bg-sky/30 hover:scale-105"
              }`}>
              {emoji}
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
