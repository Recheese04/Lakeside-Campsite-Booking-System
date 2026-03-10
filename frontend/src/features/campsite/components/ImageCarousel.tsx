import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

import caro1 from '@/images/caro1.jpg';
import caro2 from '@/images/caro2.jpg';
import caro3 from '@/images/caro3.jpg';
import caro4 from '@/images/caro4.jpg';
import caro5 from '@/images/caro5.jpg';

// ============================================================
// 🖼️ USING YOUR LOCAL IMAGES
// ============================================================
const SLIDES = [
    {
        image: caro1,
        title: 'Lakefront Tent Area',
        description: 'Wake up to stunning lake views from our premium waterfront camping spots.',
    },
    {
        image: caro2,
        title: 'Premium Glamping Setup',
        description: 'Luxury canvas tents with real beds, electricity, and private decks.',
    },
    {
        image: caro3,
        title: 'Bonfire Nights',
        description: 'Gather around the campfire under a blanket of stars every evening.',
    },
    {
        image: caro4,
        title: 'Kayaking by the Lake',
        description: 'Explore crystal-clear waters with our complimentary kayak rentals.',
    },
    {
        image: caro5,
        title: 'Nature Hiking Trails',
        description: 'Over 15km of marked trails through lush tropical forests.',
    },
];

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 400 : -400,
        opacity: 0,
        scale: 0.95,
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
    },
    exit: (direction: number) => ({
        x: direction < 0 ? 400 : -400,
        opacity: 0,
        scale: 0.95,
    }),
};

export const ImageCarousel = () => {
    const [[current, direction], setCurrent] = useState([0, 0]);

    const paginate = useCallback(
        (newDirection: number) => {
            setCurrent(([prev]) => {
                const next = (prev + newDirection + SLIDES.length) % SLIDES.length;
                return [next, newDirection];
            });
        },
        []
    );

    useEffect(() => {
        const timer = setInterval(() => paginate(1), 5000);
        return () => clearInterval(timer);
    }, [paginate]);

    return (
        <section id="gallery" className="py-20 md:py-28 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-14"
                >
                    <span className="text-primary font-medium text-sm tracking-widest uppercase">Gallery</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mt-2 mb-4">
                        Discover the Grounds
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                        Explore our premium facilities and breathtaking views before you arrive.
                    </p>
                </motion.div>

                {/* Carousel */}
                <div className="relative max-w-5xl mx-auto">
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-muted border border-border shadow-2xl">
                        <AnimatePresence initial={false} custom={direction} mode="wait">
                            <motion.div
                                key={current}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                                className="absolute inset-0"
                            >
                                <img
                                    src={SLIDES[current].image}
                                    alt={SLIDES[current].title}
                                    className="w-full h-full object-cover"
                                />
                                {/* Gradient overlay for caption */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                {/* Caption */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="absolute bottom-0 left-0 right-0 p-6 sm:p-10"
                                >
                                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                                        {SLIDES[current].title}
                                    </h3>
                                    <p className="text-white/80 text-sm sm:text-base max-w-lg">
                                        {SLIDES[current].description}
                                    </p>
                                </motion.div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation arrows */}
                        <button
                            onClick={() => paginate(-1)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 flex items-center justify-center hover:bg-black/60 transition-all"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => paginate(1)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/10 flex items-center justify-center hover:bg-black/60 transition-all"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Dots */}
                    <div className="flex justify-center gap-2 mt-6">
                        {SLIDES.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrent([i, i > current ? 1 : -1])}
                                className="group p-1"
                            >
                                <motion.div
                                    className={`h-2 rounded-full transition-colors ${i === current ? 'bg-primary' : 'bg-muted-foreground/30 group-hover:bg-muted-foreground/50'
                                        }`}
                                    animate={{ width: i === current ? 32 : 8 }}
                                    transition={{ duration: 0.3 }}
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
