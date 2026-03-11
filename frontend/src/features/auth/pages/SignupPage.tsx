import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Phone, ArrowRight, User, Eye, EyeOff, Tent, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

const SignupPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '', phone: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                login(data.token, data.user);
                navigate('/dashboard');
            } else {
                setError(data.error || 'Signup failed. Please try again.');
            }
        } catch {
            setError('Unable to connect. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignUp = async () => {
        setIsGoogleLoading(true);
        setTimeout(() => setIsGoogleLoading(false), 2000);
    };

    /* Password strength */
    const passwordStrength = (() => {
        const p = formData.password;
        if (!p) return 0;
        let s = 0;
        if (p.length >= 6) s++;
        if (p.length >= 8) s++;
        if (/[A-Z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;
        return Math.min(s, 4);
    })();
    const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][passwordStrength];
    const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-green-400', 'bg-emerald-500'][passwordStrength];

    return (
        <div className="min-h-screen flex font-['Inter',system-ui,sans-serif]">
            {/* ═══ LEFT — Hero Panel ═══ */}
            <div className="hidden lg:flex lg:w-[48%] relative overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&w=1600&q=80"
                        alt="Glamping setup"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/80 via-green-900/70 to-green-950/80" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="p-2.5 bg-white/15 backdrop-blur-md rounded-xl border border-white/10 group-hover:bg-white/25 transition-all">
                            <Tent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-white text-lg leading-tight tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Lakeside</p>
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
                                <span className="text-emerald-300/80 text-xs font-semibold tracking-widest uppercase">Start your journey</span>
                            </div>
                            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-[1.15] tracking-tight mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
                                Experience nature<br />like never before
                            </h1>
                            <p className="text-white/60 text-base leading-relaxed max-w-md">
                                Create your account to book campsites, pre-order meals, and plan unforgettable outdoor adventures.
                            </p>
                        </motion.div>

                        {/* Benefits */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="mt-8 space-y-3"
                        >
                            {[
                                'Instant campsite booking & confirmation',
                                'Pre-order meals for your stay',
                                'Equipment rental & activity reservations',
                            ].map(benefit => (
                                <div key={benefit} className="flex items-center gap-2.5">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                    <span className="text-white/70 text-sm">{benefit}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Social proof */}
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
                            <p className="text-white/80 text-xs font-semibold">Join 2,000+ happy campers</p>
                            <p className="text-white/40 text-[11px]">⭐ 4.9 rating · Free to create account</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ═══ RIGHT — Form Panel ═══ */}
            <div className="flex-1 flex items-center justify-center bg-gray-50 lg:bg-gray-50 px-5 py-8 lg:px-12 relative overflow-y-auto">
                {/* Mobile background image */}
                <div className="absolute inset-0 lg:hidden">
                    <img
                        src="https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&w=1200&q=80"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/70 via-green-900/60 to-black/80" />
                </div>
                {/* Desktop subtle pattern */}
                <div className="absolute inset-0 opacity-[0.015] hidden lg:block" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #000 1px, transparent 0)', backgroundSize: '24px 24px' }} />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full max-w-[440px] relative z-10 lg:bg-transparent bg-white/95 backdrop-blur-xl lg:backdrop-blur-none rounded-2xl lg:rounded-none p-6 lg:p-0 shadow-2xl lg:shadow-none border border-white/20 lg:border-0"
                >
                    {/* Mobile logo */}
                    <Link to="/" className="lg:hidden flex items-center gap-3 mb-5 justify-center">
                        <div className="p-2 bg-green-700/20 rounded-xl border border-green-600/30">
                            <Tent className="w-5 h-5 text-green-700" />
                        </div>
                        <span className="font-bold text-gray-900 text-lg tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Lakeside</span>
                    </Link>

                    {/* Header */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                            Create your account
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-green-700 font-semibold hover:text-green-800 transition-colors">
                                Sign in →
                            </Link>
                        </p>
                    </div>

                    {/* Google signup */}
                    <motion.button
                        type="button"
                        onClick={handleGoogleSignUp}
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
                        {isGoogleLoading ? 'Connecting…' : 'Sign up with Google'}
                    </motion.button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs text-gray-400 font-medium">or sign up with email</span>
                        <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3.5">
                        {/* Name Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        name="firstName"
                                        type="text"
                                        required
                                        placeholder="Juan"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
                                <input
                                    name="lastName"
                                    type="text"
                                    required
                                    placeholder="dela Cruz"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
                                />
                            </div>
                        </div>

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

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Phone <span className="text-gray-400 font-normal">(optional)</span>
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    name="phone"
                                    type="tel"
                                    placeholder="+63 9XX XXX XXXX"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    placeholder="Create a strong password"
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
                            {/* Strength indicator */}
                            {formData.password && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-2"
                                >
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= passwordStrength ? strengthColor : 'bg-gray-200'}`} />
                                        ))}
                                    </div>
                                    <p className={`text-[11px] font-medium ${passwordStrength <= 1 ? 'text-red-500' : passwordStrength <= 2 ? 'text-amber-500' : 'text-green-600'}`}>
                                        {strengthLabel} password
                                    </p>
                                </motion.div>
                            )}
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
                                    Creating account…
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </motion.button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-xs text-gray-400 mt-6">
                        By creating an account, you agree to our{' '}
                        <a href="#" className="text-gray-500 hover:text-green-700 underline underline-offset-2">Terms</a>{' '}
                        and{' '}
                        <a href="#" className="text-gray-500 hover:text-green-700 underline underline-offset-2">Privacy Policy</a>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default SignupPage;
