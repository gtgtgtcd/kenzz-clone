'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/getQueryClient'; // استدعاء المصنع الذكي
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; // اختياري: أدوات المطورين

export default function TanstackProvider({ children }: { children: React.ReactNode }) {
  // بدلاً من استخدام useState وإنشاء العميل يدوياً
  // نطلب العميل من المصنع، وهو هيقرر (هل نعمل جديد ولا نستخدم الموجود؟)
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* أدوات المطورين هتظهر بس في وضع التطوير عشان تشوف الكاش بعينك */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}