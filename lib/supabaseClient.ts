import { createBrowserClient } from '@supabase/ssr';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    // الخيارات دي عشان الـ Realtime والـ Auth يشتغلوا بكفاءة مع Next.js
    realtime: {
      params: {
        eventsPerSecond: 10, // زي ما أنت عايز عشان الإشعارات السريعة
      },
    },
    // مش محتاج تكتب persistSession: true لأن المكتبة دي بتستخدم الكوكيز تلقائياً
    // وده أفضل وأأمن بكتير عشان السيرفر يقدر يقرا حالة المستخدم
  }
);
