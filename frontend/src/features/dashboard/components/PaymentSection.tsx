import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';

const transactions = [
    { id: 'TXN-001', booking: 'LCS-20250310', campsite: 'Lakefront Deluxe Tent', date: 'Mar 10, 2025', amount: '₱4,500', method: 'GCash', status: 'Paid' },
    { id: 'TXN-002', booking: 'LCS-20250402', campsite: 'Premium Glamping Dome', date: 'Mar 08, 2025', amount: '₱7,200', method: 'GCash', status: 'Pending' },
    { id: 'TXN-003', booking: 'LCS-20250115', campsite: 'Hilltop Campsite', date: 'Jan 12, 2025', amount: '₱3,900', method: 'Bank Transfer', status: 'Paid' },
    { id: 'TXN-004', booking: 'LCS-20241220', campsite: 'Riverside Tent Site', date: 'Dec 18, 2024', amount: '₱2,700', method: 'GCash', status: 'Refunded' },
];

const statusIcons: Record<string, { icon: React.ElementType; color: string }> = {
    Paid: { icon: CheckCircle, color: 'text-green-500' },
    Pending: { icon: Clock, color: 'text-amber-500' },
    Refunded: { icon: AlertCircle, color: 'text-blue-500' },
};

const rowVariants = {
    hidden: { opacity: 0, x: -12 },
    show: (i: number) => ({ opacity: 1, x: 0, transition: { delay: i * 0.06, duration: 0.3 } }),
};

export default function PaymentSection() {
    return (
        <div className="space-y-5 max-w-3xl">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Payments</h2>
                <p className="text-gray-500 text-sm mt-1">View your payment history and saved methods</p>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { label: 'Total Spent', value: '₱12,800', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-100' },
                    { label: 'Pending', value: '₱7,200', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100' },
                    { label: 'Refunded', value: '₱2,700', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100' },
                ].map(({ label, value, color, bg, border }, i) => (
                    <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className={`${bg} ${border} border rounded-2xl p-5`}
                    >
                        <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
                        <p className={`text-2xl font-bold ${color}`}>{value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Saved Payment Methods */}
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-800">Payment Methods</h4>
                    <button className="flex items-center gap-1.5 text-sm text-green-700 font-medium hover:text-green-800">
                        <Plus className="w-4 h-4" /> Add Method
                    </button>
                </div>
                <div className="space-y-3">
                    {[
                        { type: 'GCash', number: '+63 9XX XXX XXXX', primary: true },
                        { type: 'Bank Transfer', number: 'BDO · ••••3456', primary: false },
                    ].map(({ type, number, primary }) => (
                        <div key={type} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                                    <CreditCard className="w-4 h-4 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{type}</p>
                                    <p className="text-xs text-gray-400">{number}</p>
                                </div>
                            </div>
                            {primary && (
                                <span className="text-xs font-medium px-2.5 py-1 bg-green-100 text-green-700 border border-green-200 rounded-full">Primary</span>
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Transaction History */}
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
                <div className="px-5 py-4 border-b border-gray-100">
                    <h4 className="font-semibold text-gray-800">Transaction History</h4>
                </div>
                <div className="divide-y divide-gray-50">
                    {transactions.map((t, i) => {
                        const { icon: Icon, color } = statusIcons[t.status];
                        return (
                            <motion.div
                                key={t.id}
                                custom={i}
                                variants={rowVariants}
                                initial="hidden"
                                animate="show"
                                className="flex items-center justify-between px-5 py-4 hover:bg-green-50/30 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 border border-gray-100 rounded-xl">
                                        <Icon className={`w-4 h-4 ${color}`} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{t.campsite}</p>
                                        <p className="text-xs text-gray-400">{t.date} · {t.method}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold text-gray-800">{t.amount}</p>
                                    <p className={`text-xs font-medium ${color}`}>{t.status}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}
