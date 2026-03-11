import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

import caro5 from '@/images/caro5.jpg';

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

        {/* Decorative shapes */}
        <motion.div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/10"
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
            className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-teal-500/10"
            animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <motion.span
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="inline-block px-4 py-1.5 rounded-full text-[11px] font-semibold tracking-widest uppercase bg-white/10 text-white/90 backdrop-blur-md border border-white/15 mb-6"
            >
                🏕️ Limited Spots Available
            </motion.span>

            <motion.h2
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
                Ready to Create
                <br />
                <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
                    Unforgettable Memories?
                </span>
            </motion.h2>

            <motion.p
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-white/60 mb-10 max-w-2xl mx-auto font-light leading-relaxed"
            >
                Book your lakeside campsite today. Special rates for groups and extended stays.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
            >
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
            </motion.div>
        </div>
    </section>
);
