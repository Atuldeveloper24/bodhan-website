import { useEffect, useState } from 'react';
import { AlignLeft, ArrowLeftRight, FileCode2, FileText, Sigma, Table2, Type } from 'lucide-react';
import Navbar from '../../../home/components/Navbar';
import Footer from '../../../home/components/Footer';
import ModelHero from './ModelHero';
import MiniTranslatePlayground from './MiniTranslatePlayground';
import Reveal from '../../../../components/Reveal';
import EXAMPLES from '../../data/translateExamples.json';
import { assetUrl } from '../../data/assetUrl';

const { languages, sentences, romanized, transliteration } = EXAMPLES;
const findLang = (id) => languages.find((l) => l.id === id);

// One real sentence from the eval set that was run through nearly every
// language — a concrete way to show breadth without listing all 22, and
// without the cartesian sprawl of every form x every language.
const MULTI_LANG_SOURCE =
    'Subsequently, to ease the liquidity pressures and safeguard financial stability, the Reserve Bank of India stepped in with a Special Liquidity Facility for MFs (SLF-MF) amounting to 50,000 crores, which helped to restore confidence in the financial markets.';
const MULTI_LANG_SAMPLE_IDS = ['hindi', 'bengali', 'tamil', 'telugu', 'kannada', 'malayalam', 'punjabi', 'urdu'];
const multiLangRows = MULTI_LANG_SAMPLE_IDS.map((id) => {
    const lang = findLang(id);
    const row = sentences[id]?.find((r) => r.source === MULTI_LANG_SOURCE);
    return lang && row ? { lang, row } : null;
}).filter(Boolean);

const multiLangItems = multiLangRows.map(({ lang }) => ({
    id: lang.id,
    badge: lang.native.slice(0, 2),
    badgeLang: lang.tag,
    name: lang.name,
    sublabel: lang.script,
}));

const renderMultiLangPane = (item) => {
    const { lang, row } = multiLangRows.find((r) => r.lang.id === item.id);
    return {
        sourceLabel: 'English source',
        sourceText: MULTI_LANG_SOURCE,
        outputLabel: `${lang.name} output`,
        outputText: row.output,
        outputLang: lang.tag,
        outputDir: lang.rtl ? 'rtl' : undefined,
    };
};

// The flip side: one language, every form the model handles — the five
// document structures plus the three sentence-level modes.
const SPOTLIGHT_LANG_ID = 'hindi';
const spotlightLang = findLang(SPOTLIGHT_LANG_ID);

const DOC_ICONS = {
    Markdown: FileText,
    LaTeX: Sigma,
    Code: FileCode2,
    Tables: Table2,
    'Mixed-language': ArrowLeftRight,
};

const shortRows = [
    { label: 'Sentence', icon: AlignLeft, row: sentences[SPOTLIGHT_LANG_ID]?.[0] },
    { label: 'Romanized', icon: Type, row: romanized[SPOTLIGHT_LANG_ID]?.[0] },
    { label: 'Transliteration', icon: ArrowLeftRight, row: transliteration[SPOTLIGHT_LANG_ID]?.[0] },
].filter((s) => s.row);

const shortItems = shortRows.map(({ label, icon: Icon }) => ({
    id: label,
    badge: <Icon size={16} aria-hidden="true" />,
    name: label,
    sublabel: label === 'Transliteration' ? 'Native → Roman' : `English → ${spotlightLang.name}`,
}));

const STATS = [
    { value: '22', label: 'Languages + English' },
    { value: '44', label: 'Directions' },
    { value: '32K', label: 'Token context' },
    { value: '7.94B', label: 'Parameters' },
];

const IndicTranslatePage = () => {
    // Documents are ~24 KB per language, so they live in /public and are
    // fetched once rather than bundled with the page.
    const [docs, setDocs] = useState([]);

    useEffect(() => {
        let cancelled = false;
        fetch(assetUrl(`examples/translate/${SPOTLIGHT_LANG_ID}.json`))
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
            .then((data) => {
                if (!cancelled) setDocs(data);
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, []);

    const docItems = (docs.length > 0 ? docs : Object.keys(DOC_ICONS).map((subtype) => ({ subtype }))).map((doc) => {
        const Icon = DOC_ICONS[doc.subtype] ?? FileText;
        return {
            id: doc.subtype,
            badge: <Icon size={16} aria-hidden="true" />,
            name: doc.subtype,
            sublabel: 'Document',
        };
    });

    const formItems = [...docItems, ...shortItems];

    const renderFormPane = (item) => {
        const doc = docs.find((d) => d.subtype === item.id);
        if (doc) {
            return {
                heading: doc.title,
                meta: doc.score != null ? <span className="tp-score">{doc.score}/100</span> : null,
                sourceLabel: 'English source',
                sourceText: doc.source,
                outputLabel: `${spotlightLang.name} output`,
                outputText: doc.output,
                outputLang: spotlightLang.tag,
                markdown: true,
            };
        }

        const short = shortRows.find((r) => r.label === item.id);
        if (!short) {
            return { loading: true, sourceLabel: 'English source', outputLabel: `${spotlightLang.name} output` };
        }

        const { label, row } = short;
        return {
            sourceLabel: label === 'Transliteration' ? row.direction ?? 'Source' : 'English source',
            sourceText: row.source,
            outputLabel: label,
            meta: (
                <>
                    {row.score != null && <span className="tp-score">{row.score}</span>}
                    {row.cer != null && <span className="tp-score">CER {row.cer}</span>}
                </>
            ),
            outputText: row.output,
            outputLang: label === 'Romanized' ? 'en' : spotlightLang.tag,
        };
    };

    return (
        <div className="min-h-screen research-page">
            <Navbar />
            <main className="model-page-main">
                <ModelHero
                    eyebrow="Developers · Model"
                    title="Translate whole documents, not just sentences"
                    display
                    tagline="English and all 22 Eighth Schedule languages, in both directions — with Markdown, LaTeX, code and tables coming out the way they went in."
                    accent="var(--model-violet)"
                    specs={[
                        { label: 'Directions', value: '44' },
                        { label: 'Parameters', value: '7.94B' },
                        { label: 'Context', value: '32K tokens' },
                    ]}
                    primaryCta={{ label: 'Hugging Face', href: '#' }}
                    secondaryCta={{ label: 'Contact', href: '/contact' }}
                />

                <Reveal as="section" className="model-section">
                    <h2 className="model-section-title">One sentence, eight scripts</h2>
                    <p className="model-section-dek">
                        The same source line, translated independently — pick a language.
                    </p>
                    <MiniTranslatePlayground
                        railLabel="Languages"
                        items={multiLangItems}
                        renderPane={renderMultiLangPane}
                    />
                </Reveal>

                <Reveal as="section" className="model-section">
                    <h2 className="model-section-title">One language, every form</h2>
                    <p className="model-section-dek">
                        {spotlightLang.name} across all of it — five document structures, plus sentence,
                        romanized and transliterated output.
                    </p>
                    <MiniTranslatePlayground railLabel="Forms" items={formItems} renderPane={renderFormPane} />
                    <p className="model-caption">
                        Unedited model output, greedy decoding. Scores are from an LLM judge.
                    </p>
                </Reveal>

                <Reveal as="section" className="model-section">
                    <div className="stat-band">
                        {STATS.map((s, i) => (
                            <Reveal key={s.label} className="stat-band-item" delay={i * 0.08}>
                                <p className="stat-band-value">{s.value}</p>
                                <p className="stat-band-label">{s.label}</p>
                            </Reveal>
                        ))}
                    </div>
                </Reveal>
            </main>
            <Footer />
        </div>
    );
};

export default IndicTranslatePage;
