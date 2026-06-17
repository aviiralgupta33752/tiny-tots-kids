import { useEffect, useRef, useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";
import { updateStats } from "@/lib/achievements";

const NUMBERS = [
  { n: 1, word: "one",   emoji: "⭐" },
  { n: 2, word: "two",   emoji: "🌟" },
  { n: 3, word: "three", emoji: "🎈" },
  { n: 4, word: "four",  emoji: "🍎" },
  { n: 5, word: "five",  emoji: "🌸" },
  { n: 6, word: "six",   emoji: "🐱" },
  { n: 7, word: "seven", emoji: "🦋" },
  { n: 8, word: "eight", emoji: "🍪" },
  { n: 9, word: "nine",  emoji: "🚂" },
  { n: 10, word: "ten",  emoji: "🏆" },
];

const CHECK_MESSAGES = [
  "Wow, beautiful tracing! ⭐",
  "You're a tracing superstar! 🌟",
  "That looks amazing! 🎉",
  "Fantastic number! 🏆",
  "So neat and pretty! 🌈",
];

export function NumberTrace() {
  const [numIdx, setNumIdx] = useState(0);
  const [isLower, setIsLower] = useState(false);
  const [earned, setEarned] = useState(false);
  const [checked, setChecked] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const totalPixels = useRef(0);
  const current = NUMBERS[numIdx];

  useEffect(() => { clear(); setEarned(false); setChecked(false); totalPixels.current = 0; }, [numIdx]);

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current!; const r = c.getBoundingClientRect();
    return { x: ((e.clientX-r.left)/r.width)*600, y: ((e.clientY-r.top)/r.height)*600 };
  }
  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    drawing.current = true;
    const ctx = canvasRef.current!.getContext("2d")!;
    const {x,y} = getPos(e); ctx.beginPath(); ctx.moveTo(x,y);
  }
  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return;
    const ctx = canvasRef.current!.getContext("2d")!;
    const {x,y} = getPos(e);
    ctx.lineTo(x,y); ctx.lineWidth=22; ctx.lineCap="round"; ctx.strokeStyle="#a0c4ff"; ctx.stroke();
    totalPixels.current++;
  }
  function end() { drawing.current = false; }
  function clear() {
    const c = canvasRef.current; if (!c) return;
    c.getContext("2d")!.clearRect(0,0,c.width,c.height);
    totalPixels.current = 0; setEarned(false); setChecked(false);
  }

  function check() {
    setChecked(true);
    if (totalPixels.current > 20) {
      if (!earned) {
        setEarned(true);
        addStars(1);
        updateStats({ lettersTraced: 1 });
      }
      const msg = CHECK_MESSAGES[Math.floor(Math.random() * CHECK_MESSAGES.length)];
      speak(msg);
    } else {
      speak(`Try tracing the number ${current.n} with your finger!`);
    }
  }

  return (
    <section className="animate-pop">
      <div className="mb-5 text-center">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Trace Numbers ✏️</h2>
        <p className="mt-1 text-sm text-muted-foreground">Trace each number with your finger!</p>
      </div>
      <div className="card-soft grid gap-6 p-6 md:grid-cols-[1fr_auto]">
        <div>
          <div className="mb-3 flex justify-center items-center gap-3">
            <div className="text-4xl">{current.emoji}</div>
            <div className="font-display text-2xl font-bold">{current.word}</div>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md rounded-2xl bg-sky/20">
            <div className="pointer-events-none absolute inset-0 grid place-items-center font-display text-[18rem] font-bold leading-none text-foreground/10 select-none">{current.n}</div>
            <canvas ref={canvasRef} width={600} height={600}
              onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerLeave={end}
              className="absolute inset-0 h-full w-full touch-none rounded-2xl" />
            {earned && checked && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="animate-bounce rounded-full bg-mint/90 px-6 py-3 text-xl font-bold shadow-xl">⭐ Great job!</div>
              </div>
            )}
          </div>
          <div className="mt-3 flex justify-center gap-3">
            <button onClick={clear} className="rounded-xl bg-muted px-5 py-2 font-bold">↻ Clear</button>
            <button onClick={check} className="rounded-xl bg-sky px-5 py-2 font-bold">✓ Check!</button>
            <button onClick={() => speak(`The number ${current.n}. ${current.word}`)} className="rounded-xl bg-mint px-5 py-2 font-bold">🔊 Hear</button>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-muted-foreground">Pick a number</p>
          <div className="grid grid-cols-5 gap-2 md:grid-cols-2 md:w-32">
            {NUMBERS.map((n, i) => (
              <button key={n.n} onClick={() => { setNumIdx(i); speak(`The number ${n.n}. ${n.word}`); }}
                className={`rounded-xl py-2 font-display text-xl font-bold transition ${numIdx===i ? "bg-sky shadow-md scale-105" : "bg-muted hover:bg-accent"}`}>
                {n.n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
