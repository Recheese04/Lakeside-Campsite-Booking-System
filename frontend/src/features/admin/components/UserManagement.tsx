import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Ban, Mail } from 'lucide-react';

const users = [
    { id: 1, name: 'Maria Santos', email: 'maria@email.com', phone: '+63 912 345 6789', joined: 'Jan 2023', bookings: 5, spent: '₱15,800', status: 'Active', role: 'Customer' },
    { id: 2, name: 'Juan dela Cruz', email: 'juan@email.com', phone: '+63 917 654 3210', joined: 'Mar 2023', bookings: 3, spent: '₱12,400', status: 'Active', role: 'Customer' },
    { id: 3, name: 'Ana Rodriguez', email: 'ana@email.com', phone: '+63 918 876 5432', joined: 'Jun 2023', bookings: 8, spent: '₱28,600', status: 'Active', role: 'Customer' },
    { id: 4, name: 'Pedro Reyes', email: 'pedro@email.com', phone: '+63 919 111 2222', joined: 'Sep 2023', bookings: 2, spent: '₱4,500', status: 'Suspended', role: 'Customer' },
    { id: 5, name: 'Sophia Garcia', email: 'sophia@email.com', phone: '+63 920 333 4444', joined: 'Nov 2024', bookings: 1, spent: '₱1,500', status: 'Active', role: 'Customer' },
    { id: 6, name: 'Admin User', email: 'admin@lakeside.ph', phone: '+63 900 000 0000', joined: 'Jan 2022', bookings: 0, spent: '₱0', status: 'Active', role: 'Admin' },
];

const stC: Record<string, string> = { Active: 'bg-green-100 text-green-700', Suspended: 'bg-red-100 text-red-700' };
const rC: Record<string, string> = { Admin: 'bg-violet-100 text-violet-700', Customer: 'bg-blue-100 text-blue-700' };

export default function UserManagement() {
    const [search, setSearch] = useState('');
    const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div><h2 className="text-2xl font-bold text-gray-900">User Management</h2><p className="text-gray-500 text-sm mt-1">View and manage registered users</p></div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[{ l: 'Total Users', v: users.length, c: 'text-green-700', bg: 'bg-green-50', b: 'border-green-100' },
                  { l: 'Active', v: users.filter(u => u.status === 'Active').length, c: 'text-blue-700', bg: 'bg-blue-50', b: 'border-blue-100' },
                  { l: 'Suspended', v: users.filter(u => u.status === 'Suspended').length, c: 'text-red-700', bg: 'bg-red-50', b: 'border-red-100' },
                  { l: 'Admins', v: users.filter(u => u.role === 'Admin').length, c: 'text-violet-700', bg: 'bg-violet-50', b: 'border-violet-100' },
                ].map(s => (<div key={s.l} className={`${s.bg} ${s.b} border rounded-2xl p-4 text-center`}><p className={`text-2xl font-bold ${s.c}`}>{s.v}</p><p className="text-xs text-gray-500 mt-1">{s.l}</p></div>))}
            </div>

            <div className="relative"><Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500" /></div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm"><thead><tr className="bg-gray-50 border-b border-gray-100">
                        {['User', 'Contact', 'Role', 'Joined', 'Bookings', 'Total Spent', 'Status', 'Actions'].map(h => (
                            <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}</tr></thead>
                        <tbody>{filtered.map((u, i) => (
                            <motion.tr key={u.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                                className="border-b border-gray-50 hover:bg-green-50/30 transition-colors">
                                <td className="px-5 py-3"><div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center text-white font-bold text-xs">{u.name.split(' ').map(n => n[0]).join('')}</div>
                                    <span className="font-semibold text-gray-800">{u.name}</span></div></td>
                                <td className="px-5 py-3"><p className="text-xs text-gray-600">{u.email}</p><p className="text-xs text-gray-400">{u.phone}</p></td>
                                <td className="px-5 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${rC[u.role]}`}>{u.role}</span></td>
                                <td className="px-5 py-3 text-gray-600 text-xs">{u.joined}</td>
                                <td className="px-5 py-3 text-gray-600">{u.bookings}</td>
                                <td className="px-5 py-3 font-bold text-green-700">{u.spent}</td>
                                <td className="px-5 py-3"><span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${stC[u.status]}`}>{u.status}</span></td>
                                <td className="px-5 py-3"><div className="flex gap-1">
                                    <button className="p-1.5 text-green-700 hover:bg-green-50 rounded-lg"><Eye className="w-4 h-4" /></button>
                                    <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Mail className="w-4 h-4" /></button>
                                    {u.role !== 'Admin' && <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Ban className="w-4 h-4" /></button>}
                                </div></td>
                            </motion.tr>
                        ))}</tbody>
                    </table>
                </div>
                <div className="md:hidden divide-y divide-gray-100">{filtered.map(u => (
                    <div key={u.id} className="p-4">
                        <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center text-white font-bold text-xs">{u.name.split(' ').map(n => n[0]).join('')}</div>
                            <div><p className="font-semibold text-gray-800 text-sm">{u.name}</p><p className="text-xs text-gray-400">{u.email}</p></div></div>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stC[u.status]}`}>{u.status}</span></div>
                        <div className="grid grid-cols-3 gap-2 text-xs"><div><p className="text-gray-400">Role</p><span className={`font-semibold px-2 py-0.5 rounded-full ${rC[u.role]}`}>{u.role}</span></div>
                            <div><p className="text-gray-400">Bookings</p><p className="font-medium text-gray-700">{u.bookings}</p></div>
                            <div><p className="text-gray-400">Spent</p><p className="font-bold text-green-700">{u.spent}</p></div></div>
                    </div>
                ))}</div>
            </div>
        </div>
    );
}
