import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import caro1 from '@/images/caro1.jpg';
import caro2 from '@/images/caro2.jpg';
import caro3 from '@/images/caro3.jpg';
import caro4 from '@/images/caro4.jpg';
import caro5 from '@/images/caro5.jpg';
import hero from '@/images/hero.jpg';

const SLIDES = [
    { image: caro1, title: 'Lakefront Camping', tag: 'Waterfront' },
    { image: caro2, title: 'Glamping Experience', tag: 'Premium' },
    { image: caro3, title: 'Bonfire Evenings', tag: 'Social' },
    { image: caro4, title: 'Lake Adventures', tag: 'Activities' },
    { image: caro5, title: 'Trail Exploration', tag: 'Nature' },
    { image: hero, title: 'Scenic Views', tag: 'Panoramic' },
];

export const ImageCarousel = () => {
    const [[current, direction], setCurrent] = useState([0, 0]);

    const paginate = useCallback((d: number) => {
        setCurrent(([prev]) => [(prev + d + SLIDES.length) % SLIDES.length, d]);
    }, []);

    useEffect(() => { const t = setInterval(() => paginate(1), 4500); return () => clearInterval(t); }, [paginate]);

    const prev = (current - 1 + SLIDES.length) % SLIDES.length;
    const next = (current + 1) % SLIDES.length;

    return (
        <section id="gallery" className="py-24 md:py-32 bg-background relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <span className="inline-flex items-center gap-1.5 text-primary font-semibold text-xs tracking-[0.2em] uppercase mb-3">
                        <Camera className="w-3.5 h-3.5" /> Gallery
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mt-1 mb-4">
                        Explore Our <span className="text-primary">Grounds</span>
                    </h2>
                    <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto">
                        Discover the beauty that awaits you at Lakeside — from serene waters to lush trails.
                    </p>
                </motion.div>

                {/* Carousel with side previews */}
                <div className="relative flex items-center justify-center gap-4 max-w-6xl mx-auto">
                    {/* Preview left (desktop) */}
                    <motion.div
                        key={`prev-${prev}`}
                        className="hidden lg:block w-48 h-72 rounded-2xl overflow-hidden flex-shrink-0 opacity-40 cursor-pointer"
                        whileHover={{ opacity: 0.7 }}
                        onClick={() => paginate(-1)}
                    >
                        <img src={SLIDES[prev].image} alt="" className="w-full h-full object-cover" />
                    </motion.div>

                    {/* Main slide */}
                    <div className="relative w-full max-w-3xl aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl shadow-black/20 border border-white/5">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={current}
                                custom={direction}
                                initial={{ x: direction > 0 ? 400 : -400, opacity: 0, scale: 0.96 }}
                                animate={{ x: 0, opacity: 1, scale: 1 }}
                                exit={{ x: direction < 0 ? 400 : -400, opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                                className="absolute inset-0"
                            >
                                <img src={SLIDES[current].image} alt={SLIDES[current].title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                                {/* Caption */}
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                    className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex items-end justify-between"
                                >
                                    <div>
                                        <span className="inline-block px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase bg-white/15 text-white rounded-md backdrop-blur-sm mb-2">
                                            {SLIDES[current].tag}
                                        </span>
                                        <h3 className="text-lg sm:text-xl font-bold text-white">{SLIDES[current].title}</h3>
                                    </div>
                                    <span className="text-white/50 text-xs font-mono">{String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}</span>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Nav arrows */}
                        <button onClick={() => paginate(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/10 flex items-center justify-center hover:bg-black/50 transition-all">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button onClick={() => paginate(1)} className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/10 flex items-center justify-center hover:bg-black/50 transition-all">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Preview right (desktop) */}
                    <motion.div
                        key={`next-${next}`}
                        className="hidden lg:block w-48 h-72 rounded-2xl overflow-hidden flex-shrink-0 opacity-40 cursor-pointer"
                        whileHover={{ opacity: 0.7 }}
                        onClick={() => paginate(1)}
                    >
                        <img src={SLIDES[next].image} alt="" className="w-full h-full object-cover" />
                    </motion.div>
                </div>

                {/* Progress dots */}
                <div className="flex justify-center gap-1.5 mt-8">
                    {SLIDES.map((_, i) => (
                        <button key={i} onClick={() => setCurrent([i, i > current ? 1 : -1])} className="group p-1">
                            <motion.div
                                className={`h-1.5 rounded-full transition-colors ${i === current ? 'bg-primary' : 'bg-muted-foreground/20 group-hover:bg-muted-foreground/40'}`}
                                animate={{ width: i === current ? 28 : 8 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                            />
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
};
