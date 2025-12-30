'use client';
import React from 'react';
import Image from 'next/image';
import { 
  Facebook, Instagram, Linkedin, Phone, MessageCircle, 
  Smartphone, Send, Banknote
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from './CartSystem';

// 1. أيقونة تيك توك
const TikTokIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// 2. أيقونة واتساب
const WhatsAppIcon = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export const SiteFooter = () => {
  const { activeContext } = useStore();
  const { openCart } = useCart();

  // بيانات التواصل
  const customerNumber = "201212121011"; 
  const displayNumber = "+20 12 12121011"; 
  const whatsappMsg = encodeURIComponent("السلام عليكم، محتاج مساعدة بخصوص طلب من تطبيق كنز.");

  return (
    <footer className="bg-[#0f172a] text-white pt-16 pb-8 border-t border-[#1e293b] mt-auto relative overflow-hidden font-sans">
      
      {/* الخط الملون العلوي فقط (بدون أي علامات مائية أو دوائر ضبابية) */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6c0dfa] via-[#e31e24] to-[#6c0dfa]"></div>

      <div className="w-[94%] max-w-[1850px] mx-auto px-4">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 mb-12">
          
          {/* ================= العمود الأول: اللوجو والتطبيقات ================= */}
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
            <div>
               {/* اللوجو */}
               <div className="mb-5 flex justify-center lg:justify-start">
                 <Image src="/logo/kenzz_small_logo.svg" alt="Kenzz" width={110} height={45} className="object-contain brightness-0 invert" />
               </div>
               
               <p className="text-gray-400 text-sm leading-relaxed font-medium max-w-sm mx-auto lg:mx-0">
                 تجربة تسوق فريدة تجمع بين أصالة المنتجات وسرعة التوصيل. حمل التطبيق الآن واستمتع بعروض حصرية.
               </p>
            </div>

            {/* أزرار التحميل */}
            <div className="w-full">
               <h4 className="text-sm font-bold text-white mb-4 flex items-center justify-center lg:justify-start gap-2">
                 <Smartphone size={16} className="text-[#6c0dfa]" /> حمل التطبيق مجاناً
               </h4>
               <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                 {/* Google Play */}
                 <a href="https://play.google.com/store/apps/details?id=com.kenzz.users" target="_blank" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-xl transition-all group flex-1 lg:flex-none min-w-[145px] max-w-[170px]">
                     <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" alt="Google Play" className="w-6 h-6 shrink-0" />
                     <div className="flex flex-col items-start overflow-hidden">
                        <span className="text-[8px] text-gray-400 uppercase tracking-wider whitespace-nowrap">GET IT ON</span>
                        <span className="text-xs font-bold text-white group-hover:text-[#6c0dfa] transition-colors whitespace-nowrap">Google Play</span>
                     </div>
                 </a>

                 {/* App Store */}
                 <a href="https://apps.apple.com/eg/app/kenzz/id6449041728" target="_blank" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-xl transition-all group flex-1 lg:flex-none min-w-[145px] max-w-[170px]">
                     <svg viewBox="0 0 384 512" fill="white" className="w-6 h-6 shrink-0"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 43.3-25.6 68.8 26.1 2 52.6-13.4 69.5-31.2z"/></svg>
                     <div className="flex flex-col items-start overflow-hidden">
                        <span className="text-[8px] text-gray-400 uppercase tracking-wider whitespace-nowrap">Download on</span>
                        <span className="text-xs font-bold text-white group-hover:text-[#6c0dfa] transition-colors whitespace-nowrap">App Store</span>
                     </div>
                 </a>

                 {/* App Gallery */}
                 <a href="https://appgallery.huawei.com/app/C108570801" target="_blank" className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-xl transition-all group flex-1 lg:flex-none min-w-[145px] max-w-[170px]">
                     <Image src="/logo/icons8-huawei-app-gallery-48.svg" alt="Huawei" width={28} height={28} className="w-7 h-7 object-contain shrink-0" />
                     <div className="flex flex-col items-start overflow-hidden">
                        <span className="text-[8px] text-gray-400 uppercase tracking-wider whitespace-nowrap">EXPLORE IT ON</span>
                        <span className="text-xs font-bold text-white group-hover:text-[#e31e24] transition-colors whitespace-nowrap">AppGallery</span>
                     </div>
                 </a>
               </div>
            </div>
          </div>

          {/* ================= العمودين: الروابط (نظام الشبكة Grid) ================= */}
          <div className="col-span-1 lg:col-span-4 grid grid-cols-2 gap-x-4 gap-y-8">
            {/* روابط هامة */}
            <div>
               <h3 className="font-bold text-base lg:text-lg mb-4 text-white border-b border-[#6c0dfa]/50 inline-block pb-1">روابط هامة</h3>
               <ul className="space-y-3">
                 {['من نحن', 'سياسة الخصوصية', 'الشروط والأحكام', 'الأسئلة الشائعة', 'اتصل بنا'].map((link, idx) => (
                   <li key={idx}>
                     <a href="#" className="text-xs lg:text-sm text-gray-400 hover:text-[#6c0dfa] transition-colors flex items-center gap-2 hover:translate-x-[-5px] duration-300 group">
                       <span className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-[#6c0dfa] transition-colors"></span> {link}
                     </a>
                   </li>
                 ))}
               </ul>
            </div>

            {/* تسوق الآن */}
            <div>
               <h3 className="font-bold text-base lg:text-lg mb-4 text-white border-b border-[#6c0dfa]/50 inline-block pb-1">تسوق الآن</h3>
               <ul className="space-y-3">
                 {['سوبر ماركت', 'أزياء وموضة', 'أجهزة منزلية', 'العناية الشخصية', 'لوازم السيارات'].map((link, idx) => (
                   <li key={idx}>
                     <a href="#" className="text-xs lg:text-sm text-gray-400 hover:text-[#6c0dfa] transition-colors flex items-center gap-2 hover:translate-x-[-5px] duration-300 group">
                       <span className="w-1.5 h-1.5 rounded-full bg-gray-700 group-hover:bg-[#6c0dfa] transition-colors"></span> {link}
                     </a>
                   </li>
                 ))}
               </ul>
            </div>
          </div>

          {/* ================= العمود الرابع: بطاقة التواصل ================= */}
          <div className="lg:col-span-4 mt-4 lg:mt-0">
            <div className="bg-gradient-to-br from-[#1e293b]/90 to-[#0b121e] p-5 lg:p-6 rounded-2xl border border-white/10 relative overflow-hidden group hover:border-[#6c0dfa]/30 transition-all shadow-xl">
              
              <h3 className="font-bold text-lg lg:text-xl mb-5 text-white flex items-center justify-center lg:justify-start gap-2 relative z-10">
                <MessageCircle size={22} className="text-[#6c0dfa]" />
                نحن هنا لمساعدتك
              </h3>

              <div className="space-y-5 relative z-10">
                <a 
                  href={`https://wa.me/${customerNumber}?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 lg:gap-4 bg-white/5 hover:bg-[#25D366]/10 p-3 lg:p-4 rounded-xl border border-white/5 hover:border-[#25D366]/30 transition-all cursor-pointer group/wa"
                >
                   <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#6c0dfa] group-hover/wa:bg-[#25D366] flex items-center justify-center text-white shadow-lg transition-colors shrink-0">
                     <Phone size={20} className="lg:w-6 lg:h-6" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <span className="block text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5 lg:mb-1 group-hover/wa:text-[#25D366] transition-colors">رقم خدمة العملاء (واتساب)</span>
                     <span dir="ltr" className="text-lg lg:text-xl font-black text-white font-mono tracking-wide whitespace-nowrap truncate block">
                       {displayNumber}
                     </span>
                   </div>
                   <Send size={18} className="text-[#25D366] opacity-0 group-hover/wa:opacity-100 -translate-x-2 group-hover/wa:translate-x-0 transition-all hidden lg:block" />
                </a>

                <div className="text-center lg:text-left">
                   <span className="block text-xs text-gray-400 font-bold mb-3">تابعنا على منصات التواصل:</span>
                   <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                      <a href="https://www.facebook.com/KenzzEgypt" target="_blank" className="w-10 h-10 rounded-lg bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all hover:-translate-y-1"><Facebook size={20} /></a>
                      <a href="https://www.instagram.com/kenzzegypt/" target="_blank" className="w-10 h-10 rounded-lg bg-[#E4405F]/10 text-[#E4405F] flex items-center justify-center hover:bg-[#E4405F] hover:text-white transition-all hover:-translate-y-1"><Instagram size={20} /></a>
                      <a href="https://www.tiktok.com/@kenzzegypt" target="_blank" className="w-10 h-10 rounded-lg bg-[#000000]/30 text-white flex items-center justify-center hover:bg-black hover:text-white border border-white/10 transition-all hover:-translate-y-1"><TikTokIcon size={18} /></a>
                      <a href="https://www.linkedin.com/company/kenzz/" target="_blank" className="w-10 h-10 rounded-lg bg-[#0A66C2]/10 text-[#0A66C2] flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-all hover:-translate-y-1"><Linkedin size={20} /></a>
                      <a href="https://www.messenger.com/t/100189416025900" target="_blank" className="w-10 h-10 rounded-lg bg-[#0084FF]/10 text-[#0084FF] flex items-center justify-center hover:bg-[#0084FF] hover:text-white transition-all hover:-translate-y-1"><MessageCircle size={20} /></a>
                      <a href={`https://wa.me/${customerNumber}?text=${whatsappMsg}`} target="_blank" className="w-10 h-10 rounded-lg bg-[#25D366]/10 text-[#25D366] flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all hover:-translate-y-1"><WhatsAppIcon size={20} /></a>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= الحقوق + وسائل الدفع الجديدة ================= */}
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          
          {/* نص الحقوق فقط (بدون توقيع) */}
          <p className="text-xs text-gray-500 font-medium leading-5">
            © 2025 Kenzz Egypt. جميع الحقوق محفوظة.
          </p>

          {/* وسائل الدفع */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <span className="text-xs font-bold text-gray-400">ممكن تدفع بـ</span>
            <div className="flex flex-wrap justify-center gap-2">
               {/* 1. الدفع عند الاستلام (كاش) */}
               <div className="h-8 w-12 bg-white rounded flex items-center justify-center border border-gray-200" title="الدفع عند الاستلام">
                  <Banknote className="text-green-600" size={20} />
               </div>

               {/* 2. فيزا */}
               <div className="h-8 w-12 bg-white rounded flex items-center justify-center border border-gray-200 overflow-hidden p-1">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="w-full h-full object-contain" />
               </div>

               {/* 3. ميزة (Meeza) - من ملفاتك */}
               <div className="h-8 w-12 bg-white rounded flex items-center justify-center border border-gray-200 overflow-hidden p-1">
                  <img src="/logo/Meeza.svg" alt="Meeza" className="w-full h-full object-contain" />
               </div>

               {/* 4. ماستر كارد */}
               <div className="h-8 w-12 bg-white rounded flex items-center justify-center border border-gray-200 overflow-hidden p-1">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="Mastercard" className="w-full h-full object-contain" />
               </div>

               {/* 5. فاليو (Valu) - من ملفاتك */}
               <div className="h-8 w-12 bg-white rounded flex items-center justify-center border border-gray-200 overflow-hidden p-1">
                  <img src="/logo/Valeo_Logo.svg" alt="Valu" className="w-full h-full object-contain" />
               </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};