import { motion } from 'framer-motion';
import {
    CalendarDays, Users, DollarSign, UtensilsCrossed, Package,
    ArrowRight, CheckCircle, Clock, AlertCircle, Tent,
    TrendingUp, ArrowUpRight, LogIn, LogOut as LogOutIcon
} from 'lucide-react';

const stats = [
    { label: "Today's Check-ins", value: '5', icon: LogIn, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', trend: '3 confirmed' },
    { label: "Today's Check-outs", value: '3', icon: LogOutIcon, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', trend: '1 pending' },
    { label: 'Upcoming Bookings', value: '18', icon: CalendarDays, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', trend: '+5 this week' },
    { label: 'Pending Payments', value: '₱24,800', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', trend: '8 transactions' },
    { label: 'Meals to Prepare', value: '7', icon: UtensilsCrossed, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', trend: '3 urgent' },
    { label: 'Equipment Available', value: '42/60', icon: Package, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100', trend: '70% available' },
];

const recentBookings = [
    { id: 'LCS-20250310', guest: 'Maria Santos', campsite: 'Lakefront Deluxe', checkIn: 'Mar 20', status: 'Confirmed', amount: '₱4,500' },
    { id: 'LCS-20250402', guest: 'Juan dela Cruz', campsite: 'Glamping Dome', checkIn: 'Apr 5', status: 'Pending', amount: '₱7,200' },
    { id: 'LCS-20250315', guest: 'Ana Rodriguez', campsite: 'Hilltop Site', checkIn: 'Mar 15', status: 'Confirmed', amount: '₱3,900' },
    { id: 'LCS-20250318', guest: 'Pedro Reyes', campsite: 'Riverside Tent', checkIn: 'Mar 18', status: 'Pending', amount: '₱1,800' },
];

const pendingMeals = [
    { id: 'ORD-101', guest: 'Maria Santos', items: 'Grilled Chicken, Iced Coffee', time: '12:30 PM', status: 'Preparing' },
    { id: 'ORD-102', guest: 'Juan dela Cruz', items: 'BBQ Pork Ribs x2', time: '1:00 PM', status: 'Pending' },
    { id: 'ORD-103', guest: 'Ana Rodriguez', items: "S'mores Platter", time: '3:00 PM', status: 'Pending' },
];

const statusColors: Record<string, string> = {
    Confirmed: 'bg-green-100 text-green-700',
    Pending: 'bg-amber-100 text-amber-700',
    Preparing: 'bg-blue-100 text-blue-700',
};

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function AdminOverview() {
    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 text-white px-6 py-7 shadow-lg">
                <div className="absolute -top-8 -right-8 w-44 h-44 bg-white/5 rounded-full" />
                <div className="absolute -bottom-14 -right-4 w-60 h-60 bg-white/5 rounded-full" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <p className="text-white/60 text-sm font-medium mb-1">Admin Dashboard 🛠️</p>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">Campsite Operations</h2>
                        <p className="text-white/70 text-sm max-w-md">
                            <span className="text-emerald-300 font-semibold">5 check-ins</span> today · <span className="text-amber-300 font-semibold">8 pending payments</span> · <span className="text-blue-300 font-semibold">7 meals</span> to prepare
                        </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white text-slate-800 rounded-xl text-sm font-semibold shadow-md">
                            <CheckCircle className="w-4 h-4" /> Approve Bookings
                        </motion.button>
                        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl text-sm font-medium transition-colors">
                            <TrendingUp className="w-4 h-4" /> View Reports
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {stats.map(stat => {
                    const Icon = stat.icon;
                    return (
                        <motion.div key={stat.label} variants={itemVariants} whileHover={{ y: -4 }}
                            className={`bg-white rounded-2xl p-5 border ${stat.border} shadow-sm hover:shadow-md transition-shadow cursor-default`}>
                            <div className="flex items-start justify-between mb-3">
                                <div className={`p-2.5 rounded-xl ${stat.bg}`}><Icon className={`w-5 h-5 ${stat.color}`} /></div>
                                <ArrowUpRight className="w-4 h-4 text-gray-300" />
                            </div>
                            <p className="text-2xl font-bold text-gray-900 mb-0.5">{stat.value}</p>
                            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                            <p className="text-xs text-gray-400 mt-1">{stat.trend}</p>
                        </motion.div>
                    );
                })}
            </motion.div>

            {/* Recent Bookings + Pending Meals */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Bookings */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2"><Tent className="w-5 h-5 text-green-600" /><h3 className="font-bold text-gray-800 text-sm">Recent Bookings</h3></div>
                        <button className="flex items-center gap-1 text-xs text-green-700 font-medium hover:text-green-800">View all <ArrowRight className="w-3 h-3" /></button>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {recentBookings.map((b, i) => (
                            <motion.div key={b.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
                                className="flex items-center justify-between px-5 py-3.5 hover:bg-green-50/30 transition-colors">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{b.guest}</p>
                                    <p className="text-xs text-gray-400">{b.campsite} · Check-in {b.checkIn}</p>
                                </div>
                                <div className="text-right flex items-center gap-3">
                                    <div>
                                        <p className="text-sm font-bold text-green-700">{b.amount}</p>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[b.status]}`}>{b.status}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Pending Meal Orders */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2"><UtensilsCrossed className="w-5 h-5 text-amber-600" /><h3 className="font-bold text-gray-800 text-sm">Meal Orders</h3></div>
                        <button className="flex items-center gap-1 text-xs text-green-700 font-medium hover:text-green-800">View all <ArrowRight className="w-3 h-3" /></button>
                    </div>
                    <div className="divide-y divide-gray-50">
                        {pendingMeals.map((order, i) => (
                            <motion.div key={order.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.05 }}
                                className="flex items-center justify-between px-5 py-3.5 hover:bg-amber-50/30 transition-colors">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{order.guest}</p>
                                    <p className="text-xs text-gray-400">{order.items}</p>
                                </div>
                                <div className="text-right flex items-center gap-3">
                                    <div>
                                        <p className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {order.time}</p>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[order.status]}`}>{order.status}</span>
                                    </div>
                                    <button className="text-xs font-semibold text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 px-2.5 py-1 rounded-lg transition-colors">
                                        Mark Ready
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <div>
                <h3 className="text-gray-800 font-bold text-lg mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Approve Bookings', desc: 'Pending approvals', icon: CheckCircle, color: 'from-green-700 to-emerald-600' },
                        { label: 'Add Campsite', desc: 'New campsite type', icon: Tent, color: 'from-blue-600 to-blue-500' },
                        { label: 'Add Menu Item', desc: 'Restaurant menu', icon: UtensilsCrossed, color: 'from-amber-600 to-amber-500' },
                        { label: 'View Reports', desc: 'Revenue & analytics', icon: TrendingUp, color: 'from-violet-600 to-violet-500' },
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
        </div>
    );
}
