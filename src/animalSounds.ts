// Real animal sound URLs hosted on GitHub
// After uploading mp3s to public/sounds/ in your repo, these paths will work
export const ANIMAL_SOUNDS: Record<string, string> = {
  "Dog":     "/sounds/dog.mp3",
  "Cat":     "/sounds/cat.mp3",
  "Cow":     "/sounds/cow.mp3",
  "Horse":   "/sounds/horse.mp3",
  "Duck":    "/sounds/duck.mp3",
  "Sheep":   "/sounds/sheep.mp3",
  "Pig":     "/sounds/pig.mp3",
  "Lion":    "/sounds/lion.mp3",
  "Owl":     "/sounds/owl.mp3",
  "Frog":    "/sounds/frog.mp3",
  "Rooster": "/sounds/rooster.mp3",
};

let currentAudio: HTMLAudioElement | null = null;

export function playAnimalSound(name: string): void {
  const url = ANIMAL_SOUNDS[name];
  if (!url) return;
  if (currentAudio) { currentAudio.pause(); currentAudio.currentTime = 0; }
  currentAudio = new Audio(url);
  currentAudio.volume = 1;
  currentAudio.play().catch(() => {
    // fallback to speech if audio fails
    import("@/lib/speak").then(({ speak }) => speak(`${name} says...`));
  });
}
