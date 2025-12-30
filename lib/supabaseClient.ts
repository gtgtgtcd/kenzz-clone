import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // بيضمن إن المستخدم يفضل مسجل دخول والتوكن ميموتش
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10, // بيزود معدل التقاط الإشارات عشان ميفوتش أي إشعار
    },
  },
});