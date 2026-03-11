import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Search, Filter, DollarSign, Eye, CheckCircle, Clock, Loader2 } from 'lucide-react';
import api from '../../../services/api';

interface Booking {
    id: string;
    checkIn: string;
    checkOut: string;
    guestCount: number;
    totalPrice: string;
    status: string;
    paymentStatus: string;
    createdAt: string;
    user: { firstName: string; lastName: string; email: string };
    campsite: { name: string };
    payment: { amount: string; method: string; paidAt: string | null } | null;
}

interface Revenue {
    totalRevenue: number;
    bookingsByStatus: { status: string; _count: number }[];
}

const stC: Record<string, string> = { CONFIRMED: 'bg-green-100 text-green-700', PENDING: 'bg-amber-100 text-amber-700', COMPLETED: 'bg-blue-100 text-blue-700', CANCELLED: 'bg-gray-100 text-gray-500' };
const pC: Record<string, string> = { PAID: 'text-green-600', UNPAID: 'text-amber-600', PARTIAL: 'text-blue-600', REFUNDED: 'text-gray-500' };

export default function BookingManagement() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [revenue, setRevenue] = useState<Revenue | null>(null);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const statuses = ['All', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

    const fetchData = async () => {
        try {
            setLoading(true);
            const [bRes, rRes] = await Promise.all([
                api.get('/admin/bookings'),
                api.get('/admin/bookings/revenue'),
            ]);
            setBookings(bRes.data);
            setRevenue(rRes.data);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load bookings');
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            setActionLoading(id);
            await api.put(`/admin/bookings/${id}/status`, { status });
            await fetchData();
        } catch (err: any) { alert(err.response?.data?.error || 'Failed to update'); }
        finally { setActionLoading(null); }
    };

    const filtered = bookings.filter(b => {
        const ms = `${b.user.firstName} ${b.user.lastName}`.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase());
        const mf = filterStatus === 'All' || b.status === filterStatus;
        return ms && mf;
    });

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-green-600 animate-spin" /></div>;
    if (error) return <div className="text-center py-20"><p className="text-red-500 font-medium">{error}</p><button onClick={fetchData} className="mt-3 text-sm text-green-700 underline">Retry</button></div>;

    const totalRev = Number(revenue?.totalRevenue || 0);
    const pendingCount = bookings.filter(b => b.status === 'PENDING').length;

    return (
        <div className="space-y-6">
            <div><h2 className="text-2xl font-bold text-gray-900">Bookings & Payments</h2><p className="text-gray-500 text-sm mt-1">Manage all bookings and payment oversight</p></div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[{ l: 'Total Revenue', v: `₱${totalRev.toLocaleString()}`, c: 'text-green-700', bg: 'bg-green-50', b: 'border-green-100', i: DollarSign },
                  { l: 'Pending', v: pendingCount.toString(), c: 'text-amber-700', bg: 'bg-amber-50', b: 'border-amber-100', i: Clock },
                  { l: 'Total Bookings', v: bookings.length.toString(), c: 'text-blue-700', bg: 'bg-blue-50', b: 'border-blue-100', i: CalendarDays },
                ].map(s => (<motion.div key={s.l} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`${s.bg} ${s.b} border rounded-2xl p-5`}><s.i className={`w-5 h-5 ${s.c} mb-2`} /><p className={`text-2xl font-bold ${s.c}`}>{s.v}</p><p className="text-xs text-gray-500 mt-1">{s.l}</p></motion.div>))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1"><Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input placeholder="Search by guest or booking ID..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500" /></div>
                <div className="flex items-center gap-2 flex-wrap"><Filter className="w-4 h-4 text-gray-400" />
                    {statuses.map(s => (<button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filterStatus === s ? 'bg-green-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-green-400'}`}>{s}</button>))}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm"><thead><tr className="bg-gray-50 border-b border-gray-100">
                        {['Booking ID', 'Guest', 'Campsite', 'Dates', 'Amount', 'Payment', 'Status', 'Actions'].map(h => (
                            <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}</tr></thead>
                        <tbody>
                            {filtered.length === 0 && <tr><td colSpan={8} className="text-center py-8 text-gray-400">No bookings found</td></tr>}
                            {filtered.map((b, i) => (
                            <motion.tr key={b.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                                className="border-b border-gray-50 hover:bg-green-50/30 transition-colors">
                                <td className="px-5 py-3 font-mono text-xs text-gray-500 font-semibold">{b.id.slice(0, 12)}...</td>
                                <td className="px-5 py-3 font-semibold text-gray-800">{b.user.firstName} {b.user.lastName}</td>
                                <td className="px-5 py-3 text-gray-600">{b.campsite.name}</td>
                                <td className="px-5 py-3 text-gray-600 text-xs">{new Date(b.checkIn).toLocaleDateString()} – {new Date(b.checkOut).toLocaleDateString()}</td>
                                <td className="px-5 py-3 font-bold text-green-700">₱{Number(b.totalPrice).toLocaleString()}</td>
                                <td className="px-5 py-3"><span className={`text-xs font-semibold ${pC[b.paymentStatus] || 'text-gray-500'}`}>{b.paymentStatus}</span></td>
                                <td className="px-5 py-3"><span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${stC[b.status] || 'bg-gray-100 text-gray-600'}`}>{b.status}</span></td>
                                <td className="px-5 py-3"><div className="flex gap-1">
                                    {b.status === 'PENDING' && (
                                        <>
                                            <button onClick={() => handleStatusUpdate(b.id, 'CONFIRMED')} disabled={actionLoading === b.id} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg" title="Confirm">
                                                {actionLoading === b.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                            </button>
                                            <button onClick={() => handleStatusUpdate(b.id, 'CANCELLED')} disabled={actionLoading === b.id} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs font-semibold" title="Cancel">✕</button>
                                        </>
                                    )}
                                    {b.status === 'CONFIRMED' && (
                                        <button onClick={() => handleStatusUpdate(b.id, 'COMPLETED')} disabled={actionLoading === b.id} className="text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors">Complete</button>
                                    )}
                                </div></td>
                            </motion.tr>
                        ))}</tbody>
                    </table>
                </div>
                <div className="md:hidden divide-y divide-gray-100">{filtered.map(b => (
                    <div key={b.id} className="p-4">
                        <div className="flex items-center justify-between mb-2"><div><p className="font-semibold text-gray-800 text-sm">{b.user.firstName} {b.user.lastName}</p><p className="text-xs text-gray-400 font-mono">{b.id.slice(0, 12)}</p></div>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stC[b.status] || 'bg-gray-100'}`}>{b.status}</span></div>
                        <div className="grid grid-cols-3 gap-2 text-xs"><div><p className="text-gray-400">Campsite</p><p className="font-medium text-gray-700">{b.campsite.name}</p></div>
                            <div><p className="text-gray-400">Amount</p><p className="font-bold text-green-700">₱{Number(b.totalPrice).toLocaleString()}</p></div>
                            <div><p className="text-gray-400">Payment</p><p className={`font-semibold ${pC[b.paymentStatus] || 'text-gray-500'}`}>{b.paymentStatus}</p></div></div>
                        {b.status === 'PENDING' && (
                            <div className="flex gap-2 mt-2">
                                <button onClick={() => handleStatusUpdate(b.id, 'CONFIRMED')} className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1.5 rounded-lg">Confirm</button>
                                <button onClick={() => handleStatusUpdate(b.id, 'CANCELLED')} className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">Cancel</button>
                            </div>
                        )}
                    </div>
                ))}</div>
            </div>
        </div>
    );
}
