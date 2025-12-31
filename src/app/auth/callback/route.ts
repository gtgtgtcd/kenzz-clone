import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
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
      // جلب رابط التوجيه من الداتابيز
      const { data: setting } = await supabase
        .from('app_settings')
        .select('value')
        .eq('key', 'login_redirect')
        .single();

      const nextPath = setting?.value || next;

      // ==========================================================
      // 🔥 الحل السحري (Cookie Method)
      // ==========================================================
      // بنعمل الرابط بشكل نظيف
      const redirectUrl = new URL(nextPath, origin);
      
      // بنجهز الرد (Redirect)
      const response = NextResponse.redirect(redirectUrl);
      
      // بنلزق فيه كوكي مدته 10 ثواني بس (كفاية لحد ما الصفحة تفتح)
      response.cookies.set('login_notification', 'true', { 
        path: '/', 
        maxAge: 10, // يختفي لوحده بعد 10 ثواني
        sameSite: 'lax' 
      });

      return response;
    }
  }

  // في حالة الخطأ
  const { data: errorSetting } = await supabase.from('app_settings').select('value').eq('key', 'error_redirect').single();
  const errorPath = errorSetting?.value || '/login';
  return NextResponse.redirect(`${origin}${errorPath}?error=AuthCallbackError`);
}
