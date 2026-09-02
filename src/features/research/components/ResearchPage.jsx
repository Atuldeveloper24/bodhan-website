import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navbar from '../../home/components/Navbar';
import Footer from '../../home/components/Footer';
import { posts, researchAreas, getFeaturedPost, formatDate } from '../data/posts';

const FILTERS = ['All', 'Publication', 'Release', 'Milestone'];
const INDIC_GLYPHS = ['अ', 'আ', 'ਅ', 'અ', 'ଅ', 'அ', 'అ', 'ಅ', 'മ'];

const VIEW_CONFIG = {
    overview: {
        title: 'Research',
        subtitle: null,
        showAreas: true,
        showFeatured: true,
        listTitle: null,
        emptyMessage: 'No publications in this category yet.',
    },
    blog: {
        title: 'Blog',
        subtitle: 'Technical posts, model releases, and research updates from Bodhan.',
        showAreas: false,
        showFeatured: false,
        listTitle: 'Latest posts',
        emptyMessage: 'No blog posts yet.',
    },
    publications: {
        title: 'Publications',
        subtitle: 'Papers, formal releases, and research publications.',
        showAreas: false,
        showFeatured: false,
        listTitle: 'All publications',
        emptyMessage: 'No publications yet.',
        forceFilter: 'Publication',
    },
};

gsap.registerPlugin(ScrollTrigger);

const getViewFromPath = (pathname) => {
    if (pathname.endsWith('/blog')) return 'blog';
    if (pathname.endsWith('/publications')) return 'publications';
    return 'overview';
};

const ResearchPage = () => {
    const location = useLocation();
    const view = getViewFromPath(location.pathname);
    const config = VIEW_CONFIG[view];

    const [activeFilter, setActiveFilter] = useState(
        config.forceFilter ?? 'All'
    );
    const pageRef = useRef(null);
    const postListRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        setActiveFilter(config.forceFilter ?? 'All');
    }, [location.pathname, config.forceFilter]);

    useLayoutEffect(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion) return undefined;

        const context = gsap.context(() => {
            const tl = gsap.timeline();

            tl.from('[data-research-title]', {
                y: 32,
                opacity: 0,
                duration: 0.85,
                ease: 'power3.out',
            });

            tl.from(
                '[data-research-subtitle]',
                {
                    y: 18,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power3.out',
                },
                '-=0.5'
            );

            tl.from(
                '[data-research-area]',
                {
                    y: 24,
                    opacity: 0,
                    duration: 0.65,
                    stagger: 0.08,
                    ease: 'power3.out',
                },
                '-=0.35'
            );

            tl.from(
                '[data-research-content]',
                {
                    y: 24,
                    opacity: 0,
                    duration: 0.7,
                    ease: 'power3.out',
                },
                '-=0.4'
            );

            gsap.from('[data-featured-copy], [data-recent-update]', {
                scrollTrigger: {
                    trigger: '[data-featured-section]',
                    start: 'top 78%',
                },
                y: 32,
                opacity: 0,
                duration: 0.75,
                stagger: 0.1,
                ease: 'power3.out',
            });

            gsap.to('[data-indic-glyph]', {
                y: (index) => (index % 2 ? -10 : 10),
                rotation: (index) => (index % 2 ? 4 : -4),
                duration: (index) => 2.8 + (index % 3) * 0.45,
                stagger: 0.12,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });

            gsap.fromTo(
                '[data-wave-bar]',
                { scaleY: 0.28 },
                {
                    scaleY: (index) => 0.55 + (index % 5) * 0.12,
                    duration: 0.65,
                    stagger: { each: 0.055, from: 'center' },
                    repeat: -1,
                    yoyo: true,
                    ease: 'sine.inOut',
                }
            );
        }, pageRef);

        return () => context.revert();
    }, [view]);

    useLayoutEffect(() => {
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduceMotion || !postListRef.current) return undefined;

        const context = gsap.context(() => {
            gsap.fromTo(
                '[data-publication-row]',
                { y: 18, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.55,
                    stagger: 0.075,
                    ease: 'power3.out',
                    clearProps: 'transform,opacity',
                }
            );
        }, postListRef);

        return () => context.revert();
    }, [activeFilter, view]);

    const featured = getFeaturedPost();

    const filteredPosts = useMemo(() => {
        if (view === 'publications') {
            return posts.filter((post) => post.category === 'Publication');
        }
        if (view === 'blog') {
            return posts;
        }
        if (activeFilter === 'All') return posts;
        return posts.filter((post) => post.category === activeFilter);
    }, [view, activeFilter]);

    return (
        <div ref={pageRef} className="min-h-screen research-page">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6">
                <div className="pt-12 md:pt-16 pb-8 md:pb-12">
                    <p className="research-type-eyebrow text-[var(--text-orange-500)] mb-3">
                        Research
                        {view !== 'overview' && (
                            <>
                                <span className="mx-2 text-[var(--color-14)]">·</span>
                                <span className="text-[var(--color-11)]">{config.title}</span>
                            </>
                        )}
                    </p>
                    <h1
                        data-research-title
                        className="text-4xl md:text-5xl font-semibold text-[var(--text-primary)] tracking-tight"
                    >
                        {config.title}
                    </h1>
                    {config.subtitle && (
                        <p
                            data-research-subtitle
                            className="mt-4 max-w-2xl text-[var(--color-10)] leading-relaxed font-serif text-[17px]"
                        >
                            {config.subtitle}
                        </p>
                    )}
                </div>

                {config.showAreas && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 pb-12 md:pb-16 border-b research-divider">
                        {researchAreas.map(({ title, description }) => (
                            <div key={title} data-research-area>
                                <h2 className="text-base font-semibold text-[var(--text-primary)] mb-2 font-serif">
                                    {title}
                                </h2>
                                <p className="text-sm text-[var(--color-10)] leading-relaxed">
                                    {description}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {config.showFeatured && featured && (
                    <section data-featured-section className="py-12 md:py-16 border-b research-divider">
                        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16">
                            <div className="lg:col-span-3" data-featured-copy>
                                <Link to={`/research/${featured.slug}`} className="group block">
                                    <div className="aspect-[16/9] research-featured-gradient research-language-constellation rounded-xl mb-6 flex items-center justify-center overflow-hidden border border-[var(--primary-100)]">
                                        <div className="research-indic-orbit" aria-hidden="true">
                                            {INDIC_GLYPHS.map((glyph, index) => (
                                                <span
                                                    key={`${glyph}-${index}`}
                                                    data-indic-glyph
                                                    className={`research-indic-glyph research-indic-glyph-${index + 1}`}
                                                >
                                                    {glyph}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="research-asr-wave" aria-hidden="true">
                                            {Array.from({ length: 19 }, (_, index) => (
                                                <span key={index} data-wave-bar />
                                            ))}
                                        </div>
                                        <div className="text-center px-8 relative z-10">
                                            <p className="text-xs uppercase tracking-wider text-[var(--text-orange-500)] mb-2 font-medium">
                                                Featured
                                            </p>
                                            <p className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] leading-snug">
                                                Accurate speech recognition for 25 Indian languages
                                            </p>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--text-orange-500)] transition-colors leading-snug mb-3">
                                        {featured.title}
                                    </h2>
                                    <p className="text-[var(--color-10)] leading-relaxed font-serif text-[17px]">
                                        {featured.heroSummary}
                                    </p>
                                </Link>
                            </div>

                            <div className="lg:col-span-2 space-y-0">
                                <p className="text-xs uppercase tracking-wider text-[var(--color-11)] mb-6">
                                    Recent updates
                                </p>
                                {posts.slice(0, 3).map((post, i) => (
                                    <Link
                                        key={post.slug}
                                        to={`/research/${post.slug}`}
                                        data-recent-update
                                        className={`block py-5 group ${i > 0 ? 'border-t research-divider' : ''}`}
                                    >
                                        <p className="text-xs uppercase tracking-wider text-[var(--color-11)] mb-2">
                                            {post.category} · {formatDate(post.date)}
                                        </p>
                                        <h3 className="text-base font-semibold text-[var(--text-primary)] group-hover:text-[var(--text-orange-500)] transition-colors mb-2 leading-snug">
                                            {post.title}
                                        </h3>
                                        <p className="text-sm text-[var(--color-10)] leading-relaxed line-clamp-2">
                                            {post.summary}
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                <section className="py-12 md:pb-16" data-research-content>
                    {config.listTitle && (
                        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-8">
                            {config.listTitle}
                        </h2>
                    )}

                    {view === 'overview' && (
                        <div className="flex flex-wrap gap-6 mb-10">
                            {FILTERS.map((filter) => (
                                <button
                                    key={filter}
                                    type="button"
                                    onClick={() => setActiveFilter(filter)}
                                    className={`text-sm transition-colors ${
                                        activeFilter === filter
                                            ? 'text-[var(--text-orange-500)] font-semibold'
                                            : 'text-[var(--color-11)] hover:text-[var(--text-primary)]'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    )}

                    <div ref={postListRef} className="divide-y divide-[var(--primary-100)]">
                        {filteredPosts.map((post) => (
                            <Link
                                key={post.slug}
                                to={`/research/${post.slug}`}
                                data-publication-row
                                className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 md:gap-12 py-8 group transition-colors hover:bg-[var(--bg-cream-50)]/60 -mx-4 px-4 rounded-lg"
                            >
                                <div>
                                    <p className="text-sm text-[var(--color-10)]">{post.category}</p>
                                    <p className="text-sm text-[var(--color-11)] mt-1">
                                        {formatDate(post.date)}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-xl md:text-2xl font-semibold text-[var(--text-primary)] group-hover:text-[var(--text-orange-500)] transition-colors mb-2 leading-snug">
                                        {post.title}
                                    </h3>
                                    <p className="text-[var(--color-10)] leading-relaxed font-serif text-[17px]">
                                        {post.summary}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {filteredPosts.length === 0 && (
                        <p className="text-[var(--color-11)] py-12 text-center">
                            {config.emptyMessage}
                        </p>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default ResearchPage;
