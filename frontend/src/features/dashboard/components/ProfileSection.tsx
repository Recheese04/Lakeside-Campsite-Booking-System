import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Camera, Save, Edit2, Lock,
    Shield, Bell, BellOff, Eye, EyeOff, AlertTriangle, CheckCircle, X, Trash2
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function ProfileSection() {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [showPwModal, setShowPwModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPwSuccess, setShowPwSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState({ current: false, new: false, confirm: false });
    const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' });

    const [form, setForm] = useState({
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
        email: user?.email ?? '',
        phone: '+63 912 345 6789',
        address: 'Mabini, Bohol, Philippines',
        bio: 'Outdoor enthusiast and nature lover. Regular camper at Lakeside since 2023.',
    });

    const [notifPrefs, setNotifPrefs] = useState({
        bookingUpdates: true,
        promotions: false,
        reminders: true,
        newsletter: false,
        smsAlerts: true,
    });

    const initials = `${form.firstName[0] ?? ''}${form.lastName[0] ?? ''}`.toUpperCase();

    const toggleNotif = (key: keyof typeof notifPrefs) => {
        setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
                <p className="text-gray-500 text-sm mt-1">Manage your personal information and preferences</p>
            </div>

            {/* ── Avatar Card ── */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="bg-gradient-to-r from-green-800 to-emerald-600 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />
                <div className="relative flex-shrink-0 z-10">
                    <div className="w-20 h-20 rounded-full bg-emerald-300 text-green-900 flex items-center justify-center text-3xl font-bold shadow-lg">{initials}</div>
                    <button className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-full shadow-md text-green-700 hover:text-green-900 transition-colors"><Camera className="w-3.5 h-3.5" /></button>
                </div>
                <div className="text-center sm:text-left z-10">
                    <h3 className="text-xl font-bold">{form.firstName} {form.lastName}</h3>
                    <p className="text-white/70 text-sm">{form.email}</p>
                    <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                        <span className="text-xs bg-white/15 border border-white/20 px-2.5 py-0.5 rounded-full font-medium">Customer</span>
                        <span className="text-xs bg-white/15 border border-white/20 px-2.5 py-0.5 rounded-full font-medium">Member since 2023</span>
                        <span className="text-xs bg-emerald-400/25 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1"><Shield className="w-3 h-3" /> Verified</span>
                    </div>
                </div>
                <div className="sm:ml-auto z-10 flex gap-2">
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setEditing(!editing)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl text-sm font-medium transition-colors">
                        <Edit2 className="w-4 h-4" /> {editing ? 'Cancel' : 'Edit'}
                    </motion.button>
                </div>
            </motion.div>

            {/* ── Personal Info ── */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <h4 className="font-semibold text-gray-800">Personal Information</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { key: 'firstName', label: 'First Name', icon: User },
                        { key: 'lastName', label: 'Last Name', icon: User },
                        { key: 'email', label: 'Email Address', icon: Mail },
                        { key: 'phone', label: 'Phone Number', icon: Phone },
                        { key: 'address', label: 'Location', icon: MapPin },
                    ].map(({ key, label, icon: Icon }) => (
                        <div key={key} className={key === 'address' ? 'sm:col-span-2' : ''}>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
                            <div className="relative">
                                <Icon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input value={form[key as keyof typeof form]} onChange={e => setForm({ ...form, [key]: e.target.value })} disabled={!editing}
                                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm transition-all ${editing
                                        ? 'border-green-500 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30'
                                        : 'border-gray-100 bg-gray-50 text-gray-700 cursor-default'}`} />
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Bio</label>
                    <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} disabled={!editing} rows={3}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all resize-none ${editing
                            ? 'border-green-500 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30'
                            : 'border-gray-100 bg-gray-50 text-gray-700 cursor-default'}`} />
                </div>
                {editing && (
                    <motion.button initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setEditing(false)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                        <Save className="w-4 h-4" /> Save Changes
                    </motion.button>
                )}
            </motion.div>

            {/* ── Notification Preferences ── */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                    <Bell className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-gray-800">Notification Preferences</h4>
                </div>
                <div className="space-y-3">
                    {[
                        { key: 'bookingUpdates' as const, label: 'Booking Updates', desc: 'Approval, cancellation, and status changes', icon: CheckCircle },
                        { key: 'reminders' as const, label: 'Check-in Reminders', desc: 'Alerts before your scheduled stay', icon: Bell },
                        { key: 'smsAlerts' as const, label: 'SMS Alerts', desc: 'Receive text messages for important updates', icon: Phone },
                        { key: 'promotions' as const, label: 'Promotions & Deals', desc: 'Special offers and seasonal discounts', icon: Mail },
                        { key: 'newsletter' as const, label: 'Newsletter', desc: 'Monthly newsletter with tips & events', icon: Mail },
                    ].map(({ key, label, desc, icon: Icon }) => (
                        <div key={key} className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-xl hover:bg-green-50/30 transition-colors">
                            <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4 text-gray-400" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{label}</p>
                                    <p className="text-xs text-gray-400">{desc}</p>
                                </div>
                            </div>
                            <button onClick={() => toggleNotif(key)}
                                className={`relative w-11 h-6 rounded-full transition-colors ${notifPrefs[key] ? 'bg-green-600' : 'bg-gray-300'}`}>
                                <motion.div layout className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm ${notifPrefs[key] ? 'left-[22px]' : 'left-0.5'}`}
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                            </button>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ── Security ── */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-gray-800">Security</h4>
                </div>
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <Lock className="w-4 h-4 text-gray-400" />
                            <div><p className="text-sm font-semibold text-gray-800">Password</p><p className="text-xs text-gray-400">Last changed 30 days ago</p></div>
                        </div>
                        <button onClick={() => { setShowPwModal(true); setShowPwSuccess(false); setPwForm({ current: '', new: '', confirm: '' }); }}
                            className="text-sm font-semibold text-green-700 hover:text-green-800 transition-colors">Change</button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <Shield className="w-4 h-4 text-gray-400" />
                            <div><p className="text-sm font-semibold text-gray-800">Two-Factor Authentication</p><p className="text-xs text-gray-400">Add an extra layer of security</p></div>
                        </div>
                        <button className="text-sm font-semibold text-green-700 hover:text-green-800 transition-colors">Enable</button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-xl">
                        <div className="flex items-center gap-3">
                            <Trash2 className="w-4 h-4 text-red-400" />
                            <div><p className="text-sm font-semibold text-red-700">Delete Account</p><p className="text-xs text-red-400">Permanently remove your account and data</p></div>
                        </div>
                        <button onClick={() => setShowDeleteModal(true)} className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors">Delete</button>
                    </div>
                </div>
            </motion.div>

            {/* ── Stats ── */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total Bookings', value: '5' }, { label: 'Nights Camped', value: '14' },
                    { label: 'Loyalty Points', value: '1,280' }, { label: 'Reviews Given', value: '2' },
                ].map(({ label, value }) => (
                    <div key={label} className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
                        <p className="text-2xl font-bold text-green-700">{value}</p>
                        <p className="text-xs text-gray-500 mt-1">{label}</p>
                    </div>
                ))}
            </motion.div>

            {/* ═══════════ CHANGE PASSWORD MODAL ═══════════ */}
            <AnimatePresence>
                {showPwModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPwModal(false)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-green-50 rounded-xl"><Lock className="w-5 h-5 text-green-600" /></div>
                                    <h3 className="font-bold text-gray-900">Change Password</h3>
                                </div>
                                <button onClick={() => setShowPwModal(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
                            </div>

                            {showPwSuccess ? (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-500" /></div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-1">Password Updated!</h4>
                                    <p className="text-sm text-gray-500 mb-5">Your password has been changed successfully.</p>
                                    <button onClick={() => setShowPwModal(false)} className="px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold transition-colors">Done</button>
                                </motion.div>
                            ) : (
                                <div className="space-y-4">
                                    {[
                                        { key: 'current' as const, label: 'Current Password' },
                                        { key: 'new' as const, label: 'New Password' },
                                        { key: 'confirm' as const, label: 'Confirm New Password' },
                                    ].map(({ key, label }) => (
                                        <div key={key}>
                                            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">{label}</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                                <input type={showPassword[key] ? 'text' : 'password'} value={pwForm[key]}
                                                    onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })} placeholder="••••••••"
                                                    className="w-full pl-9 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all" />
                                                <button type="button" onClick={() => setShowPassword(p => ({ ...p, [key]: !p[key] }))}
                                                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                                                    {showPassword[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {pwForm.new && pwForm.confirm && pwForm.new !== pwForm.confirm && (
                                        <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Passwords do not match</p>
                                    )}
                                    <div className="flex gap-3 pt-1">
                                        <button onClick={() => setShowPwModal(false)} className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                                        <button onClick={() => setShowPwSuccess(true)} disabled={!pwForm.current || !pwForm.new || pwForm.new !== pwForm.confirm}
                                            className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-colors ${pwForm.current && pwForm.new && pwForm.new === pwForm.confirm
                                                ? 'text-white bg-green-700 hover:bg-green-800' : 'text-gray-400 bg-gray-100 cursor-not-allowed'}`}>
                                            Update Password
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ═══════════ DELETE ACCOUNT MODAL ═══════════ */}
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowDeleteModal(false)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                            <div className="text-center mb-5">
                                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle className="w-8 h-8 text-red-500" /></div>
                                <h3 className="font-bold text-gray-900 text-lg">Delete Your Account?</h3>
                                <p className="text-sm text-gray-500 mt-2">This action is <span className="font-semibold text-red-600">permanent</span> and cannot be undone. All your bookings, payment history, loyalty points, and personal data will be erased.</p>
                            </div>
                            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-5 space-y-1 text-xs text-red-700">
                                <p>• All active bookings will be cancelled</p>
                                <p>• 1,280 loyalty points will be forfeited</p>
                                <p>• Payment history will be permanently deleted</p>
                                <p>• You will not be able to recover this account</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeleteModal(false)}
                                    className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Keep Account</button>
                                <button className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                                    <Trash2 className="w-3.5 h-3.5" /> Delete Forever
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
