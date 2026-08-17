import { useEffect, useLayoutEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';
import TableOfContents from './TableOfContents';
import BlogContent from './BlogContent';
import ShareButton from './ShareButton';
import MosaicCanvas from './MosaicCanvas';
import { getPostBySlug, formatDate } from '../data/posts';

gsap.registerPlugin(ScrollTrigger);

const BlogPostPage = () => {
    const { slug } = useParams();
    const post = getPostBySlug(slug);
    const pageRef = useRef(null);
    const progressRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    useLayoutEffect(() => {
        if (!post || !pageRef.current) return undefined;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const context = gsap.context(() => {
            gsap.set(progressRef.current, { scaleX: 0 });
            gsap.to(progressRef.current, {
                scaleX: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: pageRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 0.2,
                },
            });

            if (!reduceMotion) {
                gsap.from('[data-article-intro]', {
                    y: 22,
                    opacity: 0,
                    duration: 0.72,
                    stagger: 0.09,
                    ease: 'power3.out',
                });
            }
        }, pageRef);

        return () => context.revert();
    }, [post, slug]);

    if (!post) {
        return (
            <div className="min-h-screen research-page">
                <Navbar />
                <div className="research-article-column mx-auto px-5 py-32 text-center">
                    <h1 className="text-xl font-medium text-[var(--text-primary)] mb-4">
                        Publication not found
                    </h1>
                    <Link
                        to="/research"
                        className="text-[var(--text-orange-500)] hover:text-[var(--text-hover)] underline text-sm"
                    >
                        Back to Research
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const tocSections = post.sections.map(({ id, title }) => ({ id, title }));

    return (
        <div ref={pageRef} className="min-h-screen research-page">
            <div
                ref={progressRef}
                className="research-reading-progress"
                aria-hidden="true"
            />

            <Navbar />

            <header className="research-hero-atmosphere pt-10 md:pt-14 pb-8 md:pb-10">
                <div className="research-article-column mx-auto px-5 relative">
                    <p
                        data-article-intro
                        className="research-type-eyebrow text-[var(--text-orange-500)] mb-4 text-center"
                    >
                        {post.category}
                        <span className="mx-2 text-[var(--color-14)]">·</span>
                        <span className="text-[var(--color-11)]">{formatDate(post.date)}</span>
                    </p>

                    <div className="research-hero-mosaic">
                        <MosaicCanvas className="research-mosaic-layer" />
                        <div className="research-hero-mosaic-scrim" aria-hidden="true" />

                        <div className="research-hero-mosaic-content">
                            <div className="absolute top-4 right-4 md:top-5 md:right-5 z-10">
                                <ShareButton title={post.title} />
                            </div>

                            <h1
                                data-article-intro
                                className="research-type-title research-hero-mosaic-title text-[var(--text-primary)] mx-auto max-w-[38rem]"
                            >
                                {post.title}
                            </h1>

                            {post.heroLinks?.length > 0 && (
                                <nav
                                    aria-label="Publication links"
                                    data-article-intro
                                    className="flex flex-wrap items-center justify-center gap-2 mt-6"
                                >
                                    {post.heroLinks.map((link) => (
                                        <span key={link.label} className="inline-flex items-center">
                                            {link.href.startsWith('/') ? (
                                                <Link
                                                    to={link.href}
                                                    className="research-link-chip research-link-chip-on-mosaic inline-flex items-center gap-0.5"
                                                >
                                                    {link.label}
                                                </Link>
                                            ) : (
                                                <a
                                                    href={link.href}
                                                    target={link.href.startsWith('http') ? '_blank' : undefined}
                                                    rel={
                                                        link.href.startsWith('http')
                                                            ? 'noopener noreferrer'
                                                            : undefined
                                                    }
                                                    className="research-link-chip research-link-chip-on-mosaic inline-flex items-center"
                                                >
                                                    {link.label}
                                                </a>
                                            )}
                                        </span>
                                    ))}
                                </nav>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="relative pb-16 md:pb-24">
                <div className="research-article-column mx-auto px-5">
                    <Link
                        to="/research"
                        data-article-intro
                        className="inline-flex items-center gap-2 research-type-caption hover:text-[var(--text-orange-500)] mb-7 transition-colors"
                    >
                        <ArrowLeft size={14} />
                        All publications
                    </Link>

                    {post.heroSummary && (
                        <p data-article-intro className="research-type-dek mb-10 border-l-2 border-[var(--text-orange-500)]/40 pl-4 md:pl-5">
                            {post.heroSummary}
                        </p>
                    )}

                    <TableOfContents sections={tocSections} />

                    <article>
                        <BlogContent sections={post.sections} />
                    </article>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default BlogPostPage;
