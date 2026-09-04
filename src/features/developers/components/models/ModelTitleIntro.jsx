import { useEffect, useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion } from 'motion/react';

const SWIPE_EASE = [0.4, 0, 0.2, 1];

// Every model title arrives the same way: one clean left-to-right swipe, with a
// travelling edge. What differs is what accompanies it — a waveform being
// written down, a word passing between languages, a page being read, a name
// being spoken.
const SwipeText = ({ text, duration = 1.1, delay = 0, edge = 'line', lang, dir }) => (
    <span className="mti-swipe">
        <Motion.span
            className="mti-text"
            lang={lang}
            dir={dir}
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            transition={{ duration, delay, ease: SWIPE_EASE }}
        >
            {text}
        </Motion.span>

        {edge && (
            <Motion.span
                className={`mti-edge mti-edge-${edge}`}
                aria-hidden="true"
                initial={{ left: '0%', opacity: 0 }}
                animate={{ left: '100%', opacity: [0, 1, 1, 0] }}
                transition={{
                    left: { duration, delay, ease: SWIPE_EASE },
                    opacity: { duration: duration + 0.25, delay, times: [0, 0.05, 0.86, 1] },
                }}
            />
        )}
    </span>
);

/* ── Transcribe: audio running, the name written down as it plays ───────── */
const WAVE = [
    0.35, 0.6, 0.95, 0.5, 0.75, 1, 0.55, 0.4, 0.85, 0.5, 0.9, 0.45, 0.7, 0.9, 0.35, 0.8, 1, 0.5,
    0.65, 0.95, 0.4, 0.75, 0.55, 0.85, 0.45, 0.65, 0.35,
];
const WRITE_MS = 1.5;

const WaveIntro = ({ text }) => (
    <span className="mti-stage mti-stage-stack">
        <SwipeText text={text} duration={WRITE_MS} delay={0.12} edge="caret" />

        <Motion.span
            className="mti-wave"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: WRITE_MS + 0.55, times: [0, 0.06, 0.8, 1], ease: 'easeInOut' }}
        >
            {WAVE.map((h, i) => (
                <Motion.span
                    key={i}
                    className="mti-wave-bar"
                    initial={{ scaleY: 0.12 }}
                    animate={{ scaleY: [0.12, h, 0.35, h * 0.8, 0.2] }}
                    transition={{
                        duration: 0.95,
                        times: [0, 0.25, 0.5, 0.78, 1],
                        delay: i * 0.01,
                        repeat: 1,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </Motion.span>
    </span>
);

/* ── Translate: the word for "translation", three languages, then the name ─ */
const CYCLE = [
    { text: 'अनुवाद', tag: 'hi' },
    { text: 'மொழிபெயர்ப்பு', tag: 'ta' },
    { text: 'অনুবাদ', tag: 'bn' },
];
const STEP_MS = 620;

const TranslateIntro = ({ text }) => {
    const [step, setStep] = useState(0);
    const settled = step >= CYCLE.length;

    useEffect(() => {
        if (settled) return undefined;
        const t = setTimeout(() => setStep((s) => s + 1), STEP_MS);
        return () => clearTimeout(t);
    }, [step, settled]);

    return (
        <span className="mti-stage">
            <AnimatePresence mode="wait">
                {settled ? (
                    <Motion.span key="final" exit={{ opacity: 0 }}>
                        <SwipeText text={text} duration={0.85} edge="line" />
                    </Motion.span>
                ) : (
                    <Motion.span key={step} exit={{ opacity: 0 }} transition={{ duration: 0.12 }}>
                        <span className="mti-cycle">
                            <SwipeText
                                text={CYCLE[step].text}
                                lang={CYCLE[step].tag}
                                duration={0.4}
                                edge="line"
                            />
                        </span>
                    </Motion.span>
                )}
            </AnimatePresence>
        </span>
    );
};

/* ── OCR: handwriting on the page, read into type as the scan passes ────── */
const SCAN_MS = 1.45;

const ScanIntro = ({ text }) => (
    <span className="mti-stage mti-scan">
        <Motion.span
            className="mti-scan-box"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2.3, times: [0, 0.1, 0.72, 1], ease: 'easeInOut' }}
        />

        {/* the source page: the name as it was written by hand, wiped away
            from the left exactly as the recognised text takes its place */}
        <Motion.span
            className="mti-hand"
            aria-hidden="true"
            initial={{ clipPath: 'inset(0 0 0 0%)' }}
            animate={{ clipPath: 'inset(0 0 0 100%)' }}
            transition={{ duration: SCAN_MS, delay: 0.25, ease: SWIPE_EASE }}
        >
            {text}
        </Motion.span>

        <SwipeText text={text} duration={SCAN_MS} delay={0.25} edge="line" />
    </span>
);

/* ── Speak: the name arrives, then keeps talking ────────────────────────── */
const EQ = [0.45, 0.9, 0.6, 1, 0.5];

// The meter starts with the first letter, not after the name has landed — the
// voice is what produces the name, so it cannot arrive late.
const SpeakIntro = ({ text }) => (
    <span className="mti-stage">
        <SwipeText text={text} duration={1} delay={0.1} edge="line" />

        <span className="mti-eq" aria-hidden="true">
            {EQ.map((h, i) => (
                <Motion.span
                    key={i}
                    initial={{ scaleY: 0.15, opacity: 0 }}
                    animate={{ scaleY: [0.2, h, 0.3, h * 0.75, 0.2], opacity: 1 }}
                    transition={{
                        duration: 1.05,
                        delay: 0.1 + i * 0.05,
                        repeat: Infinity,
                        repeatDelay: 0.15,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </span>
    </span>
);

const VARIANTS = { wave: WaveIntro, translate: TranslateIntro, scan: ScanIntro, speak: SpeakIntro };

const ModelTitleIntro = ({ variant, text, className }) => {
    const reduceMotion = useReducedMotion();
    const Intro = VARIANTS[variant];

    if (reduceMotion || !Intro) {
        return <h1 className={className}>{text}</h1>;
    }

    return (
        <h1 className={className}>
            <Intro text={text} />
        </h1>
    );
};

export default ModelTitleIntro;
