import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  // التأكد من وجود معامل next لتوجيه المستخدم للصفحة الصحيحة
  const next = searchParams.get('next') ?? '/';

  if (code) {
    // ✅ التصحيح هنا: إضافة await لأن cookies أصبحت promise في النسخ الحديثة
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({ name, value: '', ...options });
          },
        },
      }
    );
    
    // 1. تبديل الكود بجلسة دخول (Exchange Code for Session)
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // 2. الخطوة السحرية: إجبار السيرفر على جلب بيانات المستخدم وتحديث الكوكيز فوراً
      const { data: { user } } = await supabase.auth.getUser();

      // لو تحب، ممكن نعمل Log هنا عشان نتأكد في السيرفر إن الصورة وصلت
      if (user?.user_metadata?.avatar_url) {
        console.log('✅ User Avatar found on Server Side callback');
      }

      // توجيه المستخدم للصفحة المطلوبة
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // في حالة وجود خطأ في الكود أو التوثيق
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}