import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Camera, Save, Edit2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export default function ProfileSection() {
    const { user } = useAuth();
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
        email: user?.email ?? '',
        phone: '+63 912 345 6789',
        address: 'Mabini, Bohol, Philippines',
        bio: 'Outdoor enthusiast and nature lover. Regular camper at Lakeside since 2023.',
    });

    const initials = `${form.firstName[0] ?? ''}${form.lastName[0] ?? ''}`.toUpperCase();

    return (
        <div className="space-y-5 max-w-3xl">
            <div>
                <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
                <p className="text-gray-500 text-sm mt-1">Manage your personal information</p>
            </div>

            {/* Avatar Card */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-gradient-to-r from-green-800 to-emerald-600 rounded-2xl p-6 text-white flex items-center gap-5"
            >
                <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-emerald-300 text-green-900 flex items-center justify-center text-3xl font-bold shadow-lg">
                        {initials}
                    </div>
                    <button className="absolute -bottom-1 -right-1 p-1.5 bg-white rounded-full shadow-md text-green-700 hover:text-green-900 transition-colors">
                        <Camera className="w-3.5 h-3.5" />
                    </button>
                </div>
                <div>
                    <h3 className="text-xl font-bold">{form.firstName} {form.lastName}</h3>
                    <p className="text-white/70 text-sm">{form.email}</p>
                    <p className="text-white/60 text-xs mt-1">Customer · Member since 2023</p>
                </div>
                <div className="ml-auto">
                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setEditing(!editing)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 border border-white/30 rounded-xl text-sm font-medium transition-colors"
                    >
                        <Edit2 className="w-4 h-4" />
                        {editing ? 'Cancel' : 'Edit Profile'}
                    </motion.button>
                </div>
            </motion.div>

            {/* Info Form */}
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5"
            >
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
                                <input
                                    value={form[key as keyof typeof form]}
                                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                                    disabled={!editing}
                                    className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm transition-all ${editing
                                        ? 'border-green-500 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30'
                                        : 'border-gray-100 bg-gray-50 text-gray-700 cursor-default'
                                        }`}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Bio</label>
                    <textarea
                        value={form.bio}
                        onChange={e => setForm({ ...form, bio: e.target.value })}
                        disabled={!editing}
                        rows={3}
                        className={`w-full px-4 py-2.5 rounded-xl border text-sm transition-all resize-none ${editing
                            ? 'border-green-500 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30'
                            : 'border-gray-100 bg-gray-50 text-gray-700 cursor-default'
                            }`}
                    />
                </div>

                {editing && (
                    <motion.button
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setEditing(false)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                    >
                        <Save className="w-4 h-4" /> Save Changes
                    </motion.button>
                )}
            </motion.div>

            {/* Account Stats */}
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="grid grid-cols-3 gap-4"
            >
                {[
                    { label: 'Total Bookings', value: '4' },
                    { label: 'Nights Camped', value: '14' },
                    { label: 'Loyalty Points', value: '1,280' },
                ].map(({ label, value }) => (
                    <div key={label} className="bg-white border border-gray-100 rounded-2xl p-4 text-center shadow-sm">
                        <p className="text-2xl font-bold text-green-700">{value}</p>
                        <p className="text-xs text-gray-500 mt-1">{label}</p>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
