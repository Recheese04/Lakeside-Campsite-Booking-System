import { motion } from 'framer-motion';
import { Star, Quote, MessageCircle } from 'lucide-react';
import { FloatingWave } from '@/components/FloatingWave';

const TESTIMONIALS = [
    {
        name: 'Maria Santos',
        loc: 'Manila, PH',
        rating: 5,
        text: 'Absolutely breathtaking! The glamping setup was perfectly clean and the lake views were incredible. Our family had the best weekend here.',
        initials: 'MS',
        gradient: 'from-emerald-500 to-teal-500',
    },
    {
        name: 'Juan Reyes',
        loc: 'Cebu City, PH',
        rating: 5,
        text: 'We celebrated our anniversary here and it was magical. The bonfire night under the stars, the kayaking — everything was top-notch.',
        initials: 'JR',
        gradient: 'from-violet-500 to-purple-500',
    },
    {
        name: 'Elena Garcia',
        loc: 'Tagbilaran, Bohol',
        rating: 5,
        text: 'Best camping experience in Bohol! Great spot with endless activities. Clean facilities and beautiful scenery all around.',
        initials: 'EG',
        gradient: 'from-amber-500 to-orange-500',
    },
];

/* ── Flip-in card variant ── */
const flipVariants = {
    hidden: { opacity: 0, rotateX: -60, y: 40, scale: 0.9 },
    visible: (i: number) => ({
        opacity: 1,
        rotateX: 0,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.7,
            delay: i * 0.15,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    }),
};

export const TestimonialsSection = () => (
    <section className="py-24 md:py-32 relative overflow-hidden">
        {/* BG blurs */}
        <motion.div
            className="absolute top-0 left-0 w-80 h-80 bg-primary/8 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
            className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/8 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"
            animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />

        {/* Decorative Floating Waves */}
        <FloatingWave
            variant={3}
            color="emerald"
            className="w-[1000px] h-[350px] -left-[200px] top-[15%] opacity-[0.04] -rotate-12"
            delay={1.5}
            duration={28}
        />
        <FloatingWave
            variant={2}
            color="forest"
            className="w-[700px] h-[250px] -right-[150px] bottom-[5%] opacity-[0.03] rotate-[15deg]"
            delay={4}
            duration={24}
            flip
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.7 }}
                className="text-center mb-16"
            >
                    <motion.span
                        className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold text-xs tracking-[0.2em] uppercase mb-3"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    >
                        <MessageCircle className="w-3.5 h-3.5" /> Testimonials
                    </motion.span>
                    <h2 className="text-[8vw] sm:text-4xl md:text-5xl font-bold text-slate-900 mt-1 mb-4 break-words leading-tight">
                        Loved by <span className="text-emerald-600 block sm:inline mt-1 sm:mt-0">Campers</span>
                    </h2>
                    <p className="text-slate-600 text-base sm:text-lg max-w-lg mx-auto">
                        Hear what our guests have to say about their lakeside experience.
                    </p>
            </motion.div>

            {/* Cards — flip-in entrance */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ perspective: '1000px' }}>
                {TESTIMONIALS.map((t, i) => (
                    <motion.div
                        key={t.name}
                        custom={i}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={flipVariants}
                        whileHover={{
                            y: -8,
                            boxShadow: '0 0 30px rgba(16,185,129,0.05), 0 20px 40px rgba(6,78,59,0.06)',
                            transition: { duration: 0.3 },
                        }}
                        className="relative bg-white rounded-2xl p-7 border border-emerald-100 shadow-sm transition-all flex flex-col"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Quote */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + i * 0.15, type: 'spring', stiffness: 200 }}
                        >
                            <Quote className="w-7 h-7 text-emerald-100 mb-4 -scale-x-100" />
                        </motion.div>

                        {/* Stars — twinkle pulse */}
                        <div className="flex gap-0.5 mb-4">
                            {[...Array(t.rating)].map((_, j) => (
                                <motion.div
                                    key={j}
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 + i * 0.15 + j * 0.05, type: 'spring', stiffness: 300 }}
                                >
                                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                </motion.div>
                            ))}
                        </div>

                        <p className="text-slate-700 text-sm leading-relaxed mb-6 flex-1">"{t.text}"</p>

                        {/* Author */}
                        <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                            <motion.div
                                className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-[11px] font-bold`}
                                whileHover={{ scale: 1.15, rotate: 10 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                {t.initials}
                            </motion.div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900 leading-tight">{t.name}</p>
                                <p className="text-[11px] text-slate-500">{t.loc}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);
