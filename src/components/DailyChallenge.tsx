import { useState, useEffect } from "react";
import { speak } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

interface Challenge {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  reward: number;
  tab: string;
}

const CHALLENGES: Challenge[] = [
  { id:"spell3",    emoji:"✍️", title:"Spell 3 Words",        desc:"Go to Spell It and spell 3 words correctly!",     reward:5,  tab:"spell" },
  { id:"count5",    emoji:"🔢", title:"Count 5 Times",         desc:"Go to Counting and get 5 answers right!",         reward:5,  tab:"count" },
  { id:"math3",     emoji:"➕", title:"Solve 3 Math Problems", desc:"Go to Math and solve 3 problems!",                reward:6,  tab:"math"  },
  { id:"rhyme3",    emoji:"🎵", title:"Find 3 Rhymes",         desc:"Go to Rhyme Time and find 3 rhyming words!",      reward:5,  tab:"rhyme" },
  { id:"trace5",    emoji:"✏️", title:"Trace 5 Letters",       desc:"Go to Trace and trace 5 letters!",                reward:5,  tab:"trace" },
  { id:"animals",   emoji:"🐾", title:"Meet 5 Animals",        desc:"Go to Animals and tap 5 different animals!",      reward:4,  tab:"animals"},
  { id:"story",     emoji:"📖", title:"Read a Story",          desc:"Go to Stories and read one story!",               reward:8,  tab:"story" },
  { id:"memory",    emoji:"🧩", title:"Play Memory Game",      desc:"Go to Memory and find all the pairs!",            reward:7,  tab:"memory"},
  { id:"phonics3",  emoji:"🔤", title:"Learn 3 Sounds",        desc:"Go to Phonics and get 3 letter sounds right!",    reward:5,  tab:"phonics"},
  { id:"sight5",    emoji:"👁️", title:"Read 5 Sight Words",    desc:"Go to Sight Words and read 5 words!",             reward:6,  tab:"sight" },
];

function getToday() { return new Date().toDateString(); }

function getTodayChallenge(): Challenge {
  const dayNum = Math.floor(Date.now() / 86400000);
  return CHALLENGES[dayNum % CHALLENGES.length];
}

export function DailyChallenge({ onGoToTab }: { onGoToTab: (tab: string) => void }) {
  const challenge = getTodayChallenge();
  const doneKey = `tt_daily_${getToday()}`;
  const [done, setDone] = useState(() => localStorage.getItem(doneKey) === "1");
  const [claimed, setClaimed] = useState(false);

  function claim() {
    localStorage.setItem(doneKey, "1");
    addStars(challenge.reward);
    setDone(true);
    setClaimed(true);
    speak(`Amazing! You completed today's challenge and earned ${challenge.reward} bonus stars!`);
  }

  return (
    <div className={`rounded-3xl p-4 mb-4 ${done ? "bg-mint/40" : "bg-butter/40"}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{challenge.emoji}</div>
          <div>
            <div className="font-bold text-sm flex items-center gap-2">
              {done ? "✅" : "⚡"} Today's Challenge
              <span className="rounded-full bg-pink/20 px-2 py-0.5 text-xs font-bold text-pink">+{challenge.reward}⭐</span>
            </div>
            <div className="font-display text-base font-bold">{challenge.title}</div>
            <div className="text-xs text-muted-foreground">{challenge.desc}</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          {!done ? (
            <>
              <button onClick={() => onGoToTab(challenge.tab)}
                className="rounded-xl bg-pink px-3 py-2 text-xs font-bold text-white">
                Go! →
              </button>
              <button onClick={claim}
                className="rounded-xl bg-mint px-3 py-2 text-xs font-bold">
                Done! ✓
              </button>
            </>
          ) : (
            <div className="text-2xl text-center">{claimed ? "🎉" : "✅"}</div>
          )}
        </div>
      </div>
    </div>
  );
}
