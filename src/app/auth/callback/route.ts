import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  // 1. تجهيز الكوكيز والسوبابيز
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return cookieStore.get(name)?.value; },
        set(name: string, value: string, options: CookieOptions) { cookieStore.set({ name, value, ...options }); },
        remove(name: string, options: CookieOptions) { cookieStore.set({ name, value: '', ...options }); },
      },
    }
  );

  if (code) {
    // 2. تبديل الكود بجلسة (Login)
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // ✅ نجاح الدخول: نجيب رابط التوجيه من الداتابيز
      const { data: setting } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'login_redirect')
        .single();

      // الأولوية: الرابط اللي في الداتابيز > الرابط اللي في الركوست > الصفحة الرئيسية
      const nextPath = setting?.value || searchParams.get('next') || '/';
      
      return NextResponse.redirect(`${origin}${nextPath}`);
    }
  }

  // ❌ فشل الدخول: نجيب رابط الخطأ من الداتابيز
  const { data: errorSetting } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'error_redirect')
        .single();

  const errorPath = errorSetting?.value || '/login'; // لو مفيش في الداتابيز، رجعه لصفحة الدخول
  return NextResponse.redirect(`${origin}${errorPath}?error=AuthCallbackError`);
}
