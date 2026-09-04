import Navbar from '../../../home/components/Navbar';
import Footer from '../../../home/components/Footer';
import ModelHero from './ModelHero';
import TranscribeExamples from './TranscribeExamples';
import Reveal from '../../../../components/Reveal';
import { getModelById } from '../../data/models';

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
        <main className="model-page-main" style={{ '--model-accent': 'var(--model-emerald)' }}>
            <ModelHero
                eyebrow="Developers · Model"
                title={model.name}
                intro="wave"
                tagline="Speech in — native script, mixed script, or romanized text out. Built for classrooms, call centres and code-mixed conversation."
                accent="var(--model-emerald)"
                stats={STATS}
                primaryCta={{ label: 'Hugging Face', href: '#' }}
                blogCta={model.blog}
                secondaryCta={{ label: 'Contact', href: '/contact' }}
            />

            <Reveal as="div" className="model-variants" style={{ '--model-accent': 'var(--model-emerald)' }}>
                <span className="model-variants-label">Variants</span>
                {VARIANTS.map((name) => (
                    <span key={name} className="model-variant">
                        {name}
                    </span>
                ))}
            </Reveal>

            <Reveal as="section" className="model-section">
                <TranscribeExamples />
            </Reveal>
        </main>
        <Footer />
    </div>
);

export default IndicTranscribePage;
