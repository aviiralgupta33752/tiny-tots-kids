import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Lily — built-in free voice (warm, friendly, kid-appropriate).
// The originally requested library voice acCWxmzPBgXdHwA63uzP requires a paid ElevenLabs plan.
const VOICE_ID = "pFZP5JQG7iQjIQuC4Bku";

export const tts = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ text: z.string().min(1).max(2000) }).parse(d),
  )
  .handler(async ({ data }) => {
    const key = process.env.ELEVENLABS_API_KEY;
    if (!key) throw new Error("ELEVENLABS_API_KEY not set");
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: { "xi-api-key": key, "Content-Type": "application/json" },
        body: JSON.stringify({
          text: data.text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.8,
            style: 0.35,
            use_speaker_boost: true,
            speed: 0.95,
          },
        }),
      },
    );
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`TTS failed (${res.status}): ${err.slice(0, 200)}`);
    }
    const buf = await res.arrayBuffer();
    return { audio: Buffer.from(buf).toString("base64") };
  });
