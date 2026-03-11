import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    CalendarDays, DollarSign, UtensilsCrossed,
    ArrowRight, CheckCircle, Clock, Tent,
    TrendingUp, ArrowUpRight, LogIn, Loader2
} from 'lucide-react';
import api from '../../../services/api';

interface DashboardStats {
    totalBookings: number;
    totalRevenue: number;
    totalUsers: number;
    totalCampsites: number;
    pendingBookings: number;
    activeBookings: number;
    occupancyRate: number;
}

interface RecentBooking {
    id: string;
    checkIn: string;
    totalPrice: string;
    status: string;
    user: { firstName: string; lastName: string; email: string };
    campsite: { name: string };
}

interface PendingMeal {
    id: string;
    items: any;
    status: string;
    createdAt: string;
    user: { firstName: string; lastName: string };
}

const statusColors: Record<string, string> = {
    CONFIRMED: 'bg-green-100 text-green-700',
    PENDING: 'bg-amber-100 text-amber-700',
    PREPARING: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-gray-100 text-gray-500',
    CANCELLED: 'bg-red-100 text-red-500',
};

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function AdminOverview() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
    const [pendingMeals, setPendingMeals] = useState<PendingMeal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [statsRes, bookingsRes, mealsRes] = await Promise.all([
                    api.get('/admin/dashboard/stats'),
                    api.get('/admin/dashboard/recent-bookings'),
                    api.get('/admin/dashboard/pending-meals'),
                ]);
                setStats(statsRes.data);
                setRecentBookings(bookingsRes.data);
                setPendingMeals(mealsRes.data);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to load dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
        </div>
    );

    if (error) return (
        <div className="text-center py-20">
            <p className="text-red-500 font-medium">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-3 text-sm text-green-700 underline">Retry</button>
        </div>
    );

    const statCards = [
        { label: 'Total Bookings', value: stats?.totalBookings?.toString() || '0', icon: CalendarDays, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', trend: `${stats?.pendingBookings || 0} pending` },
        { label: 'Active Bookings', value: stats?.activeBookings?.toString() || '0', icon: LogIn, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', trend: `${stats?.occupancyRate || 0}% occupancy` },
        { label: 'Total Revenue', value: `₱${Number(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', trend: 'All time' },
        { label: 'Pending Bookings', value: stats?.pendingBookings?.toString() || '0', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', trend: 'Awaiting action' },
        { label: 'Pending Meals', value: pendingMeals.length.toString(), icon: UtensilsCrossed, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', trend: 'To prepare' },
        { label: 'Total Campsites', value: stats?.totalCampsites?.toString() || '0', icon: Tent, color: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-100', trend: `${stats?.totalUsers || 0} users` },
    ];

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
                            <span className="text-emerald-300 font-semibold">{stats?.activeBookings || 0} active bookings</span> · <span className="text-amber-300 font-semibold">{stats?.pendingBookings || 0} pending</span> · <span className="text-blue-300 font-semibold">{pendingMeals.length} meals</span> to prepare
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
                {statCards.map(stat => {
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
                        {recentBookings.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No bookings yet</p>}
                        {recentBookings.map((b, i) => (
                            <motion.div key={b.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
                                className="flex items-center justify-between px-5 py-3.5 hover:bg-green-50/30 transition-colors">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{b.user.firstName} {b.user.lastName}</p>
                                    <p className="text-xs text-gray-400">{b.campsite.name} · {new Date(b.checkIn).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right flex items-center gap-3">
                                    <div>
                                        <p className="text-sm font-bold text-green-700">₱{Number(b.totalPrice).toLocaleString()}</p>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[b.status] || 'bg-gray-100 text-gray-600'}`}>{b.status}</span>
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
                        {pendingMeals.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No pending meals</p>}
                        {pendingMeals.map((order, i) => (
                            <motion.div key={order.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.05 }}
                                className="flex items-center justify-between px-5 py-3.5 hover:bg-amber-50/30 transition-colors">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{order.user.firstName} {order.user.lastName}</p>
                                    <p className="text-xs text-gray-400">{Array.isArray(order.items) ? order.items.map((it: any) => it.name).join(', ') : 'Order'}</p>
                                </div>
                                <div className="text-right flex items-center gap-3">
                                    <div>
                                        <p className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleTimeString()}</p>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                                    </div>
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
