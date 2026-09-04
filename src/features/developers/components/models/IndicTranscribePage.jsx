import { useRef } from 'react';
import Navbar from '../../../home/components/Navbar';
import Footer from '../../../home/components/Footer';
import './indic-transcribe/transcribe.css';
import useTranscribeAnimations from './indic-transcribe/useTranscribeAnimations';
import TranscribeHero from './indic-transcribe/TranscribeHero';
import TranscribeOverview from './indic-transcribe/TranscribeOverview';
import TranscribeLiveDemo from './indic-transcribe/TranscribeLiveDemo';
import TranscribeCodeMixed from './indic-transcribe/TranscribeCodeMixed';
import TranscribeSongs from './indic-transcribe/TranscribeSongs';
import TranscribeClosing from './indic-transcribe/TranscribeClosing';

const IndicTranscribePage = () => {
    const pageRef = useRef(null);
    useTranscribeAnimations(pageRef);

    return (
        <div className="min-h-screen itx-page" ref={pageRef}>
            <div className="itx-grid-layer" aria-hidden="true" />
            <Navbar />
            <main id="top">
                <TranscribeHero />
                <TranscribeOverview />
                <TranscribeLiveDemo />
                <TranscribeCodeMixed />
                <TranscribeSongs />
                <TranscribeClosing />
            </main>
            <Footer />
        </div>
    );
};

export default IndicTranscribePage;
