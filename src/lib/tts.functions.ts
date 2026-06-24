import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Lily — built-in free voice (warm, friendly, kid-appropriate).
// The originally requested library voice acCWxmzPBgXdHwA63uzP requires a paid ElevenLabs plan.
const VOICE_ID = "pFZP5JQG7iQjIQuC4Bku";

export const tts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ text: z.string().min(1).max(2000) }).parse(d),
  )
  .handler(async ({ data }) => {
    const key = process.env.ELEVENLABS_API_KEY;
    if (!key) return { audio: null, fallback: "missing_key" as const };

    try {
      const res = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_128`,
        {
          method: "POST",
          headers: { "xi-api-key": key, "Content-Type": "application/json" },
          body: JSON.stringify({
            text: data.text,
            model_id: "eleven_turbo_v2_5",
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
        console.warn(`TTS unavailable (${res.status}): ${err.slice(0, 200)}`);
        return {
          audio: null,
          fallback: res.status === 401 || res.status === 402 ? ("quota_or_billing" as const) : ("provider_error" as const),
        };
      }
      const buf = await res.arrayBuffer();
      return { audio: Buffer.from(buf).toString("base64"), fallback: null };
    } catch (error) {
      console.warn("TTS unavailable:", error);
      return { audio: null, fallback: "network_error" as const };
    }
  });
