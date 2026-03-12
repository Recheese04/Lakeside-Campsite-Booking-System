import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tent, Plus, Edit2, Trash2, X, Calendar, Eye, Users, Search, LogIn, LogOut as LogOutIcon, Loader2, Save } from 'lucide-react';
import api, { uploadImage } from '../../../services/api';
import { SearchSkeleton, TableRowSkeleton } from '../../../components/Skeleton';

interface Campsite {
    id: string;
    name: string;
    description: string;
    pricePerNight: string;
    capacity: number;
    location: string | null;
    status: string;
    amenities: string[];
    images: string[];
    createdAt: string;
    _count?: { bookings: number; reviews: number };
}

const statusStyle: Record<string, string> = { AVAILABLE: 'bg-green-100 text-green-700', MAINTENANCE: 'bg-amber-100 text-amber-700', CLOSED: 'bg-red-100 text-red-700' };

const emptyForm = { name: '', description: '', pricePerNight: '', capacity: '', location: '', status: 'AVAILABLE', amenities: '' as string, images: '' as string };

export default function CampsiteManagement() {
    const [campsites, setCampsites] = useState<Campsite[]>([]);
    const [activeTab, setActiveTab] = useState<'list' | 'calendar'>('list');
    const [search, setSearch] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const fetchCampsites = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/campsites');
            setCampsites(res.data);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load campsites');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCampsites(); }, []);

    const openAdd = () => {
        setEditingId(null);
        setForm(emptyForm);
        setSelectedFile(null);
        setShowAddModal(true);
    };

    const openEdit = (c: Campsite) => {
        setEditingId(c.id);
        setSelectedFile(null);
        setForm({
            name: c.name,
            description: c.description,
            pricePerNight: String(c.pricePerNight),
            capacity: String(c.capacity),
            location: c.location || '',
            status: c.status,
            amenities: c.amenities ? c.amenities.join(', ') : '',
            images: c.images ? c.images.join(', ') : '',
        });
        setShowAddModal(true);
    };

    const handleSubmit = async () => {
        try {
            setSaving(true);
            
            let imageUrls = form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : [];
            if (selectedFile) {
                const uploadedUrl = await uploadImage(selectedFile);
                imageUrls.push(uploadedUrl);
            }

            const data = {
                name: form.name,
                description: form.description,
                pricePerNight: parseFloat(form.pricePerNight),
                capacity: parseInt(form.capacity),
                location: form.location || null,
                status: form.status,
                amenities: form.amenities ? form.amenities.split(',').map(s => s.trim()).filter(Boolean) : [],
                images: imageUrls,
            };
            if (editingId) {
                await api.put(`/admin/campsites/${editingId}`, data);
            } else {
                await api.post('/admin/campsites', data);
            }
            setShowAddModal(false);
            setForm(emptyForm);
            setEditingId(null);
            await fetchCampsites();
        } catch (err: any) {
            console.error('Campsite save error:', err);
            alert(err.response?.data?.error || 'Failed to save campsite');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this campsite?')) return;
        try {
            await api.delete(`/admin/campsites/${id}`);
            await fetchCampsites();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to delete campsite');
        }
    };

    const filtered = campsites.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

    if (loading) return (
        <div className="space-y-6">
            <SearchSkeleton />
            <TableRowSkeleton cols={6} rows={5} />
        </div>
    );

    if (error) return (
        <div className="text-center py-20">
            <p className="text-red-500 font-medium">{error}</p>
            <button onClick={fetchCampsites} className="mt-3 text-sm text-green-700 underline">Retry</button>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div><h2 className="text-2xl font-bold text-gray-900">Campsite Management</h2><p className="text-gray-500 text-sm mt-1">Manage campsites and availability</p></div>
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={openAdd}
                    className="flex items-center gap-2 px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors">
                    <Plus className="w-4 h-4" /> Add Campsite
                </motion.button>
            </div>

            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                {[{ id: 'list' as const, label: 'Campsites', icon: Tent }, { id: 'calendar' as const, label: 'Calendar', icon: Calendar }].map(tab => (
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
                    {filtered.length === 0 && <p className="text-sm text-gray-400 text-center py-12">No campsites found</p>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((c, i) => (
                            <motion.div key={c.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                                <div className="relative h-40 bg-gray-100 overflow-hidden">
                                    {c.images && c.images.length > 0 ? (
                                        <img src={c.images[0]} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center"><Tent className="w-10 h-10 text-gray-300" /></div>
                                    )}
                                    <span className={`absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm ${statusStyle[c.status] || 'bg-gray-100 text-gray-600'}`}>{c.status}</span>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-bold text-gray-900 text-sm mb-1 truncate">{c.name}</h4>
                                    <p className="text-xs text-gray-400 mb-3">{c.location || 'No location set'}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{c.capacity} pax</span>
                                        <span className="font-bold text-green-700 text-sm">₱{Number(c.pricePerNight).toLocaleString()}<span className="font-normal text-gray-400 text-xs">/night</span></span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openEdit(c)} className="flex-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-xl transition-colors flex items-center justify-center gap-1"><Edit2 className="w-3 h-3" /> Edit</button>
                                        <button onClick={() => handleDelete(c.id)} className="flex-1 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-xl transition-colors flex items-center justify-center gap-1"><Trash2 className="w-3 h-3" /> Delete</button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {activeTab === 'calendar' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-5"><Calendar className="w-5 h-5 text-green-600" /><h3 className="font-bold text-gray-800">Availability Calendar</h3></div>
                    <p className="text-sm text-gray-400 text-center py-8">Calendar view — {campsites.length} campsites registered</p>
                </motion.div>
            )}

            {/* Add/Edit Campsite Modal */}
            <AnimatePresence>{showAddModal && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3"><div className="p-2.5 bg-green-50 rounded-xl">{editingId ? <Edit2 className="w-5 h-5 text-green-600" /> : <Plus className="w-5 h-5 text-green-600" />}</div><h3 className="font-bold text-gray-900">{editingId ? 'Edit Campsite' : 'Add New Campsite'}</h3></div>
                            <button onClick={() => setShowAddModal(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
                        </div>
                        <div className="space-y-3">
                            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Campsite Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Sunset View Tent" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500" /></div>
                            <div className="grid grid-cols-2 gap-3">
                                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Capacity</label><input type="number" value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} placeholder="4" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30" /></div>
                                <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Price/Night (₱)</label><input type="number" value={form.pricePerNight} onChange={e => setForm({ ...form, pricePerNight: e.target.value })} placeholder="1500" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30" /></div>
                            </div>
                            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Location</label><input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="e.g. Zone A" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30" /></div>
                            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Status</label>
                                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30">
                                    <option value="AVAILABLE">Available</option><option value="MAINTENANCE">Maintenance</option><option value="CLOSED">Closed</option>
                                </select>
                            </div>
                            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Amenities (comma separated)</label><input value={form.amenities} onChange={e => setForm({ ...form, amenities: e.target.value })} placeholder="wifi, bonfire_pit, restroom" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30" /></div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1 block">Campsite Image</label>
                                <input type="file" accept="image/*" onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
                                {form.images && <p className="text-xs text-gray-500 mt-2 truncate">Current: {form.images}</p>}
                            </div>
                            <div><label className="text-xs font-semibold text-gray-600 mb-1 block">Description</label><textarea rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe this campsite..." className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30" /></div>
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl">Cancel</button>
                            <button onClick={handleSubmit} disabled={saving || !form.name || !form.description || !form.pricePerNight || !form.capacity}
                                className="flex-1 py-2.5 text-sm font-semibold text-white bg-green-700 hover:bg-green-800 rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50">
                                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : editingId ? <Save className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                                {editingId ? 'Save' : 'Add'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}</AnimatePresence>
        </div>
    );
}
