import { motion } from 'framer-motion';
import { Tent, Flame, Waves, UtensilsCrossed, Wifi, Map, Sparkles } from 'lucide-react';

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

export const FeaturesSection = () => (
    <section className="py-24 md:py-32 bg-background relative overflow-hidden">
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            {/* ── Top: Image + intro side‑by‑side ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
                {/* Image stack */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.8 }}
                    className="relative group"
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
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }}
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="absolute -bottom-6 -right-4 sm:right-6 bg-card/90 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-border/50 flex items-center gap-3 cursor-pointer group/card"
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
                            <p className="text-xs font-bold text-foreground group-hover/card:text-primary transition-colors">World-Class Camping</p>
                            <p className="text-[10px] text-muted-foreground">Rated 4.9 by 500+ guests</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Text */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15 }}
                >
                    <span className="inline-flex items-center gap-1.5 text-primary font-semibold text-xs tracking-[0.2em] uppercase mb-4">
                        <Sparkles className="w-3.5 h-3.5" /> Amenities & Features
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-5 leading-tight">
                        Everything You Need,
                        <br />
                        <span className="text-primary">Nothing You Don't</span>
                    </h2>
                    <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-lg">
                        From premium camping gear to lakeside activities, we've covered every detail
                        so you can focus on making unforgettable memories.
                    </p>
                </motion.div>
            </div>

            {/* ── Feature grid ── */}
            <motion.div
                initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
                {FEATURES.map((f) => {
                    const Icon = f.icon;
                    return (
                        <motion.div
                            key={f.title}
                            variants={{ hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                            whileHover={{ y: -6, transition: { duration: 0.25 } }}
                            className="group relative bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all"
                        >
                            <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${f.glow} mb-4`}>
                                <div className={`bg-gradient-to-br ${f.color} rounded-lg p-2`}>
                                    <Icon className="h-4 w-4 text-white" />
                                </div>
                            </div>
                            <h3 className="text-base font-semibold text-card-foreground mb-1.5">{f.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                            {/* Accent bar */}
                            <div className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r ${f.color} rounded-full opacity-0 group-hover:opacity-60 transition-opacity`} />
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    </section>
);
