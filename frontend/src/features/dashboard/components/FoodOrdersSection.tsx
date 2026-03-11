import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    UtensilsCrossed, Coffee, Search, ShoppingCart, Plus, Minus,
    Clock, CheckCircle, AlertCircle, ChefHat, Bike, Bike as Package, X
} from 'lucide-react';
import api from '../../../services/api';

const categoryIcons: Record<string, any> = {
    BREAKFAST: Coffee, LUNCH: UtensilsCrossed, DINNER: ChefHat,
    SNACK: Package, DRINK: Coffee,
};

const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-700',
    PREPARING: 'bg-blue-100 text-blue-700',
    READY: 'bg-violet-100 text-violet-700',
    DELIVERED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-gray-100 text-gray-500',
};

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const itemVariants = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export default function FoodOrdersSection() {
    const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [cart, setCart] = useState<{ item: any, quantity: number }[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [orderNotes, setOrderNotes] = useState('');
    
    // Data state
    const [menu, setMenu] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [menuRes, ordersRes] = await Promise.all([
                    api.get('/customer/meals/menu'),
                    api.get('/customer/meals/orders'),
                ]);
                setMenu(menuRes.data);
                setOrders(ordersRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const categories = ['ALL', ...Array.from(new Set(menu.map(item => item.category)))];

    const filteredMenu = menu.filter(item => {
        const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = activeCategory === 'ALL' || item.category === activeCategory;
        return matchSearch && matchCat && item.available;
    });

    const addToCart = (item: any) => {
        setCart(prev => {
            const ext = prev.find(p => p.item.id === item.id);
            if (ext) return prev.map(p => p.item.id === item.id ? { ...p, quantity: p.quantity + 1 } : p);
            return [...prev, { item, quantity: 1 }];
        });
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => {
            return prev.map(p => {
                if (p.item.id === id) {
                    const newQ = p.quantity + delta;
                    return newQ > 0 ? { ...p, quantity: newQ } : null;
                }
                return p;
            }).filter(Boolean) as any;
        });
    };

    const cartTotal = cart.reduce((sum, { item, quantity }) => sum + (Number(item.price) * quantity), 0);

    const placeOrder = async () => {
        if (cart.length === 0) return;
        try {
            const items = cart.map(c => ({ mealItemId: c.item.id, quantity: c.quantity }));
            const res = await api.post('/customer/meals/orders', { items, notes: orderNotes });
            setOrders(prev => [res.data, ...prev]);
            setCart([]);
            setIsCartOpen(false);
            setOrderNotes('');
            setActiveTab('orders');
        } catch (err) {
            console.error(err);
            alert('Failed to place order');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 relative h-full">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Food & Dining</h2>
                    <p className="text-gray-500 text-sm mt-1">Order meals directly to your campsite</p>
                </div>
                {activeTab === 'menu' && (
                    <button onClick={() => setIsCartOpen(true)}
                        className="relative flex items-center gap-2 px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm">
                        <ShoppingCart className="w-4 h-4" /> View Cart
                        {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-sm">{cart.length}</span>}
                    </button>
                )}
            </div>

            {/* ── Tabs ── */}
            <div className="flex bg-gray-100 p-1 rounded-xl w-fit">
                <button onClick={() => setActiveTab('menu')} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'menu' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    <UtensilsCrossed className="w-4 h-4" /> Menu
                </button>
                <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                    <Clock className="w-4 h-4" /> My Orders {orders.length > 0 && `(${orders.length})`}
                </button>
            </div>

            {/* ── Menu Tab ── */}
            {activeTab === 'menu' && (
                <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                            <input type="text" placeholder="Search menu..." value={search} onChange={e => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-green-500/30" />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
                            {categories.map(cat => {
                                const Icon = categoryIcons[cat] || UtensilsCrossed;
                                return (
                                    <button key={cat} onClick={() => setActiveCategory(cat)}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-green-700 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-green-400'}`}>
                                        {cat !== 'ALL' && <Icon className="w-3.5 h-3.5" />} {cat}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {filteredMenu.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                            <UtensilsCrossed className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium text-sm">No items found.</p>
                        </div>
                    ) : (
                        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {filteredMenu.map(item => (
                                <motion.div key={item.id} variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                    <div className="relative h-40 bg-gray-50">
                                        {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><UtensilsCrossed className="w-8 h-8 text-gray-300" /></div>}
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-lg text-white text-[10px] font-bold uppercase">{item.category}</div>
                                    </div>
                                    <div className="p-4 flex flex-col flex-1">
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-900 line-clamp-1">{item.name}</h3>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <p className="text-base font-bold text-green-700">₱{Number(item.price).toLocaleString()}</p>
                                            <button onClick={() => addToCart(item)} className="p-2 bg-green-50 text-green-700 hover:bg-green-700 hover:text-white rounded-xl transition-colors">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            )}

            {/* ── Orders Tab ── */}
            {activeTab === 'orders' && (
                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                            <ChefHat className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium text-sm">You haven't placed any food orders yet.</p>
                        </div>
                    ) : (
                        orders.map((order, i) => (
                            <motion.div key={order.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-gray-50">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 border-l-2 border-green-500 pl-2">Order {order.id.slice(0, 8)}</p>
                                        <p className="text-xs text-gray-400 mt-1 pl-2.5">{new Date(order.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-3 pl-2 sm:pl-0">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${statusColors[order.status] || 'bg-gray-100 text-gray-500'}`}>{order.status}</span>
                                        <p className="font-bold text-green-700">₱{Number(order.totalPrice).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {order.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-gray-700"><span className="text-gray-400 mr-2">{item.quantity}x</span>{item.name}</span>
                                            <span className="text-gray-500 font-medium">₱{(Number(item.price) * item.quantity).toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                                {order.notes && (
                                    <div className="mt-4 pt-3 border-t border-gray-50 text-xs text-amber-700 bg-amber-50 p-2 rounded-lg">
                                        <span className="font-semibold">Notes:</span> {order.notes}
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            )}

            {/* ═══════════ CART DRAWER OVERLAY ═══════════ */}
            <AnimatePresence>
                {isCartOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40" />
                        
                        {/* Drawer */}
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col">
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-white">
                                <div className="flex items-center gap-3">
                                    <ShoppingCart className="w-5 h-5 text-green-700" />
                                    <h3 className="text-lg font-bold text-gray-900">Your Order</h3>
                                </div>
                                <button onClick={() => setIsCartOpen(false)} className="p-1.5 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-5 h-5" /></button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6">
                                {cart.length === 0 ? (
                                    <div className="text-center py-16">
                                        <ShoppingCart className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                        <p className="text-gray-500 font-medium">Your cart is empty</p>
                                        <button onClick={() => setIsCartOpen(false)} className="mt-4 text-green-600 text-sm font-semibold hover:text-green-700">Browse Menu</button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {cart.map(({ item, quantity }) => (
                                            <div key={item.id} className="flex items-start gap-4 pb-4 border-b border-gray-50">
                                                {item.imageUrl ? <img src={item.imageUrl} alt="" className="w-16 h-16 rounded-xl object-cover border border-gray-100" /> : <div className="w-16 h-16 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100"><UtensilsCrossed className="w-6 h-6 text-gray-300" /></div>}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                                                    <p className="text-green-700 font-semibold text-xs mt-0.5">₱{Number(item.price).toLocaleString()}</p>
                                                </div>
                                                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-100 flex-shrink-0">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-gray-500 hover:text-red-500 hover:bg-white rounded transition-colors"><Minus className="w-3 h-3" /></button>
                                                    <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-gray-500 hover:text-green-600 hover:bg-white rounded transition-colors"><Plus className="w-3 h-3" /></button>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="pt-2">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Special Instructions</label>
                                            <textarea rows={2} value={orderNotes} onChange={e => setOrderNotes(e.target.value)} placeholder="e.g. No onions, extra spicy..."
                                                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30 transition-all" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {cart.length > 0 && (
                                <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)] pb-safe">
                                    <div className="flex justify-between items-end mb-4">
                                        <p className="text-gray-500 text-sm font-medium">Total Amount</p>
                                        <p className="text-2xl font-bold text-green-700">₱{cartTotal.toLocaleString()}</p>
                                    </div>
                                    <button onClick={placeOrder} className="w-full py-3.5 bg-green-700 hover:bg-green-800 text-white rounded-xl text-sm font-bold shadow-md transition-colors flex items-center justify-center gap-2">
                                        <CheckCircle className="w-4 h-4" /> Place Order ({cart.length} items)
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
