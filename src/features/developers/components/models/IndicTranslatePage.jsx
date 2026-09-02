import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Navbar from '../../../home/components/Navbar';
import Footer from '../../../home/components/Footer';
import ModelHero from './ModelHero';
import { SENTENCES, DOCUMENT } from '../../data/translateExamples';

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SentenceDemo = () => {
    const [pairId, setPairId] = useState(SENTENCES[0].id);
    const [chars, setChars] = useState(0);
    const [running, setRunning] = useState(false);

    const pair = SENTENCES.find((p) => p.id === pairId) ?? SENTENCES[0];

    useEffect(() => {
        if (!running) return undefined;
        const timer = window.setInterval(() => {
            setChars((current) => {
                const next = current + 2;
                if (next >= pair.output.length) {
                    window.clearInterval(timer);
                    setRunning(false);
                    return pair.output.length;
                }
                return next;
            });
        }, 26);
        return () => window.clearInterval(timer);
    }, [running, pair]);

    const run = (target) => {
        if (prefersReducedMotion()) {
            setChars(target.output.length);
            setRunning(false);
            return;
        }
        setChars(0);
        setRunning(true);
    };

    const selectPair = (id) => {
        const next = SENTENCES.find((p) => p.id === id);
        setPairId(id);
        setRunning(false);
        setChars(0);
        if (next) window.setTimeout(() => run(next), 60);
    };

    const done = chars >= pair.output.length;

    return (
        <>
            <div className="dp-sample-tabs translate-lang-tabs" role="tablist" aria-label="Translation direction">
                {SENTENCES.map((p) => (
                    <button
                        key={p.id}
                        type="button"
                        role="tab"
                        aria-selected={pairId === p.id}
                        className={pairId === p.id ? 'is-active' : undefined}
                        onClick={() => selectPair(p.id)}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            <div className="translate-shell">
                <div className="translate-side">
                    <p className="translate-side-label">{pair.from}</p>
                    <p className="translate-text">{pair.source}</p>
                </div>

                <div className={`translate-arrow${running ? ' is-running' : ''}`} aria-hidden="true">
                    <ArrowRight size={18} />
                </div>

                <div className="translate-side is-output">
                    <p className="translate-side-label">{pair.to}</p>
                    <p className="translate-text" lang={pair.lang}>
                        {pair.output.slice(0, chars)}
                        {running && <span className="translate-cursor" aria-hidden="true" />}
                    </p>
                </div>
            </div>

            <div className="dp-toolbar">
                <button
                    type="button"
                    className="model-cta-primary model-cta-small"
                    onClick={() => run(pair)}
                    disabled={running}
                >
                    {running ? 'Translating…' : done ? 'Translate again' : 'Translate'}
                </button>
            </div>
        </>
    );
};

const DocumentDemo = () => {
    const leftRef = useRef(null);
    const rightRef = useRef(null);
    const syncing = useRef(false);

    const mirror = (source, target) => {
        if (syncing.current || !source || !target) return;

        const sourceRange = source.scrollHeight - source.clientHeight;
        const targetRange = target.scrollHeight - target.clientHeight;
        if (sourceRange <= 0 || targetRange <= 0) return;

        syncing.current = true;
        target.scrollTop = (source.scrollTop / sourceRange) * targetRange;
        window.requestAnimationFrame(() => {
            syncing.current = false;
        });
    };

    const onSourceScroll = () => mirror(leftRef.current, rightRef.current);
    const onTargetScroll = () => mirror(rightRef.current, leftRef.current);

    return (
        <>
            <ul className="translate-preserved" aria-label="Structure preserved in the translation">
                {DOCUMENT.preserved.map((item) => (
                    <li key={item}>
                        <Check size={12} aria-hidden="true" />
                        {item}
                    </li>
                ))}
            </ul>

            <div className="translate-doc-shell">
                <div className="translate-doc-pane">
                    <p className="translate-side-label">English · source</p>
                    <div className="translate-doc-scroll dp-markdown" ref={leftRef} onScroll={onSourceScroll}>
                        <ReactMarkdown>{DOCUMENT.source}</ReactMarkdown>
                    </div>
                </div>

                <div className="translate-doc-pane">
                    <p className="translate-side-label">Tamil · output</p>
                    <div
                        className="translate-doc-scroll dp-markdown"
                        lang={DOCUMENT.targetLang}
                        ref={rightRef}
                        onScroll={onTargetScroll}
                    >
                        <ReactMarkdown>{DOCUMENT.target}</ReactMarkdown>
                    </div>
                </div>
            </div>
            <p className="translate-doc-hint">Scroll either pane — the other follows.</p>
        </>
    );
};

const TranslateExamples = () => {
    const [mode, setMode] = useState('sentence');

    return (
        <div className="model-panel">
            <div className="dp-view-tabs translate-mode-tabs" role="tablist" aria-label="Example type">
                {[
                    { id: 'sentence', label: 'Sentence' },
                    { id: 'document', label: 'Document' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        role="tab"
                        aria-selected={mode === tab.id}
                        className={mode === tab.id ? 'is-active' : undefined}
                        onClick={() => setMode(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {mode === 'sentence' ? <SentenceDemo /> : <DocumentDemo />}
        </div>
    );
};

const IndicTranslatePage = () => (
    <div className="min-h-screen research-page">
        <Navbar />
        <main className="model-page-main">
            <ModelHero
                eyebrow="Developers · Model"
                title="Indic-Translate"
                tagline="Whole documents in, whole documents out — 44 directions across English and 22 Indian languages."
                accent="var(--model-violet)"
                mascotMood="read"
                specs={[
                    { label: 'Directions', value: '44' },
                    { label: 'Parameters', value: '7.94B' },
                    { label: 'Context', value: '32K tokens' },
                ]}
                primaryCta={{ label: 'Hugging Face', href: '#' }}
                secondaryCta={{ label: 'Contact', href: '/contact' }}
            />

            <section className="model-section">
                <p className="model-section-label">Examples</p>
                <TranslateExamples />
                <p className="model-caption">
                    Unedited model output, produced with greedy decoding.
                </p>
            </section>
        </main>
        <Footer />
    </div>
);

export default IndicTranslatePage;
