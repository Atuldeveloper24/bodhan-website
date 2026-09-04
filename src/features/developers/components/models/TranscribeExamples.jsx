import { useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Pause, Play } from 'lucide-react';
import { AUDIO_EXAMPLES, MODE_LABELS } from '../../data/transcribeExamples';
import { assetUrl } from '../../data/assetUrl';
import { CONSOLE_URL } from '../../../../config/links';

const BARS = Array.from({ length: 64 }, (_, i) => 20 + ((i * 37) % 64));

// A transcript trails the speech: nothing for the first moment, then words
// landing well behind what was said. EASE > 1 holds the early words back so
// the line builds slowly instead of dumping; it still finishes with the audio.
const LAG = 0.14;
const EASE = 2.2;

const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, '0')}`;
};

const TranscribeExamples = () => {
    const audioRef = useRef(null);
    const [activeId, setActiveId] = useState(AUDIO_EXAMPLES[0].id);
    const [mode, setMode] = useState('native');
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [elapsed, setElapsed] = useState(0);
    const [duration, setDuration] = useState(0);

    // The panel starts blank: the transcript is written as the audio runs, so
    // there is nothing to show until someone presses play.
    const [started, setStarted] = useState(false);

    const example = AUDIO_EXAMPLES.find((e) => e.id === activeId) ?? AUDIO_EXAMPLES[0];
    const words = useMemo(() => example.modes[mode].split(' '), [example, mode]);

    const ratio = Math.min(1, Math.max(0, (progress - LAG) / (1 - LAG)));
    const heard = started ? Math.round(ratio ** EASE * words.length) : 0;
    const done = started && heard >= words.length;

    const select = (id) => {
        audioRef.current?.pause();
        setActiveId(id);
        setPlaying(false);
        setProgress(0);
        setElapsed(0);
        setDuration(0);
        setStarted(false);
    };

    const toggle = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) audio.play().catch(() => {});
        else audio.pause();
    };

    const onTimeUpdate = () => {
        const audio = audioRef.current;
        if (!audio || !Number.isFinite(audio.duration) || audio.duration === 0) return;
        setElapsed(audio.currentTime);
        setProgress(audio.currentTime / audio.duration);
    };

    const seek = (event) => {
        const audio = audioRef.current;
        if (!audio || !Number.isFinite(audio.duration)) return;
        const rect = event.currentTarget.getBoundingClientRect();
        const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
        audio.currentTime = ratio * audio.duration;
        setProgress(ratio);
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
                                            className={i / BARS.length <= progress ? 'is-played' : undefined}
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
                                onEnded={() => setPlaying(false)}
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
                            key={`${example.id}-${mode}`}
                            className={`transcribe-caption audio-transcript${done ? '' : ' is-live'}`}
                            lang={mode === 'romanized' ? 'en' : example.lang}
                            aria-live="off"
                        >
                            {words.map((word, i) => (
                                <span
                                    key={i}
                                    className={`tx-word${i < heard ? ' is-heard' : ''}${i === heard ? ' is-cursor' : ''}`}
                                >
                                    {word}{' '}
                                </span>
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
                                className="model-cta-primary model-cta-small"
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
