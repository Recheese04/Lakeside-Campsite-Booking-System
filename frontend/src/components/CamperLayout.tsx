import { useState, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Menu, X, Tent, ChevronDown, Bell, Settings, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NavItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface CamperLayoutProps {
    navItems: NavItem[];
    sectionComponents: Record<string, ReactNode>;
    variant?: 'user' | 'admin';
}

export default function CamperLayout({ navItems, sectionComponents, variant = 'user' }: CamperLayoutProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState(navItems[0]?.id ?? 'overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const handleLogout = () => { logout(); navigate('/'); };

    const isAdmin = variant === 'admin';
    const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : (isAdmin ? 'A' : 'U');
    const fullName = user ? `${user.firstName} ${user.lastName}` : (isAdmin ? 'Admin' : 'Guest');

    /* ─── Theme tokens ─── */
    const theme = isAdmin
        ? { sidebar: 'from-slate-900 via-slate-800 to-slate-900', avatar: 'from-violet-600 to-violet-400', accent: 'bg-violet-400', headerHover: 'hover:text-violet-700 hover:bg-violet-50', footerHover: 'hover:text-violet-600', badgeBg: 'bg-red-500' }
        : { sidebar: 'from-green-900 via-green-800 to-emerald-900', avatar: 'from-green-600 to-emerald-400', accent: 'bg-emerald-400', headerHover: 'hover:text-green-700 hover:bg-green-50', footerHover: 'hover:text-green-600', badgeBg: 'bg-emerald-500' };

    /* ─── Sidebar ─── */
    const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
        <aside className={`${mobile ? 'flex' : 'hidden lg:flex'} flex-col w-72 h-screen bg-gradient-to-b ${theme.sidebar} text-white`}>
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10 flex-shrink-0">
                <div className="p-2 bg-white/15 rounded-xl">
                    {isAdmin ? <Shield className="w-5 h-5 text-white" /> : <Tent className="w-5 h-5 text-white" />}
                </div>
                <div>
                    <p className="font-bold text-sm leading-tight">{isAdmin ? 'Lakeside Admin' : 'Lakeside'}</p>
                    <p className="text-white/60 text-xs">{isAdmin ? 'Control Panel' : 'Mabini, Bohol'}</p>
                </div>
                {mobile && (
                    <button onClick={() => setSidebarOpen(false)} className="ml-auto p-1 text-white/60 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* User summary */}
            <div className="px-6 py-4 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${theme.avatar} flex items-center justify-center font-bold text-white text-sm flex-shrink-0`}>
                        {initials}
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-semibold text-sm truncate">{fullName}</p>
                        <p className="text-white/50 text-xs truncate">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Nav — only this section scrolls */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
                {navItems.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => { setActiveSection(id); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                            activeSection === id
                                ? 'bg-white/20 text-white shadow-lg'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{label}</span>
                        {activeSection === id && (
                            <motion.div layoutId={`${variant}ActiveDot`} className={`ml-auto w-1.5 h-1.5 ${theme.accent} rounded-full flex-shrink-0`} />
                        )}
                        {id === 'notifications' && (
                            <span className="ml-auto bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0">3</span>
                        )}
                    </button>
                ))}
            </nav>

            {/* Bottom actions */}
            <div className="px-3 py-3 border-t border-white/10 flex-shrink-0 space-y-1">
                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200">
                    <LogOut className="w-4 h-4" /> Log Out
                </button>
            </div>
        </aside>
    );

    return (
        <div className="h-screen overflow-hidden bg-gray-50">
            {/* ═══ FIXED DESKTOP SIDEBAR ═══ */}
            <div className="fixed left-0 top-0 bottom-0 z-30 hidden lg:block">
                <SidebarContent />
            </div>

            {/* ═══ MOBILE SIDEBAR OVERLAY ═══ */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: -288 }} animate={{ x: 0 }} exit={{ x: -288 }}
                            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                            className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
                        >
                            <SidebarContent mobile />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ═══ MAIN AREA (offset by sidebar width on lg+) ═══ */}
            <div className="lg:ml-72 flex flex-col h-screen">
                {/* ── Sticky top header ── */}
                <header className="bg-white border-b border-gray-200 flex-shrink-0 sticky top-0 z-20">
                    <div className="flex items-center justify-between px-4 md:px-6 h-14">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setSidebarOpen(true)} className={`lg:hidden p-2 text-gray-500 ${theme.headerHover} rounded-lg transition-colors`}>
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-base font-bold text-gray-900 leading-tight">
                                    {navItems.find(n => n.id === activeSection)?.label}
                                </h1>
                                <p className="text-[11px] text-gray-400 hidden sm:block leading-tight">
                                    {isAdmin ? 'Admin Panel · Lakeside Campsite' : 'Lakeside Campsite Booking System'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                            {/* Notification bell */}
                            <button
                                onClick={() => setActiveSection('notifications')}
                                className={`relative p-2 text-gray-500 ${theme.headerHover} rounded-xl transition-colors`}
                            >
                                <Bell className="w-5 h-5" />
                                <span className={`absolute top-1.5 right-1.5 w-2 h-2 ${theme.badgeBg} rounded-full`}></span>
                            </button>

                            {/* Profile dropdown */}
                            <div className="relative">
                                <button onClick={() => setProfileMenuOpen(p => !p)} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl ${isAdmin ? 'hover:bg-violet-50' : 'hover:bg-green-50'} transition-colors`}>
                                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${theme.avatar} flex items-center justify-center text-white font-bold text-xs`}>
                                        {initials}
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.firstName}</span>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {profileMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 6, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 6, scale: 0.96 }}
                                            transition={{ duration: 0.12 }}
                                            className="absolute right-0 mt-1.5 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="font-semibold text-sm text-gray-800">{fullName}</p>
                                                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                                            </div>
                                            <button
                                                onClick={() => { isAdmin ? navigate('/dashboard') : setActiveSection('profile'); setProfileMenuOpen(false); }}
                                                className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 ${isAdmin ? 'hover:bg-violet-50 hover:text-violet-700' : 'hover:bg-green-50 hover:text-green-700'} transition-colors`}
                                            >
                                                <Settings className="w-4 h-4" /> {isAdmin ? 'User Dashboard' : 'Settings'}
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" /> Log Out
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </header>

                {/* ── Scrollable content area ── */}
                <main className="flex-1 overflow-y-auto">
                    <div className="p-4 md:p-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {sectionComponents[activeSection]}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Footer inside scroll area so it's always at the bottom of content */}
                    <footer className="bg-white border-t border-gray-200 px-6 py-4 mt-auto">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
                            <span>© 2025 Lakeside Campsite · {isAdmin ? 'Admin Panel' : 'Mabini, Bohol, Philippines'}</span>
                            <div className="flex items-center gap-4">
                                <a href="#" className={`${theme.footerHover} transition-colors`}>{isAdmin ? 'Docs' : 'Support'}</a>
                                <a href="#" className={`${theme.footerHover} transition-colors`}>{isAdmin ? 'Support' : 'Contact'}</a>
                                {!isAdmin && <a href="#" className={`${theme.footerHover} transition-colors`}>Terms</a>}
                            </div>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
}
