import Navbar from '../../../home/components/Navbar';
import Footer from '../../../home/components/Footer';
import ModelHero from './ModelHero';
import TranscribeExamples from './TranscribeExamples';
import Reveal from '../../../../components/Reveal';

// What each output mode is actually for — the samples above switch between them.
const OUTPUT_MODES = [
    {
        subtype: 'Native script',
        detail: 'Everything in the language’s own script, numbers spelled out as spoken.',
    },
    {
        subtype: 'Mixed script',
        detail: 'English terms stay in Latin and numbers become digits, the way people write.',
    },
    {
        subtype: 'Romanized',
        detail: 'The whole transcript in Latin letters, for search and keyboard-free input.',
    },
];

const CONDITIONS = [
    { subtype: 'Code-switching', detail: 'Speakers moving between a regional language and English mid-sentence.' },
    { subtype: 'Numbers', detail: 'Account numbers and quantities, spoken fast and without pauses.' },
    { subtype: 'Sung audio', detail: 'Vocals over instrumentation, where the melody stretches the words.' },
    { subtype: 'Child speakers', detail: 'Higher pitch and less regular articulation than adult speech.' },
    { subtype: 'Accented English', detail: 'English carrying the prosody of an Indian first language.' },
    { subtype: 'Scripted recitation', detail: 'Metrical Sanskrit and classical Tamil verse.' },
];

const STATS = [
    { value: '27', label: 'Languages' },
    { value: '3', label: 'Output modes' },
    { value: '1.2B', label: 'Parameters' },
    { value: '1.35M', label: 'Hours of speech' },
];

const IndicTranscribePage = () => (
    <div className="min-h-screen research-page">
        <Navbar />
        <main className="model-page-main">
            <ModelHero
                eyebrow="Developers · Model"
                title="Every word, in 27 Indian languages"
                display
                tagline="Speech in — native script, mixed script, or romanized text out. Built for classrooms, call centres and code-mixed conversation."
                accent="var(--model-emerald)"
                specs={[
                    { label: 'Languages', value: '27' },
                    { label: 'Parameters', value: '1.2B' },
                    { label: 'Output modes', value: '3' },
                ]}
                primaryCta={{ label: 'Hugging Face', href: '#' }}
                secondaryCta={{ label: 'Contact', href: '/contact' }}
            />

            <Reveal as="section" className="model-section">
                <TranscribeExamples />
                <p className="model-caption">
                    Real audio, unedited model output in all three transcription modes.
                </p>
            </Reveal>

            <Reveal as="section" className="model-section">
                <h2 className="model-section-title">Same audio, three ways to write it</h2>
                <p className="model-section-dek">
                    Indian speech is rarely single-script. Every transcript comes back in whichever
                    convention your product actually needs.
                </p>
                <div className="feat-grid">
                    {OUTPUT_MODES.map((m, i) => (
                        <Reveal as="article" key={m.subtype} className="feat-card" delay={i * 0.07}>
                            <p className="feat-card-title">{m.subtype}</p>
                            <p className="feat-card-detail">{m.detail}</p>
                        </Reveal>
                    ))}
                </div>
            </Reveal>

            <Reveal as="section" className="model-section">
                <h2 className="model-section-title">Tested on the hard cases</h2>
                <p className="model-section-dek">
                    The samples above are deliberately awkward — the conditions real audio actually
                    arrives in.
                </p>
                <div className="feat-grid">
                    {CONDITIONS.map((c, i) => (
                        <Reveal as="article" key={c.subtype} className="feat-card" delay={i * 0.07}>
                            <p className="feat-card-title">{c.subtype}</p>
                            <p className="feat-card-detail">{c.detail}</p>
                        </Reveal>
                    ))}
                </div>
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

export default IndicTranscribePage;
