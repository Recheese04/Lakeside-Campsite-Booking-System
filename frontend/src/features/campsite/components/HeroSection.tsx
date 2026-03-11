import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CalendarDays, ChevronDown, MapPin, Star } from 'lucide-react';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import heroVideo from '@/images/campsitevid.mp4';

export const HeroSection = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
    const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
    const textY = useTransform(scrollYProgress, [0, 0.45], [0, -80]);

    return (
        <section ref={ref} className="relative h-screen min-h-[750px] w-full flex items-end overflow-hidden">
            {/* ── Video background ── */}
            <motion.div className="absolute inset-0 z-0 scale-110" style={{ y: bgY }}>
                <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
                    <source src={heroVideo} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/25 to-black/70" />
            </motion.div>

            {/* ── Floating light particles ── */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/20"
                    style={{
                        width: 3 + (i % 3) * 2,
                        height: 3 + (i % 3) * 2,
                        left: `${10 + i * 11}%`,
                        top: `${15 + (i % 4) * 18}%`,
                    }}
                    animate={{ y: [0, -30, 0], opacity: [0.15, 0.45, 0.15] }}
                    transition={{ duration: 5 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                />
            ))}

            {/* ── Content ── */}
            <motion.div
                className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 pb-24 md:pb-32"
                style={{ opacity: textOpacity, y: textY }}
            >
                {/* Location badge */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="flex items-center gap-2 mb-6"
                >
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase bg-white/10 text-white/90 backdrop-blur-lg border border-white/15">
                        <MapPin className="w-3 h-3" /> Mabini, Bohol · Philippines
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 backdrop-blur-lg border border-amber-400/20">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 4.9 Rating
                    </span>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-5 tracking-tight leading-[1.05] max-w-4xl"
                >
                    Where Nature
                    <br />
                    <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 bg-clip-text text-transparent">
                        Meets Serenity
                    </span>
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.6 }}
                    className="text-sm sm:text-base md:text-lg text-white/70 mb-10 max-w-xl font-light leading-relaxed"
                >
                    Premium lakefront camping in the heart of Bohol. Unforgettable sunsets,
                    crystal-clear waters, and evenings under a blanket of stars.
                </motion.p>

                {/* CTA buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.85 }}
                    className="flex flex-col sm:flex-row gap-3"
                >
                    <Link to="/login">
                        <Button
                            size="lg"
                            className="text-sm sm:text-base px-7 py-5 h-auto rounded-full bg-white text-slate-900 hover:bg-white/90 shadow-2xl shadow-white/10 font-semibold group"
                        >
                            <CalendarDays className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                            Book Your Stay
                        </Button>
                    </Link>
                    <Button
                        size="lg"
                        variant="outline"
                        className="text-sm sm:text-base px-7 py-5 h-auto rounded-full bg-white/5 hover:bg-white/15 text-white border-white/20 backdrop-blur-lg"
                        onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Explore Gallery
                    </Button>
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            >
                <ChevronDown className="h-6 w-6 text-white/40" />
            </motion.div>
        </section>
    );
};
