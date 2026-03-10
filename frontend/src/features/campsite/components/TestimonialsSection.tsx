import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TESTIMONIALS = [
    {
        name: 'Maria Santos',
        location: 'Manila, Philippines',
        rating: 5,
        text: 'Absolutely breathtaking! The glamping setup was perfectly clean and the lake views were incredible. Our family had the best weekend here. Will definitely come back!',
        avatar: 'MS',
    },
    {
        name: 'Juan Reyes',
        location: 'Cebu City, Philippines',
        rating: 5,
        text: 'We celebrated our anniversary here and it was magical. The bonfire night under the stars, the kayaking — everything was top-notch. The staff were incredibly friendly.',
        avatar: 'JR',
    },
    {
        name: 'Elena Garcia',
        location: 'Tagbilaran, Bohol',
        rating: 5,
        text: 'Best camping experience in Bohol. Great spot with endless activities. We loved the kayaking and the hiking trails. Clean facilities and beautiful scenery all around.',
        avatar: 'EG',
    },
];

const cardVariants = {
    hidden: (i: number) => ({
        opacity: 0,
        x: i % 2 === 0 ? -50 : 50,
        y: 20,
    }),
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        y: 0,
        transition: {
            duration: 0.7,
            delay: i * 0.15,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    }),
};

export const TestimonialsSection = () => {
    return (
        <section className="py-20 md:py-28 bg-slate-50 relative overflow-hidden">
            {/* Subtle background */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-teal-100/40 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-14"
                >
                    <span className="text-emerald-600 font-medium text-sm tracking-widest uppercase">Testimonials</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mt-2 mb-4">
                        Happy Campers
                    </h2>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">
                        Hear what our guests have to say about their lakeside experience.
                    </p>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {TESTIMONIALS.map((testimonial, i) => (
                        <motion.div
                            key={testimonial.name}
                            custom={i}
                            variants={cardVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                            whileHover={{ y: -6, transition: { duration: 0.3 } }}
                            className="relative bg-white rounded-2xl p-7 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 border border-slate-100 transition-shadow duration-300"
                        >
                            {/* Quote icon */}
                            <Quote className="h-8 w-8 text-emerald-100 mb-4 -scale-x-100" />

                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, j) => (
                                    <motion.div
                                        key={j}
                                        initial={{ opacity: 0, scale: 0 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            delay: i * 0.15 + j * 0.08,
                                            type: 'spring',
                                            stiffness: 400,
                                            damping: 10,
                                        }}
                                    >
                                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    </motion.div>
                                ))}
                            </div>

                            <p className="text-slate-600 text-sm leading-relaxed mb-6 font-sans">
                                "{testimonial.text}"
                            </p>

                            {/* Author */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xs font-bold">
                                    {testimonial.avatar}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 font-sans">{testimonial.name}</p>
                                    <p className="text-xs text-slate-400">{testimonial.location}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
