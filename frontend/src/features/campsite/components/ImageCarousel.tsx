import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight, Camera, TreePine, Users, MapPin } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { FloatingWave } from '@/components/FloatingWave';

import caro1 from '@/images/caro1.jpg';
import caro2 from '@/images/caro2.jpg';
import caro3 from '@/images/caro3.jpg';
import caro4 from '@/images/caro4.jpg';
import caro5 from '@/images/caro5.jpg';
import hero from '@/images/hero.jpg';

const SLIDES = [
    { image: caro1, title: 'Lakefront Camping', tag: 'Waterfront', desc: 'Wake up to stunning lake views from our premium waterfront spots.' },
    { image: caro2, title: 'Glamping Setups', tag: 'Premium', desc: 'Luxury canvas tents with real beds, electricity, and private decks.' },
    { image: caro3, title: 'Bonfire Evenings', tag: 'Social', desc: 'Gather around the campfire under a blanket of stars every evening.' },
    { image: caro4, title: 'Lake Adventures', tag: 'Activities', desc: 'Explore crystal-clear waters with our complimentary equipment.' },
    { image: caro5, title: 'Trail Exploration', tag: 'Nature', desc: 'Over 15km of marked trails through lush tropical forests.' },
    { image: hero, title: 'Scenic Views', tag: 'Panoramic', desc: 'Breathtaking panoramic views of the lake and surrounding mountains.' },
];

const STATS = [
    { icon: TreePine, value: '50+', label: 'Campsites', color: 'text-emerald-400' },
    { icon: Users, value: '2,500+', label: 'Happy Guests', color: 'text-blue-400' },
    { icon: MapPin, value: '15km', label: 'Trail Network', color: 'text-amber-400' },
];

const INTERVAL = 5000;

/* ── 3D perspective slide variants ── */
const slideVariants = {
    enter: (dir: number) => ({
        rotateY: dir > 0 ? 35 : -35,
        x: dir > 0 ? '60%' : '-60%',
        opacity: 0,
        scale: 0.85,
    }),
    center: {
        rotateY: 0,
        x: 0,
        opacity: 1,
        scale: 1,
    },
    exit: (dir: number) => ({
        rotateY: dir < 0 ? 35 : -35,
        x: dir < 0 ? '60%' : '-60%',
        opacity: 0,
        scale: 0.85,
    }),
};

/* ── Tilt thumbnail component ── */
const TiltThumb = ({ slide, isActive, onClick }: { slide: typeof SLIDES[0]; isActive: boolean; onClick: () => void }) => {
    const cardRef = useRef<HTMLButtonElement>(null);
    const mouseX = useMotionValue(0.5);
    const mouseY = useMotionValue(0.5);
    const rotateX = useTransform(mouseY, [0, 1], [8, -8]);
    const rotateY = useTransform(mouseX, [0, 1], [-8, 8]);
    const springRX = useSpring(rotateX, { stiffness: 200, damping: 20 });
    const springRY = useSpring(rotateY, { stiffness: 200, damping: 20 });

    const handleMouse = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        mouseX.set((e.clientX - rect.left) / rect.width);
        mouseY.set((e.clientY - rect.top) / rect.height);
    };

    return (
        <motion.button
            ref={cardRef}
            onClick={onClick}
            onMouseMove={handleMouse}
            onMouseLeave={() => { mouseX.set(0.5); mouseY.set(0.5); }}
            className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${
                isActive ? 'border-primary shadow-lg shadow-primary/20' : 'border-transparent opacity-40 hover:opacity-75'
            }`}
            style={{ rotateX: springRX, rotateY: springRY, perspective: 600 }}
            whileTap={{ scale: 0.95 }}
        >
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
            {isActive && <div className="absolute inset-0 bg-primary/10" />}
        </motion.button>
    );
};

export const ImageCarousel = () => {
    const [[current, direction], setCurrent] = useState([0, 0]);
    const [progress, setProgress] = useState(0);

    const paginate = useCallback((d: number) => {
        setCurrent(([prev]) => [(prev + d + SLIDES.length) % SLIDES.length, d]);
        setProgress(0);
    }, []);

    /* Auto-play with progress */
    useEffect(() => {
        const step = 50;
        const timer = setInterval(() => {
            setProgress((p) => {
                if (p >= 100) {
                    paginate(1);
                    return 0;
                }
                return p + (step / INTERVAL) * 100;
            });
        }, step);
        return () => clearInterval(timer);
    }, [paginate]);

    return (
        <section id="gallery" className="py-20 md:py-28 relative overflow-hidden">
            {/* BG glow */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-3xl mix-blend-multiply"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Decorative Floating Waves */}
            <FloatingWave
                variant={4}
                color="teal"
                className="w-[1200px] h-[400px] -left-[300px] top-[5%] opacity-[0.04] rotate-6"
                duration={30}
            />
            <FloatingWave
                variant={1}
                color="forest"
                className="w-[900px] h-[300px] -right-[150px] bottom-[10%] opacity-[0.03] -rotate-6"
                delay={5}
                duration={22}
                flip
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.7 }}
                    className="text-center mb-12"
                >
                    <motion.span
                        className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold text-xs tracking-[0.2em] uppercase mb-3"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    >
                        <Camera className="w-3.5 h-3.5" /> Gallery
                    </motion.span>
                    <h2 className="text-[8vw] sm:text-4xl md:text-5xl font-bold text-slate-900 mt-1 mb-4 break-words leading-tight">
                        Explore Our <span className="text-emerald-600 block sm:inline mt-1 sm:mt-0">Grounds</span>
                    </h2>
                    <p className="text-slate-600 text-base sm:text-lg max-w-lg mx-auto">
                        Discover the beauty that awaits you at <span className="text-slate-800 font-semibold">Lakeside</span> <span className="text-emerald-700 font-bold">Campsite</span> — from serene waters to lush trails.
                    </p>
                </motion.div>

                {/* ═══ Main carousel — 3D perspective ═══ */}
                <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/10 border border-emerald-100 mb-6" style={{ perspective: '1200px' }}>
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={current}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
                            className="absolute inset-0 overflow-hidden"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            <motion.img
                                src={SLIDES[current].image}
                                alt={SLIDES[current].title}
                                className="w-full h-full object-cover pointer-events-none"
                                initial={{ scale: 1.08 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 6, ease: "easeOut" }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />

                            {/* Caption overlay */}
                            <motion.div
                                initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
                                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10"
                            >
                                <motion.span
                                    className="inline-block px-3 py-1 text-[10px] font-bold tracking-wider uppercase bg-white/15 text-white rounded-lg backdrop-blur-sm border border-white/10 mb-3"
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {SLIDES[current].tag}
                                </motion.span>
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1.5">{SLIDES[current].title}</h3>
                                <p className="text-white/70 text-sm sm:text-base max-w-md">{SLIDES[current].desc}</p>
                            </motion.div>

                            {/* Counter */}
                            <div className="absolute top-5 right-5 px-3 py-1.5 rounded-lg bg-black/30 backdrop-blur-md text-white/70 text-xs font-mono border border-white/10">
                                {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Auto-play progress bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/10 z-30">
                        <motion.div
                            className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                            style={{ width: `${progress}%` }}
                            transition={{ duration: 0.05 }}
                        />
                    </div>

                    {/* Nav arrows */}
                    <motion.button
                        onClick={() => paginate(-1)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/10 flex items-center justify-center hover:bg-black/50 transition-all"
                        whileHover={{ scale: 1.15, x: -2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </motion.button>
                    <motion.button
                        onClick={() => paginate(1)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/10 flex items-center justify-center hover:bg-black/50 transition-all"
                        whileHover={{ scale: 1.15, x: 2 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <ChevronRight className="h-5 w-5" />
                    </motion.button>
                </div>

                {/* ═══ Thumbnails — tilt hover ═══ */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 mb-6">
                    {SLIDES.map((slide, i) => (
                        <TiltThumb
                            key={i}
                            slide={slide}
                            isActive={i === current}
                            onClick={() => { setCurrent([i, i > current ? 1 : -1]); setProgress(0); }}
                        />
                    ))}
                </div>

                {/* ═══ Stats row ═══ */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {STATS.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 25, rotateX: -15 }}
                                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.12, type: 'spring', stiffness: 150 }}
                                whileHover={{ y: -4, boxShadow: '0 12px 30px rgba(6,78,59,0.08)' }}
                                className="bg-white rounded-xl p-4 border border-emerald-100 flex items-center gap-3 shadow-sm"
                            >
                                <motion.div
                                    className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0"
                                    whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                                >
                                    <Icon className={`w-4 h-4 ${stat.color}`} />
                                </motion.div>
                                <div>
                                    <p className="text-lg font-bold text-slate-800 leading-tight">{stat.value}</p>
                                    <p className="text-xs text-slate-500">{stat.label}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
