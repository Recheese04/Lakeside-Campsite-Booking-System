import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Eye, X, QrCode, MapPin, Users, CalendarDays } from 'lucide-react';

const allBookings = [
    {
        id: 'LCS-20250310', campsite: 'Lakefront Deluxe Tent', location: 'Zone A',
        checkIn: 'Mar 20, 2025', checkOut: 'Mar 23, 2025', nights: 3, guests: 2,
        status: 'Approved', amount: '₱4,500',
        image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=600&q=80',
        amenities: ['Fire Ring', 'Private Dock', 'Parking', 'Toilets'],
        description: 'Enjoy lakefront views from this premium deluxe tent with a private dock, ideal for couples or solo adventurers.',
        payment: 'Paid',
    },
    {
        id: 'LCS-20250402', campsite: 'Premium Glamping Dome', location: 'Zone B',
        checkIn: 'Apr 5, 2025', checkOut: 'Apr 8, 2025', nights: 3, guests: 4,
        status: 'Pending', amount: '₱7,200',
        image: 'https://images.unsplash.com/photo-1537225228614-56cc3556d7ed?auto=format&fit=crop&w=600&q=80',
        amenities: ['AC', 'Private Bath', 'Breakfast', 'WiFi'],
        description: 'Luxurious geodesic dome with panoramic views. Ideal for families and groups looking for a glamping experience.',
        payment: 'Pending',
    },
    {
        id: 'LCS-20250115', campsite: 'Hilltop Campsite', location: 'Zone C',
        checkIn: 'Jan 15, 2025', checkOut: 'Jan 18, 2025', nights: 3, guests: 3,
        status: 'Completed', amount: '₱3,900',
        image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?auto=format&fit=crop&w=600&q=80',
        amenities: ['Bonfire', 'BBQ Grill', 'Star Gazing', 'Toilets'],
        description: 'Perched atop a hill with stunning views of Mabini. Perfect for groups who love panoramic sunsets.',
        payment: 'Paid',
    },
    {
        id: 'LCS-20241220', campsite: 'Riverside Tent Site', location: 'Zone A',
        checkIn: 'Dec 20, 2024', checkOut: 'Dec 23, 2024', nights: 3, guests: 2,
        status: 'Cancelled', amount: '₱2,700',
        image: 'https://images.unsplash.com/photo-1445307399708-84c4fa616b65?auto=format&fit=crop&w=600&q=80',
        amenities: ['River Access', 'Hammock', 'Parking'],
        description: 'Beside a freshwater stream, this serene riverside site is perfect for nature enthusiasts.',
        payment: 'Refunded',
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
    show: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.06, duration: 0.35, ease: 'easeOut' } }),
};

export default function MyBookings() {
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selected, setSelected] = useState<(typeof allBookings)[0] | null>(null);

    const statuses = ['All', 'Approved', 'Pending', 'Completed', 'Cancelled', 'Rejected'];

    const filtered = allBookings.filter(b => {
        const matchSearch = b.campsite.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'All' || b.status === filterStatus;
        return matchSearch && matchStatus;
    });

    return (
        <div className="space-y-5">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
                <p className="text-gray-500 text-sm mt-1">View and manage all your campsite bookings</p>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search bookings..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {statuses.map(s => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filterStatus === s
                                ? 'bg-green-700 text-white shadow-sm'
                                : 'bg-white border border-gray-200 text-gray-600 hover:border-green-400'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Desktop Table */}
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
                                <tr>
                                    <td colSpan={8} className="text-center py-12 text-gray-400">No bookings found.</td>
                                </tr>
                            ) : filtered.map((b, i) => (
                                <motion.tr
                                    key={b.id}
                                    custom={i}
                                    variants={rowVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="border-b border-gray-50 hover:bg-green-50/40 transition-colors"
                                >
                                    <td className="px-5 py-4 font-mono text-xs text-gray-500 font-semibold">{b.id}</td>
                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-gray-800">{b.campsite}</p>
                                        <p className="text-gray-400 text-xs">{b.location}</p>
                                    </td>
                                    <td className="px-5 py-4 text-gray-600">{b.checkIn}</td>
                                    <td className="px-5 py-4 text-gray-600">{b.checkOut}</td>
                                    <td className="px-5 py-4 text-gray-600">{b.guests}</td>
                                    <td className="px-5 py-4 font-bold text-green-700">{b.amount}</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[b.status]}`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <motion.button
                                                whileHover={{ scale: 1.08 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setSelected(b)}
                                                className="p-1.5 text-green-700 hover:bg-green-100 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </motion.button>
                                            {b.status === 'Pending' || b.status === 'Approved' ? (
                                                <motion.button
                                                    whileHover={{ scale: 1.08 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Cancel Booking"
                                                >
                                                    <X className="w-4 h-4" />
                                                </motion.button>
                                            ) : null}
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
                        <div className="text-center py-12 text-gray-400 text-sm">No bookings found.</div>
                    ) : filtered.map((b, i) => (
                        <motion.div
                            key={b.id}
                            custom={i}
                            variants={rowVariants}
                            initial="hidden"
                            animate="show"
                            className="p-4"
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">{b.campsite}</p>
                                    <p className="text-gray-400 text-xs font-mono">{b.id}</p>
                                </div>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColors[b.status]}`}>{b.status}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-3">
                                <div>
                                    <p className="text-gray-400">Check-in</p>
                                    <p className="font-medium text-gray-700">{b.checkIn}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Check-out</p>
                                    <p className="font-medium text-gray-700">{b.checkOut}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400">Amount</p>
                                    <p className="font-bold text-green-700">{b.amount}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelected(b)} className="w-full py-2 text-xs font-semibold text-green-700 border border-green-200 rounded-xl hover:bg-green-50 transition-colors">
                                View Details
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Booking Detail Modal */}
            <AnimatePresence>
                {selected && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelected(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.93, y: 24 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.93, y: 24 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Image */}
                            <div className="relative h-52 overflow-hidden rounded-t-3xl">
                                <img src={selected.image} alt={selected.campsite} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                <button
                                    onClick={() => setSelected(null)}
                                    className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="text-xl font-bold">{selected.campsite}</h3>
                                    <div className="flex items-center gap-1 text-white/70 text-sm">
                                        <MapPin className="w-3.5 h-3.5" /> {selected.location} · Mabini, Bohol
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Status + Payment */}
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${statusColors[selected.status]}`}>
                                        {selected.status}
                                    </span>
                                    <span className={`text-sm font-semibold ${paymentColors[selected.payment]}`}>
                                        Payment: {selected.payment}
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 text-sm leading-relaxed">{selected.description}</p>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: 'Booking ID', value: selected.id, icon: null },
                                        { label: 'Guests', value: `${selected.guests} guests`, icon: Users },
                                        { label: 'Check-in', value: selected.checkIn, icon: CalendarDays },
                                        { label: 'Check-out', value: selected.checkOut, icon: CalendarDays },
                                    ].map(({ label, value, icon: Icon }) => (
                                        <div key={label} className="bg-gray-50 rounded-xl p-3">
                                            <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                                            <div className="flex items-center gap-1.5">
                                                {Icon && <Icon className="w-3.5 h-3.5 text-gray-500" />}
                                                <p className="text-sm font-semibold text-gray-800 font-mono">{value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Amenities */}
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Amenities Included</p>
                                    <div className="flex flex-wrap gap-2">
                                        {selected.amenities.map(a => (
                                            <span key={a} className="text-xs px-2.5 py-1 bg-green-50 text-green-700 border border-green-100 rounded-full font-medium">{a}</span>
                                        ))}
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
                                        <div className="p-3 bg-white border border-green-100 rounded-xl shadow-sm">
                                            <QrCode className="w-8 h-8 text-green-700" />
                                        </div>
                                        <p className="text-[10px]">Check-in QR</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    {(selected.status === 'Pending' || selected.status === 'Approved') && (
                                        <button className="flex-1 py-2.5 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors">
                                            Cancel Booking
                                        </button>
                                    )}
                                    <button className="flex-1 py-2.5 text-sm font-semibold text-white bg-green-700 hover:bg-green-800 rounded-xl transition-colors">
                                        Download Receipt
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
