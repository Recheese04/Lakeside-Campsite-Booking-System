import { motion } from 'framer-motion';
import { Star, MessageSquare, Tent, UtensilsCrossed, TreePine } from 'lucide-react';

const reviews = [
    { id: 1, user: 'Maria Santos', type: 'Campsite', target: 'Hilltop Campsite', rating: 5, comment: 'Amazing views and perfect weather!', date: 'Jan 18, 2025', responded: true },
    { id: 2, user: 'Juan dela Cruz', type: 'Meal', target: 'BBQ Pork Ribs', rating: 4, comment: 'Delicious but slightly overcooked.', date: 'Jan 20, 2025', responded: false },
    { id: 3, user: 'Ana Rodriguez', type: 'Activity', target: 'Kayaking', rating: 5, comment: 'Best kayaking experience ever! Great instructor.', date: 'Jan 22, 2025', responded: true },
    { id: 4, user: 'Pedro Reyes', type: 'Campsite', target: 'Riverside Tent', rating: 3, comment: 'Location was nice but the tent needed cleaning.', date: 'Jan 25, 2025', responded: false },
    { id: 5, user: 'Sophia Garcia', type: 'Meal', target: 'Iced Coffee', rating: 5, comment: 'Perfect camp coffee!', date: 'Feb 1, 2025', responded: true },
];

const tIcon: Record<string, typeof Tent> = { Campsite: Tent, Meal: UtensilsCrossed, Activity: TreePine };
const tBg: Record<string, string> = { Campsite: 'bg-green-50', Meal: 'bg-amber-50', Activity: 'bg-blue-50' };
const tClr: Record<string, string> = { Campsite: 'text-green-600', Meal: 'text-amber-600', Activity: 'text-blue-600' };

export default function AdminFeedback() {
    const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);

    return (
        <div className="space-y-6">
            <div><h2 className="text-2xl font-bold text-gray-900">Feedback & Reviews</h2><p className="text-gray-500 text-sm mt-1">Monitor and respond to user reviews</p></div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[{ l: 'Total Reviews', v: reviews.length.toString(), c: 'text-green-700', bg: 'bg-green-50', b: 'border-green-100' },
                  { l: 'Avg Rating', v: avgRating, c: 'text-amber-700', bg: 'bg-amber-50', b: 'border-amber-100' },
                  { l: 'Responded', v: reviews.filter(r => r.responded).length.toString(), c: 'text-blue-700', bg: 'bg-blue-50', b: 'border-blue-100' },
                  { l: 'Pending Reply', v: reviews.filter(r => !r.responded).length.toString(), c: 'text-red-700', bg: 'bg-red-50', b: 'border-red-100' },
                ].map(s => (<div key={s.l} className={`${s.bg} ${s.b} border rounded-2xl p-4 text-center`}><p className={`text-2xl font-bold ${s.c}`}>{s.v}</p><p className="text-xs text-gray-500 mt-1">{s.l}</p></div>))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                {reviews.map((review, i) => {
                    const Icon = tIcon[review.type];
                    return (
                        <motion.div key={review.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                            className="px-5 py-4 hover:bg-green-50/30 transition-colors">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3">
                                    <div className={`p-2 rounded-xl ${tBg[review.type]} mt-0.5`}><Icon className={`w-4 h-4 ${tClr[review.type]}`} /></div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-sm font-semibold text-gray-800">{review.user}</p>
                                            <span className="text-xs text-gray-400">·</span>
                                            <p className="text-xs text-gray-400">{review.target}</p>
                                        </div>
                                        <div className="flex items-center gap-0.5 mb-1.5">{[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />)}</div>
                                        <p className="text-sm text-gray-600">{review.comment}</p>
                                        <p className="text-[10px] text-gray-400 mt-1">{review.date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {review.responded ? (
                                        <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">Responded</span>
                                    ) : (
                                        <button className="text-xs font-semibold text-white bg-green-700 hover:bg-green-800 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Reply</button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
