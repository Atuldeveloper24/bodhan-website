import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BookOpen, Boxes, ChevronDown, CircleDollarSign, Menu, Users, X } from 'lucide-react';
import gsap from 'gsap';

import Icon from '../../../assets/Icon.png';
import MoELogo from '../../../assets/Ministry_of_Education_India.png';
import ModelIcon from '../../developers/components/ModelIcon';
import { models } from '../../developers/data/models';
import { CONSOLE_URL } from '../../../config/links';

const researchDropdown = [
    {
        label: 'Research Problems',
        to: '/research/problems',
        description: 'Open problems in AI for education',
    },
    { label: 'Blog', to: '/research/blog', description: 'Technical posts and releases' },
    { label: 'Publications', to: '/research/publications', description: 'Papers and formal publications' },
];

const developersApis = models.map((model) => ({
    label: model.name,
    to: model.href,
    description: model.codename,
    icon: model.icon,
    accent: model.accent,
}));

// Placeholder destinations — wire these up to real pages once they exist.
const RESOURCE_ICONS = { docs: BookOpen, pricing: CircleDollarSign, integrations: Boxes, community: Users };
const developersResources = [
    { label: 'Documentation', to: '#', description: 'Guides and API reference', icon: 'docs', accent: 'var(--model-emerald)' },
    { label: 'API Pricing', to: '#', description: 'Usage-based pricing', icon: 'pricing', accent: 'var(--brand-blue)' },
    { label: 'Integrations', to: '#', description: 'Connect Bodhan to your stack', icon: 'integrations', accent: 'var(--text-orange-500)' },
    { label: 'Community', to: '#', description: 'Get help, share what you build', icon: 'community', accent: 'var(--model-violet)' },
];

const developersDropdown = [...developersApis, { label: 'All models', to: '/developers', description: 'Browse every Bodhan model' }];

const navLinks = [
    { label: 'Vision', to: '/', scrollTo: 'vision-mission' },
    { label: 'Research', to: '/research', children: researchDropdown, match: '/research' },
    {
        label: 'Developers',
        to: '/developers',
        children: developersDropdown,
        mega: { apis: developersApis, resources: developersResources },
        match: '/developers',
    },
    { label: 'Team', to: '/', scrollTo: 'team' },
    { label: 'Careers', to: '/careers' },
    { label: 'Contact', to: '/contact' },
    { label: 'Tenders', to: '/tenders' },
    { label: 'Partners', to: '/partners' },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(null);
    const [mobileMenu, setMobileMenu] = useState(null);
    const menuWrapRefs = useRef({});
    const dropdownRefs = useRef({});
    const mobileRefs = useRef({});
    const location = useLocation();

    const isCreamPage =
        location.pathname.startsWith('/research') || location.pathname.startsWith('/developers');

    useEffect(() => {
        setIsOpen(false);
        setOpenMenu(null);
        setMobileMenu(null);
    }, [location.pathname]);

    useLayoutEffect(() => {
        const entries = Object.entries(dropdownRefs.current).filter(([, el]) => el);
        if (entries.length === 0) return undefined;

        const ctx = gsap.context(() => {
            entries.forEach(([label, el]) => {
                if (label === openMenu) {
                    gsap.fromTo(
                        el,
                        { autoAlpha: 0, y: -6, scale: 0.98, transformOrigin: 'top left' },
                        { autoAlpha: 1, y: 0, scale: 1, duration: 0.32, ease: 'power3.out' }
                    );
                    gsap.fromTo(
                        el.querySelectorAll('[data-dropdown-item]'),
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
                    gsap.to(el, { autoAlpha: 0, y: -6, scale: 0.98, duration: 0.2, ease: 'power2.in' });
                }
            });
        });

        return () => ctx.revert();
    }, [openMenu]);

    useLayoutEffect(() => {
        const entries = Object.entries(mobileRefs.current).filter(([, el]) => el);
        if (entries.length === 0) return undefined;

        const ctx = gsap.context(() => {
            entries.forEach(([label, el]) => {
                if (label === mobileMenu) {
                    gsap.fromTo(
                        el,
                        { height: 0, opacity: 0 },
                        {
                            height: 'auto',
                            opacity: 1,
                            duration: 0.32,
                            ease: 'power3.out',
                            onComplete: () => gsap.set(el, { clearProps: 'height' }),
                        }
                    );
                    gsap.fromTo(
                        el.querySelectorAll('[data-mobile-item]'),
                        { x: -8, autoAlpha: 0 },
                        { x: 0, autoAlpha: 1, duration: 0.3, stagger: 0.04, delay: 0.06, ease: 'power2.out' }
                    );
                } else {
                    gsap.to(el, { height: 0, opacity: 0, duration: 0.24, ease: 'power2.in' });
                }
            });
        });

        return () => ctx.revert();
    }, [mobileMenu]);

    useEffect(() => {
        if (!openMenu) return undefined;

        const onPointerDown = (event) => {
            if (!menuWrapRefs.current[openMenu]?.contains(event.target)) {
                setOpenMenu(null);
            }
        };

        const onKeyDown = (event) => {
            if (event.key === 'Escape') setOpenMenu(null);
        };

        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('keydown', onKeyDown);
        };
    }, [openMenu]);

    const handleNavClick = (link) => {
        setIsOpen(false);
        setOpenMenu(null);
        setMobileMenu(null);
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
        if (to === '/research' || to === '/developers') return location.pathname === to;
        return location.pathname === to || location.pathname.startsWith(`${to}/`);
    };

    return (
        <nav
            className={`sticky top-0 z-50 w-full backdrop-blur-sm border-b ${
                isCreamPage
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
                        <img src={Icon} alt="Bodhan" className="h-10 md:h-11 w-auto object-contain" />
                        <div className="w-px h-7 bg-[var(--primary-100)]" />
                        <img
                            src={MoELogo}
                            alt="Ministry of Education"
                            className="h-9 md:h-10 w-auto object-contain"
                        />
                    </Link>

                    <div className="hidden lg:flex items-center gap-6 ml-8">
                        {navLinks.map((link) => {
                            if (link.children) {
                                const menuActive = link.match && location.pathname.startsWith(link.match);
                                const isThisOpen = openMenu === link.label;
                                return (
                                    <div
                                        key={link.label}
                                        ref={(el) => {
                                            menuWrapRefs.current[link.label] = el;
                                        }}
                                        className="relative"
                                        onMouseEnter={() => setOpenMenu(link.label)}
                                        onMouseLeave={() => setOpenMenu(null)}
                                    >
                                        <button
                                            type="button"
                                            className={`${linkClass} inline-flex items-center gap-1 ${
                                                menuActive ? 'text-[var(--text-orange-500)] font-medium' : ''
                                            }`}
                                            aria-expanded={isThisOpen}
                                            aria-haspopup="true"
                                            onClick={() => setOpenMenu((current) => (current === link.label ? null : link.label))}
                                        >
                                            {link.label}
                                            <ChevronDown
                                                size={14}
                                                className={`transition-transform duration-300 ${
                                                    isThisOpen ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>

                                        <div
                                            ref={(el) => {
                                                dropdownRefs.current[link.label] = el;
                                            }}
                                            className="absolute left-0 top-full pt-3 invisible opacity-0"
                                        >
                                            {link.mega ? (
                                                <div className="nav-research-dropdown nav-mega-dropdown rounded-2xl overflow-hidden">
                                                    <div className="nav-research-dropdown-glow" aria-hidden="true" />
                                                    <div className="nav-mega-grid relative">
                                                        <div className="nav-mega-col">
                                                            <p className="nav-mega-col-title">APIs</p>
                                                            {link.mega.apis.map((child) => {
                                                                const active = isChildActive(child.to);
                                                                return (
                                                                    <Link
                                                                        key={child.label}
                                                                        to={child.to}
                                                                        data-dropdown-item
                                                                        onClick={() => handleNavClick(child)}
                                                                        className={`nav-research-item group ${active ? 'is-active' : ''}`}
                                                                        style={child.accent ? { '--model-accent': child.accent } : undefined}
                                                                    >
                                                                        <span className="nav-model-icon" aria-hidden="true">
                                                                            <ModelIcon name={child.icon} size={16} />
                                                                        </span>
                                                                        <span className="min-w-0 flex-1">
                                                                            <span className="nav-research-item-label">{child.label}</span>
                                                                            <span className="nav-research-item-desc">{child.description}</span>
                                                                        </span>
                                                                    </Link>
                                                                );
                                                            })}
                                                            <Link
                                                                to="/developers"
                                                                data-dropdown-item
                                                                onClick={() => handleNavClick({})}
                                                                className="nav-mega-viewall"
                                                            >
                                                                View all models
                                                            </Link>
                                                        </div>
                                                        <div className="nav-mega-col nav-mega-col-resources">
                                                            <p className="nav-mega-col-title">Resources</p>
                                                            {link.mega.resources.map((child) => {
                                                                const ResourceIcon = RESOURCE_ICONS[child.icon];
                                                                return (
                                                                    <Link
                                                                        key={child.label}
                                                                        to={child.to}
                                                                        data-dropdown-item
                                                                        onClick={() => handleNavClick(child)}
                                                                        className="nav-research-item group"
                                                                        style={child.accent ? { '--model-accent': child.accent } : undefined}
                                                                    >
                                                                        <span className="nav-model-icon" aria-hidden="true">
                                                                            {ResourceIcon && <ResourceIcon size={16} />}
                                                                        </span>
                                                                        <span className="min-w-0 flex-1">
                                                                            <span className="nav-research-item-label">{child.label}</span>
                                                                            <span className="nav-research-item-desc">{child.description}</span>
                                                                        </span>
                                                                    </Link>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className={`nav-research-dropdown rounded-2xl overflow-hidden ${
                                                        link.children.some((child) => child.icon) ? 'w-80' : 'w-72'
                                                    }`}
                                                >
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
                                                                    style={child.accent ? { '--model-accent': child.accent } : undefined}
                                                                >
                                                                    {child.icon ? (
                                                                        <span className="nav-model-icon" aria-hidden="true">
                                                                            <ModelIcon name={child.icon} size={16} />
                                                                        </span>
                                                                    ) : (
                                                                        <span className="nav-research-item-indicator" aria-hidden="true" />
                                                                    )}
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
                                            )}
                                        </div>
                                    </div>
                                );
                            }

                            return <span key={link.label}>{renderLink(link, linkClass)}</span>;
                        })}

                        <a href={CONSOLE_URL} className="nav-dashboard-btn">
                            Go to Dashboard
                            <ArrowUpRight size={14} aria-hidden="true" />
                        </a>
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
                        isCreamPage ? 'bg-[var(--bg-cream-50)]' : 'bg-[var(--navbar-bg)]'
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
                                const menuActive = link.match && location.pathname.startsWith(link.match);
                                const isThisOpen = mobileMenu === link.label;
                                return (
                                    <div key={link.label} className="py-1">
                                        <button
                                            type="button"
                                            className={`w-full flex items-center justify-between text-base py-2.5 transition-colors ${
                                                menuActive
                                                    ? 'text-[var(--text-orange-500)] font-medium'
                                                    : 'text-[var(--color-10)]'
                                            }`}
                                            onClick={() => setMobileMenu((current) => (current === link.label ? null : link.label))}
                                            aria-expanded={isThisOpen}
                                        >
                                            {link.label}
                                            <ChevronDown
                                                size={16}
                                                className={`transition-transform duration-300 ${
                                                    isThisOpen ? 'rotate-180' : ''
                                                }`}
                                            />
                                        </button>
                                        <div
                                            ref={(el) => {
                                                mobileRefs.current[link.label] = el;
                                            }}
                                            className="overflow-hidden"
                                            style={{ height: 0, opacity: 0 }}
                                        >
                                            <div className="ml-3 pl-3 border-l border-[var(--primary-100)] flex flex-col gap-0.5 pb-2">
                                                {link.children.map((child) => (
                                                    <Link
                                                        key={child.label}
                                                        to={child.to}
                                                        data-mobile-item
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

                        <a href={CONSOLE_URL} className="nav-dashboard-btn nav-dashboard-btn-mobile">
                            Go to Dashboard
                            <ArrowUpRight size={15} aria-hidden="true" />
                        </a>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
