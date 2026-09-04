import { useRef } from 'react';
import Navbar from '../../../home/components/Navbar';
import Footer from '../../../home/components/Footer';
import './indic-doc-parser/docparser.css';
import useDocParserAnimations from './indic-doc-parser/useDocParserAnimations';
import DocParserHero from './indic-doc-parser/DocParserHero';
import DocParserOverview from './indic-doc-parser/DocParserOverview';
import DocParserLiveDemo from './indic-doc-parser/DocParserLiveDemo';
import DocParserExamplesGallery from './indic-doc-parser/DocParserExamplesGallery';
import DocParserClosing from './indic-doc-parser/DocParserClosing';

const IndicDocParserPage = () => {
    const pageRef = useRef(null);
    useDocParserAnimations(pageRef);

    return (
        <div className="min-h-screen idp-page" ref={pageRef}>
            <div className="idp-grid-layer" aria-hidden="true" />
            <Navbar />
            <main id="top">
                <DocParserHero />
                <DocParserOverview />
                <DocParserLiveDemo />
                <DocParserExamplesGallery />
                <DocParserClosing />
            </main>
            <Footer />
        </div>
    );
};

export default IndicDocParserPage;
