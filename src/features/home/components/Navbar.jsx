import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react';
import gsap from 'gsap';

import Icon from '../../../assets/Icon.png';
import MoELogo from '../../../assets/Ministry_of_Education_India.png';

const researchDropdown = [
    { label: 'Overview', to: '/research', description: 'Areas, featured work, and updates' },
    { label: 'Blog', to: '/research/blog', description: 'Technical posts and releases' },
    { label: 'Publications', to: '/research/publications', description: 'Papers and formal publications' },
    { label: 'Models', to: '/research/models', description: 'Model cards and demos' },
    {
        label: 'Research Problems',
        to: '/research/problems',
        description: 'Open problems in AI for education',
    },
];

const navLinks = [
    { label: 'Vision', to: '/', scrollTo: 'vision-mission' },
    { label: 'Research', to: '/research', children: researchDropdown },
    { label: 'Team', to: '/', scrollTo: 'team' },
    { label: 'Careers', to: '/careers' },
    { label: 'Contact', to: '/contact' },
    { label: 'Tenders', to: '/tenders' },
    { label: 'Partners', to: '/partners' },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [researchOpen, setResearchOpen] = useState(false);
    const [mobileResearchOpen, setMobileResearchOpen] = useState(false);
    const researchMenuRef = useRef(null);
    const dropdownRef = useRef(null);
    const mobileResearchRef = useRef(null);
    const location = useLocation();

    const isResearch = location.pathname.startsWith('/research');

    useEffect(() => {
        setIsOpen(false);
        setResearchOpen(false);
        setMobileResearchOpen(false);
    }, [location.pathname]);

    useLayoutEffect(() => {
        if (!dropdownRef.current) return;

        const ctx = gsap.context(() => {
            if (researchOpen) {
                gsap.fromTo(
                    dropdownRef.current,
                    { autoAlpha: 0, y: -6, scale: 0.98, transformOrigin: 'top left' },
                    {
                        autoAlpha: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.32,
                        ease: 'power3.out',
                    }
                );
                gsap.fromTo(
                    '[data-dropdown-item]',
                    { y: 10, autoAlpha: 0 },
                    {
                        y: 0,
                        autoAlpha: 1,
                        duration: 0.38,
                        stagger: 0.045,
                        delay: 0.03,
                        ease: 'power3.out',
                    }
                );
            } else {
                gsap.to(dropdownRef.current, {
                    autoAlpha: 0,
                    y: -6,
                    scale: 0.98,
                    duration: 0.2,
                    ease: 'power2.in',
                });
            }
        }, researchMenuRef);

        return () => ctx.revert();
    }, [researchOpen]);

    useLayoutEffect(() => {
        if (!mobileResearchRef.current) return;

        const ctx = gsap.context(() => {
            if (mobileResearchOpen) {
                gsap.fromTo(
                    mobileResearchRef.current,
                    { height: 0, opacity: 0 },
                    {
                        height: 'auto',
                        opacity: 1,
                        duration: 0.32,
                        ease: 'power3.out',
                        onComplete: () => gsap.set(mobileResearchRef.current, { clearProps: 'height' }),
                    }
                );
                gsap.fromTo(
                    '[data-mobile-research-item]',
                    { x: -8, autoAlpha: 0 },
                    {
                        x: 0,
                        autoAlpha: 1,
                        duration: 0.3,
                        stagger: 0.04,
                        delay: 0.06,
                        ease: 'power2.out',
                    }
                );
            } else {
                gsap.to(mobileResearchRef.current, {
                    height: 0,
                    opacity: 0,
                    duration: 0.24,
                    ease: 'power2.in',
                });
            }
        }, mobileResearchRef);

        return () => ctx.revert();
    }, [mobileResearchOpen]);

    useEffect(() => {
        if (!researchOpen) return undefined;

        const onPointerDown = (event) => {
            if (!researchMenuRef.current?.contains(event.target)) {
                setResearchOpen(false);
            }
        };

        const onKeyDown = (event) => {
            if (event.key === 'Escape') setResearchOpen(false);
        };

        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [researchOpen]);

    const handleNavClick = (link) => {
        setIsOpen(false);
        setResearchOpen(false);
        setMobileResearchOpen(false);
        if (!link.scrollTo) {
            window.scrollTo(0, 0);
        }
    };

    const linkClass =
                'text-sm text-[var(--color-10)] hover:text-[var(--text-orange-500)] focus-visible:text-[var(--text-orange-500)] transition-colors whitespace-nowrap min-h-11 inline-flex items-center';

    const renderLink = (link, className) => {
        if (link.children) {
            return null;
        }

        if (link.scrollTo) {
            return (
                <Link
                    to={link.to}
                    state={{ scrollTo: link.scrollTo }}
                    className={className}
                    onClick={() => handleNavClick(link)}
                >
                    {link.label}
                </Link>
            );
        }

        return (
            <Link to={link.to} className={className} onClick={() => handleNavClick(link)}>
                {link.label}
            </Link>
        );
    };

    const isChildActive = (to) => {
        if (to === '/research') return location.pathname === '/research';
        return location.pathname === to || location.pathname.startsWith(`${to}/`);
    };

    return (
        <nav
            className={`sticky top-0 z-50 w-full backdrop-blur-sm border-b ${
                isResearch
                    ? 'bg-[var(--bg-cream-50)]/95 border-[var(--primary-100)]'
                    : 'bg-[var(--navbar-bg)]/95 border-[var(--primary-100)]'
            }`}
        >
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-between h-16 md:h-[4.5rem]">
                    <Link
                        to="/"
                        onClick={() => window.scrollTo(0, 0)}
                        className="flex items-center gap-2.5 shrink-0"
                    >
                        <img
                            src={MoELogo}
                            alt="Ministry of Education"
                            className="h-9 md:h-10 w-auto object-contain"
                        />
                        <div className="w-px h-7 bg-[var(--primary-100)]" />
                        <img src={Icon} alt="Bodhan" className="h-10 md:h-11 w-auto object-contain" />
                    </Link>

                    <div className="hidden lg:flex items-center gap-8 ml-10">
                        {navLinks.map((link) => {
                            if (link.children) {
                                return (
                                    <div
                                        key={link.label}
                                        ref={researchMenuRef}
                                        className="relative"
                                        onMouseEnter={() => setResearchOpen(true)}
                                        onMouseLeave={() => setResearchOpen(false)}
                                    >
                                        <button
                                            type="button"
                                            className={`${linkClass} inline-flex items-center gap-1 ${
                                                isResearch ? 'text-[var(--text-orange-500)] font-medium' : ''
                                            }`}
                                            aria-expanded={researchOpen}
                                            aria-haspopup="true"
                                            onClick={() => setResearchOpen((open) => !open)}
                                        >
                                            {link.label}
                                            <ChevronDown
                                                size={14}
                                                className={`transition-transform duration-300 ${
                                                    researchOpen ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>

                                        <div
                                            ref={dropdownRef}
                                            className="absolute left-0 top-full pt-3 invisible opacity-0"
                                        >
                                            <div className="nav-research-dropdown w-72 rounded-2xl overflow-hidden">
                                                <div className="nav-research-dropdown-glow" aria-hidden="true" />
                                                <div className="relative p-2">
                                                    {link.children.map((child) => {
                                                        const active = isChildActive(child.to);
                                                        return (
                                                            <Link
                                                                key={child.label}
                                                                to={child.to}
                                                                data-dropdown-item
                                                                onClick={() => handleNavClick(child)}
                                                                className={`nav-research-item group ${active ? 'is-active' : ''}`}
                                                            >
                                                                <span className="nav-research-item-indicator" aria-hidden="true" />
                                                                <span className="min-w-0 flex-1">
                                                                    <span className="nav-research-item-label">
                                                                        {child.label}
                                                                    </span>
                                                                    <span className="nav-research-item-desc">
                                                                        {child.description}
                                                                    </span>
                                                                </span>
                                                                <ArrowRight
                                                                    size={14}
                                                                    className="nav-research-item-arrow"
                                                                    aria-hidden="true"
                                                                />
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return <span key={link.label}>{renderLink(link, linkClass)}</span>;
                        })}
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden text-[var(--text-primary)] hover:text-[var(--text-orange-500)] transition-colors p-2 -mr-2"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div
                    className={`lg:hidden border-t border-[var(--primary-100)] ${
                        isResearch ? 'bg-[var(--bg-cream-50)]' : 'bg-[var(--navbar-bg)]'
                    }`}
                >
                    <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1">
                        <Link
                            to="/"
                            className="text-base text-[var(--color-10)] hover:text-[var(--text-orange-500)] py-2.5 transition-colors"
                            onClick={() => {
                                setIsOpen(false);
                                window.scrollTo(0, 0);
                            }}
                        >
                            Home
                        </Link>
                        {navLinks.map((link) => {
                            if (link.children) {
                                return (
                                    <div key={link.label} className="py-1">
                                        <button
                                            type="button"
                                            className={`w-full flex items-center justify-between text-base py-2.5 transition-colors ${
                                                isResearch
                                                    ? 'text-[var(--text-orange-500)] font-medium'
                                                    : 'text-[var(--color-10)]'
                                            }`}
                                            onClick={() => setMobileResearchOpen((open) => !open)}
                                            aria-expanded={mobileResearchOpen}
                                        >
                                            {link.label}
                                            <ChevronDown
                                                size={16}
                                                className={`transition-transform duration-300 ${
                                                    mobileResearchOpen ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>
                                        <div
                                            ref={mobileResearchRef}
                                            className="overflow-hidden"
                                            style={{ height: 0, opacity: 0 }}
                                        >
                                            <div className="ml-3 pl-3 border-l border-[var(--primary-100)] flex flex-col gap-0.5 pb-2">
                                                {link.children.map((child) => (
                                                    <Link
                                                        key={child.label}
                                                        to={child.to}
                                                        data-mobile-research-item
                                                        onClick={() => handleNavClick(child)}
                                                        className={`py-2 text-sm transition-colors ${
                                                            isChildActive(child.to)
                                                                ? 'text-[var(--text-orange-500)] font-medium'
                                                                : 'text-[var(--color-10)] hover:text-[var(--text-orange-500)]'
                                                        }`}
                                                    >
                                                        {child.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <span key={link.label}>
                                    {renderLink(
                                        link,
                                        'block text-base text-[var(--color-10)] hover:text-[var(--text-orange-500)] py-2.5 transition-colors'
                                    )}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
