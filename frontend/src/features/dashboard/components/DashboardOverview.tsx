import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarDays, Moon, DollarSign, TrendingUp, ArrowRight, Tent, MapPin,
    Clock, Star, CloudSun, Thermometer, Droplets, Wind, Bell,
    CheckCircle, AlertCircle, Info, ChevronRight, Users, Sparkles
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';

const statusColors: Record<string, string> = {
    CONFIRMED: 'bg-green-100 text-green-700 border-green-200',
    PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
    COMPLETED: 'bg-blue-100 text-blue-700 border-blue-200',
    CANCELLED: 'bg-gray-100 text-gray-500 border-gray-200',
};

const weatherForecast = [
    { day: 'Today', temp: '28°', icon: CloudSun, condition: 'Partly Cloudy', humidity: '72%', wind: '12 km/h' },
    { day: 'Tomorrow', temp: '30°', icon: CloudSun, condition: 'Sunny', humidity: '65%', wind: '8 km/h' },
    { day: 'Wed', temp: '27°', icon: Droplets, condition: 'Light Rain', humidity: '80%', wind: '15 km/h' },
];

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } };

export default function DashboardOverview() {
    const { user } = useAuth();
    const [showNotifPanel, setShowNotifPanel] = useState(false);
    const [loading, setLoading] = useState(true);
    const [dashData, setDashData] = useState<any>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    useEffect(() => {
        const load = async () => {
            try {
                const [dashRes, notifRes] = await Promise.all([
                    api.get('/customer/dashboard'),
                    api.get('/customer/notifications'),
                ]);
                setDashData(dashRes.data);
                setNotifications(notifRes.data);
            } catch (err) {
                console.error('Dashboard load error:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const stats = dashData ? [
        { label: 'Upcoming Bookings', value: String(dashData.stats.upcomingBookings), icon: CalendarDays, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', trend: 'Active bookings', trendUp: dashData.stats.upcomingBookings > 0 },
        { label: 'Total Nights Booked', value: String(dashData.stats.totalNights), icon: Moon, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', trend: 'All-time', trendUp: dashData.stats.totalNights > 0 },
        { label: 'Amount Spent', value: `₱${Number(dashData.stats.totalSpent).toLocaleString()}`, icon: DollarSign, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', trend: 'Total all-time', trendUp: false },
        { label: 'Notifications', value: String(dashData.stats.unreadNotifications), icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', trend: 'Unread', trendUp: dashData.stats.unreadNotifications > 0 },
    ] : [];

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6">
            {/* ────── WELCOME BANNER ────── */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-800 via-green-700 to-emerald-600 text-white px-6 py-7 shadow-lg"
            >
                <div className="absolute -top-8 -right-8 w-44 h-44 bg-white/5 rounded-full" />
                <div className="absolute -bottom-14 -right-4 w-60 h-60 bg-white/5 rounded-full" />
                <div className="absolute top-6 right-1/3 w-20 h-20 bg-emerald-400/10 rounded-full blur-2xl" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="text-white/60 text-sm font-medium mb-1">{greeting} 👋</p>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome back, {user?.firstName}!</h2>
                        <p className="text-white/70 text-sm max-w-md">
                            {dashData && dashData.stats.upcomingBookings > 0 ? (
                                <>You have <span className="text-emerald-300 font-semibold">{dashData.stats.upcomingBookings} upcoming booking{dashData.stats.upcomingBookings > 1 ? 's' : ''}</span> at Lakeside Campsite.
                                {dashData.upcomingBookings[0] && <> Your next adventure starts in <span className="text-emerald-300 font-semibold">{dashData.upcomingBookings[0].daysUntil} days</span>.</>}</>
                            ) : (
                                <>No upcoming bookings yet. <span className="text-emerald-300 font-semibold">Book your first campsite today!</span></>
                            )}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-4">
                            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium"><MapPin className="w-3.5 h-3.5" /> Mabini, Bohol</span>
                            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium"><Tent className="w-3.5 h-3.5" /> Customer</span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white text-green-800 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-shadow">
                            <CalendarDays className="w-4 h-4" /> Book Now
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                            onClick={() => setShowNotifPanel(!showNotifPanel)}
                            className="relative flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl text-sm font-medium transition-colors">
                            <Bell className="w-4 h-4" />
                            {dashData && dashData.stats.unreadNotifications > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">{dashData.stats.unreadNotifications}</span>
                            )}
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* ────── STATS CARDS ────── */}
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div key={stat.label} variants={itemVariants}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className={`bg-white rounded-2xl p-5 border ${stat.border} shadow-sm hover:shadow-md transition-shadow cursor-default`}>
                            <div className="flex items-start justify-between mb-3">
                                <div className={`p-2.5 rounded-xl ${stat.bg}`}><Icon className={`w-5 h-5 ${stat.color}`} /></div>
                                {stat.trendUp && <span className="text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-semibold">↑</span>}
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</p>
                            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                            <p className="text-xs text-gray-400 mt-1">{stat.trend}</p>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* ────── MAIN GRID: Bookings + Activity ────── */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Upcoming Bookings — spans 2 cols */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-800 font-bold text-lg">Upcoming Bookings</h3>
                        <button className="flex items-center gap-1 text-sm text-green-700 hover:text-green-800 font-medium">View all <ArrowRight className="w-4 h-4" /></button>
                    </div>
                    {dashData && dashData.upcomingBookings.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                            <CalendarDays className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-400 font-medium">No upcoming bookings</p>
                            <p className="text-gray-300 text-xs mt-1">Book a campsite to get started!</p>
                        </div>
                    ) : (
                        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid md:grid-cols-2 gap-4">
                            {dashData?.upcomingBookings.map((booking: any) => (
                                <motion.div key={booking.id} variants={itemVariants} whileHover={{ y: -2 }}
                                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="relative h-36 overflow-hidden">
                                        {booking.images?.[0] ? (
                                            <img src={booking.images[0]} alt={booking.campsite} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center"><Tent className="w-10 h-10 text-green-300" /></div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColors[booking.status] || 'bg-gray-100 text-gray-500'}`}>{booking.status}</span>
                                        <div className="absolute bottom-3 left-3 text-white">
                                            <p className="font-bold text-sm">{booking.campsite}</p>
                                            <p className="text-white/70 text-xs">{booking.location}</p>
                                        </div>
                                        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-xs font-semibold">
                                            <Clock className="w-3 h-3 inline mr-1" />{booking.daysUntil} days
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="grid grid-cols-3 gap-2 text-center mb-3">
                                            <div><p className="text-[10px] text-gray-400 uppercase font-medium">Check-in</p><p className="text-xs font-semibold text-gray-700">{new Date(booking.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p></div>
                                            <div><p className="text-[10px] text-gray-400 uppercase font-medium">Nights</p><p className="text-xs font-semibold text-gray-700">{Math.ceil((new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / (1000 * 60 * 60 * 24))}</p></div>
                                            <div><p className="text-[10px] text-gray-400 uppercase font-medium">Guests</p><p className="text-xs font-semibold text-gray-700"><Users className="w-3 h-3 inline mr-0.5" />{booking.guestCount}</p></div>
                                        </div>
                                        <div className="flex items-center justify-between mb-3">
                                            <div><p className="text-xs text-gray-400">Booking ID</p><p className="text-xs font-mono font-semibold text-gray-600">{booking.id.slice(0, 12)}</p></div>
                                            <p className="text-base font-bold text-green-700">₱{Number(booking.totalPrice).toLocaleString()}</p>
                                        </div>
                                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                            className="w-full py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-semibold transition-colors">
                                            View Details
                                        </motion.button>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>

                {/* Recent Notifications */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-800 font-bold text-lg">Recent Notifications</h3>
                        <button className="text-xs text-green-700 font-medium hover:text-green-800">See all</button>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="divide-y divide-gray-50">
                            {notifications.length === 0 ? (
                                <div className="px-4 py-8 text-center"><Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" /><p className="text-sm text-gray-400">No notifications yet</p></div>
                            ) : notifications.slice(0, 6).map((notif: any, i: number) => (
                                <motion.div key={notif.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                                    className={`flex items-start gap-3 px-4 py-3 hover:bg-green-50/30 transition-colors ${!notif.isRead ? 'bg-green-50/20' : ''}`}>
                                    <div className={`p-1.5 rounded-lg mt-0.5 flex-shrink-0 ${notif.type === 'Booking' ? 'bg-green-50' : notif.type === 'Payment' ? 'bg-violet-50' : 'bg-blue-50'}`}>
                                        {notif.type === 'Booking' ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> :
                                         notif.type === 'Payment' ? <DollarSign className="w-3.5 h-3.5 text-violet-500" /> :
                                         <Info className="w-3.5 h-3.5 text-blue-500" />}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-semibold text-gray-700">{notif.title}</p>
                                        <p className="text-xs text-gray-500 leading-snug">{notif.message}</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">{new Date(notif.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    {!notif.isRead && <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1.5" />}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ────── SECOND ROW: Weather + Campsite Availability ────── */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Weather Forecast */}
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-2xl border border-blue-100 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <CloudSun className="w-5 h-5 text-blue-600" />
                        <h3 className="text-gray-800 font-bold text-sm">Weather in Mabini, Bohol</h3>
                    </div>
                    <div className="space-y-3">
                        {weatherForecast.map((w, i) => {
                            const WIcon = w.icon;
                            return (
                                <div key={i} className="flex items-center justify-between bg-white/70 backdrop-blur-sm rounded-xl px-4 py-3 border border-blue-100/50">
                                    <div className="flex items-center gap-3">
                                        <WIcon className="w-5 h-5 text-blue-500" />
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{w.day}</p>
                                            <p className="text-xs text-gray-500">{w.condition}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-blue-700">{w.temp}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                            <span className="flex items-center gap-0.5"><Droplets className="w-2.5 h-2.5" />{w.humidity}</span>
                                            <span className="flex items-center gap-0.5"><Wind className="w-2.5 h-2.5" />{w.wind}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-3 text-center">Forecast data for illustration only</p>
                </motion.div>

                {/* Campsite Availability */}
                <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                            <Tent className="w-5 h-5 text-green-600" />
                            <h3 className="text-gray-800 font-bold text-sm">Campsite Availability</h3>
                        </div>
                        <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-full">Live data</span>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {dashData && dashData.campsiteAvailability.length === 0 ? (
                            <div className="px-5 py-8 text-center"><Tent className="w-8 h-8 text-gray-200 mx-auto mb-2" /><p className="text-sm text-gray-400">No campsites available</p></div>
                        ) : dashData?.campsiteAvailability.map((site: any, i: number) => {
                            const avail = Math.max(0, site.available);
                            const pct = site.total > 0 ? (avail / site.total) * 100 : 0;
                            return (
                                <motion.div key={site.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                                    className="flex items-center justify-between px-5 py-3.5 hover:bg-green-50/30 transition-colors group">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${avail > 0 ? 'bg-green-500' : 'bg-red-400'}`} />
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 truncate">{site.name}</p>
                                            <p className="text-xs text-gray-400">{site.location || 'Lakeside'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 flex-shrink-0">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs font-semibold text-gray-700">₱{Number(site.pricePerNight).toLocaleString()}/night</p>
                                        </div>
                                        <div className="w-24">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-xs font-semibold ${avail > 0 ? 'text-green-600' : 'text-red-500'}`}>{avail}/{site.total}</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${avail > 0 ? 'bg-green-500' : 'bg-red-400'}`} style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-green-600 transition-colors" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* ────── QUICK ACTIONS ────── */}
            <div>
                <h3 className="text-gray-800 font-bold text-lg mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Book a Campsite', desc: 'Reserve your spot', icon: Tent, color: 'from-green-700 to-emerald-600' },
                        { label: 'View Bookings', desc: 'Manage your stays', icon: CalendarDays, color: 'from-blue-600 to-blue-500' },
                        { label: 'My Payments', desc: 'Transaction history', icon: DollarSign, color: 'from-violet-600 to-violet-500' },
                        { label: 'Notifications', desc: 'Stay updated', icon: Bell, color: 'from-amber-600 to-amber-500' },
                    ].map(({ label, desc, icon: Icon, color }) => (
                        <motion.button key={label} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                            className={`bg-gradient-to-br ${color} text-white rounded-2xl p-5 text-left shadow-sm hover:shadow-md transition-shadow`}>
                            <Icon className="w-6 h-6 mb-3 opacity-90" />
                            <p className="text-sm font-semibold leading-tight">{label}</p>
                            <p className="text-xs text-white/60 mt-0.5">{desc}</p>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* ────── NOTIFICATION PANEL MODAL ────── */}
            <AnimatePresence>
                {showNotifPanel && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end" onClick={() => setShowNotifPanel(false)}>
                        <motion.div initial={{ x: 320 }} animate={{ x: 0 }} exit={{ x: 320 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="bg-white w-full max-w-sm h-full shadow-2xl overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-green-700" />
                                    <h3 className="font-bold text-gray-800">Notifications</h3>
                                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">{notifications.filter((n: any) => !n.isRead).length} new</span>
                                </div>
                                <button onClick={() => setShowNotifPanel(false)} className="text-xs text-gray-400 hover:text-gray-600 font-medium">Close</button>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {notifications.length === 0 ? (
                                    <div className="px-5 py-12 text-center"><Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" /><p className="text-gray-400">No notifications</p></div>
                                ) : notifications.map((notif: any, i: number) => (
                                    <div key={notif.id} className={`flex items-start gap-3 px-5 py-4 hover:bg-green-50/30 transition-colors ${!notif.isRead ? 'bg-green-50/20' : ''}`}>
                                        <div className={`p-2 rounded-xl mt-0.5 flex-shrink-0 ${notif.type === 'Booking' ? 'bg-green-50' : notif.type === 'Payment' ? 'bg-violet-50' : 'bg-blue-50'}`}>
                                            {notif.type === 'Booking' ? <CheckCircle className="w-4 h-4 text-green-500" /> :
                                             notif.type === 'Payment' ? <DollarSign className="w-4 h-4 text-violet-500" /> :
                                             <Info className="w-4 h-4 text-blue-500" />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-700">{notif.title}</p>
                                            <p className="text-sm text-gray-500 leading-snug">{notif.message}</p>
                                            <p className="text-xs text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        {!notif.isRead && <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1.5" />}
                                    </div>
                                ))}
                            </div>
                            <div className="p-5">
                                <button onClick={async () => { await api.put('/customer/notifications/read-all'); setNotifications(n => n.map(x => ({ ...x, isRead: true }))); }}
                                    className="w-full py-2.5 text-sm font-semibold text-green-700 border border-green-200 rounded-xl hover:bg-green-50 transition-colors">
                                    Mark All as Read
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
