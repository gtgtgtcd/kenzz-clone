'use client';
import React, { useState, useEffect } from 'react';
import { SplashScreen } from './SplashScreen';
import { usePathname } from 'next/navigation';

export const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  const [showSplash, setShowSplash] = useState(true);
  const pathname = usePathname();
  
  useEffect(() => {
    // 1. منطق السبلاش سكرين (زي ما هو)
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    if (hasSeenSplash) {
      setShowSplash(false);
    }

    // ============================================================
    // 🛡️ نظام الحماية الشامل للصور (Global Image Protection)
    // ============================================================
    
    // دالة لمنع القائمة المنبثقة (كليك يمين)
    const handleContextMenu = (e: MouseEvent) => {
      // لو العنصر اللي انداس عليه هو صورة (أو جوا صورة)
      if ((e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault(); // إلغاء القائمة
        return false;
      }
    };

    // دالة لمنع سحب الصور
    const handleDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault(); // إلغاء السحب
        return false;
      }
    };

    // دالة لمنع اختصارات الكيبورد (Ctrl+S / Ctrl+U)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) && 
        (e.key === 's' || e.key === 'u' || e.key === 'S' || e.key === 'U')
      ) {
        e.preventDefault(); // إلغاء الاختصار
      }
    };

    // تفعيل الحراسة على مستوى الوثيقة كلها (Document)
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('keydown', handleKeyDown);

    // تنظيف الحراسة لما الكومبوننت يموت (Cleanup)
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('keydown', handleKeyDown);
    };

  }, []);

  const handleSplashFinish = () => {
    setShowSplash(false);
    sessionStorage.setItem('hasSeenSplash', 'true'); 
  };

  return (
    <>
      {showSplash && <SplashScreen onFinished={handleSplashFinish} />}
      <div className={showSplash ? 'hidden' : 'block animate-in fade-in duration-700'}>
        {children}
      </div>
    </>
  );
};