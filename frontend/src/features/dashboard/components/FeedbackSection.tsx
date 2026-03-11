import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, MessageSquare, Camera, Send, Tent, UtensilsCrossed,
    TreePine, ChevronDown, CheckCircle, Clock, Image
} from 'lucide-react';

const myReviews = [
    { id: 1, type: 'Campsite', target: 'Hilltop Campsite', booking: 'LCS-20250115', date: 'Jan 18, 2025', rating: 5, comment: 'Amazing views and perfect weather. The bonfire setup was incredible!', status: 'Published', photos: 2 },
    { id: 2, type: 'Campsite', target: 'Lakefront Deluxe Tent', booking: 'LCS-20241105', date: 'Nov 7, 2024', rating: 4, comment: 'Great lakeside location. The private dock was a nice touch.', status: 'Published', photos: 1 },
    { id: 3, type: 'Meal', target: 'BBQ Pork Ribs', booking: 'LCS-20250115', date: 'Jan 16, 2025', rating: 5, comment: 'Best ribs I\'ve ever had! Smoky and tender.', status: 'Published', photos: 0 },
];

const pending = [
    { id: 1, type: 'Campsite', target: 'Lakefront Deluxe Tent', booking: 'LCS-20250310', checkOut: 'Mar 23, 2025' },
    { id: 2, type: 'Meal', target: 'Grilled Chicken Platter', booking: 'LCS-20250310', checkOut: 'Mar 23, 2025' },
];

export default function FeedbackSection() {
    const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [submitType, setSubmitType] = useState('');
    const [submitTarget, setSubmitTarget] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Feedback & Reviews</h2>
                <p className="text-gray-500 text-sm mt-1">Share your experience and help us improve</p>
            </div>

            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                {[
                    { id: 'submit' as const, label: 'Submit Review', icon: Star },
                    { id: 'history' as const, label: 'My Reviews', icon: MessageSquare },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'submit' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    <h3 className="font-semibold text-gray-800">Awaiting Your Review</h3>
                    {pending.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                            <CheckCircle className="w-10 h-10 text-green-300 mx-auto mb-2" />
                            <p className="text-gray-400 font-medium">All caught up!</p>
                            <p className="text-gray-300 text-xs mt-1">No pending reviews at this time.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {pending.map(item => (
                                <motion.div key={item.id} whileHover={{ y: -2 }}
                                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className={`p-2 rounded-xl ${item.type === 'Campsite' ? 'bg-green-50' : 'bg-amber-50'}`}>
                                            {item.type === 'Campsite' ? <Tent className="w-4 h-4 text-green-600" /> : <UtensilsCrossed className="w-4 h-4 text-amber-600" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{item.target}</p>
                                            <p className="text-xs text-gray-400">{item.type} · {item.booking}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-3"><Clock className="w-3 h-3 inline mr-1" />Available after check-out: {item.checkOut}</p>
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                        onClick={() => { setShowSubmitModal(true); setSubmitType(item.type); setSubmitTarget(item.target); setRating(0); setComment(''); }}
                                        className="w-full py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5">
                                        <Star className="w-3.5 h-3.5" /> Write Review
                                    </motion.button>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </motion.div>
            )}

            {activeTab === 'history' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    {myReviews.map((review, i) => (
                        <motion.div key={review.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className={`p-2 rounded-xl ${review.type === 'Campsite' ? 'bg-green-50' : 'bg-amber-50'}`}>
                                        {review.type === 'Campsite' ? <Tent className="w-4 h-4 text-green-600" /> : <UtensilsCrossed className="w-4 h-4 text-amber-600" />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{review.target}</p>
                                        <p className="text-xs text-gray-400">{review.type} · {review.date}</p>
                                    </div>
                                </div>
                                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-50 text-green-700">{review.status}</span>
                            </div>
                            <div className="flex items-center gap-0.5 mb-2">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} className={`w-4 h-4 ${s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                                ))}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                            {review.photos > 0 && (
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                    <Image className="w-3 h-3" /> {review.photos} photo{review.photos > 1 ? 's' : ''} attached
                                </div>
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Submit Review Modal */}
            <AnimatePresence>
                {showSubmitModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSubmitModal(false)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 16 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                            <div className="text-center mb-5">
                                <div className="w-14 h-14 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                    <Star className="w-7 h-7 text-amber-500" />
                                </div>
                                <h3 className="font-bold text-gray-900 text-lg">Rate & Review</h3>
                                <p className="text-gray-500 text-xs mt-1">{submitType} · {submitTarget}</p>
                            </div>
                            <div className="flex items-center justify-center gap-2 mb-5">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <motion.button key={s} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => setRating(s)} className="focus:outline-none">
                                        <Star className={`w-9 h-9 transition-colors ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                                    </motion.button>
                                ))}
                            </div>
                            <textarea rows={3} value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience..."
                                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all mb-3" />
                            <div className="flex items-center gap-2 mb-4">
                                <button className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:border-green-400 transition-colors">
                                    <Camera className="w-3.5 h-3.5" /> Add Photos
                                </button>
                                <span className="text-xs text-gray-400">Max 5 photos or 1 video</span>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowSubmitModal(false)} className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                                <button onClick={() => setShowSubmitModal(false)} disabled={rating === 0}
                                    className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 ${rating > 0 ? 'text-white bg-amber-500 hover:bg-amber-600' : 'text-gray-400 bg-gray-100 cursor-not-allowed'}`}>
                                    <Send className="w-3.5 h-3.5" /> Submit
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
