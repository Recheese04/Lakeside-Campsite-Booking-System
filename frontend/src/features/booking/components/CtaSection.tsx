import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import caro5 from '@/images/caro5.jpg';

/* ── Magnetic button ── */
const MagneticButton = ({ children }: { children: React.ReactNode }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, { stiffness: 250, damping: 20 });
    const springY = useSpring(y, { stiffness: 250, damping: 20 });

    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.25);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.25);
    };

    return (
        <motion.div
            style={{ x: springX, y: springY }}
            onMouseMove={handleMouse}
            onMouseLeave={() => { x.set(0); y.set(0); }}
        >
            {children}
        </motion.div>
    );
};

export const CtaSection = () => (
    <section className="relative py-28 md:py-36 overflow-hidden group">
        {/* BG image with slow zoom animation */}
        <div className="absolute inset-0 overflow-hidden">
            <motion.img
                src={caro5}
                alt=""
                className="w-full h-full object-cover"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/85 to-slate-900/70" />
        </div>

        {/* Decorative shapes — pulsing */}
        <motion.div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/10"
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.35, 0.15], x: [0, 10, 0], y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
            className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-teal-500/10"
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1], x: [0, -8, 0], y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />
        {/* Extra floating diamond */}
        <motion.div
            className="absolute top-1/3 right-1/4 w-16 h-16 bg-emerald-500/10 rounded-lg blur-sm"
            animate={{ rotate: [45, 90, 45], y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            {/* Floating badge with bounce */}
            <motion.span
                initial={{ opacity: 0, y: 30, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 180, delay: 0.1 }}
                className="inline-block px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase bg-white/10 text-white/90 backdrop-blur-md border border-white/15 mb-6"
            >
                <motion.span
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="inline-block"
                >
                    🏕️ Limited Spots Available
                </motion.span>
            </motion.span>

            {/* Heading with gradient shimmer */}
            <motion.h2
                initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="text-[10vw] sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight break-words"
            >
                Ready to Create
                <br className="hidden sm:block" />
                <motion.span
                    className="inline-block bg-clip-text text-transparent"
                    style={{
                        backgroundImage: 'linear-gradient(90deg, #6ee7b7, #5eead4, #67e8f9, #6ee7b7)',
                        backgroundSize: '200% 100%',
                    }}
                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                >
                    Unforgettable Memories?
                </motion.span>
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-base sm:text-lg text-white/60 mb-10 max-w-2xl mx-auto font-light leading-relaxed"
            >
                Book your lakeside campsite today. Special rates for groups and extended stays.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
            >
                <MagneticButton>
                    <Link to="/login">
                        <Button
                            size="lg"
                            className="text-sm sm:text-base px-7 py-5 h-auto rounded-full bg-white text-slate-900 hover:bg-white/90 shadow-xl font-semibold group"
                        >
                            <CalendarDays className="mr-2 h-4 w-4 group-hover:rotate-12 transition-transform" />
                            Check Availability
                            <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </MagneticButton>
            </motion.div>
        </div>
    </section>
);
