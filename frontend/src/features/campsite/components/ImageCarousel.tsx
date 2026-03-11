import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Camera, TreePine, Users, MapPin } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

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

export const ImageCarousel = () => {
    const [[current, direction], setCurrent] = useState([0, 0]);

    const paginate = useCallback((d: number) => {
        setCurrent(([prev]) => [(prev + d + SLIDES.length) % SLIDES.length, d]);
    }, []);

    useEffect(() => { const t = setInterval(() => paginate(1), 5000); return () => clearInterval(t); }, [paginate]);

    return (
        <section id="gallery" className="py-20 md:py-28 bg-background relative overflow-hidden">
            {/* BG glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/5 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.7 }}
                    className="text-center mb-12"
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

                {/* ═══ Main carousel — full width ═══ */}
                <div className="relative w-full aspect-[16/8] sm:aspect-[16/7] rounded-3xl overflow-hidden shadow-2xl shadow-black/30 border border-white/5 mb-6">
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={current}
                            custom={direction}
                            initial={{ x: direction > 0 ? 600 : -600, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: direction < 0 ? 600 : -600, opacity: 0 }}
                            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                            className="absolute inset-0 overflow-hidden"
                        >
                            <motion.img 
                                src={SLIDES[current].image} 
                                alt={SLIDES[current].title} 
                                className="w-full h-full object-cover pointer-events-none"
                                initial={{ scale: 1.05 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 6, ease: "easeOut" }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />

                            {/* Caption overlay */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                                className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-10"
                            >
                                <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-wider uppercase bg-white/15 text-white rounded-lg backdrop-blur-sm border border-white/10 mb-3">
                                    {SLIDES[current].tag}
                                </span>
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1.5">{SLIDES[current].title}</h3>
                                <p className="text-white/70 text-sm sm:text-base max-w-md">{SLIDES[current].desc}</p>
                            </motion.div>

                            {/* Counter */}
                            <div className="absolute top-5 right-5 px-3 py-1.5 rounded-lg bg-black/30 backdrop-blur-md text-white/70 text-xs font-mono border border-white/10">
                                {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Nav arrows */}
                    <button onClick={() => paginate(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/10 flex items-center justify-center hover:bg-black/50 transition-all">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button onClick={() => paginate(1)} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 backdrop-blur-md text-white border border-white/10 flex items-center justify-center hover:bg-black/50 transition-all">
                        <ChevronRight className="h-5 w-5" />
                    </button>
                </div>

                {/* ═══ Thumbnails — full width ═══ */}
                <div className="grid grid-cols-6 gap-2 sm:gap-3 mb-6">
                    {SLIDES.map((slide, i) => (
                        <motion.button
                            key={i}
                            onClick={() => setCurrent([i, i > current ? 1 : -1])}
                            className={`relative aspect-[16/10] rounded-xl overflow-hidden border-2 transition-all ${
                                i === current ? 'border-primary shadow-lg shadow-primary/20' : 'border-transparent opacity-40 hover:opacity-75'
                            }`}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                        >
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                            {i === current && (
                                <div className="absolute inset-0 bg-primary/10" />
                            )}
                        </motion.button>
                    ))}
                </div>

                {/* ═══ Stats row ═══ */}
                <div className="grid grid-cols-3 gap-3">
                    {STATS.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.1 }}
                                className="bg-card rounded-xl p-4 border border-border/50 flex items-center gap-3"
                            >
                                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                                    <Icon className={`w-4 h-4 ${stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-lg font-bold text-foreground leading-tight">{stat.value}</p>
                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
