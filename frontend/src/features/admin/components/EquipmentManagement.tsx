import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Edit2, Trash2, Users, Calendar, TreePine, Loader2, X, Save } from 'lucide-react';
import api from '../../../services/api';
import { ListItemSkeleton } from '../../../components/Skeleton';

interface Equipment {
    id: string;
    name: string;
    description: string | null;
    pricePerDay: string;
    stock: number;
    imageUrl: string | null;
    _count?: { bookings: number };
}

interface Activity {
    id: string;
    name: string;
    description: string | null;
    price: string;
    capacity: number;
    schedule: string | null;
    available: boolean;
}

interface Reservation {
    id: string;
    quantity: number;
    equipment: { name: string; pricePerDay: string };
    booking: { checkIn: string; checkOut: string; status: string; user: { firstName: string; lastName: string } };
}

const sSt: Record<string, string> = { CONFIRMED: 'text-green-600', PENDING: 'text-amber-600', COMPLETED: 'text-gray-500', CANCELLED: 'text-red-500' };

export default function EquipmentManagement() {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [tab, setTab] = useState<'equipment' | 'activities' | 'reservations'>('equipment');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'equipment' | 'activity'>('equipment');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [eqForm, setEqForm] = useState({ name: '', description: '', pricePerDay: '', stock: '' });
    const [actForm, setActForm] = useState({ name: '', description: '', price: '', capacity: '', schedule: '' });
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [eqRes, actRes, resRes] = await Promise.all([
                api.get('/admin/equipment'),
                api.get('/admin/activities'),
                api.get('/admin/equipment/reservations'),
            ]);
            setEquipment(eqRes.data);
            setActivities(actRes.data);
            setReservations(resRes.data);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load data');
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const openAddEquipment = () => { setModalType('equipment'); setEditingId(null); setEqForm({ name: '', description: '', pricePerDay: '', stock: '' }); setShowModal(true); };
    const openEditEquipment = (e: Equipment) => { setModalType('equipment'); setEditingId(e.id); setEqForm({ name: e.name, description: e.description || '', pricePerDay: String(e.pricePerDay), stock: String(e.stock) }); setShowModal(true); };
    const openAddActivity = () => { setModalType('activity'); setEditingId(null); setActForm({ name: '', description: '', price: '', capacity: '', schedule: '' }); setShowModal(true); };
    const openEditActivity = (a: Activity) => { setModalType('activity'); setEditingId(a.id); setActForm({ name: a.name, description: a.description || '', price: String(a.price), capacity: String(a.capacity), schedule: a.schedule || '' }); setShowModal(true); };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            if (modalType === 'equipment') {
                const data = { name: eqForm.name, description: eqForm.description || null, pricePerDay: parseFloat(eqForm.pricePerDay), stock: parseInt(eqForm.stock) };
                if (editingId) await api.put(`/admin/equipment/${editingId}`, data);
                else await api.post('/admin/equipment', data);
            } else {
                const data = { name: actForm.name, description: actForm.description || null, price: parseFloat(actForm.price), capacity: parseInt(actForm.capacity), schedule: actForm.schedule || null };
                if (editingId) await api.put(`/admin/activities/${editingId}`, data);
                else await api.post('/admin/activities', data);
            }
            setShowModal(false); await fetchData();
        } catch (err: any) { alert(err.response?.data?.error || 'Failed to save'); }
        finally { setSaving(false); }
    };

    const handleDeleteEquipment = async (id: string) => { if (!confirm('Delete this equipment?')) return; try { await api.delete(`/admin/equipment/${id}`); await fetchData(); } catch (err: any) { alert(err.response?.data?.error || 'Failed to delete'); } };
    const handleDeleteActivity = async (id: string) => { if (!confirm('Delete this activity?')) return; try { await api.delete(`/admin/activities/${id}`); await fetchData(); } catch (err: any) { alert(err.response?.data?.error || 'Failed to delete'); } };

    if (loading) return (<div className="space-y-6"><ListItemSkeleton rows={4} /><ListItemSkeleton rows={3} /></div>);
    if (error) return <div className="text-center py-20"><p className="text-red-500 font-medium">{error}</p><button onClick={fetchData} className="mt-3 text-sm text-green-700 underline">Retry</button></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div><h2 className="text-2xl font-bold text-gray-900">Equipment & Activities</h2><p className="text-gray-500 text-sm mt-1">Manage inventory, activities, and reservations</p></div>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                    onClick={() => tab === 'activities' ? openAddActivity() : openAddEquipment()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors">
                    <Plus className="w-4 h-4" /> Add {tab === 'activities' ? 'Activity' : 'Equipment'}
                </motion.button>
            </div>

            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                {[{ id: 'equipment' as const, l: 'Equipment', i: Package }, { id: 'activities' as const, l: 'Activities', i: TreePine }, { id: 'reservations' as const, l: 'Reservations', i: Calendar }].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><t.i className="w-4 h-4" /> {t.l}</button>
                ))}
            </div>

            {tab === 'equipment' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                    {equipment.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No equipment yet</p>}
                    {equipment.map((item, i) => (
                        <motion.div key={item.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between px-5 py-4 hover:bg-green-50/30 transition-colors">
                            <div><p className="text-sm font-semibold text-gray-800">{item.name}</p><p className="text-xs text-gray-400">₱{Number(item.pricePerDay).toLocaleString()}/day · Stock: {item.stock}</p></div>
                            <div className="flex items-center gap-3">
                                <span className={`text-xs font-semibold ${item.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>{item.stock > 0 ? 'Available' : 'Out of stock'}</span>
                                <div className="flex gap-1">
                                    <button onClick={() => openEditEquipment(item)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDeleteEquipment(item.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {tab === 'activities' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                    {activities.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No activities yet</p>}
                    {activities.map((act, i) => (
                        <motion.div key={act.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between px-5 py-4 hover:bg-green-50/30 transition-colors">
                            <div><p className="text-sm font-semibold text-gray-800">{act.name}</p><p className="text-xs text-gray-400">{act.schedule || 'No schedule'} · ₱{Number(act.price).toLocaleString()}/person</p></div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-semibold text-gray-600"><Users className="w-3 h-3 inline mr-1" />Capacity: {act.capacity}</span>
                                <div className="flex gap-1">
                                    <button onClick={() => openEditActivity(act)} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDeleteActivity(act.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {tab === 'reservations' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                    {reservations.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No reservations yet</p>}
                    {reservations.map((r, i) => (
                        <motion.div key={r.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between px-5 py-4 hover:bg-green-50/30 transition-colors">
                            <div><p className="text-sm font-semibold text-gray-800">{r.booking.user.firstName} {r.booking.user.lastName}</p>
                                <p className="text-xs text-gray-400">{r.equipment.name} ×{r.quantity} · {new Date(r.booking.checkIn).toLocaleDateString()} – {new Date(r.booking.checkOut).toLocaleDateString()}</p></div>
                            <span className={`text-xs font-semibold ${sSt[r.booking.status] || 'text-gray-500'}`}>{r.booking.status}</span>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Add/Edit Modal */}
            <AnimatePresence>{showModal && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-bold text-gray-900">{editingId ? 'Edit' : 'Add'} {modalType === 'equipment' ? 'Equipment' : 'Activity'}</h3>
                            <button onClick={() => setShowModal(false)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"><X className="w-4 h-4" /></button>
                        </div>
                        {modalType === 'equipment' ? (
                            <div className="space-y-3">
                                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Name</label><input value={eqForm.name} onChange={e => setEqForm({ ...eqForm, name: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="e.g. 2-Person Tent" /></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Price/Day (₱)</label><input type="number" value={eqForm.pricePerDay} onChange={e => setEqForm({ ...eqForm, pricePerDay: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="400" /></div>
                                    <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Stock</label><input type="number" value={eqForm.stock} onChange={e => setEqForm({ ...eqForm, stock: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="10" /></div>
                                </div>
                                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Description</label><textarea rows={2} value={eqForm.description} onChange={e => setEqForm({ ...eqForm, description: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none" /></div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Name</label><input value={actForm.name} onChange={e => setActForm({ ...actForm, name: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="e.g. Kayaking" /></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Price (₱)</label><input type="number" value={actForm.price} onChange={e => setActForm({ ...actForm, price: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="500" /></div>
                                    <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Capacity</label><input type="number" value={actForm.capacity} onChange={e => setActForm({ ...actForm, capacity: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="20" /></div>
                                </div>
                                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Schedule</label><input value={actForm.schedule} onChange={e => setActForm({ ...actForm, schedule: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" placeholder="Daily 8AM–5PM" /></div>
                                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Description</label><textarea rows={2} value={actForm.description} onChange={e => setActForm({ ...actForm, description: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none" /></div>
                            </div>
                        )}
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl">Cancel</button>
                            <button onClick={handleSubmit} disabled={saving}
                                className="flex-1 py-2.5 text-sm font-semibold text-white bg-green-700 hover:bg-green-800 rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50">
                                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : editingId ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />} {editingId ? 'Save' : 'Add'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}</AnimatePresence>
        </div>
    );
}
