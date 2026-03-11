import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import campsiteLogo from '../images/campsitelogo.png';

export const Navbar = () => {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setIsScrolled(latest > 50);
    });

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm' : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 cursor-pointer">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-primary">
                        <img src={campsiteLogo} alt="Lakeside" className="w-full h-full object-cover" />
                    </div>
                    <span className={`text-xl font-bold tracking-tight ${isScrolled ? 'text-foreground' : 'text-white drop-shadow-md'}`}>
                        Lakeside
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {['Campsites', 'Activities', 'Gallery', 'Reviews'].map((link) => (
                        <a
                            key={link}
                            href={`#${link.toLowerCase()}`}
                            className={`text-sm font-medium hover:text-primary transition-colors ${isScrolled ? 'text-muted-foreground' : 'text-white/90 drop-shadow-sm hover:text-white'
                                }`}
                        >
                            {link}
                        </a>
                    ))}
                </div>

                {/* Auth Actions */}
                <div className="flex items-center gap-3">
                    <Link to="/login">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`rounded-full px-5 transition-all ${isScrolled
                                ? 'text-foreground hover:bg-muted'
                                : 'text-white hover:bg-white/10'
                                }`}
                        >
                            <LogIn className="mr-2 h-4 w-4" />
                            Login
                        </Button>
                    </Link>
                    <Link to="/signup">
                        <Button
                            size="sm"
                            className={`rounded-full px-5 transition-all ${isScrolled
                                ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-primary/20'
                                : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/20'
                                }`}
                        >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Sign Up
                        </Button>
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
};
