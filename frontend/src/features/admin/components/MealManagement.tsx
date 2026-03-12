import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UtensilsCrossed, Plus, Edit2, Trash2, X, Clock, DollarSign, TrendingUp, Search, Loader2, Save } from 'lucide-react';
import api, { uploadImage } from '../../../services/api';
import { SearchSkeleton, ListItemSkeleton } from '../../../components/Skeleton';

interface MenuItem {
    id: string;
    name: string;
    description: string | null;
    price: string;
    category: string;
    imageUrl: string | null;
    available: boolean;
    createdAt: string;
}

interface MealOrder {
    id: string;
    userId: string;
    items: any;
    totalPrice: string;
    status: string;
    deliveryTime: string | null;
    notes: string | null;
    createdAt: string;
    user: { firstName: string; lastName: string; email: string };
}

const statusC: Record<string, string> = { PREPARING: 'bg-blue-100 text-blue-700', PENDING: 'bg-amber-100 text-amber-700', DELIVERED: 'bg-green-100 text-green-700', READY: 'bg-emerald-100 text-emerald-700', CANCELLED: 'bg-red-100 text-red-500' };

const emptyForm = { name: '', description: '', price: '', category: 'LUNCH', imageUrl: '' };

export default function MealManagement() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [orders, setOrders] = useState<MealOrder[]>([]);
    const [tab, setTab] = useState<'menu' | 'orders'>('menu');
    const [search, setSearch] = useState('');
    const [showAdd, setShowAdd] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [itemsRes, ordersRes] = await Promise.all([
                api.get('/admin/meals/items'),
                api.get('/admin/meals/orders'),
            ]);
            setMenuItems(itemsRes.data);
            setOrders(ordersRes.data);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load meal data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const openAdd = () => { setEditingId(null); setForm(emptyForm); setSelectedFile(null); setShowAdd(true); };
    const openEdit = (item: MenuItem) => {
        setEditingId(item.id);
        setSelectedFile(null);
        setForm({ name: item.name, description: item.description || '', price: String(item.price), category: item.category, imageUrl: item.imageUrl || '' });
        setShowAdd(true);
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            
            let finalImageUrl = form.imageUrl || null;
            if (selectedFile) {
                finalImageUrl = await uploadImage(selectedFile);
            }

            const data = { name: form.name, description: form.description || null, price: parseFloat(form.price), category: form.category, imageUrl: finalImageUrl };
            if (editingId) {
                await api.put(`/admin/meals/items/${editingId}`, data);
            } else {
                await api.post('/admin/meals/items', data);
            }
            setShowAdd(false); setForm(emptyForm); setEditingId(null);
            await fetchData();
        } catch (err: any) {
            console.error('Menu item save error:', err);
            alert(err.response?.data?.error || 'Failed to save menu item');
        } finally { setSaving(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this menu item?')) return;
        try { await api.delete(`/admin/meals/items/${id}`); await fetchData(); }
        catch (err: any) { alert(err.response?.data?.error || 'Failed to delete'); }
    };

    const handleOrderStatus = async (orderId: string, status: string) => {
        try {
            await api.put(`/admin/meals/orders/${orderId}/status`, { status });
            await fetchData();
        } catch (err: any) { alert(err.response?.data?.error || 'Failed to update order'); }
    };

    const filtered = menuItems.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

    if (loading) return (<div className="space-y-6"><SearchSkeleton /><ListItemSkeleton rows={5} /><ListItemSkeleton rows={3} /></div>);
    if (error) return <div className="text-center py-20"><p className="text-red-500 font-medium">{error}</p><button onClick={fetchData} className="mt-3 text-sm text-green-700 underline">Retry</button></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div><h2 className="text-2xl font-bold text-gray-900">Meal Management</h2><p className="text-gray-500 text-sm mt-1">Manage menu items and orders</p></div>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={openAdd}
                    className="flex items-center gap-2 px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"><Plus className="w-4 h-4" /> Add Item</motion.button>
            </div>

            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                {[{ id: 'menu' as const, l: 'Menu Items', i: UtensilsCrossed }, { id: 'orders' as const, l: 'Orders', i: Clock }].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}><t.i className="w-4 h-4" /> {t.l}</button>
                ))}
            </div>

            {tab === 'menu' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <div className="relative"><Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input type="text" placeholder="Search menu..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500" /></div>
                    {filtered.length === 0 && <p className="text-sm text-gray-400 text-center py-12">No menu items</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((item, i) => (
                            <motion.div key={item.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                                <div className="relative h-36 bg-gray-100 overflow-hidden">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center"><UtensilsCrossed className="w-10 h-10 text-gray-300" /></div>
                                    )}
                                    <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{item.available ? 'Available' : 'Unavailable'}</span>
                                    <span className="absolute top-3 right-3 text-xs font-medium px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-sm text-gray-600">{item.category}</span>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold text-gray-900 text-sm mb-1 truncate">{item.name}</h4>
                                    {item.description && <p className="text-xs text-gray-400 mb-2 line-clamp-2">{item.description}</p>}
                                    <p className="font-bold text-green-700 text-sm mb-3">₱{Number(item.price).toLocaleString()}</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(item)} className="flex-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-xl transition-colors flex items-center justify-center gap-1"><Edit2 className="w-3 h-3" /> Edit</button>
                                        <button onClick={() => handleDelete(item.id)} className="flex-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors flex items-center justify-center gap-1"><Trash2 className="w-3 h-3" /> Delete</button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {tab === 'orders' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                    {orders.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No orders yet</p>}
                    {orders.map((order, i) => (
                        <motion.div key={order.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                            className="flex items-center justify-between px-5 py-4 hover:bg-green-50/30 transition-colors">
                            <div><p className="text-sm font-semibold text-gray-800">{order.user.firstName} {order.user.lastName}</p>
                                <p className="text-xs text-gray-400">{Array.isArray(order.items) ? order.items.map((it: any) => it.name || 'Item').join(', ') : 'Order'} · {new Date(order.createdAt).toLocaleTimeString()}</p></div>
                            <div className="flex items-center gap-3"><p className="text-sm font-bold text-green-700">₱{Number(order.totalPrice).toLocaleString()}</p>
                                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusC[order.status] || 'bg-gray-100 text-gray-600'}`}>{order.status}</span>
                                {order.status === 'PENDING' && <button onClick={() => handleOrderStatus(order.id, 'PREPARING')} className="text-xs font-semibold text-green-700 bg-green-50 hover:bg-green-100 px-2.5 py-1 rounded-lg transition-colors">Start</button>}
                                {order.status === 'PREPARING' && <button onClick={() => handleOrderStatus(order.id, 'READY')} className="text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors">Ready</button>}
                                {order.status === 'READY' && <button onClick={() => handleOrderStatus(order.id, 'DELIVERED')} className="text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors">Deliver</button>}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            <AnimatePresence>{showAdd && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5"><div className="flex items-center gap-3"><div className="p-2.5 bg-green-50 rounded-xl">{editingId ? <Edit2 className="w-5 h-5 text-green-600" /> : <Plus className="w-5 h-5 text-green-600" />}</div><h3 className="font-bold text-gray-900">{editingId ? 'Edit Menu Item' : 'Add Menu Item'}</h3></div>
                            <button onClick={() => setShowAdd(false)} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"><X className="w-4 h-4" /></button></div>
                        <div className="space-y-3">
                            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Item Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Grilled Salmon" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30" /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Category</label>
                                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"><option value="BREAKFAST">Breakfast</option><option value="LUNCH">Lunch</option><option value="DINNER">Dinner</option><option value="SNACK">Snack</option><option value="DRINK">Drink</option></select></div>
                                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Price (₱)</label><input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="350" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm" /></div></div>
                            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Description</label><textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe..." className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none" /></div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">Item Image</label>
                                <input type="file" accept="image/*" onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                                {form.imageUrl && <p className="text-xs text-gray-500 mt-2 truncate">Current: {form.imageUrl}</p>}
                            </div>
                        </div>
                        <div className="flex gap-3 mt-5"><button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl">Cancel</button>
                            <button onClick={handleSubmit} disabled={saving || !form.name || !form.price}
                                className="flex-1 py-2.5 text-sm font-semibold text-white bg-green-700 hover:bg-green-800 rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50">
                                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : editingId ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />} {editingId ? 'Save' : 'Add Item'}</button></div>
                    </motion.div>
                </motion.div>
            )}</AnimatePresence>
        </div>
    );
}
