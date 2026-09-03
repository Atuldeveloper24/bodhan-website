import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// One rail of choices on the right, one source/output pair on the left.
// Used twice on the translate page — once to pick a language, once to pick a
// form — rather than one playground trying to cover every combination.
// `onSelect` lets the parent load whatever the current choice needs.
const MiniTranslatePlayground = ({ railLabel, items, renderPane, onSelect }) => {
    const [activeId, setActiveId] = useState(items[0]?.id);
    const active = items.find((item) => item.id === activeId) ?? items[0];
    const pane = renderPane(active);

    useEffect(() => {
        onSelect?.(activeId);
    }, [activeId, onSelect]);

    const body = (side) => {
        if (pane.loading) {
            return (
                <p className="tp-loading">
                    <Loader2 size={15} className="tp-spin" aria-hidden="true" />
                    Loading…
                </p>
            );
        }

        const text = side === 'source' ? pane.sourceText : pane.outputText;
        const lang = side === 'source' ? pane.sourceLang : pane.outputLang;
        const dir = side === 'source' ? pane.sourceDir : pane.outputDir;

        if (pane.markdown) {
            return (
                <div className="tp-scroll tp-scroll-compact dp-markdown" lang={lang} dir={dir}>
                    <ReactMarkdown>{text}</ReactMarkdown>
                </div>
            );
        }

        return (
            <p className="tp-text" lang={lang} dir={dir}>
                {text}
            </p>
        );
    };

    return (
        <div className="pg-breakout pg-breakout-compact">
            <div className="pg-shell">
                <div className="pg-glow" aria-hidden="true" />

                <div className="pg-card">
                    <div className="pg-main">
                        {pane.heading && (
                            <p className="tp-doc-title">
                                {pane.heading}
                                {pane.meta}
                            </p>
                        )}

                        <div className="tp-pair">
                            <section className="tp-pane">
                                <p className="tp-pane-label">{pane.sourceLabel}</p>
                                {body('source')}
                            </section>

                            <section className="tp-pane is-output">
                                <p className="tp-pane-label">
                                    {pane.outputLabel}
                                    {!pane.heading && pane.meta}
                                </p>
                                {body('output')}
                            </section>
                        </div>
                    </div>

                    <aside className="pg-rail">
                        <p className="pg-rail-label">
                            {railLabel} · {items.length}
                        </p>

                        <div className="pg-rail-list pg-rail-scroll">
                            {items.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={`pg-example${activeId === item.id ? ' is-active' : ''}`}
                                    aria-pressed={activeId === item.id}
                                    onClick={() => setActiveId(item.id)}
                                >
                                    <span className="tl-badge" aria-hidden="true" lang={item.badgeLang}>
                                        {item.badge}
                                    </span>
                                    <span className="pg-example-copy">
                                        <span className="pg-example-name">{item.name}</span>
                                        <span className="pg-example-lang">{item.sublabel}</span>
                                    </span>
                                </button>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default MiniTranslatePlayground;
