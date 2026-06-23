import { useEffect, useRef, useState } from "react";
import { ANIMALS, COLORS, NUMBERS, SHAPES, TONES, speak, toneClass, type Tone } from "@/lib/learn-data";
import { StoryTime } from "@/components/StoryTime";
import { addStars, earnedStickers, useStars, useStreak, useDifficulty, getCurrentLevel, getNextLevel, LEVELS } from "@/lib/rewards";
import { prewarm } from "@/lib/speak";
import { SpellItGame } from "@/components/SpellItGame";
import { CountingGame, RhymeTimeGame, MathGame } from "@/components/CountingAndRhymeGames";
import { ProgressBar } from "@/components/GameUtils";
import { AvatarDisplay, AvatarPicker, loadAvatar, type AvatarState } from "@/components/AvatarPicker";
import { playAnimalSound, stopAllSounds, startBgMusic, stopBgMusic, toggleBgMusic } from "@/lib/audioManager";
import { ColoringPage } from "@/components/ColoringPage";
import { SightWordsGame, PhonicsGame, MemoryGame, BodyPartsGame, EmotionsGame, WeatherCalendar } from "@/components/NewGames";
import { getTabsForAge } from "@/components/OnboardingPage";
import type { ChildProfile } from "@/hooks/useAuth";
import { DailyChallenge } from "@/components/DailyChallenge";
import { AchievementToast } from "@/components/AchievementToast";
import { NumberTrace } from "@/components/NumberTrace";
import { LanguagePicker } from "@/components/LanguagePicker";
import { ProfileSwitcher, getProfiles, saveProfiles, setActiveProfile } from "@/components/MultiProfile";
import { getLang, t, ALPHABET_DATA } from "@/lib/i18n";
import type { Language } from "@/lib/i18n";
import { checkNewAchievements, getStats } from "@/lib/achievements";
import type { Achievement } from "@/lib/achievements";
import { OnboardingPage } from "@/components/OnboardingPage";
import { useBedtimeMode, BedtimeToggle, BedtimeOverlay } from "@/components/BedtimeMode";
import { ProgressDashboard } from "@/components/ProgressDashboard";
import { SentenceGame } from "@/components/SentenceGame";
import { SongPlayer } from "@/components/SongPlayer";
import { OppositesGame } from "@/components/OppositesGame";
import { SortingPatternsGame } from "@/components/SortingPatternsGame";
import { DaysOfWeek } from "@/components/DaysOfWeek";
import { CommunityHelpers } from "@/components/CommunityHelpers";
import { CountTo100 } from "@/components/CountTo100";
import { TellingTime } from "@/components/TellingTime";
import { syncStatsToSupabase } from "@/lib/syncStatsToSupabase";

type TabKey = "abc"|"123"|"colors"|"shapes"|"animals"|"story"|"spell"|"count"|"math"|"rhyme"|"sight"|"phonics"|"memory"|"body"|"emotions"|"weather"|"trace"|"numtrace"|"sentence"|"songs"|"opposites"|"sorting"|"days"|"helpers"|"count100"|"time"|"match"|"quiz"|"color"|"rewards"|"progress"|"worksheets";

const TABS: { key: TabKey; label: string; emoji: string }[] = [
  { key:"abc",      label:"ABCs",           emoji:"🔤" },
  { key:"123",      label:"123s",           emoji:"🔢" },
  { key:"colors",   label:"Colors",         emoji:"🎨" },
  { key:"shapes",   label:"Shapes",         emoji:"⭐" },
  { key:"animals",  label:"Animals",        emoji:"🐾" },
  { key:"story",    label:"Stories",        emoji:"📖" },
  { key:"spell",    label:"Spell It",       emoji:"✍️" },
  { key:"count",    label:"Counting",       emoji:"🔢" },
  { key:"math",     label:"Math",           emoji:"➕" },
  { key:"rhyme",    label:"Rhyme Time",     emoji:"🎵" },
  { key:"sight",    label:"Sight Words",    emoji:"👁️" },
  { key:"phonics",  label:"Phonics",        emoji:"🔤" },
  { key:"memory",   label:"Memory",         emoji:"🧩" },
  { key:"body",     label:"Body Parts",     emoji:"🫀" },
  { key:"emotions", label:"Emotions",       emoji:"😊" },
  { key:"weather",  label:"Weather",        emoji:"☀️" },
  { key:"trace",    label:"Trace",          emoji:"✏️" },
  { key:"numtrace", label:"Number Trace",   emoji:"🔢" },
  { key:"sentence", label:"Sentences",      emoji:"📝" },
  { key:"songs",    label:"Songs",          emoji:"🎶" },
  { key:"opposites",label:"Opposites",      emoji:"↔️" },
  { key:"sorting",  label:"Sorting",        emoji:"🗂️" },
  { key:"days",     label:"Days",           emoji:"📅" },
  { key:"helpers",  label:"Helpers",        emoji:"🚒" },
  { key:"count100", label:"Count to 100",   emoji:"💯" },
  { key:"time",     label:"Telling Time",   emoji:"🕐" },
  { key:"match",    label:"Match",          emoji:"🧩" },
  { key:"quiz",     label:"Quiz",           emoji:"❓" },
  { key:"color",    label:"Color!",         emoji:"🖍️" },
  { key:"rewards",  label:"Rewards",        emoji:"🏆" },
  { key:"progress", label:"Progress",       emoji:"📊" },
  { key:"worksheets", label:"Worksheets",   emoji:"🖨️" },
];

const CURRICULUM: TabKey[] = ["abc","123","colors","animals","shapes","story","spell","count","math","rhyme","sight","phonics","emotions","body","weather"];

function getCurriculumTab(): TabKey {
  const slot = Math.floor(Date.now() / (30 * 60 * 1000));
  return CURRICULUM[slot % CURRICULUM.length];
}

const ADMIN_EMAIL = "avigupta2772@gmail.com";

export function LearnApp({ childProfile: initialProfile, onSignOut, userEmail }: { childProfile: ChildProfile; onSignOut: () => void; userEmail?: string }) {
  const isAdmin = userEmail === ADMIN_EMAIL;
  const [devAgeOverride, setDevAgeOverride] = useState<number | null>(null);
  const effectiveAge = devAgeOverride ?? initialProfile.age;
  const allowedTabs = getTabsForAge(effectiveAge);
  const visibleTabs = TABS.filter(t => allowedTabs.includes(t.key));
  const [tab, setTab] = useState<TabKey>((allowedTabs[0] as TabKey) ?? "abc");
  const [childProfile, setChildProfile] = useState(initialProfile);
  const [showAddChild, setShowAddChild] = useState(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const lang = getLang() as Language;
  const ALPHABET = ALPHABET_DATA[lang] || ALPHABET_DATA["en"];
  const [bedtimeActive, bedtimePref, setBedtimePref] = useBedtimeMode();
  const stars = useStars();
  const streak = useStreak();
  const [difficulty, setDifficulty] = useDifficulty();
  const level = getCurrentLevel(stars);
  const nextLevel = getNextLevel(stars);
  const [avatar, setAvatar] = useState<AvatarState>(loadAvatar);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [currTab, setCurrTab] = useState<TabKey>(getCurriculumTab());
  const [musicOn, setMusicOn] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [focusTab, setFocusTab] = useState<TabKey>("abc");
  const [focusTimeLeft, setFocusTimeLeft] = useState(0);
  const focusTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  function switchTab(t: TabKey) {
    stopAllSounds();
    setTab(t);
  }

  function startFocusMode(t: TabKey) {
    setFocusTab(t); setFocusMode(true); setFocusTimeLeft(30*60);
    switchTab(t);
    if (focusTimer.current) clearInterval(focusTimer.current);
    focusTimer.current = setInterval(() => {
      setFocusTimeLeft(s => {
        if (s <= 1) { setFocusMode(false); if (focusTimer.current) clearInterval(focusTimer.current); return 0; }
        return s - 1;
      });
    }, 1000);
  }

  function exitFocus() { setFocusMode(false); if (focusTimer.current) clearInterval(focusTimer.current); }

  useEffect(() => {
    const id = setInterval(() => setCurrTab(getCurriculumTab()), 60_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!musicOn) return;
    startBgMusic({ calm: bedtimeActive, volume: bedtimeActive ? 0.035 : 0.05 });
    return () => stopBgMusic();
  }, [bedtimeActive]);

  useEffect(() => () => { if (focusTimer.current) clearInterval(focusTimer.current); }, []);

  useEffect(() => {
    // When the dev age override changes, jump to a tab that's valid for that age
    if (!allowedTabs.includes(tab)) {
      setTab((allowedTabs[0] as TabKey) ?? "abc");
    }
  }, [devAgeOverride]);

  useEffect(() => {
    const stats = getStats();
    const updated = { ...stats, stars, streak };
    const newOnes = checkNewAchievements(updated);
    if (newOnes.length > 0) setNewAchievements(prev => [...prev, ...newOnes]);
  }, [stars, streak]);

  useEffect(() => {
    // Sync stats to Supabase every 2 minutes so the weekly report email has fresh data
    syncStatsToSupabase(childProfile.name, stars, streak);
    const id = setInterval(() => syncStatsToSupabase(childProfile.name, stars, streak), 2 * 60_000);
    return () => clearInterval(id);
  }, [childProfile.name, stars, streak]);

  useEffect(() => {
    const req = (window as any).requestIdleCallback ?? ((cb: ()=>void) => setTimeout(cb,300));
    const id = req(() => prewarm(ALPHABET.map(a => `${a.letter} is for ${a.word}.`)));
    return () => ((window as any).cancelIdleCallback ?? clearTimeout)(id);
  }, []);

  return (
    <div className={`min-h-screen px-4 pb-16 pt-6 sm:px-8 relative transition-colors duration-700 ${bedtimeActive ? "bedtime-mode" : ""}`}
      style={bedtimeActive ? { background: "linear-gradient(160deg, #1a1a3a 0%, #2d2654 50%, #1f1b3d 100%)" } : undefined}>
      {bedtimeActive && <BedtimeOverlay />}
      {showAvatarPicker && <AvatarPicker onClose={() => { setAvatar(loadAvatar()); setShowAvatarPicker(false); }} />}
      {showAddChild && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <OnboardingPage onDone={(p) => {
            const profiles = getProfiles();
            const updated = [...profiles.filter(x => x.name !== p.name), p];
            saveProfiles(updated);
            setActiveProfile(p);
            setChildProfile(p);
            setShowAddChild(false);
          }} />
        </div>
      )}
      {newAchievements.length > 0 && (
        <AchievementToast achievements={newAchievements} onDone={() => setNewAchievements([])} />
      )}

      {/* Header */}
      <header className="mx-auto mb-4 flex max-w-6xl items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-pink text-2xl shadow-md">{bedtimeActive ? "🌙" : "🌈"}</div>
          <div>
            <h1 className={`text-2xl font-bold sm:text-3xl ${bedtimeActive ? "text-white" : ""}`}>Tiny Tots</h1>
            <p className={`text-xs ${bedtimeActive ? "text-white/70" : "text-muted-foreground"}`}>
              {bedtimeActive ? `Sweet dreams, ${childProfile.name}! 🌙` : `Hi ${childProfile.name}! 👋`}
            </p>
          </div>
          {isAdmin && (
            <select
              value={devAgeOverride ?? ""}
              onChange={(e) => setDevAgeOverride(e.target.value === "" ? null : Number(e.target.value))}
              className="card-soft rounded-full px-3 py-2 text-xs font-bold bg-lilac/40 border-none cursor-pointer"
              title="Dev: preview a different age's content without changing the real profile">
              <option value="">🛠️ Age: {childProfile.age} (real)</option>
              {[3,4,5,6,7].map(a => (
                <option key={a} value={a}>🛠️ Preview age {a}</option>
              ))}
            </select>
          )}
        </div>
        <div className="flex items-center gap-2">
          {streak > 0 && (
            <div className="card-soft flex items-center gap-1 rounded-full bg-peach px-3 py-2 text-sm font-bold">
              🔥 {streak}d
            </div>
          )}
          <button onClick={onSignOut}
            className="card-soft rounded-full px-3 py-2 text-xs font-bold hover:scale-105 transition bg-muted">
            🚪 Sign out
          </button>
          <LanguagePicker />
          <BedtimeToggle pref={bedtimePref} onChange={setBedtimePref} />
          <ProfileSwitcher
            currentProfile={childProfile}
            onSwitch={setChildProfile}
            onAddNew={() => setShowAddChild(true)}
          />
          <button onClick={() => { const on = !musicOn; setMusicOn(on); if (on) startBgMusic({ calm: bedtimeActive, volume: bedtimeActive ? 0.035 : 0.05 }); else stopBgMusic(); }}
            className="card-soft rounded-full px-3 py-2 text-lg font-bold hover:scale-105 transition">
            {musicOn ? "🎵" : "🔇"}
          </button>
          <button onClick={() => setShowAvatarPicker(true)} className="transition hover:scale-110">
            <AvatarDisplay avatar={avatar} size="sm" />
          </button>
          <button onClick={() => switchTab("rewards")}
            className="card-soft flex items-center gap-2 rounded-full bg-butter px-4 py-2 text-sm font-bold shadow-sm hover:scale-105 transition">
            <span className="text-xl">⭐</span><span>{stars}</span>
          </button>
        </div>
      </header>

      {/* Daily Challenge */}
      <div className="mx-auto mb-3 max-w-6xl">
        <DailyChallenge onGoToTab={(t) => switchTab(t as TabKey)} />
      </div>
      <div className="mx-auto mb-3 max-w-6xl">
        {focusMode ? (
          <div className="flex items-center justify-between rounded-2xl bg-lilac/60 px-4 py-2">
            <span className="text-sm font-bold">🎯 Focus: {TABS.find(t=>t.key===focusTab)?.label} — {Math.floor(focusTimeLeft/60)}:{String(focusTimeLeft%60).padStart(2,"0")}</span>
            <button onClick={exitFocus} className="rounded-xl bg-white/80 px-3 py-1 text-xs font-bold">Exit</button>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-2xl bg-mint/60 px-4 py-2">
            <span className="text-sm font-bold">📚 Now: <span className="underline">{TABS.find(t=>t.key===currTab)?.label}</span></span>
            <button onClick={() => startFocusMode(currTab)} className="rounded-xl bg-white/80 px-3 py-1 text-xs font-bold">🎯 Focus</button>
          </div>
        )}
      </div>

      {/* Level bar */}
      <div className="mx-auto mb-4 max-w-6xl">
        <div className="card-soft flex items-center gap-4 p-3">
          <div className="text-2xl">{level.emoji}</div>
          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between text-xs font-bold">
              <span>{level.name}</span>
              {nextLevel && <span className="text-muted-foreground">{nextLevel.starsNeeded-stars}⭐ to {nextLevel.name}</span>}
            </div>
            {nextLevel && <ProgressBar current={stars-level.starsNeeded} total={nextLevel.starsNeeded-level.starsNeeded} color="bg-butter" />}
          </div>
          <div className="flex gap-1">
            {(["easy","medium","hard"] as const).map(d => (
              <button key={d} onClick={() => setDifficulty(d)}
                className={`rounded-lg px-2 py-1 text-xs font-bold transition ${difficulty===d ? "bg-foreground text-background" : "bg-muted"}`}>
                {d==="easy" ? "🌱" : d==="medium" ? "⭐" : "🔥"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="mx-auto mb-8 max-w-6xl relative z-10">
        <div className="card-soft flex flex-wrap gap-2 p-2">
          {visibleTabs.map(t => (
            <button key={t.key} onClick={() => switchTab(t.key)}
              className={`flex-1 min-w-[80px] rounded-xl px-3 py-3 text-xs font-semibold transition-all sm:text-sm ${
                tab===t.key ? "bg-foreground text-background shadow-md scale-[1.02]" : "hover:bg-muted text-foreground/80"
              }`}>
              <span className="mr-1">{t.emoji}</span>{t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-6xl relative z-10">
        {tab==="abc"      && <AlphabetGrid alphabet={ALPHABET} />}
        {tab==="123"      && <NumberGrid />}
        {tab==="colors"   && <ColorGrid />}
        {tab==="shapes"   && <ShapeGrid />}
        {tab==="animals"  && <AnimalGrid />}
        {tab==="story"    && <StoryTime />}
        {tab==="spell"    && <Section title="Spell It ✍️" subtitle="Hear the word, tap the letters!"><SpellItGame difficulty={difficulty} /></Section>}
        {tab==="count"    && <Section title="Counting 🔢" subtitle="Count and pick the right number!"><CountingGame difficulty={difficulty} /></Section>}
        {tab==="math"     && <Section title="Math ➕" subtitle="Solve the problem!"><MathGame difficulty={difficulty} /></Section>}
        {tab==="rhyme"    && <Section title="Rhyme Time 🎵" subtitle="Find the word that rhymes!"><RhymeTimeGame difficulty={difficulty} /></Section>}
        {tab==="sight"    && <Section title="Sight Words 👁️" subtitle="Can you read these words?"><SightWordsGame difficulty={difficulty} /></Section>}
        {tab==="phonics"  && <Section title="Phonics 🔤" subtitle="What sound does this letter make?"><PhonicsGame difficulty={difficulty} /></Section>}
        {tab==="memory"   && <Section title="Memory Game 🧩" subtitle="Find the matching pairs!"><MemoryGame difficulty={difficulty} /></Section>}
        {tab==="body"     && <Section title="Body Parts 🫀" subtitle="Tap to learn about your body!"><BodyPartsGame /></Section>}
        {tab==="emotions" && <Section title="Emotions 😊" subtitle="Learn about feelings!"><EmotionsGame /></Section>}
        {tab==="weather"  && <Section title="Weather & Calendar ☀️" subtitle="What day is it today?"><WeatherCalendar /></Section>}
        {tab==="numtrace" && <NumberTrace />}
        {tab==="sentence" && <Section title="Build a Sentence 📝" subtitle="Tap the words in order!"><SentenceGame difficulty={difficulty} /></Section>}
        {tab==="songs"    && <Section title="Sing Along! 🎶" subtitle="Learn with music!"><SongPlayer /></Section>}
        {tab==="opposites" && <Section title="Opposites Game ↔️" subtitle="Find the opposite word!"><OppositesGame /></Section>}
        {tab==="sorting" && <Section title="Sorting & Patterns 🗂️" subtitle="Sort items and find patterns!"><SortingPatternsGame /></Section>}
        {tab==="days" && <Section title="Days of the Week 📅" subtitle="Learn the days!"><DaysOfWeek /></Section>}
        {tab==="helpers" && <Section title="Community Helpers 🚒" subtitle="Who helps our community?"><CommunityHelpers /></Section>}
        {tab==="count100" && <Section title="Count to 100 💯" subtitle="Numbers, skip counting, and more!"><CountTo100 /></Section>}
        {tab==="time" && <Section title="Telling Time 🕐" subtitle="Learn to read a clock!"><TellingTime /></Section>}
        {tab==="trace"    && <TracePanel alphabet={ALPHABET} />}
        {tab==="match"    && <MatchGame alphabet={ALPHABET} />}
        {tab==="quiz"     && <QuizGame alphabet={ALPHABET} />}
        {tab==="color"    && <Section title="Free Time 🖍️" subtitle="Color and draw — it's your art!"><ColoringPage /></Section>}
        {tab==="rewards"  && <RewardsPanel stars={stars} streak={streak} avatar={avatar} onEditAvatar={() => setShowAvatarPicker(true)} />}
        {tab==="progress" && <Section title="Progress 📊" subtitle="See everything your child has learned!"><ProgressDashboard childName={childProfile.name} stars={stars} streak={streak} /></Section>}
        {tab==="worksheets" && <WorksheetsPanel />}
      </main>
    </div>
  );
}

function WorksheetsPanel() {
  const worksheets = [
    { name: "Letter Tracing (A-Z)", emoji: "🔤", file: "/letter-tracing-worksheet.pdf", desc: "Practice writing every uppercase and lowercase letter" },
    { name: "Number Tracing (1-10)", emoji: "🔢", file: "/number-tracing-worksheet.pdf", desc: "Practice writing numbers one through ten" },
    { name: "Spelling Practice List", emoji: "✍️", file: "/spelling-practice-worksheet.pdf", desc: "Easy, medium and hard words to write 3 times each" },
    { name: "Coloring Page", emoji: "🎨", file: "/coloring-worksheet.pdf", desc: "Sun, star, flower and house to color in!" },
    { name: "Animal Coloring Page", emoji: "🐶", file: "/coloring-worksheet-animals.pdf", desc: "Dog, cat and penguin to color in!" },
  ];

  return (
    <Section title="Printable Worksheets 🖨️" subtitle="Download and print these at home!">
      <div className="grid gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
        {worksheets.map(w => (
          <a key={w.file} href={w.file} download target="_blank" rel="noopener noreferrer"
            className="card-soft rounded-2xl p-5 flex items-center gap-4 hover:scale-105 transition">
            <div className="text-4xl">{w.emoji}</div>
            <div className="flex-1">
              <div className="font-bold">{w.name}</div>
              <div className="text-xs text-muted-foreground">{w.desc}</div>
            </div>
            <div className="text-pink font-bold text-sm">⬇️</div>
          </a>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground mt-4">
        Tip: print on regular paper, then use crayons, markers or pencils!
      </p>
    </Section>
  );
}

function RewardsPanel({ stars, streak, avatar, onEditAvatar }: { stars:number; streak:number; avatar:AvatarState; onEditAvatar:()=>void }) {
  const stickers = earnedStickers(stars);
  const level = getCurrentLevel(stars);
  const nextLevel = getNextLevel(stars);
  return (
    <Section title="Your Rewards 🏆" subtitle="Earn stars by playing games!">
      <div className="card-soft mx-auto max-w-2xl p-8 text-center">
        {streak > 0 && <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-peach px-5 py-2 text-lg font-bold">🔥 {streak} day streak!</div>}
        <div className="mb-4 flex justify-center">
          <button onClick={onEditAvatar} className="group relative">
            <AvatarDisplay avatar={avatar} size="lg" />
            <span className="absolute -bottom-1 -right-1 rounded-full bg-pink p-1 text-xs shadow group-hover:scale-110 transition">✏️</span>
          </button>
        </div>
        <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-butter px-6 py-3 text-2xl font-bold">⭐ {stars} stars</div>
        <div className="mb-6">
          <p className="mb-2 text-lg font-bold">{level.emoji} Level {level.level}: {level.name}</p>
          {nextLevel && <div className="mx-auto max-w-xs"><ProgressBar current={stars-level.starsNeeded} total={nextLevel.starsNeeded-level.starsNeeded} color="bg-mint" /><p className="mt-1 text-xs text-muted-foreground">{nextLevel.starsNeeded-stars} more stars to {nextLevel.name}!</p></div>}
        </div>
        <h3 className="mb-3 font-display text-xl font-bold">Level Journey</h3>
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {LEVELS.map(l => <div key={l.level} className={`rounded-2xl px-4 py-2 text-sm font-bold ${stars>=l.starsNeeded ? "bg-mint shadow-md" : "bg-muted opacity-50"}`}>{l.emoji} {l.name}<div className="text-xs opacity-70">{l.starsNeeded}⭐</div></div>)}
        </div>
        <h3 className="mb-4 font-display text-2xl font-bold">Sticker Book</h3>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {[5,15,30,50,75,100].map((at,idx) => {
            const emojis = ["🌟","🦄","🌈","👑","🚀","🏆"];
            return <div key={at} className={`aspect-square rounded-2xl p-3 ${stars>=at ? "bg-mint shadow-md scale-105" : "bg-muted opacity-40 grayscale"}`}><div className="text-4xl">{emojis[idx]}</div><div className="mt-1 text-xs font-bold">{at}⭐</div></div>;
          })}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{stickers.length} of 6 stickers collected</p>
      </div>
    </Section>
  );
}

function Tile({ tone, onClick, children, big }: { tone:Tone; onClick:()=>void; children:React.ReactNode; big?:boolean }) {
  return (
    <button onClick={onClick} className={`tile-pop tile-pop-hover card-soft ${toneClass(tone)} relative flex flex-col items-center justify-center gap-2 p-4 text-foreground/90 ${big ? "aspect-square" : "aspect-[4/5]"}`}>
      {children}
    </button>
  );
}

function AlphabetGrid({ alphabet }: { alphabet: typeof ALPHABET_DATA["en"] }) {
  const [mode, setMode] = useState<"learn"|"quiz">("learn");
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string|null>(null);
  const q = useRef(rollQ());
  function rollQ() { const items=[...alphabet].sort(()=>Math.random()-.5).slice(0,4); const answer=items[Math.floor(Math.random()*items.length)]; return {items,answer}; }
  function sayPrompt() { speak(`Where is the letter ${q.current.answer.letter}?`); }
  useEffect(() => { if (mode==="quiz") setTimeout(sayPrompt, 400); }, [round, mode]);
  function pick(letter: string) {
    if (picked !== null) return;
    setPicked(letter);
    const ok = letter === q.current.answer.letter;
    if (ok) { addStars(1); speak("Yes! Great job!"); }
    else speak(`That was ${q.current.answer.letter}! Try again next time!`);
  }
  function next() { q.current = rollQ(); setPicked(null); setRound(r => r+1); }

  return (
    <Section title="The Alphabet" subtitle={mode==="learn" ? "Tap a letter to hear it!" : "Find the right letter!"}>
      <div className="mb-5 flex justify-center gap-2">
        <button onClick={() => setMode("learn")} className={`rounded-xl px-4 py-2 font-bold text-sm ${mode==="learn" ? "bg-foreground text-background" : "bg-muted"}`}>🔤 Learn</button>
        <button onClick={() => { setMode("quiz"); setRound(r=>r+1); setPicked(null); }} className={`rounded-xl px-4 py-2 font-bold text-sm ${mode==="quiz" ? "bg-foreground text-background" : "bg-muted"}`}>❓ Quiz</button>
      </div>

      {mode === "learn" ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7">
          {alphabet.map((a,i) => (
            <Tile key={a.letter} tone={TONES[i%TONES.length]} onClick={() => speak(`${a.letter} is for ${a.word}`)}>
              <span className="text-5xl font-bold font-display sm:text-6xl">{a.letter}</span>
              <span className="text-3xl">{a.emoji}</span>
              <span className="text-xs font-semibold sm:text-sm">{a.word}</span>
            </Tile>
          ))}
        </div>
      ) : (
        <div className="card-soft mx-auto max-w-2xl p-6 text-center">
          <button onClick={sayPrompt} className="mb-6 inline-flex items-center gap-3 rounded-2xl bg-lilac px-6 py-4 font-display text-xl font-bold shadow-md">
            🔊 Where is {q.current.answer.letter}?
          </button>
          <div key={round} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {q.current.items.map((a,i) => {
              const isPicked = picked === a.letter; const isAnswer = a.letter === q.current.answer.letter;
              const state = picked !== null ? (isAnswer ? "bg-mint scale-105" : isPicked ? "bg-pink/60" : "bg-muted opacity-50") : toneClass(TONES[i%TONES.length]);
              return (
                <button key={a.letter} onClick={() => pick(a.letter)} disabled={picked !== null}
                  className={`tile-pop tile-pop-hover card-soft aspect-square ${state}`}>
                  <span className="font-display text-6xl font-bold">{a.letter}</span>
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <div className="mt-6">
              <p className="mb-3 text-xl font-bold">{picked === q.current.answer.letter ? "🎉 Awesome!" : "💪 Good try, keep going!"}</p>
              <button onClick={next} className="rounded-xl bg-pink px-6 py-3 font-bold text-white">Next →</button>
            </div>
          )}
        </div>
      )}
    </Section>
  );
}

function NumberGrid() {
  const NUMBER_WORDS = ["one","two","three","four","five","six","seven","eight","nine","ten"];
  const [mode, setMode] = useState<"learn"|"quiz">("learn");
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<number|null>(null);
  const q = useRef(rollQ());
  function rollQ() { const items=[...NUMBERS].sort(()=>Math.random()-.5).slice(0,4); const answer=items[Math.floor(Math.random()*items.length)]; return {items,answer}; }
  function sayPrompt() { speak(`Where is the number ${q.current.answer.n}?`); }
  useEffect(() => { if (mode==="quiz") setTimeout(sayPrompt, 400); }, [round, mode]);
  function pick(n: number) {
    if (picked !== null) return;
    setPicked(n);
    const ok = n === q.current.answer.n;
    if (ok) { addStars(1); speak("Yes! Great job!"); }
    else speak(`That was ${q.current.answer.n}! Try again next time!`);
  }
  function next() { q.current = rollQ(); setPicked(null); setRound(r => r+1); }

  return (
    <Section title="Numbers 1 to 10" subtitle={mode==="learn" ? "Count along out loud!" : "Find the right number!"}>
      <div className="mb-5 flex justify-center gap-2">
        <button onClick={() => setMode("learn")} className={`rounded-xl px-4 py-2 font-bold text-sm ${mode==="learn" ? "bg-foreground text-background" : "bg-muted"}`}>🔢 Learn</button>
        <button onClick={() => { setMode("quiz"); setRound(r=>r+1); setPicked(null); }} className={`rounded-xl px-4 py-2 font-bold text-sm ${mode==="quiz" ? "bg-foreground text-background" : "bg-muted"}`}>❓ Quiz</button>
      </div>

      {mode === "learn" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {NUMBERS.map((n,i) => (
            <Tile key={n.n} tone={TONES[i%TONES.length]} onClick={() => speak(`The number ${NUMBER_WORDS[i]}! ${n.n === 1 ? "one star" : `${n.n} stars`}`)} big>
              <span className="text-6xl font-bold font-display sm:text-7xl">{n.n}</span>
              <div className="flex flex-wrap justify-center gap-0.5">
                {Array.from({length:n.n}).map((_,j) => <span key={j} className="text-lg">⭐</span>)}
              </div>
              <span className="text-sm font-semibold capitalize">{NUMBER_WORDS[i]}</span>
            </Tile>
          ))}
        </div>
      ) : (
        <div className="card-soft mx-auto max-w-2xl p-6 text-center">
          <button onClick={sayPrompt} className="mb-6 inline-flex items-center gap-3 rounded-2xl bg-lilac px-6 py-4 font-display text-xl font-bold shadow-md">
            🔊 Where is {q.current.answer.n}?
          </button>
          <div key={round} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {q.current.items.map((n,i) => {
              const isPicked = picked === n.n; const isAnswer = n.n === q.current.answer.n;
              const state = picked !== null ? (isAnswer ? "bg-mint scale-105" : isPicked ? "bg-pink/60" : "bg-muted opacity-50") : toneClass(TONES[i%TONES.length]);
              return (
                <button key={n.n} onClick={() => pick(n.n)} disabled={picked !== null}
                  className={`tile-pop tile-pop-hover card-soft aspect-square ${state}`}>
                  <span className="font-display text-6xl font-bold">{n.n}</span>
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <div className="mt-6">
              <p className="mb-3 text-xl font-bold">{picked === q.current.answer.n ? "🎉 Awesome!" : "💪 Good try, keep going!"}</p>
              <button onClick={next} className="rounded-xl bg-pink px-6 py-3 font-bold text-white">Next →</button>
            </div>
          )}
        </div>
      )}
    </Section>
  );
}

function ColorGrid() {
  const [mode, setMode] = useState<"learn"|"quiz">("learn");
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string|null>(null);
  const q = useRef(rollQ());
  function rollQ() { const items=[...COLORS].sort(()=>Math.random()-.5).slice(0,4); const answer=items[Math.floor(Math.random()*items.length)]; return {items,answer}; }
  function sayPrompt() { speak(`Where is the color ${q.current.answer.name}?`); }
  useEffect(() => { if (mode==="quiz") setTimeout(sayPrompt, 400); }, [round, mode]);
  function pick(name: string) {
    if (picked !== null) return;
    setPicked(name);
    const ok = name === q.current.answer.name;
    if (ok) { addStars(1); speak("Yes! Great job!"); }
    else speak(`That was ${q.current.answer.name}! Try again next time!`);
  }
  function next() { q.current = rollQ(); setPicked(null); setRound(r => r+1); }

  return (
    <Section title="Colors" subtitle={mode==="learn" ? "Tap a color to hear its name!" : "Find the right color!"}>
      <div className="mb-5 flex justify-center gap-2">
        <button onClick={() => setMode("learn")} className={`rounded-xl px-4 py-2 font-bold text-sm ${mode==="learn" ? "bg-foreground text-background" : "bg-muted"}`}>🎨 Learn</button>
        <button onClick={() => { setMode("quiz"); setRound(r=>r+1); setPicked(null); }} className={`rounded-xl px-4 py-2 font-bold text-sm ${mode==="quiz" ? "bg-foreground text-background" : "bg-muted"}`}>❓ Quiz</button>
      </div>

      {mode === "learn" ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {COLORS.map(c => (
            <button key={c.name} onClick={() => speak(c.phrase)} className="card-soft tile-pop tile-pop-hover flex flex-col items-center gap-3 p-5">
              <div className="grid h-28 w-28 place-items-center rounded-full text-5xl shadow-inner" style={{backgroundColor:c.hex}}>{c.emoji}</div>
              <span className="text-lg font-bold font-display">{c.name}</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="card-soft mx-auto max-w-2xl p-6 text-center">
          <button onClick={sayPrompt} className="mb-6 inline-flex items-center gap-3 rounded-2xl bg-lilac px-6 py-4 font-display text-xl font-bold shadow-md">
            🔊 Where is {q.current.answer.name}?
          </button>
          <div key={round} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {q.current.items.map(c => {
              const isPicked = picked === c.name; const isAnswer = c.name === q.current.answer.name;
              const ring = picked !== null ? (isAnswer ? "ring-4 ring-mint scale-105" : isPicked ? "ring-4 ring-pink opacity-70" : "opacity-40") : "";
              return (
                <button key={c.name} onClick={() => pick(c.name)} disabled={picked !== null}
                  className={`card-soft tile-pop tile-pop-hover flex flex-col items-center gap-2 p-4 transition ${ring}`}>
                  <div className="grid h-20 w-20 place-items-center rounded-full text-3xl shadow-inner" style={{backgroundColor:c.hex}}>{c.emoji}</div>
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <div className="mt-6">
              <p className="mb-3 text-xl font-bold">{picked === q.current.answer.name ? "🎉 Awesome!" : "💪 Good try, keep going!"}</p>
              <button onClick={next} className="rounded-xl bg-pink px-6 py-3 font-bold text-white">Next →</button>
            </div>
          )}
        </div>
      )}
    </Section>
  );
}

function ShapeGrid() {
  return (
    <Section title="Shapes" subtitle="Tap a shape to hear its name!">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {SHAPES.map((s,i) => (
          <Tile key={s.name} tone={TONES[i%TONES.length]} onClick={() => speak(s.name)} big>
            <svg viewBox="0 0 100 100" className="h-28 w-28 fill-foreground/85">{s.svg}</svg>
            <span className="text-xl font-bold font-display">{s.name}</span>
          </Tile>
        ))}
      </div>
    </Section>
  );
}

function AnimalGrid() {
  return (
    <Section title="Animal Sounds" subtitle="Tap an animal to hear it!">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {ANIMALS.map((a,i) => (
          <Tile key={a.name} tone={TONES[i%TONES.length]} onClick={() => playAnimalSound(a.name)} big>
            <span className="text-7xl">{a.emoji}</span>
            <span className="text-lg font-bold font-display">{a.name}</span>
            <span className="text-xs text-foreground/70">🔊 Tap to hear!</span>
          </Tile>
        ))}
      </div>
    </Section>
  );
}

function TracePanel({ alphabet }: { alphabet: typeof ALPHABET_DATA["en"] }) {
  const [letter, setLetter] = useState("A");
  const [isLower, setIsLower] = useState(false);
  const [earned, setEarned] = useState(false);
  const [checked, setChecked] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement|null>(null);
  const drawing = useRef(false);
  const totalPixels = useRef(0);

  const displayLetter = isLower ? letter.toLowerCase() : letter;

  useEffect(() => { clear(); setEarned(false); setChecked(false); totalPixels.current = 0; }, [letter, isLower]);

  function getPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const c = canvasRef.current!; const r = c.getBoundingClientRect();
    return { x:((e.clientX-r.left)/r.width)*600, y:((e.clientY-r.top)/r.height)*600 };
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
    ctx.lineTo(x,y); ctx.lineWidth=22; ctx.lineCap="round"; ctx.strokeStyle="#ff6fa0"; ctx.stroke();
    totalPixels.current++;
  }
  function end() { drawing.current = false; }
  function clear() {
    const c = canvasRef.current; if (!c) return;
    c.getContext("2d")!.clearRect(0,0,c.width,c.height);
    totalPixels.current = 0; setEarned(false); setChecked(false);
  }

  const CHECK_MESSAGES = [
    "Wow, beautiful tracing! ⭐",
    "You're a tracing superstar! 🌟",
    "That looks amazing! Keep it up! 🎉",
    "Fantastic letter! You did it! 🏆",
    "So neat and pretty! Great job! 🌈",
  ];

  function checkTracing() {
    setChecked(true);
    if (totalPixels.current > 20) {
      if (!earned) {
        setEarned(true);
        addStars(1);
      }
      const msg = CHECK_MESSAGES[Math.floor(Math.random() * CHECK_MESSAGES.length)];
      speak(msg);
    } else {
      speak(`Try tracing the letter ${displayLetter} with your finger!`);
    }
  }

  return (
    <Section title="Trace a Letter" subtitle="Use your finger or mouse to trace!">
      <div className="card-soft grid gap-6 p-6 md:grid-cols-[1fr_auto]">
        <div>
          <div className="mb-3 flex justify-center gap-2">
            <button onClick={() => setIsLower(false)} className={`rounded-xl px-5 py-2 font-bold text-lg transition ${!isLower ? "bg-pink text-white shadow-md" : "bg-muted"}`}>ABC</button>
            <button onClick={() => setIsLower(true)} className={`rounded-xl px-5 py-2 font-bold text-lg transition ${isLower ? "bg-sky text-white shadow-md" : "bg-muted"}`}>abc</button>
          </div>
          <div className="relative mx-auto aspect-square w-full max-w-md rounded-2xl bg-butter/40">
            <div className="pointer-events-none absolute inset-0 grid place-items-center font-display text-[18rem] font-bold leading-none text-foreground/15 select-none">{displayLetter}</div>
            <canvas ref={canvasRef} width={600} height={600}
              onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerLeave={end}
              className="absolute inset-0 h-full w-full touch-none rounded-2xl" />
            {earned && checked && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="animate-bounce rounded-full bg-mint/90 px-6 py-3 text-xl font-bold shadow-xl">⭐ Superstar!</div>
              </div>
            )}
          </div>
          <div className="mt-3 flex justify-center gap-3">
            <button onClick={clear} className="rounded-xl bg-muted px-5 py-2 font-bold">↻ Clear</button>
            <button onClick={checkTracing} className="rounded-xl bg-mint px-5 py-2 font-bold">✓ Check!</button>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-muted-foreground">Choose a letter</p>
          <div className="grid max-h-[28rem] w-full grid-cols-6 gap-1.5 overflow-auto md:w-56 md:grid-cols-4">
            {alphabet.map(a => (
              <button key={a.letter} onClick={() => { setLetter(a.letter); speak(isLower ? a.letter.toLowerCase() : a.letter); }}
                className={`rounded-lg py-2 font-display text-lg font-bold transition ${letter===a.letter ? "bg-pink shadow-md scale-105" : "bg-muted hover:bg-accent"}`}>
                {isLower ? a.letter.toLowerCase() : a.letter}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

function MatchGame({ alphabet }: { alphabet: typeof ALPHABET_DATA["en"] }) {
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string|null>(null);
  const [correct, setCorrect] = useState(false);
  const set = useRef(rollSet());
  function rollSet() { const items=[...alphabet].sort(()=>Math.random()-.5).slice(0,4); const answer=items[Math.floor(Math.random()*items.length)]; return {items,answer}; }
  function sayPrompt() { speak(`Can you find the letter ${set.current.answer.letter}? Tap it!`); }
  useEffect(() => { setTimeout(sayPrompt, 500); }, [round]);
  function next() { set.current=rollSet(); setPicked(null); setCorrect(false); setRound(r=>r+1); }
  function pick(letter: string) {
    setPicked(letter);
    const ok = letter===set.current.answer.letter;
    setCorrect(ok);
    if (ok) addStars(1);
    speak(ok ? "Yay! That's right! You're so clever!" : `Keep trying! You're doing great!`);
  }
  return (
    <Section title="Matching Game" subtitle="Tap the letter you hear!">
      <div className="card-soft mx-auto max-w-3xl p-6 text-center">
        <button onClick={sayPrompt} className="mb-6 inline-flex items-center gap-3 rounded-2xl bg-lilac px-6 py-4 font-display text-2xl font-bold shadow-md">🔊 Listen again</button>
        <div key={round} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {set.current.items.map((a,i) => { const isPicked=picked===a.letter; const isAnswer=a.letter===set.current.answer.letter; const state=picked ? isAnswer?"bg-mint":isPicked?"bg-destructive/40":"bg-card opacity-60" : toneClass(TONES[i%TONES.length]); return (<button key={a.letter} onClick={() => !picked&&pick(a.letter)} className={`tile-pop tile-pop-hover card-soft aspect-square ${state}`}><span className="font-display text-6xl font-bold">{a.letter}</span></button>); })}
        </div>
        {picked && <div className="mt-6"><p className="mb-3 text-xl font-bold">{correct ? "🎉 Amazing!" : "💪 Keep going, you're awesome!"}</p><button onClick={next} className="card-soft rounded-xl bg-pink px-6 py-3 font-bold">Next →</button></div>}
      </div>
    </Section>
  );
}

function QuizGame({ alphabet }: { alphabet: typeof ALPHABET_DATA["en"] }) {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string|null>(null);
  const q = useRef(rollQ());
  function rollQ() { const items=[...alphabet].sort(()=>Math.random()-.5).slice(0,4); const answer=items[Math.floor(Math.random()*items.length)]; return {items,answer}; }
  const SWEET = ["So close! You're doing amazing! 🌟","Great try! Keep going superstar! ⭐","You're learning so fast! Try again! 🎉","Wow you're so brave for trying! 💪"];
  function pick(word: string) {
    if (picked) return; setPicked(word);
    const ok=word===q.current.answer.word;
    if (ok) { setScore(s=>s+1); addStars(1); speak("Correct! You're a genius!"); }
    else speak(SWEET[Math.floor(Math.random()*SWEET.length)]);
  }
  function next() { q.current=rollQ(); setPicked(null); setRound(r=>r+1); }
  return (
    <Section title="Letter Quiz" subtitle="Which word starts with this letter?">
      <div className="card-soft mx-auto max-w-3xl p-6 text-center">
        <div className="mb-4 flex items-center justify-between text-sm font-semibold"><span className="rounded-full bg-mint px-3 py-1">Round {round+1}</span><span className="rounded-full bg-butter px-3 py-1">⭐ {score}</span></div>
        <div className="mb-6 grid place-items-center"><div className="grid h-36 w-36 place-items-center rounded-3xl bg-pink shadow-md"><span className="font-display text-8xl font-bold">{q.current.answer.letter}</span></div></div>
        <div key={round} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {q.current.items.map((a,i) => { const isPicked=picked===a.word; const isAnswer=a.word===q.current.answer.word; const state=picked ? isAnswer?"bg-mint":isPicked?"bg-destructive/40":"bg-card opacity-60" : toneClass(TONES[i%TONES.length]); return (<button key={a.word} onClick={() => pick(a.word)} className={`tile-pop tile-pop-hover card-soft flex flex-col items-center gap-1 p-4 ${state}`}><span className="text-4xl">{a.emoji}</span><span className="text-sm font-bold">{a.word}</span></button>); })}
        </div>
        {picked && <button onClick={next} className="card-soft mt-6 rounded-xl bg-sky px-6 py-3 font-bold">Next →</button>}
      </div>
    </Section>
  );
}

function Section({ title, subtitle, children }: { title:string; subtitle?:string; children:React.ReactNode }) {
  return (
    <section className="animate-pop">
      <div className="mb-5 text-center">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}
