import { useState } from "react";
import { speak } from "@/lib/speak";
import type { ChildProfile } from "@/hooks/useAuth";

const PROFILE_LIST_KEY = "tt_profiles_v1";
const ACTIVE_PROFILE_KEY = "tt_active_profile_v1";

export function getProfiles(): ChildProfile[] {
  try { return JSON.parse(localStorage.getItem(PROFILE_LIST_KEY) || "[]"); }
  catch { return []; }
}

export function saveProfiles(profiles: ChildProfile[]) {
  localStorage.setItem(PROFILE_LIST_KEY, JSON.stringify(profiles));
}

export function getActiveProfile(): ChildProfile | null {
  try { return JSON.parse(localStorage.getItem(ACTIVE_PROFILE_KEY) || "null"); }
  catch { return null; }
}

export function setActiveProfile(profile: ChildProfile) {
  localStorage.setItem(ACTIVE_PROFILE_KEY, JSON.stringify(profile));
}

const AGE_EMOJIS: Record<number, string> = { 3:"🐣", 4:"🌱", 5:"⭐", 6:"📚", 7:"🏆" };

export function ProfileSwitcher({ currentProfile, onSwitch, onAddNew }: {
  currentProfile: ChildProfile;
  onSwitch: (p: ChildProfile) => void;
  onAddNew: () => void;
}) {
  const [open, setOpen] = useState(false);
  const profiles = getProfiles();

  function switchTo(p: ChildProfile) {
    setActiveProfile(p);
    onSwitch(p);
    setOpen(false);
    speak(`Switching to ${p.name}'s profile!`);
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="card-soft rounded-full px-3 py-2 text-xs font-bold hover:scale-105 transition bg-lilac/50">
        👥 {currentProfile.name}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 card-soft rounded-2xl p-3 shadow-xl z-50 bg-white">
          <p className="text-xs font-bold text-muted-foreground mb-2">Switch Profile</p>
          {profiles.map((p, i) => (
            <button key={i} onClick={() => switchTo(p)}
              className={`w-full flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold transition hover:bg-muted ${p.name === currentProfile.name ? "bg-mint/40" : ""}`}>
              <span>{AGE_EMOJIS[p.age] ?? "🌟"}</span>
              <span>{p.name}</span>
              <span className="ml-auto text-muted-foreground text-xs">Age {p.age}</span>
            </button>
          ))}
          <button onClick={() => { setOpen(false); onAddNew(); }}
            className="w-full mt-2 rounded-xl bg-pink/20 px-3 py-2 text-sm font-bold text-pink hover:bg-pink/30 transition">
            + Add Child
          </button>
        </div>
      )}
    </div>
  );
}
