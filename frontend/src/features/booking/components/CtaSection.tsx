import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export const CtaSection = () => {
    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background Overlay */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center object-cover opacity-90"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
            >
                <div className="absolute inset-0 bg-emerald-900/80 mix-blend-multiply" />
            </div>

            <div className="relative z-10 container mx-auto px-4 max-w-4xl text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-4xl md:text-5xl font-bold text-white mb-6"
                >
                    Ready to Reconnect with Nature?
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-emerald-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto"
                >
                    Spaces fill up fast during the peak season. Secure your spot at Lakeside Campsite today and prepare for an unforgettable adventure.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Button
                        size="lg"
                        className="text-lg px-10 py-6 h-auto rounded-full bg-white text-emerald-800 hover:bg-emerald-50 font-semibold shadow-xl transition-all hover:scale-105"
                    >
                        Check Availability Now
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};
