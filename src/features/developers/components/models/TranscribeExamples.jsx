import { useRef, useState } from 'react';
import { AudioLines, Pause, Play } from 'lucide-react';
import { AUDIO_EXAMPLES, MODE_LABELS } from '../../data/transcribeExamples';

const BARS = Array.from({ length: 56 }, (_, i) => 20 + ((i * 37) % 64));

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
    const [missing, setMissing] = useState(false);

    const example = AUDIO_EXAMPLES.find((e) => e.id === activeId) ?? AUDIO_EXAMPLES[0];

    const select = (id) => {
        audioRef.current?.pause();
        setActiveId(id);
        setPlaying(false);
        setProgress(0);
        setElapsed(0);
        setDuration(0);
        setMissing(false);
    };

    const toggle = () => {
        const audio = audioRef.current;
        if (!audio) return;
        if (audio.paused) {
            audio.play().catch(() => setMissing(true));
        } else {
            audio.pause();
        }
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
        <div className="model-panel">
            <div className="dp-sample-tabs" role="tablist" aria-label="Audio sample">
                {AUDIO_EXAMPLES.map((e) => (
                    <button
                        key={e.id}
                        type="button"
                        role="tab"
                        aria-selected={activeId === e.id}
                        className={activeId === e.id ? 'is-active' : undefined}
                        onClick={() => select(e.id)}
                    >
                        {e.label}
                    </button>
                ))}
                <span className="dp-sample-meta">{example.tag}</span>
            </div>

            <div className="audio-player">
                <button
                    type="button"
                    className={`audio-play${playing ? ' is-playing' : ''}`}
                    onClick={toggle}
                    aria-label={playing ? `Pause ${example.label} sample` : `Play ${example.label} sample`}
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

                {/* key forces a fresh element (and fresh <source> resolution) per sample */}
                <audio
                    key={example.id}
                    ref={audioRef}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onEnded={() => setPlaying(false)}
                    onTimeUpdate={onTimeUpdate}
                    onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
                    onError={() => setMissing(true)}
                    preload="metadata"
                >
                    <source src={`${example.audio}.wav`} type="audio/wav" />
                    <source src={`${example.audio}.mp3`} type="audio/mpeg" />
                </audio>
            </div>

            {missing && (
                <p className="audio-missing" role="status">
                    <AudioLines size={14} aria-hidden="true" />
                    Add the audio at <code>public{example.audio}.wav</code> (or <code>.mp3</code>)
                </p>
            )}

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
                className="transcribe-caption audio-transcript"
                lang={mode === 'romanized' ? 'en' : example.lang}
            >
                {example.modes[mode]}
            </p>
        </div>
    );
};

export default TranscribeExamples;
