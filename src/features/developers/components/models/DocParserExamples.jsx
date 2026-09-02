import { useRef, useState } from 'react';
import { ImageOff, ScanSearch } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { DOC_EXAMPLES } from '../../data/docParserExamples';

const LENS_SIZE = 260;
const ZOOM = 2.6;

// The image is a composite: page scan on the left, OCR output on the right.
// The frame shows only the left portion; the lens samples the right portion at
// the same relative position, so hovering a block reveals how it was parsed.
// Remounted via `key={src}`, so state resets with the image — no effect needed.
const XRayLens = ({ example }) => {
    const frameRef = useRef(null);
    const [lens, setLens] = useState(null);
    const [failed, setFailed] = useState(false);

    const { image: src, split, width, height } = example;

    const onMove = (event) => {
        const frame = frameRef.current;
        if (!frame) return;
        const rect = frame.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
            setLens(null);
            return;
        }
        setLens({ x, y, frameWidth: rect.width, frameHeight: rect.height });
    };

    if (failed) {
        return (
            <div className="lens-frame lens-missing">
                <ImageOff size={22} aria-hidden="true" />
                <p>
                    Add the composite image at
                    <code>public{src}</code>
                </p>
            </div>
        );
    }

    // The frame is the left portion only, so the whole composite spans 1/split frames.
    const fullWidthPct = 100 / split;
    const leftAspect = (width * split) / height;

    let glassStyle = null;
    if (lens) {
        const zoomedWidth = (lens.frameWidth / split) * ZOOM;
        const zoomedHeight = zoomedWidth * (height / width);

        // Same relative position, but inside the right-hand portion of the composite.
        const nx = split + (lens.x / lens.frameWidth) * (1 - split);
        const ny = lens.y / lens.frameHeight;

        glassStyle = {
            left: `${lens.x - LENS_SIZE / 2}px`,
            top: `${lens.y - LENS_SIZE / 2}px`,
            width: `${LENS_SIZE}px`,
            height: `${LENS_SIZE}px`,
            backgroundImage: `url(${src})`,
            backgroundSize: `${zoomedWidth}px ${zoomedHeight}px`,
            backgroundPosition: `${LENS_SIZE / 2 - nx * zoomedWidth}px ${LENS_SIZE / 2 - ny * zoomedHeight}px`,
        };
    }

    return (
        <div
            className="lens-frame"
            ref={frameRef}
            style={{ aspectRatio: leftAspect }}
            onMouseMove={onMove}
            onMouseLeave={() => setLens(null)}
        >
            {/* Hidden probe: reports a missing/broken file without showing the composite */}
            <img src={src} alt="" className="lens-probe" onError={() => setFailed(true)} />

            <span
                className="lens-base"
                style={{ backgroundImage: `url(${src})`, backgroundSize: `${fullWidthPct}% 100%` }}
                role="img"
                aria-label={`${example.label} page with detected layout blocks in reading order`}
            />

            {glassStyle && <span className="lens-glass" style={glassStyle} aria-hidden="true" />}

            {!lens && (
                <span className="lens-hint" aria-hidden="true">
                    <ScanSearch size={13} />
                    Hover the page to reveal the parsed output
                </span>
            )}
        </div>
    );
};

const OcrOutput = ({ blocks }) => (
    <div className="dp-markdown example-ocr">
        {blocks.map((block, index) =>
            block.type === 'latex' ? (
                <pre key={index} className="dp-markdown-latex">
                    {block.value}
                </pre>
            ) : (
                <div key={index} className="example-ocr-block">
                    <ReactMarkdown>{block.value}</ReactMarkdown>
                </div>
            )
        )}
    </div>
);

const DocParserExamples = () => {
    const [activeId, setActiveId] = useState(DOC_EXAMPLES[0].id);
    const [direction, setDirection] = useState(1);
    const [showText, setShowText] = useState(false);

    const activeIndex = DOC_EXAMPLES.findIndex((e) => e.id === activeId);
    const example = DOC_EXAMPLES[activeIndex] ?? DOC_EXAMPLES[0];

    const select = (id) => {
        const nextIndex = DOC_EXAMPLES.findIndex((e) => e.id === id);
        setDirection(nextIndex > activeIndex ? 1 : -1);
        setActiveId(id);
    };

    return (
        <div className="model-panel">
            <div className="dp-sample-tabs" role="tablist" aria-label="Example page">
                {DOC_EXAMPLES.map((e) => (
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
                <span className="dp-sample-meta">
                    {example.tag} <span aria-hidden="true">·</span> {example.note}
                </span>
            </div>

            <div key={example.id} className={`example-slide ${direction > 0 ? 'from-right' : 'from-left'}`}>
                <XRayLens key={example.image} example={example} />

                <div className="example-footer">
                    <div className="example-stats">
                        {example.stats.map((stat) => (
                            <span key={stat.label}>
                                <b>{stat.value}</b> {stat.label}
                            </span>
                        ))}
                    </div>
                    <button type="button" className="dp-text-btn" onClick={() => setShowText((open) => !open)}>
                        {showText ? 'Hide' : 'Show'} output as text
                    </button>
                </div>

                {showText && (
                    <div className="example-output">
                        <OcrOutput blocks={example.ocr} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DocParserExamples;
