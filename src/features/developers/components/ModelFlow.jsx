import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AudioLines, FileScan, Languages, Mic, ScanText, Speech, Type } from 'lucide-react';
import { ScrollTrigger, ensureRevealed, gsap, useGsapAnimation } from '../devMotion';
import { models } from '../data/models';

/**
 * How the four models compose.
 *
 * This is the one thing the index page could not say before: the models are
 * not four separate products, they are a pipeline. Speech or a scanned page
 * goes in on the left, comes out as text, crosses languages in the middle, and
 * leaves as speech on the right. The wires are measured from the rendered
 * nodes rather than hard-coded, so the diagram survives a font change or a
 * different viewport width, and a packet travels each one continuously.
 */

// Above this the five columns fit side by side and the wires are drawn;
// below it the nodes stack and CSS draws a rail down the side instead.
const WIDE = '(min-width: 1040px)';

const byId = Object.fromEntries(models.map((m) => [m.id, m]));

const NODES = [
    { id: 'in-speech', col: 1, row: '1', kind: 'port', label: 'Speech', Icon: Mic },
    { id: 'in-page', col: 1, row: '2', kind: 'port', label: 'Scanned page', Icon: FileScan },

    { id: 'indic-transcribe', col: 2, row: '1', kind: 'model', Icon: AudioLines, step: 'Recognise' },
    { id: 'indic-ocr', col: 2, row: '2', kind: 'model', Icon: ScanText, step: 'Read' },

    // the middle of the pipeline sits between the two branches it joins
    { id: 'indic-translate', col: 3, row: '1 / span 2', kind: 'model', Icon: Languages, step: 'Translate' },

    // text leaves here, speech carries on — so neither wire crosses the other
    { id: 'out-text', col: 4, row: '1', kind: 'port', label: 'Text, 22 languages', Icon: Type },
    { id: 'indic-speak', col: 4, row: '2', kind: 'model', Icon: Speech, step: 'Speak' },

    { id: 'out-speech', col: 5, row: '2', kind: 'port', label: 'Speech', Icon: AudioLines },
];

// [from, to, accent-owner] — the accent is the model the packet is heading into
// (or came out of, for the last hop), so the colour of a wire says what runs next.
const EDGES = [
    ['in-speech', 'indic-transcribe', 'indic-transcribe'],
    ['in-page', 'indic-ocr', 'indic-ocr'],
    ['indic-transcribe', 'indic-translate', 'indic-translate'],
    ['indic-ocr', 'indic-translate', 'indic-translate'],
    ['indic-translate', 'out-text', 'indic-translate'],
    ['indic-translate', 'indic-speak', 'indic-speak'],
    ['indic-speak', 'out-speech', 'indic-speak'],
];

/** A cubic from one node's right edge to the next node's left edge. */
const wireBetween = (a, b, origin) => {
    const x1 = a.right - origin.left;
    const y1 = a.top + a.height / 2 - origin.top;
    const x2 = b.left - origin.left;
    const y2 = b.top + b.height / 2 - origin.top;
    const bend = Math.max(26, (x2 - x1) * 0.55);
    return `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`;
};

const ModelFlow = () => {
    const shellRef = useRef(null);
    const nodeRefs = useRef({});
    const [box, setBox] = useState(null);
    const [wires, setWires] = useState([]);

    // Which layout to draw is a media query, not a measurement: a measured
    // container width is only as good as the moment it was taken, and a single
    // early reading — before the stylesheet lands, say — would otherwise lock
    // the diagram into its stacked form for the life of the page.
    const [wide, setWide] = useState(
        () => typeof window !== 'undefined' && window.matchMedia(WIDE).matches,
    );

    useEffect(() => {
        const query = window.matchMedia(WIDE);
        const onChange = (event) => setWide(event.matches);
        query.addEventListener('change', onChange);
        return () => query.removeEventListener('change', onChange);
    }, []);

    const measure = useCallback(() => {
        const shell = shellRef.current;
        if (!shell) return;

        // Stacked: the nodes are in one column and the wires would be a tangle
        // of vertical hairpins, so CSS draws a rail instead.
        if (!wide) {
            setWires([]);
            setBox(null);
            return;
        }

        const origin = shell.getBoundingClientRect();
        if (!origin.width) return;

        const rectOf = (id) => nodeRefs.current[id]?.getBoundingClientRect();
        const next = EDGES.map(([from, to, accent]) => {
            const a = rectOf(from);
            const b = rectOf(to);
            if (!a || !b) return null;
            return { id: `${from}--${to}`, d: wireBetween(a, b, origin), accent: byId[accent]?.viz };
        }).filter(Boolean);

        setBox({ w: origin.width, h: origin.height });
        setWires(next);
    }, [wide]);

    useLayoutEffect(() => {
        const shell = shellRef.current;
        if (!shell) return undefined;

        // observe() fires the callback once with the current box, so the first
        // measurement comes from the observer rather than a call by hand. The
        // window and visibility listeners are the backstop: a ResizeObserver
        // callback is delivered with the rendering steps, which a browser
        // suspends for a document it is not painting.
        const observer =
            typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
        observer?.observe(shell);
        window.addEventListener('resize', measure);
        document.addEventListener('visibilitychange', measure);

        return () => {
            observer?.disconnect();
            window.removeEventListener('resize', measure);
            document.removeEventListener('visibilitychange', measure);
        };
    }, [measure]);

    // Web fonts land after first paint and move every node a pixel or two.
    useEffect(() => {
        document.fonts?.ready?.then(measure).catch(() => {});
    }, [measure]);

    const signature = wires.map((w) => w.d).join('|');

    useGsapAnimation(
        (root) => {
            const paths = root.querySelectorAll('.dflow-wire');
            const traces = root.querySelectorAll('.dflow-trace');
            const packets = root.querySelectorAll('.dflow-packet');
            const nodes = root.querySelectorAll('.dflow-node');

            const arrive = gsap.fromTo(
                nodes,
                { opacity: 0, y: 18, scale: 0.97 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: 'power3.out',
                    stagger: 0.07,
                    clearProps: 'opacity,transform',
                    scrollTrigger: { trigger: root, start: 'top 85%', once: true },
                },
            );

            if (!paths.length) return ensureRevealed(arrive, root);

            // a pulse of light runs the length of each wire once, and leaves
            // the flat wire behind it
            gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 85%', once: true } })
                .fromTo(
                    traces,
                    { drawSVG: '0%', opacity: 0 },
                    {
                        drawSVG: '100%',
                        opacity: 0.95,
                        duration: 0.95,
                        ease: 'power2.inOut',
                        stagger: 0.09,
                    },
                )
                .to(traces, { opacity: 0, duration: 0.55, stagger: 0.05 }, '-=0.25');

            // one packet per wire, released in pipeline order and looping
            const loop = gsap.timeline({ repeat: -1, paused: true });
            packets.forEach((packet, i) => {
                const path = paths[i];
                if (!path) return;
                loop.fromTo(
                    packet,
                    { opacity: 0 },
                    {
                        keyframes: { opacity: [0, 1, 1, 0], ease: 'none' },
                        duration: 1.5,
                        ease: 'none',
                        motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
                    },
                    i * 0.34,
                );
            });
            loop.to({}, { duration: 0.8 });

            ScrollTrigger.create({
                trigger: root,
                start: 'top bottom',
                end: 'bottom top',
                onToggle: ({ isActive }) => (isActive ? loop.play() : loop.pause()),
            });

            return ensureRevealed(arrive, root);
        },
        shellRef,
        [signature],
    );

    const nodeFor = (node) => {
        const model = byId[node.id];

        if (node.kind === 'port') {
            return (
                <span
                    key={node.id}
                    ref={(el) => {
                        nodeRefs.current[node.id] = el;
                    }}
                    className="dflow-node dflow-port"
                    style={wide ? { gridColumn: node.col, gridRow: node.row } : undefined}
                >
                    <node.Icon size={14} aria-hidden="true" />
                    {node.label}
                </span>
            );
        }

        return (
            <Link
                key={node.id}
                to={model.href}
                ref={(el) => {
                    nodeRefs.current[node.id] = el;
                }}
                className="dflow-node dflow-model"
                style={{
                    ...(wide ? { gridColumn: node.col, gridRow: node.row } : null),
                    '--model-accent': model.accent,
                    '--model-gradient': model.gradient,
                }}
            >
                <span className="dflow-step">{node.step}</span>
                <span className="dflow-model-head">
                    <span className="dflow-model-icon">
                        <node.Icon size={15} aria-hidden="true" />
                    </span>
                    <span className="dflow-model-name">{model.name}</span>
                </span>
                <span className="dflow-model-note">{model.codename}</span>
            </Link>
        );
    };

    return (
        <div className="dflow" ref={shellRef}>
            {box && (
                <svg
                    className="dflow-wires"
                    viewBox={`0 0 ${box.w} ${box.h}`}
                    width={box.w}
                    height={box.h}
                    aria-hidden="true"
                >
                    <defs>
                        {wires.map((w) => (
                            <linearGradient key={w.id} id={`dflow-${w.id}`} x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor={w.accent?.from ?? '#B45309'} stopOpacity="0.25" />
                                <stop offset="100%" stopColor={w.accent?.to ?? '#C2410C'} stopOpacity="0.85" />
                            </linearGradient>
                        ))}
                    </defs>

                    {/* the wire is drawn flat and stays drawn; the trace over it
                        is the part that animates, so a tween that never runs
                        costs a highlight rather than the whole diagram */}
                    {wires.map((w) => (
                        <path
                            key={w.id}
                            className="dflow-wire"
                            d={w.d}
                            stroke={`url(#dflow-${w.id})`}
                            strokeWidth="1.75"
                            fill="none"
                            strokeLinecap="round"
                        />
                    ))}

                    {wires.map((w) => (
                        <path
                            key={`t-${w.id}`}
                            className="dflow-trace"
                            d={w.d}
                            stroke={w.accent?.to ?? '#C2410C'}
                            strokeWidth="1.75"
                            fill="none"
                            strokeLinecap="round"
                        />
                    ))}

                    {wires.map((w) => (
                        <circle key={`p-${w.id}`} className="dflow-packet" r="3.6" fill={w.accent?.to ?? '#C2410C'} />
                    ))}
                </svg>
            )}

            <div className={`dflow-grid${wide ? '' : ' is-stacked'}`}>{NODES.map(nodeFor)}</div>
        </div>
    );
};

export default ModelFlow;
