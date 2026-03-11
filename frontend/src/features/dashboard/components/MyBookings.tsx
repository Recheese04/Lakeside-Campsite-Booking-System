import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchSkeleton, TableRowSkeleton } from '../../../components/Skeleton';
import {
    Search, Filter, Eye, X, QrCode, MapPin, Users, CalendarDays,
    Download, AlertTriangle, CheckCircle, Clock, Phone, Mail,
    ChevronDown, Star, Tent, CreditCard, RefreshCw
} from 'lucide-react';
import api from '../../../services/api';

const statusColors: Record<string, string> = {
    CONFIRMED: 'bg-green-100 text-green-700 border-green-200',
    PENDING: 'bg-amber-100 text-amber-700 border-amber-200',
    COMPLETED: 'bg-blue-100 text-blue-700 border-blue-200',
    CANCELLED: 'bg-gray-100 text-gray-500 border-gray-200',
};

const paymentColors: Record<string, string> = {
    PAID: 'text-green-600',
    UNPAID: 'text-amber-600',
    PARTIAL: 'text-amber-600',
    REFUNDED: 'text-blue-600',
};

const rowVariants = {
    hidden: { opacity: 0, x: -16 },
    show: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' } }),
};

export default function MyBookings() {
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selected, setSelected] = useState<any | null>(null);
    const [cancelTarget, setCancelTarget] = useState<any | null>(null);
    const [ratingTarget, setRatingTarget] = useState<any | null>(null);
    const [ratingValue, setRatingValue] = useState(0);
    const [ratingComment, setRatingComment] = useState('');
    const [cancelReason, setCancelReason] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const statuses = ['All', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'];

    useEffect(() => {
        api.get('/customer/bookings').then(res => {
            setBookings(res.data);
        }).catch(err => console.error(err)).finally(() => setLoading(false));
    }, []);

    const filtered = bookings
        .filter(b => {
            const matchSearch = b.campsite.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase());
            const matchStatus = filterStatus === 'All' || b.status === filterStatus;
            return matchSearch && matchStatus;
        })
        .sort((a, b) => sortBy === 'amount' ? Number(b.totalPrice) - Number(a.totalPrice) : new Date(b.checkIn).getTime() - new Date(a.checkIn).getTime());

    const totalSpent = bookings.filter(b => b.paymentStatus === 'PAID').reduce((s, b) => s + Number(b.totalPrice), 0);

    const handleCancel = async () => {
        if (!cancelTarget) return;
        try {
            await api.put(`/customer/bookings/${cancelTarget.id}/cancel`);
            setBookings(prev => prev.map(b => b.id === cancelTarget.id ? { ...b, status: 'CANCELLED' } : b));
            setCancelTarget(null);
        } catch (err) {
            console.error(err);
            alert('Failed to cancel booking');
        }
    };

    const handleRate = async () => {
        if (!ratingTarget || ratingValue === 0) return;
        try {
            await api.post('/customer/reviews', { campsiteId: ratingTarget.campsiteId, rating: ratingValue, comment: ratingComment });
            setRatingTarget(null);
        } catch (err) {
            console.error(err);
            alert('Failed to submit review');
        }
    };

    if (loading) return (
        <div className="space-y-6">
            <SearchSkeleton />
            <TableRowSkeleton cols={7} rows={5} />
        </div>
    );

    return (
        <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
                    <p className="text-gray-500 text-sm mt-1">View and manage all your campsite bookings</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full font-semibold">{bookings.length} Total</span>
                    <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full font-semibold">₱{totalSpent.toLocaleString()} Spent</span>
                </div>
            </div>

            {/* ── Filters ── */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search by campsite or booking ID..." value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {statuses.map(s => (
                        <button key={s} onClick={() => setFilterStatus(s)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filterStatus === s
                                ? 'bg-green-700 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-green-400'}`}>
                            {s}
                        </button>
                    ))}
                    <div className="relative ml-1">
                        <select value={sortBy} onChange={e => setSortBy(e.target.value as 'date' | 'amount')}
                            className="appearance-none text-xs bg-white border border-gray-200 px-3 py-1.5 pr-7 rounded-full text-gray-600 focus:outline-none focus:border-green-400 cursor-pointer">
                            <option value="date">Sort: Date</option>
                            <option value="amount">Sort: Amount</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* ── Table ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                {['Booking ID', 'Campsite', 'Check-in', 'Check-out', 'Guests', 'Amount', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.length === 0 ? (
                                <tr><td colSpan={8} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-2">
                                        <CalendarDays className="w-10 h-10 text-gray-200" />
                                        <p className="text-gray-400 font-medium">No bookings found</p>
                                        <p className="text-gray-300 text-xs">Try adjusting your filters</p>
                                    </div>
                                </td></tr>
                            ) : filtered.map((b, i) => (
                                <motion.tr key={b.id} custom={i} variants={rowVariants} initial="hidden" animate="show"
                                    className="border-b border-gray-50 hover:bg-green-50/40 transition-colors cursor-pointer"
                                    onClick={() => setSelected(b)}>
                                    <td className="px-5 py-4 font-mono text-xs text-gray-500 font-semibold">{b.id.slice(0, 12)}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            {b.images?.[0] ? <img src={b.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover" /> : <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center"><Tent className="w-4 h-4 text-green-400" /></div>}
                                            <div><p className="font-semibold text-gray-800">{b.campsite}</p><p className="text-gray-400 text-xs">{b.location}</p></div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-gray-600">{new Date(b.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                    <td className="px-5 py-4 text-gray-600">{new Date(b.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                                    <td className="px-5 py-4 text-gray-600">{b.guestCount}</td>
                                    <td className="px-5 py-4 font-bold text-green-700">₱{Number(b.totalPrice).toLocaleString()}</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[b.status] || ''}`}>{b.status}</span>
                                    </td>
                                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                                        <div className="flex items-center gap-1.5">
                                            <button onClick={() => setSelected(b)} className="p-1.5 text-green-700 hover:bg-green-100 rounded-lg transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                                            {b.status === 'COMPLETED' && (
                                                <button onClick={() => { setRatingTarget(b); setRatingValue(0); setRatingComment(''); }} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Rate"><Star className="w-4 h-4" /></button>
                                            )}
                                            {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                                                <button onClick={() => { setCancelTarget(b); setCancelReason(''); }} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Cancel"><X className="w-4 h-4" /></button>
                                            )}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden divide-y divide-gray-100">
                    {filtered.length === 0 ? (
                        <div className="text-center py-16 flex flex-col items-center gap-2">
                            <CalendarDays className="w-10 h-10 text-gray-200" />
                            <p className="text-gray-400 font-medium text-sm">No bookings found</p>
                        </div>
                    ) : filtered.map((b, i) => (
                        <motion.div key={b.id} custom={i} variants={rowVariants} initial="hidden" animate="show" className="p-4" onClick={() => setSelected(b)}>
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    {b.images?.[0] ? <img src={b.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center"><Tent className="w-5 h-5 text-green-400" /></div>}
                                    <div><p className="font-semibold text-gray-800 text-sm">{b.campsite}</p><p className="text-gray-400 text-xs font-mono">{b.id.slice(0, 12)}</p></div>
                                </div>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColors[b.status] || ''}`}>{b.status}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-3">
                                <div><p className="text-gray-400">Check-in</p><p className="font-medium text-gray-700">{new Date(b.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p></div>
                                <div><p className="text-gray-400">Check-out</p><p className="font-medium text-gray-700">{new Date(b.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p></div>
                                <div><p className="text-gray-400">Amount</p><p className="font-bold text-green-700">₱{Number(b.totalPrice).toLocaleString()}</p></div>
                            </div>
                            <button className="w-full py-2 text-xs font-semibold text-green-700 border border-green-200 rounded-xl hover:bg-green-50 transition-colors">View Details</button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* ═══════════ BOOKING DETAIL MODAL ═══════════ */}
            <AnimatePresence>
                {selected && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
                        <motion.div initial={{ opacity: 0, scale: 0.93, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.93, y: 24 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                            <div className="relative h-52 overflow-hidden rounded-t-3xl">
                                {selected.images?.[0] ? <img src={selected.images[0]} alt={selected.campsite} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-50 flex items-center justify-center"><Tent className="w-16 h-16 text-green-300" /></div>}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"><X className="w-4 h-4" /></button>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="text-xl font-bold">{selected.campsite}</h3>
                                    <div className="flex items-center gap-1 text-white/70 text-sm"><MapPin className="w-3.5 h-3.5" /> {selected.location || 'Mabini, Bohol'}</div>
                                </div>
                            </div>

                            <div className="p-6 space-y-5">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${statusColors[selected.status] || ''}`}>{selected.status}</span>
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                                        <span className={`text-sm font-semibold ${paymentColors[selected.paymentStatus] || ''}`}>{selected.paymentStatus}{selected.paymentMethod ? ` · ${selected.paymentMethod}` : ''}</span>
                                    </div>
                                </div>

                                {selected.description && <p className="text-gray-600 text-sm leading-relaxed">{selected.description}</p>}

                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: 'Booking ID', value: selected.id.slice(0, 12), icon: Tent },
                                        { label: 'Guests', value: `${selected.guestCount} guests`, icon: Users },
                                        { label: 'Check-in', value: new Date(selected.checkIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), icon: CalendarDays },
                                        { label: 'Check-out', value: new Date(selected.checkOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), icon: CalendarDays },
                                    ].map(({ label, value, icon: Icon }) => (
                                        <div key={label} className="bg-gray-50 rounded-xl p-3">
                                            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                                            <div className="flex items-center gap-1.5"><Icon className="w-3.5 h-3.5 text-gray-500" /><p className="text-sm font-semibold text-gray-800">{value}</p></div>
                                        </div>
                                    ))}
                                </div>

                                {selected.amenities?.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Amenities</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selected.amenities.map((a: string) => (
                                                <span key={a} className="text-xs px-2.5 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full font-medium">{a}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selected.equipments?.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Equipment & Add-ons</p>
                                        <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                                            {selected.equipments.map((eq: any, i: number) => (
                                                <div key={i} className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700">{eq.name} x{eq.quantity}</span>
                                                    <span className="text-sm font-semibold text-gray-800">₱{Number(eq.pricePerDay).toLocaleString()}/day</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selected.specialNotes && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Special Requests</p>
                                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm text-amber-800">{selected.specialNotes}</div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-2xl p-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Total Amount</p>
                                        <p className="text-2xl font-bold text-green-700">₱{Number(selected.totalPrice).toLocaleString()}</p>
                                        <p className="text-xs text-gray-400">{selected.nights} nights · {selected.guestCount} guests</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 text-gray-400">
                                        <div className="p-3 bg-white border border-green-100 rounded-xl shadow-sm"><QrCode className="w-8 h-8 text-green-700" /></div>
                                        <p className="text-[10px]">Check-in QR</p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {(selected.status === 'PENDING' || selected.status === 'CONFIRMED') && (
                                        <button onClick={() => { setSelected(null); setCancelTarget(selected); setCancelReason(''); }}
                                            className="flex-1 min-w-[120px] py-2.5 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5">
                                            <AlertTriangle className="w-3.5 h-3.5" /> Cancel
                                        </button>
                                    )}
                                    {selected.status === 'COMPLETED' && (
                                        <button onClick={() => { setSelected(null); setRatingTarget(selected); setRatingValue(0); setRatingComment(''); }}
                                            className="flex-1 min-w-[120px] py-2.5 text-sm font-semibold text-amber-700 border border-amber-200 rounded-xl hover:bg-amber-50 transition-colors flex items-center justify-center gap-1.5">
                                            <Star className="w-3.5 h-3.5" /> Rate Stay
                                        </button>
                                    )}
                                    <button className="flex-1 min-w-[120px] py-2.5 text-sm font-semibold text-white bg-green-700 hover:bg-green-800 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                                        <Download className="w-3.5 h-3.5" /> Receipt
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══════════ CANCEL CONFIRMATION MODAL ═══════════ */}
            <AnimatePresence>
                {cancelTarget && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setCancelTarget(null)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-red-50 rounded-xl"><AlertTriangle className="w-6 h-6 text-red-500" /></div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">Cancel This Booking?</h3>
                                    <p className="text-gray-500 text-xs">This action cannot be undone</p>
                                </div>
                            </div>
                            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-4">
                                <p className="font-semibold text-gray-800 text-sm">{cancelTarget.campsite}</p>
                                <p className="text-xs text-gray-500">{new Date(cancelTarget.checkIn).toLocaleDateString()} — {new Date(cancelTarget.checkOut).toLocaleDateString()}</p>
                                <p className="text-xs text-red-600 mt-2">Cancellations made 48+ hours before check-in are eligible for a full refund.</p>
                            </div>
                            <div className="mb-4">
                                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Reason for cancellation (optional)</label>
                                <textarea rows={3} value={cancelReason} onChange={e => setCancelReason(e.target.value)} placeholder="Tell us why you're cancelling..."
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all" />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setCancelTarget(null)} className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Keep Booking</button>
                                <button onClick={handleCancel} className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors">Yes, Cancel</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══════════ RATING MODAL ═══════════ */}
            <AnimatePresence>
                {ratingTarget && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setRatingTarget(null)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                            <div className="text-center mb-5">
                                <div className="w-14 h-14 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <Star className="w-7 h-7 text-amber-500" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg">Rate Your Stay</h3>
                                <p className="text-gray-500 text-xs mt-1">{ratingTarget.campsite} · {new Date(ratingTarget.checkIn).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center justify-center gap-2 mb-5">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <motion.button key={star} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                                        onClick={() => setRatingValue(star)} className="focus:outline-none">
                                        <Star className={`w-9 h-9 transition-colors ${star <= ratingValue ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                                    </motion.button>
                                ))}
                            </div>
                            <p className="text-center text-sm text-gray-500 mb-4">
                                {ratingValue === 0 && 'Tap a star to rate'}
                                {ratingValue === 1 && 'Poor'}
                                {ratingValue === 2 && 'Fair'}
                                {ratingValue === 3 && 'Good'}
                                {ratingValue === 4 && 'Very Good'}
                                {ratingValue === 5 && 'Excellent!'}
                            </p>
                            <textarea rows={3} value={ratingComment} onChange={e => setRatingComment(e.target.value)}
                                placeholder="Share your experience (optional)..."
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all mb-4" />
                            <div className="flex gap-3">
                                <button onClick={() => setRatingTarget(null)} className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Skip</button>
                                <button onClick={handleRate} disabled={ratingValue === 0}
                                    className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors ${ratingValue > 0
                                        ? 'text-white bg-amber-500 hover:bg-amber-600' : 'text-gray-400 bg-gray-100 cursor-not-allowed'}`}>
                                    Submit Rating
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
