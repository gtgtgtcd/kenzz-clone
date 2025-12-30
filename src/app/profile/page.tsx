'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { 
  User, Package, Calendar, LogOut, 
  MapPin, Loader2, ShoppingBag, Filter, 
  CheckCircle2, Clock, XCircle, ArrowLeft,
  Settings, Heart, Check, HelpCircle,
  LayoutGrid, List, X, Search, MessageCircle, AlertCircle, Trash2, AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// [1] استدعاء أدوات المحرك العملاق
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// =========================================================
// ORDER CARD COMPONENT
// =========================================================
const OrderCard = ({ order, onCancelClick, onDeleteClick }: { order: any, onCancelClick: (id: any) => void, onDeleteClick: (id: any) => void }) => {
    const items = Array.isArray(order.items) ? order.items : [];
    const images = items.map((item: any) => item.image).filter(Boolean);
    const itemsCount = items.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
    
    const isCancelled = order.status === 'cancelled';
    const isPending = order.status === 'pending';

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'pending': return { label: 'جاري التجهيز', bg: 'bg-amber-100', text: 'text-amber-800', icon: Clock };
            case 'delivered': return { label: 'تم التوصيل', bg: 'bg-emerald-100', text: 'text-emerald-800', icon: CheckCircle2 };
            case 'cancelled': return { label: 'ملغي', bg: 'bg-gray-100', text: 'text-gray-500', icon: XCircle };
            default: return { label: status || 'غير معروف', bg: 'bg-gray-100', text: 'text-gray-800', icon: Package };
        }
    };

    const status = getStatusConfig(order.status);

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full ${isCancelled ? 'opacity-75 grayscale hover:grayscale-0 hover:opacity-100' : 'hover:border-[#001d3d]'}`}
        >
            <div className="bg-gray-50/50 p-4 border-b border-gray-100 relative h-[150px] flex items-center justify-center gap-2 overflow-hidden">
                <span className={`absolute top-3 right-3 flex items-center gap-1 ${status.bg} ${status.text} text-[11px] font-black px-3 py-1.5 rounded-lg shadow-sm z-10`}>
                    <status.icon size={12} strokeWidth={3} /> {status.label}
                </span>
                
                {isCancelled && (
                    <div className="absolute inset-0 bg-gray-100/50 z-[5] flex items-center justify-center pointer-events-none">
                        <span className="bg-white/90 border border-gray-200 text-gray-500 px-4 py-1 rounded-full text-xs font-black shadow-sm transform -rotate-6">
                            تم إلغاء الطلب
                        </span>
                    </div>
                )}

                {images.length > 0 ? (
                    images.slice(0, 3).map((img: string, i: number) => (
                        <div key={i} className="w-24 h-24 bg-white rounded-xl border border-gray-200 p-1.5 shadow-sm relative rotate-0 group-hover:rotate-6 transition-transform duration-500" style={{ zIndex: 10 - i, marginLeft: i > 0 ? '-30px' : 0 }}>
                            <Image src={img} alt="item" fill className="object-contain" />
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center text-gray-300">
                        <Package size={40} />
                        <span className="text-[10px] font-bold mt-2">لا توجد معاينة</span>
                    </div>
                )}
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded">#{order.id?.toString().slice(0, 8) || '---'}</span>
                        <span className="text-xs font-bold text-gray-500 flex items-center gap-1"><Calendar size={12} /> {order.created_at ? new Date(order.created_at).toLocaleDateString('ar-EG') : '--/--'}</span>
                    </div>
                    <h3 className="font-black text-[#001d3d] text-base mb-1">{itemsCount} منتجات في الطلب</h3>
                    <div className="flex items-center gap-1">
                        <span className="text-lg font-black text-[#001d3d]">{order.total_amount?.toLocaleString() || 0} <span className="text-xs text-gray-500">ج.م</span></span>
                    </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex flex-col gap-2.5">
                    {isCancelled ? (
                        <div className="flex gap-2">
                            <button disabled className="flex-[2] flex items-center justify-center gap-2 bg-gray-100 text-gray-500 py-3 rounded-xl font-bold text-xs cursor-not-allowed">
                                <XCircle size={16} /> تم الغاء الطلب
                            </button>
                            <button 
                                onClick={() => onDeleteClick(order.id)}
                                className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100 py-3 rounded-xl font-bold text-xs transition-all shadow-sm"
                            >
                                <Trash2 size={16} /> حذف
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link href={`/orders/${order.id}`} className="w-full flex items-center justify-center gap-2 bg-[#f1f5f9] text-[#001d3d] hover:bg-[#e2e8f0] py-3 rounded-xl font-bold text-xs transition-colors group/btn">
                                <span>عرض التفاصيل</span>
                                <ArrowLeft size={16} className="group-hover/btn:-translate-x-1 transition-transform" />
                            </Link>

                            {isPending && (
                                <button 
                                    onClick={() => onCancelClick(order.id)}
                                    className="w-full flex items-center justify-center gap-2 border border-red-200 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white py-3 rounded-xl font-bold text-xs transition-all shadow-sm hover:shadow-red-200"
                                >
                                    <XCircle size={16} /> إلغاء الطلب
                                </button>
                            )}

                            {order.status === 'delivered' && (
                                <button className="w-full flex items-center justify-center gap-2 border border-[#001d3d] text-[#001d3d] bg-white hover:bg-[#001d3d] hover:text-white py-3 rounded-xl font-bold text-xs transition-all shadow-sm hover:shadow-[#001d3d]/20">
                                    <MessageCircle size={16} /> تواجه مشكلة في الطلب؟
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// =========================================================
// MAIN PAGE COMPONENT
// =========================================================
export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all'); 
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false); 

  // States للمودال الجديد (بديل الـ Alert)
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'cancel' | 'delete' | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // [2] جلب بيانات المستخدم
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return null;
      }
      return user;
    },
    staleTime: Infinity,
  });

  // [3] جلب بيانات البروفايل والطلبات
  const { data: profileData, isLoading: contentLoading } = useQuery({
    queryKey: ['profile-orders', userData?.id],
    queryFn: async () => {
      if (!userData?.id) return null;

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', userData.id)
        .single();

      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userData.id)
        .order('created_at', { ascending: false });

      return {
        profile: profile || { full_name: userData.email?.split('@')[0], avatar_url: null },
        orders: orders || []
      };
    },
    enabled: !!userData?.id,
    staleTime: 60 * 1000,
  });

  // [4] دوال التعديل (Mutations)
  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase.from('orders').update({ status: 'cancelled' }).eq('id', orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile-orders'] });
      setModalOpen(false);
    },
    onError: () => toast.error('خطأ في الإلغاء')
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile-orders'] });
      setModalOpen(false);
    },
    onError: () => toast.error('خطأ في الحذف')
  });

  // [5] Realtime Listener
  useEffect(() => {
    if (!userData?.id) return;
    const channel = supabase.channel(`realtime:orders:${userData.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${userData.id}` },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ['profile-orders'] });
          if (payload.eventType === 'UPDATE') {
             toast.info('تحديث طلب', { description: `تغيرت حالة الطلب #${payload.new.id.toString().slice(0,8)} إلى ${payload.new.status}` });
          }
        }
      ).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userData?.id, queryClient]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleActionClick = (type: 'cancel' | 'delete', id: string) => {
      setModalType(type);
      setSelectedOrderId(id);
      setModalOpen(true);
  };

  const confirmAction = () => {
      if (!selectedOrderId) return;
      if (modalType === 'cancel') cancelOrderMutation.mutate(selectedOrderId);
      if (modalType === 'delete') deleteOrderMutation.mutate(selectedOrderId);
  };

  const orders = profileData?.orders || [];
  const profile = profileData?.profile;

  const filteredOrders = orders.filter((order: any) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return order.status === 'pending';
    if (activeTab === 'completed') return order.status === 'delivered';
    if (activeTab === 'cancelled') return order.status === 'cancelled';
    return true;
  });

  const totalSpent = orders.filter((o: any) => o.status !== 'cancelled').reduce((sum: number, o: any) => sum + (o.total_amount || 0), 0);

  const filterOptions = [
    { id: 'all', label: 'كل الطلبات' },
    { id: 'pending', label: 'قيد التنفيذ' },
    { id: 'completed', label: 'المكتملة' },
    { id: 'cancelled', label: 'الملغاة' },
  ];

  if (userLoading || contentLoading) return <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]"><Loader2 className="w-12 h-12 text-[#001d3d] animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-right pb-32 lg:pb-12" dir="rtl">
      
      {/* 1. HEADER */}
      <section className="bg-[#001d3d] relative overflow-hidden pt-24 pb-10 lg:pt-32 lg:pb-16 border-b-4 border-[#e31e24]">
         <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
         <div className="max-w-[1600px] mx-auto px-4 lg:px-6 relative z-10 text-white">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="flex items-center gap-5 lg:gap-8">
                    <div className="w-20 h-20 lg:w-24 lg:h-24 rounded-2xl border-4 border-white/20 p-1 relative shadow-2xl">
                        {profile?.avatar_url ? (
                            <Image src={profile.avatar_url} alt="User" fill className="object-cover rounded-xl" />
                        ) : (
                            <div className="w-full h-full bg-white/10 rounded-xl flex items-center justify-center text-3xl font-black">{(userData?.email?.[0] || 'U').toUpperCase()}</div>
                        )}
                        <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 border-4 border-[#001d3d] rounded-full"></div>
                    </div>
                    <div>
                        <h1 className="text-3xl lg:text-5xl font-black tracking-tight mb-2">{profile?.full_name || 'يا هلا، كابتن يوسف'}</h1>
                        <p className="text-sm lg:text-base text-gray-300 font-bold flex items-center gap-3">
                             <span className="bg-[#e31e24] px-3 py-1 rounded-lg text-white text-xs">عضوية ذهبية</span>
                             <span className="opacity-50">|</span>
                             <span>{userData?.email}</span>
                        </p>
                    </div>
                </div>
                <div className="hidden lg:flex gap-4">
                    <div className="bg-white/10 border border-white/20 px-6 py-4 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all">
                        <span className="block text-xs text-gray-300 font-bold uppercase tracking-wider mb-1">المشتريات</span>
                        <span className="block text-2xl font-black">{totalSpent.toLocaleString()} <small className="text-sm">ج.م</small></span>
                    </div>
                    <div className="bg-white/10 border border-white/20 px-6 py-4 rounded-2xl backdrop-blur-sm hover:bg-white/20 transition-all">
                        <span className="block text-xs text-gray-300 font-bold uppercase tracking-wider mb-1">الطلبات</span>
                        <span className="block text-2xl font-black">{orders.length}</span>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* MOBILE STICKY BAR */}
      <div className="lg:hidden sticky top-0 z-20 bg-[#f8fafc]/95 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex gap-3 shadow-sm transition-all">
          <button onClick={() => setIsMobileFilterOpen(true)} className="flex-1 h-12 bg-[#001d3d] text-white rounded-xl flex items-center justify-center gap-2 text-sm font-black shadow-lg hover:bg-[#002a5c] active:scale-95 transition-all">
             <Filter size={18} /> تصفية الطلبات ({filterOptions.find(f=>f.id===activeTab)?.label})
          </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-[1600px] mx-auto px-4 lg:px-4 flex items-start relative mt-8 gap-8">
         <aside className="w-[300px] shrink-0 hidden lg:block sticky top-28 h-[calc(100vh-140px)]">
             <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-2 h-full flex flex-col overflow-hidden hover:overflow-y-auto custom-scrollbar">
                  <div className="mb-2 shrink-0">
                    <h3 className="px-4 pt-4 pb-2 font-black text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2">لوحة التحكم</h3>
                    <nav className="space-y-1">
                        <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl bg-[#001d3d] text-white font-black text-base shadow-lg shadow-[#001d3d]/20 transition-transform hover:scale-[1.02]">
                            <Package size={20} strokeWidth={2.5} /> طلباتي
                        </button>
                        <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-500 hover:bg-gray-50 hover:text-[#001d3d] font-bold text-base transition-all">
                            <Heart size={20} strokeWidth={2.5} /> المنتجات المفضلة
                        </button>
                        <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-500 hover:bg-gray-50 hover:text-[#001d3d] font-bold text-base transition-all">
                            <MapPin size={20} strokeWidth={2.5} /> العناوين المحفوظة
                        </button>
                        <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-500 hover:bg-gray-50 hover:text-[#001d3d] font-bold text-base transition-all">
                            <Settings size={20} strokeWidth={2.5} /> إعدادات الحساب
                        </button>
                        <button className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-500 hover:bg-gray-50 hover:text-[#001d3d] font-bold text-base transition-all">
                            <HelpCircle size={20} strokeWidth={2.5} /> مركز المساعدة
                        </button>
                    </nav>
                  </div>
                  <div className="h-px bg-gray-100 mx-4 my-2 shrink-0"></div>
                  <div className="pb-2 flex-1">
                      <h3 className="px-4 pt-2 pb-2 font-black text-gray-400 text-xs uppercase tracking-wider flex items-center gap-2">حالة الطلب</h3>
                      <div className="space-y-1">
                        {filterOptions.map(opt => (
                            <button key={opt.id} onClick={() => setActiveTab(opt.id)}
                               className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-all ${activeTab === opt.id ? 'bg-[#e31e24]/10 text-[#e31e24]' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                <span className={activeTab === opt.id ? 'font-black' : ''}>{opt.label}</span>
                                {activeTab === opt.id && <Check size={18} strokeWidth={3} />}
                            </button>
                        ))}
                      </div>
                  </div>
                  <div className="h-px bg-gray-100 mx-4 my-2 shrink-0"></div>
                  <div className="p-2 shrink-0 mt-auto">
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 bg-red-50 hover:bg-red-100 font-black text-sm transition-colors">
                        <LogOut size={18} strokeWidth={2.5} /> تسجيل خروج
                      </button>
                  </div>
             </div>
         </aside>

         <div className="flex-1 w-full min-h-[600px]">
             <div className="hidden lg:flex items-center justify-between mb-6">
                 <h2 className="text-2xl font-black text-[#001d3d] flex items-center gap-3">
                    سجل الطلبات 
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-bold">{filteredOrders.length} طلب</span>
                 </h2>
                 <div className="relative group w-80">
                     <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#001d3d] transition-colors" />
                     <input type="text" placeholder="ابحث برقم الطلب..." className="w-full bg-white border border-gray-200 rounded-2xl h-12 pr-11 pl-4 text-sm font-bold outline-none focus:border-[#001d3d] focus:ring-4 focus:ring-[#001d3d]/5 transition-all shadow-sm" />
                 </div>
             </div>

             <AnimatePresence mode="wait">
                {filteredOrders.length === 0 ? (
                    <motion.div initial={{opacity:0}} animate={{opacity:1}} className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[2rem] border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300">
                            <ShoppingBag size={32} />
                        </div>
                        <h3 className="text-xl font-black text-[#001d3d]">لا توجد طلبات هنا</h3>
                        <p className="text-gray-500 mt-2 font-medium">لم نجد أي طلبات تطابق الفلتر الحالي.</p>
                        <button onClick={() => setActiveTab('all')} className="mt-6 px-8 py-3 bg-[#001d3d] text-white rounded-xl font-bold hover:bg-[#e31e24] transition-all shadow-lg">عرض كل الطلبات</button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {filteredOrders.map((order: any) => (
                            <OrderCard 
                                key={order.id} 
                                order={order} 
                                onCancelClick={(id) => handleActionClick('cancel', id)}
                                onDeleteClick={(id) => handleActionClick('delete', id)}
                            />
                        ))}
                    </div>
                )}
             </AnimatePresence>
         </div>
      </div>

      {/* CONFIRMATION MODAL (The Elegant Way) */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="fixed inset-0 bg-black/60 z-[999] backdrop-blur-[2px]" />
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 pointer-events-none">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.9, opacity: 0, y: 20 }} 
                className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl pointer-events-auto border border-gray-100"
              >
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${modalType === 'cancel' ? 'bg-orange-50 text-orange-500' : 'bg-red-50 text-red-500'}`}>
                  {modalType === 'cancel' ? <AlertTriangle size={32} /> : <Trash2 size={32} />}
                </div>
                
                <h3 className="text-xl font-black text-[#001d3d] text-center mb-2">
                  {modalType === 'cancel' ? 'تأكيد إلغاء الطلب' : 'حذف الطلب نهائياً'}
                </h3>
                
                <p className="text-gray-500 text-sm text-center mb-6 leading-relaxed px-4">
                  {modalType === 'cancel' 
                    ? 'هل أنت متأكد أنك تريد إلغاء هذا الطلب؟ لن يتم شحنه إليك.' 
                    : 'سيتم حذف هذا الطلب من سجلك تماماً ولا يمكن استعادته مرة أخرى.'
                  }
                </p>

                <div className="flex gap-3">
                  <button onClick={() => setModalOpen(false)} className="flex-1 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-bold text-sm transition-colors">
                    تراجع
                  </button>
                  <button 
                    onClick={confirmAction}
                    className={`flex-1 py-3.5 text-white rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95 ${
                      modalType === 'cancel' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-red-500 hover:bg-red-600'
                    }`}
                  >
                    {modalType === 'cancel' ? 'نعم، إلغاء' : 'تأكيد الحذف'}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
         {isMobileFilterOpen && (
           <>
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileFilterOpen(false)} className="fixed inset-0 bg-black/60 z-[50] lg:hidden backdrop-blur-sm" />
             <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-[60] lg:hidden flex flex-col shadow-[0_-10px_60px_rgba(0,0,0,0.2)]">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-black text-[#001d3d] text-xl">تصفية الطلبات</h3>
                    <button onClick={() => setIsMobileFilterOpen(false)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-3">
                    {filterOptions.map((opt) => (
                        <button key={opt.id} onClick={() => { setActiveTab(opt.id); setIsMobileFilterOpen(false); }} className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${activeTab === opt.id ? 'bg-[#001d3d] text-white border-[#001d3d] shadow-lg' : 'bg-white border-gray-100 text-gray-600 hover:border-gray-200'}`}>
                            <span className="font-black text-base">{opt.label}</span>
                            {activeTab === opt.id && <CheckCircle2 size={20} className="text-[#e31e24]" />}
                        </button>
                    ))}
                </div>
             </motion.div>
           </>
         )}
      </AnimatePresence>
    </div>
  );
}