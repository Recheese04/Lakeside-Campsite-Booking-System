import { motion, useScroll, useTransform } from 'framer-motion';
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

            {(overlayText || overlaySubtext) && (
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                    {overlayText && (
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ duration: 0.6 }}
                            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 tracking-tight"
                        >
                            {overlayText}
                        </motion.h3>
                    )}
                    {overlaySubtext && (
                        <motion.p
                            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}
                            className="text-white/75 text-sm sm:text-base md:text-lg max-w-lg"
                        >
                            {overlaySubtext}
                        </motion.p>
                    )}
                </div>
            )}
        </section>
    );
};
