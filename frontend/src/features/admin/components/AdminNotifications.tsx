import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Send, Users, Calendar, DollarSign, UtensilsCrossed, Clock, Megaphone } from 'lucide-react';

const sentNotifs = [
    { id: 1, title: 'Payment Reminder', message: 'Your booking payment is due within 24 hours.', recipients: '2 users', sent: 'Mar 10, 2025', type: 'Payment' },
    { id: 2, title: 'Booking Confirmed', message: 'Your booking has been approved. See you soon!', recipients: 'Maria Santos', sent: 'Mar 10, 2025', type: 'Booking' },
    { id: 3, title: 'System Maintenance', message: 'The system will be down for maintenance on Mar 15.', recipients: 'All users', sent: 'Mar 8, 2025', type: 'System' },
    { id: 4, title: 'New Menu Items', message: 'Check out our new seasonal specials at the mini-restaurant!', recipients: 'All users', sent: 'Mar 5, 2025', type: 'Meal' },
];

const tC: Record<string, string> = { Payment: 'bg-amber-50 text-amber-700', Booking: 'bg-green-50 text-green-700', System: 'bg-violet-50 text-violet-700', Meal: 'bg-blue-50 text-blue-700' };

export default function AdminNotifications() {
    const [tab, setTab] = useState<'send' | 'history'>('send');
    const [notifType, setNotifType] = useState('booking');

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

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[{ id: 'booking', l: 'Booking', i: Calendar }, { id: 'payment', l: 'Payment', i: DollarSign }, { id: 'meal', l: 'Meal Update', i: UtensilsCrossed }, { id: 'system', l: 'System', i: Megaphone }].map(t => (
                            <button key={t.id} onClick={() => setNotifType(t.id)}
                                className={`p-3 rounded-xl border-2 text-center transition-all ${notifType === t.id ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-green-300'}`}>
                                <t.i className="w-5 h-5 mx-auto mb-1 text-gray-600" /><p className="text-xs font-semibold text-gray-700">{t.l}</p></button>
                        ))}
                    </div>

                    <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Recipients</label>
                        <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30"><option>All Users</option><option>Active Bookings Only</option><option>Pending Payments Only</option><option>Specific User</option></select></div>
                    <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Title</label>
                        <input placeholder="Notification title..." className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30" /></div>
                    <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Message</label>
                        <textarea rows={4} placeholder="Write your message..." className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30" /></div>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2 px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold transition-colors"><Send className="w-4 h-4" /> Send Notification</motion.button>
                </motion.div>
            )}

            {tab === 'history' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                    {sentNotifs.map((n, i) => (
                        <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between px-5 py-4 hover:bg-green-50/30 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl ${tC[n.type].split(' ')[0]}`}><Bell className={`w-4 h-4 ${tC[n.type].split(' ')[1]}`} /></div>
                                <div><p className="text-sm font-semibold text-gray-800">{n.title}</p><p className="text-xs text-gray-400 line-clamp-1">{n.message}</p></div>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4"><p className="text-xs text-gray-500">{n.sent}</p>
                                <p className="text-xs text-gray-400 flex items-center gap-1 justify-end"><Users className="w-3 h-3" /> {n.recipients}</p></div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
