import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../../context/AuthContext';

const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    const [focused, setFocused] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                login(data.token, data.user);
                navigate('/dashboard');
            } else {
                setError(data.error || 'Login failed. Please try again.');
            }
        } catch {
            setError('Unable to connect. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        // Google OAuth logic here
        setTimeout(() => setIsGoogleLoading(false), 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{
            background: 'linear-gradient(135deg, #f8faff 0%, #eef2ff 50%, #f0f4ff 100%)',
            fontFamily: "'DM Sans', system-ui, sans-serif"
        }}>
            {/* Ambient background blobs */}
            <div style={{
                position: 'fixed', top: '-10%', right: '-5%',
                width: '500px', height: '500px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'fixed', bottom: '-10%', left: '-5%',
                width: '400px', height: '400px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}
            >
                {/* Card */}
                <div style={{
                    background: 'rgba(255,255,255,0.85)',
                    backdropFilter: 'blur(24px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(99,102,241,0.12)',
                    boxShadow: '0 8px 40px rgba(99,102,241,0.1), 0 1px 0 rgba(255,255,255,0.9) inset',
                    padding: '40px',
                    overflow: 'hidden',
                    position: 'relative'
                }}>
                    {/* Top accent line */}
                    <div style={{
                        position: 'absolute', top: 0, left: '10%', right: '10%', height: '2px',
                        background: 'linear-gradient(90deg, transparent, #6366f1, #8b5cf6, transparent)',
                        borderRadius: '0 0 4px 4px'
                    }} />

                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            style={{
                                width: '52px', height: '52px', borderRadius: '16px',
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 20px',
                                boxShadow: '0 8px 24px rgba(99,102,241,0.35)'
                            }}
                        >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10 17 15 12 10 7" />
                                <line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                        </motion.div>
                        <h1 style={{
                            fontSize: '26px', fontWeight: '700', color: '#0f172a',
                            letterSpacing: '-0.5px', marginBottom: '6px'
                        }}>Welcome back</h1>
                        <p style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '400' }}>
                            Sign in to continue to your account
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                            {/* Email Field */}
                            <div>
                                <label style={{
                                    display: 'block', fontSize: '13px', fontWeight: '500',
                                    color: '#374151', marginBottom: '6px'
                                }}>Email address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail style={{
                                        position: 'absolute', left: '14px', top: '50%',
                                        transform: 'translateY(-50%)', width: '16px', height: '16px',
                                        color: focused === 'email' ? '#6366f1' : '#94a3b8',
                                        transition: 'color 0.2s'
                                    }} />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        placeholder="you@example.com"
                                        onChange={handleChange}
                                        onFocus={() => setFocused('email')}
                                        onBlur={() => setFocused(null)}
                                        style={{
                                            width: '100%', padding: '11px 14px 11px 40px',
                                            borderRadius: '12px', fontSize: '14px',
                                            background: focused === 'email' ? '#fff' : '#f8faff',
                                            border: `1.5px solid ${focused === 'email' ? '#6366f1' : '#e2e8f0'}`,
                                            color: '#0f172a', outline: 'none',
                                            transition: 'all 0.2s',
                                            boxShadow: focused === 'email' ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>Password</label>
                                    <Link to="#" style={{
                                        fontSize: '12px', color: '#6366f1', fontWeight: '500',
                                        textDecoration: 'none'
                                    }}
                                        onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                                        onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <Lock style={{
                                        position: 'absolute', left: '14px', top: '50%',
                                        transform: 'translateY(-50%)', width: '16px', height: '16px',
                                        color: focused === 'password' ? '#6366f1' : '#94a3b8',
                                        transition: 'color 0.2s'
                                    }} />
                                    <input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        placeholder="••••••••"
                                        onChange={handleChange}
                                        onFocus={() => setFocused('password')}
                                        onBlur={() => setFocused(null)}
                                        style={{
                                            width: '100%', padding: '11px 44px 11px 40px',
                                            borderRadius: '12px', fontSize: '14px',
                                            background: focused === 'password' ? '#fff' : '#f8faff',
                                            border: `1.5px solid ${focused === 'password' ? '#6366f1' : '#e2e8f0'}`,
                                            color: '#0f172a', outline: 'none',
                                            transition: 'all 0.2s',
                                            boxShadow: focused === 'password' ? '0 0 0 3px rgba(99,102,241,0.1)' : 'none',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        style={{
                                            position: 'absolute', right: '12px', top: '50%',
                                            transform: 'translateY(-50%)', background: 'none',
                                            border: 'none', cursor: 'pointer', padding: '2px',
                                            color: '#94a3b8', display: 'flex', alignItems: 'center',
                                            transition: 'color 0.2s'
                                        }}
                                        onMouseEnter={e => (e.currentTarget.style.color = '#6366f1')}
                                        onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                        exit={{ opacity: 0, y: -8, height: 0 }}
                                        style={{
                                            background: '#fef2f2', border: '1px solid #fecaca',
                                            borderRadius: '10px', padding: '10px 14px',
                                            fontSize: '13px', color: '#dc2626', textAlign: 'center'
                                        }}
                                    >
                                        {error}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit Button */}
                            <motion.button
                                type="submit"
                                disabled={isLoading}
                                whileHover={{ scale: isLoading ? 1 : 1.01 }}
                                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                style={{
                                    width: '100%', padding: '13px',
                                    background: isLoading
                                        ? 'linear-gradient(135deg, #a5b4fc, #c4b5fd)'
                                        : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    border: 'none', borderRadius: '12px',
                                    color: '#fff', fontSize: '14px', fontWeight: '600',
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
                                    transition: 'all 0.2s', letterSpacing: '0.01em'
                                }}
                            >
                                {isLoading ? (
                                    <>
                                        <div style={{
                                            width: '16px', height: '16px',
                                            border: '2px solid rgba(255,255,255,0.4)',
                                            borderTopColor: '#fff', borderRadius: '50%',
                                            animation: 'spin 0.7s linear infinite'
                                        }} />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight size={16} />
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        margin: '24px 0'
                    }}>
                        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                        <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500', whiteSpace: 'nowrap' }}>
                            or continue with
                        </span>
                        <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
                    </div>

                    {/* Google Sign In */}
                    <motion.button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isGoogleLoading}
                        whileHover={{ scale: isGoogleLoading ? 1 : 1.01 }}
                        whileTap={{ scale: isGoogleLoading ? 1 : 0.98 }}
                        style={{
                            width: '100%', padding: '12px',
                            background: '#fff', border: '1.5px solid #e2e8f0',
                            borderRadius: '12px', cursor: isGoogleLoading ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            fontSize: '14px', fontWeight: '600', color: '#374151',
                            transition: 'all 0.2s',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.06)'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#6366f1';
                            e.currentTarget.style.boxShadow = '0 2px 12px rgba(99,102,241,0.12)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
                        }}
                    >
                        {isGoogleLoading ? (
                            <div style={{
                                width: '16px', height: '16px',
                                border: '2px solid #e2e8f0',
                                borderTopColor: '#6366f1', borderRadius: '50%',
                                animation: 'spin 0.7s linear infinite'
                            }} />
                        ) : (
                            <GoogleIcon />
                        )}
                        {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
                    </motion.button>

                    {/* Footer */}
                    <p style={{
                        textAlign: 'center', marginTop: '24px',
                        fontSize: '13px', color: '#94a3b8'
                    }}>
                        Don't have an account?{' '}
                        <Link to="/signup" style={{
                            color: '#6366f1', fontWeight: '600', textDecoration: 'none'
                        }}
                            onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
                            onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
                        >
                            Create one free
                        </Link>
                    </p>
                </div>
            </motion.div>

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
                * { box-sizing: border-box; }
                input::placeholder { color: #cbd5e1; }
            `}</style>
        </div>
    );
};

export default LoginPage;