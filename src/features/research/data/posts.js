export const researchAreas = [
    {
        title: 'Speech & Audio',
        description:
            'Multilingual ASR, child speech diagnostics, and voice-first interfaces for Indian languages and dialects.',
    },
    {
        title: 'Language & Literacy',
        description:
            'Pedagogy-aligned language models, code-mixed transcription, and foundational literacy tools.',
    },
    {
        title: 'Vision & Assessment',
        description:
            'Handwritten OCR, diagram understanding, and automated assessment for classroom workflows.',
    },
    {
        title: 'Learning Systems',
        description:
            'Adaptive tutoring, evidence generation, and AI systems designed for public education deployment.',
    },
];

export const posts = [
    {
        slug: 'bodhan-asr',
        title: "Bodhan ASR: Accurate Speech Recognition for India's Languages and Dialects",
        category: 'Publication',
        date: '2026-06-30',
        summary:
            'Introducing Bodhan Scribe — a 1.2B-parameter multilingual ASR model trained on 1.35M hours of speech, supporting 25 Indian languages with native-script, code-mixed, and romanized transcription.',
        featured: true,
        heroSummary:
            "Today we're releasing Bodhan Scribe, a 1.2B-parameter multilingual automatic speech recognition model trained on over 1.35 million hours of speech that supports 25 Indian languages, multiple transcription formats, and production-ready streaming and offline inference.",
        heroLinks: [
            { label: 'Hugging Face', href: 'https://huggingface.co/bodhan-ai/models' },
            { label: 'GitHub', href: '#' },
            { label: 'Paper', href: '#' },
            { label: 'Demo', href: 'https://value-candidates-oakland-capitol.trycloudflare.com' },
            { label: 'Model Card', href: '#' },
            { label: 'Documentation', href: '#' },
        ],
        specs: [
            { label: 'Languages', value: '25' },
            { label: 'Training Hours', value: '1.35M' },
            { label: 'Parameters', value: '1.2B' },
            { label: 'Architecture', value: 'NVIDIA Canary' },
            { label: 'Native Script', value: '✓' },
            { label: 'Code Mixed', value: '✓' },
            { label: 'Romanized', value: '✓' },
            { label: 'Streaming', value: '✓' },
            { label: 'Offline', value: '✓' },
        ],
        sections: [
            {
                id: 'why-asr',
                title: 'Why Another ASR Model?',
                content: [
                    'India has many languages. Existing ASR systems perform well only on **high-resource languages**. Dialects remain underserved. *Code-mixed speech* is common. Production systems need **low latency**.',
                    'Bodhan ASR was built to address these challenges in a **single multilingual model**.',
                ],
                bullets: [
                    'India has many languages with significant dialectal variation.',
                    'Existing ASR systems perform well only on high-resource languages.',
                    'Dialects and low-resource languages remain underserved.',
                    'Code-mixed speech is common in everyday conversation.',
                    'Production systems need low latency and reliable streaming.',
                ],
            },
            {
                id: 'meet-bodhan-asr',
                title: 'Meet Bodhan ASR',
                content: [
                    'Bodhan Scribe is a single multilingual model that supports **22 constitutional languages**, Indian English, Bhojpuri, and Bhili.',
                    'Instead of training separate models per language, Bodhan Scribe learns a *unified multilingual representation* — enabling consistent quality across India\'s linguistic diversity.',
                ],
                bullets: [
                    '22 constitutional languages',
                    'Indian English',
                    'Bhojpuri',
                    'Bhili',
                ],
            },
            {
                id: 'key-features',
                title: 'Key Features',
                subsections: [
                    {
                        title: 'Supports 25 Indian Languages',
                        content:
                            'Broad coverage across constitutional languages and underserved dialects, designed for *real-world Indian speech patterns*.',
                    },
                    {
                        title: 'Three Output Modes',
                        content: 'The same audio can be transcribed in three formats:',
                        examples: [
                            {
                                label: 'Audio',
                                text: '"Kal meeting hai at 5 PM"',
                            },
                            {
                                label: 'Native',
                                text: 'कल मीटिंग है एट 5 पीएम',
                            },
                            {
                                label: 'Code Mixed',
                                text: 'कल meeting hai at 5 PM',
                            },
                            {
                                label: 'Romanized',
                                text: 'Kal meeting hai at 5 PM',
                            },
                        ],
                    },
                    {
                        title: 'Low Resource Language Support',
                        content:
                            'Bhili receives **dedicated support** despite limited public datasets — a critical gap in existing ASR systems for India.',
                    },
                    {
                        title: 'Production Ready',
                        content: 'Built for deployment from day one.',
                        bullets: ['Offline inference', 'Streaming', 'TensorRT acceleration', 'Batched inference'],
                    },
                ],
            },
            {
                id: 'under-the-hood',
                title: 'Under the Hood',
                content: [
                    'Bodhan Scribe is built on the NVIDIA Canary architecture with a 600M-parameter encoder and 600M-parameter decoder.',
                ],
                bullets: [
                    '32-layer Conformer encoder',
                    '24-layer Transformer decoder',
                    '6K vocabulary',
                    'NVIDIA Canary architecture',
                ],
            },
            {
                id: 'training-data',
                title: 'Training Data',
                content: [
                    'Bodhan Scribe was trained on 1.35 million hours of speech data — one of the largest multilingual ASR training corpora for Indian languages.',
                    'Instead of memorizing frequent words, synthetic speech exposes the model to much larger vocabulary and pronunciation diversity.',
                ],
                stats: [
                    { label: 'Weak / synthetic', value: '1.30M hours' },
                    { label: 'Zero-shot TTS synthetic', value: '40K hours' },
                    { label: 'Human labeled', value: '11K hours' },
                ],
                charts: ['training-breakdown'],
            },
            {
                id: 'evaluation',
                title: 'Evaluation',
                content: [
                    'We evaluate Bodhan ASR across multiple public benchmarks spanning conversational speech, read speech, low-resource languages, and multilingual scenarios.',
                ],
                table: {
                    headers: ['Benchmark', 'Measures'],
                    rows: [
                        ['Voice of India', 'General multilingual'],
                        ['Svarah', 'Conversation'],
                        ['Lahaja', 'Dialects'],
                        ['Sruti', 'Read speech'],
                        ['LibriSpeech', 'English'],
                    ],
                },
                experiment: 'wer-playground',
                subsections: [
                    {
                        title: 'Voice of India',
                        content: 'Evaluated across WER metrics with competitive scores on multilingual Indian speech.',
                        charts: ['overall-wer'],
                    },
                    {
                        title: 'Low Resource Languages',
                        content:
                            'Bhili deserves dedicated evaluation — demonstrating that low-resource languages can achieve practical accuracy with targeted training data.',
                        charts: ['vistaar-cer'],
                    },
                    {
                        title: 'Cross Benchmark Generalization',
                        content: 'Strong performance across Svarah, Lahaja, Sruti, and LibriSpeech demonstrates robust generalization.',
                        charts: ['speaker-consistency'],
                    },
                    {
                        title: 'Hard Benchmarks',
                        content:
                            'Evaluation on IndicContextEval, FLEURS, Common Voice, MMS, IndicSUPERB, and OpenASR Leaderboards demonstrates robustness across diverse conditions.',
                    },
                ],
            },
            {
                id: 'real-examples',
                title: 'Real Examples',
                content: [
                    'Hard examples from YouTube sets, benchmark sets, and challenging real-world audio demonstrate Bodhan Scribe\'s practical performance on the speech patterns users actually encounter.',
                    'Try the interactive demo below — Bodhan ASR transcribing Indian English across 19 mother-tongue accents from the Svarah benchmark, spoken by real people from across India.',
                ],
                demo: {
                    title: 'One Model. Every Mother Tongue.',
                    description:
                        'A live tour of speakers from the Svarah benchmark — watch Bodhan ASR transcribe Indian English across 19 accents as each speaker\'s home region lights up on the map.',
                    url: 'https://value-candidates-oakland-capitol.trycloudflare.com',
                    height: 680,
                },
            },
            {
                id: 'inference-performance',
                title: 'Inference Performance',
                content: ['Bodhan Scribe is optimized for both research experimentation and production deployment.'],
                experiment: 'streaming-timeline',
                subsectionLayout: 'cards',
                subsections: [
                    {
                        title: 'Offline Inference',
                        content: 'Audio → Model → Transcript. Simple, reliable batch processing for recorded speech.',
                    },
                    {
                        title: 'Batched TensorRT',
                        content: 'Optimized throughput with configurable batch sizes for high-volume deployment scenarios.',
                    },
                    {
                        title: 'Streaming',
                        content:
                            'Audio chunks arrive incrementally, producing partial transcripts in real time before the final transcript is assembled.',
                    },
                    {
                        title: 'Latency',
                        content:
                            'Performance trade-offs between latency, batch size, sequence length, and accuracy are documented for deployment planning.',
                    },
                ],
            },
            {
                id: 'model-card',
                title: 'Model Card',
                content: ['Technical specifications and usage details for Bodhan Scribe.'],
                table: {
                    headers: ['Specification', 'Value'],
                    rows: [
                        ['Languages', '25'],
                        ['Training Hours', '1.35M'],
                        ['Parameters', '1.2B'],
                        ['Architecture', 'NVIDIA Canary'],
                        ['Native Script', '✓'],
                        ['Code Mixed', '✓'],
                        ['Romanized', '✓'],
                        ['Streaming', '✓'],
                        ['Offline', '✓'],
                    ],
                },
                bullets: [
                    'Architecture: NVIDIA Canary (600M encoder + 600M decoder)',
                    'Languages: 25 Indian languages',
                    'Parameters: 1.2B',
                    'Supported modes: Native script, code-mixed, romanized',
                    'Inference: Offline, streaming, TensorRT, batched',
                ],
            },
            {
                id: 'limitations',
                title: 'Limitations',
                content: ['Transparent limitations build trust and set appropriate expectations.'],
                bullets: [
                    'Extremely noisy environments remain challenging.',
                    'Rare dialects continue to improve with more data.',
                    'Domain-specific vocabulary may require adaptation.',
                    'Long recordings benefit from chunked inference.',
                ],
            },
            {
                id: 'getting-started',
                title: 'Getting Started',
                content: ['Reach your first transcription within 30 seconds.'],
                code: [
                    'pip install bodhan',
                    'from bodhan import Scribe',
                ],
                bullets: [
                    'Streaming inference',
                    'Batch inference',
                    'TensorRT acceleration',
                    'Different output modes',
                    'Language forcing',
                    'Chunking for long audio',
                ],
            },
            {
                id: 'closing',
                title: 'Closing',
                content: [
                    'Bodhan ASR brings multilingual speech recognition to 25 Indian languages, including underserved languages such as Bhili, while supporting native-script, code-mixed, and romanized transcription. With large-scale multilingual training, production-ready inference, and strong performance across public benchmarks, it provides a practical foundation for building speech applications across India\'s linguistic diversity.',
                ],
                links: [
                    { label: 'Contact', href: '/contact' },
                ],
            },
        ],
    },
];

export function getPostBySlug(slug) {
    return posts.find((post) => post.slug === slug);
}

export function getFeaturedPost() {
    return posts.find((post) => post.featured) ?? posts[0];
}

export function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}
