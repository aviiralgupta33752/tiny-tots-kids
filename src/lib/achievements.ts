export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  check: (stats: UserStats) => boolean;
}

export interface UserStats {
  stars: number;
  streak: number;
  spellWords: number;
  mathCorrect: number;
  rhymeCorrect: number;
  animalsHeard: number;
  lettersTraced: number;
  storiesRead: number;
  daysPlayed: number;
  countCorrect: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id:"first_star",    emoji:"⭐", title:"First Star!",       desc:"Earn your first star",              check: s => s.stars >= 1 },
  { id:"star10",        emoji:"🌟", title:"Star Collector",    desc:"Earn 10 stars",                     check: s => s.stars >= 10 },
  { id:"star50",        emoji:"💫", title:"Star Master",       desc:"Earn 50 stars",                     check: s => s.stars >= 50 },
  { id:"star100",       emoji:"🏆", title:"Champion!",         desc:"Earn 100 stars",                    check: s => s.stars >= 100 },
  { id:"streak3",       emoji:"🔥", title:"On Fire!",          desc:"Play 3 days in a row",              check: s => s.streak >= 3 },
  { id:"streak7",       emoji:"🌈", title:"Week Warrior",      desc:"Play 7 days in a row",              check: s => s.streak >= 7 },
  { id:"streak30",      emoji:"👑", title:"Monthly Legend",    desc:"Play 30 days in a row",             check: s => s.streak >= 30 },
  { id:"spell5",        emoji:"✍️", title:"Speller!",          desc:"Spell 5 words correctly",           check: s => s.spellWords >= 5 },
  { id:"spell20",       emoji:"📝", title:"Word Wizard",       desc:"Spell 20 words correctly",          check: s => s.spellWords >= 20 },
  { id:"math10",        emoji:"➕", title:"Math Whiz",         desc:"Get 10 math problems right",        check: s => s.mathCorrect >= 10 },
  { id:"rhyme10",       emoji:"🎵", title:"Rhyme Master",      desc:"Find 10 rhyming words",             check: s => s.rhymeCorrect >= 10 },
  { id:"animals",       emoji:"🐾", title:"Animal Expert",     desc:"Hear all animal sounds",            check: s => s.animalsHeard >= 11 },
  { id:"trace10",       emoji:"✏️", title:"Tracing Star",      desc:"Trace 10 letters",                  check: s => s.lettersTraced >= 10 },
  { id:"traceAZ",       emoji:"🔤", title:"Alphabet Tracer",   desc:"Trace all 26 letters",              check: s => s.lettersTraced >= 26 },
  { id:"story1",        emoji:"📖", title:"Bookworm",          desc:"Read your first story",             check: s => s.storiesRead >= 1 },
  { id:"story5",        emoji:"📚", title:"Story Master",      desc:"Read 5 stories",                    check: s => s.storiesRead >= 5 },
  { id:"count20",       emoji:"🔢", title:"Counter",           desc:"Count correctly 20 times",          check: s => s.countCorrect >= 20 },
  { id:"days5",         emoji:"🎯", title:"Dedicated Learner", desc:"Play on 5 different days",          check: s => s.daysPlayed >= 5 },
];

const STATS_KEY = "tt_user_stats_v1";
const EARNED_KEY = "tt_earned_achievements_v1";

export function getStats(): UserStats {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) || "{}") as UserStats;
  } catch { return {} as UserStats; }
}

export function updateStats(update: Partial<UserStats>) {
  const current = getStats();
  const next = { ...current };
  for (const key of Object.keys(update) as (keyof UserStats)[]) {
    next[key] = (next[key] || 0) + (update[key] || 0);
  }
  localStorage.setItem(STATS_KEY, JSON.stringify(next));
  return checkNewAchievements(next);
}

export function getEarned(): string[] {
  try { return JSON.parse(localStorage.getItem(EARNED_KEY) || "[]"); }
  catch { return []; }
}

export function checkNewAchievements(stats: UserStats): Achievement[] {
  const earned = getEarned();
  const newOnes = ACHIEVEMENTS.filter(a => !earned.includes(a.id) && a.check(stats));
  if (newOnes.length > 0) {
    localStorage.setItem(EARNED_KEY, JSON.stringify([...earned, ...newOnes.map(a => a.id)]));
  }
  return newOnes;
}
