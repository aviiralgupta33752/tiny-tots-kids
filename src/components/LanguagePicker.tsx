import { useState } from "react";
import { LANGUAGES, getLang, setLang, type Language } from "@/lib/i18n";

export function LanguagePicker() {
  const [current, setCurrent] = useState<Language>(getLang());
  const [open, setOpen] = useState(false);
  const currentLang = LANGUAGES.find(l => l.code === current)!;

  function pick(lang: Language) {
    setLang(lang);
    setCurrent(lang);
    setOpen(false);
    window.location.reload(); // reload to apply language everywhere
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="card-soft rounded-full px-3 py-2 text-sm font-bold hover:scale-105 transition">
        {currentLang.flag} {currentLang.nativeName}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 card-soft rounded-2xl p-2 shadow-xl z-50 bg-white">
          {LANGUAGES.map(l => (
            <button key={l.code} onClick={() => pick(l.code)}
              className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition hover:bg-muted ${current === l.code ? "bg-mint/40" : ""}`}>
              <span className="text-xl">{l.flag}</span>
              <div className="text-left">
                <div>{l.nativeName}</div>
                <div className="text-xs text-muted-foreground font-normal">{l.name}</div>
              </div>
              {current === l.code && <span className="ml-auto">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
