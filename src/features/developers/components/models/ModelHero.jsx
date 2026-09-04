import { Link } from 'react-router-dom';
import { motion as Motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowUpRight, BookOpen } from 'lucide-react';
import AnimatedTitle from '../../../../components/AnimatedTitle';
import ModelTitleIntro from './ModelTitleIntro';

const EASE = [0.25, 0.46, 0.45, 0.94];

const isExternal = (href) => /^https?:\/\//.test(href ?? '');

// The hero carries the model's name, one line on what it does, the links out,
// and the numbers band — including price — that used to sit at the foot of
// the page.
const ModelHero = ({ eyebrow, title, tagline, stats, accent, primaryCta, secondaryCta, blogCta, note, intro }) => {
    const reduceMotion = useReducedMotion();

    // Above the fold, so it plays on mount: each piece arrives just behind the
    // title's word-by-word reveal.
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

            {intro ? (
                <ModelTitleIntro variant={intro} text={title} className="model-title" />
            ) : (
                <AnimatedTitle as="h1" text={title} className="model-title" delay={0.12} />
            )}

            <Motion.p className="model-tagline" {...rise(0.34)}>
                {tagline}
            </Motion.p>

            <Motion.div className="model-cta-row" {...rise(0.44)}>
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
                {blogCta &&
                    (isExternal(blogCta.href) ? (
                        <a
                            href={blogCta.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="model-cta-secondary"
                        >
                            <BookOpen size={14} aria-hidden="true" />
                            {blogCta.label}
                            <ArrowUpRight size={13} aria-hidden="true" />
                        </a>
                    ) : (
                        <Link to={blogCta.href} className="model-cta-secondary">
                            <BookOpen size={14} aria-hidden="true" />
                            {blogCta.label}
                        </Link>
                    ))}
                {secondaryCta &&
                    (isExternal(secondaryCta.href) ? (
                        <a
                            href={secondaryCta.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="model-cta-secondary"
                        >
                            {secondaryCta.label}
                        </a>
                    ) : (
                        // in-app route: the site is hash-routed, so a bare href would miss
                        <Link to={secondaryCta.href} className="model-cta-secondary">
                            {secondaryCta.label}
                        </Link>
                    ))}
            </Motion.div>

            {note && (
                <Motion.p className="model-note" {...rise(0.5)}>
                    {note}
                </Motion.p>
            )}

            {stats && (
                <Motion.div className="stat-band model-hero-band" {...rise(0.56)}>
                    {stats.map((s) => (
                        <div key={s.label} className={`stat-band-item${s.isPrice ? ' is-price' : ''}`}>
                            <p className="stat-band-value">{s.value}</p>
                            <p className="stat-band-label">{s.label}</p>
                        </div>
                    ))}
                </Motion.div>
            )}
        </header>
    );
};

export default ModelHero;
