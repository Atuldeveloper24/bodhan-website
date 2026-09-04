import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BookOpen, ChevronDown, CircleDollarSign, Menu, Plug, X } from 'lucide-react';
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

function DiscordIcon({ size = 16 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
        </svg>
    );
}

const RESOURCE_ICONS = {
    docs: BookOpen,
    pricing: CircleDollarSign,
    integrations: Plug,
    discord: DiscordIcon,
};

const developersResources = [
    { label: 'Documentation', to: '#', description: 'Guides and API reference', resourceIcon: 'docs', accent: 'var(--model-emerald)' },
    { label: 'API Pricing', to: '#', description: 'Usage-based pricing', resourceIcon: 'pricing', accent: 'var(--brand-blue)' },
    { label: 'Integrations', to: '#', description: 'Connect Bodhan to your stack', resourceIcon: 'integrations', accent: 'var(--text-orange-500)' },
    { label: 'Join Discord', to: '#', description: 'Community support and updates', resourceIcon: 'discord', accent: 'var(--color-14)' },
];

const developersDropdown = [...developersApis, { label: 'All models', to: '/developers', description: 'Browse every Bodhan model' }];

const productsDropdown = [
    { label: 'Student Bot', to: 'https://students.bodhan.ai', description: 'AI tutor built for the learner' },
    { label: 'Tutor Bot', to: 'https://teachers.bodhan.ai/', description: 'AI copilot built for the teacher' },
];

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
    { label: 'Products', to: '#', children: productsDropdown, match: '/products' },
    { label: 'Team', to: '/', scrollTo: 'team' },
    { label: 'Careers', to: '/careers' },
];

const isExternalLink = (to) => typeof to === 'string' && to.startsWith('http');

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

    const renderNavItem = (child, { active, dataAttr, hideArrow = false }) => {
        const className = `nav-research-item group ${active ? 'is-active' : ''}`;
        const style = child.accent ? { '--model-accent': child.accent } : undefined;
        const onClick = () => handleNavClick(child);

        const ResourceIcon = child.resourceIcon ? RESOURCE_ICONS[child.resourceIcon] : null;

        const body = (
            <>
                {child.icon ? (
                    <span className="nav-model-icon" aria-hidden="true">
                        <ModelIcon name={child.icon} size={16} />
                    </span>
                ) : ResourceIcon ? (
                    <span className="nav-model-icon" aria-hidden="true">
                        <ResourceIcon size={16} />
                    </span>
                ) : (
                    <span className="nav-research-item-indicator" aria-hidden="true" />
                )}
                <span className="min-w-0 flex-1">
                    <span className="nav-research-item-label">{child.label}</span>
                    {child.description && (
                        <span className="nav-research-item-desc">{child.description}</span>
                    )}
                </span>
                {!hideArrow && (
                    <ArrowRight size={14} className="nav-research-item-arrow" aria-hidden="true" />
                )}
            </>
        );

        if (isExternalLink(child.to)) {
            return (
                <a
                    key={child.label}
                    href={child.to}
                    target="_blank"
                    rel="noopener noreferrer"
                    {...(dataAttr ? { [dataAttr]: true } : {})}
                    className={className}
                    style={style}
                    onClick={onClick}
                >
                    {body}
                </a>
            );
        }

        return (
            <Link
                key={child.label}
                to={child.to}
                {...(dataAttr ? { [dataAttr]: true } : {})}
                className={className}
                style={style}
                onClick={onClick}
            >
                {body}
            </Link>
        );
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
                        <span className="hidden sm:inline text-xl font-medium text-gray-900 whitespace-nowrap">
                            Bodhan<span className="text-[var(--text-orange-500)]">.AI</span>
                        </span>
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
                                                            {link.mega.apis.map((child) =>
                                                                renderNavItem(child, {
                                                                    active: isChildActive(child.to),
                                                                    dataAttr: 'data-dropdown-item',
                                                                    hideArrow: true,
                                                                })
                                                            )}
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
                                                            {link.mega.resources.map((child) =>
                                                                renderNavItem(child, {
                                                                    active: false,
                                                                    dataAttr: 'data-dropdown-item',
                                                                    hideArrow: true,
                                                                })
                                                            )}
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
                                                        {link.children.map((child) =>
                                                            renderNavItem(child, {
                                                                active: isChildActive(child.to),
                                                                dataAttr: 'data-dropdown-item',
                                                            })
                                                        )}
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
                                                {link.mega ? (
                                                    <>
                                                        <p className="pt-1 text-[11px] font-bold uppercase tracking-wider text-[var(--color-14)]">
                                                            APIs
                                                        </p>
                                                        {link.mega.apis.map((child) => {
                                                            const className = `py-2 text-sm transition-colors ${
                                                                isChildActive(child.to)
                                                                    ? 'text-[var(--text-orange-500)] font-medium'
                                                                    : 'text-[var(--color-10)] hover:text-[var(--text-orange-500)]'
                                                            }`;
                                                            return isExternalLink(child.to) ? (
                                                                <a
                                                                    key={child.label}
                                                                    href={child.to}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    data-mobile-item
                                                                    onClick={() => handleNavClick(child)}
                                                                    className={className}
                                                                >
                                                                    {child.label}
                                                                </a>
                                                            ) : (
                                                                <Link
                                                                    key={child.label}
                                                                    to={child.to}
                                                                    data-mobile-item
                                                                    onClick={() => handleNavClick(child)}
                                                                    className={className}
                                                                >
                                                                    {child.label}
                                                                </Link>
                                                            );
                                                        })}
                                                        <Link
                                                            to="/developers"
                                                            data-mobile-item
                                                            onClick={() => handleNavClick({})}
                                                            className="py-2 text-sm text-[var(--color-11)] hover:text-[var(--text-orange-500)]"
                                                        >
                                                            View all models
                                                        </Link>
                                                        <p className="pt-2 text-[11px] font-bold uppercase tracking-wider text-[var(--color-14)]">
                                                            Resources
                                                        </p>
                                                        {link.mega.resources.map((child) =>
                                                            isExternalLink(child.to) ? (
                                                                <a
                                                                    key={child.label}
                                                                    href={child.to}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    data-mobile-item
                                                                    onClick={() => handleNavClick(child)}
                                                                    className="py-2 text-sm text-[var(--color-10)] hover:text-[var(--text-orange-500)]"
                                                                >
                                                                    {child.label}
                                                                </a>
                                                            ) : (
                                                                <Link
                                                                    key={child.label}
                                                                    to={child.to}
                                                                    data-mobile-item
                                                                    onClick={() => handleNavClick(child)}
                                                                    className="py-2 text-sm text-[var(--color-10)] hover:text-[var(--text-orange-500)]"
                                                                >
                                                                    {child.label}
                                                                </Link>
                                                            )
                                                        )}
                                                    </>
                                                ) : (
                                                    link.children.map((child) =>
                                                        isExternalLink(child.to) ? (
                                                            <a
                                                                key={child.label}
                                                                href={child.to}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                data-mobile-item
                                                                onClick={() => handleNavClick(child)}
                                                                className={`py-2 text-sm transition-colors ${
                                                                    isChildActive(child.to)
                                                                        ? 'text-[var(--text-orange-500)] font-medium'
                                                                        : 'text-[var(--color-10)] hover:text-[var(--text-orange-500)]'
                                                                }`}
                                                            >
                                                                {child.label}
                                                            </a>
                                                        ) : (
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
                                                        )
                                                    )
                                                )}
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
