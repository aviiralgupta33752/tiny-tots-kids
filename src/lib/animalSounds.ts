export const ANIMAL_SOUNDS: Record<string, string> = {
  "Dog":     "/dog.mp3",
  "Cat":     "/cat.mp3",
  "Cow":     "/cow.mp3",
  "Horse":   "/horse.mp3",
  "Duck":    "/duck.mp3",
  "Sheep":   "/sheep.mp3",
  "Pig":     "/pig.mp3",
  "Lion":    "/lion.mp3",
  "Owl":     "/owl.mp3",
  "Frog":    "/frog.mp3",
  "Rooster": "/rooster.mp3",
};
 
let currentAudio: HTMLAudioElement | null = null;
 
export function playAnimalSound(name: string): void {
  const url = ANIMAL_SOUNDS[name];
  if (!url) return;
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
  const audio = new Audio(url);
  audio.volume = 1;
  currentAudio = audio;
  audio.play().catch(() => {
    import("@/lib/speak").then(({ speak }) => speak(name));
  });
}
 
