import { motion, useInView } from 'framer-motion';
import { Tent, Flame, Waves, UtensilsCrossed, Wifi, Map, Sparkles } from 'lucide-react';
import { useRef } from 'react';
import { FloatingWave } from '@/components/FloatingWave';

import caro1 from '@/images/caro1.jpg';
import caro3 from '@/images/caro3.jpg';

const FEATURES = [
    { icon: Tent, title: 'Premium Tents', desc: 'Fully equipped waterproof tents with comfortable beds, linens, and private setups.', color: 'from-emerald-500 to-teal-500', glow: 'bg-emerald-500/10' },
    { icon: Flame, title: 'Bonfire Pits', desc: 'Shared and private campfire spots with firewood included. Perfect for stargazing.', color: 'from-orange-500 to-amber-500', glow: 'bg-orange-500/10' },
    { icon: Waves, title: 'Lake Activities', desc: 'Kayaking, fishing, and swimming in crystal-clear waters with equipment provided.', color: 'from-blue-500 to-cyan-500', glow: 'bg-blue-500/10' },
    { icon: UtensilsCrossed, title: 'Camp Kitchen', desc: 'Modern outdoor cooking facilities with grills, utensils, and fresh ingredients.', color: 'from-rose-500 to-pink-500', glow: 'bg-rose-500/10' },
    { icon: Wifi, title: 'Stay Connected', desc: 'High-speed Wi-Fi across all areas. Work remotely or share memories instantly.', color: 'from-violet-500 to-purple-500', glow: 'bg-violet-500/10' },
    { icon: Map, title: 'Hiking Trails', desc: 'Over 15km of marked trails through lush forests with guided treks available.', color: 'from-lime-500 to-green-500', glow: 'bg-lime-500/10' },
];

/* ── Card cascade variants ── */
const cardVariants = {
    hidden: { opacity: 0, y: 60, rotateX: -15, scale: 0.95 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        rotateX: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            delay: i * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    }),
};

export const FeaturesSection = () => {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: '-80px' });

    return (
        <section ref={sectionRef} className="py-24 md:py-32 relative overflow-hidden">
            {/* Dot pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

            {/* Floating decorative shapes */}
            <motion.div
                className="absolute top-20 right-10 w-32 h-32 rounded-full bg-primary/5 blur-2xl"
                animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute bottom-20 left-10 w-24 h-24 rounded-full bg-teal-500/5 blur-2xl"
                animate={{ y: [0, 15, 0], scale: [1, 1.15, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />

            {/* Decorative Floating Waves */}
            <FloatingWave
                variant={3}
                color="forest"
                className="w-[800px] h-[300px] -right-[200px] top-[10%] opacity-[0.03] rotate-12"
                duration={25}
            />
            <FloatingWave
                variant={2}
                color="emerald"
                className="w-[600px] h-[200px] -left-[100px] bottom-[20%] opacity-[0.04] -rotate-12"
                delay={2}
                duration={20}
                flip
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {/* ── Top: Image + intro side‑by‑side ── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
                    {/* Image stack */}
                    <motion.div
                        initial={{ opacity: 0, x: -50, rotateY: 10 }}
                        whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="relative group"
                        style={{ perspective: '1000px' }}
                    >
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/10 aspect-[4/3]">
                            <motion.img
                                src={caro1}
                                alt="Campsite"
                                className="w-full h-full object-cover transform origin-center"
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.7, ease: "easeOut" }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
                        </div>
                        {/* Floating overlay card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 0.6, type: 'spring', stiffness: 120 }}
                            whileHover={{ y: -5, scale: 1.03, boxShadow: '0 20px 40px rgba(6,78,59,0.1)' }}
                            className="absolute -bottom-6 -right-4 sm:right-6 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl shadow-emerald-900/5 border border-emerald-100 flex items-center gap-3 cursor-pointer group/card"
                        >
                            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                                <motion.img
                                    src={caro3}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    whileHover={{ scale: 1.15 }}
                                    transition={{ duration: 0.4 }}
                                />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-800 group-hover/card:text-emerald-600 transition-colors">World-Class Camping</p>
                                <p className="text-[10px] text-slate-500">Rated 4.9 by 500+ guests</p>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Text */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.15 }}
                    >
                        <motion.span
                            className="inline-flex items-center gap-1.5 text-emerald-600 font-semibold text-xs tracking-[0.2em] uppercase mb-4"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            <motion.span
                                animate={{ rotate: [0, 15, -15, 0] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                            </motion.span>
                            Amenities & Features
                        </motion.span>
                        <h2 className="text-[8vw] sm:text-4xl md:text-5xl font-bold text-slate-900 mb-5 leading-tight break-words">
                            Everything You Need,
                            <br className="hidden sm:block" />
                            <span className="text-emerald-600 block sm:inline mt-1 sm:mt-0">Nothing You Don't</span>
                        </h2>
                        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-lg">
                            From premium camping gear to lakeside activities, we've covered every detail
                            so you can focus on making unforgettable memories.
                        </p>
                    </motion.div>
                </div>

                {/* ── Feature grid — cascade entrance ── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ perspective: '800px' }}>
                    {FEATURES.map((f, i) => {
                        const Icon = f.icon;
                        return (
                            <motion.div
                                key={f.title}
                                custom={i}
                                initial="hidden"
                                animate={isInView ? 'visible' : 'hidden'}
                                variants={cardVariants}
                                whileHover={{
                                    y: -8,
                                    boxShadow: '0 20px 40px rgba(6,78,59,0.08)',
                                    transition: { duration: 0.25 },
                                }}
                                className="group relative bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm transition-all"
                            >
                                <motion.div
                                    className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${f.glow} mb-4`}
                                    whileHover={{ rotate: 360, transition: { duration: 0.6 } }}
                                >
                                    <div className={`bg-gradient-to-br ${f.color} rounded-lg p-2`}>
                                        <Icon className="h-4 w-4 text-white" />
                                    </div>
                                </motion.div>
                                <h3 className="text-base font-semibold text-slate-800 mb-1.5">{f.title}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
                                {/* Morphing accent bar — expands from center on hover */}
                                <motion.div
                                    className={`absolute bottom-0 left-1/2 h-0.5 bg-gradient-to-r ${f.color} rounded-full`}
                                    initial={{ width: 0, x: '-50%' }}
                                    whileHover={{ width: 'calc(100% - 32px)', x: '-50%' }}
                                    transition={{ duration: 0.3 }}
                                    style={{ translateX: '-50%' }}
                                />
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
