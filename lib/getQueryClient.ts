import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query';

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // البيانات صالحة للأبد (الاعتماد الكلي على Realtime للتحديث)
        staleTime: Infinity,
        
        // الاحتفاظ بالبيانات في الذاكرة لمدة 24 ساعة (عشان الزبون ميحملش نفس الحاجة مرتين)
        gcTime: 1000 * 60 * 60 * 24,
        
        // منع إعادة التحميل عند تغيير التبويب (توفير للباقة)
        refetchOnWindowFocus: false,
        
        // محاولة واحدة فقط عند الفشل
        retry: 1,
      },
      dehydrate: {
        // إعدادات مهمة جداً عشان السيرفر يقدر يبعت البيانات للمتصفح
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === 'undefined') {
    // ⚠️ نحن الآن على السيرفر:
    // نقوم بإنشاء عميل جديد لكل طلب (Request) عشان بيانات العملاء متدخلش في بعضها
    return makeQueryClient();
  } else {
    // ⚠️ نحن الآن على المتصفح:
    // نقوم بإنشاء عميل مرة واحدة فقط ونعيد استخدامه (Singleton Pattern)
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}