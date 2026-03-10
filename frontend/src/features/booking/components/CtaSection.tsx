import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CalendarDays, ArrowRight } from 'lucide-react';

// ============================================================
// 🖼️ REPLACE THIS URL WITH YOUR OWN CTA BACKGROUND IMAGE
// ============================================================
const CTA_IMAGE = 'https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1920&q=80';

export const CtaSection = () => {
    return (
        <section className="relative py-28 md:py-36 overflow-hidden">
            {/* Background image with overlay */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-fixed"
                style={{ backgroundImage: `url("${CTA_IMAGE}")` }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/80" />
            </div>

            {/* Decorative shapes */}
            <motion.div
                className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary/10"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
                className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-teal-500/10"
                animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            />

            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
                <motion.span
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="inline-block px-4 py-1.5 rounded-full text-xs font-medium tracking-widest uppercase bg-primary/20 text-primary-foreground backdrop-blur-md border border-primary/30 mb-6"
                >
                    Limited Spots Available
                </motion.span>

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight"
                >
                    Ready to Reconnect{' '}
                    <span className="text-primary">with Nature?</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto font-light leading-relaxed"
                >
                    Book your lakeside campsite today and create memories that last a lifetime.
                    Special rates available for groups and extended stays.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3, type: 'spring', stiffness: 200 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                        <Button
                            size="lg"
                            className="text-base sm:text-lg px-8 py-6 h-auto rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20 font-semibold group"
                        >
                            <CalendarDays className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                            Check Availability
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};
