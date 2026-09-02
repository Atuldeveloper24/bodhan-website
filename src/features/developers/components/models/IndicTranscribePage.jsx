import { useEffect, useState } from 'react';
import { Mic, RotateCcw } from 'lucide-react';
import Navbar from '../../../home/components/Navbar';
import Footer from '../../../home/components/Footer';
import ModelHero from './ModelHero';
import Mascot from './Mascot';
import TranscribeExamples from './TranscribeExamples';

const MODES = [
    { id: 'native', label: 'Native', text: 'मैंने कल पांच बजे तीन फाइलें अपलोड कीं' },
    { id: 'mixed', label: 'Mixed', text: 'मैंने कल 5 बजे 3 files upload कीं' },
    { id: 'romanized', label: 'Romanized', text: 'maine kal 5 baje 3 files upload kin' },
];

const BARS = Array.from({ length: 32 }, (_, i) => 18 + ((i * 29) % 62));

const TranscribeDemo = () => {
    const [state, setState] = useState('idle'); // idle | listening | done
    const [mode, setMode] = useState('native');

    useEffect(() => {
        if (state !== 'listening') return undefined;
        const timer = window.setTimeout(() => setState('done'), 1400);
        return () => window.clearTimeout(timer);
    }, [state]);

    const start = () => setState('listening');
    const reset = () => setState('idle');

    return (
        <div className="model-panel transcribe-panel">
            <div className="transcribe-top">
                <button
                    type="button"
                    className={`transcribe-mic${state === 'listening' ? ' is-listening' : ''}`}
                    onClick={state === 'idle' ? start : undefined}
                    disabled={state !== 'idle'}
                    aria-label="Transcribe sample audio"
                >
                    <Mic size={20} aria-hidden="true" />
                </button>

                <div className={`transcribe-wave${state === 'listening' ? ' is-playing' : ''}`} aria-hidden="true">
                    {BARS.map((h, i) => (
                        <span key={i} style={{ '--h': `${h}%`, animationDelay: `${(i % 8) * 60}ms` }} />
                    ))}
                </div>

                <Mascot mood="listen" accent="var(--model-emerald)" size={64} active={state === 'listening'} />
            </div>

            {state === 'done' && (
                <>
                    <p className="transcribe-lang-chip">Detected language: Hindi</p>

                    <div className="dp-view-tabs transcribe-mode-tabs" role="tablist" aria-label="Output mode">
                        {MODES.map((m) => (
                            <button
                                key={m.id}
                                type="button"
                                role="tab"
                                aria-selected={mode === m.id}
                                className={mode === m.id ? 'is-active' : undefined}
                                onClick={() => setMode(m.id)}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>

                    <p className="transcribe-caption" lang={mode === 'romanized' ? 'en' : 'hi'}>
                        {MODES.find((m) => m.id === mode)?.text}
                    </p>
                </>
            )}

            {state !== 'idle' && (
                <div className="dp-toolbar">
                    <button type="button" className="dp-text-btn" onClick={reset}>
                        <RotateCcw size={12} aria-hidden="true" />
                        Reset
                    </button>
                </div>
            )}
        </div>
    );
};

const IndicTranscribePage = () => (
    <div className="min-h-screen research-page">
        <Navbar />
        <main className="model-page-main">
            <ModelHero
                eyebrow="Developers · Model"
                title="Indic-Transcribe"
                tagline="27 Indian languages in — native, mixed, or romanized text out."
                accent="var(--model-emerald)"
                mascotMood="listen"
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

            <section className="model-section">
                <p className="model-section-label">How it works</p>
                <TranscribeDemo />
            </section>
        </main>
        <Footer />
    </div>
);

export default IndicTranscribePage;
