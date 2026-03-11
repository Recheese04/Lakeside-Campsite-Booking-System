import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Star, MessageSquare, Tent, Clock, Edit2, 
    X, CheckCircle, AlertCircle 
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function FeedbackSection() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'pending' | 'submitted'>('pending');
    
    const [reviews, setReviews] = useState<any[]>([]);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedStay, setSelectedStay] = useState<any>(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const [reviewsRes, bookingsRes] = await Promise.all([
                    api.get('/customer/reviews'),
                    api.get('/customer/bookings'),
                ]);
                setReviews(reviewsRes.data);
                setBookings(bookingsRes.data.filter((b: any) => b.status === 'COMPLETED'));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    // A booking is pending format if it's completed and the user hasn't reviewed the campsite yet
    const pendingStays = bookings.filter(b => !reviews.some(r => r.campsiteId === b.campsiteId));
    // Unique pending stays by campsite
    const uniquePending = Array.from(new Map(pendingStays.map(b => [b.campsiteId, b])).values());

    const openReviewModal = (stay: any) => {
        setSelectedStay(stay);
        setRating(0);
        setComment('');
        setModalOpen(true);
    };

    const submitFeedback = async () => {
        if (rating === 0) return;
        setSubmitting(true);
        try {
            const res = await api.post('/customer/reviews', {
                campsiteId: selectedStay.campsiteId,
                rating,
                comment
            });
            // Fake the campsite object for the UI update
            const newReview = {
                ...res.data,
                campsite: { name: selectedStay.campsite, images: selectedStay.images }
            };
            setReviews(prev => [newReview, ...prev]);
            setModalOpen(false);
            setActiveTab('submitted');
        } catch (err) {
            console.error(err);
            alert('Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Feedback & Reviews</h2>
                <p className="text-gray-500 text-sm mt-1">Share your experience and help others plan their trip</p>
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
                    <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">Reviews Submitted</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
                    <p className="text-2xl font-bold text-amber-500">{reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}</p>
                    <div className="flex items-center gap-1 mt-1"><Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /><Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /><Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /></div>
                </div>
                <div className="bg-gradient-to-br from-green-700 to-emerald-600 text-white rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm col-span-2 md:col-span-1">
                    <p className="text-2xl font-bold">{uniquePending.length}</p>
                    <p className="text-xs font-semibold text-white/80 uppercase tracking-wide mt-1">Pending Reviews</p>
                </div>
            </div>

            {/* ── Tabs ── */}
            <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                <button onClick={() => setActiveTab('pending')} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'pending' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    <AlertCircle className="w-4 h-4" /> To Review {uniquePending.length > 0 && `(${uniquePending.length})`}
                </button>
                <button onClick={() => setActiveTab('submitted')} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'submitted' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    <CheckCircle className="w-4 h-4" /> Submitted
                </button>
            </div>

            {/* ── Pending Review Tab ── */}
            {activeTab === 'pending' && (
                <div className="space-y-4">
                    {uniquePending.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
                            <CheckCircle className="w-12 h-12 text-green-200 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">You're all caught up!</p>
                            <p className="text-sm text-gray-400 mt-1">No pending stays to review.</p>
                        </div>
                    ) : (
                        uniquePending.map(stay => (
                            <motion.div key={stay.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col sm:flex-row items-center gap-4 hover:shadow-md transition-shadow">
                                <div className="w-full sm:w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                                    {stay.images?.[0] ? <img src={stay.images[0]} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Tent className="w-8 h-8 text-gray-300" /></div>}
                                </div>
                                <div className="flex-1 min-w-0 text-center sm:text-left">
                                    <h4 className="font-bold text-gray-900">{stay.campsite}</h4>
                                    <p className="text-xs text-gray-500 mt-0.5">Stayed on {new Date(stay.checkOut).toLocaleDateString()}</p>
                                    <div className="flex items-center justify-center sm:justify-start gap-1 mt-2 text-gray-200">
                                        {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4" />)}
                                    </div>
                                </div>
                                <div className="w-full sm:w-auto">
                                    <button onClick={() => openReviewModal(stay)} className="w-full sm:w-auto px-6 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-xl text-sm font-semibold transition-colors">
                                        Write Review
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}

            {/* ── Submitted Reviews Tab ── */}
            {activeTab === 'submitted' && (
                <div className="space-y-4">
                    {reviews.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
                            <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No reviews submitted yet.</p>
                        </div>
                    ) : (
                        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {reviews.map(review => (
                                <motion.div key={review.id} variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            {review.campsite?.images?.[0] ? <img src={review.campsite.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" /> : <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center"><Tent className="w-5 h-5 text-green-500" /></div>}
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-sm leading-tight">{review.campsite?.name || 'Campsite'}</h4>
                                                <p className="text-xs text-gray-400 mt-0.5">{new Date(review.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                            <span className="text-sm font-bold text-gray-700">{review.rating}.0</span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-3 mb-3">
                                        <p className="text-sm text-gray-600 leading-relaxed italic">"{review.comment || 'No comment provided.'}"</p>
                                    </div>
                                    {review.adminResponse && (
                                        <div className="border-l-2 border-green-500 pl-3 py-1">
                                            <p className="text-xs font-semibold text-green-700 mb-0.5">Admin Response</p>
                                            <p className="text-xs text-gray-500">{review.adminResponse}</p>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            )}

            {/* ═══════════ SUBMIT REVIEW MODAL ═══════════ */}
            <AnimatePresence>
                {modalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-5">
                                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2"><Star className="w-5 h-5 text-amber-500" /> Share Your Experience</h3>
                                <button onClick={() => setModalOpen(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>
                            </div>

                            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-5 flex items-center gap-4">
                                {selectedStay?.images?.[0] ? <img src={selectedStay?.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" /> : <div className="w-12 h-12 bg-gray-200 rounded-lg" />}
                                <div>
                                    <h4 className="font-bold text-gray-900">{selectedStay?.campsite}</h4>
                                    <p className="text-xs text-gray-500 flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> Booked on {new Date(selectedStay?.checkIn || '').toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="mb-5 text-center">
                                <p className="text-sm font-semibold text-gray-700 mb-2">How would you rate your stay?</p>
                                <div className="flex items-center justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <motion.button key={star} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                                            onClick={() => setRating(star)} className="focus:outline-none">
                                            <Star className={`w-10 h-10 transition-colors ${star <= rating ? 'text-amber-400 fill-amber-400 drop-shadow-sm' : 'text-gray-200'}`} />
                                        </motion.button>
                                    ))}
                                </div>
                                <p className="text-xs text-amber-600 font-medium mt-2 h-4">
                                    {rating === 1 && 'Poor'}
                                    {rating === 2 && 'Fair'}
                                    {rating === 3 && 'Good'}
                                    {rating === 4 && 'Very Good'}
                                    {rating === 5 && 'Excellent!'}
                                </p>
                            </div>

                            <div className="mb-6">
                                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Review Details</label>
                                <textarea rows={4} value={comment} onChange={e => setComment(e.target.value)}
                                    placeholder="What did you like? What could be improved?"
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all custom-scrollbar" />
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                                <button onClick={submitFeedback} disabled={rating === 0 || submitting}
                                    className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 ${rating > 0 && !submitting ? 'text-white bg-green-700 hover:bg-green-800 shadow-md' : 'text-gray-400 bg-gray-100 cursor-not-allowed'}`}>
                                    {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                    Submit Feedback
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
