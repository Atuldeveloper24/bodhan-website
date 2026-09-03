import { Link } from 'react-router-dom';
import { motion as Motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import AnimatedTitle from '../../../../components/AnimatedTitle';

const EASE = [0.25, 0.46, 0.45, 0.94];

// `display` gives the headline the larger, airier treatment for pages whose
// title is a full sentence rather than just the model name.
const ModelHero = ({ eyebrow, title, tagline, specs, accent, primaryCta, secondaryCta, note, display }) => {
    const reduceMotion = useReducedMotion();

    // The hero is above the fold, so it plays on mount: each piece arrives just
    // behind the title's word-by-word reveal.
    const rise = (delay) =>
        reduceMotion
            ? {}
            : {
                  initial: { opacity: 0, y: 14 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.55, ease: EASE, delay },
              };

    return (
        <header className="model-hero" style={{ '--model-accent': accent }}>
            <Link to="/developers" className="model-back-link">
                <ArrowLeft size={14} aria-hidden="true" />
                All models
            </Link>

            <Motion.p className="model-eyebrow" {...rise(0.05)}>
                {eyebrow}
            </Motion.p>

            <AnimatedTitle
                as="h1"
                text={title}
                className={`model-title${display ? ' is-display' : ''}`}
                delay={0.12}
            />

            <Motion.p className="model-tagline" {...rise(0.42)}>
                {tagline}
            </Motion.p>

            <Motion.div className="model-cta-row" {...rise(0.52)}>
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
            </Motion.div>

            {note && (
                <Motion.p className="model-note" {...rise(0.58)}>
                    {note}
                </Motion.p>
            )}

            {specs && (
                <div className="model-spec-strip">
                    {specs.map((spec, i) => (
                        <Motion.div key={spec.label} className="model-spec" {...rise(0.62 + i * 0.08)}>
                            <p className="model-spec-value">{spec.value}</p>
                            <p className="model-spec-label">{spec.label}</p>
                        </Motion.div>
                    ))}
                </div>
            )}
        </header>
    );
};

export default ModelHero;
