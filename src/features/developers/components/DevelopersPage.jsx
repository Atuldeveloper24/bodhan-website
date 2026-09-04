import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';
import ModelIcon from './ModelIcon';
import ModelGlyph from './ModelGlyph';
import AccentAurora from './AccentAurora';
import DevReveal from './DevReveal';
import DevHeadline from './DevHeadline';
import { models } from '../data/models';
import '../developers.css';

// Totals for the header strip — read off the model data so they cannot drift
// away from the cards underneath them.
const HEADLINE = [
    { value: `${models.length}`, label: 'Open models' },
    { value: '27', label: 'Languages covered' },
    { value: '22', label: 'Eighth Schedule languages' },
    { value: '1', label: 'API to reach them' },
];

const DevelopersPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen research-page">
            <Navbar />

            <main className="model-page-main models-page-main">
                <AccentAurora from="#E2691F" to="#C2410C" />

                <header className="dx-hero">
                    <p className="dx-chip">Developers</p>

                    <DevHeadline
                        className="dx-title"
                        words={['Models', 'built', 'for', { content: 'Indian languages', className: 'dh-break dx-grad' }]}
                    />

                    <p className="dx-lede">
                        Speech, documents and translation — trained on Indian languages rather than
                        adapted to them. Each one runs on its own, and they compose into one pipeline.
                    </p>

                    <div className="dx-meta">
                        {HEADLINE.map((item) => (
                            <div key={item.label} className="dx-meta-item">
                                <span className="dx-meta-value">{item.value}</span>
                                <span className="dx-meta-label">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </header>

                <DevReveal className="dev-grid" stagger=".dev-card">
                    {models.map((model) => (
                        <Link
                            key={model.id}
                            to={model.href}
                            className="dev-card"
                            style={{ '--model-accent': model.accent, '--model-gradient': model.gradient }}
                        >
                            <span className="dev-card-viz">
                                <ModelGlyph kind={model.glyph} from={model.viz.from} to={model.viz.to} />
                            </span>

                            <span className="dev-card-body">
                                <span className="dev-card-top">
                                    <span className="dev-card-icon">
                                        <ModelIcon name={model.icon} size={19} />
                                    </span>
                                    <span className="dev-card-heading">
                                        <span className="dev-card-name">{model.name}</span>
                                        <span className="dev-card-codename">{model.codename}</span>
                                    </span>
                                    <ArrowUpRight size={17} className="dev-card-arrow" aria-hidden="true" />
                                </span>

                                <span className="dev-card-summary">{model.summary}</span>

                                <span className="dev-card-specs">
                                    {model.specs.map((spec) => (
                                        <span key={spec.label} className="dev-card-spec">
                                            <b>{spec.value}</b>
                                            <span>{spec.label}</span>
                                        </span>
                                    ))}
                                </span>

                                <span className="dev-card-foot">
                                    <span className="dev-card-price">
                                        <b>{model.price.value}</b>
                                        {model.price.label}
                                    </span>
                                    <span className="dev-card-go">
                                        Explore
                                        <ArrowUpRight size={13} aria-hidden="true" />
                                    </span>
                                </span>
                            </span>
                        </Link>
                    ))}
                </DevReveal>
            </main>

            <Footer />
        </div>
    );
};

export default DevelopersPage;
