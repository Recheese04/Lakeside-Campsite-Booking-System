import { motion, useScroll, useMotionValueEvent, useTransform, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import campsiteLogo from '../images/campsitelogo.png';

export const Navbar = () => {
    const { scrollY, scrollYProgress } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const handleMobileLinkClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm' : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 cursor-pointer">
                    <motion.div
                        className="w-14 h-14 rounded-xl overflow-hidden"
                        whileHover={{ rotate: [0, -8, 8, -4, 0], transition: { duration: 0.5 } }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <img src={campsiteLogo} alt="Lakeside" className="w-full h-full object-cover" />
                    </motion.div>
                    <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-slate-900' : 'text-white drop-shadow-md'}`}>
                        Lakeside <span className="text-emerald-600">Campsite</span>
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {['Campsites', 'Activities', 'Gallery', 'Reviews'].map((link, i) => (
                        <motion.a
                            key={link}
                            href={`#${link.toLowerCase()}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 + i * 0.08, duration: 0.4 }}
                            className={`relative text-sm font-medium transition-colors group ${isScrolled ? 'text-slate-600 hover:text-emerald-700' : 'text-white/90 drop-shadow-sm hover:text-white'
                                }`}
                            whileHover={{ y: -2 }}
                        >
                            {link}
                            <motion.span
                                className="absolute -bottom-1 left-0 h-[2px] bg-emerald-500 rounded-full"
                                initial={{ width: 0 }}
                                whileHover={{ width: '100%' }}
                                transition={{ duration: 0.25 }}
                            />
                        </motion.a>
                    ))}
                </div>

                {/* Auth Actions (Desktop) */}
                <div className="hidden md:flex items-center gap-3">
                    <Link to="/login">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className={`rounded-full px-5 transition-all ${isScrolled
                                    ? 'text-slate-700 hover:text-emerald-700 hover:bg-emerald-50'
                                    : 'text-white hover:bg-white/20 backdrop-blur-sm'
                                    }`}
                            >
                                <LogIn className="mr-2 h-4 w-4" />
                                Login
                            </Button>
                        </motion.div>
                    </Link>
                    <Link to="/signup">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                size="sm"
                                className={`rounded-full px-5 transition-all ${isScrolled
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-emerald-600/20'
                                    : 'bg-white text-emerald-900 hover:bg-white/90 shadow-xl'
                                    }`}
                            >
                                <UserPlus className="mr-2 h-4 w-4" />
                                Sign Up
                            </Button>
                        </motion.div>
                    </Link>
                </div>

                {/* Mobile Menu Toggle Button */}
                <div className="md:hidden flex items-center">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`p-2 rounded-lg transition-colors ${
                            isScrolled && !isMobileMenuOpen ? 'text-slate-900 hover:bg-slate-100' : 'text-white hover:bg-white/20'
                        }`}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X className="h-6 w-6 relative z-[60] text-emerald-950" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 top-0 z-[55] w-full h-screen bg-white/95 backdrop-blur-xl flex flex-col justify-center items-center gap-8 md:hidden"
                    >
                        {['Campsites', 'Activities', 'Gallery', 'Reviews'].map((link, i) => (
                            <motion.a
                                key={link}
                                href={`#${link.toLowerCase()}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 + i * 0.1 }}
                                onClick={handleMobileLinkClick}
                                className="text-3xl font-bold text-slate-800 hover:text-emerald-600 transition-colors"
                            >
                                {link}
                            </motion.a>
                        ))}
                        
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col w-full max-w-xs gap-3 mt-4"
                        >
                            <Link to="/login" onClick={handleMobileLinkClick} className="w-full">
                                <Button size="lg" variant="outline" className="w-full rounded-full border-slate-200 text-slate-800 text-lg py-6">
                                    <LogIn className="mr-2 h-5 w-5" />
                                    Login
                                </Button>
                            </Link>
                            <Link to="/signup" onClick={handleMobileLinkClick} className="w-full">
                                <Button size="lg" className="w-full rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 text-lg py-6">
                                    <UserPlus className="mr-2 h-5 w-5" />
                                    Sign Up
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Scroll progress indicator ── */}
            <motion.div
                className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 origin-left"
                style={{ scaleX }}
            />
        </motion.nav>
    );
};