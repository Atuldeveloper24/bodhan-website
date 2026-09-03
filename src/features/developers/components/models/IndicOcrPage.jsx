import Navbar from '../../../home/components/Navbar';
import Footer from '../../../home/components/Footer';
import ModelHero from './ModelHero';
import DocParserExamples from './DocParserExamples';
import Reveal from '../../../../components/Reveal';

const STAGES = [
    {
        subtype: 'Layout detection',
        detail: '37 block labels — paragraphs, equations, tables, headers, page numbers — placed in reading order.',
    },
    {
        subtype: 'Block-level OCR',
        detail: 'Each block read on its own terms: prose as text, math as LaTeX, tables as HTML.',
    },
    {
        subtype: 'Printed and handwritten',
        detail: 'Typeset pages, manuscript pages, and phone scans of ruled notebooks.',
    },
];

const STATS = [
    { value: '22', label: 'Languages + English' },
    { value: '37', label: 'Layout labels' },
    { value: '33M', label: 'Layout model' },
    { value: '0.8B', label: 'OCR model' },
];

const IndicOcrPage = () => (
    <div className="min-h-screen research-page">
        <Navbar />
        <main className="model-page-main">
            <ModelHero
                eyebrow="Developers · Model"
                title="Read every document, in every Indian language"
                display
                tagline="Layout detection with reading order, then block-level OCR — printed or handwritten, with math as LaTeX and tables as HTML."
                accent="var(--text-orange-500)"
                specs={[
                    { label: 'Languages', value: '22 + English' },
                    { label: 'Layout labels', value: '37' },
                    { label: 'Parameters', value: '33M + 0.8B' },
                ]}
                primaryCta={{ label: 'Hugging Face', href: '#' }}
                secondaryCta={{ label: 'Contact', href: '/contact' }}
            />

            <Reveal as="section" className="model-section">
                <DocParserExamples />
                <p className="model-caption">
                    Unedited model predictions on real pages. Drag the handle to compare.
                </p>
            </Reveal>

            <Reveal as="section" className="model-section">
                <h2 className="model-section-title">Two stages, not one</h2>
                <p className="model-section-dek">
                    Layout first, then text — which is what lets a page come back in the order a
                    human would read it.
                </p>
                <div className="feat-grid">
                    {STAGES.map((s, i) => (
                        <Reveal as="article" key={s.subtype} className="feat-card" delay={i * 0.07}>
                            <p className="feat-card-title">{s.subtype}</p>
                            <p className="feat-card-detail">{s.detail}</p>
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

export default IndicOcrPage;
