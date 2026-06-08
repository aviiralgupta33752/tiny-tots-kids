Big feature pack — I'll build it in two waves so you can play with each as it lands.

## Wave 1 (this turn)
1. **Enable Lovable Cloud** (needed for accounts, friends, stars sync) and **connect ElevenLabs** (for the voice you linked).
2. **Better voice everywhere** — replace the browser TTS with a server function that calls ElevenLabs using voice `acCWxmzPBgXdHwA63uzP`. Caches audio per phrase so taps are instant after first play.
3. **Rewards & Stars** — every correct tap / completed activity gives ⭐. A sticker shelf shows unlocked stickers (alphabet mastered, story finished, etc.). Persisted to Cloud once signed in, falls back to localStorage when signed out.
4. **Story Time** — new tab with **6 picture stories** (The Hungry Caterpillar-style originals, all original text). Each story is a flippable book: big colorful illustration per page, sentence below, **word-by-word highlight** synced to ElevenLabs speech, auto page-turn with a flip animation, tap any word to re-hear it. Illustrations are AI-generated and stored as assets.

## Wave 2 (next turn, after you try Wave 1)
5. **Sign up / sign in** (email + Google) and a simple **Friends** screen: send/accept friend requests by username.
6. **Multiplayer Match** — invite a friend, both see the same 4 letters, race to tap the right one first; live score, rematch button. Uses Cloud Realtime.

## Technical notes
- ElevenLabs: server fn `synthesizeSpeech(text)` → MP3 bytes returned as base64; client plays via `data:audio/mpeg;base64,...` and an in-memory cache keyed by text. Connector key auto-synced as `ELEVENLABS_API_KEY`.
- Stars table: `rewards(user_id, stars int, stickers text[])` with RLS, plus localStorage mirror for guests.
- Stories: data in `src/lib/stories.ts` (title, pages: `{ image, sentence, words[] }`). Word timings come from splitting the sentence and timing equally across the audio duration — good enough for kids; can upgrade to ElevenLabs char-level timestamps later.
- Images: 6 stories × ~6 pages = ~36 illustrations generated via imagegen (fast tier, bright pastel kids' book style), uploaded as lovable-assets.

Reply **go** and I'll start Wave 1. (Image generation for 36 pages takes a couple of minutes.)