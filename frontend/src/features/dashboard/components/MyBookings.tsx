import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, Eye, X, QrCode, MapPin, Users, CalendarDays,
    Download, AlertTriangle, CheckCircle, Clock, Phone, Mail,
    ChevronDown, Star, Tent, CreditCard, RefreshCw
} from 'lucide-react';

/* ───────── MOCK DATA ───────── */
const allBookings = [
    {
        id: 'LCS-20250310', campsite: 'Lakefront Deluxe Tent', location: 'Zone A',
        checkIn: 'Mar 20, 2025', checkOut: 'Mar 23, 2025', nights: 3, guests: 2,
        status: 'Approved', amount: '₱4,500', amountNum: 4500,
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80',
        amenities: ['Fire Ring', 'Private Dock', 'Parking', 'Toilets', 'Picnic Table'],
        description: 'Enjoy lakefront views from this premium deluxe tent with a private dock, ideal for couples or solo adventurers.',
        payment: 'Paid', paymentMethod: 'GCash',
        addOns: [{ name: 'BBQ Grill Set', price: '₱350' }, { name: 'Extra Blankets (x2)', price: '₱200' }],
        specialRequests: 'Late check-in (around 8 PM). Need extra pillows for 2 guests.',
        contactPerson: 'Maria Santos', contactPhone: '+63 912 345 6789',
        rating: null,
    },
    {
        id: 'LCS-20250402', campsite: 'Premium Glamping Dome', location: 'Zone B',
        checkIn: 'Apr 5, 2025', checkOut: 'Apr 8, 2025', nights: 3, guests: 4,
        status: 'Pending', amount: '₱7,200', amountNum: 7200,
        image: 'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&w=600&q=80',
        amenities: ['AC', 'Private Bath', 'Breakfast', 'WiFi', 'Mini Fridge'],
        description: 'Luxurious geodesic dome with panoramic views. Full glamping amenities for families and groups.',
        payment: 'Pending', paymentMethod: 'GCash',
        addOns: [{ name: 'Kayak Rental (2hrs)', price: '₱500' }, { name: 'Campfire Kit', price: '₱300' }, { name: 'Breakfast Bundle x4', price: '₱800' }],
        specialRequests: 'Need a baby crib for a 1-year old. Allergic to nuts — please note for breakfast.',
        contactPerson: 'Juan dela Cruz', contactPhone: '+63 917 654 3210',
        rating: null,
    },
    {
        id: 'LCS-20250115', campsite: 'Hilltop Campsite', location: 'Zone C',
        checkIn: 'Jan 15, 2025', checkOut: 'Jan 18, 2025', nights: 3, guests: 3,
        status: 'Completed', amount: '₱3,900', amountNum: 3900,
        image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=600&q=80',
        amenities: ['Bonfire', 'BBQ Grill', 'Star Gazing', 'Toilets', 'Hammocks'],
        description: 'Perched atop a hill with stunning views of Mabini. Perfect for groups who love panoramic sunsets.',
        payment: 'Paid', paymentMethod: 'Bank Transfer',
        addOns: [{ name: 'Telescope Rental', price: '₱400' }],
        specialRequests: 'None',
        contactPerson: 'Ana Rodriguez', contactPhone: '+63 918 876 5432',
        rating: 5,
    },
    {
        id: 'LCS-20241220', campsite: 'Riverside Tent Site', location: 'Zone A',
        checkIn: 'Dec 20, 2024', checkOut: 'Dec 23, 2024', nights: 3, guests: 2,
        status: 'Cancelled', amount: '₱2,700', amountNum: 2700,
        image: 'https://images.unsplash.com/photo-1445307399708-84c4fa616b65?auto=format&fit=crop&w=600&q=80',
        amenities: ['River Access', 'Hammock', 'Parking'],
        description: 'Beside a freshwater stream, this serene riverside site is perfect for nature enthusiasts.',
        payment: 'Refunded', paymentMethod: 'GCash',
        addOns: [],
        specialRequests: 'N/A',
        contactPerson: 'Pedro Reyes', contactPhone: '+63 919 111 2222',
        rating: null,
    },
    {
        id: 'LCS-20241105', campsite: 'Lakefront Deluxe Tent', location: 'Zone A',
        checkIn: 'Nov 5, 2024', checkOut: 'Nov 7, 2024', nights: 2, guests: 2,
        status: 'Completed', amount: '₱3,000', amountNum: 3000,
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80',
        amenities: ['Fire Ring', 'Private Dock', 'Parking', 'Toilets'],
        description: 'Enjoy lakefront views from this premium deluxe tent with a private dock.',
        payment: 'Paid', paymentMethod: 'GCash',
        addOns: [],
        specialRequests: 'Early check-in requested.',
        contactPerson: 'Maria Santos', contactPhone: '+63 912 345 6789',
        rating: 4,
    },
];

const statusColors: Record<string, string> = {
    Approved: 'bg-green-100 text-green-700 border-green-200',
    Pending: 'bg-amber-100 text-amber-700 border-amber-200',
    Rejected: 'bg-red-100 text-red-700 border-red-200',
    Completed: 'bg-blue-100 text-blue-700 border-blue-200',
    Cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
};

const paymentColors: Record<string, string> = {
    Paid: 'text-green-600',
    Pending: 'text-amber-600',
    Refunded: 'text-blue-600',
};

const rowVariants = {
    hidden: { opacity: 0, x: -16 },
    show: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.05, duration: 0.3, ease: 'easeOut' } }),
};

type Booking = typeof allBookings[0];

/* ───────── COMPONENT ───────── */
export default function MyBookings() {
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selected, setSelected] = useState<Booking | null>(null);
    const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
    const [ratingTarget, setRatingTarget] = useState<Booking | null>(null);
    const [ratingValue, setRatingValue] = useState(0);
    const [ratingComment, setRatingComment] = useState('');
    const [cancelReason, setCancelReason] = useState('');
    const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

    const statuses = ['All', 'Approved', 'Pending', 'Completed', 'Cancelled', 'Rejected'];

    const filtered = allBookings
        .filter(b => {
            const matchSearch = b.campsite.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase());
            const matchStatus = filterStatus === 'All' || b.status === filterStatus;
            return matchSearch && matchStatus;
        })
        .sort((a, b) => sortBy === 'amount' ? b.amountNum - a.amountNum : 0);

    const totalSpent = allBookings.filter(b => b.payment === 'Paid').reduce((s, b) => s + b.amountNum, 0);

    return (
        <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
                    <p className="text-gray-500 text-sm mt-1">View and manage all your campsite bookings</p>
                </div>
                {/* Summary chips */}
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-full font-semibold">{allBookings.length} Total</span>
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
                {/* Desktop */}
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
                                    <td className="px-5 py-4 font-mono text-xs text-gray-500 font-semibold">{b.id}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <img src={b.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                                            <div><p className="font-semibold text-gray-800">{b.campsite}</p><p className="text-gray-400 text-xs">{b.location}</p></div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-gray-600">{b.checkIn}</td>
                                    <td className="px-5 py-4 text-gray-600">{b.checkOut}</td>
                                    <td className="px-5 py-4 text-gray-600">{b.guests}</td>
                                    <td className="px-5 py-4 font-bold text-green-700">{b.amount}</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[b.status]}`}>{b.status}</span>
                                    </td>
                                    <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                                        <div className="flex items-center gap-1.5">
                                            <button onClick={() => setSelected(b)} className="p-1.5 text-green-700 hover:bg-green-100 rounded-lg transition-colors" title="View"><Eye className="w-4 h-4" /></button>
                                            {b.status === 'Completed' && !b.rating && (
                                                <button onClick={() => { setRatingTarget(b); setRatingValue(0); setRatingComment(''); }} className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Rate"><Star className="w-4 h-4" /></button>
                                            )}
                                            {(b.status === 'Pending' || b.status === 'Approved') && (
                                                <button onClick={() => { setCancelTarget(b); setCancelReason(''); }} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Cancel"><X className="w-4 h-4" /></button>
                                            )}
                                            {b.status === 'Completed' && (
                                                <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Rebook"><RefreshCw className="w-4 h-4" /></button>
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
                                    <img src={b.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                    <div><p className="font-semibold text-gray-800 text-sm">{b.campsite}</p><p className="text-gray-400 text-xs font-mono">{b.id}</p></div>
                                </div>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColors[b.status]}`}>{b.status}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-3">
                                <div><p className="text-gray-400">Check-in</p><p className="font-medium text-gray-700">{b.checkIn}</p></div>
                                <div><p className="text-gray-400">Check-out</p><p className="font-medium text-gray-700">{b.checkOut}</p></div>
                                <div><p className="text-gray-400">Amount</p><p className="font-bold text-green-700">{b.amount}</p></div>
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
                            {/* Image */}
                            <div className="relative h-52 overflow-hidden rounded-t-3xl">
                                <img src={selected.image} alt={selected.campsite} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"><X className="w-4 h-4" /></button>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="text-xl font-bold">{selected.campsite}</h3>
                                    <div className="flex items-center gap-1 text-white/70 text-sm"><MapPin className="w-3.5 h-3.5" /> {selected.location} · Mabini, Bohol</div>
                                </div>
                                {selected.rating && (
                                    <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-amber-500/90 backdrop-blur-sm px-2 py-1 rounded-lg text-white text-xs font-semibold">
                                        <Star className="w-3 h-3 fill-white" /> {selected.rating}/5
                                    </div>
                                )}
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Status + Payment */}
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${statusColors[selected.status]}`}>{selected.status}</span>
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                                        <span className={`text-sm font-semibold ${paymentColors[selected.payment]}`}>{selected.payment} · {selected.paymentMethod}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 text-sm leading-relaxed">{selected.description}</p>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: 'Booking ID', value: selected.id, icon: Tent },
                                        { label: 'Guests', value: `${selected.guests} guests`, icon: Users },
                                        { label: 'Check-in', value: selected.checkIn, icon: CalendarDays },
                                        { label: 'Check-out', value: selected.checkOut, icon: CalendarDays },
                                    ].map(({ label, value, icon: Icon }) => (
                                        <div key={label} className="bg-gray-50 rounded-xl p-3">
                                            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                                            <div className="flex items-center gap-1.5"><Icon className="w-3.5 h-3.5 text-gray-500" /><p className="text-sm font-semibold text-gray-800">{value}</p></div>
                                        </div>
                                    ))}
                                </div>

                                {/* Amenities */}
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Amenities</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {selected.amenities.map(a => (
                                            <span key={a} className="text-xs px-2.5 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full font-medium">{a}</span>
                                        ))}
                                    </div>
                                </div>

                                {/* Add-ons */}
                                {selected.addOns.length > 0 && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Equipment & Add-ons</p>
                                        <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                                            {selected.addOns.map((addon, i) => (
                                                <div key={i} className="flex items-center justify-between">
                                                    <span className="text-sm text-gray-700">{addon.name}</span>
                                                    <span className="text-sm font-semibold text-gray-800">{addon.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Special Requests */}
                                {selected.specialRequests && selected.specialRequests !== 'None' && selected.specialRequests !== 'N/A' && (
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Special Requests</p>
                                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm text-amber-800">{selected.specialRequests}</div>
                                    </div>
                                )}

                                {/* Contact */}
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Contact Person</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 text-sm text-gray-700"><Phone className="w-3.5 h-3.5 text-gray-400" /> {selected.contactPhone}</div>
                                        <div className="flex items-center gap-1.5 text-sm text-gray-700"><Mail className="w-3.5 h-3.5 text-gray-400" /> {selected.contactPerson}</div>
                                    </div>
                                </div>

                                {/* Total & QR */}
                                <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-2xl p-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Total Amount</p>
                                        <p className="text-2xl font-bold text-green-700">{selected.amount}</p>
                                        <p className="text-xs text-gray-400">{selected.nights} nights · {selected.guests} guests</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 text-gray-400">
                                        <div className="p-3 bg-white border border-green-100 rounded-xl shadow-sm"><QrCode className="w-8 h-8 text-green-700" /></div>
                                        <p className="text-[10px]">Check-in QR</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-wrap gap-2">
                                    {(selected.status === 'Pending' || selected.status === 'Approved') && (
                                        <button onClick={() => { setSelected(null); setCancelTarget(selected); setCancelReason(''); }}
                                            className="flex-1 min-w-[120px] py-2.5 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5">
                                            <AlertTriangle className="w-3.5 h-3.5" /> Cancel
                                        </button>
                                    )}
                                    {selected.status === 'Completed' && !selected.rating && (
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
                                <div className="flex items-center gap-3 mb-2">
                                    <img src={cancelTarget.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">{cancelTarget.campsite}</p>
                                        <p className="text-xs text-gray-500">{cancelTarget.checkIn} — {cancelTarget.checkOut}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-red-600">Cancellations made 48+ hours before check-in are eligible for a full refund.</p>
                            </div>
                            <div className="mb-4">
                                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Reason for cancellation (optional)</label>
                                <textarea rows={3} value={cancelReason} onChange={e => setCancelReason(e.target.value)} placeholder="Tell us why you're cancelling..."
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-400 transition-all" />
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setCancelTarget(null)} className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Keep Booking</button>
                                <button onClick={() => setCancelTarget(null)} className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors">Yes, Cancel</button>
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
                                <p className="text-gray-500 text-xs mt-1">{ratingTarget.campsite} · {ratingTarget.checkIn}</p>
                            </div>

                            {/* Stars */}
                            <div className="flex items-center justify-center gap-2 mb-5">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <motion.button key={star} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                                        onClick={() => setRatingValue(star)}
                                        className="focus:outline-none">
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
                                <button onClick={() => setRatingTarget(null)} disabled={ratingValue === 0}
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
