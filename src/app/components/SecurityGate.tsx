'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function SecurityGate() {
  const router = useRouter();

  useEffect(() => {
    const setupGuard = async () => {
      // 1. مين المستخدم الحالي؟
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return; 

      console.log(`👮‍♂️ الحارس الأمني: يراقب المستخدم ${user.email} في جدول users`);

      // 2. المراقبة اللحظية لجدول users
      const channel = supabase
        .channel(`security_guard_${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'DELETE',      // بنراقب الحذف بس
            schema: 'public',
            table: 'users',       // ⚠️ اسم الجدول الجديد بتاعنا
            filter: `id=eq.${user.id}`, // يراقب صف المستخدم ده تحديداً
          },
          async () => {
            console.log("🚨 تم حذف المستخدم من السجلات! جاري الطرد الفوري...");
            await performHardLogout();
          }
        )
        .subscribe();

      // دالة الطرد (التنظيف الشامل)
      const performHardLogout = async () => {
        await supabase.auth.signOut(); // خروج من Auth
        localStorage.clear();          // مسح الكاش
        sessionStorage.clear();
        window.location.href = '/login'; // ريفريش كامل وتوجيه للدخول
      };

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupGuard();
  }, [router]);

  return null;
}