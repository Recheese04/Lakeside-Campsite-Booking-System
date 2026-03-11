import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tent, Plus, Edit2, Trash2, X, Calendar, Eye, Users, DollarSign, MapPin, Search, Filter, CheckCircle, Clock, LogIn, LogOut as LogOutIcon } from 'lucide-react';

const campsites = [
    { id: 1, name: 'Lakefront Deluxe Tent', type: 'Tent', zone: 'Zone A', capacity: 2, price: 1500, status: 'Active', bookings: 24, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=200&q=80' },
    { id: 2, name: 'Premium Glamping Dome', type: 'Glamping', zone: 'Zone B', capacity: 4, price: 2400, status: 'Active', bookings: 18, image: 'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&w=200&q=80' },
    { id: 3, name: 'Hilltop Campsite', type: 'Tent', zone: 'Zone C', capacity: 6, price: 1300, status: 'Active', bookings: 15, image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=200&q=80' },
    { id: 4, name: 'Riverside Tent Site', type: 'Tent', zone: 'Zone A', capacity: 4, price: 900, status: 'Maintenance', bookings: 10, image: 'https://images.unsplash.com/photo-1445307399708-84c4fa616b65?auto=format&fit=crop&w=200&q=80' },
    { id: 5, name: 'Lakeside Hut', type: 'Hut', zone: 'Zone B', capacity: 3, price: 2000, status: 'Active', bookings: 12, image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=200&q=80' },
];

const checkInOutLogs = [
    { guest: 'Maria Santos', campsite: 'Lakefront Deluxe', type: 'Check-in', time: 'Today, 2:00 PM', status: 'Completed' },
    { guest: 'Juan dela Cruz', campsite: 'Glamping Dome', type: 'Check-in', time: 'Today, 3:30 PM', status: 'Expected' },
    { guest: 'Ana Rodriguez', campsite: 'Hilltop Site', type: 'Check-out', time: 'Today, 11:00 AM', status: 'Completed' },
    { guest: 'Pedro Reyes', campsite: 'Riverside Tent', type: 'Check-out', time: 'Tomorrow, 12:00 PM', status: 'Upcoming' },
];

const statusStyle: Record<string, string> = { Active: 'bg-green-100 text-green-700', Maintenance: 'bg-amber-100 text-amber-700' };
const logStyle: Record<string, string> = { Completed: 'text-green-600', Expected: 'text-amber-600', Upcoming: 'text-blue-600' };

export default function CampsiteManagement() {
    const [activeTab, setActiveTab] = useState<'list' | 'calendar' | 'logs'>('list');
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);

    const filtered = campsites.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div><h2 className="text-2xl font-bold text-gray-900">Campsite Management</h2><p className="text-gray-500 text-sm mt-1">Manage campsites, availability, and check-ins</p></div>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors">
                    <Plus className="w-4 h-4" /> Add Campsite
                </motion.button>
            </div>

            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                {[{ id: 'list' as const, label: 'Campsites', icon: Tent }, { id: 'calendar' as const, label: 'Calendar', icon: Calendar }, { id: 'logs' as const, label: 'Check-in/out', icon: LogIn }].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'list' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="relative"><Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search campsites..." value={search} onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all" />
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="bg-gray-50 border-b border-gray-100">
                                    {['Campsite', 'Type', 'Zone', 'Capacity', 'Price/Night', 'Status', 'Bookings', 'Actions'].map(h => (
                                        <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                                    ))}
                                </tr></thead>
                                <tbody>{filtered.map((c, i) => (
                                    <motion.tr key={c.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                        className="border-b border-gray-50 hover:bg-green-50/30 transition-colors">
                                        <td className="px-5 py-3"><div className="flex items-center gap-2"><img src={c.image} alt="" className="w-8 h-8 rounded-lg object-cover" /><span className="font-semibold text-gray-800">{c.name}</span></div></td>
                                        <td className="px-5 py-3 text-gray-600">{c.type}</td>
                                        <td className="px-5 py-3 text-gray-600">{c.zone}</td>
                                        <td className="px-5 py-3 text-gray-600"><Users className="w-3 h-3 inline mr-1" />{c.capacity}</td>
                                        <td className="px-5 py-3 font-bold text-green-700">₱{c.price.toLocaleString()}</td>
                                        <td className="px-5 py-3"><span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusStyle[c.status]}`}>{c.status}</span></td>
                                        <td className="px-5 py-3 text-gray-600">{c.bookings}</td>
                                        <td className="px-5 py-3"><div className="flex gap-1">
                                            <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                                            <button className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                                            <button className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                        </div></td>
                                    </motion.tr>
                                ))}</tbody>
                            </table>
                        </div>
                        <div className="md:hidden divide-y divide-gray-100">{filtered.map(c => (
                            <div key={c.id} className="p-4">
                                <div className="flex items-center gap-3 mb-2"><img src={c.image} alt="" className="w-12 h-12 rounded-xl object-cover" />
                                    <div><p className="font-semibold text-gray-800 text-sm">{c.name}</p><p className="text-xs text-gray-400">{c.type} · {c.zone}</p></div>
                                    <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle[c.status]}`}>{c.status}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-xs text-gray-500"><div><p className="text-gray-400">Capacity</p><p className="font-medium text-gray-700">{c.capacity}</p></div>
                                    <div><p className="text-gray-400">Price</p><p className="font-bold text-green-700">₱{c.price.toLocaleString()}</p></div>
                                    <div><p className="text-gray-400">Bookings</p><p className="font-medium text-gray-700">{c.bookings}</p></div>
                                </div>
                            </div>
                        ))}</div>
                    </div>
                </motion.div>
            )}

            {activeTab === 'calendar' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-5"><Calendar className="w-5 h-5 text-green-600" /><h3 className="font-bold text-gray-800">Availability Calendar</h3></div>
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="py-2 font-semibold text-gray-500">{d}</div>)}
                        {Array.from({ length: 31 }, (_, i) => {
                            const booked = [5, 6, 7, 12, 13, 14, 20, 21, 22, 23].includes(i + 1);
                            const blocked = [15, 16].includes(i + 1);
                            return (
                                <div key={i} className={`py-2 rounded-lg cursor-pointer transition-colors ${blocked ? 'bg-red-100 text-red-600' : booked ? 'bg-green-100 text-green-700 font-semibold' : 'hover:bg-gray-100 text-gray-600'}`}>
                                    {i + 1}
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-green-100 rounded" /> Booked</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-red-100 rounded" /> Blocked</span>
                        <span className="flex items-center gap-1"><div className="w-3 h-3 bg-gray-100 rounded" /> Available</span>
                    </div>
                </motion.div>
            )}

            {activeTab === 'logs' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2"><LogIn className="w-5 h-5 text-green-600" /><h3 className="font-bold text-gray-800 text-sm">Check-in / Check-out Logs</h3></div>
                    <div className="divide-y divide-gray-50">{checkInOutLogs.map((log, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between px-5 py-3.5 hover:bg-green-50/30 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl ${log.type === 'Check-in' ? 'bg-green-50' : 'bg-blue-50'}`}>
                                    {log.type === 'Check-in' ? <LogIn className="w-4 h-4 text-green-600" /> : <LogOutIcon className="w-4 h-4 text-blue-600" />}
                                </div>
                                <div><p className="text-sm font-semibold text-gray-800">{log.guest}</p><p className="text-xs text-gray-400">{log.campsite} · {log.type}</p></div>
                            </div>
                            <div className="text-right"><p className="text-xs text-gray-500">{log.time}</p><span className={`text-xs font-semibold ${logStyle[log.status]}`}>{log.status}</span></div>
                        </motion.div>
                    ))}</div>
                </motion.div>
            )}

            {/* Add Campsite Modal */}
            <AnimatePresence>{showAddModal && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3"><div className="p-2.5 bg-green-50 rounded-xl"><Plus className="w-5 h-5 text-green-600" /></div><h3 className="font-bold text-gray-900">Add New Campsite</h3></div>
                            <button onClick={() => setShowAddModal(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="space-y-3">
                            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Campsite Name</label><input placeholder="e.g. Sunset View Tent" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500" /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Type</label><select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30"><option>Tent</option><option>Glamping</option><option>Lakeside Hut</option></select></div>
                                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Zone</label><select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30"><option>Zone A</option><option>Zone B</option><option>Zone C</option></select></div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Capacity</label><input type="number" placeholder="4" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30" /></div>
                                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Price/Night (₱)</label><input type="number" placeholder="1500" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30" /></div>
                            </div>
                            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Description</label><textarea rows={2} placeholder="Describe this campsite..." className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30" /></div>
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl">Cancel</button>
                            <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 text-sm font-semibold text-white bg-green-700 hover:bg-green-800 rounded-xl flex items-center justify-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Add</button>
                        </div>
                    </motion.div>
                </motion.div>
            )}</AnimatePresence>
        </div>
    );
}
