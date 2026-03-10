import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';

export const HeroSection = () => {
    return (
        <section className="relative h-[90vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1504280390267-33106d153229?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")' }}
            >
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-md"
                >
                    Escape to <span className="text-emerald-400">Nature's Paradise</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-lg md:text-2xl text-slate-200 mb-10 drop-shadow-sm font-light"
                >
                    Experience the serene beauty of Lakeside Campsite in Mabini, Bohol. Your perfect getaway under the stars awaits.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <Button size="lg" className="text-lg px-8 py-6 h-auto rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg transition-all hover:scale-105 group">
                        <CalendarDays className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                        Book Your Adventure Now
                    </Button>
                </motion.div>
            </div>
        </section>
    );
};
