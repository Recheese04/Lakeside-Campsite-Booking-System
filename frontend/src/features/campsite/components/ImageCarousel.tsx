import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

// ============================================================
// 🖼️ REPLACE THESE URLS WITH YOUR OWN CAMPSITE IMAGES
// ============================================================
const SLIDES = [
    {
        image: 'https://images.unsplash.com/photo-1504280390267-33106d153229?auto=format&fit=crop&w=1200&q=80',
        title: 'Lakefront Tent Area',
        description: 'Wake up to stunning lake views from our premium waterfront camping spots.',
    },
    {
        image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=1200&q=80',
        title: 'Premium Glamping Setup',
        description: 'Luxury canvas tents with real beds, electricity, and private decks.',
    },
    {
        image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=1200&q=80',
        title: 'Bonfire Nights',
        description: 'Gather around the campfire under a blanket of stars every evening.',
    },
    {
        image: 'https://images.unsplash.com/photo-1570141950081-2c5a05b76aff?auto=format&fit=crop&w=1200&q=80',
        title: 'Kayaking by the Lake',
        description: 'Explore crystal-clear waters with our complimentary kayak rentals.',
    },
    {
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
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
        <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-14"
                >
                    <span className="text-emerald-600 font-medium text-sm tracking-widest uppercase">Gallery</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mt-2 mb-4">
                        Discover the Grounds
                    </h2>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">
                        Explore our premium facilities and breathtaking views before you arrive.
                    </p>
                </motion.div>

                {/* Carousel */}
                <div className="relative max-w-5xl mx-auto">
                    <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-200 shadow-2xl shadow-slate-200/60">
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
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

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
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-all"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => paginate(1)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40 transition-all"
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
                                    className={`h-2 rounded-full transition-colors ${i === current ? 'bg-emerald-600' : 'bg-slate-300 group-hover:bg-slate-400'
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
