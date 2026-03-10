import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, CalendarDays, User, CreditCard, LifeBuoy,
    LogOut, Menu, X, Tent, ChevronDown, Bell, Settings
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardOverview from '../components/DashboardOverview';
import MyBookings from '../components/MyBookings';
import ProfileSection from '../components/ProfileSection';
import PaymentSection from '../components/PaymentSection';
import SupportSection from '../components/SupportSection';

const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: 'My Bookings', icon: CalendarDays },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'support', label: 'Support', icon: LifeBuoy },
];

const sectionComponents: Record<string, JSX.Element> = {
    overview: <DashboardOverview />,
    bookings: <MyBookings />,
    profile: <ProfileSection />,
    payment: <PaymentSection />,
    support: <SupportSection />,
};

export default function DashboardPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('overview');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : 'U';
    const fullName = user ? `${user.firstName} ${user.lastName}` : 'Guest';

    const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
        <aside className={`${mobile ? 'flex flex-col h-full' : 'hidden lg:flex flex-col'} w-64 bg-gradient-to-b from-green-900 via-green-800 to-emerald-900 text-white`}>
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
                <div className="p-2 bg-white/15 rounded-xl">
                    <Tent className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="font-bold text-sm leading-tight">Lakeside</p>
                    <p className="text-white/60 text-xs">Mabini, Bohol</p>
                </div>
                {mobile && (
                    <button onClick={() => setSidebarOpen(false)} className="ml-auto p-1 text-white/60 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* User Summary */}
            <div className="px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center font-bold text-green-900 text-sm flex-shrink-0">
                        {initials}
                    </div>
                    <div className="overflow-hidden">
                        <p className="font-semibold text-sm truncate">{fullName}</p>
                        <p className="text-white/50 text-xs truncate">{user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => { setActiveSection(id); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 text-left ${activeSection === id
                            ? 'bg-white/20 text-white shadow-lg'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {label}
                        {activeSection === id && (
                            <motion.div
                                layoutId="activeIndicator"
                                className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full"
                            />
                        )}
                    </button>
                ))}
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-white/10">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
                >
                    <LogOut className="w-4 h-4" />
                    Log Out
                </button>
            </div>
        </aside>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Desktop Sidebar */}
            <Sidebar />

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-64 z-50 lg:hidden"
                        >
                            <Sidebar mobile />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Navbar */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                    <div className="flex items-center justify-between px-4 md:px-6 h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">
                                    {navItems.find(n => n.id === activeSection)?.label}
                                </h1>
                                <p className="text-xs text-gray-400 hidden sm:block">Lakeside Campsite Booking System</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Notifications */}
                            <button className="relative p-2 text-gray-500 hover:text-green-700 hover:bg-green-50 rounded-xl transition-colors">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full"></span>
                            </button>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setProfileMenuOpen(p => !p)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-green-50 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center text-white font-bold text-xs">
                                        {initials}
                                    </div>
                                    <span className="hidden sm:block text-sm font-medium text-gray-700">{user?.firstName}</span>
                                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                <AnimatePresence>
                                    {profileMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                                        >
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="font-semibold text-sm text-gray-800">{fullName}</p>
                                                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                                            </div>
                                            <button
                                                onClick={() => { setActiveSection('profile'); setProfileMenuOpen(false); }}
                                                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                                            >
                                                <Settings className="w-4 h-4" /> Settings
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

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeSection}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.25 }}
                        >
                            {sectionComponents[activeSection]}
                        </motion.div>
                    </AnimatePresence>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 px-6 py-4">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-400">
                        <span>© 2025 Lakeside Campsite Booking System · Mabini, Bohol, Philippines</span>
                        <div className="flex items-center gap-4">
                            <a href="#" className="hover:text-green-600 transition-colors">Support</a>
                            <a href="#" className="hover:text-green-600 transition-colors">Contact</a>
                            <a href="#" className="hover:text-green-600 transition-colors">Terms</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
