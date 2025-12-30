'use client';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export const SplashScreen = ({ onFinished }: { onFinished: () => void }) => {
  const router = useRouter();
  
  useEffect(() => {
    // 1. بدء التحميل المسبق للصفحات الحقيقية في مشروعك
    const prefetchRoutes = async () => {
      console.log("🚀 جاري شحن المحركات والصفحات...");

      // صفحة تسجيل الدخول
      router.prefetch('/login'); 

      // صفحة الإشعارات (بناءً على مسارك الصحيح)
      router.prefetch('/notifications');

      // هنا الذكاء: بنحمل "هيكل" صفحات الكوليكشن والمنتجات
      // بننادي على رابط واحد حقيقي عشان الكود بتاعه يتكيش
      // (استخدمت slug موجود عندك في البيانات زي spare-parts)
      router.prefetch('/collection/spare-parts');
      router.prefetch('/collection/oils-fluids');

      // بنحمل هيكل صفحة المنتج (مثال لمنتج وهمي عشان يحفظ التنسيق)
      router.prefetch('/product/1'); 
      
      // صفحة الدفع (مهمة جداً تكون سريعة)
      router.prefetch('/checkout');
    };

    prefetchRoutes();

    // 2. التايمر: 4 ثواني ويخفي الشاشة
    const timer = setTimeout(() => {
      onFinished();
    }, 4000); 

    return () => clearTimeout(timer);
  }, [router, onFinished]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#001d3d] text-white"
    >
      {/* اللوجو والأنيميشن */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative text-center"
      >
        <h1 className="text-6xl font-black tracking-tighter italic">
          CAPTAIN<span className="text-[#e31e24]">.</span>
        </h1>
        <p className="text-xs font-bold text-gray-400 tracking-[0.4em] uppercase mt-2">
          Performance & Luxury
        </p>
      </motion.div>

      {/* شريط تحميل وهمي */}
      <motion.div 
        className="w-48 h-1 bg-white/10 rounded-full mt-8 overflow-hidden"
      >
        <motion.div 
          className="h-full bg-[#e31e24]"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3.5, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
};