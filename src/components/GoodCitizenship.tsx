import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

interface Scenario {
  situation: string;
  emoji: string;
  options: { text: string; good: boolean }[];
  explain: string;
}

const SCENARIOS: Scenario[] = [
  {
    situation: "Your friend drops their crayons on the floor.",
    emoji: "🖍️",
    options: [
      { text: "Help pick them up", good: true },
      { text: "Walk away", good: false },
      { text: "Laugh at them", good: false },
    ],
    explain: "Good citizens help others when they need it!",
  },
  {
    situation: "You see trash on the playground.",
    emoji: "🗑️",
    options: [
      { text: "Pick it up and throw it away", good: true },
      { text: "Step over it", good: false },
      { text: "Kick it away", good: false },
    ],
    explain: "Good citizens take care of shared spaces!",
  },
  {
    situation: "Someone new joins your class.",
    emoji: "👋",
    options: [
      { text: "Ignore them", good: false },
      { text: "Say hi and welcome them", good: true },
      { text: "Tell them to go away", good: false },
    ],
    explain: "Good citizens are kind and welcoming to everyone!",
  },
  {
    situation: "Your teacher asks everyone to clean up.",
    emoji: "🧹",
    options: [
      { text: "Pretend you don't hear", good: false },
      { text: "Help clean up your area", good: true },
      { text: "Make a bigger mess", good: false },
    ],
    explain: "Good citizens do their part to help the group!",
  },
  {
    situation: "You want to play with a toy someone else has.",
    emoji: "🧸",
    options: [
      { text: "Grab it from them", good: false },
      { text: "Wait and ask to take turns", good: true },
      { text: "Cry until you get it", good: false },
    ],
    explain: "Good citizens share and take turns!",
  },
  {
    situation: "You hear a classmate being teased.",
    emoji: "😢",
    options: [
      { text: "Join in the teasing", good: false },
      { text: "Tell a teacher or stand up for them", good: true },
      { text: "Walk away and ignore it", good: false },
    ],
    explain: "Good citizens stand up for others and ask for help!",
  },
];

export function GoodCitizenship() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const scenario = SCENARIOS[round % SCENARIOS.length];

  function pick(text: string, good: boolean) {
    if (selected) return;
    setSelected(text);
    if (good) {
      addStars(2);
      setScore(s => s + 1);
      speak(`Great choice! ${scenario.explain}`);
    } else {
      speak(`Let's think about that. ${scenario.explain}`);
    }
  }

  function next() {
    setRound(r => r + 1);
    setSelected(null);
  }

  return (
    <div className="card-soft mx-auto max-w-2xl p-6 text-center">
      <div className="mb-3 text-sm font-bold">⭐ {score} good choices</div>
      <div className="text-5xl mb-3">{scenario.emoji}</div>
      <p className="mb-6 text-lg font-bold">{scenario.situation}</p>
      <p className="mb-4 text-sm text-muted-foreground">What should you do?</p>

      <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto mb-4">
        {scenario.options.map(opt => {
          const showState = selected !== null;
          return (
            <button key={opt.text} onClick={() => pick(opt.text, opt.good)} disabled={!!selected}
              className={`rounded-2xl p-3 font-bold transition ${
                showState && opt.good ? "bg-green-200" :
                showState && selected === opt.text ? "bg-red-200" :
                "bg-sky/30 hover:scale-105"
              }`}>
              {opt.text}
            </button>
          );
        })}
      </div>

      {selected && (
        <div>
          <p className="mb-3 text-sm font-semibold text-muted-foreground">{scenario.explain}</p>
          <button onClick={next} className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white">Next →</button>
        </div>
      )}
    </div>
  );
}
