'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, Trash2, ArrowRight, Star, AlertCircle, 
  Home, ChevronDown, Check, Settings2, Package, Sparkles, Percent, Heart
} from 'lucide-react';
import { useCart } from '../components/CartSystem';

// ==================================================================================
// 1. WISHLIST PRODUCT CARD
// ==================================================================================

const WishlistCard = ({ product, onRemove, onAddToCart }: any) => {
  const { id, name, price, oldPrice, image, discount, rating, badge, category } = product;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#001d3d] hover:shadow-xl transition-all duration-300 relative flex flex-col h-full"
    >
      
      {/* 1. بادجات الخصم أو التمييز */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1">
        {badge && (
          <span className="flex items-center gap-1 bg-[#e31e24] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
            <Sparkles size={10} /> {badge}
          </span>
        )}
        {discount > 0 && (
          <span className="flex items-center gap-1 bg-[#001d3d] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md">
            <Percent size={10} /> وفر {discount}%
          </span>
        )}
      </div>

      {/* 2. زر الحذف */}
      <button 
        onClick={() => onRemove(id)}
        className="absolute top-3 left-3 z-20 w-8 h-8 bg-white/90 backdrop-blur border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
        title="حذف من المفضلة"
      >
        <Trash2 size={14} />
      </button>

      {/* 3. الصورة (مضبوطة للمنتجات الطويلة) */}
      <Link href={`/product/${id}`} className="relative bg-gray-50/80 overflow-hidden flex items-center justify-center h-[180px] w-full border-b border-gray-100 p-8">
         {image ? (
            <div className="relative w-full h-full">
                <Image 
                    src={image} 
                    alt={name} 
                    fill 
                    className="object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply drop-shadow-sm" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </div>
         ) : (
            <div className="flex flex-col items-center justify-center text-gray-300">
                <Package size={40} strokeWidth={1} />
                <span className="text-[10px] font-bold mt-2">لا توجد صورة</span>
            </div>
         )}
      </Link>

      {/* 4. التفاصيل */}
      <div className="p-4 flex-1 flex flex-col">
        <div>
          <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Settings2 size={10} /> {category || 'عام'}
              </span>
              <div className="flex items-center gap-1">
                <Star size={10} className="text-yellow-400 fill-yellow-400" />
                <span className="text-[10px] text-gray-500 font-bold">{rating || 5.0}</span>
              </div>
          </div>
          
          <Link href={`/product/${id}`}>
            <h3 className="font-bold text-[#001d3d] leading-snug group-hover:text-[#e31e24] transition-colors text-sm mb-2 line-clamp-2 min-h-[40px]">
              {name}
            </h3>
          </Link>
        </div>

        {/* السعر والزر */}
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-end justify-between gap-2">
           <div className="flex flex-col">
              {oldPrice > 0 && <span className="text-[10px] text-gray-400 line-through decoration-red-500/30">{oldPrice} ج.م</span>}
              <span className="text-lg font-black text-[#001d3d]">{price} <span className="text-[10px] font-medium text-gray-500">ج.م</span></span>
           </div>
           
           <button 
             onClick={() => onAddToCart(product)}
             className="flex-1 bg-[#001d3d] text-white hover:bg-[#e31e24] h-9 rounded-lg font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
           >
             <ShoppingBag size={14} /> إضافة
           </button>
        </div>
      </div>
    </motion.div>
  );
};

// ==================================================================================
// 2. MAIN WISHLIST PAGE
// ==================================================================================

export default function WishlistPage() {
  const { addToCart, openCart } = useCart();
  
  // ✅ تم تصحيح البيانات لتطابق الصور الفعلية الموجودة
  const [wishlistItems, setWishlistItems] = useState([
    { id: 1, name: 'مناديل تواليت وايت ماجيك - 5+1 بكرة', price: 59, oldPrice: 74, discount: 20, image: '/okazyon/14.webp', category: 'سوبر ماركت', rating: 4.8 },
    { id: 2, name: 'فريدا معطر جو - العود - 460 مللي', price: 49, oldPrice: 58, discount: 16, image: '/okazyon/15.webp', category: 'منظفات', rating: 4.6, badge: 'اطلبت كتير' },
    { id: 3, name: 'فريدا معطر جو - الرمان - 460 مللي', price: 39, oldPrice: 48, discount: 19, image: '/okazyon/16.webp', category: 'منظفات', rating: 4.5 },
    { id: 4, name: 'شاور جل لوكس البنفسجي - 500 مل', price: 55, oldPrice: 65, discount: 15, image: '/okazyon/1.webp', category: 'عناية شخصية', rating: 4.9 },
    { id: 5, name: 'كريم نيفيا الأزرق المرطب - 60 مل', price: 35, oldPrice: 45, discount: 22, image: '/okazyon/8.webp', category: 'عناية شخصية', rating: 4.7 },
  ]);

  const handleRemove = (id: number) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleAddToCart = (item: any) => {
    addToCart({ ...item, quantity: 1 });
    openCart();
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#f8fafc] font-sans text-right" dir="rtl">
      
      {/* 1. Header Section */}
      <section className="bg-[#001d3d] relative overflow-hidden border-b border-[#e31e24]/20">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-8 relative z-10 text-white">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 mb-6">
            <Link href="/" className="hover:text-white flex items-center gap-1"><Home size={12} /> الرئيسية</Link>
            <ChevronDown size={10} className="-rotate-90" />
            <span>المفضلة</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center bg-white/5 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg">
                  <Heart size={28} className="text-[#e31e24]" fill="#e31e24" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">قائمة أمنياتي</h1>
              </div>
              <p className="text-sm text-gray-300 font-medium flex items-center gap-2">
                <Check size={12} className="text-[#e31e24]" />
                لديك <span className="font-bold text-white bg-white/10 px-1.5 rounded">{wishlistItems.length}</span> منتج محفوظ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Content Area */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-8 w-full">
        {wishlistItems.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence>
              {wishlistItems.map((item) => (
                <WishlistCard 
                  key={item.id} 
                  product={item} 
                  onRemove={handleRemove} 
                  onAddToCart={handleAddToCart} 
                />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
             <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                <AlertCircle size={48} />
             </div>
             <h3 className="text-xl font-black text-[#001d3d] mb-2">القائمة فارغة تماماً</h3>
             <p className="text-gray-500 max-w-sm mb-8 text-sm leading-relaxed">
               لم تقم بحفظ أي منتجات بعد. تصفح العروض المميزة واضغط على القلب لحفظ ما يعجبك هنا.
             </p>
             <Link href="/" className="px-8 py-3 bg-[#001d3d] text-white rounded-xl font-bold hover:bg-[#e31e24] transition-colors shadow-lg flex items-center gap-2">
               تصفح العروض <ArrowRight size={16} />
             </Link>
          </div>
        )}
      </div>

    </main>
  );
}