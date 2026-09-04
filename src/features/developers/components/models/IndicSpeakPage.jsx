import { useRef } from 'react';
import Navbar from '../../../home/components/Navbar';
import Footer from '../../../home/components/Footer';
import './indic-speak/speak.css';
import useSpeakAnimations from './indic-speak/useSpeakAnimations';
import { useSoloPlayback } from './indic-speak/useSpeakAudio';
import SpeakHero from './indic-speak/SpeakHero';
import SpeakOverview from './indic-speak/SpeakOverview';
import SpeakLiveDemo from './indic-speak/SpeakLiveDemo';
import SpeakExamples from './indic-speak/SpeakExamples';
import SpeakNormalizer from './indic-speak/SpeakNormalizer';
import SpeakLanguages from './indic-speak/SpeakLanguages';
import SpeakClosing from './indic-speak/SpeakClosing';

const IndicSpeakPage = () => {
    const pageRef = useRef(null);

    useSpeakAnimations(pageRef);
    useSoloPlayback(pageRef);

    return (
        <div className="min-h-screen research-page isp-page" ref={pageRef}>
            <Navbar />
            <main id="top">
                <SpeakHero />
                <SpeakOverview />
                <SpeakLiveDemo />
                <SpeakExamples />
                <SpeakNormalizer />
                <SpeakLanguages />
                <SpeakClosing />
            </main>
            <Footer />
        </div>
    );
};

export default IndicSpeakPage;
