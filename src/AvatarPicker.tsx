import { useState, useEffect } from "react";

const AVATAR_KEY = "tt_avatar_v1";

export const AVATARS = [
  { id: "cat",     emoji: "🐱", name: "Cat",     colors: ["#ffb3c1","#ffd6a5","#a0c4ff","#b5ead7","#c7b8ea"] },
  { id: "dog",     emoji: "🐶", name: "Dog",     colors: ["#ffd6a5","#ffb3c1","#b5ead7","#ffc6ff","#a0c4ff"] },
  { id: "tiger",   emoji: "🐯", name: "Tiger",   colors: ["#ffb347","#ff6b6b","#ffd166","#06d6a0","#118ab2"] },
  { id: "giraffe", emoji: "🦒", name: "Giraffe", colors: ["#ffd166","#ffc6ff","#a0c4ff","#b5ead7","#ffb3c1"] },
  { id: "bunny",   emoji: "🐰", name: "Bunny",   colors: ["#ffc6ff","#ffb3c1","#b5ead7","#ffd6a5","#a0c4ff"] },
  { id: "panda",   emoji: "🐼", name: "Panda",   colors: ["#a0c4ff","#b5ead7","#ffc6ff","#ffd6a5","#ffb3c1"] },
  { id: "fox",     emoji: "🦊", name: "Fox",     colors: ["#ff6b6b","#ffd166","#ffb347","#06d6a0","#ffc6ff"] },
  { id: "penguin", emoji: "🐧", name: "Penguin", colors: ["#118ab2","#a0c4ff","#b5ead7","#ffd166","#ffc6ff"] },
];

export interface AvatarState {
  id: string;
  emoji: string;
  name: string;
  color: string;
  accessory: string;
}

const ACCESSORIES = ["", "🎩","👑","🎀","🌸","⭐","🌈","🎵","🦋"];

const DEFAULT_AVATAR: AvatarState = {
  id: "cat", emoji: "🐱", name: "Cat",
  color: "#ffb3c1", accessory: "",
};

export function loadAvatar(): AvatarState {
  if (typeof window === "undefined") return DEFAULT_AVATAR;
  try { return JSON.parse(localStorage.getItem(AVATAR_KEY) || "null") ?? DEFAULT_AVATAR; }
  catch { return DEFAULT_AVATAR; }
}

export function saveAvatar(a: AvatarState) {
  if (typeof window !== "undefined") localStorage.setItem(AVATAR_KEY, JSON.stringify(a));
}

export function AvatarDisplay({ avatar, size = "md" }: { avatar: AvatarState; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-12 w-12 text-3xl", md: "h-20 w-20 text-5xl", lg: "h-32 w-32 text-7xl" };
  return (
    <div className={`relative inline-flex items-center justify-center rounded-full shadow-lg ${sizes[size]}`}
      style={{ backgroundColor: avatar.color }}>
      <span>{avatar.emoji}</span>
      {avatar.accessory && (
        <span className="absolute -top-2 -right-1 text-lg">{avatar.accessory}</span>
      )}
    </div>
  );
}

export function AvatarPicker({ onClose }: { onClose: () => void }) {
  const [avatar, setAvatar] = useState<AvatarState>(loadAvatar);

  function pick(a: typeof AVATARS[0]) {
    setAvatar((prev) => ({ ...prev, id: a.id, emoji: a.emoji, name: a.name, color: a.colors[0] }));
  }

  function pickColor(color: string) {
    setAvatar((prev) => ({ ...prev, color }));
  }

  function pickAccessory(acc: string) {
    setAvatar((prev) => ({ ...prev, accessory: acc }));
  }

  function save() {
    saveAvatar(avatar);
    onClose();
  }

  const current = AVATARS.find((a) => a.id === avatar.id) ?? AVATARS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="card-soft w-full max-w-md rounded-3xl p-6 text-center">
        <h2 className="mb-4 font-display text-2xl font-bold">Pick Your Buddy! 🐾</h2>

        {/* Preview */}
        <div className="mb-6 flex justify-center">
          <AvatarDisplay avatar={avatar} size="lg" />
        </div>

        {/* Animal choice */}
        <p className="mb-2 text-sm font-bold text-muted-foreground">Choose your animal</p>
        <div className="mb-4 grid grid-cols-4 gap-2">
          {AVATARS.map((a) => (
            <button key={a.id} onClick={() => pick(a)}
              className={`rounded-2xl p-3 text-3xl transition hover:scale-110 ${avatar.id === a.id ? "ring-4 ring-pink bg-pink/20" : "bg-muted"}`}>
              {a.emoji}
              <div className="text-xs font-bold mt-1">{a.name}</div>
            </button>
          ))}
        </div>

        {/* Color choice */}
        <p className="mb-2 text-sm font-bold text-muted-foreground">Pick a color</p>
        <div className="mb-4 flex justify-center gap-2">
          {current.colors.map((c) => (
            <button key={c} onClick={() => pickColor(c)}
              className={`h-9 w-9 rounded-full border-4 transition hover:scale-110 ${avatar.color === c ? "border-foreground" : "border-transparent"}`}
              style={{ backgroundColor: c }} />
          ))}
        </div>

        {/* Accessory choice */}
        <p className="mb-2 text-sm font-bold text-muted-foreground">Add an accessory</p>
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {ACCESSORIES.map((acc, i) => (
            <button key={i} onClick={() => pickAccessory(acc)}
              className={`rounded-xl px-3 py-2 text-xl transition hover:scale-110 ${avatar.accessory === acc ? "bg-mint ring-2 ring-foreground" : "bg-muted"}`}>
              {acc || "✗"}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 rounded-2xl bg-muted py-3 font-bold">Cancel</button>
          <button onClick={save} className="flex-1 rounded-2xl bg-pink py-3 font-bold">Save! ✨</button>
        </div>
      </div>
    </div>
  );
}
