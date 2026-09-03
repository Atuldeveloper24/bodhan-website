import { useCallback, useEffect, useRef, useState } from 'react';
import { ImageOff, MoveHorizontal } from 'lucide-react';
import { DOC_EXAMPLES } from '../../data/docParserExamples';

const DEFAULT_POS = 50;

// Each example is one composite image: page scan on the left half, the model's
// rendered OCR output on the right half. Both halves share the same dimensions,
// so each is cropped to fill the same frame — the scan on top, clipped by the
// handle, revealing the rendered output beneath. The frame is sized off its
// height so the whole comparison fits on screen without scrolling.
const CompareSlider = ({ example }) => {
    const frameRef = useRef(null);
    const [pos, setPos] = useState(DEFAULT_POS);
    const [dragging, setDragging] = useState(false);
    const [failed, setFailed] = useState(false);

    const { image: src, split, width, height } = example;
    const halfAspect = (width * split) / height;

    // Scale the composite so the chosen half exactly fills the frame.
    const leftSize = `${100 / split}% 100%`;
    const rightSize = `${100 / (1 - split)}% 100%`;

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

    if (failed) {
        return (
            <div className="compare-frame compare-missing">
                <ImageOff size={22} aria-hidden="true" />
                <p>
                    Add the composite image at
                    <code>public{src}</code>
                </p>
            </div>
        );
    }

    return (
        <div className="compare-frame" ref={frameRef} style={{ aspectRatio: halfAspect }}>
            {/* Hidden probe: reports a missing/broken file without breaking the layout */}
            <img src={src} alt="" className="compare-probe" onError={() => setFailed(true)} />

            <div
                className="compare-layer"
                style={{ backgroundImage: `url(${src})`, backgroundSize: rightSize, backgroundPosition: 'right top' }}
                role="img"
                aria-label={`${example.label} example — the model's OCR output`}
            />

            <div
                className="compare-layer compare-layer-top"
                style={{
                    clipPath: `inset(0 ${100 - pos}% 0 0)`,
                    backgroundImage: `url(${src})`,
                    backgroundSize: leftSize,
                    backgroundPosition: 'left top',
                }}
                role="img"
                aria-label={`${example.label} page scan with detected layout blocks in reading order`}
            />

            <span className="compare-label compare-label-left">Page scan</span>
            <span className="compare-label compare-label-right">OCR output</span>

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
                    <MoveHorizontal size={13} aria-hidden="true" />
                </span>
            </div>
        </div>
    );
};

const DocParserExamples = () => {
    const [activeId, setActiveId] = useState(DOC_EXAMPLES[0].id);

    const example = DOC_EXAMPLES.find((e) => e.id === activeId) ?? DOC_EXAMPLES[0];

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
                        onClick={() => setActiveId(e.id)}
                    >
                        {e.label}
                    </button>
                ))}
            </div>

            <CompareSlider key={example.image} example={example} />
        </div>
    );
};

export default DocParserExamples;
