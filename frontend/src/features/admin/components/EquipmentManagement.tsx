import { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Tent, Flashlight, Fish, Sailboat, Plus, Edit2, Trash2, Users, Calendar, Search, TreePine, Clock } from 'lucide-react';

const equipment = [
    { id: 1, name: '2-Person Tent', category: 'Shelter', available: 8, total: 12, price: 400 },
    { id: 2, name: 'Sleeping Mats', category: 'Bedding', available: 15, total: 20, price: 100 },
    { id: 3, name: 'Camping Lantern', category: 'Lighting', available: 10, total: 15, price: 80 },
    { id: 4, name: 'Fishing Rod Set', category: 'Activity', available: 6, total: 10, price: 200 },
    { id: 5, name: 'Single Kayak', category: 'Watercraft', available: 3, total: 6, price: 350 },
    { id: 6, name: 'Small Boat', category: 'Watercraft', available: 1, total: 3, price: 800 },
];

const activities = [
    { id: 1, name: 'Fishing', capacity: 20, booked: 12, schedule: 'Daily, 6AM–12PM', price: 500 },
    { id: 2, name: 'Kayaking', capacity: 12, booked: 8, schedule: 'Daily, 8AM–5PM', price: 600 },
    { id: 3, name: 'Hiking', capacity: 30, booked: 18, schedule: 'Tue/Thu/Sat, 7AM', price: 300 },
];

const reservations = [
    { guest: 'Maria Santos', item: 'Single Kayak', type: 'Equipment', date: 'Mar 20–23', status: 'Active' },
    { guest: 'Juan dela Cruz', item: 'Fishing Adventure', type: 'Activity', date: 'Apr 6', status: 'Upcoming' },
    { guest: 'Ana Rodriguez', item: '2-Person Tent', type: 'Equipment', date: 'Mar 15–18', status: 'Returned' },
    { guest: 'Pedro Reyes', item: 'Hiking Tour', type: 'Activity', date: 'Mar 14', status: 'Completed' },
];

const sSt: Record<string, string> = { Active: 'text-green-600', Upcoming: 'text-blue-600', Returned: 'text-amber-600', Completed: 'text-gray-500' };

export default function EquipmentManagement() {
    const [tab, setTab] = useState<'equipment' | 'activities' | 'reservations'>('equipment');

    return (
        <div className="space-y-6">
            <div><h2 className="text-2xl font-bold text-gray-900">Equipment & Activities</h2><p className="text-gray-500 text-sm mt-1">Manage inventory, activities, and reservations</p></div>

            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                {[{ id: 'equipment' as const, l: 'Equipment', i: Package }, { id: 'activities' as const, l: 'Activities', i: TreePine }, { id: 'reservations' as const, l: 'Reservations', i: Calendar }].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><t.i className="w-4 h-4" /> {t.l}</button>
                ))}
            </div>

            {tab === 'equipment' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                    {equipment.map((item, i) => {
                        const pct = (item.available / item.total) * 100;
                        return (
                            <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                className="flex items-center justify-between px-5 py-4 hover:bg-green-50/30 transition-colors">
                                <div><p className="text-sm font-semibold text-gray-800">{item.name}</p><p className="text-xs text-gray-400">{item.category} · ₱{item.price}/day</p></div>
                                <div className="flex items-center gap-4">
                                    <div className="w-20"><div className="flex items-center justify-between mb-1"><span className={`text-xs font-semibold ${item.available > 0 ? 'text-green-600' : 'text-red-500'}`}>{item.available}/{item.total}</span></div>
                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${item.available > 0 ? 'bg-green-500' : 'bg-red-400'}`} style={{ width: `${pct}%` }} /></div></div>
                                    <div className="flex gap-1"><button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                        <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            {tab === 'activities' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                    {activities.map((act, i) => {
                        const pct = (act.booked / act.capacity) * 100;
                        return (
                            <motion.div key={act.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                className="flex items-center justify-between px-5 py-4 hover:bg-green-50/30 transition-colors">
                                <div><p className="text-sm font-semibold text-gray-800">{act.name}</p><p className="text-xs text-gray-400">{act.schedule} · ₱{act.price}/person</p></div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right"><span className="text-xs font-semibold text-gray-600"><Users className="w-3 h-3 inline mr-1" />{act.booked}/{act.capacity}</span>
                                        <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden mt-1"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} /></div></div>
                                    <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            {tab === 'reservations' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                    {reservations.map((r, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between px-5 py-4 hover:bg-green-50/30 transition-colors">
                            <div><p className="text-sm font-semibold text-gray-800">{r.guest}</p><p className="text-xs text-gray-400">{r.item} · {r.type} · {r.date}</p></div>
                            <span className={`text-xs font-semibold ${sSt[r.status]}`}>{r.status}</span>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
