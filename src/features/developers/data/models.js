export const models = [
    {
        id: 'indic-transcribe',
        dot: { x: 42.3, y: 48.3, filled: false, part: 'wing', side: 'left' },
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
        href: '/developers/indic-transcribe',
    },
    {
        id: 'indic-speak',
        dot: { x: 53.3, y: 18.8, filled: true, part: 'head', side: 'left' },
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
        href: '/developers/indic-speak',
    },
    {
        id: 'indic-doc-parser',
        dot: { x: 46.9, y: 84.5, filled: false, part: 'foot', side: 'right' },
        name: 'IndicDocParser',
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
        href: '/developers/indic-doc-parser',
    },
    {
        id: 'indic-translate',
        dot: { x: 75.0, y: 73.1, filled: false, part: 'body', side: 'right' },
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
        href: '/developers/indic-translate',
    },
];

export function getModelById(id) {
    return models.find((model) => model.id === id);
}
