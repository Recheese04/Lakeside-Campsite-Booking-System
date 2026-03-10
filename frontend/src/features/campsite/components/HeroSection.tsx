import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CalendarDays, ChevronDown } from 'lucide-react';
import { useRef } from 'react';

import heroVideo from '@/images/campsitevid.mp4';

// ============================================================
// 🎥 USING YOUR LOCAL VIDEO
// ============================================================
const HERO_VIDEO = heroVideo;

export const HeroSection = () => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start start', 'end start'],
    });
    const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const textY = useTransform(scrollYProgress, [0, 0.5], [0, -60]);

    return (
        <section ref={ref} className="relative h-screen min-h-[700px] w-full flex items-center justify-center overflow-hidden">
            {/* Parallax Video Background */}
            <motion.div
                className="absolute inset-0 z-0 scale-105"
                style={{ y: backgroundY }}
            >
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                >
                    <source src={HERO_VIDEO} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/60" />
            </motion.div>

            {/* Floating decorative particles */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-white/20 rounded-full"
                    style={{
                        left: `${15 + i * 18}%`,
                        top: `${20 + i * 12}%`,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.2, 0.5, 0.2],
                    }}
                    transition={{
                        duration: 4 + i,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.5,
                    }}
                />
            ))}

            {/* Content */}
            <motion.div
                className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-16"
                style={{ opacity: textOpacity, y: textY }}
            >
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="mb-6"
                >
                    <span className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase bg-white/10 text-white/90 backdrop-blur-md border border-white/20">
                        Mabini, Bohol · Philippines
                    </span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight leading-[1.1]"
                >
                    Escape to{' '}
                    <span className="text-gradient bg-gradient-to-r from-primary to-teal-200 bg-clip-text text-transparent">
                        Nature's Paradise
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-base sm:text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed drop-shadow"
                >
                    Experience the serene beauty of Lakeside Campsite — your perfect getaway under the stars. Premium camping, lakefront views, unforgettable sunsets.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.9, type: 'spring', stiffness: 200 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                        <Button
                            size="lg"
                            className="text-base sm:text-lg px-8 py-6 h-auto rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 transition-all group"
                        >
                            <CalendarDays className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                            Book Your Adventure
                        </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                        <Button
                            size="lg"
                            variant="outline"
                            className="text-base sm:text-lg px-8 py-6 h-auto rounded-full bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md"
                        >
                            Explore Campsites
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
                <ChevronDown className="h-8 w-8 text-white/50" />
            </motion.div>
        </section>
    );
};
