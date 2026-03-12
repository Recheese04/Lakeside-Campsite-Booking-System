import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CalendarDays, ChevronDown, MapPin, Star } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroVideo from '@/images/campsitevid.mp4';

/* ── Typewriter phrases ── */
const PHRASES = [
    'Meets Serenity',
    'Feels Like Home',
    'Comes Alive',
    'Inspires Adventure',
    'Heals the Soul',
];

/* ── Magnetic button wrapper ── */
const MagneticButton = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 250, damping: 20 });
    const springY = useSpring(y, { stiffness: 250, damping: 20 });

    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
    };

    return (
        <motion.div
            className={className}
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouse}
            onMouseLeave={() => { x.set(0); y.set(0); }}
        >
            {children}
        </motion.div>
    );
};

/* ── Word-by-word stagger animation ── */
const SplitText = ({ text, className = '', delay = 0 }: { text: string; className?: string; delay?: number }) => {
    const words = text.split(' ');
    return (
        <span className={className}>
            {words.map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-[0.3em] pb-[0.15em] mb-[-0.15em]">
                    <motion.span
                        className="inline-block"
                        initial={{ y: '120%', rotateX: -40 }}
                        animate={{ y: '0%', rotateX: 0 }}
                        transition={{
                            duration: 0.7,
                            delay: delay + i * 0.08,
                            ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                    >
                        {word}
                    </motion.span>
                </span>
            ))}
        </span>
    );
};

/* ── Typewriter — renders inline, same size as h1 ── */
const Typewriter = ({ delay = 1.4 }: { delay?: number }) => {
    const [displayed, setDisplayed] = useState('');
    const state = useRef({ phraseIdx: 0, charIdx: 0, isDeleting: false, pauseUntil: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const s = state.current;
            const now = Date.now();
            if (now < s.pauseUntil) return;

            const full = PHRASES[s.phraseIdx];

            if (!s.isDeleting) {
                s.charIdx++;
                setDisplayed(full.substring(0, s.charIdx));
                if (s.charIdx >= full.length) {
                    s.isDeleting = true;
                    s.pauseUntil = now + 1800;
                }
            } else {
                s.charIdx--;
                setDisplayed(full.substring(0, s.charIdx));
                if (s.charIdx <= 0) {
                    s.isDeleting = false;
                    s.phraseIdx = (s.phraseIdx + 1) % PHRASES.length;
                    s.pauseUntil = now + 400;
                }
            }
        }, 60);
        return () => clearInterval(interval);
    }, []);

    const lastSpaceIdx = displayed.lastIndexOf(' ');
    let firstPart = '';
    let lastPart = '';

    if (lastSpaceIdx !== -1) {
        firstPart = displayed.substring(0, lastSpaceIdx + 1);
        lastPart = displayed.substring(lastSpaceIdx + 1);
    } else {
        lastPart = displayed;
    }

    return (
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay, duration: 0.6 }}
            className="inline-flex flex-wrap items-baseline mt-1 sm:mt-0"
        >
            <span className="text-white whitespace-pre-wrap">{firstPart}</span>
            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                {lastPart}
            </span>
            {/* Blinking cursor — vertically aligned */}
            <motion.span
                className="inline-block w-[3px] sm:w-[4px] h-[0.6em] bg-emerald-400 rounded-full translate-y-[0.05em] sm:translate-y-[0.1em] ml-1.5"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
        </motion.span>
    );
};

export const HeroSection = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
    const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.55], [1, 0.8, 0]);
    const textY = useTransform(scrollYProgress, [0, 0.55], [0, -100]);

    return (
        <section ref={ref} className="relative h-screen min-h-[750px] w-full flex items-center sm:items-end overflow-hidden">
            {/* ── Video background ── */}
            <motion.div className="absolute inset-0 z-0 scale-110" style={{ y: bgY }}>
                <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                    <source src={heroVideo} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/70" />
            </motion.div>

            {/* ── Floating light particles ── */}
            {[...Array(14)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: 2 + (i % 4) * 2,
                        height: 2 + (i % 4) * 2,
                        left: `${5 + i * 6.5}%`,
                        top: `${10 + (i % 5) * 17}%`,
                        background: i % 3 === 0
                            ? 'radial-gradient(circle, rgba(52,211,153,0.4), transparent)'
                            : 'radial-gradient(circle, rgba(255,255,255,0.3), transparent)',
                        filter: `blur(${i % 2}px)`,
                    }}
                    animate={{
                        y: [0, -(20 + i * 3), 0],
                        x: [0, (i % 2 === 0 ? 10 : -10), 0],
                        opacity: [0.1, 0.5, 0.1],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 4 + i * 0.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.3,
                    }}
                />
            ))}

            {/* ── Content ── */}
            <motion.div
                className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 pt-24 sm:pt-0 sm:pb-24 md:pb-32"
                style={{ opacity: textOpacity, y: textY }}
            >
                {/* Location badge */}
                <motion.div
                    initial={{ opacity: 0, x: -30, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="flex items-center gap-2 mb-6"
                >
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase bg-white/10 text-white/90 backdrop-blur-lg border border-white/15">
                        <MapPin className="w-3 h-3" /> Mabini, Bohol · Philippines
                    </span>
                    <motion.span
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 backdrop-blur-lg border border-amber-400/20"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    >
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 4.9 Rating
                    </motion.span>
                </motion.div>

                {/* ── Heading: 2 lines tightly packed ── */}
                <div className="mb-4 max-w-[100vw] overflow-visible min-h-[3em]">
                    <h1
                        className="text-[11vw] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight pb-2 break-words"
                        style={{ lineHeight: 1.1 }}
                    >
                        {/* Line 1 */}
                        <div className="block text-white mb-1 sm:mb-[-0.15em]">
                            <SplitText text="Where Nature" delay={0.3} />
                        </div>
                        {/* Line 2 — typewriter */}
                        <div className="block whitespace-nowrap sm:whitespace-normal">
                            <Typewriter delay={0.9} />
                        </div>
                    </h1>
                </div>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    transition={{ duration: 0.8, delay: 0.9 }}
                    className="text-sm sm:text-base md:text-lg text-white/70 mb-8 max-w-xl font-light leading-relaxed"
                >
                    Premium lakefront camping in the heart of Bohol. Unforgettable sunsets,
                    crystal-clear waters, and evenings under a blanket of stars.
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.1 }}
                    className="flex flex-col sm:flex-row gap-3"
                >
                    <MagneticButton>
                        <Link to="/login">
                            <Button
                                size="lg"
                                className="text-sm sm:text-base px-7 py-5 h-auto rounded-full bg-white text-slate-900 hover:bg-white/90 shadow-2xl shadow-white/10 font-semibold group"
                            >
                                <CalendarDays className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                                Book Your Stay
                            </Button>
                        </Link>
                    </MagneticButton>
                    <MagneticButton>
                        <Button
                            size="lg"
                            variant="outline"
                            className="text-sm sm:text-base px-7 py-5 h-auto rounded-full bg-white/5 hover:bg-white/15 text-white border-white/20 backdrop-blur-lg"
                            onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Explore Gallery
                        </Button>
                    </MagneticButton>
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
                animate={{ y: [0, 10, 0], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
                <ChevronDown className="h-6 w-6 text-white/40" />
            </motion.div>
        </section>
    );
};