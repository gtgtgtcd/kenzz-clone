import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  
  // التأكد من وجود معامل next لتوجيه المستخدم للصفحة الصحيحة
  const next = searchParams.get('next') ?? '/';

  if (code) {
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
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // جلب رابط التوجيه من الداتابيز (كما اتفقنا سابقاً) أو استخدام next
      const { data: setting } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'login_redirect')
        .single();

      let nextPath = setting?.value || next;

      // ==========================================================
      // 🔥 التعديل هنا: إضافة علامة ?loggedin=true للرابط
      // ==========================================================
      // نتأكد هل الرابط فيه علامة استفهام أصلاً ولا لأ
      const separator = nextPath.includes('?') ? '&' : '?';
      return NextResponse.redirect(`${origin}${nextPath}${separator}loggedin=true`);
    }
  }

  const { data: errorSetting } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'error_redirect')
        .single();

  const errorPath = errorSetting?.value || '/login';
  return NextResponse.redirect(`${origin}${errorPath}?error=AuthCallbackError`);
}
