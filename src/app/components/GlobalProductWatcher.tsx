'use client';

import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner'; 

export default function GlobalProductWatcher() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null>(null);

  // جلب الـ ID الخاص بالمستخدم الحالي
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUserId(session.user.id);
    };
    getUser();
  }, []);

  useEffect(() => {
    // -----------------------------------------------------------------
    // 1. مراقبة المنتجات (عام لكل المستخدمين - زي ما هي)
    // -----------------------------------------------------------------
    const productChannel = supabase.channel('global-product-watch')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' }, 
        (payload) => {
          
          // [أ] حذف منتج
          if (payload.eventType === 'DELETE') {
            const deletedId = payload.old.id.toString();
            queryClient.invalidateQueries({ queryKey: ['newArrivals'] });
            queryClient.invalidateQueries({ queryKey: ['bestSellers'] });
            queryClient.invalidateQueries({ queryKey: ['collection'] });
            queryClient.removeQueries({ queryKey: ['product', deletedId] });

            if (pathname.includes(`/product/${deletedId}`)) {
              router.replace('/'); 
              toast.error('عذراً، هذا المنتج لم يعد متاحاً.', {
                description: 'تم سحب المنتج من العرض حالاً.',
                duration: 10000,
                action: { label: 'فهمت', onClick: () => {} },
              });
            }
          }

          // [ب] تحديث منتج
          if (payload.eventType === 'UPDATE') {
            const updatedId = payload.new.id.toString();
            const newPrice = payload.new.price;
            const cachedData: any = queryClient.getQueryData(['product', updatedId]);
            const priceOnScreen = cachedData?.price;

            queryClient.invalidateQueries({ queryKey: ['newArrivals'] });
            queryClient.invalidateQueries({ queryKey: ['bestSellers'] });
            queryClient.invalidateQueries({ queryKey: ['collection'] });
            queryClient.invalidateQueries({ queryKey: ['product', updatedId] });

            if (pathname.includes(`/product/${updatedId}`)) {
              if (priceOnScreen && newPrice !== priceOnScreen) {
                toast.info('تحديث لحظي للسعر', {
                  description: `تغير السعر من ${priceOnScreen} إلى ${newPrice} ج.م`,
                  duration: 10000,
                  action: { label: 'فهمت', onClick: () => {} },
                });
              }
            }
          }
        }
      )
      .subscribe();

    // -----------------------------------------------------------------
    // 2. مراقبة المستخدم الشاملة (إشعارات + طلبات)
    // -----------------------------------------------------------------
    const userChannel = supabase.channel('global-user-watcher')
      // [أ] مراقبة الإشعارات
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' }, 
        (payload) => {
          // إضافة إشعار جديد
          if (payload.eventType === 'INSERT') {
            if (payload.new.user_id === userId) {
              queryClient.invalidateQueries({ queryKey: ['notifications', userId] });
              toast.info(payload.new.title || 'إشعار جديد', {
                description: payload.new.message,
                duration: 10000,
                action: { label: 'عرض', onClick: () => router.push('/notifications') },
              });
              new Audio('/sounds/notification.mp3').play().catch(() => {});
            }
          }
          // حذف أو تعديل إشعار
          if (payload.eventType === 'DELETE' || payload.eventType === 'UPDATE') {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
          }
        }
      )
      // [ب] مراقبة الطلبات (الجزء الجديد لحل مشكلة البروفايل) 🔥
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' }, 
        (payload) => {
           // ✅ تم الإصلاح هنا: استخدام as any لتجاوز تدقيق الأنواع الصارم
           const isMyOrder = (payload.new && (payload.new as any).user_id === userId) || 
                             (payload.old && (payload.old as any).user_id === userId); 

           if (isMyOrder || payload.eventType === 'DELETE') { 
              console.log("📦 رادار الطلبات: تم رصد تغيير، جاري تحديث البروفايل...");
              // ده الأمر اللي هيخلي صفحة البروفايل تعمل ريفريش للداتا غصب عنها
              queryClient.invalidateQueries({ queryKey: ['profile-orders'] });
           }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(productChannel);
      supabase.removeChannel(userChannel);
    };
  }, [queryClient, pathname, router, userId]);

  return null;
}