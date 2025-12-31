'use client';

import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter, usePathname, useSearchParams } from 'next/navigation'; // ✅ ضفنا useSearchParams
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner'; 

export default function GlobalProductWatcher() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // ✅ تعريف المتغير
  const [userId, setUserId] = useState<string | null>(null);

  // جلب الـ ID الخاص بالمستخدم الحالي
  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setUserId(session.user.id);
    };
    getUser();
  }, []);

  // ==========================================================
  // 🔥 الجزء الجديد: رادار إشعار تسجيل الدخول
  // ==========================================================
  useEffect(() => {
    // لو الرابط فيه كلمة loggedin=true
    if (searchParams.get('loggedin') === 'true') {
      
      // 1. تشغيل صوت (اختياري)
      new Audio('/sounds/success.mp3').play().catch(() => {});

      // 2. إظهار الإشعار
      toast.success('أهلاً بك يا كابتن! 👋', {
        description: 'تم تسجيل دخولك بنجاح، نتمنى لك تجربة تسوق ممتعة.',
        duration: 5000, // مدة الإشعار
        style: {
            background: '#ffffff',
            border: '1px solid #22c55e',
            color: '#001d3d',
            fontFamily: 'var(--font-cairo)'
        }
      });

      // 3. تنظيف الرابط (حذف loggedin=true) عشان الإشعار ميظهرش تاني لو عمل ريفريش
      const params = new URLSearchParams(searchParams.toString());
      params.delete('loggedin');
      // بنعمل replace للرابط من غير ما نعمل refresh للصفحة
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, pathname, router]);


  // ... باقي الكود القديم الخاص بـ Realtime كما هو (بدون تغيير) ...
  useEffect(() => {
    const productChannel = supabase.channel('global-product-watch')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' }, 
        (payload) => {
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

    const userChannel = supabase.channel('global-user-watcher')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' }, 
        (payload) => {
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
          if (payload.eventType === 'DELETE' || payload.eventType === 'UPDATE') {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' }, 
        (payload) => {
           const isMyOrder = (payload.new && (payload.new as any).user_id === userId) || 
                             (payload.old && (payload.old as any).user_id === userId); 

           if (isMyOrder || payload.eventType === 'DELETE') { 
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
