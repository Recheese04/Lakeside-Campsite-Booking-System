import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Bell, CheckCircle, AlertCircle, Info, Calendar,
    UtensilsCrossed, TreePine, Megaphone, Filter,
    Check, MailOpen
} from 'lucide-react';

const notifications = [
    { id: 1, type: 'booking', title: 'Booking Confirmed', message: 'Your booking LCS-20250310 at Lakefront Deluxe Tent has been approved.', time: '2 hours ago', read: false, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 2, type: 'meal', title: 'Order Ready', message: 'Your meal order ORD-001 is ready for delivery.', time: '15 min ago', read: false, icon: UtensilsCrossed, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 3, type: 'activity', title: 'Activity Reminder', message: 'Your kayaking session is scheduled for tomorrow at 3:00 PM.', time: '1 hour ago', read: false, icon: TreePine, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 4, type: 'system', title: 'System Maintenance', message: 'Booking system maintenance on Mar 15, 2025 from 2–4 AM.', time: '5 hours ago', read: true, icon: Megaphone, color: 'text-violet-500', bg: 'bg-violet-50' },
    { id: 5, type: 'booking', title: 'Check-in Reminder', message: 'Check-in for Lakefront Deluxe Tent is in 10 days.', time: '1 day ago', read: true, icon: Calendar, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 6, type: 'booking', title: 'Payment Received', message: 'Payment of ₱4,500 confirmed via GCash.', time: '2 days ago', read: true, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
    { id: 7, type: 'meal', title: 'Menu Update', message: 'New seasonal menu items available!', time: '3 days ago', read: true, icon: UtensilsCrossed, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 8, type: 'system', title: 'Welcome to Lakeside!', message: 'Thank you for joining. Explore and book your first stay!', time: '1 week ago', read: true, icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 9, type: 'activity', title: 'New Activity', message: 'Night fishing sessions now available!', time: '1 week ago', read: true, icon: TreePine, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 10, type: 'booking', title: 'Booking Pending', message: 'Booking LCS-20250402 awaiting admin approval.', time: '1 day ago', read: true, icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
];

const filterList = [
    { id: 'all', label: 'All', icon: Bell },
    { id: 'booking', label: 'Bookings', icon: Calendar },
    { id: 'meal', label: 'Meals', icon: UtensilsCrossed },
    { id: 'activity', label: 'Activities', icon: TreePine },
    { id: 'system', label: 'System', icon: Megaphone },
];

export default function NotificationsSection() {
    const [activeFilter, setActiveFilter] = useState('all');
    const [readState, setReadState] = useState<Record<number, boolean>>(
        Object.fromEntries(notifications.map(n => [n.id, n.read]))
    );

    const filtered = notifications.filter(n => activeFilter === 'all' || n.type === activeFilter);
    const unreadCount = Object.values(readState).filter(v => !v).length;

    const markAllRead = () => {
        const updated: Record<number, boolean> = {};
        for (const n of notifications) updated[n.id] = true;
        setReadState(updated);
    };

    const toggleRead = (id: number) => setReadState(prev => ({ ...prev, [id]: !prev[id] }));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
                    <p className="text-gray-500 text-sm mt-1">Stay updated with bookings, orders, and more</p>
                </div>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && <span className="text-xs bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full font-semibold">{unreadCount} unread</span>}
                    <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs font-semibold text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors">
                        <Check className="w-3.5 h-3.5" /> Mark all read
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                {filterList.map(f => (
                    <button key={f.id} onClick={() => setActiveFilter(f.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeFilter === f.id ? 'bg-green-700 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-green-400'}`}>
                        <f.icon className="w-3 h-3" /> {f.label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {filtered.length === 0 ? (
                    <div className="py-16 flex flex-col items-center gap-2">
                        <Bell className="w-10 h-10 text-gray-200" />
                        <p className="text-gray-400 font-medium">No notifications</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {filtered.map((notif, i) => {
                            const Icon = notif.icon;
                            const isRead = readState[notif.id];
                            return (
                                <motion.div key={notif.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                                    className={`flex items-start gap-3 px-5 py-4 hover:bg-green-50/30 transition-colors group ${!isRead ? 'bg-green-50/10' : ''}`}>
                                    <div className={`p-2 rounded-xl ${notif.bg} mt-0.5 flex-shrink-0`}><Icon className={`w-4 h-4 ${notif.color}`} /></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className={`text-sm font-semibold ${!isRead ? 'text-gray-900' : 'text-gray-700'}`}>{notif.title}</p>
                                                <p className={`text-xs mt-0.5 leading-relaxed ${!isRead ? 'text-gray-600' : 'text-gray-400'}`}>{notif.message}</p>
                                            </div>
                                            {!isRead && <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-1.5" />}
                                        </div>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-[10px] text-gray-400">{notif.time}</span>
                                            <button onClick={() => toggleRead(notif.id)} className="text-[10px] text-green-600 hover:text-green-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                                                <MailOpen className="w-2.5 h-2.5" /> {isRead ? 'Mark unread' : 'Mark read'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
