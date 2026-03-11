import { useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Search, Filter, DollarSign, Eye, Download, CheckCircle, Clock, AlertCircle, XCircle, RefreshCw } from 'lucide-react';

const bookings = [
    { id: 'LCS-20250310', guest: 'Maria Santos', campsite: 'Lakefront Deluxe', dates: 'Mar 20–23', amount: '₱4,500', payment: 'Paid', status: 'Confirmed' },
    { id: 'LCS-20250402', guest: 'Juan dela Cruz', campsite: 'Glamping Dome', dates: 'Apr 5–8', amount: '₱7,200', payment: 'Pending', status: 'Pending' },
    { id: 'LCS-20250315', guest: 'Ana Rodriguez', campsite: 'Hilltop Site', dates: 'Mar 15–18', amount: '₱3,900', payment: 'Paid', status: 'Confirmed' },
    { id: 'LCS-20250318', guest: 'Pedro Reyes', campsite: 'Riverside Tent', dates: 'Mar 18–20', amount: '₱1,800', payment: 'Pending', status: 'Pending' },
    { id: 'LCS-20250115', guest: 'Ana Rodriguez', campsite: 'Hilltop Site', dates: 'Jan 15–18', amount: '₱3,900', payment: 'Paid', status: 'Completed' },
    { id: 'LCS-20241220', guest: 'Pedro Reyes', campsite: 'Riverside Tent', dates: 'Dec 20–23', amount: '₱2,700', payment: 'Refunded', status: 'Cancelled' },
];

const stC: Record<string, string> = { Confirmed: 'bg-green-100 text-green-700', Pending: 'bg-amber-100 text-amber-700', Completed: 'bg-blue-100 text-blue-700', Cancelled: 'bg-gray-100 text-gray-500' };
const pC: Record<string, string> = { Paid: 'text-green-600', Pending: 'text-amber-600', Refunded: 'text-blue-600' };

export default function BookingManagement() {
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const statuses = ['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];

    const filtered = bookings.filter(b => {
        const ms = b.guest.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase());
        const mf = filterStatus === 'All' || b.status === filterStatus;
        return ms && mf;
    });

    const totalRevenue = bookings.filter(b => b.payment === 'Paid').reduce((s, b) => s + parseInt(b.amount.replace(/[₱,]/g, '')), 0);
    const pendingAmount = bookings.filter(b => b.payment === 'Pending').reduce((s, b) => s + parseInt(b.amount.replace(/[₱,]/g, '')), 0);

    return (
        <div className="space-y-6">
            <div><h2 className="text-2xl font-bold text-gray-900">Bookings & Payments</h2><p className="text-gray-500 text-sm mt-1">Manage all bookings and payment oversight</p></div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[{ l: 'Total Revenue', v: `₱${totalRevenue.toLocaleString()}`, c: 'text-green-700', bg: 'bg-green-50', b: 'border-green-100', i: DollarSign },
                  { l: 'Pending', v: `₱${pendingAmount.toLocaleString()}`, c: 'text-amber-700', bg: 'bg-amber-50', b: 'border-amber-100', i: Clock },
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
                        <tbody>{filtered.map((b, i) => (
                            <motion.tr key={b.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                                className="border-b border-gray-50 hover:bg-green-50/30 transition-colors">
                                <td className="px-5 py-3 font-mono text-xs text-gray-500 font-semibold">{b.id}</td>
                                <td className="px-5 py-3 font-semibold text-gray-800">{b.guest}</td>
                                <td className="px-5 py-3 text-gray-600">{b.campsite}</td>
                                <td className="px-5 py-3 text-gray-600">{b.dates}</td>
                                <td className="px-5 py-3 font-bold text-green-700">{b.amount}</td>
                                <td className="px-5 py-3"><span className={`text-xs font-semibold ${pC[b.payment]}`}>{b.payment}</span></td>
                                <td className="px-5 py-3"><span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${stC[b.status]}`}>{b.status}</span></td>
                                <td className="px-5 py-3"><div className="flex gap-1">
                                    <button className="p-1.5 text-green-700 hover:bg-green-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Download className="w-4 h-4" /></button>
                                    {b.status === 'Pending' && <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg"><CheckCircle className="w-4 h-4" /></button>}
                                </div></td>
                            </motion.tr>
                        ))}</tbody>
                    </table>
                </div>
                <div className="md:hidden divide-y divide-gray-100">{filtered.map(b => (
                    <div key={b.id} className="p-4">
                        <div className="flex items-center justify-between mb-2"><div><p className="font-semibold text-gray-800 text-sm">{b.guest}</p><p className="text-xs text-gray-400 font-mono">{b.id}</p></div>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stC[b.status]}`}>{b.status}</span></div>
                        <div className="grid grid-cols-3 gap-2 text-xs"><div><p className="text-gray-400">Campsite</p><p className="font-medium text-gray-700">{b.campsite}</p></div>
                            <div><p className="text-gray-400">Amount</p><p className="font-bold text-green-700">{b.amount}</p></div>
                            <div><p className="text-gray-400">Payment</p><p className={`font-semibold ${pC[b.payment]}`}>{b.payment}</p></div></div>
                    </div>
                ))}</div>
            </div>
        </div>
    );
}
