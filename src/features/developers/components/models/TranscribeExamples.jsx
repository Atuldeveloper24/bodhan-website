import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import { AUDIO_EXAMPLES, MODE_LABELS } from '../../data/transcribeExamples';
import { assetUrl } from '../../data/assetUrl';
import { CONSOLE_URL } from '../../../../config/links';

const BARS = Array.from({ length: 64 }, (_, i) => 20 + ((i * 37) % 64));

// The transcript follows the audio rather than racing it. Nothing is written
// for the first TRAIL of the clip — the model is listening — and the last words
// land TAIL after the audio has already stopped, so the writing is still
// catching up when the room goes quiet. Both are fractions of the clip's own
// length, so a nine-second sample and a five-minute one read at the same
// relative pace.
//
// Between them they set the pace: the words are spread over WINDOW of the
// clip's length rather than crammed into it. These are the two numbers to turn
// if the transcript wants to be slower or later still.
//
// The head itself moves linearly. There is no per-word timing in the data, and
// anything fancier drifts away from the audio rather than towards it — it used
// to advance as ratio ** 2.2, which meant a fifth of the words had appeared by
// the halfway mark and the rest arrived in a rush at the end.
const TRAIL = 0.18;
const TAIL = 0.3;
const WINDOW = 1 + TAIL - TRAIL;

const clamp01 = (n) => Math.min(1, Math.max(0, n));

const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
};

const TranscribeExamples = () => {
    const audioRef = useRef(null);
    const captionRef = useRef(null);
    const frameRef = useRef(0);

    const [activeId, setActiveId] = useState(AUDIO_EXAMPLES[0].id);
    const [mode, setMode] = useState('native');
    const [playing, setPlaying] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const [duration, setDuration] = useState(0);

    // Which bar the meter has reached, and which word the caret sits on. Both
    // are whole numbers, so following the audio only re-renders when one of
    // them actually changes — roughly once per bar rather than once per frame.
    const [bar, setBar] = useState(0);
    const [head, setHead] = useState(0);

    // The audio is over but the transcript is still landing its last words.
    const [tailing, setTailing] = useState(false);

    // The panel starts blank: the transcript is written as the audio runs, so
    // there is nothing to show until someone presses play.
    const [started, setStarted] = useState(false);

    const example = AUDIO_EXAMPLES.find((e) => e.id === activeId) ?? AUDIO_EXAMPLES[0];
    const words = useMemo(() => example.modes[mode].split(' '), [example, mode]);

    const done = started && head >= words.length;

    // The read head is a fraction of a word, written straight to the DOM as a
    // custom property: CSS fades each word in as the head crosses it, which is
    // what makes the line arrive smoothly instead of a word at a time on the
    // four-or-so timeupdate events a second the browser sends.
    // `played` runs 0 → 1 while the audio plays and on to 1 + TAIL while the
    // transcript catches up after it has finished.
    const writeHead = useCallback(
        (played, count) => {
            const at = clamp01((played - TRAIL) / WINDOW) * count;
            captionRef.current?.style.setProperty('--read', String(at));
            setHead(Math.min(count, Math.floor(at)));
        },
        [],
    );

    // Follow the audio every frame while it plays.
    useEffect(() => {
        if (!playing) return undefined;

        const step = () => {
            const audio = audioRef.current;
            if (audio && Number.isFinite(audio.duration) && audio.duration > 0) {
                const played = clamp01(audio.currentTime / audio.duration);
                setBar(Math.round(played * BARS.length));
                writeHead(played, words.length);
            }
            frameRef.current = requestAnimationFrame(step);
        };

        frameRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frameRef.current);
    }, [playing, words.length, writeHead]);

    // The audio has stopped but the transcript has not caught up yet: keep the
    // head moving on the wall clock until it reaches the last word.
    useEffect(() => {
        if (!tailing) return undefined;

        const duration = audioRef.current?.duration;
        const spanMs = Number.isFinite(duration) && duration > 0 ? TAIL * duration * 1000 : 0;

        const startedAt = performance.now();
        let frame = 0;
        const step = () => {
            // with no duration to pace against, land the last words at once
            const through = spanMs > 0 ? Math.min(1, (performance.now() - startedAt) / spanMs) : 1;
            writeHead(1 + through * TAIL, words.length);
            if (through >= 1) {
                setTailing(false);
                return;
            }
            frame = requestAnimationFrame(step);
        };

        frame = requestAnimationFrame(step);
        return () => cancelAnimationFrame(frame);
    }, [tailing, words.length, writeHead]);

    const reset = useCallback(() => {
        setPlaying(false);
        setTailing(false);
        setElapsed(0);
        setBar(0);
        setHead(0);
        setStarted(false);
        captionRef.current?.style.setProperty('--read', '0');
    }, []);

    const select = (id) => {
        audioRef.current?.pause();
        setActiveId(id);
        setDuration(0);
        reset();
    };

    const toggle = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) {
            setTailing(false);
            audio.play().catch(() => {});
        } else {
            audio.pause();
        }
    };

    // The clock only needs to tick; the meter and the transcript are driven by
    // the frame loop above.
    const onTimeUpdate = () => {
        const audio = audioRef.current;
        if (audio) setElapsed(audio.currentTime);
    };

    const seek = (event) => {
        const audio = audioRef.current;
        if (!audio || !Number.isFinite(audio.duration)) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const at = clamp01((event.clientX - rect.left) / rect.width);
        audio.currentTime = at * audio.duration;
        setElapsed(audio.currentTime);
        setBar(Math.round(at * BARS.length));
        setStarted(true);
        setTailing(false);
        writeHead(at, words.length);
    };

    return (
        <div className="pg-breakout">
            <div className="pg-shell">
                <div className="pg-glow" aria-hidden="true" />

                <div className="pg-card">
                    <div className="pg-main">
                        <div className="tp-bar">
                            <p className="tx-now">
                                <b>{example.kind}</b>
                            </p>
                            <p className="tp-direction">
                                Detected: <b>{example.label}</b>
                            </p>
                        </div>

                        <div className="audio-player">
                            <button
                                type="button"
                                className={`audio-play${playing ? ' is-playing' : ''}`}
                                onClick={toggle}
                                aria-label={playing ? `Pause ${example.kind} sample` : `Play ${example.kind} sample`}
                            >
                                {playing ? <Pause size={18} aria-hidden="true" /> : <Play size={18} aria-hidden="true" />}
                            </button>

                            <div className="audio-track" onClick={seek} role="presentation">
                                <div className={`audio-wave${playing ? ' is-playing' : ''}`} aria-hidden="true">
                                    {BARS.map((h, i) => (
                                        <span
                                            key={i}
                                            className={i <= bar ? 'is-played' : undefined}
                                            style={{ height: `${h}%`, animationDelay: `${(i % 9) * 60}ms` }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <p className="audio-time">
                                {formatTime(elapsed)} / {formatTime(duration)}
                            </p>

                            {/* key forces a fresh element per sample */}
                            <audio
                                key={example.id}
                                src={assetUrl(example.audio)}
                                ref={audioRef}
                                onPlay={() => {
                                    setPlaying(true);
                                    setStarted(true);
                                }}
                                onPause={() => setPlaying(false)}
                                onEnded={() => {
                                    setPlaying(false);
                                    setBar(BARS.length);
                                    // the transcript is still a few words behind — let it
                                    // finish writing rather than snapping it to the end
                                    setTailing(true);
                                }}
                                onTimeUpdate={onTimeUpdate}
                                onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
                                preload="metadata"
                            />
                        </div>

                        <div className="dp-view-tabs transcribe-mode-tabs" role="tablist" aria-label="Transcription mode">
                            {MODE_LABELS.map((m) => (
                                <button
                                    key={m.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={mode === m.id}
                                    className={mode === m.id ? 'is-active' : undefined}
                                    onClick={() => setMode(m.id)}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>

                        <p
                            ref={captionRef}
                            key={`${example.id}-${mode}`}
                            className={`transcribe-caption audio-transcript${done ? '' : ' is-live'}`}
                            lang={mode === 'romanized' ? 'en' : example.lang}
                            aria-live="off"
                        >
                            {/* The caret marks where the transcript is being written, so it
                                follows the word arriving now rather than sitting in front of
                                it. It is its own element, not a pseudo on the word, because
                                the word is mid-fade — a pseudo would inherit that opacity and
                                the caret would dim and brighten with every word. */}
                            {words.map((word, i) => (
                                <Fragment key={i}>
                                    <span className="tx-word" style={{ '--i': i }}>
                                        {word}
                                    </span>
                                    {i === head && <span className="tx-caret" aria-hidden="true" />}{' '}
                                </Fragment>
                            ))}

                            {!started && (
                                <span className="tx-prompt">Press play — the transcript is written as it listens.</span>
                            )}
                        </p>
                    </div>

                    <aside className="pg-rail">

                        <div className="pg-rail-list tx-list">
                            {AUDIO_EXAMPLES.map((e) => (
                                <button
                                    key={e.id}
                                    type="button"
                                    className={`pg-example${activeId === e.id ? ' is-active' : ''}`}
                                    aria-pressed={activeId === e.id}
                                    onClick={() => select(e.id)}
                                >
                                    <span className="tx-badge" aria-hidden="true">
                                        {e.label.slice(0, 2)}
                                    </span>
                                    <span className="pg-example-copy">
                                        <span className="pg-example-name">{e.kind}</span>
                                        <span className="pg-example-lang">{e.label}</span>
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="pg-rail-foot">
                            <p>Want to run this model?</p>
                            <a
                                href={CONSOLE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="model-cta-primary model-cta-small model-cta-dark"
                            >
                                Go to Dashboard
                                <ArrowUpRight size={13} aria-hidden="true" />
                            </a>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default TranscribeExamples;
