import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';

const footerLinks = [
    {
        title: 'Explore',
        links: ['Home', 'Campsites', 'Activities', 'Gallery', 'Pricing'],
    },
    {
        title: 'Support',
        links: ['FAQs', 'Booking Policy', 'Cancellation', 'Contact Us'],
    },
];

const socialIcons = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
];

export const Footer = () => {
    return (
        <footer className="bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Main grid */}
                <div className="py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                    {/* Brand */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="sm:col-span-2 lg:col-span-1"
                    >
                        <h3 className="text-xl font-bold mb-3">
                            <span className="text-emerald-400">Lakeside</span> Campsite
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-5 max-w-xs font-sans">
                            Your premier camping destination in the heart of Bohol, Philippines. Reconnect with nature at its finest.
                        </p>
                        {/* Social icons */}
                        <div className="flex gap-3">
                            {socialIcons.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <motion.a
                                        key={social.label}
                                        href={social.href}
                                        whileHover={{ scale: 1.15, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-emerald-600 flex items-center justify-center transition-colors duration-300"
                                        aria-label={social.label}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </motion.a>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Links */}
                    {footerLinks.map((group, i) => (
                        <motion.div
                            key={group.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 * (i + 1) }}
                        >
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4 font-sans">
                                {group.title}
                            </h4>
                            <ul className="space-y-2.5">
                                {group.links.map((link) => (
                                    <li key={link}>
                                        <a
                                            href="#"
                                            className="text-sm text-slate-400 hover:text-emerald-400 transition-colors duration-200 font-sans"
                                        >
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}

                    {/* Contact */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-4 font-sans">
                            Contact Us
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm text-slate-400 font-sans">
                                <MapPin className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                                Mabini, Bohol, Philippines
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-400 font-sans">
                                <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                                +63 912 345 6789
                            </li>
                            <li className="flex items-center gap-3 text-sm text-slate-400 font-sans">
                                <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                                info@lakesidecampsite.com
                            </li>
                        </ul>
                    </motion.div>
                </div>

                {/* Bottom bar */}
                <div className="py-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-slate-500 font-sans">
                        © 2026 Lakeside Campsite Booking System. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-sans">Privacy</a>
                        <a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors font-sans">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
