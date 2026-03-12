import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import campsiteLogo from '../images/campsitelogo.png';

const footerLinks = [
    { title: 'Explore', links: ['Home', 'Campsites', 'Activities', 'Gallery', 'Pricing'] },
    { title: 'Support', links: ['FAQs', 'Booking Policy', 'Cancellation', 'Contact Us'] },
];

const socials = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
];

/* ── Link slide-in variant ── */
const linkVariants = {
    hidden: { opacity: 0, x: -15 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.05, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
};

export const Footer = () => (
    <footer className="bg-slate-950 text-white relative overflow-hidden">
        {/* Animated gradient top border */}
        <motion.div
            className="h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Main grid */}
            <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                {/* Brand */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.6 }}
                    className="sm:col-span-2 lg:col-span-1"
                >
                    <Link to="/" className="flex items-center gap-2.5 mb-4">
                        <motion.div
                            className="w-9 h-9 rounded-xl overflow-hidden"
                            whileHover={{ rotate: [0, -5, 5, 0], transition: { duration: 0.4 } }}
                        >
                            <img src={campsiteLogo} alt="Lakeside" className="w-full h-full object-cover" />
                        </motion.div>
                        <span className="text-lg font-bold tracking-tight">
                            <span className="text-emerald-400">Lakeside</span> Campsite
                        </span>
                    </Link>
                    <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-xs">
                        Your premier camping destination in the heart of Bohol, Philippines. Reconnect with nature at its finest.
                    </p>
                    {/* Socials — spring pop */}
                    <div className="flex gap-2.5">
                        {socials.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <motion.a
                                    key={s.label} href={s.href}
                                    initial={{ opacity: 0, scale: 0 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 250 }}
                                    whileHover={{ scale: 1.15, y: -3, boxShadow: '0 4px 15px rgba(52,211,153,0.3)' }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-emerald-600 flex items-center justify-center transition-colors border border-white/5 hover:border-emerald-500"
                                    aria-label={s.label}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                </motion.a>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Links — stagger slide-in */}
                {footerLinks.map((group, gi) => (
                    <motion.div
                        key={group.title}
                        initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 * (gi + 1) }}
                    >
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">{group.title}</h4>
                        <ul className="space-y-2.5">
                            {group.links.map((link, li) => (
                                <motion.li
                                    key={link}
                                    custom={li}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={linkVariants}
                                >
                                    <motion.a
                                        href="#"
                                        className="text-sm text-slate-500 hover:text-emerald-400 transition-colors inline-block"
                                        whileHover={{ x: 4 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {link}
                                    </motion.a>
                                </motion.li>
                            ))}
                        </ul>
                    </motion.div>
                ))}

                {/* Contact */}
                <motion.div
                    initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Contact Us</h4>
                    <ul className="space-y-3">
                        {[
                            { icon: MapPin, text: 'Mabini, Bohol, Philippines' },
                            { icon: Phone, text: '+63 912 345 6789' },
                            { icon: Mail, text: 'info@lakesidecampsite.com' },
                        ].map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <motion.li
                                    key={i}
                                    className="flex items-center gap-3 text-sm text-slate-500"
                                    initial={{ opacity: 0, x: -10 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 + i * 0.08 }}
                                >
                                    <motion.span
                                        whileHover={{ scale: 1.2, rotate: 10 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <Icon className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                                    </motion.span>
                                    {item.text}
                                </motion.li>
                            );
                        })}
                    </ul>
                </motion.div>
            </div>

            {/* Bottom bar */}
            <motion.div
                className="py-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
            >
                <p className="text-[11px] text-slate-600">
                    © 2026 Lakeside Campsite Booking System. All rights reserved.
                </p>
                <div className="flex gap-4">
                    <a href="#" className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors">Privacy</a>
                    <a href="#" className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors">Terms</a>
                </div>
            </motion.div>
        </div>
    </footer>
);
