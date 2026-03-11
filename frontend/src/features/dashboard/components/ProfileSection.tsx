import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Phone, Camera, Save, Edit2, Lock,
    Shield, Bell, CheckCircle, AlertTriangle, X, Star, CalendarDays
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';

export default function ProfileSection() {
    const { user, login } = useAuth();
    const [editing, setEditing] = useState(false);
    const [showPwModal, setShowPwModal] = useState(false);
    const [showPwSuccess, setShowPwSuccess] = useState(false);
    
    // Data state
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Forms
    const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });
    const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' });

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get('/customer/profile');
                setProfile(res.data);
                setForm({
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    phone: res.data.phone || '',
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleSave = async () => {
        try {
            setSaving(true);
            const res = await api.put('/customer/profile', form);
            setProfile(res.data);
            setEditing(false);
            // Update auth context
            if (user) {
                const token = localStorage.getItem('token') || '';
                login(token, { ...user, firstName: res.data.firstName, lastName: res.data.lastName });
            }
        } catch (err) {
            console.error(err);
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async () => {
        if (pwForm.new !== pwForm.confirm) return alert('Passwords do not match');
        try {
            await api.put('/customer/profile/password', {
                currentPassword: pwForm.current,
                newPassword: pwForm.new,
            });
            setShowPwSuccess(true);
        } catch (err: any) {
            console.error(err);
            alert(err.response?.data?.error || 'Failed to change password');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
        </div>
    );

    const initials = profile ? `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase() : 'U';

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
                <p className="text-gray-500 text-sm mt-1">Manage your personal information and account settings</p>
            </div>

            {/* ── Avatar Card ── */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="bg-gradient-to-r from-green-800 to-emerald-600 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full" />
                <div className="relative flex-shrink-0 z-10">
                    <div className="w-20 h-20 rounded-full bg-emerald-300 text-green-900 flex items-center justify-center text-3xl font-bold border-4 border-white/20 shadow-lg relative overflow-hidden">
                        {profile?.avatarUrl ? <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : initials}
                    </div>
                </div>
                <div className="text-center sm:text-left z-10 flex-1">
                    <h3 className="text-xl font-bold">{profile.firstName} {profile.lastName}</h3>
                    <p className="text-white/70 text-sm">{profile.email}</p>
                    <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                        <span className="text-xs bg-white/15 backdrop-blur-sm border border-white/20 px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1"><Shield className="w-3 h-3" /> Customer</span>
                        <span className="text-xs bg-white/15 backdrop-blur-sm border border-white/20 px-2.5 py-0.5 rounded-full font-medium">Joined {new Date(profile.createdAt).getFullYear()}</span>
                    </div>
                </div>
                <div className="sm:ml-auto z-10">
                    <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} onClick={() => setEditing(!editing)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 rounded-xl text-sm font-medium transition-colors">
                        <Edit2 className="w-4 h-4" /> {editing ? 'Cancel' : 'Edit Profile'}
                    </motion.button>
                </div>
            </motion.div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Bookings', value: profile.bookingCount, icon: CalendarDays },
                    { label: 'Reviews Given', value: profile.reviewCount, icon: Star },
                ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center shadow-sm">
                        <div className="p-2.5 bg-green-50 rounded-xl mb-2 text-green-600"><Icon className="w-5 h-5" /></div>
                        <p className="text-xl font-bold text-gray-900">{value}</p>
                        <p className="text-xs text-gray-500 font-medium">{label}</p>
                    </div>
                ))}
            </div>

            {/* ── Personal Info ── */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
                <h4 className="font-semibold text-gray-800">Personal Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { key: 'firstName', label: 'First Name', icon: User, value: form.firstName, type: 'text' },
                        { key: 'lastName', label: 'Last Name', icon: User, value: form.lastName, type: 'text' },
                        { key: 'email', label: 'Email Address', icon: Mail, value: profile.email, type: 'email', disabled: true },
                        { key: 'phone', label: 'Phone Number', icon: Phone, value: form.phone, type: 'text' },
                    ].map(({ key, label, icon: Icon, value, type, disabled }) => (
                        <div key={key}>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
                            <div className="relative">
                                <Icon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                <input type={type} value={value} 
                                    onChange={e => !disabled && setForm({ ...form, [key]: e.target.value })} 
                                    disabled={!editing || disabled}
                                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm transition-all ${editing && !disabled
                                        ? 'border-green-500 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30'
                                        : 'border-gray-100 bg-gray-50 text-gray-500 cursor-not-allowed'}`} />
                            </div>
                        </div>
                    ))}
                </div>
                {editing && (
                    <div className="pt-2">
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving}
                            className="flex items-center justify-center gap-2 w-full md:w-auto px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed">
                            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />} 
                            {saving ? 'Saving...' : 'Save Changes'}
                        </motion.button>
                    </div>
                )}
            </motion.div>

            {/* ── Security ── */}
            <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-gray-800">Security Setting</h4>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg border border-gray-100 shadow-sm"><Lock className="w-4 h-4 text-gray-500" /></div>
                        <div><p className="text-sm font-semibold text-gray-800">Account Password</p><p className="text-xs text-gray-500">Ensure your account is using a long, random password</p></div>
                    </div>
                    <button onClick={() => { setShowPwModal(true); setShowPwSuccess(false); setPwForm({ current: '', new: '', confirm: '' }); }}
                        className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 rounded-lg transition-colors shadow-sm">Change</button>
                </div>
            </motion.div>

            {/* ═══════════ CHANGE PASSWORD MODAL ═══════════ */}
            <AnimatePresence>
                {showPwModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowPwModal(false)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
                            
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2"><Lock className="w-5 h-5 text-green-600" /> Change Password</h3>
                                <button onClick={() => setShowPwModal(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4" /></button>
                            </div>

                            {showPwSuccess ? (
                                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
                                    <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-green-500" /></div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">Password Updated</h4>
                                    <p className="text-sm text-gray-500 mb-6">Your password has been successfully changed.</p>
                                    <button onClick={() => setShowPwModal(false)} className="w-full py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold transition-colors">Done</button>
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
                                                <input type="password" value={pwForm[key]} onChange={e => setPwForm({ ...pwForm, [key]: e.target.value })}
                                                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all" />
                                            </div>
                                        </div>
                                    ))}
                                    {pwForm.new && pwForm.confirm && pwForm.new !== pwForm.confirm && (
                                        <p className="text-xs text-red-500 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Passwords do not match</p>
                                    )}
                                    <div className="flex gap-3 pt-2">
                                        <button onClick={() => setShowPwModal(false)} className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">Cancel</button>
                                        <button onClick={handlePasswordChange} disabled={!pwForm.current || !pwForm.new || pwForm.new !== pwForm.confirm}
                                            className="flex-1 py-2.5 text-sm font-semibold text-white bg-green-700 hover:bg-green-800 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                            Update Password
                                        </button>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
