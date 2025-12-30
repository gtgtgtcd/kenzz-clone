'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronRight, MapPin, Phone, User, CreditCard, 
  Banknote, Wallet, CheckCircle2, ArrowLeft, ShieldCheck, Lock,
  Home, ShoppingBag, Loader2 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../components/CartSystem'; 
import { supabase } from '@/lib/supabaseClient'; 
import { useRouter } from 'next/navigation';

// [1] استيراد الـ QueryClient عشان نتحكم في الكاش
import { useQueryClient } from '@tanstack/react-query';

export default function CheckoutPage() {
  const { items, total, openCart, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'visa' | 'wallet'>('cod');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null); 
  const router = useRouter();

  // [2] تعريف المحرك (عشان نستخدمه وقت نجاح الطلب)
  const queryClient = useQueryClient();

  // حالة لتخزين بيانات الفورم
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    governorate: '',
    address: ''
  });

  const shippingCost = 50;
  const discount = paymentMethod === 'wallet' ? total * 0.05 : 0;
  const finalTotal = total + shippingCost - discount;

  // 1. جلب رقم المستخدم عند فتح الصفحة
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

  // دالة تحديث البيانات عند الكتابة
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // دالة إرسال الطلب لـ Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // حماية: لازم يكون مسجل دخول عشان نعرف نربط الطلب بيه
    if (!userId) {
        alert("يرجى تسجيل الدخول أولاً لإتمام الطلب وحفظه في حسابك.");
        router.push('/login');
        return;
    }

    setIsSubmitting(true);

    try {
      // 2. تجهيز بيانات الطلب (شاملة الـ user_id)
      const orderData = {
        user_id: userId, // ⚠️ أهم حتة: ربط الطلب بالمستخدم
        customer_name: formData.name,
        phone: formData.phone,
        city: formData.governorate,
        address: formData.address,
        total_amount: finalTotal,
        status: 'pending', // حالة الطلب المبدئية
        items: items, // بنخزن محتوى السلة كله كـ JSON
        payment_method: paymentMethod
      };

      // 3. الإرسال لقاعدة البيانات
      const { error } = await supabase
        .from('orders')
        .insert([orderData]);

      if (error) throw error;

      // [3] الحركة السحرية هنا: حرق الكاش القديم فوراً! 🔥
      // بنقول للمحرك: "يا ريس، بيانات البروفايل والطلبات بقت قديمة، امسحها وهاتها تاني لما نحتاجها"
      await queryClient.invalidateQueries({ queryKey: ['profile-orders'] });
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });

      // 4. في حالة النجاح
      clearCart(); // فضي السلة
      setIsSuccess(true); // اظهر رسالة النجاح

    } catch (err) {
      console.error("Order Error:", err);
      alert("حدث خطأ أثناء إرسال الطلب، تأكد من الاتصال بالانترنت.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center font-sans" dir="rtl">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full border border-gray-100"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="text-2xl font-black text-[#001d3d] mb-2">تم استلام طلبك بنجاح!</h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">شكراً لثقتك في الكابتن. يمكنك متابعة حالة الطلب الآن من صفحة "طلباتي" في ملفك الشخصي.</p>
          <div className="space-y-3">
            <Link href="/profile" className="block w-full py-3 bg-[#001d3d] text-white rounded-xl font-bold hover:bg-[#e31e24] transition-colors">
                متابعة الطلب
            </Link>
            <Link href="/" className="block w-full py-3 text-gray-500 font-bold hover:text-[#001d3d] transition-colors">
                العودة للرئيسية
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    // تم إزالة الهيدر المخصص، الآن سيظهر الهيدر العام للتطبيق
    <main className="min-h-screen bg-[#f8fafc] font-sans text-right pb-20 pt-6 lg:pt-10" dir="rtl">
      
      {/* MAIN CONTENT */}
      <div className="w-full px-4 lg:px-10">
        
        {/* عنوان الصفحة البسيط */}
        <div className="mb-6 flex items-center gap-2 text-sm text-gray-500 font-bold">
            <Link href="/" className="hover:text-[#001d3d]">الرئيسية</Link> 
            <ChevronRight size={14} className="rtl:rotate-180" />
            <span className="text-[#001d3d]">إتمام الشراء</span>
        </div>

        <form id="checkout-form" onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          
          {/* SECTION A: Shipping Info */}
          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm w-full">
            <h2 className="text-lg font-black text-[#001d3d] mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="w-7 h-7 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">1</span>
              بيانات الشحن
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1.5">الاسم بالكامل</label>
                <div className="relative">
                  <User size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
                  <input 
                    required 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    type="text" 
                    className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl pr-10 pl-4 text-sm focus:border-[#001d3d] focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium" 
                    placeholder="مثال: أحمد محمد" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">رقم الهاتف</label>
                <div className="relative">
                  <Phone size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
                  <input 
                    required 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    type="tel" 
                    className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl pr-10 pl-4 text-sm focus:border-[#001d3d] focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium" 
                    placeholder="01xxxxxxxxx" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1.5">المحافظة</label>
                <div className="relative">
                  <MapPin size={18} className="absolute top-1/2 -translate-y-1/2 right-3 text-gray-400" />
                  <select 
                    required
                    name="governorate"
                    value={formData.governorate}
                    onChange={handleInputChange}
                    className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl pr-10 pl-4 text-sm focus:border-[#001d3d] focus:bg-white outline-none transition-all appearance-none cursor-pointer font-medium text-gray-700"
                  >
                    <option value="">اختر المحافظة</option>
                    <option value="القاهرة">القاهرة</option>
                    <option value="الجيزة">الجيزة</option>
                    <option value="الإسكندرية">الإسكندرية</option>
                    <option value="المنصورة">المنصورة</option>
                    <option value="طنطا">طنطا</option>
                    <option value="الصعيد">محافظات الصعيد</option>
                    <option value="أخرى">أخرى</option>
                  </select>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1.5">العنوان بالتفصيل</label>
                <input 
                    required 
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    type="text" 
                    className="w-full h-12 bg-gray-50 border border-gray-200 rounded-xl px-4 text-sm focus:border-[#001d3d] focus:bg-white outline-none transition-all placeholder:text-gray-400 font-medium" 
                    placeholder="المنطقة، اسم الشارع، رقم العمارة، الشقة..." 
                />
              </div>
            </div>
          </section>

          {/* SECTION B: Payment Method */}
          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm w-full">
            <h2 className="text-lg font-black text-[#001d3d] mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
              <span className="w-7 h-7 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold shadow-sm">2</span>
              طريقة الدفع
            </h2>

            <div className="space-y-3">
              {/* Cash */}
              <div 
                onClick={() => setPaymentMethod('cod')}
                className={`cursor-pointer border rounded-xl p-4 flex items-center justify-between transition-all duration-300 ${paymentMethod === 'cod' ? 'border-[#001d3d] bg-blue-50/50 ring-1 ring-[#001d3d]/10' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${paymentMethod === 'cod' ? 'border-[#001d3d]' : 'border-gray-300'}`}>
                    {paymentMethod === 'cod' && <div className="w-3 h-3 bg-[#001d3d] rounded-full"></div>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Banknote size={20} className="text-emerald-600" />
                    <span className="font-bold text-sm text-[#001d3d]">الدفع عند الاستلام</span>
                  </div>
                </div>
              </div>

              {/* Wallet */}
              <div 
                onClick={() => setPaymentMethod('wallet')}
                className={`cursor-pointer border rounded-xl p-4 flex items-center justify-between transition-all duration-300 ${paymentMethod === 'wallet' ? 'border-[#e31e24] bg-red-50/50 ring-1 ring-[#e31e24]/10' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${paymentMethod === 'wallet' ? 'border-[#e31e24]' : 'border-gray-300'}`}>
                    {paymentMethod === 'wallet' && <div className="w-3 h-3 bg-[#e31e24] rounded-full"></div>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet size={20} className="text-[#e31e24]" />
                    <span className="font-bold text-sm text-[#001d3d]">فودافون كاش / محفظة</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-white bg-[#e31e24] px-2 py-1 rounded shadow-sm animate-pulse">خصم 5%</span>
              </div>

              {/* Visa */}
              <div 
                onClick={() => setPaymentMethod('visa')}
                className={`cursor-pointer border rounded-xl p-4 flex items-center justify-between transition-all duration-300 ${paymentMethod === 'visa' ? 'border-purple-600 bg-purple-50/50 ring-1 ring-purple-600/10' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${paymentMethod === 'visa' ? 'border-purple-600' : 'border-gray-300'}`}>
                    {paymentMethod === 'visa' && <div className="w-3 h-3 bg-purple-600 rounded-full"></div>}
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard size={20} className="text-purple-600" />
                    <span className="font-bold text-sm text-[#001d3d]">بطاقة بنكية (Visa / MasterCard)</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SECTION C: Order Summary */}
          <section className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-inner w-full">
            <h2 className="text-lg font-black text-[#001d3d] mb-4 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-600" /> ملخص الطلب
            </h2>

            <div className="space-y-3 mb-6 bg-white p-4 rounded-xl border border-gray-100 max-h-[300px] overflow-y-auto custom-scrollbar">
                {items.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4 font-medium">السلة فارغة!</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                      <div className="w-12 h-12 bg-gray-50 rounded-lg relative overflow-hidden shrink-0 border border-gray-100">
                        <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                        <span className="absolute top-0 right-0 bg-[#001d3d] text-white text-[8px] font-bold w-4 h-4 flex items-center justify-center rounded-bl-md">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xs font-bold text-[#001d3d] line-clamp-1">{item.name}</h4>
                        <span className="text-xs font-bold text-gray-500">{item.price.toLocaleString()} ج.م</span>
                      </div>
                      <span className="font-black text-sm text-[#001d3d]">{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))
                )}
            </div>

            <div className="space-y-2 text-sm border-t border-gray-200 pt-4">
               <div className="flex justify-between items-center">
                 <span className="text-gray-500 font-bold">المجموع الفرعي</span>
                 <span className="font-bold text-[#001d3d]">{total.toLocaleString()} ج.م</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-gray-500 font-bold">مصاريف الشحن</span>
                 <span className="font-bold text-[#001d3d]">{shippingCost} ج.م</span>
               </div>
               {discount > 0 && (
                 <div className="flex justify-between items-center text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                   <span className="font-bold">خصم خاص</span>
                   <span className="font-bold">-{discount.toLocaleString()} ج.م</span>
                 </div>
               )}
               <div className="flex justify-between items-center pt-4 mt-2 border-t border-dashed border-gray-300">
                 <span className="font-black text-lg text-[#001d3d]">الإجمالي النهائي</span>
                 <span className="font-black text-2xl text-[#e31e24]">{finalTotal.toLocaleString()} <span className="text-sm font-bold text-gray-500">ج.م</span></span>
               </div>
            </div>

            <button 
              type="submit" 
              disabled={items.length === 0 || isSubmitting} 
              className="w-full mt-6 h-14 bg-[#001d3d] hover:bg-[#e31e24] text-white rounded-xl font-black text-lg transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> جاري التنفيذ...
                </>
              ) : (
                <>
                  {items.length === 0 ? 'السلة فارغة' : 'تأكيد الطلب الآن'} 
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-gray-400 font-bold opacity-70">
                <ShieldCheck size={12} /> كل البيانات مشفرة وآمنة 100%
            </div>
          </section>

        </form>
      </div>
    </main>
  );
}