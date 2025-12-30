'use client';

import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { 
  Bell, CheckCircle2, AlertTriangle, Info, ArrowRight, 
  Loader2, UserX, ShoppingBag, BellOff, Calendar, Trash2, Wifi, WifiOff, X
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

// [1] استيراد أدوات المحرك
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

export default function NotificationsPage() {
    const [selectedNotif, setSelectedNotif] = useState<any>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const queryClient = useQueryClient();

    // مودال الحذف
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [dontAskAgain, setDontAskAgain] = useState(false);

    // 1. جلب بيانات المستخدم مرة واحدة
    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) setUserId(session.user.id);
        };
        getUser();
    }, []);

    // [2] جلب البيانات باستخدام المحرك (React Query)
    // لاحظ: staleTime: Infinity عشان نعتمد كلياً على التحديثات اللي هتيجي من البرج
    const { data: notifications = [], isLoading } = useQuery({
        queryKey: ['notifications', userId],
        queryFn: async () => {
            if (!userId) return [];
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            
            // لو مفيش حاجة مختارة، اختار أول إشعار تلقائياً
            if (data && data.length > 0 && !selectedNotif) {
                setSelectedNotif(data[0]);
            }
            return data;
        },
        enabled: !!userId,
        staleTime: Infinity, 
    });

    // [3] دالة الحذف (Mutation)
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('notifications').delete().eq('id', id);
            if (error) throw error;
            return id;
        },
        onSuccess: (deletedId) => {
            // تحديث الكاش يدوياً فوراً
            queryClient.setQueryData(['notifications', userId], (old: any[] | undefined) => 
                old ? old.filter((n) => n.id !== deletedId) : []
            );
            
            if (selectedNotif?.id === deletedId) setSelectedNotif(null);
            
            toast.success('تم الحذف', { 
                description: 'تم مسح الإشعار من صندوق الوارد.',
                duration: 5000,
                action: { label: 'فهمت', onClick: () => {} }
            });
            setShowDeleteModal(false);
        },
        onError: () => {
            toast.error('فشل الحذف', { description: 'عفواً، حدث خطأ أثناء محاولة الحذف.' });
        }
    });

    // منطق الحذف
    const onRequestDelete = (id: string) => {
        const skipConfirm = localStorage.getItem('skipDeleteConfirm');
        if (skipConfirm === 'true') {
            deleteMutation.mutate(id);
        } else {
            setItemToDelete(id);
            setShowDeleteModal(true);
            setDontAskAgain(false); 
        }
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            if (dontAskAgain) localStorage.setItem('skipDeleteConfirm', 'true');
            deleteMutation.mutate(itemToDelete);
        }
    };

    // Helper functions للـ UI
    const getIcon = (type: string, size = 20) => {
        switch(type) {
            case 'success': return <CheckCircle2 size={size} className="text-green-500" />;
            case 'warning': return <AlertTriangle size={size} className="text-orange-500" />;
            default: return <Info size={size} className="text-blue-500" />;
        }
    };

    const getBgColor = (type: string) => {
        switch(type) {
            case 'success': return 'bg-green-50 text-green-700 border-green-100';
            case 'warning': return 'bg-orange-50 text-orange-700 border-orange-100';
            default: return 'bg-blue-50 text-blue-700 border-blue-100';
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] lg:bg-white text-right font-sans" dir="rtl">
            {/* Mobile Header */}
            <div className="lg:hidden p-4 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600">
                        <ArrowRight size={20} />
                    </Link>
                    <h1 className="text-xl font-black text-[#001d3d]">الإشعارات</h1>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto h-[calc(100vh-80px)]">
                {isLoading ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <Loader2 className="animate-spin w-10 h-10 mb-4 text-[#001d3d]" />
                        <p>جاري تحميل الإشعارات...</p>
                    </div>
                ) : !userId ? (
                    <div className="h-full flex items-center justify-center p-4">
                         <div className="text-center max-w-md bg-white p-10 rounded-3xl border border-gray-100 shadow-xl">
                            <UserX size={40} className="text-red-500 mx-auto mb-4" />
                            <h3 className="text-xl font-black mb-4">يجب تسجيل الدخول أولاً</h3>
                            <Link href="/login" className="px-8 py-3 bg-[#001d3d] text-white rounded-xl font-bold">دخول</Link>
                         </div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <BellOff size={60} className="text-gray-200 mb-4" />
                        <h3 className="text-xl font-black text-gray-400">لا توجد إشعارات حالياً</h3>
                    </div>
                ) : (
                    <div className="flex h-full lg:overflow-hidden bg-white lg:rounded-2xl lg:shadow-2xl lg:border border-gray-200 lg:my-4 lg:mx-8">
                        {/* Sidebar List */}
                        <div className="w-full lg:w-[400px] xl:w-[450px] bg-white lg:bg-gray-50/50 lg:border-l border-gray-200 overflow-y-auto h-full p-4 lg:p-0 custom-scrollbar">
                            <div className="hidden lg:flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
                                <h2 className="text-xl font-black text-[#001d3d]">الوارد ({notifications.length})</h2>
                            </div>
                            <div className="space-y-2 lg:p-4">
                                {notifications.map((notif: any) => (
                                    <button 
                                        key={notif.id}
                                        onClick={() => setSelectedNotif(notif)}
                                        className={`w-full text-right p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${selectedNotif?.id === notif.id ? 'bg-white border-[#e31e24] shadow-md ring-1 ring-[#e31e24]/20' : 'bg-white border-transparent hover:bg-gray-100'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.is_read ? 'bg-gray-100 text-gray-400' : 'bg-[#e31e24]/10 text-[#e31e24]'}`}>
                                            {getIcon(notif.type, 18)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-bold truncate mb-1">{notif.title}</h4>
                                            <p className="text-xs text-gray-500 line-clamp-2">{notif.message}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Detail View */}
                        {selectedNotif && (
                            <div className="hidden lg:flex flex-1 flex-col bg-white h-full overflow-y-auto relative animate-in fade-in slide-in-from-bottom-4 duration-500 custom-scrollbar">
                                <div className="p-8 border-b border-gray-100 flex items-start justify-between bg-white sticky top-0 z-10">
                                    <div className="flex gap-4">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm border ${getBgColor(selectedNotif.type)}`}>
                                            {getIcon(selectedNotif.type, 32)}
                                        </div>
                                        <div>
                                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-2 ${getBgColor(selectedNotif.type)}`}>
                                                إشعار {selectedNotif.type}
                                            </div>
                                            <h1 className="text-3xl font-black text-[#001d3d] leading-tight">{selectedNotif.title}</h1>
                                        </div>
                                    </div>
                                    <div className="text-left text-gray-400 text-xs">
                                        <div className="flex items-center gap-2 justify-end mb-1"><Calendar size={14} /> {new Date(selectedNotif.created_at).toLocaleDateString('ar-EG')}</div>
                                        <div>{new Date(selectedNotif.created_at).toLocaleTimeString('ar-EG')}</div>
                                    </div>
                                </div>

                                <div className="p-10 flex-1">
                                    <div className="prose max-w-none text-gray-600 leading-8 text-lg mb-10">{selectedNotif.message}</div>
                                    
                                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-[#001d3d]"><ShoppingBag size={20} /></div>
                                        <div><h4 className="font-bold text-[#001d3d]">استكشف المنتجات</h4><p className="text-sm text-gray-500">تصفح أحدث القطع المضافة حديثاً.</p></div>
                                        <Link href="/" className="mr-auto px-6 py-3 bg-[#001d3d] text-white rounded-xl font-bold hover:bg-[#e31e24] transition-colors">الرئيسية</Link>
                                    </div>
                                </div>

                                <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center mt-auto">
                                    <button 
                                        onClick={() => onRequestDelete(selectedNotif.id)}
                                        disabled={deleteMutation.isPending}
                                        className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
                                    >
                                        {deleteMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />} 
                                        حذف هذا الإشعار
                                    </button>
                                    <span className="text-[10px] text-gray-300 font-mono">Ref: {selectedNotif.id}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
                    <div className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={32} className="text-red-500" /></div>
                            <h3 className="text-xl font-black text-[#001d3d] mb-2">تأكيد الحذف</h3>
                            <p className="text-sm text-gray-500">هل أنت متأكد؟ لا يمكن التراجع عن هذا الإجراء.</p>
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-3">
                            <div className="flex gap-3">
                                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold cursor-pointer">إلغاء</button>
                                <button onClick={confirmDelete} className="flex-1 py-3 bg-[#e31e24] text-white rounded-xl font-bold shadow-lg cursor-pointer">نعم، احذف</button>
                            </div>
                            <label className="flex items-center justify-center gap-2 cursor-pointer group">
                                <input type="checkbox" checked={dontAskAgain} onChange={(e) => setDontAskAgain(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#001d3d] cursor-pointer" />
                                <span className="text-xs font-bold text-gray-400 group-hover:text-gray-600 transition-colors">عدم السؤال مرة أخرى</span>
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}