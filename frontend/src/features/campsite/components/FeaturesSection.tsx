import { motion } from 'framer-motion';
import { Tent, Flame, Waves, UtensilsCrossed, Wifi, Map } from 'lucide-react';

const FEATURES = [
    {
        icon: Tent,
        title: 'Premium Tents',
        description: "Fully equipped waterproof tents with comfortable beds, linens, and private setups for the perfect night's rest.",
        color: 'from-emerald-500 to-teal-500',
        bgLight: 'bg-emerald-50',
    },
    {
        icon: Flame,
        title: 'Bonfire Pits',
        description: 'Shared and private campfire spots with firewood included. Perfect for stargazing and storytelling.',
        color: 'from-orange-500 to-amber-500',
        bgLight: 'bg-orange-50',
    },
    {
        icon: Waves,
        title: 'Lake Activities',
        description: 'Kayaking, fishing, and swimming in crystal-clear waters. Equipment and guides provided.',
        color: 'from-blue-500 to-cyan-500',
        bgLight: 'bg-blue-50',
    },
    {
        icon: UtensilsCrossed,
        title: 'Camp Kitchen',
        description: 'Modern outdoor cooking facilities with grills, utensils, and fresh local ingredients available nearby.',
        color: 'from-rose-500 to-pink-500',
        bgLight: 'bg-rose-50',
    },
    {
        icon: Wifi,
        title: 'Stay Connected',
        description: 'High-speed Wi-Fi coverage across all camping areas. Work remotely or share memories instantly.',
        color: 'from-violet-500 to-purple-500',
        bgLight: 'bg-violet-50',
    },
    {
        icon: Map,
        title: 'Hiking Trails',
        description: 'Over 15km of marked nature trails through lush forests with guided treks available on request.',
        color: 'from-lime-500 to-green-500',
        bgLight: 'bg-lime-50',
    },
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

export const FeaturesSection = () => {
    return (
        <section className="py-20 md:py-28 bg-white relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <span className="text-emerald-600 font-medium text-sm tracking-widest uppercase">Amenities</span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mt-2 mb-4">
                        Everything You Need
                    </h2>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">
                        From premium camping gear to lakeside activities, we've got every detail covered.
                    </p>
                </motion.div>

                {/* Cards grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                >
                    {FEATURES.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                variants={cardVariants}
                                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                                className="group relative bg-white rounded-2xl p-7 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-shadow duration-300"
                            >
                                {/* Icon */}
                                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${feature.bgLight} mb-5`}>
                                    <div className={`bg-gradient-to-br ${feature.color} rounded-lg p-2`}>
                                        <Icon className="h-5 w-5 text-white" />
                                    </div>
                                </div>

                                <h3 className="text-lg font-semibold text-slate-900 mb-2 font-sans">
                                    {feature.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Hover accent line */}
                                <motion.div
                                    className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.color} rounded-b-2xl`}
                                    initial={{ scaleX: 0 }}
                                    whileHover={{ scaleX: 1 }}
                                    transition={{ duration: 0.3 }}
                                    style={{ originX: 0 }}
                                />
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};
