import type { Metadata } from "next";
import { Cairo } from "next/font/google"; 
import "./globals.css";
import { CartProvider } from "./components/CartSystem";
import { StoreProvider } from "./context/StoreContext";
import TanstackProvider from "./components/providers/TanstackProvider"; 
import { SiteHeader } from "./components/SiteHeader";
import { SiteFooter } from "./components/SiteFooter";
import SecurityGate from "./components/SecurityGate"; 
import { AppWrapper } from "./components/AppWrapper";
import GlobalProductWatcher from "./components/GlobalProductWatcher"; 

// [1] استيراد عارض الرسائل
import { Toaster } from 'sonner';

const cairo = Cairo({ 
  subsets: ["arabic"],
  weight: ["300", "400", "600", "700", "800"], 
  variable: "--font-cairo",
});

export const metadata: Metadata = {
  title: "مجموعة الكابتن والعميد",
  description: "الموقع الرسمي للتجارة المتميزة",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      {/* تم تعديل كلاسات الـ Body:
          1. text-slate-900: لون النص الأساسي في الوضع النهاري
          2. dark:bg-[#0f172a]: لون الخلفية الكحلي في الوضع الليلي
          3. dark:text-gray-50: لون النص الأبيض في الوضع الليلي
          4. transition-colors duration-300: نعومة في التحويل
      */}
      <body className={`${cairo.variable} antialiased bg-[#f8fafc] text-slate-900 dark:bg-[#0f172a] dark:text-gray-50 transition-colors duration-300`}>
        
        {/* هذا السكريبت يعمل فوراً قبل تحميل المحتوى ليقرأ الإعدادات المحفوظة
            ويمنع ظهور اللون الأبيض للحظة عند فتح الموقع في الوضع الليلي
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  // لو المستخدم مختار دارك، أو مش مختار حاجة بس جهازه دارك
                  if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />

        <TanstackProvider>
          <StoreProvider>
            <CartProvider>
              <AppWrapper>
                  
                  {/* [2] تركيب شاشة الرسائل في أعلى الموقع */}
                  <Toaster position="top-center" richColors closeButton />

                  <SecurityGate />
                  <GlobalProductWatcher />
                  
                  <SiteHeader />
                  {children}
                  <SiteFooter />
                  
              </AppWrapper>
            </CartProvider>
          </StoreProvider>
        </TanstackProvider>
      </body>
    </html>
  );
}