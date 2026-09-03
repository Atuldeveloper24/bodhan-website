// ⚠️ PRICING IS PLACEHOLDER — every `price` below is a stand-in so the hero
// band has something to show. Replace each value with the real published rate
// before this goes live; the console at console.bodhan.ai is the source of truth.
export const models = [
    {
        id: 'indic-transcribe',
        name: 'Indic-Transcribe',
        codename: 'Speech to Text',
        icon: 'mic',
        accent: 'var(--model-emerald)',
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
        accent: 'var(--brand-blue)',
        tagline: 'Text-to-speech for 22 Indian languages, built for the classroom',
        summary:
            'A voice engine that reads STEM content and code-mixed sentences the way a teacher would — with multiple voices per language.',
        specs: [
            { label: 'Languages', value: '22 + English' },
            { label: 'Voices', value: 'Multiple / language' },
            { label: 'Response time', value: '~200 ms' },
        ],
        price: { value: '₹90', label: 'per 1M characters' },
        blog: { label: 'Read the blog', href: '/research/blog' },
        href: '/developers/indic-speak',
    },
    {
        id: 'indic-ocr',
        name: 'Indic-OCR',
        codename: 'Document Digitisation',
        icon: 'document',
        accent: 'var(--text-orange-500)',
        tagline: 'Document parsing for English and 22 Indian languages',
        summary:
            'Layout detection with reading order, then block-level OCR — for printed and handwritten pages, with math as LaTeX and tables as HTML.',
        specs: [
            { label: 'Languages', value: '22 + English' },
            { label: 'Layout labels', value: '37' },
            { label: 'Parameters', value: '33M + 0.8B' },
        ],
        price: { value: '₹40', label: 'per 1,000 pages' },
        blog: { label: 'Read the blog', href: '/research/blog' },
        href: '/developers/indic-ocr',
    },
    {
        id: 'indic-translate',
        name: 'Indic-Translate',
        codename: 'Translation',
        icon: 'languages',
        accent: 'var(--model-violet)',
        tagline: 'Document-length translation across 44 language directions',
        summary:
            'Translates between English and all 22 Eighth Schedule languages, preserving Markdown, LaTeX, and table structure — plus romanized and code-mixed text.',
        specs: [
            { label: 'Directions', value: '44' },
            { label: 'Parameters', value: '7.94B' },
            { label: 'Context', value: '32K tokens' },
        ],
        price: { value: '₹60', label: 'per 1M characters' },
        blog: { label: 'Read the blog', href: '/research/blog' },
        href: '/developers/indic-translate',
    },
];

export function getModelById(id) {
    return models.find((model) => model.id === id);
}
