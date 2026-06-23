import { useState } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

type Mode = "learn" | "quiz";

function ClockFace({ hour, size = 200 }: { hour: number; size?: number }) {
  const cx = size / 2, cy = size / 2, r = size / 2 - 10;
  const hourAngle = (hour % 12) * 30 - 90; // hour hand points to the hour, minute hand to 12
  const hourRad = (hourAngle * Math.PI) / 180;
  const handLen = r * 0.55;
  const hx = cx + handLen * Math.cos(hourRad);
  const hy = cy + handLen * Math.sin(hourRad);

  const ticks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const numX = cx + (r - 22) * Math.cos(angle);
    const numY = cy + (r - 22) * Math.sin(angle);
    return { num: i === 0 ? 12 : i, x: numX, y: numY };
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="white" stroke="#333" strokeWidth={4} />
      {ticks.map(t => (
        <text key={t.num} x={t.x} y={t.y + 6} textAnchor="middle" fontSize={16} fontWeight="bold" fill="#333">{t.num}</text>
      ))}
      {/* minute hand always at 12 (o'clock only) */}
      <line x1={cx} y1={cy} x2={cx} y2={cy - r * 0.75} stroke="#ff8fab" strokeWidth={3} strokeLinecap="round" />
      {/* hour hand */}
      <line x1={cx} y1={cy} x2={hx} y2={hy} stroke="#333" strokeWidth={5} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={5} fill="#333" />
    </svg>
  );
}

const ACTIVITIES: Record<number, string> = {
  1: "Quiet time! 📖", 2: "Outside time! 🌳", 3: "Snack time! 🍪",
  4: "Playtime! 🎨", 5: "Dinner time! 🍝", 6: "Wake up time! ☀️",
  7: "Breakfast time! 🍳", 8: "School time! 🎒", 9: "Learning time! 📚",
  10: "Snack time! 🍎", 11: "Playtime! ⚽", 12: "Lunch time! 🍽️",
};
function getActivity(hour: number): string {
  return ACTIVITIES[hour] || "Time to learn!";
}

export function TellingTime() {
  const [mode, setMode] = useState<Mode>("learn");
  const [hour, setHour] = useState(6);

  return (
    <div className="card-soft mx-auto max-w-2xl p-6">
      <div className="flex justify-center gap-2 mb-6">
        <button onClick={() => setMode("learn")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "learn" ? "bg-pink text-white" : "bg-muted"}`}>
          🕐 Learn
        </button>
        <button onClick={() => setMode("quiz")}
          className={`rounded-full px-5 py-2 font-bold text-sm ${mode === "quiz" ? "bg-pink text-white" : "bg-muted"}`}>
          ❓ Quiz
        </button>
      </div>

      {mode === "learn" ? (
        <div className="text-center">
          <ClockFace hour={hour} />
          <p className="font-display text-2xl font-bold mt-3">{hour}:00</p>
          <p className="text-sm text-muted-foreground mb-4">{getActivity(hour)}</p>
          <button onClick={() => speak(`It is ${hour} o'clock.`)} className="mb-4 rounded-xl bg-lilac px-5 py-2 font-bold text-sm">
            🔊 Say the time
          </button>
          <div className="flex flex-wrap gap-2 justify-center">
            {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
              <button key={h} onClick={() => { setHour(h); speak(`It is ${h} o'clock.`); }}
                className={`rounded-xl px-3 py-2 text-sm font-bold transition ${hour === h ? "bg-pink text-white" : "bg-muted"}`}>
                {h}:00
              </button>
            ))}
          </div>
        </div>
      ) : (
        <TimeQuiz />
      )}
    </div>
  );
}

function TimeQuiz() {
  const [round, setRound] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  function buildRound(r: number) {
    const answer = (r % 12) + 1;
    const others = new Set<number>();
    while (others.size < 2) {
      const candidate = Math.floor(Math.random() * 12) + 1;
      if (candidate !== answer) others.add(candidate);
    }
    const options = [answer, ...others].sort(() => Math.random() - 0.5);
    return { answer, options };
  }

  const [data, setData] = useState(() => buildRound(0));

  function pick(n: number) {
    if (selected !== null) return;
    setSelected(n);
    if (n === data.answer) {
      addStars(2);
      setScore(s => s + 1);
      speak(`Yes! It is ${data.answer} o'clock!`);
    } else {
      speak(`Good try! It is ${data.answer} o'clock.`);
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
      <p className="mb-4 text-lg font-bold">What time is it?</p>
      <div className="flex justify-center mb-4">
        <ClockFace hour={data.answer} size={180} />
      </div>
      <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto mb-4">
        {data.options.map(n => {
          const showState = selected !== null;
          const isCorrect = n === data.answer;
          return (
            <button key={n} onClick={() => pick(n)} disabled={selected !== null}
              className={`font-display text-lg font-bold rounded-2xl p-4 transition ${
                showState && isCorrect ? "bg-green-200 scale-105" :
                showState && selected === n ? "bg-red-200" :
                "bg-sky/30 hover:scale-105"
              }`}>
              {n}:00
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
