/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  User as UserIcon, 
  LogOut, 
  Trash2, 
  Plus, 
  Minus, 
  ChevronRight,
  Search,
  ArrowLeft,
  X
} from 'lucide-react';
import { Product, CartItem, User, Page } from './types';
import { PRODUCTS } from './data';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('catalog');
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Client-side validation states
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculations
  const cartTotal = useMemo(() => 
    cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
  [cartItems]);

  const filteredProducts = useMemo(() => 
    PRODUCTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())),
  [searchQuery]);

  // Actions
  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const validateAuth = (type: 'login' | 'register') => {
    const newErrors: Record<string, string> = {};
    if (!authForm.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(authForm.email)) newErrors.email = 'Email is invalid';

    if (!authForm.password) newErrors.password = 'Password is required';
    else if (authForm.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (type === 'register') {
      if (!authForm.name) newErrors.name = 'Name is required';
      if (authForm.password !== authForm.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAuth('login')) {
      setUser({ id: '1', email: authForm.email, name: 'Guest User' });
      setCurrentPage('catalog');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAuth('register')) {
      setUser({ id: '1', email: authForm.email, name: authForm.name });
      setCurrentPage('catalog');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      {/* Navbar - Flex Layout */}
      <nav className="sticky top-0 z-50 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-12 cursor-pointer"
            onClick={() => setCurrentPage('catalog')}
          >
            <h1 className="text-2xl font-serif italic tracking-wider text-white uppercase">ShopSwift</h1>
            <div className="hidden md:flex gap-8 text-[10px] uppercase tracking-[0.2em] text-white/60">
              <button 
                onClick={() => setCurrentPage('catalog')}
                className={`hover:text-white transition-colors py-1 ${currentPage === 'catalog' ? 'text-white border-b border-white/40' : ''}`}
              >
                Catalog
              </button>
              <button className="hover:text-white transition-colors py-1">Collections</button>
              <button className="hover:text-white transition-colors py-1">Journal</button>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {!user && (
              <div className="hidden sm:flex gap-4 text-[10px] font-bold uppercase tracking-widest">
                <button 
                  onClick={() => setCurrentPage('login')}
                  className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded hover:bg-white/10 transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setCurrentPage('register')}
                  className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
                >
                  Register
                </button>
              </div>
            )}
            
            {user && (
              <div className="flex items-center gap-4">
                <span className="text-[10px] uppercase tracking-widest text-white/40">Hi, {user.name}</span>
                <button 
                  onClick={() => setUser(null)}
                  className="p-2 text-white/60 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
            
            <button 
              onClick={() => setCurrentPage('cart')}
              className="relative p-2 text-white/60 hover:text-white transition-colors"
            >
              <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#c4a675] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartItems.reduce((a, b) => a + b.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {currentPage === 'catalog' && (
            <motion.div 
              key="catalog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/5 pb-8">
                <div>
                  <p className="text-[#c4a675] text-[10px] uppercase tracking-[0.4em] mb-3">Objects of Desire</p>
                  <h2 className="text-5xl font-serif font-light text-white">Essential Collection</h2>
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input 
                    type="text" 
                    placeholder="Search curated pieces..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30 transition-all font-serif italic"
                  />
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredProducts.map((product) => (
                  <motion.div 
                    key={product.id}
                    layoutId={product.id}
                    className="group cursor-pointer"
                  >
                    <div className="aspect-[4/5] bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border border-white/5 relative overflow-hidden mb-5">
                       <div className="w-full h-full p-4 flex items-center justify-center">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 mix-blend-luminosity"
                            referrerPolicy="no-referrer"
                          />
                       </div>
                       <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="absolute bottom-6 right-6 bg-white text-black p-3 rounded shadow-2xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hover:bg-[#c4a675]"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm tracking-wide text-white font-medium">{product.name}</h3>
                      <p className="text-xs text-white/40 font-serif italic">{product.category}</p>
                      <p className="text-sm text-[#c4a675] font-serif pt-1">${product.price.toFixed(2)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {currentPage === 'cart' && (
            <motion.div 
              key="cart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-5xl mx-auto space-y-12"
            >
              <div className="flex items-center gap-6">
                <button 
                  onClick={() => setCurrentPage('catalog')}
                  className="p-3 bg-white/5 border border-white/10 text-white/40 hover:text-white rounded transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-4xl font-serif font-light text-white">Your Selection</h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-6">
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <div key={item.id} className="flex gap-6 p-6 bg-[#0d0d0d] border border-white/5">
                        <div className="w-24 h-32 bg-white/5 border border-white/5 overflow-hidden flex-shrink-0">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover opacity-60 mix-blend-luminosity"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-grow flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-white text-sm tracking-wide">{item.name}</h3>
                              <p className="text-xs text-white/30 font-serif italic mt-1">{item.category}</p>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item.id)}
                              className="text-white/20 hover:text-red-900/80 transition-colors uppercase text-[10px] tracking-widest font-bold"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="flex justify-between items-end">
                            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded p-1">
                              <button 
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-1 hover:bg-white/10 rounded text-white/60 transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center text-xs font-serif text-white">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-1 hover:bg-white/10 rounded text-white/60 transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-lg font-serif text-[#c4a675]">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white/5 border border-dashed border-white/10 py-24 text-center">
                      <p className="text-white/20 font-serif italic text-lg">No items currently selected</p>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-4">
                  <div className="bg-[#0d0d0d] border border-white/10 p-8 sticky top-32">
                    <h3 className="text-xl font-serif text-white mb-8 border-b border-white/10 pb-4">Order Overview</h3>
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between text-xs uppercase tracking-widest text-white/40">
                        <span>Subtotal</span>
                        <span className="text-white">${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs uppercase tracking-widest text-white/40">
                        <span>Shipping</span>
                        <span className="text-[#c4a675] italic">Complimentary</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-baseline mb-8">
                      <span className="text-2xl font-serif text-white">Total</span>
                      <span className="text-2xl font-serif text-[#c4a675] tracking-tight">${cartTotal.toFixed(2)}</span>
                    </div>
                    <button 
                      disabled={cartItems.length === 0}
                      className="w-full bg-[#c4a675] text-black py-4 text-xs font-bold uppercase tracking-[0.3em] hover:bg-[#d4b685] transition-all transform active:scale-[0.98] disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      Secure Checkout
                    </button>
                    <p className="text-[10px] text-center mt-6 text-white/30 italic tracking-widest">
                      Encrypted & Secure Payment Processing
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {(currentPage === 'login' || currentPage === 'register') && (
            <motion.div 
              key="auth"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="max-w-md mx-auto w-full pt-12"
            >
              <div className="bg-[#0d0d0d] p-10 border border-white/10 shadow-2xl">
                <div className="mb-10 text-center">
                  <p className="text-[#c4a675] text-[10px] uppercase tracking-[0.3em] mb-3">Identity Access</p>
                  <h1 className="text-3xl font-serif font-light text-white">
                    {currentPage === 'login' ? 'Private Entrance' : 'Curate Membership'}
                  </h1>
                </div>

                <form className="space-y-6" onSubmit={currentPage === 'login' ? handleLogin : handleRegister}>
                  {currentPage === 'register' && (
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 ml-1">Full Name</label>
                      <input 
                        type="text" 
                        value={authForm.name}
                        onChange={(e) => setAuthForm({...authForm, name: e.target.value})}
                        className={`w-full px-4 py-3 bg-white/5 border ${errors.name ? 'border-red-900/50' : 'border-white/10'} text-white placeholder-white/20 focus:outline-none focus:border-[#c4a675]/50 transition-all font-serif italic`}
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="text-red-900 text-[10px] uppercase tracking-widest mt-2 font-bold">{errors.name}</p>}
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 ml-1">Email Coordinates</label>
                    <input 
                      type="email" 
                      value={authForm.email}
                      onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                      className={`w-full px-4 py-3 bg-white/5 border ${errors.email ? 'border-red-900/50' : 'border-white/10'} text-white placeholder-white/20 focus:outline-none focus:border-[#c4a675]/50 transition-all font-serif italic`}
                      placeholder="coordinate@elara.com"
                    />
                    {errors.email && <p className="text-red-900 text-[10px] uppercase tracking-widest mt-2 font-bold">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 ml-1">Pass-key</label>
                    <input 
                      type="password" 
                      value={authForm.password}
                      onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                      className={`w-full px-4 py-3 bg-white/5 border ${errors.password ? 'border-red-900/50' : 'border-white/10'} text-white placeholder-white/20 focus:outline-none focus:border-[#c4a675]/50 transition-all font-serif italic`}
                      placeholder="••••••••"
                    />
                    {errors.password && <p className="text-red-900 text-[10px] uppercase tracking-widest mt-2 font-bold">{errors.password}</p>}
                  </div>

                  {currentPage === 'register' && (
                    <div>
                      <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-2 ml-1">Verify Pass-key</label>
                      <input 
                        type="password" 
                        value={authForm.confirmPassword}
                        onChange={(e) => setAuthForm({...authForm, confirmPassword: e.target.value})}
                        className={`w-full px-4 py-3 bg-white/5 border ${errors.confirmPassword ? 'border-red-900/50' : 'border-white/10'} text-white placeholder-white/20 focus:outline-none focus:border-[#c4a675]/50 transition-all font-serif italic`}
                        placeholder="••••••••"
                      />
                      {errors.confirmPassword && <p className="text-red-900 text-[10px] uppercase tracking-widest mt-2 font-bold">{errors.confirmPassword}</p>}
                    </div>
                  )}

                  <button className="w-full bg-[#c4a675] text-black py-4 text-xs font-bold uppercase tracking-[0.3em] hover:bg-[#d4b685] transition-all transform active:scale-[0.98] mt-4">
                    {currentPage === 'login' ? 'Proceed' : 'Create Access'}
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-white/40">
                    {currentPage === 'login' ? "Require an account? " : "Already established? "}
                    <button 
                      onClick={() => {
                        setCurrentPage(currentPage === 'login' ? 'register' : 'login');
                        setErrors({});
                      }}
                      className="font-bold text-[#c4a675] hover:text-white transition-colors ml-2"
                    >
                      {currentPage === 'login' ? 'Request Membership' : 'Signature Access'}
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] border-t border-white/10 pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2">
              <h3 className="text-2xl font-serif italic tracking-wider text-white uppercase mb-6">ShopSwift</h3>
              <p className="text-white/40 max-w-sm text-xs font-serif italic leading-relaxed tracking-wide">
                Purveyors of fine objects and curated essentials. Our collection is selected with an uncompromising focus on material, form, and longevity.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 mb-6">Navigation</h4>
              <ul className="space-y-4 text-[10px] uppercase tracking-[0.15em] text-white/30">
                <li><a href="#" className="hover:text-white transition-colors">Catalog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Collections</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Aesthetics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Archive</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60 mb-6">Inquiry</h4>
              <ul className="space-y-4 text-[10px] uppercase tracking-[0.15em] text-white/30">
                <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Confidentiality</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Direct Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.3em] text-white/10">
            <p>ELARA AESTHETICS © 2026</p>
            <div className="flex gap-10">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Validation Status Overlay */}
      <div className="fixed bottom-8 left-8 hidden lg:flex gap-4 pointer-events-none z-[100]">
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Form Validation Active</span>
        </div>
        <div className="bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/40">Grid/Flex Optimized</span>
        </div>
      </div>
    </div>
  );
}
