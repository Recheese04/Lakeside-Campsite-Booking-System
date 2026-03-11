import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Fish, Sailboat, TreePine, Tent, Flashlight, Calendar,
    MapPin, Users, Clock, Star, CheckCircle, AlertCircle,
    Package, ChevronRight
} from 'lucide-react';

/* ───────── MOCK DATA ───────── */
const activities = [
    { id: 1, name: 'Fishing Adventure', icon: Fish, description: 'Cast your line in the serene lake waters. Equipment and bait included.', price: 500, duration: '3 hours', capacity: '8 slots left', rating: 4.8, nextSlot: 'Tomorrow, 6:00 AM', image: 'https://images.unsplash.com/photo-1532015374784-0e50f83b6759?auto=format&fit=crop&w=400&q=80', color: 'from-blue-600 to-blue-500' },
    { id: 2, name: 'Kayaking / Boating', icon: Sailboat, description: 'Explore the lakeside on a kayak or small boat. Life vests provided.', price: 600, duration: '2 hours', capacity: '5 slots left', rating: 4.9, nextSlot: 'Today, 3:00 PM', image: 'https://images.unsplash.com/photo-1472745942893-4b9f730c7668?auto=format&fit=crop&w=400&q=80', color: 'from-emerald-600 to-emerald-500' },
    { id: 3, name: 'Hiking / Nature Walk', icon: TreePine, description: 'Guided trail hike through the lush forest with scenic viewpoints.', price: 300, duration: '4 hours', capacity: '12 slots left', rating: 4.7, nextSlot: 'Tomorrow, 7:00 AM', image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=400&q=80', color: 'from-green-700 to-green-600' },
];

const equipment = [
    { id: 1, name: '2-Person Tent', category: 'Shelter', price: 400, perDay: true, available: 8, total: 12, icon: Tent, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=200&q=80' },
    { id: 2, name: 'Sleeping Mats', category: 'Bedding', price: 100, perDay: true, available: 15, total: 20, icon: Package, image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=200&q=80' },
    { id: 3, name: 'Camping Lantern', category: 'Lighting', price: 80, perDay: true, available: 10, total: 15, icon: Flashlight, image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=200&q=80' },
    { id: 4, name: 'Fishing Rod Set', category: 'Activity', price: 200, perDay: true, available: 6, total: 10, icon: Fish, image: 'https://images.unsplash.com/photo-1532015374784-0e50f83b6759?auto=format&fit=crop&w=200&q=80' },
    { id: 5, name: 'Single Kayak', category: 'Watercraft', price: 350, perDay: false, available: 3, total: 6, icon: Sailboat, image: 'https://images.unsplash.com/photo-1472745942893-4b9f730c7668?auto=format&fit=crop&w=200&q=80' },
    { id: 6, name: 'Small Boat (4-person)', category: 'Watercraft', price: 800, perDay: false, available: 1, total: 3, icon: Sailboat, image: 'https://images.unsplash.com/photo-1505709395927-81d8e2e3fc1e?auto=format&fit=crop&w=200&q=80' },
];

const rentalHistory = [
    { id: 'RNT-001', item: '2-Person Tent', dates: 'Mar 20–23, 2025', status: 'Active', total: '₱1,200', returned: false },
    { id: 'RNT-002', item: 'Fishing Rod Set', dates: 'Jan 15–18, 2025', status: 'Returned', total: '₱600', returned: true },
    { id: 'RNT-003', item: 'Single Kayak', dates: 'Nov 5–7, 2024', status: 'Returned', total: '₱700', returned: true },
    { id: 'RNT-004', item: 'Camping Lantern x2', dates: 'Nov 5–7, 2024', status: 'Returned', total: '₱320', returned: true },
];

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } };

/* ───────── COMPONENT ───────── */
export default function ActivitiesSection() {
    const [activeTab, setActiveTab] = useState<'activities' | 'equipment' | 'history'>('activities');

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Activities & Rentals</h2>
                <p className="text-gray-500 text-sm mt-1">Book outdoor activities and rent camping equipment</p>
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                {[
                    { id: 'activities' as const, label: 'Activities', icon: TreePine },
                    { id: 'equipment' as const, label: 'Equipment', icon: Tent },
                    { id: 'history' as const, label: 'Rental History', icon: Clock },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Activities Tab ── */}
            {activeTab === 'activities' && (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    {activities.map(act => {
                        const Icon = act.icon;
                        return (
                            <motion.div key={act.id} variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="relative h-44 overflow-hidden">
                                    <img src={act.image} alt={act.name} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className={`p-1.5 bg-gradient-to-br ${act.color} rounded-lg`}><Icon className="w-4 h-4 text-white" /></div>
                                            <h3 className="font-bold text-white text-sm">{act.name}</h3>
                                        </div>
                                        <div className="flex items-center gap-3 text-white/70 text-xs">
                                            <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {act.rating}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {act.duration}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 space-y-3">
                                    <p className="text-xs text-gray-500 leading-relaxed">{act.description}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-400">
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {act.capacity}</span>
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {act.nextSlot}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-bold text-green-700">₱{act.price}<span className="text-xs font-normal text-gray-400">/person</span></p>
                                        <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                            className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-semibold transition-colors">
                                            Reserve
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            {/* ── Equipment Tab ── */}
            {activeTab === 'equipment' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="divide-y divide-gray-50">
                            {equipment.map((item, i) => {
                                const Icon = item.icon;
                                const pct = (item.available / item.total) * 100;
                                return (
                                    <motion.div key={item.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-center gap-4 px-5 py-4 hover:bg-green-50/30 transition-colors group">
                                        <img src={item.image} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <Icon className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                <p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p>
                                            </div>
                                            <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                                        </div>
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-bold text-green-700">₱{item.price}<span className="text-xs font-normal text-gray-400">/{item.perDay ? 'day' : 'session'}</span></p>
                                        </div>
                                        <div className="w-20 flex-shrink-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-xs font-semibold ${item.available > 0 ? 'text-green-600' : 'text-red-500'}`}>{item.available}/{item.total}</span>
                                            </div>
                                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${item.available > 0 ? 'bg-green-500' : 'bg-red-400'}`} style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                            disabled={item.available === 0}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-shrink-0 ${item.available > 0 ? 'bg-green-700 hover:bg-green-800 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                                            {item.available > 0 ? 'Rent' : 'Full'}
                                        </motion.button>
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-green-600 transition-colors flex-shrink-0" />
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ── Rental History Tab ── */}
            {activeTab === 'history' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-green-600" />
                            <h4 className="font-semibold text-gray-800">Rental History</h4>
                            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{rentalHistory.length} rentals</span>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {rentalHistory.map((rental, i) => (
                                <motion.div key={rental.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="flex items-center justify-between px-5 py-4 hover:bg-green-50/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl ${rental.returned ? 'bg-green-50' : 'bg-amber-50'}`}>
                                            {rental.returned ? <CheckCircle className="w-4 h-4 text-green-500" /> : <AlertCircle className="w-4 h-4 text-amber-500" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{rental.item}</p>
                                            <p className="text-xs text-gray-400">{rental.dates} · <span className="font-mono">{rental.id}</span></p>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-3">
                                        <div>
                                            <p className="text-sm font-bold text-green-700">{rental.total}</p>
                                            <span className={`text-xs font-semibold ${rental.returned ? 'text-green-600' : 'text-amber-600'}`}>{rental.status}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
