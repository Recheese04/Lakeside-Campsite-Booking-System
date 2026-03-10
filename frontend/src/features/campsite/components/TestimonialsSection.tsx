import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const reviews = [
    {
        name: "Maria Santos",
        avatar: "https://i.pravatar.cc/150?u=maria",
        rating: 5,
        comment: "Absolutely breathtaking! The glamping setup was perfectly clean and the lake views in the morning are unmatched. Will definitely return."
    },
    {
        name: "Juan Reyes",
        avatar: "https://i.pravatar.cc/150?u=juan",
        rating: 5,
        comment: "Our family had the best weekend here. The facilities are top-notch without taking away the rugged feel of camping. Highly recommended for beginners."
    },
    {
        name: "Elena Garcia",
        avatar: "https://i.pravatar.cc/150?u=elena",
        rating: 4,
        comment: "Great spot with endless activities. We loved the kayaking and the evening bonfire. The booking process was very smooth as well."
    }
];

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5 } }
};

export const TestimonialsSection = () => {
    return (
        <section className="py-20 bg-emerald-50/50">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-4">Happy Campers</h2>
                    <p className="text-emerald-700/80 max-w-2xl mx-auto">Don't just take our word for it. Here is what our guests have to say about their stay.</p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8"
                >
                    {reviews.map((review, idx) => (
                        <motion.div key={idx} variants={item}>
                            <Card className="h-full border-emerald-100 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md">
                                <CardContent className="pt-8 relative">
                                    {/* Rating Stars */}
                                    <div className="flex text-amber-400 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                                        ))}
                                    </div>

                                    <p className="text-slate-600 mb-6 italic leading-relaxed">
                                        "{review.comment}"
                                    </p>

                                    <div className="flex items-center gap-4 mt-auto">
                                        <img
                                            src={review.avatar}
                                            alt={review.name}
                                            className="w-12 h-12 rounded-full ring-2 ring-emerald-100"
                                        />
                                        <div>
                                            <p className="font-semibold text-emerald-900">{review.name}</p>
                                            <p className="text-xs text-emerald-600">Verified Guest</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};
