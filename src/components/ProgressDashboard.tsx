import { getStats } from "@/lib/achievements";
import { ACHIEVEMENTS, getEarned } from "@/lib/achievements";

const SUBJECT_STATS = [
  { key: "spellWords",   label: "Words Spelled",     emoji: "✍️" },
  { key: "mathCorrect",  label: "Math Problems",     emoji: "➕" },
  { key: "rhymeCorrect", label: "Rhymes Found",      emoji: "🎵" },
  { key: "countCorrect", label: "Counting Correct",  emoji: "🔢" },
  { key: "lettersTraced",label: "Letters Traced",    emoji: "✏️" },
  { key: "storiesRead",  label: "Stories Read",      emoji: "📖" },
  { key: "animalsHeard", label: "Animals Explored",  emoji: "🐾" },
] as const;

export function ProgressDashboard({ childName, stars, streak }: { childName: string; stars: number; streak: number }) {
  const stats = getStats();
  const earned = getEarned();
  const totalAchievements = ACHIEVEMENTS.length;

  return (
    <div className="card-soft mx-auto max-w-3xl p-6">
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl font-bold">{childName}'s Progress 📊</h2>
        <p className="text-sm text-muted-foreground">A look at everything they've learned!</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="rounded-2xl bg-butter/40 p-4 text-center">
          <div className="text-3xl mb-1">⭐</div>
          <div className="font-display text-2xl font-bold">{stars}</div>
          <div className="text-xs text-muted-foreground">Total Stars</div>
        </div>
        <div className="rounded-2xl bg-peach/40 p-4 text-center">
          <div className="text-3xl mb-1">🔥</div>
          <div className="font-display text-2xl font-bold">{streak}</div>
          <div className="text-xs text-muted-foreground">Day Streak</div>
        </div>
        <div className="rounded-2xl bg-mint/40 p-4 text-center">
          <div className="text-3xl mb-1">🏆</div>
          <div className="font-display text-2xl font-bold">{earned.length}/{totalAchievements}</div>
          <div className="text-xs text-muted-foreground">Achievements</div>
        </div>
      </div>

      {/* Subject breakdown */}
      <h3 className="font-display text-lg font-bold mb-3">Activity by Subject</h3>
      <div className="space-y-2 mb-6">
        {SUBJECT_STATS.map(s => {
          const value = (stats as any)[s.key] || 0;
          const maxForBar = Math.max(20, value);
          return (
            <div key={s.key} className="flex items-center gap-3">
              <span className="text-xl w-8">{s.emoji}</span>
              <span className="text-sm font-semibold w-40 flex-shrink-0">{s.label}</span>
              <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-sky rounded-full transition-all" style={{ width: `${Math.min(100, (value/maxForBar)*100)}%` }} />
              </div>
              <span className="text-sm font-bold w-8 text-right">{value}</span>
            </div>
          );
        })}
      </div>

      {/* Recent achievements */}
      <h3 className="font-display text-lg font-bold mb-3">Earned Badges</h3>
      {earned.length === 0 ? (
        <p className="text-sm text-muted-foreground">No badges yet — keep playing to earn some!</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {ACHIEVEMENTS.filter(a => earned.includes(a.id)).map(a => (
            <div key={a.id} className="rounded-xl bg-mint/30 p-2 text-center">
              <div className="text-2xl">{a.emoji}</div>
              <div className="text-xs font-bold mt-1">{a.title}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
