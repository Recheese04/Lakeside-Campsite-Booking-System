import { motion } from 'framer-motion';
import { Star, Quote, MessageCircle } from 'lucide-react';

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

export const TestimonialsSection = () => (
    <section className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
        {/* BG blurs */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-primary/8 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-teal-500/8 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }} transition={{ duration: 0.7 }}
                className="text-center mb-16"
            >
                <span className="inline-flex items-center gap-1.5 text-primary font-semibold text-xs tracking-[0.2em] uppercase mb-3">
                    <MessageCircle className="w-3.5 h-3.5" /> Testimonials
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mt-1 mb-4">
                    Loved by <span className="text-primary">Campers</span>
                </h2>
                <p className="text-muted-foreground text-base sm:text-lg max-w-lg mx-auto">
                    Hear what our guests have to say about their lakeside experience.
                </p>
            </motion.div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {TESTIMONIALS.map((t, i) => (
                    <motion.div
                        key={t.name}
                        initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.12 }}
                        whileHover={{ y: -6, transition: { duration: 0.25 } }}
                        className="relative bg-card rounded-2xl p-7 border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all flex flex-col"
                    >
                        {/* Quote */}
                        <Quote className="w-7 h-7 text-primary/15 mb-4 -scale-x-100" />

                        {/* Stars */}
                        <div className="flex gap-0.5 mb-4">
                            {[...Array(t.rating)].map((_, j) => (
                                <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                            ))}
                        </div>

                        <p className="text-card-foreground text-sm leading-relaxed mb-6 flex-1">"{t.text}"</p>

                        {/* Author */}
                        <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white text-[11px] font-bold`}>
                                {t.initials}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-foreground leading-tight">{t.name}</p>
                                <p className="text-[11px] text-muted-foreground">{t.loc}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);
