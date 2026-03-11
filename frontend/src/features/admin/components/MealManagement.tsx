import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, Plus, Edit2, Trash2, X, CheckCircle, Clock, Eye, DollarSign, TrendingUp, Search } from 'lucide-react';

const menuItems = [
    { id: 1, name: 'Grilled Chicken Platter', category: 'Meals', price: 350, available: true, orders: 45 },
    { id: 2, name: 'BBQ Pork Ribs', category: 'Meals', price: 450, available: true, orders: 38 },
    { id: 3, name: 'Campfire Nachos', category: 'Snacks', price: 180, available: true, orders: 22 },
    { id: 4, name: 'Fresh Fruit Smoothie', category: 'Drinks', price: 120, available: true, orders: 30 },
    { id: 5, name: 'Iced Coffee', category: 'Drinks', price: 90, available: true, orders: 55 },
    { id: 6, name: "S'mores Platter", category: 'Desserts', price: 200, available: true, orders: 28 },
    { id: 7, name: 'Lakeside Fish & Chips', category: 'Meals', price: 320, available: false, orders: 15 },
];

const mealOrders = [
    { id: 'ORD-101', guest: 'Maria Santos', items: 'Grilled Chicken, Iced Coffee', total: '₱440', status: 'Preparing', time: '12:30 PM' },
    { id: 'ORD-102', guest: 'Juan dela Cruz', items: 'BBQ Pork Ribs x2', total: '₱900', status: 'Pending', time: '1:00 PM' },
    { id: 'ORD-103', guest: 'Ana Rodriguez', items: "S'mores Platter", total: '₱200', status: 'Delivered', time: '10:00 AM' },
    { id: 'ORD-104', guest: 'Pedro Reyes', items: 'Nachos, Smoothie', total: '₱300', status: 'Preparing', time: '2:00 PM' },
];

const statusC: Record<string, string> = { Preparing: 'bg-blue-100 text-blue-700', Pending: 'bg-amber-100 text-amber-700', Delivered: 'bg-green-100 text-green-700' };

export default function MealManagement() {
    const [tab, setTab] = useState<'menu' | 'orders' | 'reports'>('menu');
    const [search, setSearch] = useState('');
    const [showAdd, setShowAdd] = useState(false);

    const filtered = menuItems.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
    const totalRevenue = menuItems.reduce((s, m) => s + m.price * m.orders, 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div><h2 className="text-2xl font-bold text-gray-900">Meal Management</h2><p className="text-gray-500 text-sm mt-1">Manage menu items, orders, and reports</p></div>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setShowAdd(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"><Plus className="w-4 h-4" /> Add Item</motion.button>
            </div>

            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                {[{ id: 'menu' as const, l: 'Menu Items', i: UtensilsCrossed }, { id: 'orders' as const, l: 'Orders', i: Clock }, { id: 'reports' as const, l: 'Reports', i: TrendingUp }].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><t.i className="w-4 h-4" /> {t.l}</button>
                ))}
            </div>

            {tab === 'menu' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="relative"><Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search menu..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500" /></div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                        {filtered.map((item, i) => (
                            <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                className="flex items-center justify-between px-5 py-4 hover:bg-green-50/30 transition-colors">
                                <div className="flex items-center gap-3"><div className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-red-400'}`} />
                                    <div><p className="text-sm font-semibold text-gray-800">{item.name}</p><p className="text-xs text-gray-400">{item.category} · {item.orders} orders</p></div></div>
                                <div className="flex items-center gap-3"><p className="text-sm font-bold text-green-700">₱{item.price}</p>
                                    <div className="flex gap-1"><button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                        <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button></div></div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {tab === 'orders' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                    {mealOrders.map((order, i) => (
                        <motion.div key={order.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between px-5 py-4 hover:bg-green-50/30 transition-colors">
                            <div><p className="text-sm font-semibold text-gray-800">{order.guest}</p><p className="text-xs text-gray-400">{order.items} · {order.time}</p></div>
                            <div className="flex items-center gap-3"><p className="text-sm font-bold text-green-700">{order.total}</p>
                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusC[order.status]}`}>{order.status}</span>
                                {order.status !== 'Delivered' && <button className="text-xs font-semibold text-green-700 hover:text-green-800 bg-green-50 hover:bg-green-100 px-2.5 py-1 rounded-lg transition-colors">{order.status === 'Pending' ? 'Start' : 'Deliver'}</button>}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {tab === 'reports' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[{ l: 'Total Revenue', v: `₱${totalRevenue.toLocaleString()}`, c: 'text-green-700', bg: 'bg-green-50', b: 'border-green-100', i: DollarSign },
                          { l: 'Total Orders', v: menuItems.reduce((s, m) => s + m.orders, 0).toString(), c: 'text-blue-700', bg: 'bg-blue-50', b: 'border-blue-100', i: UtensilsCrossed },
                          { l: 'Most Popular', v: 'Iced Coffee', c: 'text-amber-700', bg: 'bg-amber-50', b: 'border-amber-100', i: TrendingUp },
                        ].map(s => (<div key={s.l} className={`${s.bg} ${s.b} border rounded-2xl p-5`}><s.i className={`w-5 h-5 ${s.c} mb-2`} /><p className={`text-2xl font-bold ${s.c}`}>{s.v}</p><p className="text-xs text-gray-500 mt-1">{s.l}</p></div>))}
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                        <h4 className="font-semibold text-gray-800 mb-4">Popular Items</h4>
                        <div className="space-y-3">{[...menuItems].sort((a, b) => b.orders - a.orders).slice(0, 5).map((item, i) => (
                            <div key={item.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3"><span className="text-xs font-bold text-gray-400 w-5">#{i + 1}</span><span className="text-sm font-medium text-gray-800">{item.name}</span></div>
                                <div className="flex items-center gap-3"><div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-green-500 rounded-full" style={{ width: `${(item.orders / 55) * 100}%` }} /></div>
                                    <span className="text-xs font-semibold text-gray-600">{item.orders}</span></div>
                            </div>
                        ))}</div>
                    </div>
                </motion.div>
            )}

            <AnimatePresence>{showAdd && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5"><div className="flex items-center gap-3"><div className="p-2.5 bg-green-50 rounded-xl"><Plus className="w-5 h-5 text-green-600" /></div><h3 className="font-bold text-gray-900">Add Menu Item</h3></div>
                            <button onClick={() => setShowAdd(false)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"><X className="w-4 h-4" /></button></div>
                        <div className="space-y-3">
                            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Item Name</label><input placeholder="e.g. Grilled Salmon" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30" /></div>
                            <div className="grid grid-cols-2 gap-3"><div><label className="text-xs font-semibold text-gray-600 mb-1 block">Category</label><select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"><option>Meals</option><option>Snacks</option><option>Drinks</option><option>Desserts</option></select></div>
                                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Price (₱)</label><input type="number" placeholder="350" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" /></div></div>
                            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Description</label><textarea rows={2} placeholder="Describe..." className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none" /></div>
                        </div>
                        <div className="flex gap-3 mt-5"><button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl">Cancel</button>
                            <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 text-sm font-semibold text-white bg-green-700 hover:bg-green-800 rounded-xl">Add Item</button></div>
                    </motion.div>
                </motion.div>
            )}</AnimatePresence>
        </div>
    );
}
