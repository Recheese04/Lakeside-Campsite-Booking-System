import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Send, Users, Calendar, DollarSign, UtensilsCrossed, Clock, Megaphone, Loader2 } from 'lucide-react';
import api from '../../../services/api';
import { ListItemSkeleton } from '../../../components/Skeleton';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    recipientId: string | null;
    sentById: string | null;
    isRead: boolean;
    createdAt: string;
}

const tC: Record<string, string> = { Payment: 'bg-amber-50 text-amber-700', Booking: 'bg-green-50 text-green-700', System: 'bg-violet-50 text-violet-700', Meal: 'bg-blue-50 text-blue-700', General: 'bg-gray-50 text-gray-700' };

export default function AdminNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [tab, setTab] = useState<'send' | 'history'>('send');
    const [notifType, setNotifType] = useState('Booking');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/notifications');
            setNotifications(res.data);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load notifications');
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchNotifications(); }, []);

    const handleSend = async () => {
        if (!title || !message) { alert('Please fill in title and message'); return; }
        try {
            setSending(true);
            setSuccess('');
            await api.post('/admin/notifications', { title, message, type: notifType });
            setTitle('');
            setMessage('');
            setSuccess('Notification sent successfully!');
            await fetchNotifications();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to send notification');
        } finally { setSending(false); }
    };

    if (loading) return (<div className="space-y-6"><ListItemSkeleton rows={5} /></div>);
    if (error && tab === 'history') return <div className="text-center py-20"><p className="text-red-500 font-medium">{error}</p><button onClick={fetchNotifications} className="mt-3 text-sm text-green-700 underline">Retry</button></div>;

    return (
        <div className="space-y-6">
            <div><h2 className="text-2xl font-bold text-gray-900">Notifications</h2><p className="text-gray-500 text-sm mt-1">Send alerts and communicate with users</p></div>

            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                {[{ id: 'send' as const, l: 'Send Notification', i: Send }, { id: 'history' as const, l: 'Sent History', i: Clock }].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><t.i className="w-4 h-4" /> {t.l}</button>
                ))}
            </div>

            {tab === 'send' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                    <div className="flex items-center gap-3 mb-2"><div className="p-2.5 bg-green-50 rounded-xl"><Send className="w-5 h-5 text-green-600" /></div>
                        <div><h3 className="font-bold text-gray-900">Send Notification</h3><p className="text-xs text-gray-500">Send alerts to users</p></div></div>

                    {success && <div className="bg-green-50 text-green-700 text-sm font-medium px-4 py-2 rounded-xl">{success}</div>}

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[{ id: 'Booking', l: 'Booking', i: Calendar }, { id: 'Payment', l: 'Payment', i: DollarSign }, { id: 'Meal', l: 'Meal Update', i: UtensilsCrossed }, { id: 'System', l: 'System', i: Megaphone }].map(t => (
                            <button key={t.id} onClick={() => setNotifType(t.id)}
                                className={`p-3 rounded-xl border-2 text-center transition-all ${notifType === t.id ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-green-300'}`}>
                                <t.i className="w-5 h-5 mx-auto mb-1 text-gray-600" /><p className="text-xs font-semibold text-gray-700">{t.l}</p></button>
                        ))}
                    </div>

                    <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Title</label>
                        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Notification title..." className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30" /></div>
                    <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Message</label>
                        <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)} placeholder="Write your message..." className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30" /></div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={handleSend} disabled={sending || !title || !message}
                        className="flex items-center gap-2 px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50">
                        {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send Notification</motion.button>
                </motion.div>
            )}

            {tab === 'history' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                    {notifications.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No notifications sent yet</p>}
                    {notifications.map((n, i) => (
                        <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between px-5 py-4 hover:bg-green-50/30 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl ${(tC[n.type] || tC['General']).split(' ')[0]}`}><Bell className={`w-4 h-4 ${(tC[n.type] || tC['General']).split(' ')[1]}`} /></div>
                                <div><p className="text-sm font-semibold text-gray-800">{n.title}</p><p className="text-xs text-gray-400 line-clamp-1">{n.message}</p></div>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4"><p className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleDateString()}</p>
                                <p className="text-xs text-gray-400">{n.recipientId ? 'Specific user' : 'All users'}</p></div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
