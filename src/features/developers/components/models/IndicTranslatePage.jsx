import { useCallback, useEffect, useState } from 'react';
import { AlignLeft, ArrowLeftRight, FileCode2, FileText, Sigma, Table2, Type } from 'lucide-react';
import Navbar from '../../../home/components/Navbar';
import Footer from '../../../home/components/Footer';
import ModelHero from './ModelHero';
import MiniTranslatePlayground from './MiniTranslatePlayground';
import Reveal from '../../../../components/Reveal';
import EXAMPLES from '../../data/translateExamples.json';
import { assetUrl } from '../../data/assetUrl';
import { getModelById } from '../../data/models';

const model = getModelById('indic-translate');
const { languages, sentences, romanized, transliteration } = EXAMPLES;
const findLang = (id) => languages.find((l) => l.id === id);

const STATS = [
    { value: '22', label: 'Languages + English' },
    { value: '44', label: 'Directions' },
    { value: '32K', label: 'Token context' },
    { value: '7.94B', label: 'Parameters' },
    { value: model.price.value, label: model.price.label, isPrice: true },
];

// ── One sentence, many scripts ──────────────────────────────────────────────
// A real line from the eval set that was run through nearly every language —
// breadth without listing all 22, and without a form x language grid.
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

// ── Every form, each in a different language ────────────────────────────────
// The model handles every form in every language; pairing each form with a
// different one shows both axes without demoing the whole cross-product.
const DOC_FORMS = [
    { subtype: 'Markdown', langId: 'hindi', icon: FileText },
    { subtype: 'LaTeX', langId: 'tamil', icon: Sigma },
    { subtype: 'Code', langId: 'bengali', icon: FileCode2 },
    { subtype: 'Tables', langId: 'kannada', icon: Table2 },
    { subtype: 'Mixed-language', langId: 'marathi', icon: ArrowLeftRight },
];

const SHORT_FORMS = [
    { label: 'Sentence', langId: 'telugu', icon: AlignLeft, rows: sentences },
    { label: 'Romanized', langId: 'malayalam', icon: Type, rows: romanized },
    { label: 'Transliteration', langId: 'punjabi', icon: ArrowLeftRight, rows: transliteration },
];

const formItems = [
    ...DOC_FORMS.map(({ subtype, langId, icon: Icon }) => ({
        id: subtype,
        badge: <Icon size={16} aria-hidden="true" />,
        name: subtype,
        sublabel: findLang(langId).name,
    })),
    ...SHORT_FORMS.map(({ label, langId, icon: Icon }) => ({
        id: label,
        badge: <Icon size={16} aria-hidden="true" />,
        name: label,
        sublabel: findLang(langId).name,
    })),
];

const IndicTranslatePage = () => {
    // Documents are ~24 KB a language, so they live in /public and each one is
    // fetched the first time its form is opened.
    const [docsByLang, setDocsByLang] = useState({});
    const [activeForm, setActiveForm] = useState(formItems[0].id);

    const docForm = DOC_FORMS.find((f) => f.subtype === activeForm);
    const pendingLang = docForm && docsByLang[docForm.langId] === undefined ? docForm.langId : null;

    useEffect(() => {
        if (!pendingLang) return undefined;

        let cancelled = false;
        const record = (data) => {
            if (!cancelled) setDocsByLang((prev) => ({ ...prev, [pendingLang]: data }));
        };

        fetch(assetUrl(`examples/translate/${pendingLang}.json`))
            .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
            .then(record)
            .catch(() => record([]));

        return () => {
            cancelled = true;
        };
    }, [pendingLang]);

    const renderFormPane = useCallback(
        (item) => {
            const form = DOC_FORMS.find((f) => f.subtype === item.id);
            if (form) {
                const lang = findLang(form.langId);
                const doc = docsByLang[form.langId]?.find((d) => d.subtype === form.subtype);
                if (!doc) {
                    return {
                        loading: true,
                        sourceLabel: 'English source',
                        outputLabel: `${lang.name} output`,
                    };
                }
                return {
                    heading: doc.title,
                    meta: doc.score != null ? <span className="tp-score">{doc.score}/100</span> : null,
                    sourceLabel: 'English source',
                    sourceText: doc.source,
                    outputLabel: `${lang.name} output`,
                    outputText: doc.output,
                    outputLang: lang.tag,
                    outputDir: lang.rtl ? 'rtl' : undefined,
                    markdown: true,
                };
            }

            const short = SHORT_FORMS.find((f) => f.label === item.id);
            const lang = findLang(short.langId);
            const row = short.rows[short.langId]?.[0];
            if (!row) {
                return { loading: true, sourceLabel: 'Source', outputLabel: short.label };
            }

            return {
                sourceLabel:
                    short.label === 'Transliteration' ? row.direction ?? 'Source' : 'English source',
                sourceText: row.source,
                sourceLang: short.label === 'Transliteration' ? lang.tag : 'en',
                outputLabel: `${short.label} · ${lang.name}`,
                meta: (
                    <>
                        {row.score != null && <span className="tp-score">{row.score}</span>}
                        {row.cer != null && <span className="tp-score">CER {row.cer}</span>}
                    </>
                ),
                outputText: row.output,
                outputLang: short.label === 'Romanized' ? 'en' : lang.tag,
                outputDir: short.label === 'Romanized' ? undefined : lang.rtl ? 'rtl' : undefined,
            };
        },
        [docsByLang]
    );

    return (
        <div className="min-h-screen research-page">
            <Navbar />
            <main className="model-page-main">
                <ModelHero
                    eyebrow="Developers · Model"
                    title={model.name}
                    tagline="English and all 22 Eighth Schedule languages, in both directions — with Markdown, LaTeX, code and tables coming out the way they went in."
                    accent="var(--model-violet)"
                    stats={STATS}
                    primaryCta={{ label: 'Hugging Face', href: '#' }}
                    blogCta={model.blog}
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
                    <h2 className="model-section-title">Every form, a different language</h2>
                    <p className="model-section-dek">
                        Five document structures plus sentence, romanized and transliterated output —
                        each shown in a different language.
                    </p>
                    <MiniTranslatePlayground
                        railLabel="Forms"
                        items={formItems}
                        renderPane={renderFormPane}
                        onSelect={setActiveForm}
                    />
                    <p className="model-caption">
                        Unedited model output, greedy decoding. Scores are from an LLM judge.
                    </p>
                </Reveal>
            </main>
            <Footer />
        </div>
    );
};

export default IndicTranslatePage;
