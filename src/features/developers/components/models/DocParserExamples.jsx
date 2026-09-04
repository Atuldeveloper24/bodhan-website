import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { DOC_EXAMPLES, SCAN_CROP } from '../../data/docParserExamples';
import { assetUrl } from '../../data/assetUrl';
import { CONSOLE_URL } from '../../../../config/links';

// The model emits maths as LaTeX, so the demo typesets it rather than showing
// the source. Bad output stays visible in red instead of throwing.
const KATEX_OPTIONS = { throwOnError: false, errorColor: '#B91C1C', strict: false };
const renderMath = (value) => katex.renderToString(value, { ...KATEX_OPTIONS, displayMode: true });

const DEFAULT_POS = 50;

// Colours mirror the ones the model's own layout visualisation burns into the
// scan, so a block's chip on the text side matches its box on the scan side.
const LABEL_ACCENT = {
    Header: '#2E7D6F',
    'Page-number': '#2E7D6F',
    Folio: '#2E7D6F',
    Paragraph: '#2563A8',
    Equation: '#D2691E',
    Question: '#5B4B9E',
    List: '#0F766E',
    Title: '#B4478A',
    Table: '#8A5A2B',
};

// Two shapes reach here: gallery pages carry the model's blocks directly, while
// the composite examples carry a flat `ocr` list that `layout` groups back up.
const toBlocks = ({ ocr, layout, blocks }) => {
    if (blocks) return blocks.map(({ n, label, type, value }) => ({ n, label, parts: [{ type, value }] }));
    if (!ocr) return [];
    if (!layout) return ocr.map((part, i) => ({ n: i, label: 'Block', parts: [part] }));

    let cursor = 0;
    return layout.map(({ n, label, span = 1 }) => {
        const parts = ocr.slice(cursor, cursor + span);
        cursor += span;
        return { n, label, parts };
    });
};

// The page scan sits on top of the recognised text, clipped by the handle.
// Both layers fill one page-shaped stage, so the whole page — scan or text —
// is visible at once without scrolling the demo.
const CompareSlider = ({ example }) => {
    const frameRef = useRef(null);
    const [pos, setPos] = useState(DEFAULT_POS);
    const [dragging, setDragging] = useState(false);
    const [failed, setFailed] = useState(false);

    const { split } = example;
    const src = assetUrl(example.image);
    const blocks = useMemo(() => toBlocks(example), [example]);

    // The stage is the page card alone; the scan is scaled and offset so that
    // card — not the composite's caption and margins — fills it exactly.
    const crop = example.crop ?? SCAN_CROP;
    const pageAspect = (example.width * split * crop.w) / (example.height * crop.h);
    const scanStyle = {
        width: `${100 / (split * crop.w)}%`,
        left: `${(-crop.x / crop.w) * 100}%`,
        top: `${(-crop.y / crop.h) * 100}%`,
    };

    const setFromClientX = useCallback((clientX) => {
        const frame = frameRef.current;
        if (!frame) return;
        const rect = frame.getBoundingClientRect();
        const ratio = ((clientX - rect.left) / rect.width) * 100;
        setPos(Math.min(100, Math.max(0, ratio)));
    }, []);

    useEffect(() => {
        if (!dragging) return undefined;

        const onMove = (event) => setFromClientX(event.clientX);
        const onUp = () => setDragging(false);

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        return () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };
    }, [dragging, setFromClientX]);

    const onKeyDown = (event) => {
        const step = event.shiftKey ? 10 : 3;
        if (event.key === 'ArrowLeft') setPos((p) => Math.max(0, p - step));
        else if (event.key === 'ArrowRight') setPos((p) => Math.min(100, p + step));
        else if (event.key === 'Home') setPos(0);
        else if (event.key === 'End') setPos(100);
        else return;
        event.preventDefault();
    };

    return (
        <div
            className={`compare-frame${dragging ? ' is-dragging' : ''}`}
            ref={frameRef}
            style={{ '--page-aspect': pageAspect, '--ocr-scale': example.textScale ?? 1 }}
        >
            <div className="compare-text" dir={example.rtl ? 'rtl' : undefined}>
                {blocks.map((block) => (
                    <div
                        key={block.n}
                        className="ocr-block"
                        style={{ '--ocr-accent': LABEL_ACCENT[block.label] ?? '#57534E' }}
                    >
                        <span className="ocr-block-tag">
                            <span className="ocr-block-n">{block.n}</span>
                            {block.label}
                        </span>
                        {block.parts.map((part, index) => {
                            if (part.type === 'latex') {
                                return (
                                    <div
                                        key={index}
                                        className="ocr-block-math"
                                        dangerouslySetInnerHTML={{ __html: renderMath(part.value) }}
                                    />
                                );
                            }

                            // Tables come back from the model as HTML.
                            if (part.type === 'html') {
                                return (
                                    <div
                                        key={index}
                                        className="ocr-block-table"
                                        dangerouslySetInnerHTML={{ __html: part.value }}
                                    />
                                );
                            }

                            return (
                                <div key={index} className="ocr-block-text">
                                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[[rehypeKatex, KATEX_OPTIONS]]}>
                                        {part.value}
                                    </ReactMarkdown>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>

            {failed ? (
                <div className="compare-scan compare-missing" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
                    <ImageOff size={20} aria-hidden="true" />
                    <p>
                        Missing image
                        <code>public{src}</code>
                    </p>
                </div>
            ) : (
                <div className="compare-scan" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
                    <img
                        src={src}
                        className="compare-scan-img"
                        style={scanStyle}
                        alt={`${example.title} — page scan with the model's detected layout blocks`}
                        onError={() => setFailed(true)}
                    />
                </div>
            )}

            <span className="compare-label compare-label-left">Scan</span>
            <span className="compare-label compare-label-right">IndicOCR</span>

            <div
                className="compare-handle"
                style={{ left: `${pos}%` }}
                role="slider"
                tabIndex={0}
                aria-label="Reveal more page scan or more OCR output"
                aria-valuenow={Math.round(pos)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-orientation="horizontal"
                onPointerDown={(event) => {
                    event.preventDefault();
                    setDragging(true);
                }}
                onKeyDown={onKeyDown}
            >
                <span className="compare-handle-grip">
                    <ChevronLeft size={13} aria-hidden="true" />
                    <ChevronRight size={13} aria-hidden="true" />
                </span>
            </div>
        </div>
    );
};

const DocParserExamples = () => {
    const [activeId, setActiveId] = useState(DOC_EXAMPLES[0].id);
    const example = DOC_EXAMPLES.find((e) => e.id === activeId) ?? DOC_EXAMPLES[0];

    return (
        <div className="pg-breakout">
            <div className="pg-shell">
                <div className="pg-glow" aria-hidden="true" />

                <div className="pg-card">
                    <div className="pg-main">
                        <CompareSlider key={example.image} example={example} />
                    </div>

                    <aside className="pg-rail">
                        <div className="pg-rail-list pg-rail-scroll">
                            {DOC_EXAMPLES.map((e) => (
                                <button
                                    key={e.id}
                                    type="button"
                                    className={`pg-example${activeId === e.id ? ' is-active' : ''}`}
                                    aria-pressed={activeId === e.id}
                                    onClick={() => setActiveId(e.id)}
                                >
                                    <span
                                        className="pg-example-thumb"
                                        style={{
                                            backgroundImage: `url(${assetUrl(e.image)})`,
                                            backgroundSize: `${100 / e.split}% auto`,
                                        }}
                                        aria-hidden="true"
                                    />
                                    <span className="pg-example-copy">
                                        <span className="pg-example-name">{e.title}</span>
                                        <span className="pg-example-lang">{e.langLabel}</span>
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="pg-rail-stats">
                            {example.stats.map((s) => (
                                <span key={s.label}>
                                    <b>{s.value}</b> {s.label}
                                </span>
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

export default DocParserExamples;
