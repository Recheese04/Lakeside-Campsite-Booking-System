import { Link } from 'react-router-dom';
import { Tent, LogIn, UserPlus } from 'lucide-react';
import { Button } from './ui/button';

export const Header = () => {
    return (
        <header className="absolute top-0 left-0 right-0 z-50 px-6 py-4">
            <nav className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2 group">
                    <div className="p-2 bg-emerald-500 rounded-lg group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-emerald-500/20">
                        <Tent className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white tracking-tight">
                        Lakeside
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8 text-white/90 font-medium">
                    <Link to="/" className="hover:text-emerald-400 transition-colors">Campsites</Link>
                    <Link to="/bookings" className="hover:text-emerald-400 transition-colors">My Bookings</Link>
                </div>

                {/* Auth Actions */}
                <div className="flex items-center space-x-4">
                    <Link to="/login">
                        <Button
                            variant="ghost"
                            className="text-white hover:text-white hover:bg-white/10"
                        >
                            <LogIn className="mr-2 h-4 w-4" />
                            Login
                        </Button>
                    </Link>
                    <Link to="/signup">
                        <Button
                            className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                        >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Sign Up
                        </Button>
                    </Link>
                </div>
            </nav>
        </header>
    );
};
