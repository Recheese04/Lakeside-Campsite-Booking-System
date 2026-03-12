import { motion, useScroll, useTransform, useMotionTemplate } from 'framer-motion';
import { useRef } from 'react';

import caro2 from '@/images/caro2.jpg';
import caro4 from '@/images/caro4.jpg';

interface ParallaxDividerProps {
    imageUrl?: string;
    height?: string;
    overlayText?: string;
    overlaySubtext?: string;
    variant?: 'first' | 'second';
}

const localImages: Record<string, string> = { first: caro2, second: caro4 };

export const ParallaxDivider = ({
    imageUrl,
    height = '400px',
    overlayText,
    overlaySubtext,
    variant = 'first',
}: ParallaxDividerProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);
    const textScale = useTransform(scrollYProgress, [0.2, 0.5], [0.9, 1]);
    const textBlur = useTransform(scrollYProgress, [0.15, 0.45], [10, 0]);
    const textOpacity = useTransform(scrollYProgress, [0.15, 0.45], [0, 1]);
    const filterBlur = useMotionTemplate`blur(${textBlur}px)`;

    const bgImage = imageUrl || localImages[variant] || caro2;

    return (
        <section ref={ref} className="relative overflow-hidden" style={{ height }}>
            <motion.div className="absolute inset-0 -top-[12%] -bottom-[12%] overflow-hidden" style={{ y }}>
                <motion.img
                    src={bgImage}
                    alt=""
                    className="w-full h-full object-cover"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                />
            </motion.div>
            <div className="absolute inset-0 bg-black/45 pointer-events-none" />

            {/* Floating decorative shapes */}
            <motion.div
                className="absolute top-10 left-[15%] w-20 h-20 rounded-full bg-white/5 blur-lg"
                animate={{ y: [0, -15, 0], x: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute bottom-10 right-[20%] w-16 h-16 rounded-lg bg-emerald-500/10 blur-md rotate-45"
                animate={{ y: [0, 12, 0], rotate: [45, 90, 45] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />

            {(overlayText || overlaySubtext) && (
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                    {overlayText && (
                        <motion.h3
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight"
                            style={{
                                scale: textScale,
                                filter: filterBlur,
                                opacity: textOpacity,
                            }}
                        >
                            {overlayText}
                        </motion.h3>
                    )}
                    {overlaySubtext && (
                        <motion.p
                            className="text-white/75 text-sm sm:text-base md:text-lg max-w-lg"
                            style={{
                                scale: textScale,
                                opacity: textOpacity,
                                filter: filterBlur,
                            }}
                        >
                            {overlaySubtext}
                        </motion.p>
                    )}
                </div>
            )}
        </section>
    );
};

