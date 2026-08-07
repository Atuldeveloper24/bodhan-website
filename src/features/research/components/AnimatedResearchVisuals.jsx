import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { RotateCcw, Volume2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const waveform = [10, 18, 29, 15, 38, 23, 44, 31, 17, 35, 48, 24, 40, 19, 30, 12];

const transcriptModes = [
    { label: 'Native', text: 'कल मीटिंग है एट 5 पीएम' },
    { label: 'Code mixed', text: 'कल meeting hai at 5 PM' },
    { label: 'Romanized', text: 'Kal meeting hai at 5 PM' },
];

const splitGraphemes = (text) => {
    if (typeof Intl !== 'undefined' && Intl.Segmenter) {
        return Array.from(
            new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(text),
            ({ segment }) => segment
        );
    }

    return Array.from(text);
};

const SplitCharacters = ({ text }) => (
    <span className="research-transcript-copy" aria-label={text}>
        {text.split(' ').map((word, index) => (
            <span className="research-transcript-word-wrap" aria-hidden="true" key={`${word}-${index}`}>
                {splitGraphemes(word).map((character, characterIndex) => (
                    <span
                        className="research-transcript-char"
                        key={`${character}-${characterIndex}`}
                    >
                        {character}
                    </span>
                ))}
            </span>
        ))}
    </span>
);

export const OutputModesAnimation = () => {
    const rootRef = useRef(null);
    const timelineRef = useRef(null);
    const waveTweenRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasPlayed, setHasPlayed] = useState(false);

    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return undefined;

        const context = gsap.context(() => {
            gsap.set('.research-transcript-char', {
                y: 9,
                opacity: 0,
                filter: 'blur(4px)',
            });
            gsap.set('.research-output-ready', { scale: 0.85, opacity: 0 });
            gsap.set('.research-wave-playhead', { x: 0, opacity: 0 });
            gsap.set('.research-wave-bar', {
                scaleY: 0.18,
                opacity: 0.4,
            });
        }, root);

        return () => {
            timelineRef.current?.kill();
            waveTweenRef.current?.kill();
            window.speechSynthesis?.cancel();
            context.revert();
        };
    }, []);

    const speakSample = () => {
        if (!('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance('कल meeting hai at 5 PM');
        const voices = window.speechSynthesis.getVoices();
        const indianVoice = voices.find((voice) => voice.lang === 'hi-IN')
            ?? voices.find((voice) => voice.lang === 'en-IN');

        if (indianVoice) utterance.voice = indianVoice;
        utterance.lang = indianVoice?.lang ?? 'hi-IN';
        utterance.rate = 0.82;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
    };

    const playTranscription = () => {
        const root = rootRef.current;
        if (!root || isPlaying) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const waveShell = root.querySelector('.research-wave-shell');
        const lanes = Array.from(root.querySelectorAll('.research-output-lane'));

        timelineRef.current?.kill();
        waveTweenRef.current?.kill();
        speakSample();
        setIsPlaying(true);
        setHasPlayed(false);

        gsap.set(root.querySelectorAll('.research-transcript-char'), {
            y: reduceMotion ? 0 : 9,
            opacity: reduceMotion ? 1 : 0,
            filter: 'blur(0px)',
        });
        gsap.set(root.querySelectorAll('.research-output-ready'), {
            scale: reduceMotion ? 1 : 0.85,
            opacity: reduceMotion ? 1 : 0,
        });
        gsap.set(root.querySelector('.research-wave-playhead'), { x: 0, opacity: 0 });

        if (reduceMotion) {
            setIsPlaying(false);
            setHasPlayed(true);
            return;
        }

        waveTweenRef.current = gsap.to(root.querySelectorAll('.research-wave-bar'), {
            scaleY: () => gsap.utils.random(0.28, 1),
            opacity: () => gsap.utils.random(0.6, 1),
            duration: 0.28,
            stagger: { each: 0.025, from: 'random' },
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
        });

        const timeline = gsap.timeline({
            onComplete: () => {
                waveTweenRef.current?.kill();
                gsap.to(root.querySelectorAll('.research-wave-bar'), {
                    scaleY: 0.18,
                    opacity: 0.4,
                    duration: 0.35,
                });
                gsap.to(root.querySelector('.research-wave-playhead'), {
                    opacity: 0,
                    duration: 0.2,
                });
                setIsPlaying(false);
                setHasPlayed(true);
            },
        });

        timeline.to(root.querySelector('.research-wave-playhead'), {
            x: Math.max(0, waveShell.clientWidth - 2),
            opacity: 1,
            duration: 3.6,
            ease: 'none',
        }, 0);

        lanes.forEach((lane, laneIndex) => {
            const characters = lane.querySelectorAll('.research-transcript-char');
            const ready = lane.querySelector('.research-output-ready');
            const startAt = 0.28 + laneIndex * 0.95;

            timeline.to(characters, {
                y: 0,
                opacity: 1,
                filter: 'blur(0px)',
                duration: 0.22,
                stagger: 0.038,
                ease: 'power2.out',
            }, startAt);
            timeline.to(ready, {
                scale: 1,
                opacity: 1,
                duration: 0.28,
                ease: 'back.out(2)',
            });
        });

        timelineRef.current = timeline;
    };

    return (
        <div ref={rootRef} className="research-output-visual" aria-label="Audio transcribed into three output modes">
            <div className="research-audio-source">
                <div className="research-audio-meta">
                    <span className="research-live-dot" aria-hidden="true" />
                    <span>Input audio</span>
                    <span className="research-audio-time">00:04</span>
                </div>
                <div className="research-wave-shell" aria-hidden="true">
                    <span className="research-wave-playhead" />
                    {waveform.map((height, index) => (
                        <span
                            key={`${height}-${index}`}
                            className="research-wave-bar"
                            style={{ height }}
                        />
                    ))}
                </div>
                <div className="research-audio-prompt">
                    <button
                        type="button"
                        className={`research-audio-play ${isPlaying ? 'is-playing' : ''}`}
                        onClick={playTranscription}
                        disabled={isPlaying}
                        aria-label={hasPlayed ? 'Replay audio transcription' : 'Play audio and transcribe'}
                    >
                        {hasPlayed ? <RotateCcw size={18} aria-hidden="true" /> : <Volume2 size={19} aria-hidden="true" />}
                    </button>
                    <div>
                        <p className="research-audio-quote">“Kal meeting hai at 5 PM”</p>
                        <p className="research-audio-instruction" aria-live="polite">
                            {isPlaying ? 'Listening and transcribing…' : hasPlayed ? 'Replay the sample' : 'Play to hear and transcribe'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="research-signal-bridge" aria-hidden="true">
                <span />
            </div>

            <div className="research-output-lanes">
                {transcriptModes.map((mode, index) => (
                    <div className="research-output-lane" key={mode.label}>
                        <div className="research-output-index">0{index + 1}</div>
                        <div className="research-output-content">
                            <p className="research-output-label">{mode.label}</p>
                            <SplitCharacters text={mode.text} />
                        </div>
                        <span className="research-output-ready">Ready</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Metric = ({ label, value, suffix = '', decimals = 0 }) => (
    <div className="research-model-metric">
        <span className="research-model-metric-value">
            <span data-metric-value={value} data-metric-decimals={decimals}>{Number(value).toFixed(decimals)}</span>
            {suffix}
        </span>
        <span className="research-model-metric-label">{label}</span>
    </div>
);

export const CanaryArchitectureFlow = () => {
    const rootRef = useRef(null);

    useLayoutEffect(() => {
        const root = rootRef.current;
        if (!root) return undefined;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) return undefined;

        const context = gsap.context(() => {
            const timeline = gsap.timeline({
                scrollTrigger: {
                    trigger: root,
                    start: 'top 80%',
                    once: true,
                },
            });

            timeline
                .fromTo(
                    '.research-model-stage',
                    { y: -18, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, stagger: 0.38, ease: 'power3.out' }
                )
                .fromTo(
                    '.research-flow-path',
                    { strokeDashoffset: 1 },
                    { strokeDashoffset: 0, duration: 1.15, stagger: 0.16, ease: 'power2.inOut' },
                    0.25
                )
                .fromTo(
                    '.research-flow-node',
                    { scale: 0, opacity: 0, transformOrigin: 'center' },
                    { scale: 1, opacity: 1, duration: 0.35, stagger: 0.13, ease: 'back.out(2)' },
                    0.65
                )
                .fromTo(
                    '.research-capability-chip',
                    { y: -10, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.45, stagger: 0.09, ease: 'power2.out' },
                    1.45
                );

            root.querySelectorAll('[data-metric-value]').forEach((element) => {
                const target = Number(element.dataset.metricValue);
                const decimals = Number(element.dataset.metricDecimals ?? 0);
                const counter = { value: 0 };
                gsap.to(counter, {
                    value: target,
                    duration: 1.45,
                    delay: 0.25,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: root,
                        start: 'top 80%',
                        once: true,
                    },
                    onUpdate: () => {
                        element.textContent = counter.value.toFixed(decimals);
                    },
                });
            });

            gsap.to('.research-flow-pulse', {
                attr: { cy: 279 },
                duration: 3.2,
                ease: 'power1.inOut',
                repeat: -1,
                yoyo: true,
            });
        }, root);

        return () => context.revert();
    }, []);

    return (
        <div ref={rootRef} className="research-model-flow">
            <div className="research-model-topline">
                <span className="research-model-kicker">Model architecture</span>
                <span className="research-model-status"><i /> System ready</span>
            </div>

            <div className="research-model-metrics research-model-stage">
                <Metric label="Languages" value="25" />
                <Metric label="Training hours" value="1.35" suffix="M" decimals={2} />
                <Metric label="Parameters" value="1.2" suffix="B" decimals={1} />
            </div>

            <div className="research-model-diagram">
                <svg
                    className="research-model-svg"
                    viewBox="0 0 740 320"
                    role="img"
                    aria-label="Training data flowing through the NVIDIA Canary encoder and decoder into transcription capabilities"
                >
                    <defs>
                        <linearGradient id="canaryFlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#ffb347" />
                            <stop offset="55%" stopColor="#ff6b35" />
                            <stop offset="100%" stopColor="#314685" />
                        </linearGradient>
                        <filter id="canaryGlow" x="-100%" y="-100%" width="300%" height="300%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>
                    <path className="research-flow-path" pathLength="1" d="M370 8V282" />
                    <path className="research-flow-path research-flow-branch" pathLength="1" d="M370 282C315 282 290 302 245 310" />
                    <path className="research-flow-path research-flow-branch" pathLength="1" d="M370 282V310" />
                    <path className="research-flow-path research-flow-branch" pathLength="1" d="M370 282C425 282 450 302 495 310" />
                    <circle className="research-flow-pulse" cx="370" cy="8" r="5" fill="#ff6b35" filter="url(#canaryGlow)" />
                    <circle className="research-flow-node" cx="370" cy="86" r="6" />
                    <circle className="research-flow-node" cx="370" cy="194" r="6" />
                    <circle className="research-flow-node" cx="370" cy="282" r="6" />
                </svg>

                <div className="research-model-stage research-model-input">
                    <span>Multilingual speech</span>
                    <small>1.35M hours · 25 languages</small>
                </div>

                <div className="research-model-stage research-canary-core">
                    <div className="research-canary-heading">
                        <span className="research-canary-mark">C</span>
                        <div><strong>NVIDIA Canary</strong><small>Unified multilingual ASR</small></div>
                    </div>
                    <div className="research-canary-blocks">
                        <div><span>32 layers</span><strong>Conformer encoder</strong><small>600M parameters</small></div>
                        <div className="research-canary-arrow" aria-hidden="true">→</div>
                        <div><span>24 layers</span><strong>Transformer decoder</strong><small>600M parameters</small></div>
                    </div>
                </div>

                <div className="research-model-stage research-model-vocabulary">
                    <span>6K vocabulary</span>
                    <small>Shared multilingual representation</small>
                </div>
            </div>

            <div className="research-model-capabilities" aria-label="Supported capabilities">
                {['Native script', 'Code mixed', 'Romanized', 'Streaming', 'Offline'].map((capability) => (
                    <span className="research-capability-chip" key={capability}>
                        <i aria-hidden="true">✓</i>{capability}
                    </span>
                ))}
            </div>
        </div>
    );
};
