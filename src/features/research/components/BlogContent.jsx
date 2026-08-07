import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlogChart from './charts/BlogChart';
import ResearchExperiment from './ResearchExperiments';
import { CanaryArchitectureFlow, OutputModesAnimation } from './AnimatedResearchVisuals';
import { resolveChart } from '../data/charts';

gsap.registerPlugin(ScrollTrigger);

const Reveal = ({ children, className = '', delay = 0 }) => {
    const ref = useRef(null);

    useLayoutEffect(() => {
        const element = ref.current;
        if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

        const animation = gsap.fromTo(
            element,
            { y: 28, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.72,
                delay: delay / 1000,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: element,
                    start: 'top 88%',
                    once: true,
                },
            }
        );

        return () => {
            animation.scrollTrigger?.kill();
            animation.kill();
        };
    }, [delay]);

    return (
        <div
            ref={ref}
            className={`research-gsap-reveal ${className}`}
        >
            {children}
        </div>
    );
};

const renderCharts = (chartRefs) => {
    if (!chartRefs?.length) return null;
    return chartRefs.map((ref) => {
        const chart = resolveChart(ref);
        if (!chart) return null;
        return (
            <Reveal key={chart.id ?? ref}>
                <BlogChart chart={chart} />
            </Reveal>
        );
    });
};

const BlogContent = ({ sections }) => {
    const renderLink = ({ label, href }) => {
        const isInternal = href.startsWith('/');
        const className =
            'inline-flex items-center text-[13px] font-medium text-[var(--text-primary)] border border-[var(--primary-100)] rounded-full px-3.5 py-1.5 hover:bg-[var(--primary-100)] hover:border-[var(--text-orange-500)] hover:-translate-y-0.5 transition-all duration-200';

        if (isInternal) {
            return (
                <Link key={label} to={href} className={className}>
                    {label}
                </Link>
            );
        }

        return (
            <a key={label} href={href} className={className}>
                {label}
            </a>
        );
    };

    return (
        <div className="research-prose">
            {sections.map((section) => (
                <Reveal key={section.id}>
                    <section id={section.id} className="scroll-mt-28 mb-14 md:mb-16">
                        <div className="research-section-rule" aria-hidden="true" />
                        <h2 className="research-type-h2 text-[var(--text-primary)] mb-5">
                            {section.title}
                        </h2>

                        {section.content?.map((paragraph, i) => (
                            <p key={i} className="research-type-body mb-4 last:mb-0">
                                {paragraph}
                            </p>
                        ))}

                        {section.bullets && (
                            <ul className="space-y-2.5 mb-5 mt-2">
                                {section.bullets.map((item, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-3 research-type-body"
                                    >
                                        <span
                                            className="shrink-0 mt-[0.65rem] w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[var(--text-orange-500)] to-[var(--text-orange-400)]"
                                            aria-hidden="true"
                                        />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {section.stats && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
                                {section.stats.map(({ label, value }, i) => (
                                    <Reveal key={label} delay={i * 80}>
                                        <div className="research-surface-soft research-stat-card rounded-xl p-4">
                                            <p className="research-type-eyebrow text-[var(--color-11)] mb-1.5">
                                                {label}
                                            </p>
                                            <p className="text-xl font-medium text-[var(--text-primary)] tracking-tight">
                                                {value}
                                            </p>
                                        </div>
                                    </Reveal>
                                ))}
                            </div>
                        )}

                        {renderCharts(section.charts)}

                        {section.experiment && (
                            <Reveal>
                                <ResearchExperiment type={section.experiment} />
                            </Reveal>
                        )}

                        {section.demo && (
                            <div className="my-8 research-surface research-demo-frame rounded-xl overflow-hidden">
                                <div className="px-4 py-3 border-b border-[var(--primary-100)] bg-gradient-to-r from-[var(--bg-cream-100)] to-white">
                                    <p className="text-[13px] font-medium text-[var(--text-primary)]">
                                        {section.demo.title}
                                    </p>
                                    {section.demo.description && (
                                        <p className="research-type-body text-[13px] mt-1 !leading-relaxed">
                                            {section.demo.description}
                                        </p>
                                    )}
                                </div>
                                <iframe
                                    src={section.demo.url}
                                    title={section.demo.title}
                                    className="w-full border-0 bg-[var(--bg-cream-50)]"
                                    style={{ height: section.demo.height ?? 640 }}
                                    loading="lazy"
                                    allow="autoplay; fullscreen"
                                />
                                <div className="px-4 py-3 border-t border-[var(--primary-100)] bg-[var(--bg-cream-50)]">
                                    <a
                                        href={section.demo.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[13px] font-medium text-[var(--text-orange-500)] hover:text-[var(--text-hover)] transition-colors"
                                    >
                                        Open demo in a new tab →
                                    </a>
                                </div>
                            </div>
                        )}

                        {section.table && (
                            section.id === 'model-card' ? (
                                <CanaryArchitectureFlow />
                            ) : (
                            <div className="overflow-x-auto my-6 research-surface rounded-xl">
                                <table className="w-full text-[13px]">
                                    <thead>
                                        <tr className="border-b border-[var(--primary-100)] bg-gradient-to-r from-[var(--bg-cream-100)] to-white">
                                            {section.table.headers.map((header) => (
                                                <th
                                                    key={header}
                                                    className="text-left px-4 py-3 research-type-eyebrow text-[var(--color-11)]"
                                                >
                                                    {header}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {section.table.rows.map((row, i) => (
                                            <tr
                                                key={i}
                                                className="border-b border-[var(--primary-100)] last:border-0 even:bg-[var(--bg-cream-50)]/70 hover:bg-[var(--bg-cream-100)]/80 transition-colors"
                                            >
                                                {row.map((cell, j) => (
                                                    <td
                                                        key={j}
                                                        className="px-4 py-3 research-type-body text-[13px]"
                                                    >
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            )
                        )}

                        {section.subsections &&
                            (section.subsectionLayout === 'cards' ? (
                                <div className="research-feature-grid">
                                    {section.subsections.map((sub, i) => (
                                        <Reveal key={sub.title} delay={i * 90}>
                                            <article className="research-feature-card h-full">
                                                <p className="research-feature-index">
                                                    {String(i + 1).padStart(2, '0')}
                                                </p>
                                                <h3 className="research-feature-title">{sub.title}</h3>
                                                {sub.content && (
                                                    <p className="research-feature-body">{sub.content}</p>
                                                )}
                                                {sub.bullets && (
                                                    <ul className="space-y-1.5 mt-3">
                                                        {sub.bullets.map((item, j) => (
                                                            <li
                                                                key={j}
                                                                className="flex items-start gap-2 research-feature-body"
                                                            >
                                                                <span
                                                                    className="shrink-0 mt-[0.55rem] w-1 h-1 rounded-full bg-[var(--text-orange-500)]"
                                                                    aria-hidden="true"
                                                                />
                                                                <span>{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </article>
                                        </Reveal>
                                    ))}
                                </div>
                            ) : (
                                section.subsections.map((sub, i) => (
                                    <div key={i} className="mt-8">
                                        <h3 className="research-type-h3 text-[var(--text-primary)] mb-3">
                                            {sub.title}
                                        </h3>
                                        {sub.content && (
                                            <p className="research-type-body mb-4">{sub.content}</p>
                                        )}
                                        {sub.examples && (
                                            sub.title === 'Three Output Modes' ? (
                                                <OutputModesAnimation />
                                            ) : (
                                            <div className="grid gap-2.5 my-4">
                                                {sub.examples.map(({ label, text }) => (
                                                    <div
                                                        key={label}
                                                        className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 research-surface research-example-row rounded-xl p-4"
                                                    >
                                                        <span className="research-type-eyebrow text-[var(--text-orange-500)] w-24 shrink-0">
                                                            {label}
                                                        </span>
                                                        <span className="research-type-body text-[var(--text-primary)] !leading-snug">
                                                            {text}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                            )
                                        )}
                                        {sub.bullets && (
                                            <ul className="space-y-2">
                                                {sub.bullets.map((item, j) => (
                                                    <li
                                                        key={j}
                                                        className="flex items-start gap-3 research-type-body"
                                                    >
                                                        <span
                                                            className="shrink-0 mt-[0.65rem] w-1.5 h-1.5 rounded-full bg-gradient-to-br from-[var(--text-orange-500)] to-[var(--text-orange-400)]"
                                                            aria-hidden="true"
                                                        />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        {renderCharts(sub.charts)}
                                    </div>
                                ))
                            ))}

                        {section.code && (
                            <div className="my-6 space-y-2">
                                {section.code.map((line, i) => (
                                    <pre
                                        key={i}
                                        className="bg-[var(--text-primary)] text-[var(--bg-cream-50)] rounded-xl px-4 py-3 text-[13px] font-mono overflow-x-auto shadow-sm"
                                    >
                                        {line}
                                    </pre>
                                ))}
                            </div>
                        )}

                        {section.links && (
                            <div className="flex flex-wrap gap-2.5 mt-6">
                                {section.links.map(renderLink)}
                            </div>
                        )}
                    </section>
                </Reveal>
            ))}
        </div>
    );
};

export default BlogContent;
