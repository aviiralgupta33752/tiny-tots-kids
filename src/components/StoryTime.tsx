import { useEffect, useRef, useState } from "react";
import { STORIES, type Story } from "@/lib/stories";
import { speakText, stopSpeaking } from "@/lib/speak";
import { addStars } from "@/lib/rewards";

export function StoryTime() {
  const [story, setStory] = useState<Story | null>(null);

  if (story) return <BookReader story={story} onExit={() => setStory(null)} />;

  return (
    <section className="animate-pop">
      <div className="mb-5 text-center">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">Story Time 📖</h2>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          Pick a picture book. Words light up as they are read!
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {STORIES.map((s) => (
          <button
            key={s.id}
            onClick={() => setStory(s)}
            className={`tile-pop tile-pop-hover card-soft bg-gradient-to-br ${s.cover} flex aspect-[4/5] flex-col items-center justify-center gap-3 p-6 text-foreground`}
          >
            <span className="text-7xl drop-shadow">{s.emoji}</span>
            <span className="text-center font-display text-xl font-bold leading-tight">
              {s.title}
            </span>
            <span className="rounded-full bg-white/60 px-3 py-1 text-xs font-semibold">
              {s.pages.length} pages
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function BookReader({ story, onExit }: { story: Story; onExit: () => void }) {
  const [pageIdx, setPageIdx] = useState(0);
  const [wordIdx, setWordIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [turning, setTurning] = useState(false);
  const rewardedRef = useRef(false);
  const page = story.pages[pageIdx];
  const words = page.text.split(/\s+/).filter(Boolean);

  async function readPage(idx = pageIdx) {
    const p = story.pages[idx];
    if (!p) return;
    setPlaying(true);
    setWordIdx(-1);
    try {
      await speakText(p.text, (i) => setWordIdx(i));
      setWordIdx(p.text.split(/\s+/).filter(Boolean).length - 1);
    } finally {
      setPlaying(false);
    }
    if (idx < story.pages.length - 1) {
      setTimeout(() => turnTo(idx + 1, true), 900);
    } else if (!rewardedRef.current) {
      rewardedRef.current = true;
      addStars(3);
    }
  }

  function turnTo(idx: number, autoRead = false) {
    if (idx < 0 || idx >= story.pages.length) return;
    stopSpeaking();
    setTurning(true);
    setWordIdx(-1);
    setTimeout(() => {
      setPageIdx(idx);
      setTurning(false);
      if (autoRead) setTimeout(() => readPage(idx), 250);
    }, 350);
  }

  useEffect(() => {
    // auto-start narration when reader opens
    const t = setTimeout(() => readPage(0), 400);
    return () => {
      clearTimeout(t);
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="animate-pop">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={onExit} className="card-soft rounded-xl bg-card px-4 py-2 font-semibold">
          ← Library
        </button>
        <h2 className="font-display text-xl font-bold sm:text-2xl">{story.title}</h2>
        <span className="card-soft rounded-full bg-butter px-3 py-1 text-sm font-bold">
          {pageIdx + 1}/{story.pages.length}
        </span>
      </div>

      <div className="perspective relative mx-auto max-w-3xl">
        <div
          className={`card-soft overflow-hidden rounded-3xl bg-gradient-to-br ${page.bg} transition-transform duration-300 ${
            turning ? "rotate-y-90 opacity-0" : "rotate-y-0 opacity-100"
          }`}
          style={{ transformStyle: "preserve-3d" }}
        >
          <div className="aspect-[4/3] w-full bg-white/30">
            {page.scene}
          </div>
          <div className="bg-white/80 p-5 sm:p-7">
            <p className="font-display text-2xl leading-snug sm:text-3xl">
              {words.map((w, i) => (
                <span
                  key={i}
                  className={`mr-1.5 inline-block rounded-md px-1 transition-all ${
                    i === wordIdx
                      ? "bg-pink scale-110 shadow-md"
                      : i < wordIdx
                        ? "text-foreground/60"
                        : ""
                  }`}
                >
                  {w}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-5 flex max-w-3xl items-center justify-between gap-3">
        <button
          onClick={() => turnTo(pageIdx - 1)}
          disabled={pageIdx === 0}
          className="card-soft rounded-xl bg-sky px-5 py-3 font-bold disabled:opacity-40"
        >
          ← Back
        </button>
        <button
          onClick={() => readPage()}
          disabled={playing}
          className="card-soft rounded-xl bg-pink px-6 py-3 font-bold disabled:opacity-60"
        >
          {playing ? "🔊 Reading…" : "🔊 Read again"}
        </button>
        <button
          onClick={() => turnTo(pageIdx + 1)}
          disabled={pageIdx === story.pages.length - 1}
          className="card-soft rounded-xl bg-mint px-5 py-3 font-bold disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </section>
  );
}
