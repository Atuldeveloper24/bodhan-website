# Speech example audio

Drop the audio files here. `.wav` is tried first, `.mp3` second — either works,
so you can ship whichever you have (mp3 is much smaller for the web).

| File | Example |
|---|---|
| `bhojpuri-bank-details.wav` (or `.mp3`) | Bhojpuri · bank account details, spoken digits |
| `sanskrit-shlok.wav` | Sanskrit · shloka recitation |
| `tamil-thirukkural.wav` | Tamil · Thirukkural verse |
| `santali-parcel.wav` | Santali · spontaneous conversation (Ol Chiki) |

The transcripts for all three modes (native / mixed / romanized) are already in
`src/features/developers/data/transcribeExamples.js`. Filenames come from the
`audio` field there (given without extension).

Files load at runtime, so a missing file shows an inline note naming the expected
path rather than breaking the build. For the web, mp3 at 64–96 kbps mono is
plenty for speech and keeps each clip well under 1 MB.
