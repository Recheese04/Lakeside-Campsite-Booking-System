import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Bell, CheckCircle, Info, DollarSign, Clock, Settings, AlertTriangle, 
    Trash2, Search, Filter 
} from 'lucide-react';
import api from '../../../services/api';

const typeIcons: Record<string, any> = {
    Booking: CheckCircle,
    Payment: DollarSign,
    System: Info,
    Alert: AlertTriangle,
    General: Bell,
};

const typeColors: Record<string, string> = {
    Booking: 'text-green-600 bg-green-50 border-green-100',
    Payment: 'text-violet-600 bg-violet-50 border-violet-100',
    System: 'text-blue-600 bg-blue-50 border-blue-100',
    Alert: 'text-red-500 bg-red-50 border-red-100',
    General: 'text-gray-600 bg-gray-50 border-gray-100',
};

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { duration: 0.3 } } };

export default function NotificationsSection() {
    const [search, setSearch] = useState('');
    const [filterSource, setFilterSource] = useState('All');
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get('/customer/notifications');
                setNotifications(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await api.put(`/customer/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const markAllRead = async () => {
        try {
            await api.put('/customer/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteNotif = (id: string) => {
        // Optimistic delete UI for now, usually needs a DELETE endpoint
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const filtered = notifications.filter(n => {
        const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.message.toLowerCase().includes(search.toLowerCase());
        const matchType = filterSource === 'All' || n.type === filterSource;
        return matchSearch && matchType;
    });

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                    <p className="text-gray-500 text-sm mt-1">Stay updated on your bookings and account activity</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full">{unreadCount} Unread</span>
                    <button onClick={markAllRead} disabled={unreadCount === 0}
                        className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${unreadCount > 0 ? 'text-green-700 hover:text-green-800' : 'text-gray-400 cursor-not-allowed'}`}>
                        <CheckCircle className="w-4 h-4" /> Mark All as Read
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><Settings className="w-5 h-5" /></button>
                </div>
            </div>

            {/* ── Filter & Search ── */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search notifications..." value={search} onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all" />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                    <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {['All', 'Booking', 'Payment', 'System'].map(t => (
                        <button key={t} onClick={() => setFilterSource(t)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filterSource === t ? 'bg-green-700 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                            {t}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── List ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="text-center py-16">
                        <Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 font-medium">No notifications found.</p>
                    </div>
                ) : (
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="divide-y divide-gray-50">
                        {filtered.map((n) => {
                            const Icon = typeIcons[n.type] || Bell;
                            const colorClass = typeColors[n.type] || typeColors.General;
                            return (
                                <motion.div key={n.id} variants={itemVariants} onClick={() => !n.isRead && markAsRead(n.id)}
                                    className={`relative flex items-start gap-4 p-5 hover:bg-green-50/20 transition-colors group cursor-pointer ${!n.isRead ? 'bg-green-50/10' : ''}`}>
                                    <div className={`p-2.5 rounded-xl border flex-shrink-0 ${colorClass}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0 pr-8">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className={`text-sm font-semibold truncate ${!n.isRead ? 'text-gray-900' : 'text-gray-700'}`}>{n.title}</h4>
                                            {!n.isRead && <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />}
                                        </div>
                                        <p className="text-sm text-gray-500 leading-snug">{n.message}</p>
                                        <p className="text-xs text-gray-400 font-medium mt-2 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(n.createdAt).toLocaleString()}</p>
                                    </div>
                                    <button onClick={(e) => { e.stopPropagation(); deleteNotif(n.id); }} className="absolute right-5 top-5 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
