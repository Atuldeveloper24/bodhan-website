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
        href: '/developers/indic-speak',
    },
    {
        id: 'indic-doc-parser',
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
