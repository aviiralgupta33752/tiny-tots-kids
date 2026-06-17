import { useEffect, useState } from "react";
import type { Achievement } from "@/lib/achievements";

export function AchievementToast({ achievements, onDone }: { achievements: Achievement[]; onDone: () => void }) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (achievements.length === 0) return;
    const t = setTimeout(() => {
      if (current < achievements.length - 1) {
        setCurrent(c => c + 1);
      } else {
        setVisible(false);
        onDone();
      }
    }, 3000);
    return () => clearTimeout(t);
  }, [current, achievements]);

  if (!visible || achievements.length === 0) return null;
  const a = achievements[current];

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className="card-soft rounded-3xl px-6 py-4 shadow-2xl flex items-center gap-4 bg-butter border-4 border-yellow-300">
        <div className="text-5xl">{a.emoji}</div>
        <div>
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-wide">🏆 Achievement Unlocked!</div>
          <div className="font-display text-xl font-bold">{a.title}</div>
          <div className="text-sm text-muted-foreground">{a.desc}</div>
        </div>
      </div>
    </div>
  );
}
