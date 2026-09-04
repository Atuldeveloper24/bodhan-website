import Navbar from '../../../home/components/Navbar';
import Footer from '../../../home/components/Footer';
import ModelHero from './ModelHero';
import TranscribeExamples from './TranscribeExamples';
import DevReveal from '../DevReveal';
import { getModelById } from '../../data/models';
import '../../developers.css';

const model = getModelById('indic-transcribe');

const STATS = [
    { value: '27', label: 'Languages' },
    { value: '3', label: 'Output modes' },
    { value: '1.2B', label: 'Parameters' },
    { value: '1.35M', label: 'Hours of speech' },
    { value: model.price.value, label: model.price.label, isPrice: true },
];

// Names only for now — what separates them is still to be written.
const VARIANTS = ['Flex', 'Core'];

const IndicTranscribePage = () => (
    <div className="min-h-screen research-page">
        <Navbar />
        <main
            className="model-page-main"
            style={{ '--model-accent': model.accent, '--model-gradient': model.gradient }}
        >
            <ModelHero
                eyebrow="Developers · Model"
                title={model.name}
                intro="wave"
                tagline="Speech in — native script, mixed script, or romanized text out. Built for classrooms, call centres and code-mixed conversation."
                accent={model.accent}
                viz={model.viz}
                stats={STATS}
                primaryCta={{ label: 'Hugging Face', href: '#' }}
                blogCta={model.blog}
                secondaryCta={{ label: 'Contact', href: '/contact' }}
            />

            <DevReveal as="div" className="model-variants">
                <span className="model-variants-label">Variants</span>
                {VARIANTS.map((name) => (
                    <span key={name} className="model-variant">
                        {name}
                    </span>
                ))}
            </DevReveal>

            <DevReveal as="section" className="model-section">
                <h2 className="model-section-title">Hear it transcribe</h2>
                <p className="model-section-dek">
                    Three recordings in three languages, each with the language identified on the
                    way in. Press play — the transcript is written as the audio runs, and the same
                    audio can come back in native script, mixed script, or romanized.
                </p>
                <TranscribeExamples />
            </DevReveal>
        </main>
        <Footer />
    </div>
);

export default IndicTranscribePage;
