import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

const ModelHero = ({ eyebrow, title, tagline, specs, accent, primaryCta, secondaryCta, note }) => (
    <header className="model-hero" style={{ '--model-accent': accent }}>
        <Link to="/developers" className="model-back-link">
            <ArrowLeft size={14} aria-hidden="true" />
            All models
        </Link>
        <p className="model-eyebrow">{eyebrow}</p>
        <h1 className="model-title">{title}</h1>
        <p className="model-tagline">{tagline}</p>

        <div className="model-cta-row">
            {primaryCta && (
                <a
                    href={primaryCta.href}
                    target={primaryCta.href.startsWith('http') ? '_blank' : undefined}
                    rel={primaryCta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="model-cta-primary"
                >
                    {primaryCta.label}
                    <ArrowUpRight size={14} aria-hidden="true" />
                </a>
            )}
            {secondaryCta && (
                <a href={secondaryCta.href} className="model-cta-secondary">
                    {secondaryCta.label}
                </a>
            )}
        </div>

        {note && <p className="model-note">{note}</p>}

        {specs && (
            <div className="model-spec-strip">
                {specs.map((spec) => (
                    <div key={spec.label} className="model-spec">
                        <p className="model-spec-value">{spec.value}</p>
                        <p className="model-spec-label">{spec.label}</p>
                    </div>
                ))}
            </div>
        )}
    </header>
);

export default ModelHero;
