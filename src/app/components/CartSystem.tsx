'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
// [1] استيراد Framer Motion للانيميشن
import { motion, AnimatePresence } from 'framer-motion';
// [2] استيراد usePathname عشان نراقب تغيير الصفحات
import { usePathname } from 'next/navigation';

// تعريف شكل المنتج
type CartItem = { 
  id: string | number; 
  name: string; 
  price: number; 
  image: string; 
  quantity: number; 
  car?: string;
};

type CartContextType = {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: any) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, delta: number) => void;
  clearCart: () => void;
  items: CartItem[];
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  
  // [3] بنجيب المسار الحالي للصفحة
  const pathname = usePathname();

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // [4] الحل النهائي: مراقبة تغيير المسار وإغلاق السلة فوراً
  useEffect(() => {
    // أول ما الرابط يتغير (مثلاً روحت الإشعارات)، اقفل السلة
    setIsOpen(false);
  }, [pathname]);

  // تحميل السلة من الذاكرة عند الفتح
  useEffect(() => {
    const savedCart = localStorage.getItem('captain-cart');
    if (savedCart) setItems(JSON.parse(savedCart));
  }, []);

  // حفظ السلة في الذاكرة عند أي تغيير
  useEffect(() => {
    localStorage.setItem('captain-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: any) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      const img = Array.isArray(product.images) ? product.images[0] : (product.image || '/pp/Filters.jpeg');
      
      return [...prev, { 
        id: product.id, 
        name: product.name, 
        price: product.price, 
        image: img,
        quantity: 1,
        car: product.car
      }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (id: string | number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string | number, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]); 
    localStorage.removeItem('captain-cart'); 
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ isOpen, openCart, closeCart, addToCart, removeFromCart, updateQuantity, clearCart, items, total }}>
      {children}
      
      {/* استخدام AnimatePresence عشان نشغل أنيميشن الخروج والدخول */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end font-sans" dir="rtl">
            {/* الخلفية المعتمة (Fade In/Out) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              onClick={closeCart}
            ></motion.div>
            
            {/* السلة نفسها (Slide In from Left) */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white z-10 shadow-sm">
                <h2 className="font-black text-xl text-[#001d3d] flex items-center gap-2">
                  <ShoppingBag size={20} className="text-[#e31e24]" /> سلتك <span className="text-sm font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full">({items.length})</span>
                </h2>
                <button onClick={closeCart} className="w-9 h-9 bg-gray-50 rounded-full flex items-center justify-center hover:bg-[#e31e24] hover:text-white transition-all">
                  <X size={18} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#f8fafc]">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4 opacity-60">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                      <ShoppingBag size={32} />
                    </div>
                    <p className="font-bold text-lg">السلة فارغة</p>
                    <button onClick={closeCart} className="text-sm font-bold text-[#e31e24] hover:underline">ابدأ التسوق الآن</button>
                  </div>
                ) : (
                  items.map(item => (
                    <div key={item.id} className="flex gap-4 p-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                      <div className="w-20 h-20 bg-gray-50 rounded-xl relative overflow-hidden shrink-0 border border-gray-100">
                        <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                          <h3 className="font-bold text-sm text-[#001d3d] line-clamp-1">{item.name}</h3>
                          {item.car && <p className="text-[10px] text-gray-400 font-bold mt-0.5">{item.car}</p>}
                        </div>
                        <div className="flex items-end justify-between mt-2">
                          <span className="text-sm font-black text-[#001d3d]">{item.price.toLocaleString('en-US')} ج.م</span>
                          
                          <div className="flex items-center gap-3">
                             <div className="flex items-center bg-gray-50 rounded-lg px-1 h-7 border border-gray-200">
                                <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-full flex items-center justify-center hover:text-[#e31e24]"><Plus size={12} /></button>
                                <span className="font-bold text-xs w-4 text-center">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-full flex items-center justify-center hover:text-[#e31e24]"><Minus size={12} /></button>
                             </div>
                             <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 bg-red-50 text-red-500 rounded-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors">
                               <Trash2 size={14} />
                             </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-5 border-t border-gray-200 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-gray-500 text-sm">الإجمالي النهائي</span>
                    <span className="font-black text-2xl text-[#001d3d]">{total.toLocaleString('en-US')} <span className="text-sm text-gray-400">ج.م</span></span>
                  </div>
                  
                  <Link 
                    href="/checkout" 
                    onClick={closeCart} 
                    className="w-full h-12 bg-[#001d3d] hover:bg-[#e31e24] text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2 group"
                  >
                    <span>إتمام الشراء</span>
                    <ArrowRight size={16} className="group-hover:-translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  );
};