import { useRef, useState } from 'react';
import Navbar from '../../../home/components/Navbar';
import Footer from '../../../home/components/Footer';
import './indic-translate/translate.css';
import useTranslateAnimations from './indic-translate/useTranslateAnimations';
import TranslateHero from './indic-translate/TranslateHero';
import TranslateOverview from './indic-translate/TranslateOverview';
import TranslateLiveDemo from './indic-translate/TranslateLiveDemo';
import TranslateExamplesGallery from './indic-translate/TranslateExamplesGallery';
import TranslateClosing from './indic-translate/TranslateClosing';

const IndicTranslatePage = () => {
    const pageRef = useRef(null);
    // The demo's mode lives here so the capability cards in the overview can
    // hand it straight to the matching animation.
    const [demoMode, setDemoMode] = useState('sentence');
    useTranslateAnimations(pageRef);

    const pickCapability = (mode) => {
        setDemoMode(mode);
        document.querySelector('#demo')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div className="min-h-screen itr-page" ref={pageRef}>
            <div className="itr-ground" aria-hidden="true" />
            <Navbar />
            <main id="top">
                <TranslateHero />
                <TranslateOverview onPickCapability={pickCapability} />
                <TranslateLiveDemo mode={demoMode} onModeChange={setDemoMode} />
                <TranslateExamplesGallery />
                <TranslateClosing />
            </main>
            <Footer />
        </div>
    );
};

export default IndicTranslatePage;
