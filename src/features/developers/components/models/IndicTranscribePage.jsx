import Navbar from '../../../home/components/Navbar';
import Footer from '../../../home/components/Footer';
import ModelHero from './ModelHero';
import TranscribeExamples from './TranscribeExamples';

const IndicTranscribePage = () => (
    <div className="min-h-screen research-page">
        <Navbar />
        <main className="model-page-main">
            <ModelHero
                eyebrow="Developers · Model"
                title="Indic-Transcribe"
                tagline="27 Indian languages in — native, mixed, or romanized text out."
                accent="var(--model-emerald)"
                specs={[
                    { label: 'Languages', value: '27' },
                    { label: 'Parameters', value: '1.2B' },
                    { label: 'Output modes', value: '3' },
                ]}
                primaryCta={{ label: 'Hugging Face', href: '#' }}
                secondaryCta={{ label: 'Contact', href: '/contact' }}
            />

            <section className="model-section">
                <p className="model-section-label">Examples</p>
                <TranscribeExamples />
                <p className="model-caption">
                    Real audio, unedited model output in all three transcription modes.
                </p>
            </section>
        </main>
        <Footer />
    </div>
);

export default IndicTranscribePage;
