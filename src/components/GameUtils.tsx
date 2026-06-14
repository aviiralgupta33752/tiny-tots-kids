import { useRef, useState, useEffect } from "react";
 
// ── Confetti ──────────────────────────────────────────────────────────────────
const COLORS = ["#ff6fa0","#ffe680","#a8e6a3","#a0c4ff","#c8a8ff","#ffb480"];
 
export function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
 
  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(animRef.current);
      const c = canvasRef.current;
      if (c) c.getContext("2d")?.clearRect(0, 0, c.width, c.height);
      return;
    }
 
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
 
    type P = { x:number;y:number;vx:number;vy:number;color:string;size:number;angle:number;spin:number;life:number };
    const particles: P[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: -10,
      vx: (Math.random() - 0.5) * 5, vy: Math.random() * 3 + 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 8 + 5, angle: Math.random() * 360,
      spin: (Math.random() - 0.5) * 6, life: 1,
    }));
 
    let alive = true;
 
    function draw() {
      if (!alive) return;
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      let any = false;
      for (const p of particles) {
        if (p.life <= 0) continue;
        any = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
        ctx.restore();
        p.x += p.vx; p.y += p.vy; p.angle += p.spin; p.vy += 0.08;
        if (p.y > canvas!.height) p.life = 0;
      }
      if (any) animRef.current = requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, canvas!.width, canvas!.height);
    }
 
    animRef.current = requestAnimationFrame(draw);
 
    return () => {
      alive = false;
      cancelAnimationFrame(animRef.current);
    };
  }, [active]);
 
  if (!active) return null;
  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50" />;
}
 
// ── Mascot ────────────────────────────────────────────────────────────────────
export type MascotMood = "idle"|"happy"|"cheer"|"thinking"|"sad";
 
const FACES: Record<MascotMood, string> = {
  idle:"😊", happy:"😄", cheer:"🥳", thinking:"🤔", sad:"😅",
};
const MESSAGES: Record<MascotMood, string[]> = {
  idle:     ["Let's learn!","You can do it!","Ready to play?"],
  happy:    ["Great job!","You're amazing!","Keep going!"],
  cheer:    ["WOOHOO! 🎉","PERFECT! ⭐","YOU'RE A STAR!"],
  thinking: ["Hmm...","Think carefully!","You've got this!"],
  sad:      ["Try again!","Almost there!","Don't give up!"],
};
 
export function Mascot({ mood }: { mood: MascotMood }) {
  const msg = MESSAGES[mood][0];
  return (
    <div className="flex flex-col items-center gap-1 select-none">
      <div className={`text-5xl transition-transform duration-300 ${mood === "cheer" || mood === "happy" ? "animate-bounce" : ""}`}>
        {FACES[mood]}
      </div>
      <div className="rounded-2xl bg-white/80 px-3 py-1 text-xs font-bold shadow-sm">{msg}</div>
    </div>
  );
}
 
// ── Progress Bar ──────────────────────────────────────────────────────────────
export function ProgressBar({ current, total, color = "bg-pink" }: { current:number; total:number; color?:string }) {
  const pct = Math.min(100, Math.round((current / total) * 100));
  return (
    <div className="w-full">
      <div className="mb-1 flex justify-between text-xs font-bold text-foreground/60">
        <span>{current} / {total}</span><span>{pct}%</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
 
// ── useConfetti ───────────────────────────────────────────────────────────────
export function useConfetti() {
  const [active, setActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
 
  function fire() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setActive(true);
    timerRef.current = setTimeout(() => setActive(false), 2000);
  }
 
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);
 
  return { active, fire };
}
 
// ── DifficultyBadge ───────────────────────────────────────────────────────────
export function DifficultyBadge({ difficulty }: { difficulty: "easy"|"medium"|"hard" }) {
  const map = { easy:{ label:"Easy", color:"bg-mint", emoji:"🌱" }, medium:{ label:"Medium", color:"bg-butter", emoji:"⭐" }, hard:{ label:"Hard", color:"bg-peach", emoji:"🔥" } };
  const d = map[difficulty];
  return <span className={`rounded-full ${d.color} px-3 py-1 text-xs font-bold`}>{d.emoji} {d.label}</span>;
}
 
