import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ListItemSkeleton } from '../../../components/Skeleton';
import {
    TreePine, Tent, Clock, Users, Star, CheckCircle, AlertCircle, ChevronRight
} from 'lucide-react';
import api from '../../../services/api';

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } };

export default function ActivitiesSection() {
    const [activeTab, setActiveTab] = useState<'activities' | 'equipment'>('activities');
    const [activities, setActivities] = useState<any[]>([]);
    const [equipment, setEquipment] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [actRes, eqRes] = await Promise.all([
                    api.get('/customer/activities'),
                    api.get('/customer/equipment'),
                ]);
                setActivities(actRes.data);
                setEquipment(eqRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return (
        <div className="space-y-6">
            <ListItemSkeleton rows={4} />
            <ListItemSkeleton rows={3} />
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Activities & Rentals</h2>
                <p className="text-gray-500 text-sm mt-1">Book outdoor activities and view available camping equipment</p>
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                <button onClick={() => setActiveTab('activities')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'activities' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    <TreePine className="w-4 h-4" /> Activities
                </button>
                <button onClick={() => setActiveTab('equipment')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'equipment' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    <Tent className="w-4 h-4" /> Equipment
                </button>
            </div>

            {/* ── Activities Tab ── */}
            {activeTab === 'activities' && (
                <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-5">
                    {activities.length === 0 ? (
                         <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-gray-100">
                             <TreePine className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                             <p className="text-gray-400 font-medium text-sm">No activities currently available.</p>
                         </div>
                    ) : activities.map(act => (
                        <motion.div key={act.id} variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                            <div className="relative h-44 overflow-hidden bg-gray-50">
                                {act.imageUrl ? <img src={act.imageUrl} alt={act.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><TreePine className="w-10 h-10 text-gray-300" /></div>}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <div className="absolute bottom-3 left-3 right-3">
                                    <h3 className="font-bold text-white text-sm lg:text-base">{act.name}</h3>
                                    {act.schedule && <div className="flex items-center gap-1.5 text-white/80 text-xs mt-1"><Clock className="w-3.5 h-3.5" /> {act.schedule}</div>}
                                </div>
                            </div>
                            <div className="p-4 flex flex-col flex-1 space-y-3">
                                <p className="text-xs text-gray-500 flex-1">{act.description}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className="flex items-center gap-1 bg-green-50 text-green-700 font-medium px-2 py-1 rounded-md"><Users className="w-3.5 h-3.5" /> Up to {act.capacity}</span>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <p className="text-lg font-bold text-green-700">₱{Number(act.price).toLocaleString()}<span className="text-xs font-normal text-gray-400">/person</span></p>
                                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                                        className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-semibold transition-colors">
                                        Reserve
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* ── Equipment Tab ── */}
            {activeTab === 'equipment' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="divide-y divide-gray-50">
                            {equipment.length === 0 ? (
                                <div className="py-16 text-center">
                                    <Tent className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                                    <p className="text-gray-400 font-medium text-sm">No equipment currently available.</p>
                                </div>
                            ) : equipment.map((item, i) => (
                                <motion.div key={item.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                    className="flex items-center gap-4 px-5 py-4 hover:bg-green-50/30 transition-colors group">
                                    {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" /> : <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 flex-shrink-0"><Tent className="w-6 h-6 text-gray-300" /></div>}
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p>
                                        <p className="text-xs text-gray-500 mt-0.5 max-w-md truncate">{item.description}</p>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                        <p className="text-sm font-bold text-green-700">₱{Number(item.pricePerDay).toLocaleString()}<span className="text-xs font-normal text-gray-400">/day</span></p>
                                    </div>
                                    <div className="w-20 flex-shrink-0 text-right">
                                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>{item.stock} left</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-green-600 transition-colors flex-shrink-0" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
