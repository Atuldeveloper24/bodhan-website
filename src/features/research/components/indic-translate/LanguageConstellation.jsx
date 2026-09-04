import {
    useEffect,
    useId,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
    useSyncExternalStore,
} from 'react';
import {
    canAnimate,
    gsap,
    prefersReducedMotion,
    refreshTriggers,
    useGsapAnimation,
} from '../../../../utils/motion';
import { LANGS, LANG_ABBR, LANG_CODE } from '../../data/indic-translate/evals';

/**
 * Linguistic coverage: all 22 languages as a constellation of script glyphs, each
 * opening its own real translation example.
 *
 * This is deliberately per-language rather than a map of India. The examples are keyed
 * by language, not by state; no state-boundary asset exists in this repo; and a
 * language-to-state mapping would be a contestable claim — Hindi, Urdu, Sanskrit,
 * Sindhi and Konkani have no single home state, and Assam and Jammu & Kashmir would
 * each carry two of these languages.
 *
 * The interaction follows the house pattern in ArchitectureDiagram: a sticky `active`
 * plus a transient `hover` derived into one highlight, a real <button> per language,
 * and one shared detail panel that every button points at with aria-describedby.
 * Keyboard focus selects, so the panel is reachable without a pointer, and an sr-only
 * list carries the same content in prose.
 */

// One initial per language, in that language's own script. Keying the glyph off the
// script instead would print 'अ' nine times, since nine of the 22 use Devanagari.
const GLYPH = {
    Assamese: 'অ',
    Bengali: 'বা',
    Bodo: 'बड़',
    Dogri: 'डो',
    Gujarati: 'ગુ',
    Hindi: 'हि',
    Kannada: 'ಕ',
    Kashmiri: 'کٲ',
    Konkani: 'को',
    Maithili: 'मै',
    Malayalam: 'മ',
    Manipuri: 'ꯃ',
    Marathi: 'म',
    Nepali: 'ने',
    Odia: 'ଓ',
    Punjabi: 'ਪੰ',
    Sanskrit: 'सं',
    Santali: 'ᱥ',
    Sindhi: 'सि',
    Tamil: 'த',
    Telugu: 'తె',
    Urdu: 'اُ',
};

// Two concentric ellipses, so 22 markers spread without hand-written per-marker
// rules. Percentages, because the orbit layer is inset: 0.
//
// Each marker carries its language name, not just a glyph — 22 unfamiliar scripts
// with no labels is a guessing game. Named markers are wide, so the rings are set
// wide and the counts split to keep the labels from colliding.
const RINGS = [
    { count: 13, rx: 39, ry: 40 },
    { count: 9, rx: 19.5, ry: 19.5 },
];

const layout = () => {
    const spots = [];
    let i = 0;
    for (const [ring, { count, rx, ry }] of RINGS.entries()) {
        // Offset the inner ring by half a step so markers do not line up radially.
        const phase = ring * (Math.PI / count);
        for (let n = 0; n < count && i < LANGS.length; n += 1, i += 1) {
            const t = phase + (n / count) * Math.PI * 2 - Math.PI / 2;
            spots.push({
                lang: LANGS[i],
                left: 50 + Math.cos(t) * rx,
                top: 50 + Math.sin(t) * ry,
                ring,
            });
        }
    }
    return spots;
};

/**
 * Below this width the ring collapses to a wrapped grid: 22 named markers cannot
 * be spread around an ellipse in a phone-width column without colliding, and a
 * grid of the same buttons reads better than an unreadable orbit.
 */
const COMPACT_QUERY = '(max-width: 700px)';

const compactQuery = () => window.matchMedia(COMPACT_QUERY);

const subscribeToWidth = (onChange) => {
    const query = compactQuery();
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
};

const useCompactLayout = () =>
    useSyncExternalStore(
        subscribeToWidth,
        () => compactQuery().matches,
        () => false
    );

const LanguageConstellation = () => {
    const [data, setData] = useState(null);
    const [active, setActive] = useState('Hindi');
    const [hover, setHover] = useState(null);
    const compact = useCompactLayout();
    const panelId = useId();
    const narrationId = useId();
    const spots = useMemo(layout, []);
    const rootRef = useRef(null);
    const linesRef = useRef(null);

    // The demo data is ~650 KB of recorded output shared with the model page, so it
    // loads on its own chunk rather than on the article's critical path.
    useEffect(() => {
        let live = true;
        import('../../../developers/components/models/indic-translate/translateExamples.json').then(
            (module) => {
                if (!live) return;
                setData(module.default);
                // The detail panel below grows by several hundred pixels once the
                // examples land, which moves every trigger under it.
                refreshTriggers();
            }
        );
        return () => {
            live = false;
        };
    }, []);

    // The whole field arrives as one gesture: the centre count first, then the
    // glyphs blooming outward from it in ring order.
    useGsapAnimation(
        (root) => {
            gsap.from('.itb-orbit-centre', {
                scale: 0.72,
                opacity: 0,
                duration: 0.7,
                ease: 'back.out(1.8)',
                scrollTrigger: { trigger: root, start: 'top 82%', once: true },
            });

            gsap.from('.itb-glyph', {
                scale: 0.4,
                opacity: 0,
                duration: 0.62,
                ease: 'back.out(1.6)',
                // Out from the middle of the field rather than in DOM order, so the
                // ring reads as one expanding motion.
                stagger: { each: 0.028, from: 'center', grid: 'auto' },
                scrollTrigger: { trigger: root, start: 'top 82%', once: true },
            });
        },
        rootRef,
        []
    );

    // Switching language swaps two lines of text in place. Without a beat of motion
    // the change is easy to miss on a page this dense.
    useLayoutEffect(() => {
        const node = linesRef.current;
        if (!node || !data || prefersReducedMotion()) return undefined;
        // Unguarded on purpose: this one is a `fromTo` on content that is already
        // on screen, so the worst a suspended ticker can do is skip the flourish.
        // It still needs the end state written, which `fromTo` does immediately.
        const tween = gsap.fromTo(
            node.children,
            { y: 8, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.42, stagger: 0.07, ease: 'power2.out', overwrite: true }
        );
        if (!canAnimate()) tween.progress(1);
        return () => tween.kill();
    }, [active, data]);

    const highlight = hover ?? active;
    const entry = data?.[active];
    const item = entry?.sentence?.[0];

    return (
        <div className="itb-constellation" ref={rootRef}>
            <p id={narrationId} className="sr-only">
                All 22 languages of the Eighth Schedule, across 12 scripts. Select a language to
                read one of its translations.
            </p>

            <div
                className={`itb-orbit-field${compact ? ' is-compact' : ''}`}
                aria-labelledby={narrationId}
            >
                {!compact && (
                    <div className="itb-orbit-rings" aria-hidden="true">
                        <span className="itb-orbit-ring is-outer" />
                        <span className="itb-orbit-ring is-inner" />
                    </div>
                )}

                <p className="itb-orbit-centre" aria-hidden="true">
                    <span className="itb-orbit-count">22</span>
                    <span className="itb-orbit-count-label">languages · 12 scripts</span>
                </p>

                <div className="itb-orbit">
                    {spots.map(({ lang, left, top, ring }, i) => (
                        <button
                            key={lang}
                            type="button"
                            className={`itb-glyph${lang === active ? ' is-active' : ''}${
                                lang === highlight ? ' is-highlight' : ''
                            }`}
                            style={
                                compact
                                    ? undefined
                                    : {
                                          left: `${left}%`,
                                          top: `${top}%`,
                                          animationDelay: `${(i % 7) * 0.42 + ring * 0.2}s`,
                                      }
                            }
                            aria-pressed={lang === active}
                            aria-describedby={panelId}
                            aria-label={`${lang}, ${LANG_ABBR[lang]}`}
                            data-len={GLYPH[lang].length}
                            onClick={() => setActive(lang)}
                            onFocus={() => setActive(lang)}
                            onMouseEnter={() => setHover(lang)}
                            onMouseLeave={() => setHover(null)}
                        >
                            <span className="itb-glyph-mark" lang={LANG_CODE[lang]} aria-hidden="true">
                                {GLYPH[lang]}
                            </span>
                            <span className="itb-glyph-name">{lang}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div id={panelId} className="itb-detail" tabIndex={-1}>
                <div className="itb-detail-head">
                    <p className="itb-detail-kicker">Selected language</p>
                    <p className="itb-detail-title">
                        {active}
                        {entry && <span className="itb-detail-script">{entry.script}</span>}
                    </p>
                </div>

                {item ? (
                    <div className="itb-detail-lines" ref={linesRef}>
                        <div className="itb-line">
                            <span className="itb-line-tag">EN</span>
                            <p lang="en">{item.en}</p>
                        </div>
                        <div className="itb-line is-out">
                            <span className="itb-line-tag">{LANG_ABBR[active]}</span>
                            <p lang={LANG_CODE[active]} dir={entry.rtl ? 'rtl' : undefined}>
                                {item.out}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="itb-detail-loading">Loading recorded examples…</p>
                )}
            </div>

            {/* The constellation must not be the only way to read this. */}
            <ul className="sr-only">
                {LANGS.map((lang) => (
                    <li key={lang}>
                        {lang} ({LANG_ABBR[lang]}), {data?.[lang]?.script ?? 'script loading'}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LanguageConstellation;
