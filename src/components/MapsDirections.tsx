import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

type Mode = "learn" | "maze";

const DIRECTIONS = [
  { name: "Up",    emoji: "⬆️", dx: 0, dy: -1 },
  { name: "Down",  emoji: "⬇️", dx: 0, dy: 1 },
  { name: "Left",  emoji: "⬅️", dx: -1, dy: 0 },
  { name: "Right", emoji: "➡️", dx: 1, dy: 0 },
];

const GRID_SIZE = 4;

export function MapsDirections() {
  const [mode, setMode] = useState<Mode>("learn");
  return (
    <div className="card-soft mx-auto max-w-2xl p-6">
      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => setMode("learn")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "learn" ? "bg-pink text-white" : "bg-muted"}`}>
          🧭 Learn Directions
        </button>
        <button onClick={() => setMode("maze")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "maze" ? "bg-pink text-white" : "bg-muted"}`}>
          🗺️ Map Maze
        </button>
      </div>
      {mode === "learn" ? <LearnDirections /> : <MapMaze />}
    </div>
  );
}

function LearnDirections() {
  return (
    <div className="text-center">
      <p className="mb-6 text-sm font-semibold text-muted-foreground">Tap each arrow to hear the direction!</p>
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        <div />
        <DirButton dir={DIRECTIONS[0]} />
        <div />
        <DirButton dir={DIRECTIONS[2]} />
        <div className="flex items-center justify-center text-3xl">🧒</div>
        <DirButton dir={DIRECTIONS[3]} />
        <div />
        <DirButton dir={DIRECTIONS[1]} />
        <div />
      </div>
    </div>
  );
}

function DirButton({ dir }: { dir: typeof DIRECTIONS[0] }) {
  return (
    <button onClick={() => speak(dir.name)}
      className="rounded-2xl bg-sky/30 p-4 hover:scale-110 transition flex flex-col items-center">
      <span className="text-3xl">{dir.emoji}</span>
      <span className="text-xs font-bold mt-1">{dir.name}</span>
    </button>
  );
}

function MapMaze() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [goal] = useState({ x: GRID_SIZE - 1, y: GRID_SIZE - 1 });
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  function move(dir: typeof DIRECTIONS[0]) {
    if (won) return;
    const nx = Math.max(0, Math.min(GRID_SIZE - 1, pos.x + dir.dx));
    const ny = Math.max(0, Math.min(GRID_SIZE - 1, pos.y + dir.dy));
    setPos({ x: nx, y: ny });
    setMoves(m => m + 1);
    speak(dir.name);
    if (nx === goal.x && ny === goal.y) {
      setWon(true);
      addStars(5);
      setTimeout(() => speak("You found the treasure!"), 300);
    }
  }

  function reset() {
    setPos({ x: 0, y: 0 });
    setMoves(0);
    setWon(false);
  }

  return (
    <div className="text-center">
      <p className="mb-4 text-sm font-semibold text-muted-foreground">
        Use the arrows to guide the explorer 🧒 to the treasure 🏆!
      </p>
      <div className="inline-block rounded-2xl bg-mint/20 p-3 mb-4">
        {Array.from({ length: GRID_SIZE }, (_, row) => (
          <div key={row} className="flex">
            {Array.from({ length: GRID_SIZE }, (_, col) => {
              const isPlayer = pos.x === col && pos.y === row;
              const isGoal = goal.x === col && goal.y === row;
              return (
                <div key={col} className="w-14 h-14 flex items-center justify-center border border-white/40 bg-white/30 rounded-lg m-0.5 text-2xl">
                  {isPlayer ? "🧒" : isGoal ? "🏆" : ""}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mb-4 text-sm font-bold">Moves: {moves}</div>
      <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto mb-4">
        <div />
        <button onClick={() => move(DIRECTIONS[0])} disabled={won} className="rounded-xl bg-sky/40 p-3 text-2xl hover:scale-110 transition disabled:opacity-40">⬆️</button>
        <div />
        <button onClick={() => move(DIRECTIONS[2])} disabled={won} className="rounded-xl bg-sky/40 p-3 text-2xl hover:scale-110 transition disabled:opacity-40">⬅️</button>
        <div />
        <button onClick={() => move(DIRECTIONS[3])} disabled={won} className="rounded-xl bg-sky/40 p-3 text-2xl hover:scale-110 transition disabled:opacity-40">➡️</button>
        <div />
        <button onClick={() => move(DIRECTIONS[1])} disabled={won} className="rounded-xl bg-sky/40 p-3 text-2xl hover:scale-110 transition disabled:opacity-40">⬇️</button>
        <div />
      </div>
      {won && (
        <div>
          <p className="mb-3 text-xl font-bold">🎉 You found it in {moves} moves!</p>
          <button onClick={reset} className="rounded-2xl bg-pink px-8 py-3 text-lg font-bold text-white">Play Again →</button>
        </div>
      )}
    </div>
  );
}
