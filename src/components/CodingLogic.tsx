import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

type Mode = "learn" | "sequence" | "maze";

const COMMANDS = [
  { name: "Forward", emoji: "⬆️", dx: 0, dy: -1 },
  { name: "Back",    emoji: "⬇️", dx: 0, dy: 1 },
  { name: "Left",    emoji: "⬅️", dx: -1, dy: 0 },
  { name: "Right",   emoji: "➡️", dx: 1, dy: 0 },
];

export function CodingLogic() {
  const [mode, setMode] = useState<Mode>("learn");
  return (
    <div className="card-soft mx-auto max-w-2xl p-6">
      <div className="flex justify-center gap-2 mb-6 flex-wrap">
        <button onClick={() => setMode("learn")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "learn" ? "bg-pink text-white" : "bg-muted"}`}>
          📖 What's Coding?
        </button>
        <button onClick={() => setMode("sequence")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "sequence" ? "bg-pink text-white" : "bg-muted"}`}>
          🔢 Sequences
        </button>
        <button onClick={() => setMode("maze")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "maze" ? "bg-pink text-white" : "bg-muted"}`}>
          🤖 Code the Robot
        </button>
      </div>
      {mode === "learn" && <WhatIsCoding />}
      {mode === "sequence" && <SequenceGame />}
      {mode === "maze" && <RobotMaze />}
    </div>
  );
}

function WhatIsCoding() {
  return (
    <div className="text-center">
      <div className="text-5xl mb-3">🤖</div>
      <p className="mb-4 text-lg font-bold">Coding is giving step-by-step instructions!</p>
      <div className="rounded-2xl bg-butter/30 p-5 mb-4 text-left">
        <p className="mb-2">Just like a recipe tells you steps to bake a cake, code tells a computer exactly what to do, one step at a time.</p>
        <p className="mb-2">If the steps are in the wrong order, things go wrong — just like putting on your shoes before your socks!</p>
        <p>Let's practice putting things in the right order, and giving a robot instructions to follow!</p>
      </div>
      <button onClick={() => speak("Coding is giving step by step instructions, just like a recipe!")}
        className="rounded-xl bg-lilac px-5 py-2 font-bold text-sm">
        🔊 Hear it
      </button>
    </div>
  );
}

interface SeqStep { text: string; emoji: string; }
interface SeqTask { title: string; steps: SeqStep[]; }

const SEQUENCES: SeqTask[] = [
  { title: "Making a Sandwich", steps: [
    { text: "Get bread", emoji: "🍞" },
    { text: "Add peanut butter", emoji: "🥜" },
    { text: "Add jelly", emoji: "🍇" },
    { text: "Put bread on top", emoji: "🥪" },
  ]},
  { title: "Brushing Teeth", steps: [
    { text: "Get toothbrush", emoji: "🪥" },
    { text: "Add toothpaste", emoji: "🧴" },
    { text: "Brush teeth", emoji: "😁" },
    { text: "Rinse with water", emoji: "💧" },
  ]},
  { title: "Planting a Seed", steps: [
    { text: "Dig a hole", emoji: "🕳️" },
    { text: "Drop in a seed", emoji: "🌰" },
    { text: "Cover with soil", emoji: "🟤" },
    { text: "Water it", emoji: "💧" },
  ]},
];

function SequenceGame() {
  const [round, setRound] = useState(0);
  const task = SEQUENCES[round % SEQUENCES.length];
  const [order, setOrder] = useState<SeqStep[]>(() => [...task.steps].sort(() => Math.random() - 0.5));
  const [placed, setPlaced] = useState<SeqStep[]>([]);
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);

  function pick(step: SeqStep) {
    if (checked) return;
    setOrder(prev => prev.filter(s => s !== step));
    setPlaced(prev => [...prev, step]);
  }

  function unpick(step: SeqStep) {
    if (checked) return;
    setPlaced(prev => prev.filter(s => s !== step));
    setOrder(prev => [...prev, step]);
  }

  function check() {
    const isCorrect = placed.every((s, i) => s.text === task.steps[i].text);
    setChecked(true);
    setCorrect(isCorrect);
    if (isCorrect) {
      addStars(3);
      speak("Yes! That's the right order!");
    } else {
      speak("Good try! Let's see the right order.");
    }
  }

  function next() {
    const newRound = round + 1;
    const newTask = SEQUENCES[newRound % SEQUENCES.length];
    setRound(newRound);
    setOrder([...newTask.steps].sort(() => Math.random() - 0.5));
    setPlaced([]);
    setChecked(false);
  }

  return (
    <div className="text-center">
      <p className="mb-4 text-lg font-bold">Put the steps in order: {task.title}</p>

      <div className="min-h-16 rounded-2xl bg-butter/30 p-3 mb-4 flex flex-wrap gap-2 justify-center items-center">
        {placed.length === 0 && <span className="text-muted-foreground text-sm">Tap steps below to add them here...</span>}
        {placed.map((s, i) => (
          <button key={s.text} onClick={() => unpick(s)} disabled={checked}
            className={`rounded-xl px-3 py-2 font-bold text-sm transition ${
              checked ? (s.text === task.steps[i].text ? "bg-green-200" : "bg-red-200") : "bg-pink text-white"
            }`}>
            {i + 1}. {s.emoji} {s.text}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {order.map(s => (
          <button key={s.text} onClick={() => pick(s)} disabled={checked}
            className="rounded-xl bg-sky/30 px-3 py-2 font-bold text-sm hover:scale-105 transition">
            {s.emoji} {s.text}
          </button>
        ))}
      </div>

      {!checked ? (
        <button onClick={check} disabled={placed.length !== task.steps.length}
          className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white disabled:opacity-40">
          Check My Order ✓
        </button>
      ) : (
        <div>
          <p className="mb-3 text-xl font-bold">{correct ? "🎉 Perfect order!" : "Let's try the next one!"}</p>
          <button onClick={next} className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white">Next →</button>
        </div>
      )}
    </div>
  );
}

const GRID_SIZE = 4;

function RobotMaze() {
  const [start] = useState({ x: 0, y: 0 });
  const [goal] = useState({ x: 3, y: 3 });
  const [program, setProgram] = useState<typeof COMMANDS[0][]>([]);
  const [running, setRunning] = useState(false);
  const [robotPos, setRobotPos] = useState(start);
  const [result, setResult] = useState<"win" | "fail" | null>(null);

  function addCommand(cmd: typeof COMMANDS[0]) {
    if (running) return;
    setProgram(prev => [...prev, cmd]);
  }

  function clearProgram() {
    setProgram([]);
    setRobotPos(start);
    setResult(null);
  }

  function runProgram() {
    setRunning(true);
    setRobotPos(start);
    setResult(null);
    let pos = { ...start };
    program.forEach((cmd, i) => {
      setTimeout(() => {
        pos = {
          x: Math.max(0, Math.min(GRID_SIZE - 1, pos.x + cmd.dx)),
          y: Math.max(0, Math.min(GRID_SIZE - 1, pos.y + cmd.dy)),
        };
        setRobotPos({ ...pos });
        if (i === program.length - 1) {
          setTimeout(() => {
            setRunning(false);
            if (pos.x === goal.x && pos.y === goal.y) {
              setResult("win");
              addStars(5);
              speak("You programmed the robot perfectly!");
            } else {
              setResult("fail");
              speak("Almost! Try adjusting your code.");
            }
          }, 400);
        }
      }, i * 500);
    });
  }

  return (
    <div className="text-center">
      <p className="mb-4 text-sm font-semibold text-muted-foreground">
        Build a program to move the robot 🤖 to the star 🌟!
      </p>

      <div className="inline-block rounded-2xl bg-mint/20 p-3 mb-4">
        {Array.from({ length: GRID_SIZE }, (_, row) => (
          <div key={row} className="flex">
            {Array.from({ length: GRID_SIZE }, (_, col) => {
              const isRobot = robotPos.x === col && robotPos.y === row;
              const isGoal = goal.x === col && goal.y === row;
              return (
                <div key={col} className="w-14 h-14 flex items-center justify-center border border-white/40 bg-white/30 rounded-lg m-0.5 text-2xl">
                  {isRobot ? "🤖" : isGoal ? "🌟" : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p className="mb-2 text-xs font-bold text-muted-foreground uppercase">Your Program</p>
      <div className="min-h-12 rounded-2xl bg-butter/30 p-2 mb-4 flex flex-wrap gap-1 justify-center items-center">
        {program.length === 0 && <span className="text-muted-foreground text-sm">Add commands below...</span>}
        {program.map((cmd, i) => (
          <span key={i} className="rounded-lg bg-pink/20 px-2 py-1 text-lg">{cmd.emoji}</span>
        ))}
      </div>

      <div className="flex justify-center gap-2 mb-4">
        {COMMANDS.map(cmd => (
          <button key={cmd.name} onClick={() => addCommand(cmd)} disabled={running}
            className="rounded-xl bg-sky/40 px-3 py-2 text-2xl hover:scale-110 transition disabled:opacity-40">
            {cmd.emoji}
          </button>
        ))}
      </div>

      <div className="flex justify-center gap-3">
        <button onClick={clearProgram} disabled={running} className="rounded-2xl bg-muted px-5 py-3 font-bold disabled:opacity-40">Clear</button>
        <button onClick={runProgram} disabled={running || program.length === 0}
          className="rounded-2xl bg-pink px-8 py-3 font-bold text-white disabled:opacity-40">
          ▶️ Run Program
        </button>
      </div>

      {result && (
        <p className="mt-4 text-xl font-bold">{result === "win" ? "🎉 You did it!" : "Almost! Clear and try again."}</p>
      )}
    </div>
  );
}
