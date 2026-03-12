import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Trees, Mountain, Sparkles } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import authimage from '../../../images/caro2.jpg';
import campsiteLogo from '../../../images/campsitelogo.png';

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [showSuccess, setShowSuccess] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState<{ firstName: string; lastName: string; role: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login', formData);
            const data = response.data;
            
            login(data.token, data.user);
            setLoggedInUser(data.user);
            setShowSuccess(true);
            
            // Navigate after showing success modal
            setTimeout(() => {
                if (data.user.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            }, 1800);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        setTimeout(() => setIsGoogleLoading(false), 2000);
    };

    return (
        <div className="min-h-screen flex font-['Inter',system-ui,sans-serif]">
            {/* ═══ LEFT — Hero / Brand Panel ═══ */}
            <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
                {/* Background image */}
                <div className="absolute inset-0">
                    <img
                        src={authimage}
                        alt="Lakeside campsite"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-green-950/80 via-green-900/70 to-emerald-950/80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Content on hero */}
                <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/15 backdrop-blur-md border border-white/10 group-hover:bg-white/25 transition-all">
                            <img src={campsiteLogo} alt="Lakeside" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="font-bold text-white text-lg leading-tight tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Lakeside <span className="text-emerald-400">Campsite</span>
                            </p>
                            <p className="text-white/50 text-[11px] font-medium tracking-wide uppercase">Mabini, Bohol</p>
                        </div>
                    </Link>

                    {/* Main Message */}
                    <div className="max-w-lg">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <div className="h-px w-10 bg-emerald-400/60" />
                                <span className="text-emerald-300/80 text-xs font-semibold tracking-widest uppercase">Welcome back</span>
                            </div>
                            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-[1.15] tracking-tight mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Your lakeside<br />escape awaits
                            </h1>
                            <p className="text-white/60 text-base leading-relaxed max-w-md">
                                Sign in to manage your bookings, order meals, and make the most of your campsite experience.
                            </p>
                        </motion.div>

                        {/* Feature pills */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="flex flex-wrap gap-2.5 mt-8"
                        >
                            {[
                                { icon: Trees, label: 'Campsites' },
                                { icon: Mountain, label: 'Activities' },
                                { icon: Sparkles, label: 'Amenities' },
                            ].map(({ icon: Icon, label }) => (
                                <div key={label} className="flex items-center gap-2 px-3.5 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                                    <Icon className="w-3.5 h-3.5 text-emerald-300" />
                                    <span className="text-white/80 text-xs font-medium">{label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Trust signage */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-4"
                    >
                        <div className="flex -space-x-2">
                            {['🏕️', '⛺', '🌲'].map((e, i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-white/15 backdrop-blur border-2 border-green-900 flex items-center justify-center text-sm">
                                    {e}
                                </div>
                            ))}
                        </div>
                        <div>
                            <p className="text-white/80 text-xs font-semibold">Trusted by 2,000+ campers</p>
                            <p className="text-white/40 text-[11px]">⭐ 4.9 rating · Mabini, Bohol</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ═══ RIGHT — Form Panel ═══ */}
            <div className="flex-1 flex items-center justify-center bg-gray-50 lg:bg-gray-50 px-5 py-10 lg:px-12 relative overflow-y-auto">
                {/* Mobile background image — visible only below lg */}
                <div className="absolute inset-0 lg:hidden">
                    <img
                        src={authimage}
                        alt=""
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-green-950/70 via-green-900/60 to-black/80" />
                </div>
                {/* Desktop subtle background pattern */}
                <div className="absolute inset-0 opacity-[0.015] hidden lg:block" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-[420px] relative z-10 lg:bg-transparent bg-white/95 backdrop-blur-xl lg:backdrop-blur-none rounded-2xl lg:rounded-none p-6 lg:p-0 shadow-2xl lg:shadow-none border border-white/20 lg:border-0"
                >
                    {/* Mobile logo */}
                    <Link to="/" className="lg:hidden flex items-center gap-3 mb-6 justify-center">
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-green-700/20 border border-green-600/30">
                            <img src={campsiteLogo} alt="Lakeside" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-bold text-gray-900 text-lg tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Lakeside <span className="text-emerald-500">Campsite</span>
                        </span>
                    </Link>

                    {/* Header */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Sign in to your account
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-green-700 font-semibold hover:text-green-800 transition-colors">
                                Create one free →
                            </Link>
                        </p>
                    </div>

                    {/* Google Button */}
                    <motion.button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isGoogleLoading}
                        whileHover={{ scale: 1.005 }}
                        whileTap={{ scale: 0.995 }}
                        className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 shadow-sm hover:shadow transition-all disabled:opacity-50"
                    >
                        {isGoogleLoading ? (
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin" />
                        ) : (
                            <GoogleIcon />
                        )}
                        {isGoogleLoading ? 'Connecting…' : 'Continue with Google'}
                    </motion.button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 font-medium">or sign in with email</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="text-sm font-medium text-gray-700">Password</label>
                                <Link to="#" className="text-xs text-green-700 font-medium hover:text-green-800 transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-11 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: -6, height: 0 }}
                                    className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 text-center"
                                >
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: isLoading ? 1 : 1.005 }}
                            whileTap={{ scale: isLoading ? 1 : 0.995 }}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-green-700 hover:bg-green-800 text-white text-sm font-semibold rounded-xl shadow-md shadow-green-700/25 hover:shadow-lg hover:shadow-green-700/30 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in…
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-xs text-gray-400 mt-8">
                        By continuing, you agree to our{' '}
                        <a href="#" className="text-gray-500 hover:text-green-700 underline underline-offset-2">Terms</a>{' '}
                        and{' '}
                        <a href="#" className="text-gray-500 hover:text-green-700 underline underline-offset-2">Privacy Policy</a>
                    </p>
                </motion.div>
            </div>

            {/* ═══ Login Success Modal ═══ */}
            <AnimatePresence>
                {showSuccess && loggedInUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', duration: 0.4, bounce: 0.2 }}
                            className="bg-white rounded-2xl shadow-2xl px-8 py-6 max-w-xs w-full text-center"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 12 }}
                                className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/25"
                            >
                                <motion.svg
                                    className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"
                                >
                                    <motion.path
                                        d="M5 13l4 4L19 7"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: 0.25, duration: 0.35 }}
                                    />
                                </motion.svg>
                            </motion.div>
                            <p className="text-sm font-semibold text-gray-800 mb-1">Welcome, {loggedInUser.firstName}!</p>
                            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                <div className="w-3.5 h-3.5 border-2 border-green-200 border-t-green-600 rounded-full animate-spin" />
                                Directing to {loggedInUser.role === 'ADMIN' ? 'admin panel' : 'dashboard'}…
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LoginPage;