import { supabase } from "@/integrations/supabase/client";
import { getStats } from "@/lib/achievements";

// Pushes the child's current stats up to Supabase user metadata so the
// weekly report Edge Function (which runs on the server, with no access
// to localStorage) can read them.
export async function syncStatsToSupabase(childName: string, stars: number, streak: number) {
  try {
    const stats = getStats();
    await supabase.auth.updateUser({
      data: {
        last_stats_sync: new Date().toISOString(),
        child_name: childName,
        stats: {
          stars,
          streak,
          spellWords: stats.spellWords || 0,
          mathCorrect: stats.mathCorrect || 0,
          rhymeCorrect: stats.rhymeCorrect || 0,
          countCorrect: stats.countCorrect || 0,
          lettersTraced: stats.lettersTraced || 0,
          storiesRead: stats.storiesRead || 0,
          animalsHeard: stats.animalsHeard || 0,
        },
      },
    });
  } catch (e) {
    console.error("Failed to sync stats to Supabase:", e);
  }
}
