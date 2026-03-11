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

export const Footer = () => (
    <footer className="bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Main grid */}
            <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                {/* Brand */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.5 }}
                    className="sm:col-span-2 lg:col-span-1"
                >
                    <Link to="/" className="flex items-center gap-2.5 mb-4">
                        <div className="w-9 h-9 rounded-xl overflow-hidden">
                            <img src={campsiteLogo} alt="Lakeside" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-lg font-bold tracking-tight">
                            <span className="text-emerald-400">Lakeside</span> Campsite
                        </span>
                    </Link>
                    <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-xs">
                        Your premier camping destination in the heart of Bohol, Philippines. Reconnect with nature at its finest.
                    </p>
                    {/* Socials */}
                    <div className="flex gap-2.5">
                        {socials.map((s) => {
                            const Icon = s.icon;
                            return (
                                <motion.a
                                    key={s.label} href={s.href}
                                    whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}
                                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-emerald-600 flex items-center justify-center transition-colors border border-white/5 hover:border-emerald-500"
                                    aria-label={s.label}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                </motion.a>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Links */}
                {footerLinks.map((group, i) => (
                    <motion.div
                        key={group.title}
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
                    >
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">{group.title}</h4>
                        <ul className="space-y-2.5">
                            {group.links.map((link) => (
                                <li key={link}>
                                    <a href="#" className="text-sm text-slate-500 hover:text-emerald-400 transition-colors">{link}</a>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}

                {/* Contact */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">Contact Us</h4>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm text-slate-500">
                            <MapPin className="h-3.5 w-3.5 text-emerald-400 mt-0.5 shrink-0" />
                            Mabini, Bohol, Philippines
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-500">
                            <Phone className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            +63 912 345 6789
                        </li>
                        <li className="flex items-center gap-3 text-sm text-slate-500">
                            <Mail className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            info@lakesidecampsite.com
                        </li>
                    </ul>
                </motion.div>
            </div>

            {/* Bottom bar */}
            <div className="py-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
                <p className="text-[11px] text-slate-600">
                    © 2026 Lakeside Campsite Booking System. All rights reserved.
                </p>
                <div className="flex gap-4">
                    <a href="#" className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors">Privacy</a>
                    <a href="#" className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors">Terms</a>
                </div>
            </div>
        </div>
    </footer>
);
