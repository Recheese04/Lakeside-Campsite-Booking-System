import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Ban, Mail, Shield, Loader2, CheckCircle } from 'lucide-react';
import api from '../../../services/api';
import { StatCardSkeleton, TableRowSkeleton, SearchSkeleton } from '../../../components/Skeleton';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    role: string;
    isVerified: boolean;
    isBanned: boolean;
    createdAt: string;
    _count: { bookings: number; reviews: number };
}

const stC: Record<string, string> = { Active: 'bg-green-100 text-green-700', Banned: 'bg-red-100 text-red-700' };
const rC: Record<string, string> = { ADMIN: 'bg-violet-100 text-violet-700', STAFF: 'bg-blue-100 text-blue-700', CUSTOMER: 'bg-emerald-100 text-emerald-700' };

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/users');
            setUsers(res.data);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleToggleBan = async (user: User) => {
        try {
            setActionLoading(user.id);
            await api.put(`/admin/users/${user.id}/status`, { isBanned: !user.isBanned });
            await fetchUsers();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to update user status');
        } finally {
            setActionLoading(null);
        }
    };

    const handleRoleChange = async (user: User, newRole: string) => {
        try {
            setActionLoading(user.id);
            await api.put(`/admin/users/${user.id}/role`, { role: newRole });
            await fetchUsers();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to update role');
        } finally {
            setActionLoading(null);
        }
    };

    const filtered = users.filter(u =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return (
        <div className="space-y-6">
            <StatCardSkeleton count={3} />
            <SearchSkeleton />
            <TableRowSkeleton cols={5} rows={6} />
        </div>
    );

    if (error) return (
        <div className="text-center py-20">
            <p className="text-red-500 font-medium">{error}</p>
            <button onClick={fetchUsers} className="mt-3 text-sm text-green-700 underline">Retry</button>
        </div>
    );

    const activeCount = users.filter(u => !u.isBanned).length;
    const bannedCount = users.filter(u => u.isBanned).length;
    const adminCount = users.filter(u => u.role === 'ADMIN').length;

    return (
        <div className="space-y-6">
            <div><h2 className="text-2xl font-bold text-gray-900">User Management</h2><p className="text-gray-500 text-sm mt-1">View and manage registered users</p></div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[{ l: 'Total Users', v: users.length, c: 'text-green-700', bg: 'bg-green-50', b: 'border-green-100' },
                  { l: 'Active', v: activeCount, c: 'text-blue-700', bg: 'bg-blue-50', b: 'border-blue-100' },
                  { l: 'Banned', v: bannedCount, c: 'text-red-700', bg: 'bg-red-50', b: 'border-red-100' },
                  { l: 'Admins', v: adminCount, c: 'text-violet-700', bg: 'bg-violet-50', b: 'border-violet-100' },
                ].map(s => (<div key={s.l} className={`${s.bg} ${s.b} border rounded-2xl p-4 text-center`}><p className={`text-2xl font-bold ${s.c}`}>{s.v}</p><p className="text-xs text-gray-500 mt-1">{s.l}</p></div>))}
            </div>

            <div className="relative"><Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500" /></div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm"><thead><tr className="bg-gray-50 border-b border-gray-100">
                        {['User', 'Contact', 'Role', 'Joined', 'Bookings', 'Reviews', 'Status', 'Actions'].map(h => (
                            <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                        ))}</tr></thead>
                        <tbody>{filtered.length === 0 && <tr><td colSpan={8} className="text-center py-8 text-gray-400">No users found</td></tr>}
                        {filtered.map((u, i) => (
                            <motion.tr key={u.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                                className="border-b border-gray-50 hover:bg-green-50/30 transition-colors">
                                <td className="px-5 py-3"><div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center text-white font-bold text-xs">{u.firstName[0]}{u.lastName[0]}</div>
                                    <span className="font-semibold text-gray-800">{u.firstName} {u.lastName}</span></div></td>
                                <td className="px-5 py-3"><p className="text-xs text-gray-600">{u.email}</p>{u.phone && <p className="text-xs text-gray-400">{u.phone}</p>}</td>
                                <td className="px-5 py-3">
                                    <select value={u.role} onChange={e => handleRoleChange(u, e.target.value)}
                                        disabled={actionLoading === u.id}
                                        className={`text-xs font-semibold px-2 py-0.5 rounded-full border-0 cursor-pointer ${rC[u.role] || 'bg-gray-100 text-gray-700'}`}>
                                        <option value="CUSTOMER">CUSTOMER</option>
                                        <option value="STAFF">STAFF</option>
                                        <option value="ADMIN">ADMIN</option>
                                    </select>
                                </td>
                                <td className="px-5 py-3 text-gray-600 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td className="px-5 py-3 text-gray-600">{u._count.bookings}</td>
                                <td className="px-5 py-3 text-gray-600">{u._count.reviews}</td>
                                <td className="px-5 py-3"><span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${u.isBanned ? stC['Banned'] : stC['Active']}`}>{u.isBanned ? 'Banned' : 'Active'}</span></td>
                                <td className="px-5 py-3"><div className="flex gap-1">
                                    {u.role !== 'ADMIN' && (
                                        <button onClick={() => handleToggleBan(u)} disabled={actionLoading === u.id}
                                            className={`p-1.5 rounded-lg transition-colors ${u.isBanned ? 'text-green-600 hover:bg-green-50' : 'text-red-500 hover:bg-red-50'}`}
                                            title={u.isBanned ? 'Unban user' : 'Ban user'}>
                                            {actionLoading === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : u.isBanned ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                        </button>
                                    )}
                                </div></td>
                            </motion.tr>
                        ))}</tbody>
                    </table>
                </div>
                <div className="md:hidden divide-y divide-gray-100">{filtered.map(u => (
                    <div key={u.id} className="p-4">
                        <div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center text-white font-bold text-xs">{u.firstName[0]}{u.lastName[0]}</div>
                            <div><p className="font-semibold text-gray-800 text-sm">{u.firstName} {u.lastName}</p><p className="text-xs text-gray-400">{u.email}</p></div></div>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.isBanned ? stC['Banned'] : stC['Active']}`}>{u.isBanned ? 'Banned' : 'Active'}</span></div>
                        <div className="grid grid-cols-3 gap-2 text-xs"><div><p className="text-gray-400">Role</p><span className={`font-semibold px-2 py-0.5 rounded-full ${rC[u.role] || 'bg-gray-100'}`}>{u.role}</span></div>
                            <div><p className="text-gray-400">Bookings</p><p className="font-medium text-gray-700">{u._count.bookings}</p></div>
                            <div><p className="text-gray-400">Reviews</p><p className="font-medium text-gray-700">{u._count.reviews}</p></div></div>
                        {u.role !== 'ADMIN' && (
                            <button onClick={() => handleToggleBan(u)} disabled={actionLoading === u.id}
                                className={`mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${u.isBanned ? 'text-green-700 bg-green-50 hover:bg-green-100' : 'text-red-600 bg-red-50 hover:bg-red-100'}`}>
                                {u.isBanned ? 'Unban' : 'Ban User'}
                            </button>
                        )}
                    </div>
                ))}</div>
            </div>
        </div>
    );
}
