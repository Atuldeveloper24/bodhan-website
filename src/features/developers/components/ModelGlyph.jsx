import { useId, useRef } from 'react';
import { ScrollTrigger, gsap, useGsapAnimation } from '../devMotion';

/**
 * The little animated diagram at the top of each model card.
 *
 * Each one shows what the model actually does to its input rather than being
 * decoration: speech resolving into written lines, written lines collapsing
 * into a voice, a page being read block by block, a sentence crossing between
 * two scripts. All four are the same size and share one gradient so the four
 * cards read as one set.
 */

const W = 320;
const H = 96;

/* ── Indic-Transcribe: a waveform being written down ─────────────────────── */

const WAVE_BARS = Array.from({ length: 26 }, (_, i) => {
    // a shape rather than noise, so the same run reads as one utterance
    const envelope = Math.sin((i / 25) * Math.PI) ** 0.7;
    const detail = 0.45 + 0.55 * Math.abs(Math.sin(i * 1.7));
    return Math.max(0.14, envelope * detail);
});

const WaveGlyph = () => (
    <>
        <g className="mg-wave">
            {WAVE_BARS.map((h, i) => (
                <rect
                    key={i}
                    className="mg-wave-bar"
                    x={14 + i * 5.2}
                    y={H / 2 - (h * 52) / 2}
                    width="2.6"
                    height={h * 52}
                    rx="1.3"
                    style={{ '--h': h }}
                />
            ))}
        </g>

        {/* what the audio becomes: three lines of transcript drawing in */}
        <g className="mg-lines">
            {[0, 1, 2].map((i) => (
                <line
                    key={i}
                    className="mg-line"
                    x1="168"
                    y1={30 + i * 18}
                    x2={i === 2 ? 262 : 302}
                    y2={30 + i * 18}
                    strokeWidth="4"
                    strokeLinecap="round"
                />
            ))}
        </g>

        <line className="mg-head" x1="0" y1="8" x2="0" y2={H - 8} strokeWidth="1.5" />
    </>
);

/* ── Indic-Speak: written lines gathered into a voice ────────────────────── */

const EQ_BARS = [0.42, 0.72, 1, 0.6, 0.86, 0.5];

const VoiceGlyph = () => (
    <>
        <g className="mg-lines mg-lines-left">
            {[0, 1, 2].map((i) => (
                <line
                    key={i}
                    className="mg-line"
                    x1="16"
                    y1={30 + i * 18}
                    x2={i === 2 ? 96 : 124}
                    y2={30 + i * 18}
                    strokeWidth="4"
                    strokeLinecap="round"
                />
            ))}
        </g>

        {/* the speaker: rings leaving the orb, one per phrase */}
        <g className="mg-orb-group">
            {[0, 1, 2].map((i) => (
                <circle key={i} className="mg-ring" cx="196" cy={H / 2} r="16" strokeWidth="1.5" />
            ))}
            <circle className="mg-orb" cx="196" cy={H / 2} r="13" />
        </g>

        <g className="mg-eq">
            {EQ_BARS.map((h, i) => (
                <rect
                    key={i}
                    className="mg-eq-bar"
                    x={236 + i * 13}
                    y={H / 2 - (h * 46) / 2}
                    width="5"
                    height={h * 46}
                    rx="2.5"
                    style={{ '--h': h }}
                />
            ))}
        </g>
    </>
);

/* ── Indic-OCR: a page read block by block, in reading order ─────────────── */

// x, y, w, h in the 320×96 box — a page's worth of layout, roughly to scale
const BLOCKS = [
    { x: 30, y: 18, w: 62, h: 7 },
    { x: 30, y: 33, w: 82, h: 7 },
    { x: 30, y: 48, w: 82, h: 7 },
    { x: 30, y: 63, w: 48, h: 7 },
    { x: 148, y: 18, w: 74, h: 7 },
    { x: 148, y: 33, w: 74, h: 22, fig: true },
    { x: 148, y: 63, w: 56, h: 7 },
    { x: 238, y: 18, w: 60, h: 22, fig: true },
    { x: 238, y: 48, w: 60, h: 7 },
    { x: 238, y: 63, w: 42, h: 7 },
];

const PageGlyph = () => (
    <>
        <rect className="mg-page" x="14" y="8" width={W - 28} height={H - 16} rx="8" strokeWidth="1.5" />

        <g className="mg-blocks">
            {BLOCKS.map((b, i) => (
                <rect
                    key={i}
                    className={`mg-block${b.fig ? ' mg-block-fig' : ''}`}
                    x={b.x}
                    y={b.y}
                    width={b.w}
                    height={b.h}
                    rx="3.5"
                />
            ))}
        </g>

        {/* the box the layout model is holding right now */}
        <rect className="mg-focus" x="0" y="0" width="10" height="10" rx="4" strokeWidth="2" />

        <line className="mg-head" x1="0" y1="10" x2="0" y2={H - 10} strokeWidth="1.5" />
    </>
);

/* ── Indic-Translate: a sentence crossing between two scripts ────────────── */

const ARCS = [
    'M 64 30 C 130 17, 194 17, 258 30',
    'M 64 48 C 130 45, 194 45, 258 48',
    'M 64 66 C 130 79, 194 79, 258 66',
];

const BridgeGlyph = () => (
    <>
        <g className="mg-script">
            <text className="mg-glyph-text" x="26" y="36">अ</text>
            <text className="mg-glyph-text" x="26" y="60">ব</text>
            <text className="mg-glyph-text" x="26" y="84">க</text>
        </g>

        <g className="mg-arcs">
            {ARCS.map((d, i) => (
                <path key={i} className="mg-arc" d={d} strokeWidth="1.6" fill="none" />
            ))}
        </g>

        {ARCS.map((d, i) => (
            <path key={`p${i}`} id={`mg-arc-${i}`} d={d} className="mg-arc-hidden" fill="none" />
        ))}

        <g className="mg-dots">
            {ARCS.map((_, i) => (
                <circle key={i} className="mg-dot" r="3.4" cx="0" cy="0" />
            ))}
        </g>

        <g className="mg-script mg-script-right">
            <text className="mg-glyph-text" x="272" y="36">Aa</text>
            <text className="mg-glyph-text" x="272" y="60">Bb</text>
            <text className="mg-glyph-text" x="272" y="84">Cc</text>
        </g>
    </>
);

/* ── timelines ───────────────────────────────────────────────────────────── */

const buildWave = (root) => {
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'sine.inOut' } });
    const bars = root.querySelectorAll('.mg-wave-bar');
    const lines = root.querySelectorAll('.mg-line');
    const head = root.querySelector('.mg-head');

    tl.fromTo(
        bars,
        { scaleY: 0.12 },
        { scaleY: (i, el) => 0.55 + Number(el.style.getPropertyValue('--h')) * 0.9, duration: 0.5, stagger: { each: 0.035, from: 'start' } },
        0,
    )
        .to(bars, { scaleY: 0.18, duration: 0.5, stagger: { each: 0.035, from: 'start' } }, 0.85)
        .fromTo(head, { x: 8, opacity: 0 }, { x: 300, opacity: 1, duration: 1.5, ease: 'none' }, 0)
        .to(head, { opacity: 0, duration: 0.25 }, 1.5)
        .fromTo(lines, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.45, stagger: 0.18, ease: 'power2.out' }, 0.5)
        .to(lines, { drawSVG: '100% 100%', duration: 0.3, stagger: 0.08 }, 2.4)
        .set({}, {}, 3);

    return tl;
};

const buildVoice = (root) => {
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'sine.inOut' } });
    const lines = root.querySelectorAll('.mg-line');
    const rings = root.querySelectorAll('.mg-ring');
    const orb = root.querySelector('.mg-orb');
    const bars = root.querySelectorAll('.mg-eq-bar');

    tl.fromTo(lines, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.4, stagger: 0.14, ease: 'power2.out' }, 0)
        .fromTo(orb, { scale: 0.75, transformOrigin: '50% 50%' }, { scale: 1.06, duration: 0.4 }, 0.55)
        .to(orb, { scale: 0.96, duration: 0.6 }, 0.95)
        .fromTo(
            rings,
            { scale: 0.5, opacity: 0.65, transformOrigin: '50% 50%' },
            { scale: 2.1, opacity: 0, duration: 1.5, ease: 'power1.out', stagger: 0.42 },
            0.6,
        )
        .fromTo(
            bars,
            { scaleY: 0.16 },
            {
                scaleY: (i, el) => 0.5 + Number(el.style.getPropertyValue('--h')) * 0.95,
                duration: 0.34,
                stagger: { each: 0.07, yoyo: true, repeat: 3 },
            },
            0.7,
        )
        .to(bars, { scaleY: 0.16, duration: 0.4, stagger: 0.05 }, 2.3)
        .set({}, {}, 3);

    return tl;
};

const buildPage = (root) => {
    const tl = gsap.timeline({ repeat: -1 });
    const blocks = root.querySelectorAll('.mg-block');
    const focus = root.querySelector('.mg-focus');
    const head = root.querySelector('.mg-head');

    tl.fromTo(head, { x: 12, opacity: 0 }, { x: 306, opacity: 1, duration: 1.1, ease: 'none' }, 0)
        .to(head, { opacity: 0, duration: 0.3 }, 1.1)
        .fromTo(blocks, { opacity: 0.18, scaleX: 0.4, transformOrigin: '0% 50%' }, { opacity: 1, scaleX: 1, duration: 0.3, stagger: 0.12, ease: 'power2.out' }, 0.15);

    // the focus box walks the blocks in reading order
    BLOCKS.forEach((b, i) => {
        tl.to(
            focus,
            {
                attr: { x: b.x - 4, y: b.y - 4, width: b.w + 8, height: b.h + 8 },
                opacity: 1,
                duration: 0.16,
                ease: 'power2.inOut',
            },
            0.15 + i * 0.12,
        );
    });

    tl.to(focus, { opacity: 0, duration: 0.3 }, 1.7)
        .to(blocks, { opacity: 0.3, duration: 0.4, stagger: 0.03 }, 2.5)
        .set({}, {}, 3.2);

    return tl;
};

const buildBridge = (root) => {
    const tl = gsap.timeline({ repeat: -1 });
    const arcs = root.querySelectorAll('.mg-arc');
    const dots = root.querySelectorAll('.mg-dot');
    const paths = root.querySelectorAll('.mg-arc-hidden');
    const left = root.querySelectorAll('.mg-script:not(.mg-script-right) text');
    const right = root.querySelectorAll('.mg-script-right text');

    tl.fromTo(left, { opacity: 0.25, y: 4 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.1, ease: 'power2.out' }, 0)
        .fromTo(arcs, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.6, stagger: 0.14, ease: 'power2.inOut' }, 0.25);

    dots.forEach((dot, i) => {
        const at = 0.35 + i * 0.14;
        tl.fromTo(
            dot,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 0.7,
                ease: 'none',
                motionPath: { path: paths[i], align: paths[i], alignOrigin: [0.5, 0.5] },
            },
            at,
        );
    });

    tl.to(dots, { opacity: 0, duration: 0.2, stagger: 0.1 }, 1.15)
        .fromTo(right, { opacity: 0, y: -4 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.1, ease: 'power2.out' }, 1.05)
        .to([...left, ...right], { opacity: 0.3, duration: 0.4 }, 2.4)
        .to(arcs, { drawSVG: '100% 100%', duration: 0.4, stagger: 0.08 }, 2.4)
        .set({}, {}, 3);

    return tl;
};

const GLYPHS = {
    wave: { Shape: WaveGlyph, build: buildWave },
    voice: { Shape: VoiceGlyph, build: buildVoice },
    page: { Shape: PageGlyph, build: buildPage },
    bridge: { Shape: BridgeGlyph, build: buildBridge },
};

const ModelGlyph = ({ kind, from, to, className = '' }) => {
    const ref = useRef(null);
    const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
    const entry = GLYPHS[kind] ?? GLYPHS.wave;
    const { Shape, build } = entry;

    // Four looping timelines on one page is exactly the kind of thing that
    // keeps a laptop fan going, so each one only runs while it is on screen.
    useGsapAnimation(
        (root) => {
            const tl = build(root);
            tl.pause(0);
            ScrollTrigger.create({
                trigger: root,
                start: 'top bottom',
                end: 'bottom top',
                onToggle: ({ isActive }) => (isActive ? tl.play() : tl.pause()),
            });
        },
        ref,
        [kind],
    );

    return (
        <svg
            ref={ref}
            className={`mg ${className}`}
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            role="presentation"
            aria-hidden="true"
            style={{ '--mg-from': from, '--mg-to': to }}
        >
            <defs>
                <linearGradient id={`mg-grad-${uid}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={from} />
                    <stop offset="100%" stopColor={to} />
                </linearGradient>
            </defs>

            <g style={{ '--mg-grad': `url(#mg-grad-${uid})` }} className={`mg-body mg-${kind}`}>
                <Shape gradientId={`mg-grad-${uid}`} />
            </g>
        </svg>
    );
};

export default ModelGlyph;
