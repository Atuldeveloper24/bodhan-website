import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';
import ModelIcon from './ModelIcon';
import AnimatedTitle from '../../../components/AnimatedTitle';
import { models } from '../data/models';

const DevelopersPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen research-page">
            <Navbar />

            <main className="model-page-main models-page-main">
                <header className="dev-header">
                    <p className="model-eyebrow">Developers</p>
                    <AnimatedTitle as="h1" text="Models" className="model-title" />
                    <p className="model-tagline">
                        Open models for Indian languages — speech, documents, and translation.
                    </p>
                </header>

                <div className="dev-grid">
                    {models.map((model) => (
                        <Link key={model.id} to={model.href} className="dev-card" style={{ '--model-accent': model.accent }}>
                            <span className="dev-card-top">
                                <span className="dev-card-icon">
                                    <ModelIcon name={model.icon} size={20} />
                                </span>
                                <ArrowUpRight size={16} className="dev-card-arrow" aria-hidden="true" />
                            </span>

                            <span className="dev-card-name">{model.name}</span>
                            <span className="dev-card-codename">{model.codename}</span>
                            <span className="dev-card-summary">{model.summary}</span>

                            <span className="dev-card-specs">
                                {model.specs.map((spec) => (
                                    <span key={spec.label}>
                                        <b>{spec.value}</b> {spec.label}
                                    </span>
                                ))}
                            </span>
                        </Link>
                    ))}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default DevelopersPage;
