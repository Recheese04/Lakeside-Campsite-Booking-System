import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StatCardSkeleton, TableRowSkeleton } from '../../../components/Skeleton';
import { 
    CreditCard, DollarSign, Download, Clock, CheckCircle, AlertCircle, X, MapPin 
} from 'lucide-react';
import api from '../../../services/api';

const statusColors: Record<string, string> = {
    PAID: 'text-green-600 bg-green-50 border-green-200',
    UNPAID: 'text-amber-600 bg-amber-50 border-amber-200',
    PARTIAL: 'text-blue-600 bg-blue-50 border-blue-200',
    REFUNDED: 'text-gray-500 bg-gray-50 border-gray-200',
};

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const rowVariants = { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0, transition: { duration: 0.3 } } };

export default function PaymentSection() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState<any | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                // Payments are included in the bookings response
                const res = await api.get('/customer/bookings');
                setBookings(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const totalPaid = bookings.filter(b => b.paymentStatus === 'PAID').reduce((sum, b) => sum + Number(b.totalPrice), 0);
    const pendingAmount = bookings.filter(b => b.paymentStatus === 'UNPAID' && b.status !== 'CANCELLED').reduce((sum, b) => sum + Number(b.totalPrice), 0);

    if (loading) return (
        <div className="space-y-6 max-w-4xl">
            <StatCardSkeleton count={3} />
            <TableRowSkeleton cols={5} rows={4} />
        </div>
    );

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
                <p className="text-gray-500 text-sm mt-1">View your transactions, receipts, and pending payments</p>
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center sm:text-left flex items-center gap-4">
                    <div className="p-3 bg-violet-50 rounded-xl hidden sm:block"><DollarSign className="w-6 h-6 text-violet-600" /></div>
                    <div>
                        <p className="text-sm font-semibold text-gray-500">Total Spent</p>
                        <p className="text-2xl font-bold text-gray-900">₱{totalPaid.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-5 text-center sm:text-left flex items-center gap-4">
                    <div className="p-3 bg-amber-50 rounded-xl hidden sm:block"><Clock className="w-6 h-6 text-amber-500" /></div>
                    <div>
                        <p className="text-sm font-semibold text-amber-700">Pending Dues</p>
                        <p className="text-2xl font-bold text-amber-600">₱{pendingAmount.toLocaleString()}</p>
                    </div>
                </div>
                <button className="bg-gradient-to-br from-green-700 to-emerald-600 hover:from-green-800 hover:to-emerald-700 rounded-2xl p-5 text-white shadow-md transition-all flex flex-col items-center justify-center group">
                    <CreditCard className="w-6 h-6 mb-1 opacity-90 group-hover:scale-110 transition-transform" />
                    <p className="font-semibold text-sm">Make a Payment</p>
                </button>
            </div>

            {/* ── Transaction List ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800 text-sm">Recent Transactions</h3>
                    <button className="text-xs font-semibold text-green-700 flex items-center gap-1 hover:text-green-800"><Download className="w-3.5 h-3.5" /> Export All</button>
                </div>
                
                {bookings.length === 0 ? (
                    <div className="text-center py-16">
                        <CreditCard className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                        <p className="text-gray-400 font-medium">No payment history found.</p>
                    </div>
                ) : (
                    <motion.div variants={containerVariants} initial="hidden" animate="show" className="divide-y divide-gray-50">
                        {bookings.map((b) => (
                            <motion.div key={b.id} variants={rowVariants} onClick={() => setSelectedPayment(b)}
                                className="flex items-center justify-between px-5 py-4 hover:bg-green-50/30 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2.5 rounded-xl border flex-shrink-0 ${b.paymentStatus === 'PAID' ? 'bg-green-50 border-green-100' : b.paymentStatus === 'UNPAID' ? 'bg-amber-50 border-amber-100' : 'bg-gray-50 border-gray-100'}`}>
                                        {b.paymentStatus === 'PAID' ? <CheckCircle className={`w-5 h-5 text-green-500`} /> : 
                                         b.paymentStatus === 'UNPAID' ? <AlertCircle className={`w-5 h-5 text-amber-500`} /> :
                                         <Clock className={`w-5 h-5 text-gray-400`} />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm group-hover:text-green-700 transition-colors">{b.campsite}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Booking Ref: <span className="font-mono">{b.id.slice(0, 8).toUpperCase()}</span></p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-6">
                                    <div className="hidden sm:block">
                                        <p className="text-xs text-gray-400 mb-0.5">{new Date(b.createdAt).toLocaleDateString()}</p>
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${statusColors[b.paymentStatus]}`}>{b.paymentStatus}</span>
                                    </div>
                                    <div>
                                        <p className={`font-bold text-sm ${b.paymentStatus === 'PAID' ? 'text-gray-900' : 'text-amber-600'}`}>₱{Number(b.totalPrice).toLocaleString()}</p>
                                        {b.paymentMethod && <p className="text-[10px] text-gray-400 uppercase mt-0.5 tracking-wide">{b.paymentMethod}</p>}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>

            {/* ═══════════ RECEIPT MODAL ═══════════ */}
            <AnimatePresence>
                {selectedPayment && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 py-8" onClick={() => setSelectedPayment(null)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative" onClick={e => e.stopPropagation()}>
                            
                            {/* Zigzag Receipt Top */}
                            <div className="absolute top-0 left-0 w-full h-3 bg-repeat-x pointer-events-none" style={{ backgroundImage: 'linear-gradient(135deg, transparent 50%, white 50%), linear-gradient(45deg, white 50%, transparent 50%)', backgroundSize: '12px 12px' }} />

                            <div className="px-6 pt-10 pb-6 border-b border-dashed border-gray-200">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">Transaction Receipt</h3>
                                        <p className="text-xs text-gray-400 font-mono mt-0.5">#{selectedPayment.id.toUpperCase()}</p>
                                    </div>
                                    <button onClick={() => setSelectedPayment(null)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>
                                </div>

                                <div className="flex flex-col items-center justify-center py-4 text-center">
                                    <div className={`p-3 rounded-full mb-3 ${selectedPayment.paymentStatus === 'PAID' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'}`}>
                                        {selectedPayment.paymentStatus === 'PAID' ? <CheckCircle className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                                    </div>
                                    <h4 className="text-3xl font-bold text-gray-900 mb-1">₱{Number(selectedPayment.totalPrice).toLocaleString()}</h4>
                                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${statusColors[selectedPayment.paymentStatus]}`}>{selectedPayment.paymentStatus}</span>
                                </div>
                            </div>

                            <div className="px-6 py-6bg-gray-50/50 space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 mb-1">Item Details</p>
                                    <div className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm">
                                        <p className="font-bold text-gray-800 text-sm">{selectedPayment.campsite}</p>
                                        <p className="text-xs text-gray-500 mt-1"><MapPin className="w-3 h-3 inline mr-1" />{selectedPayment.location || 'Lakeside Camping Grounds'}</p>
                                        <div className="flex items-center justify-between text-xs text-gray-400 mt-2 pt-2 border-t border-gray-50">
                                            <span>{new Date(selectedPayment.checkIn).toLocaleDateString()} - {new Date(selectedPayment.checkOut).toLocaleDateString()}</span>
                                            <span>{selectedPayment.nights} nights, {selectedPayment.guestCount} guests</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Date Issued</p>
                                        <p className="font-semibold text-gray-800 text-sm">{new Date(selectedPayment.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                                        <p className="font-semibold text-gray-800 text-sm uppercase">{selectedPayment.paymentMethod || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 border-t border-gray-100 flex gap-3">
                                {selectedPayment.paymentStatus === 'UNPAID' && (
                                    <button className="flex-1 py-3 text-sm font-semibold text-white bg-green-700 hover:bg-green-800 rounded-xl transition-colors flex items-center justify-center gap-2">
                                        <CreditCard className="w-4 h-4" /> Pay Now
                                    </button>
                                )}
                                <button className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 ${selectedPayment.paymentStatus === 'UNPAID' ? 'text-gray-700 bg-white border border-gray-200 hover:bg-gray-50' : 'text-white bg-green-700 hover:bg-green-800'}`}>
                                    <Download className="w-4 h-4" /> Download PDF
                                </button>
                            </div>
                            
                            {/* Zigzag Receipt Bottom */}
                            <div className="absolute bottom-0 left-0 w-full h-3 bg-repeat-x pointer-events-none" style={{ backgroundImage: 'linear-gradient(-135deg, transparent 50%, white 50%), linear-gradient(-45deg, white 50%, transparent 50%)', backgroundSize: '12px 12px' }} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
