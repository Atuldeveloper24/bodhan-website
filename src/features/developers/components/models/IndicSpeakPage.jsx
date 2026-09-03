import { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import Navbar from '../../../home/components/Navbar';
import Footer from '../../../home/components/Footer';
import ModelHero from './ModelHero';

const WORDS = ['आज', 'हम', 'fractions', 'के', 'बारे', 'में', 'सीखेंगे'];
const VOICES = ['Ananya', 'Rohan'];
const BARS = Array.from({ length: 28 }, (_, i) => 22 + ((i * 37) % 58));

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const SpeakDemo = () => {
    const [playing, setPlaying] = useState(false);
    const [activeWord, setActiveWord] = useState(-1);
    const [voice, setVoice] = useState(VOICES[0]);

    useEffect(() => {
        if (!playing) return undefined;
        const timer = window.setInterval(() => {
            setActiveWord((current) => {
                const next = current + 1;
                if (next >= WORDS.length - 1) {
                    window.clearInterval(timer);
                    setPlaying(false);
                    return WORDS.length - 1;
                }
                return next;
            });
        }, 480);
        return () => window.clearInterval(timer);
    }, [playing]);

    const play = () => {
        if (prefersReducedMotion()) {
            setActiveWord(WORDS.length - 1);
            return;
        }
        if (activeWord >= WORDS.length - 1) setActiveWord(-1);
        setPlaying(true);
    };

    const reset = () => {
        setPlaying(false);
        setActiveWord(-1);
    };

    return (
        <div className="model-panel speak-panel">
            <div className="speak-top">
                <div className="speak-voice-tabs" role="tablist" aria-label="Voice">
                    {VOICES.map((v) => (
                        <button
                            key={v}
                            type="button"
                            role="tab"
                            aria-selected={voice === v}
                            className={voice === v ? 'is-active' : undefined}
                            onClick={() => setVoice(v)}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            </div>

            <p className="speak-caption" lang="hi">
                {WORDS.map((word, i) => (
                    <span key={i} className={`karaoke-word${i <= activeWord ? ' is-said' : ''}${i === activeWord ? ' is-active' : ''}`}>
                        {word}{' '}
                    </span>
                ))}
            </p>

            <div className={`speak-wave${playing ? ' is-playing' : ''}`} aria-hidden="true">
                {BARS.map((h, i) => (
                    <span key={i} style={{ '--h': `${h}%`, animationDelay: `${(i % 8) * 70}ms` }} />
                ))}
            </div>

            <div className="dp-toolbar">
                <button type="button" className="model-cta-primary model-cta-small" onClick={playing ? () => setPlaying(false) : play}>
                    {playing ? <Pause size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
                    {playing ? 'Pause' : activeWord >= WORDS.length - 1 ? 'Replay' : `Speak as ${voice}`}
                </button>
                <button type="button" className="dp-text-btn" onClick={reset}>
                    <RotateCcw size={12} aria-hidden="true" />
                    Reset
                </button>
            </div>
        </div>
    );
};

const IndicSpeakPage = () => (
    <div className="min-h-screen research-page">
        <Navbar />
        <main className="model-page-main">
            <ModelHero
                eyebrow="Developers · Model"
                title="Indic-Speak"
                tagline="Text in, a classroom-ready voice out — 22 Indian languages, code-mixed sentences included."
                accent="var(--brand-blue)"
                specs={[
                    { label: 'Languages', value: '22 + English' },
                    { label: 'Voices / language', value: 'Multiple' },
                    { label: 'Response time', value: '~200 ms' },
                ]}
                primaryCta={{ label: 'Hugging Face', href: '#' }}
                secondaryCta={{ label: 'Contact', href: '/contact' }}
                note="Early checkpoint — shared for integration testing, not final voice quality."
            />

            <section className="model-section">
                <p className="model-section-label">Try it</p>
                <SpeakDemo />
            </section>
        </main>
        <Footer />
    </div>
);

export default IndicSpeakPage;
