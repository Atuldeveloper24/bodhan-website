// ⚠️ TEMPORARY BLOG URLS — these are Cloudflare quick-tunnel addresses for the
// posts as they stand today. They die when the tunnel does; swap each for its
// permanent home (or an on-site /research/<slug>) once published.
const BLOGS = {
    speak: 'https://commented-millions-gave-association.trycloudflare.com/indic-speak.html',
    ocr: 'https://dow-dual-chem-tutorial.trycloudflare.com/',
    translate: 'https://amended-comfort-recognized-hearts.trycloudflare.com/',
};

// One palette for the whole developer section: the site's primary warm
// gradient. Each model used to carry a colour of its own — emerald, blue,
// orange, violet — which read as four separate products rather than one
// family. Spread into every model, so `model.accent` / `model.gradient` /
// `model.viz` still resolve everywhere they are read.
//
// `viz` is the plain-hex pair, because an SVG gradient stop cannot take a CSS
// gradient or a var().
const PRIMARY = {
    accent: 'var(--text-orange-500)',
    gradient: 'linear-gradient(135deg, #E2691F 0%, #C2410C 52%, #A6410A 100%)',
    viz: { from: '#E2691F', to: '#B45309' },
};

// ⚠️ PRICING IS PLACEHOLDER — every `price` below is a stand-in so the hero
// band has something to show. Replace each value with the real published rate
// before this goes live; the console at console.bodhan.ai is the source of truth.
export const models = [
    {
        id: 'indic-transcribe',
        name: 'Indic-Transcribe',
        codename: 'Speech to Text',
        icon: 'mic',
        glyph: 'wave',
        ...PRIMARY,
        tagline: 'Speech recognition for 27 Indian languages',
        summary:
            'Robust multilingual ASR with native-script, mixed-script, and romanized output, plus built-in language identification.',
        specs: [
            { label: 'Languages', value: '27' },
            { label: 'Parameters', value: '1.2B' },
            { label: 'Output modes', value: '3' },
        ],
        price: { value: '₹30', label: 'per audio hour' },
        blog: { label: 'Read the ASR post', href: '/research/bodhan-asr' },
        href: '/developers/indic-transcribe',
    },
    {
        id: 'indic-speak',
        name: 'Indic-Speak',
        codename: 'Text to Speech',
        icon: 'speaker',
        glyph: 'voice',
        ...PRIMARY,
        tagline: 'Text-to-speech for 22 Indian languages, built for the classroom',
        summary:
            'A voice engine that reads STEM content and code-mixed sentences the way a teacher would — with multiple voices per language.',
        specs: [
            { label: 'Languages', value: '22 + English' },
            { label: 'Voices', value: 'Multiple / language' },
            { label: 'Response time', value: '~200 ms' },
        ],
        price: { value: '₹90', label: 'per 1M characters' },
        blog: { label: 'Read the blog', href: BLOGS.speak },
        href: '/developers/indic-speak',
    },
    {
        id: 'indic-ocr',
        name: 'Indic-OCR',
        codename: 'Document Digitisation',
        icon: 'document',
        glyph: 'page',
        ...PRIMARY,
        tagline: 'Document parsing for English and 22 Indian languages',
        summary:
            'Layout detection with reading order, then block-level OCR — for printed and handwritten pages, with math as LaTeX and tables as HTML.',
        specs: [
            { label: 'Languages', value: '22 + English' },
            { label: 'Layout labels', value: '37' },
            { label: 'Parameters', value: '33M + 0.8B' },
        ],
        price: { value: '₹40', label: 'per 1,000 pages' },
        blog: { label: 'Read the blog', href: BLOGS.ocr },
        href: '/developers/indic-ocr',
    },
    {
        id: 'indic-translate',
        name: 'Indic-Translate',
        codename: 'Translation',
        icon: 'languages',
        glyph: 'bridge',
        ...PRIMARY,
        tagline: 'Document-length translation across 44 language directions',
        summary:
            'Translates between English and all 22 Eighth Schedule languages, preserving Markdown, LaTeX, and table structure — plus romanized and code-mixed text.',
        specs: [
            { label: 'Directions', value: '44' },
            { label: 'Parameters', value: '7.94B' },
            { label: 'Context', value: '32K tokens' },
        ],
        price: { value: '₹60', label: 'per 1M characters' },
        blog: { label: 'Read the blog', href: BLOGS.translate },
        href: '/developers/indic-translate',
    },
];

export function getModelById(id) {
    return models.find((model) => model.id === id);
}
