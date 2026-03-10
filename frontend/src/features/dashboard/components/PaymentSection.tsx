import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CreditCard, CheckCircle, Clock, AlertCircle, Plus, Download,
    X, Wallet, ArrowUpRight, ArrowDownRight, Trash2, Star, Receipt
} from 'lucide-react';

/* ───────── MOCK DATA ───────── */
const transactions = [
    {
        id: 'TXN-001', booking: 'LCS-20250310', campsite: 'Lakefront Deluxe Tent', date: 'Mar 10, 2025', amount: '₱4,500', amountNum: 4500, method: 'GCash', status: 'Paid', type: 'debit',
        breakdown: [{ item: 'Campsite (3 nights)', amount: '₱4,500' }, { item: 'BBQ Grill Set', amount: '₱350' }, { item: 'Extra Blankets', amount: '₱200' }, { item: 'Platform Fee', amount: '-₱50' }], totalBreakdown: '₱5,000'
    },
    {
        id: 'TXN-002', booking: 'LCS-20250402', campsite: 'Premium Glamping Dome', date: 'Mar 08, 2025', amount: '₱7,200', amountNum: 7200, method: 'GCash', status: 'Pending', type: 'debit',
        breakdown: [{ item: 'Campsite (3 nights)', amount: '₱7,200' }, { item: 'Kayak Rental', amount: '₱500' }, { item: 'Campfire Kit', amount: '₱300' }, { item: 'Breakfast Bundle x4', amount: '₱800' }], totalBreakdown: '₱8,800'
    },
    {
        id: 'TXN-003', booking: 'LCS-20250115', campsite: 'Hilltop Campsite', date: 'Jan 12, 2025', amount: '₱3,900', amountNum: 3900, method: 'Bank Transfer', status: 'Paid', type: 'debit',
        breakdown: [{ item: 'Campsite (3 nights)', amount: '₱3,900' }, { item: 'Telescope Rental', amount: '₱400' }], totalBreakdown: '₱4,300'
    },
    {
        id: 'TXN-004', booking: 'LCS-20241220', campsite: 'Riverside Tent Site', date: 'Dec 18, 2024', amount: '₱2,700', amountNum: 2700, method: 'GCash', status: 'Refunded', type: 'credit',
        breakdown: [{ item: 'Campsite (3 nights)', amount: '₱2,700' }, { item: 'Refund (Full)', amount: '-₱2,700' }], totalBreakdown: '₱0'
    },
    {
        id: 'TXN-005', booking: 'LCS-20241105', campsite: 'Lakefront Deluxe Tent', date: 'Nov 3, 2024', amount: '₱3,000', amountNum: 3000, method: 'GCash', status: 'Paid', type: 'debit',
        breakdown: [{ item: 'Campsite (2 nights)', amount: '₱3,000' }], totalBreakdown: '₱3,000'
    },
];

const statusIcons: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    Paid: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
    Pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
    Refunded: { icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
};

const rowVariants = {
    hidden: { opacity: 0, x: -12 },
    show: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.05, duration: 0.3 } }),
};

type Transaction = typeof transactions[0];

/* ───────── COMPONENT ───────── */
export default function PaymentSection() {
    const [showAddMethod, setShowAddMethod] = useState(false);
    const [receiptTarget, setReceiptTarget] = useState<Transaction | null>(null);
    const [deleteMethod, setDeleteMethod] = useState<string | null>(null);
    const [selectedMethod, setSelectedMethod] = useState('gcash');

    const totalSpent = transactions.filter(t => t.status === 'Paid').reduce((s, t) => s + t.amountNum, 0);
    const totalPending = transactions.filter(t => t.status === 'Pending').reduce((s, t) => s + t.amountNum, 0);
    const totalRefunded = transactions.filter(t => t.status === 'Refunded').reduce((s, t) => s + t.amountNum, 0);

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Payments</h2>
                <p className="text-gray-500 text-sm mt-1">Manage payment methods and view your transaction history</p>
            </div>

            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Spent', value: `₱${totalSpent.toLocaleString()}`, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-100', icon: ArrowUpRight, iconColor: 'text-green-500' },
                    { label: 'Pending', value: `₱${totalPending.toLocaleString()}`, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100', icon: Clock, iconColor: 'text-amber-500' },
                    { label: 'Refunded', value: `₱${totalRefunded.toLocaleString()}`, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100', icon: ArrowDownRight, iconColor: 'text-blue-500' },
                ].map(({ label, value, color, bg, border, icon: Icon, iconColor }, i) => (
                    <motion.div key={label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        whileHover={{ y: -3 }}
                        className={`${bg} ${border} border rounded-2xl p-5 cursor-default`}>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-gray-500 font-medium">{label}</p>
                            <Icon className={`w-4 h-4 ${iconColor}`} />
                        </div>
                        <p className={`text-2xl font-bold ${color}`}>{value}</p>
                        <p className="text-xs text-gray-400 mt-1">{transactions.filter(t => t.status === label.replace('Total ', '')).length || transactions.length} transactions</p>
                    </motion.div>
                ))}
            </div>

            {/* ── Payment Methods ── */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2"><Wallet className="w-5 h-5 text-green-600" /> <h4 className="font-semibold text-gray-800">Payment Methods</h4></div>
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        onClick={() => { setShowAddMethod(true); setSelectedMethod('gcash'); }}
                        className="flex items-center gap-1.5 text-sm text-green-700 font-semibold hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition-colors">
                        <Plus className="w-4 h-4" /> Add
                    </motion.button>
                </div>
                <div className="space-y-3">
                    {[
                        { type: 'GCash', number: '+63 9XX XXX XXXX', primary: true, icon: '🟢', key: 'gcash' },
                        { type: 'Bank Transfer (BDO)', number: 'Savings · ••••3456', primary: false, icon: '🏦', key: 'bdo' },
                    ].map(({ type, number, primary, icon, key }) => (
                        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-green-200 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm text-lg">{icon}</div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{type}</p>
                                    <p className="text-xs text-gray-400">{number}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {primary && <span className="text-xs font-medium px-2.5 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full">Primary</span>}
                                {!primary && <button className="text-xs text-gray-400 hover:text-green-600 font-medium">Set Primary</button>}
                                <button onClick={() => setDeleteMethod(type)} className="p-1.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ── Transaction History ── */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2"><Receipt className="w-5 h-5 text-green-600" /> <h4 className="font-semibold text-gray-800">Transaction History</h4></div>
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{transactions.length} transactions</span>
                </div>
                <div className="divide-y divide-gray-50">
                    {transactions.map((t, i) => {
                        const { icon: Icon, color, bg } = statusIcons[t.status];
                        return (
                            <motion.div key={t.id} custom={i} variants={rowVariants} initial="hidden" animate="show"
                                onClick={() => setReceiptTarget(t)}
                                className="flex items-center justify-between px-5 py-4 hover:bg-green-50/30 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2.5 ${bg} border border-gray-100 rounded-xl`}><Icon className={`w-4 h-4 ${color}`} /></div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{t.campsite}</p>
                                        <p className="text-xs text-gray-400">{t.date} · {t.method} · <span className="font-mono">{t.id}</span></p>
                                    </div>
                                </div>
                                <div className="text-right flex items-center gap-3">
                                    <div>
                                        <p className={`text-sm font-bold ${t.type === 'credit' ? 'text-blue-600' : 'text-gray-800'}`}>
                                            {t.type === 'credit' ? '+' : '-'}{t.amount}
                                        </p>
                                        <p className={`text-xs font-medium ${color}`}>{t.status}</p>
                                    </div>
                                    <Download className="w-4 h-4 text-gray-300 group-hover:text-green-600 transition-colors" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* ═══════════ ADD PAYMENT METHOD MODAL ═══════════ */}
            <AnimatePresence>
                {showAddMethod && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddMethod(false)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-green-50 rounded-xl"><Plus className="w-5 h-5 text-green-600" /></div>
                                    <h3 className="font-bold text-gray-900">Add Payment Method</h3>
                                </div>
                                <button onClick={() => setShowAddMethod(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
                            </div>

                            {/* Method Selector */}
                            <div className="grid grid-cols-3 gap-2 mb-5">
                                {[
                                    { id: 'gcash', label: 'GCash', icon: '🟢' },
                                    { id: 'maya', label: 'Maya', icon: '🟣' },
                                    { id: 'bank', label: 'Bank Transfer', icon: '🏦' },
                                ].map(m => (
                                    <button key={m.id} onClick={() => setSelectedMethod(m.id)}
                                        className={`p-3 rounded-xl border-2 text-center transition-all ${selectedMethod === m.id
                                            ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-green-300'}`}>
                                        <div className="text-2xl mb-1">{m.icon}</div>
                                        <p className="text-xs font-semibold text-gray-700">{m.label}</p>
                                    </button>
                                ))}
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-3 mb-5">
                                {selectedMethod === 'bank' ? (
                                    <>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600 mb-1 block">Bank Name</label>
                                            <select className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500">
                                                <option>BDO</option><option>BPI</option><option>Metrobank</option><option>Landbank</option><option>UnionBank</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600 mb-1 block">Account Number</label>
                                            <input placeholder="XXXX-XXXX-XXXX" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600 mb-1 block">Account Holder</label>
                                            <input placeholder="Full name on account" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600 mb-1 block">{selectedMethod === 'gcash' ? 'GCash' : 'Maya'} Number</label>
                                            <input placeholder="+63 9XX XXX XXXX" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-600 mb-1 block">Account Name</label>
                                            <input placeholder="Name registered with the service" className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" />
                                        </div>
                                    </>
                                )}
                                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                    <input type="checkbox" className="w-4 h-4 accent-green-600 rounded" /> Set as primary payment method
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setShowAddMethod(false)} className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                                <button onClick={() => setShowAddMethod(false)} className="flex-1 py-2.5 text-sm font-semibold text-white bg-green-700 hover:bg-green-800 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                                    <Plus className="w-3.5 h-3.5" /> Add Method
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══════════ RECEIPT / BREAKDOWN MODAL ═══════════ */}
            <AnimatePresence>
                {receiptTarget && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setReceiptTarget(null)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
                            {/* Header */}
                            <div className="bg-gradient-to-r from-green-800 to-emerald-600 px-6 py-5 text-white relative">
                                <button onClick={() => setReceiptTarget(null)} className="absolute top-4 right-4 p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
                                <Receipt className="w-6 h-6 mb-2 opacity-80" />
                                <h3 className="font-bold text-lg">Payment Receipt</h3>
                                <p className="text-white/60 text-xs">{receiptTarget.id} · {receiptTarget.date}</p>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Booking Info */}
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-400 mb-1">Campsite</p>
                                    <p className="font-semibold text-gray-800">{receiptTarget.campsite}</p>
                                    <p className="text-xs text-gray-500 mt-1">Booking {receiptTarget.booking}</p>
                                </div>

                                {/* Breakdown */}
                                <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Payment Breakdown</p>
                                    <div className="space-y-2">
                                        {receiptTarget.breakdown.map((item, i) => (
                                            <div key={i} className="flex items-center justify-between py-1.5">
                                                <span className="text-sm text-gray-700">{item.item}</span>
                                                <span className={`text-sm font-semibold ${item.amount.startsWith('-') ? 'text-green-600' : 'text-gray-800'}`}>{item.amount}</span>
                                            </div>
                                        ))}
                                        <div className="border-t border-gray-200 pt-2 mt-2 flex items-center justify-between">
                                            <span className="text-sm font-bold text-gray-800">Total</span>
                                            <span className="text-lg font-bold text-green-700">{receiptTarget.totalBreakdown}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 rounded-xl p-3">
                                        <p className="text-xs text-gray-400">Method</p>
                                        <p className="text-sm font-semibold text-gray-800">{receiptTarget.method}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-3">
                                        <p className="text-xs text-gray-400">Status</p>
                                        <p className={`text-sm font-semibold ${statusIcons[receiptTarget.status].color}`}>{receiptTarget.status}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button className="flex-1 py-2.5 text-sm font-semibold text-green-700 border border-green-200 rounded-xl hover:bg-green-50 transition-colors flex items-center justify-center gap-1.5">
                                        <Download className="w-3.5 h-3.5" /> Download PDF
                                    </button>
                                    <button onClick={() => setReceiptTarget(null)} className="flex-1 py-2.5 text-sm font-semibold text-white bg-green-700 hover:bg-green-800 rounded-xl transition-colors">Close</button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══════════ DELETE METHOD CONFIRMATION ═══════════ */}
            <AnimatePresence>
                {deleteMethod && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteMethod(null)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
                            <div className="text-center mb-5">
                                <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3"><Trash2 className="w-6 h-6 text-red-500" /></div>
                                <h3 className="font-bold text-gray-900">Remove {deleteMethod}?</h3>
                                <p className="text-sm text-gray-500 mt-1">This payment method will be removed from your account.</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setDeleteMethod(null)} className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Keep</button>
                                <button onClick={() => setDeleteMethod(null)} className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors">Remove</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
