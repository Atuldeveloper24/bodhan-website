import Navbar from '../../../home/components/Navbar';
import Footer from '../../../home/components/Footer';
import ModelHero from './ModelHero';
import DocParserExamples from './DocParserExamples';
import Reveal from '../../../../components/Reveal';
import { getModelById } from '../../data/models';

const model = getModelById('indic-ocr');

const STATS = [
    { value: '22', label: 'Languages + English' },
    { value: '37', label: 'Layout labels' },
    { value: '33M', label: 'Layout model' },
    { value: '0.8B', label: 'OCR model' },
    { value: model.price.value, label: model.price.label, isPrice: true },
];

const IndicOcrPage = () => (
    <div className="min-h-screen research-page">
        <Navbar />
        <main className="model-page-main">
            <ModelHero
                eyebrow="Developers · Model"
                title={model.name}
                intro="scan"
                tagline="Layout detection with reading order, then block-level OCR — printed or handwritten, with math as LaTeX and tables as HTML."
                accent="var(--text-orange-500)"
                stats={STATS}
                primaryCta={{ label: 'Hugging Face', href: '#' }}
                blogCta={model.blog}
                secondaryCta={{ label: 'Contact', href: '/contact' }}
            />

            <Reveal as="section" className="model-section">
                <DocParserExamples />
            </Reveal>
        </main>
        <Footer />
    </div>
);

export default IndicOcrPage;
