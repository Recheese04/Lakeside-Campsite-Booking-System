import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Tent, UtensilsCrossed, TreePine, Loader2, X, Send } from 'lucide-react';
import api from '../../../services/api';
import { StatCardSkeleton, ListItemSkeleton } from '../../../components/Skeleton';

interface Review {
    id: string;
    userId: string;
    campsiteId: string;
    rating: number;
    comment: string | null;
    adminResponse: string | null;
    createdAt: string;
    user: { firstName: string; lastName: string; email: string };
    campsite: { name: string };
}

interface FeedbackStats {
    averageRating: number;
    total: number;
}

export default function AdminFeedback() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<FeedbackStats>({ averageRating: 0, total: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [replyingId, setReplyingId] = useState<string | null>(null);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);

    const fetchFeedback = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/feedback');
            setReviews(res.data.reviews);
            setStats(res.data.stats);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load feedback');
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchFeedback(); }, []);

    const handleRespond = async (reviewId: string) => {
        if (!replyText.trim()) return;
        try {
            setSending(true);
            await api.post(`/admin/feedback/${reviewId}/respond`, { response: replyText });
            setReplyingId(null);
            setReplyText('');
            await fetchFeedback();
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to respond');
        } finally { setSending(false); }
    };

    if (loading) return (<div className="space-y-6"><StatCardSkeleton count={3} /><ListItemSkeleton rows={4} /></div>);
    if (error) return <div className="text-center py-20"><p className="text-red-500 font-medium">{error}</p><button onClick={fetchFeedback} className="mt-3 text-sm text-green-700 underline">Retry</button></div>;

    const respondedCount = reviews.filter(r => r.adminResponse).length;
    const pendingCount = reviews.filter(r => !r.adminResponse).length;

    return (
        <div className="space-y-6">
            <div><h2 className="text-2xl font-bold text-gray-900">Feedback & Reviews</h2><p className="text-gray-500 text-sm mt-1">Monitor and respond to user reviews</p></div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[{ l: 'Total Reviews', v: stats.total.toString(), c: 'text-green-700', bg: 'bg-green-50', b: 'border-green-100' },
                  { l: 'Avg Rating', v: stats.averageRating ? stats.averageRating.toFixed(1) : '0', c: 'text-amber-700', bg: 'bg-amber-50', b: 'border-amber-100' },
                  { l: 'Responded', v: respondedCount.toString(), c: 'text-blue-700', bg: 'bg-blue-50', b: 'border-blue-100' },
                  { l: 'Pending Reply', v: pendingCount.toString(), c: 'text-red-700', bg: 'bg-red-50', b: 'border-red-100' },
                ].map(s => (<div key={s.l} className={`${s.bg} ${s.b} border rounded-2xl p-4 text-center`}><p className={`text-2xl font-bold ${s.c}`}>{s.v}</p><p className="text-xs text-gray-500 mt-1">{s.l}</p></div>))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-50">
                {reviews.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No reviews yet</p>}
                {reviews.map((review, i) => (
                    <motion.div key={review.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        className="px-5 py-4 hover:bg-green-50/30 transition-colors">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-xl bg-green-50 mt-0.5"><Tent className="w-4 h-4 text-green-600" /></div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-semibold text-gray-800">{review.user.firstName} {review.user.lastName}</p>
                                        <span className="text-xs text-gray-400">·</span>
                                        <p className="text-xs text-gray-400">{review.campsite.name}</p>
                                    </div>
                                    <div className="flex items-center gap-0.5 mb-1.5">{[1,2,3,4,5].map(s => <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />)}</div>
                                    <p className="text-sm text-gray-600">{review.comment || 'No comment'}</p>
                                    {review.adminResponse && (
                                        <div className="mt-2 bg-green-50 rounded-lg p-2 text-xs text-green-700">
                                            <span className="font-semibold">Admin reply:</span> {review.adminResponse}
                                        </div>
                                    )}
                                    <p className="text-[10px] text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {review.adminResponse ? (
                                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">Responded</span>
                                ) : (
                                    <button onClick={() => { setReplyingId(review.id); setReplyText(''); }}
                                        className="text-xs font-semibold text-white bg-green-700 hover:bg-green-800 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                                        <MessageSquare className="w-3 h-3" /> Reply
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Reply input */}
                        <AnimatePresence>{replyingId === review.id && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                                className="mt-3 flex gap-2">
                                <input value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Type your response..."
                                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30" />
                                <button onClick={() => handleRespond(review.id)} disabled={sending || !replyText.trim()}
                                    className="px-3 py-2 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold disabled:opacity-50 flex items-center gap-1">
                                    {sending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Send
                                </button>
                                <button onClick={() => setReplyingId(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"><X className="w-4 h-4" /></button>
                            </motion.div>
                        )}</AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
