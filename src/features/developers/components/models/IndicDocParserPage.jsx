import Navbar from '../../../home/components/Navbar';
import Footer from '../../../home/components/Footer';
import ModelHero from './ModelHero';
import DocParserDemo from './DocParserDemo';
import DocParserExamples from './DocParserExamples';

const IndicDocParserPage = () => (
    <div className="min-h-screen research-page">
        <Navbar />
        <main className="model-page-main">
            <ModelHero
                eyebrow="Developers · Model"
                title="IndicDocParser"
                tagline="A page image in — reading-ordered Markdown out, math as LaTeX, tables as HTML."
                accent="var(--text-orange-500)"
                mascotMood="read"
                specs={[
                    { label: 'Languages', value: '22 + English' },
                    { label: 'Layout labels', value: '37' },
                    { label: 'Parameters', value: '33M + 0.8B' },
                ]}
                primaryCta={{ label: 'Hugging Face', href: '#' }}
                secondaryCta={{ label: 'Contact', href: '/contact' }}
            />

            <section className="model-section">
                <p className="model-section-label">Examples</p>
                <DocParserExamples />
                <p className="model-caption">Unedited model predictions on real pages.</p>
            </section>

            <section className="model-section">
                <p className="model-section-label">How it works</p>
                <DocParserDemo />
            </section>
        </main>
        <Footer />
    </div>
);

export default IndicDocParserPage;
