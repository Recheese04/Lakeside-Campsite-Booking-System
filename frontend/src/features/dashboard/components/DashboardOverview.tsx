import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CalendarDays, Moon, DollarSign, TrendingUp, ArrowRight, Tent, MapPin,
    Clock, Star, CloudSun, Thermometer, Droplets, Wind, Bell,
    CheckCircle, AlertCircle, Info, ChevronRight, Users, Sparkles
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

/* ───────── MOCK DATA ───────── */
const stats = [
    { label: 'Upcoming Bookings', value: '2', icon: CalendarDays, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', trend: '+1 this month', trendUp: true },
    { label: 'Total Nights Booked', value: '14', icon: Moon, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', trend: '+6 vs last month', trendUp: true },
    { label: 'Amount Spent', value: '₱12,800', icon: DollarSign, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', trend: 'Total all-time', trendUp: false },
    { label: 'Loyalty Points', value: '1,280', icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', trend: 'Redeem on next stay', trendUp: true },
];

const upcomingBookings = [
    {
        id: 'LCS-20250310', campsite: 'Lakefront Deluxe Tent', location: 'Zone A · Mabini, Bohol',
        checkIn: 'Mar 20, 2025', checkOut: 'Mar 23, 2025', nights: 3, guests: 2,
        status: 'Approved', amount: '₱4,500', daysUntil: 10,
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'LCS-20250402', campsite: 'Premium Glamping Dome', location: 'Zone B · Mabini, Bohol',
        checkIn: 'Apr 5, 2025', checkOut: 'Apr 8, 2025', nights: 3, guests: 4,
        status: 'Pending', amount: '₱7,200', daysUntil: 26,
        image: 'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&w=400&q=80',
    },
];

const recentActivity = [
    { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', text: 'Booking LCS-20250310 was approved', time: '2 hours ago' },
    { icon: DollarSign, color: 'text-violet-500', bg: 'bg-violet-50', text: 'Payment of ₱4,500 confirmed via GCash', time: '3 hours ago' },
    { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50', text: 'Booking LCS-20250402 is awaiting approval', time: '1 day ago' },
    { icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50', text: 'You earned 450 loyalty points', time: '2 days ago' },
    { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50', text: 'Check-in reminder: 10 days until your stay', time: '3 days ago' },
    { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', text: 'Profile information updated successfully', time: '1 week ago' },
];

const weatherForecast = [
    { day: 'Today', temp: '28°', icon: CloudSun, condition: 'Partly Cloudy', humidity: '72%', wind: '12 km/h' },
    { day: 'Tomorrow', temp: '30°', icon: CloudSun, condition: 'Sunny', humidity: '65%', wind: '8 km/h' },
    { day: 'Wed', temp: '27°', icon: Droplets, condition: 'Light Rain', humidity: '80%', wind: '15 km/h' },
];

const campsiteAvailability = [
    { name: 'Lakefront Deluxe Tent', zone: 'Zone A', available: 3, total: 5, rate: '₱1,500/night' },
    { name: 'Premium Glamping Dome', zone: 'Zone B', available: 1, total: 3, rate: '₱2,400/night' },
    { name: 'Hilltop Campsite', zone: 'Zone C', available: 4, total: 6, rate: '₱1,300/night' },
    { name: 'Riverside Tent Site', zone: 'Zone A', available: 0, total: 4, rate: '₱900/night' },
];

const statusColors: Record<string, string> = {
    Approved: 'bg-green-100 text-green-700 border-green-200',
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
};

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } };

/* ───────── COMPONENT ───────── */
export default function DashboardOverview() {
    const { user } = useAuth();
    const [showNotifPanel, setShowNotifPanel] = useState(false);
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

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
                            You have <span className="text-emerald-300 font-semibold">2 upcoming bookings</span> at Lakeside Campsite. Your next adventure starts in <span className="text-emerald-300 font-semibold">10 days</span>.
                        </p>
                        <div className="flex flex-wrap items-center gap-2 mt-4">
                            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium"><MapPin className="w-3.5 h-3.5" /> Mabini, Bohol</span>
                            <span className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium"><Tent className="w-3.5 h-3.5" /> Customer</span>
                            <span className="flex items-center gap-1.5 bg-emerald-400/20 px-3 py-1.5 rounded-full text-xs font-medium"><Sparkles className="w-3.5 h-3.5" /> 1,280 pts</span>
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
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">3</span>
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
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid md:grid-cols-2 gap-4">
                        {upcomingBookings.map((booking) => (
                            <motion.div key={booking.id} variants={itemVariants} whileHover={{ y: -2 }}
                                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="relative h-36 overflow-hidden">
                                    <img src={booking.image} alt={booking.campsite} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColors[booking.status]}`}>{booking.status}</span>
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
                                        <div><p className="text-[10px] text-gray-400 uppercase font-medium">Check-in</p><p className="text-xs font-semibold text-gray-700">{booking.checkIn}</p></div>
                                        <div><p className="text-[10px] text-gray-400 uppercase font-medium">Nights</p><p className="text-xs font-semibold text-gray-700">{booking.nights}</p></div>
                                        <div><p className="text-[10px] text-gray-400 uppercase font-medium">Guests</p><p className="text-xs font-semibold text-gray-700"><Users className="w-3 h-3 inline mr-0.5" />{booking.guests}</p></div>
                                    </div>
                                    <div className="flex items-center justify-between mb-3">
                                        <div><p className="text-xs text-gray-400">Booking ID</p><p className="text-xs font-mono font-semibold text-gray-600">{booking.id}</p></div>
                                        <p className="text-base font-bold text-green-700">{booking.amount}</p>
                                    </div>
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        className="w-full py-2.5 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-semibold transition-colors">
                                        View Details
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Activity Timeline */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-gray-800 font-bold text-lg">Recent Activity</h3>
                        <button className="text-xs text-green-700 font-medium hover:text-green-800">See all</button>
                    </div>
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="divide-y divide-gray-50">
                            {recentActivity.map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                                        className="flex items-start gap-3 px-4 py-3 hover:bg-green-50/30 transition-colors">
                                        <div className={`p-1.5 rounded-lg ${item.bg} mt-0.5 flex-shrink-0`}><Icon className={`w-3.5 h-3.5 ${item.color}`} /></div>
                                        <div className="min-w-0">
                                            <p className="text-xs text-gray-700 leading-snug">{item.text}</p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">{item.time}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
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
                        <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-full">Updated just now</span>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {campsiteAvailability.map((site, i) => {
                            const pct = (site.available / site.total) * 100;
                            return (
                                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.05 }}
                                    className="flex items-center justify-between px-5 py-3.5 hover:bg-green-50/30 transition-colors group">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${site.available > 0 ? 'bg-green-500' : 'bg-red-400'}`} />
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 truncate">{site.name}</p>
                                            <p className="text-xs text-gray-400">{site.zone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 flex-shrink-0">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs font-semibold text-gray-700">{site.rate}</p>
                                        </div>
                                        <div className="w-24">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-xs font-semibold ${site.available > 0 ? 'text-green-600' : 'text-red-500'}`}>{site.available}/{site.total}</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${site.available > 0 ? 'bg-green-500' : 'bg-red-400'}`} style={{ width: `${pct}%` }} />
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
                        { label: 'Earn Points', desc: 'Loyalty rewards', icon: Star, color: 'from-amber-600 to-amber-500' },
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
                                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">3 new</span>
                                </div>
                                <button onClick={() => setShowNotifPanel(false)} className="text-xs text-gray-400 hover:text-gray-600 font-medium">Close</button>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {recentActivity.map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={i} className={`flex items-start gap-3 px-5 py-4 hover:bg-green-50/30 transition-colors ${i < 3 ? 'bg-green-50/20' : ''}`}>
                                            <div className={`p-2 rounded-xl ${item.bg} mt-0.5 flex-shrink-0`}><Icon className={`w-4 h-4 ${item.color}`} /></div>
                                            <div className="min-w-0">
                                                <p className="text-sm text-gray-700 leading-snug">{item.text}</p>
                                                <p className="text-xs text-gray-400 mt-1">{item.time}</p>
                                            </div>
                                            {i < 3 && <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1.5" />}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="p-5">
                                <button className="w-full py-2.5 text-sm font-semibold text-green-700 border border-green-200 rounded-xl hover:bg-green-50 transition-colors">
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
