import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Navbar from '../../home/components/Navbar';
import BodhanMark from '../../../assets/Icon.png';
import { models } from '../data/models';

const GUTTER = '1.25rem'; // how far outside the mark the labels sit
const DOT_GAP = '0.7rem'; // how far short of the mark's own dot a leader stops

const reducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// The mark's own four dots are the anchors — we don't draw dots of our own, we
// just point at them. Each pin is a full-width row at its dot's height, so the
// leader can be measured in percentages of the mark and the label always lands
// in a clean gutter outside the artwork, never on top of it.
const geometry = (dot) =>
    dot.side === 'left'
        ? {
              leader: { left: `-${GUTTER}`, right: `calc(${100 - dot.x}% + ${DOT_GAP})` },
              label: { right: `calc(100% + ${GUTTER})` },
          }
        : {
              leader: { left: `calc(${dot.x}% + ${DOT_GAP})`, right: `-${GUTTER}` },
              label: { left: `calc(100% + ${GUTTER})` },
          };

const DevelopersPage = () => {
    const [activeId, setActiveId] = useState(null);
    const navigate = useNavigate();
    const markRef = useRef(null);
    const sheenRef = useRef(null);
    const eyebrowRef = useRef(null);
    const pinRefs = useRef({});
    const leavingRef = useRef(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useLayoutEffect(() => {
        if (reducedMotion()) return undefined;

        const pins = models.map((m) => pinRefs.current[m.id]).filter(Boolean);

        const ctx = gsap.context(() => {
            gsap.set(markRef.current, {
                y: '-70%',
                scale: 0.82,
                rotate: -12,
                opacity: 0,
                transformOrigin: '50% 15%',
            });
            gsap.set(eyebrowRef.current, { y: -8, opacity: 0 });
            gsap.set(pins, { scale: 0, opacity: 0 });
            gsap.set(sheenRef.current, { left: '-60%', opacity: 0 });

            gsap.timeline({ delay: 0.1 })
                .to(eyebrowRef.current, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out' }, 0)
                .to(markRef.current, { y: 0, scale: 1, opacity: 1, duration: 0.85, ease: 'power3.out' }, 0.1)
                // the "unfold": rotation settles on its own spring, independent of the drop
                .to(markRef.current, { rotate: 0, duration: 1.15, ease: 'elastic.out(1, 0.4)' }, 0.1)
                .to(sheenRef.current, { opacity: 0.5, duration: 0.15 }, 0.4)
                .to(sheenRef.current, { left: '140%', opacity: 0, duration: 0.55, ease: 'power1.in' }, 0.4)
                .to(pins, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(1.8)' }, 0.78)
                .set(markRef.current, { clearProps: 'transform,opacity' });
        });

        return () => ctx.revert();
    }, []);

    // On the way out the mark lifts, banks and flies off before the route changes.
    const flyAway = (href) => (event) => {
        if (
            reducedMotion() ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        ) {
            return; // let the browser/router handle it normally
        }

        event.preventDefault();
        if (leavingRef.current) return;
        leavingRef.current = true;

        const pins = models.map((m) => pinRefs.current[m.id]).filter(Boolean);

        gsap
            .timeline({ onComplete: () => navigate(href) })
            .to(pins, { opacity: 0, y: 6, duration: 0.2, stagger: 0.03, ease: 'power2.in' }, 0)
            .to(eyebrowRef.current, { opacity: 0, duration: 0.25, ease: 'power2.in' }, 0)
            .to(
                markRef.current,
                {
                    y: '-80%',
                    x: '14%',
                    rotate: 16,
                    scale: 0.72,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.in',
                    transformOrigin: '50% 50%',
                },
                0.08
            );
    };

    return (
        <div className="research-page dev-stage-page">
            <Navbar />

            <main className="dev-stage">
                <p className="dev-stage-eyebrow" ref={eyebrowRef}>
                    Developers · Models
                </p>

                <div className={`dev-mark${activeId ? ' has-active' : ''}`} ref={markRef}>
                    <div className="dev-mark-image-wrap">
                        <img src={BodhanMark} alt="The Bodhan mark" className="dev-mark-img" />
                        <span className="dev-mark-sheen" ref={sheenRef} aria-hidden="true" />
                    </div>

                    {models.map((model) => {
                        const { leader, label } = geometry(model.dot);
                        return (
                            <Link
                                key={model.id}
                                to={model.href}
                                className={`dev-pin dev-pin-${model.dot.side}${
                                    activeId === model.id ? ' is-active' : ''
                                }${activeId && activeId !== model.id ? ' is-dimmed' : ''}`}
                                style={{ top: `${model.dot.y}%` }}
                                onMouseEnter={() => setActiveId(model.id)}
                                onMouseLeave={() => setActiveId(null)}
                                onFocus={() => setActiveId(model.id)}
                                onBlur={() => setActiveId(null)}
                                onClick={flyAway(model.href)}
                            >
                                <span
                                    className="dev-pin-visual"
                                    style={{ transformOrigin: `${model.dot.x}% 50%` }}
                                    ref={(el) => {
                                        pinRefs.current[model.id] = el;
                                    }}
                                >
                                    <span className="dev-pin-leader" style={leader} aria-hidden="true" />
                                    <span className="dev-pin-label" style={label}>
                                        <span className="dev-pin-name">{model.name}</span>
                                        <span className="dev-pin-codename">{model.codename}</span>
                                    </span>
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default DevelopersPage;
