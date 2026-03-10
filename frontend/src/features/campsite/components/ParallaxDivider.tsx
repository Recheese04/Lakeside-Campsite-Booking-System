import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface ParallaxDividerProps {
    // ============================================================
    // 🖼️ REPLACE THIS IMAGE URL WITH YOUR OWN
    // ============================================================
    imageUrl?: string;
    height?: string;
    overlayText?: string;
    overlaySubtext?: string;
}

export const ParallaxDivider = ({
    imageUrl = 'https://images.unsplash.com/photo-1533873984035-25970ab07461?auto=format&fit=crop&w=1920&q=80',
    height = '400px',
    overlayText,
    overlaySubtext,
}: ParallaxDividerProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });
    const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

    return (
        <section ref={ref} className="relative overflow-hidden" style={{ height }}>
            <motion.div
                className="absolute inset-0 -top-[15%] -bottom-[15%] bg-cover bg-center"
                style={{
                    backgroundImage: `url("${imageUrl}")`,
                    y,
                }}
            />
            <div className="absolute inset-0 bg-black/40" />

            {(overlayText || overlaySubtext) && (
                <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
                    {overlayText && (
                        <motion.h3
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3"
                        >
                            {overlayText}
                        </motion.h3>
                    )}
                    {overlaySubtext && (
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="text-white/80 text-base sm:text-lg max-w-lg"
                        >
                            {overlaySubtext}
                        </motion.p>
                    )}
                </div>
            )}
        </section>
    );
};
