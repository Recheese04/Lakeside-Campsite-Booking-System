import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, CalendarDays, Tent, BarChart3, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import api from '../../../services/api';
import { StatCardSkeleton, ChartSkeleton, ListItemSkeleton } from '../../../components/Skeleton';

interface RevenueData {
    totalRevenue: number;
    period: string;
    recentPayments: { amount: string; paidAt: string }[];
}

interface OccupancyData {
    totalCampsites: number;
    activeBookings: number;
    occupancyRate: number;
    campsiteBookings: { id: string; name: string; capacity: number; _count: { bookings: number } }[];
}

interface TopCampsite {
    id: string;
    name: string;
    pricePerNight: string;
    totalBookings: number;
    totalReviews: number;
    avgRating: string | null;
}

interface UserAnalytics {
    totalUsers: number;
    usersByRole: { role: string; _count: number }[];
    newUsers: number;
    bannedUsers: number;
}

export default function AdminReports() {
    const [revenue, setRevenue] = useState<RevenueData | null>(null);
    const [occupancy, setOccupancy] = useState<OccupancyData | null>(null);
    const [topCampsites, setTopCampsites] = useState<TopCampsite[]>([]);
    const [userAnalytics, setUserAnalytics] = useState<UserAnalytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [period, setPeriod] = useState('weekly');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [revRes, occRes, topRes, userRes] = await Promise.all([
                api.get('/admin/reports/revenue', { params: { period } }),
                api.get('/admin/reports/occupancy'),
                api.get('/admin/reports/top-campsites'),
                api.get('/admin/reports/users'),
            ]);
            setRevenue(revRes.data);
            setOccupancy(occRes.data);
            setTopCampsites(topRes.data);
            setUserAnalytics(userRes.data);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load reports');
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, [period]);

    if (loading) return (<div className="space-y-6"><StatCardSkeleton count={4} /><ChartSkeleton /><ListItemSkeleton rows={3} /></div>);
    if (error) return <div className="text-center py-20"><p className="text-red-500 font-medium">{error}</p><button onClick={fetchData} className="mt-3 text-sm text-green-700 underline">Retry</button></div>;

    const monthlyStats = [
        { label: 'Total Revenue', value: `₱${Number(revenue?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-100' },
        { label: 'Total Bookings', value: topCampsites.reduce((s, c) => s + c.totalBookings, 0).toString(), icon: CalendarDays, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100' },
        { label: 'Occupancy Rate', value: `${occupancy?.occupancyRate || 0}%`, icon: Tent, color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-100' },
        { label: 'Total Users', value: userAnalytics?.totalUsers?.toString() || '0', icon: Users, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100' },
    ];

    // Build simple bar chart data from recent payments
    const recentPayments = revenue?.recentPayments || [];
    const dayTotals = new Map<string, number>();
    recentPayments.forEach(p => {
        const day = p.paidAt ? new Date(p.paidAt).toLocaleDateString('en', { weekday: 'short' }) : 'N/A';
        dayTotals.set(day, (dayTotals.get(day) || 0) + Number(p.amount));
    });
    const chartData = Array.from(dayTotals.entries()).slice(-7).map(([day, amount]) => ({ day, amount }));
    const maxAmount = Math.max(...chartData.map(d => d.amount), 1);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div><h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2><p className="text-gray-500 text-sm mt-1">Revenue, occupancy, and usage insights</p></div>
                <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                    {['daily', 'weekly', 'monthly'].map(p => (
                        <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${period === p ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{p}</button>
                    ))}
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {monthlyStats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div key={stat.label} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                            className={`${stat.bg} ${stat.border} border rounded-2xl p-5`}>
                            <div className="flex items-center justify-between mb-3"><Icon className={`w-5 h-5 ${stat.color}`} /></div>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Revenue Chart */}
            {chartData.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-6"><BarChart3 className="w-5 h-5 text-green-600" /><h3 className="font-bold text-gray-800">Revenue Overview</h3></div>
                    <div className="flex items-end gap-3 h-48">
                        {chartData.map((d, i) => (
                            <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                                <span className="text-[10px] font-semibold text-gray-600">₱{(d.amount / 1000).toFixed(0)}k</span>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(d.amount / maxAmount) * 100}%` }}
                                    transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: 'easeOut' }}
                                    className="w-full bg-gradient-to-t from-green-700 to-emerald-400 rounded-t-lg min-h-[4px]"
                                />
                                <span className="text-[10px] text-gray-400 font-medium">{d.day}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {chartData.length === 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
                    <BarChart3 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">No payment data for chart</p>
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Campsites */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2"><Tent className="w-5 h-5 text-green-600" /><h3 className="font-bold text-gray-800 text-sm">Top Campsites</h3></div>
                    <div className="divide-y divide-gray-50">
                        {topCampsites.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No data</p>}
                        {topCampsites.map((c, i) => (
                            <div key={c.id} className="flex items-center justify-between px-5 py-3.5 hover:bg-green-50/30 transition-colors">
                                <div className="flex items-center gap-3"><span className="text-xs font-bold text-gray-400 w-5">#{i + 1}</span><div><p className="text-sm font-semibold text-gray-800">{c.name}</p><p className="text-xs text-gray-400">{c.totalBookings} bookings · {c.avgRating ? `★ ${c.avgRating}` : 'No rating'}</p></div></div>
                                <div className="text-right"><p className="text-sm font-bold text-green-700">₱{Number(c.pricePerNight).toLocaleString()}/night</p></div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* User Analytics */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2"><Users className="w-5 h-5 text-blue-600" /><h3 className="font-bold text-gray-800 text-sm">User Analytics</h3></div>
                    <div className="p-5 grid grid-cols-2 gap-4">
                        {[
                            { label: 'Total Users', value: userAnalytics?.totalUsers?.toString() || '0', period: 'All time' },
                            { label: 'New Users', value: userAnalytics?.newUsers?.toString() || '0', period: 'Last 30 days' },
                            { label: 'Banned Users', value: userAnalytics?.bannedUsers?.toString() || '0', period: 'Current' },
                            { label: 'By Role', value: userAnalytics?.usersByRole?.map(r => `${r.role}: ${r._count}`).join(', ') || '-', period: '' },
                        ].map(s => (
                            <div key={s.label} className="bg-gray-50 rounded-2xl p-4 text-center"><p className="text-xl font-bold text-gray-900">{s.value}</p><p className="text-xs font-medium text-gray-600 mt-1">{s.label}</p>{s.period && <p className="text-[10px] text-gray-400">{s.period}</p>}</div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
