declare module "mespeak" {
  type SpeakOptions = {
    amplitude?: number;
    pitch?: number;
    speed?: number;
    wordgap?: number;
    volume?: number;
    rawdata?: boolean | "buffer" | "base64" | "mime" | "array";
    variant?: string;
  };

  const meSpeak: {
    speak(text: string, options?: SpeakOptions): string | ArrayBuffer | number[] | undefined;
    loadConfig(config: object): void;
    loadVoice(voice: object): void;
    resetQueue(): void;
    stop(): void;
    canPlay(): boolean;
  };

  export = meSpeak;
}

declare module "mespeak/src/mespeak_config.json" {
  const value: object;
  export default value;
}

declare module "mespeak/voices/en/en-us.json" {
  const value: object;
  export default value;
}