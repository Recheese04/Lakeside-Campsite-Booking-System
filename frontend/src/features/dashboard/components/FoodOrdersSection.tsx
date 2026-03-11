import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UtensilsCrossed, Search, Clock, CheckCircle, ShoppingCart,
    Plus, Minus, X, ChefHat, Coffee, Sandwich, IceCream,
    Flame, Star, Filter, Timer, Package
} from 'lucide-react';

/* ───────── MOCK DATA ───────── */
const menuCategories = ['All', 'Meals', 'Snacks', 'Drinks', 'Desserts'];

const menuItems = [
    { id: 1, name: 'Grilled Chicken Platter', category: 'Meals', price: 350, rating: 4.8, image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=400&q=80', description: 'Juicy grilled chicken with steamed rice and fresh vegetables', popular: true, available: true },
    { id: 2, name: 'BBQ Pork Ribs', category: 'Meals', price: 450, rating: 4.9, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80', description: 'Slow-cooked pork ribs with smoky BBQ glaze', popular: true, available: true },
    { id: 3, name: 'Campfire Nachos', category: 'Snacks', price: 180, rating: 4.5, image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=400&q=80', description: 'Crispy nachos with melted cheese, jalapeños and salsa', popular: false, available: true },
    { id: 4, name: 'Fresh Fruit Smoothie', category: 'Drinks', price: 120, rating: 4.6, image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=400&q=80', description: 'Blended mango, banana, and pineapple', popular: false, available: true },
    { id: 5, name: 'Iced Coffee', category: 'Drinks', price: 90, rating: 4.7, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=400&q=80', description: 'Cold brew coffee with cream and caramel drizzle', popular: true, available: true },
    { id: 6, name: 'S\'mores Platter', category: 'Desserts', price: 200, rating: 4.8, image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=400&q=80', description: 'Classic campfire s\'mores with chocolate and marshmallows', popular: true, available: true },
    { id: 7, name: 'Trail Mix Bowl', category: 'Snacks', price: 100, rating: 4.3, image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=400&q=80', description: 'Nuts, dried fruits, and dark chocolate chunks', popular: false, available: true },
    { id: 8, name: 'Lakeside Fish & Chips', category: 'Meals', price: 320, rating: 4.7, image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=400&q=80', description: 'Crispy battered fish with seasoned fries', popular: false, available: false },
];

const myOrders = [
    { id: 'ORD-001', items: ['Grilled Chicken Platter', 'Iced Coffee'], total: '₱440', status: 'Preparing', time: 'Ordered 15 min ago', deliveryTime: '12:30 PM' },
    { id: 'ORD-002', items: ['S\'mores Platter x2'], total: '₱400', status: 'Delivered', time: 'Ordered 2 hours ago', deliveryTime: '10:00 AM' },
    { id: 'ORD-003', items: ['BBQ Pork Ribs', 'Fresh Fruit Smoothie', 'Campfire Nachos'], total: '₱750', status: 'Delivered', time: 'Yesterday', deliveryTime: '6:30 PM' },
];

const statusColors: Record<string, { bg: string; text: string; icon: typeof Clock }> = {
    Preparing: { bg: 'bg-amber-50', text: 'text-amber-700', icon: Clock },
    Delivered: { bg: 'bg-green-50', text: 'text-green-700', icon: CheckCircle },
};

const categoryIcons: Record<string, typeof UtensilsCrossed> = {
    All: UtensilsCrossed,
    Meals: ChefHat,
    Snacks: Sandwich,
    Drinks: Coffee,
    Desserts: IceCream,
};

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } } };

/* ───────── COMPONENT ───────── */
export default function FoodOrdersSection() {
    const [activeTab, setActiveTab] = useState<'menu' | 'orders' | 'preorder'>('menu');
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState<Record<number, number>>({});
    const [showCart, setShowCart] = useState(false);

    const filteredMenu = menuItems.filter(item => {
        const matchCat = activeCategory === 'All' || item.category === activeCategory;
        const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCat && matchSearch;
    });

    const cartItems = Object.entries(cart).filter(([, qty]) => qty > 0);
    const cartTotal = cartItems.reduce((sum, [id, qty]) => {
        const item = menuItems.find(m => m.id === Number(id));
        return sum + (item ? item.price * qty : 0);
    }, 0);

    const updateCart = (id: number, delta: number) => {
        setCart(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + delta) }));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Mini-Restaurant</h2>
                    <p className="text-gray-500 text-sm mt-1">Order delicious meals delivered to your campsite</p>
                </div>
                {cartItems.length > 0 && (
                    <motion.button
                        whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                        onClick={() => setShowCart(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold shadow-sm transition-colors"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Cart ({cartItems.length})
                        <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">₱{cartTotal.toLocaleString()}</span>
                    </motion.button>
                )}
            </div>

            {/* ── Tabs ── */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
                {[
                    { id: 'menu' as const, label: 'View Menu', icon: UtensilsCrossed },
                    { id: 'orders' as const, label: 'My Orders', icon: Package },
                    { id: 'preorder' as const, label: 'Pre-order', icon: Timer },
                ].map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Menu Tab ── */}
            {activeTab === 'menu' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                    {/* Search & Filters */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder="Search menu items..." value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500 transition-all" />
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                            {menuCategories.map(cat => {
                                const CatIcon = categoryIcons[cat];
                                return (
                                    <button key={cat} onClick={() => setActiveCategory(cat)}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${activeCategory === cat
                                            ? 'bg-green-700 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-600 hover:border-green-400'}`}>
                                        <CatIcon className="w-3 h-3" /> {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Menu Grid */}
                    <motion.div variants={containerVariants} initial="hidden" animate="show"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredMenu.map(item => (
                            <motion.div key={item.id} variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow ${!item.available ? 'opacity-60' : ''}`}>
                                <div className="relative h-36 overflow-hidden">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    {item.popular && (
                                        <span className="absolute top-2 left-2 flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                            <Flame className="w-2.5 h-2.5" /> Popular
                                        </span>
                                    )}
                                    {!item.available && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <span className="text-white text-sm font-bold bg-black/50 px-3 py-1 rounded-full">Unavailable</span>
                                        </div>
                                    )}
                                    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> {item.rating}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-semibold text-gray-800 text-sm">{item.name}</h4>
                                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{item.description}</p>
                                    <div className="flex items-center justify-between mt-3">
                                        <p className="text-lg font-bold text-green-700">₱{item.price}</p>
                                        {item.available && (
                                            <div className="flex items-center gap-1.5">
                                                {(cart[item.id] || 0) > 0 && (
                                                    <>
                                                        <button onClick={() => updateCart(item.id, -1)}
                                                            className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-sm font-bold text-gray-800 w-5 text-center">{cart[item.id]}</span>
                                                    </>
                                                )}
                                                <button onClick={() => updateCart(item.id, 1)}
                                                    className="w-7 h-7 flex items-center justify-center bg-green-700 hover:bg-green-800 text-white rounded-lg transition-colors">
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            )}

            {/* ── Orders Tab ── */}
            {activeTab === 'orders' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                    {myOrders.map((order, i) => {
                        const statusInfo = statusColors[order.status];
                        const StatusIcon = statusInfo.icon;
                        return (
                            <motion.div key={order.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.06 }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-mono text-xs text-gray-400 font-semibold">{order.id}</p>
                                            <span className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusInfo.bg} ${statusInfo.text}`}>
                                                <StatusIcon className="w-3 h-3" /> {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{order.time}</p>
                                    </div>
                                    <p className="text-lg font-bold text-green-700">{order.total}</p>
                                </div>
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                    {order.items.map((item, j) => (
                                        <span key={j} className="text-xs bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full text-gray-600">{item}</span>
                                    ))}
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-400">
                                    <span className="flex items-center gap-1"><Timer className="w-3 h-3" /> Delivery: {order.deliveryTime}</span>
                                    <button className="text-green-700 font-semibold hover:text-green-800">Reorder →</button>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            {/* ── Pre-order Tab ── */}
            {activeTab === 'preorder' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-5">
                        <div className="p-2.5 bg-green-50 rounded-xl"><Timer className="w-5 h-5 text-green-600" /></div>
                        <div>
                            <h3 className="font-bold text-gray-900">Pre-order for Your Booking</h3>
                            <p className="text-sm text-gray-500">Add meals to your upcoming campsite booking</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Select Booking</label>
                            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500">
                                <option>LCS-20250310 · Lakefront Deluxe Tent · Mar 20–23</option>
                                <option>LCS-20250402 · Premium Glamping Dome · Apr 5–8</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Delivery Date</label>
                                <input type="date" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500" />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Delivery Time</label>
                                <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500">
                                    <option>7:00 AM – Breakfast</option>
                                    <option>12:00 PM – Lunch</option>
                                    <option>6:00 PM – Dinner</option>
                                    <option>8:00 PM – Late Snacks</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Special Instructions</label>
                            <textarea rows={3} placeholder="Any allergies or dietary preferences? Let us know..."
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500" />
                        </div>
                        <p className="text-xs text-gray-400">💡 Browse the menu tab to add items to your cart, then come back here to assign them to a booking.</p>
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                            className="flex items-center gap-2 px-6 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold transition-colors">
                            <ShoppingCart className="w-4 h-4" /> Save Pre-order
                        </motion.button>
                    </div>
                </motion.div>
            )}

            {/* ═══════════ CART DRAWER ═══════════ */}
            <AnimatePresence>
                {showCart && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end" onClick={() => setShowCart(false)}>
                        <motion.div initial={{ x: 380 }} animate={{ x: 0 }} exit={{ x: 380 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="bg-white w-full max-w-sm h-full shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5 text-green-700" />
                                    <h3 className="font-bold text-gray-800">Your Cart</h3>
                                    <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-semibold">{cartItems.length} items</span>
                                </div>
                                <button onClick={() => setShowCart(false)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-4 h-4" /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto divide-y divide-gray-50 p-5 space-y-3">
                                {cartItems.map(([id, qty]) => {
                                    const item = menuItems.find(m => m.id === Number(id));
                                    if (!item) return null;
                                    return (
                                        <div key={id} className="flex items-center gap-3 py-3">
                                            <img src={item.image} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                                                <p className="text-xs text-gray-400">₱{item.price} each</p>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <button onClick={() => updateCart(item.id, -1)} className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"><Minus className="w-3 h-3" /></button>
                                                <span className="text-sm font-bold w-5 text-center">{qty}</span>
                                                <button onClick={() => updateCart(item.id, 1)} className="w-7 h-7 flex items-center justify-center bg-green-700 hover:bg-green-800 text-white rounded-lg transition-colors"><Plus className="w-3 h-3" /></button>
                                            </div>
                                            <p className="text-sm font-bold text-green-700 w-16 text-right">₱{(item.price * qty).toLocaleString()}</p>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="p-5 border-t border-gray-100 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-600">Total</span>
                                    <span className="text-xl font-bold text-green-700">₱{cartTotal.toLocaleString()}</span>
                                </div>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                    className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> Place Order
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
