import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, CalendarDays, Tent, UtensilsCrossed, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const revenueData = [
    { day: 'Mon', amount: 12500 }, { day: 'Tue', amount: 18200 }, { day: 'Wed', amount: 15800 },
    { day: 'Thu', amount: 22400 }, { day: 'Fri', amount: 28600 }, { day: 'Sat', amount: 35200 }, { day: 'Sun', amount: 31000 },
];

const monthlyStats = [
    { label: 'Total Revenue', value: '₱163,700', trend: '+12%', up: true, icon: DollarSign, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-100' },
    { label: 'Bookings', value: '48', trend: '+8%', up: true, icon: CalendarDays, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Occupancy Rate', value: '78%', trend: '+5%', up: true, icon: Tent, color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-100' },
    { label: 'Meal Orders', value: '185', trend: '-3%', up: false, icon: UtensilsCrossed, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100' },
];

const topCampsites = [
    { name: 'Lakefront Deluxe Tent', bookings: 24, revenue: '₱36,000', occupancy: 85 },
    { name: 'Premium Glamping Dome', bookings: 18, revenue: '₱43,200', occupancy: 72 },
    { name: 'Hilltop Campsite', bookings: 15, revenue: '₱19,500', occupancy: 65 },
    { name: 'Lakeside Hut', bookings: 12, revenue: '₱24,000', occupancy: 58 },
    { name: 'Riverside Tent Site', bookings: 10, revenue: '₱9,000', occupancy: 45 },
];

const userStats = [
    { label: 'New Users', value: '23', period: 'This month' },
    { label: 'Return Rate', value: '68%', period: 'Avg' },
    { label: 'Avg Booking Value', value: '₱3,410', period: 'Per stay' },
    { label: 'Avg Stay Duration', value: '2.8 nights', period: 'Per booking' },
];

const max = Math.max(...revenueData.map(d => d.amount));

export default function AdminReports() {
    const [period, setPeriod] = useState('weekly');

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
                            <div className="flex items-center justify-between mb-3"><Icon className={`w-5 h-5 ${stat.color}`} />
                                <div className={`flex items-center gap-0.5 text-xs font-semibold ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
                                    {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{stat.trend}
                                </div></div>
                            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                        </motion.div>
                    );
                })}
            </div>

            {/* Revenue Chart */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-6"><BarChart3 className="w-5 h-5 text-green-600" /><h3 className="font-bold text-gray-800">Revenue Overview</h3></div>
                <div className="flex items-end gap-3 h-48">
                    {revenueData.map((d, i) => (
                        <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                            <span className="text-[10px] font-semibold text-gray-600">₱{(d.amount / 1000).toFixed(0)}k</span>
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(d.amount / max) * 100}%` }}
                                transition={{ delay: 0.3 + i * 0.06, duration: 0.5, ease: 'easeOut' }}
                                className="w-full bg-gradient-to-t from-green-700 to-emerald-400 rounded-t-lg min-h-[4px]"
                            />
                            <span className="text-[10px] text-gray-400 font-medium">{d.day}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Campsites */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2"><Tent className="w-5 h-5 text-green-600" /><h3 className="font-bold text-gray-800 text-sm">Top Campsites</h3></div>
                    <div className="divide-y divide-gray-50">
                        {topCampsites.map((c, i) => (
                            <div key={c.name} className="flex items-center justify-between px-5 py-3.5 hover:bg-green-50/30 transition-colors">
                                <div className="flex items-center gap-3"><span className="text-xs font-bold text-gray-400 w-5">#{i + 1}</span><div><p className="text-sm font-semibold text-gray-800">{c.name}</p><p className="text-xs text-gray-400">{c.bookings} bookings</p></div></div>
                                <div className="text-right"><p className="text-sm font-bold text-green-700">{c.revenue}</p><div className="w-16 h-1 bg-gray-100 rounded-full mt-1"><div className="h-full bg-green-500 rounded-full" style={{ width: `${c.occupancy}%` }} /></div></div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* User Behavior */}
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2"><Users className="w-5 h-5 text-blue-600" /><h3 className="font-bold text-gray-800 text-sm">User Analytics</h3></div>
                    <div className="p-5 grid grid-cols-2 gap-4">
                        {userStats.map(s => (
                            <div key={s.label} className="bg-gray-50 rounded-2xl p-4 text-center"><p className="text-xl font-bold text-gray-900">{s.value}</p><p className="text-xs font-medium text-gray-600 mt-1">{s.label}</p><p className="text-[10px] text-gray-400">{s.period}</p></div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
