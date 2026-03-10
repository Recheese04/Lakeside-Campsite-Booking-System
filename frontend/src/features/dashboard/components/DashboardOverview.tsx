import { motion } from 'framer-motion';
import { CalendarDays, Moon, DollarSign, TrendingUp, ArrowRight, Tent, MapPin } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const stats = [
    {
        label: 'Upcoming Bookings',
        value: '2',
        icon: CalendarDays,
        color: 'text-blue-600',
        bg: 'bg-blue-50',
        border: 'border-blue-100',
        trend: '+1 this month',
    },
    {
        label: 'Total Nights Booked',
        value: '14',
        icon: Moon,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50',
        border: 'border-emerald-100',
        trend: '+6 vs last month',
    },
    {
        label: 'Amount Spent',
        value: '₱12,800',
        icon: DollarSign,
        color: 'text-violet-600',
        bg: 'bg-violet-50',
        border: 'border-violet-100',
        trend: 'Total all-time',
    },
    {
        label: 'Loyalty Points',
        value: '1,280',
        icon: TrendingUp,
        color: 'text-amber-600',
        bg: 'bg-amber-50',
        border: 'border-amber-100',
        trend: 'Redeem on next stay',
    },
];

const upcomingBookings = [
    {
        id: 'LCS-20250310',
        campsite: 'Lakefront Deluxe Tent',
        location: 'Zone A · Mabini, Bohol',
        checkIn: 'Mar 20, 2025',
        checkOut: 'Mar 23, 2025',
        nights: 3,
        guests: 2,
        status: 'Approved',
        amount: '₱4,500',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 'LCS-20250402',
        campsite: 'Premium Glamping Dome',
        location: 'Zone B · Mabini, Bohol',
        checkIn: 'Apr 5, 2025',
        checkOut: 'Apr 8, 2025',
        nights: 3,
        guests: 4,
        status: 'Pending',
        amount: '₱7,200',
        image: 'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&w=400&q=80',
    },
];

const statusColors: Record<string, string> = {
    Approved: 'bg-green-100 text-green-700 border-green-200',
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Rejected: 'bg-red-100 text-red-700 border-red-200',
    Completed: 'bg-blue-100 text-blue-700 border-blue-200',
    Cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
};

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function DashboardOverview() {
    const { user } = useAuth();
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-800 via-green-700 to-emerald-600 text-white px-6 py-7 shadow-lg"
            >
                {/* Decorative circles */}
                <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full" />
                <div className="absolute -bottom-12 -right-4 w-56 h-56 bg-white/5 rounded-full" />
                <div className="absolute top-4 right-1/3 w-16 h-16 bg-emerald-400/10 rounded-full blur-xl" />

                <div className="relative z-10">
                    <p className="text-white/60 text-sm font-medium mb-1">{greeting} 👋</p>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                        Welcome back, {user?.firstName}!
                    </h2>
                    <p className="text-white/70 text-sm max-w-md">
                        You have <span className="text-emerald-300 font-semibold">2 upcoming bookings</span> at Lakeside Campsite. Your next adventure starts in 10 days.
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                        <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium">
                            <MapPin className="w-3.5 h-3.5" />
                            Mabini, Bohol, Philippines
                        </div>
                        <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium">
                            <Tent className="w-3.5 h-3.5" />
                            Customer
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
            >
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            variants={itemVariants}
                            whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className={`bg-white rounded-2xl p-5 border ${stat.border} shadow-sm hover:shadow-md transition-shadow cursor-default`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                                    <Icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</p>
                            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                            <p className="text-xs text-gray-400 mt-1">{stat.trend}</p>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Upcoming Bookings */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-800 font-bold text-lg">Upcoming Bookings</h3>
                    <button className="flex items-center gap-1 text-sm text-green-700 hover:text-green-800 font-medium">
                        View all <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid md:grid-cols-2 gap-4"
                >
                    {upcomingBookings.map((booking) => (
                        <motion.div
                            key={booking.id}
                            variants={itemVariants}
                            whileHover={{ y: -2, transition: { duration: 0.2 } }}
                            className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="relative h-36 overflow-hidden">
                                <img
                                    src={booking.image}
                                    alt={booking.campsite}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColors[booking.status]}`}>
                                    {booking.status}
                                </span>
                                <div className="absolute bottom-3 left-3 text-white">
                                    <p className="font-bold text-sm">{booking.campsite}</p>
                                    <p className="text-white/70 text-xs">{booking.location}</p>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-medium">Check-in</p>
                                        <p className="text-xs font-semibold text-gray-700">{booking.checkIn}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-medium">Nights</p>
                                        <p className="text-xs font-semibold text-gray-700">{booking.nights}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-medium">Check-out</p>
                                        <p className="text-xs font-semibold text-gray-700">{booking.checkOut}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-400">Booking ID</p>
                                        <p className="text-xs font-mono font-semibold text-gray-600">{booking.id}</p>
                                    </div>
                                    <p className="text-base font-bold text-green-700">{booking.amount}</p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="mt-3 w-full py-2 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-semibold transition-colors"
                                >
                                    View Details
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-gray-800 font-bold text-lg mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Book a Campsite', icon: Tent, color: 'from-green-700 to-emerald-600' },
                        { label: 'View All Bookings', icon: CalendarDays, color: 'from-blue-600 to-blue-500' },
                        { label: 'My Payments', icon: DollarSign, color: 'from-violet-600 to-violet-500' },
                        { label: 'Get Support', icon: TrendingUp, color: 'from-amber-600 to-amber-500' },
                    ].map(({ label, icon: Icon, color }) => (
                        <motion.button
                            key={label}
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className={`bg-gradient-to-br ${color} text-white rounded-2xl p-4 text-left shadow-sm hover:shadow-md transition-shadow`}
                        >
                            <Icon className="w-5 h-5 mb-2 opacity-90" />
                            <p className="text-xs font-semibold leading-tight">{label}</p>
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
}
