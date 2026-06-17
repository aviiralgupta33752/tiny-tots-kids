import { useEffect, useState } from "react";

const BEDTIME_KEY = "tt_bedtime_mode_v1";

export function isBedtimeHours(): boolean {
  const hour = new Date().getHours();
  return hour >= 19 || hour < 6; // 7pm to 6am
}

export function getBedtimePref(): "auto" | "on" | "off" {
  return (localStorage.getItem(BEDTIME_KEY) as "auto"|"on"|"off") || "auto";
}

export function setBedtimePref(pref: "auto" | "on" | "off") {
  localStorage.setItem(BEDTIME_KEY, pref);
}

export function useBedtimeMode(): [boolean, "auto"|"on"|"off", (p: "auto"|"on"|"off") => void] {
  const [pref, setPref] = useState<"auto"|"on"|"off">(getBedtimePref());
  const [active, setActive] = useState(false);

  useEffect(() => {
    function update() {
      if (pref === "on") setActive(true);
      else if (pref === "off") setActive(false);
      else setActive(isBedtimeHours());
    }
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, [pref]);

  function changePref(p: "auto"|"on"|"off") {
    setBedtimePref(p);
    setPref(p);
  }

  return [active, pref, changePref];
}

export function BedtimeToggle({ pref, onChange }: { pref: "auto"|"on"|"off"; onChange: (p:"auto"|"on"|"off") => void }) {
  const [open, setOpen] = useState(false);
  const icons = { auto: "🌗", on: "🌙", off: "☀️" };
  const labels = { auto: "Auto", on: "Bedtime", off: "Daytime" };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="card-soft rounded-full px-3 py-2 text-sm font-bold hover:scale-105 transition">
        {icons[pref]} {labels[pref]}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 card-soft rounded-2xl p-2 shadow-xl z-50 bg-white">
          {(["auto","on","off"] as const).map(p => (
            <button key={p} onClick={() => { onChange(p); setOpen(false); }}
              className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition hover:bg-muted ${pref === p ? "bg-mint/40" : ""}`}>
              <span>{icons[p]}</span>
              <span>{labels[p]}</span>
              {pref === p && <span className="ml-auto">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function BedtimeOverlay() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" style={{
      background: "linear-gradient(180deg, rgba(20,20,60,0.08), rgba(40,30,80,0.12))",
    }}>
      <div className="absolute top-10 right-10 text-4xl opacity-40 animate-pulse">🌙</div>
      <div className="absolute top-20 left-20 text-2xl opacity-30">⭐</div>
      <div className="absolute top-32 right-40 text-xl opacity-25">✨</div>
      <div className="absolute top-16 left-1/2 text-lg opacity-20">⭐</div>
    </div>
  );
}
