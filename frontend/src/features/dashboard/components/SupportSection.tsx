import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, HelpCircle, Phone, Mail, ChevronDown, ChevronUp, Send } from 'lucide-react';

const faqs = [
    { q: 'How do I cancel a booking?', a: 'Go to My Bookings, find your booking, and click the Cancel button. Cancellations made 48 hours before check-in are eligible for a full refund.' },
    { q: 'What payment methods do you accept?', a: 'We accept GCash, Maya, and bank transfers via BDO and BPI. Cash payment is also available on-site upon arrival.' },
    { q: 'Can I modify my booking dates?', a: 'Yes! You can request a date change by contacting us via email or chat at least 72 hours before your check-in date, subject to availability.' },
    { q: 'What should I bring to the campsite?', a: 'We recommend bringing weather-appropriate clothing, insect repellent, a flashlight, and personal hygiene items. Tents and sleeping bags are provided for glamping packages.' },
    { q: 'Is there WiFi at the campsite?', a: 'Basic WiFi is available at the main reception area. Glamping domes include in-unit WiFi. We encourage a digital detox experience at other sites!' },
];

export default function SupportSection() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [message, setMessage] = useState('');

    return (
        <div className="space-y-5 max-w-3xl">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Support</h2>
                <p className="text-gray-500 text-sm mt-1">We're here to help with any questions or concerns</p>
            </div>

            {/* Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                    { icon: MessageCircle, label: 'Live Chat', desc: 'Chat with us now', action: 'Start Chat', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
                    { icon: Mail, label: 'Email Us', desc: 'lakeside@bohol.ph', action: 'Send Email', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                    { icon: Phone, label: 'Call Us', desc: '+63 9XX XXX XXXX', action: 'Call Now', color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
                ].map(({ icon: Icon, label, desc, action, color, bg, border }, i) => (
                    <motion.div
                        key={label}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.07 }}
                        whileHover={{ y: -3 }}
                        className={`${bg} ${border} border rounded-2xl p-5 cursor-pointer hover:shadow-md transition-shadow`}
                    >
                        <div className={`p-2.5 ${bg} rounded-xl w-fit mb-3`}>
                            <Icon className={`w-5 h-5 ${color}`} />
                        </div>
                        <p className="font-semibold text-gray-800 text-sm">{label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                        <button className={`mt-3 text-xs font-semibold ${color} hover:underline`}>{action} →</button>
                    </motion.div>
                ))}
            </div>

            {/* Send a Message */}
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-green-600" /> Send Us a Message
                </h4>
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <input placeholder="Your name" className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all" />
                        <input placeholder="Subject" className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all" />
                    </div>
                    <textarea
                        rows={4}
                        placeholder="Describe your issue or question..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all"
                    />
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2 px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold transition-colors"
                    >
                        <Send className="w-4 h-4" /> Send Message
                    </motion.button>
                </div>
            </motion.div>

            {/* FAQs */}
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-green-600" />
                    <h4 className="font-semibold text-gray-800">Frequently Asked Questions</h4>
                </div>
                <div className="divide-y divide-gray-50">
                    {faqs.map((faq, i) => (
                        <div key={i} className="overflow-hidden">
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-green-50/40 transition-colors"
                            >
                                <span className="text-sm font-medium text-gray-800 pr-4">{faq.q}</span>
                                {openFaq === i
                                    ? <ChevronUp className="w-4 h-4 text-green-600 flex-shrink-0" />
                                    : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                }
                            </button>
                            {openFaq === i && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="px-5 pb-4 text-sm text-gray-600 leading-relaxed bg-green-50/30"
                                >
                                    {faq.a}
                                </motion.div>
                            )}
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
