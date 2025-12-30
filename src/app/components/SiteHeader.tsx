'use client';
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; 
import { 
  Phone, Mail, Search, Heart, User, 
  ShoppingBag, Bell, ShoppingCart, ChevronDown, LogOut,
  Menu, X, Home, BadgePercent, MessageSquare, 
  HelpCircle, FileText, MapPin, Truck,
  Camera, Edit3, Box, Settings, ChevronRight, Check, Loader2,
  Sun, Moon, Laptop, Shirt, ShoppingBasket, Armchair
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCart } from './CartSystem'; 
import { motion, AnimatePresence } from 'framer-motion';

// =========================================================
// 0. Hook الذكي
// =========================================================
const useSmartUser = () => {
  const [user, setUser] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);

  const fetchLiveData = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      setUser(authUser);
      const { data: profile } = await supabase 
        .from('users') 
        .select('avatar_url, full_name')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        setAvatarUrl(profile.avatar_url); 
        setFullName(profile.full_name);
      } else {
        setAvatarUrl(authUser.user_metadata?.avatar_url || null);
        setFullName(authUser.user_metadata?.full_name || null);
      }
    }
  };

  useEffect(() => {
    fetchLiveData();
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setAvatarUrl(null);
        setFullName(null);
      } else if (session?.user) {
        fetchLiveData(); 
      }
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, avatarUrl, fullName, refetchUser: fetchLiveData };
};

// =========================================================
// 1. القائمة الجانبية (Global Sidebar)
// =========================================================
export const GlobalSidebar = ({ isOpen, onClose }: any) => {
  const { user, avatarUrl, fullName } = useSmartUser();
  const { closeCart } = useCart(); 
  
  const [imgError, setImgError] = useState(false);
  useEffect(() => { setImgError(false); }, [avatarUrl]);
  const isLoggedIn = !!user;

  const handleNavigation = () => {
    onClose();    
    closeCart(); 
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; 
    } else {
      document.body.style.overflow = 'unset'; 
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <>
      <div 
        className={`fixed inset-0 top-[56px] lg:top-[76px] bg-black/50 z-[99] transition-opacity duration-500 cursor-pointer ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      ></div>
      
      <aside 
        className={`fixed top-[56px] lg:top-[76px] right-0 h-[calc(100vh-56px)] lg:h-[calc(100vh-76px)] w-[280px] lg:w-[300px] bg-white z-[100] shadow-2xl border-l border-gray-100 transform transition-transform duration-500 cubic-bezier(0.32, 0.72, 0, 1) flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex-1 overflow-y-auto px-3 py-6 pt-14 lg:pt-8 space-y-6">
           {/* التنقل السريع */}
           <div>
              <p className="text-sm text-gray-500 font-black px-3 mb-3 uppercase tracking-wider">التنقل السريع</p>
              <div className="space-y-2">
                <Link href="/" onClick={handleNavigation} className="flex items-center gap-4 px-4 py-4 rounded-2xl bg-gray-50 text-[#6c0dfa] font-black text-lg hover:bg-[#6c0dfa] hover:text-white transition-all group cursor-pointer shadow-sm">
                  <Image src="/logo/homeIconActive.svg" width={32} height={32} alt="Home" className="group-hover:brightness-0 group-hover:invert transition-all" />
                  الرئيسية
                </Link>
                <Link href="/offers" onClick={handleNavigation} className="flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-700 font-bold text-base hover:bg-red-50 hover:text-[#e31e24] transition-all group cursor-pointer hover:shadow-md">
                  <BadgePercent size={28} /> العروض والتخفيضات
                </Link>
                <Link href="/track-order" onClick={handleNavigation} className="flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-700 font-bold text-base hover:bg-blue-50 hover:text-blue-600 transition-all group cursor-pointer hover:shadow-md">
                  <Truck size={28} /> تتبع شحنتك
                </Link>
              </div>
           </div>

           <div className="h-px bg-gray-100 mx-2"></div>

           {/* أقسام المتجر */}
           <div>
              <p className="text-xs text-gray-500 font-bold px-3 mb-2 uppercase tracking-wider">أقسام المتجر</p>
              <div className="space-y-1">
                 <Link href="/collection/supermarket" onClick={handleNavigation} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-gray-800 hover:bg-gray-50 hover:text-[#6c0dfa] transition-all cursor-pointer">
                    <ShoppingBasket size={18} className="text-gray-400" /> سوبر ماركت
                 </Link>
                 <Link href="/collection/fashion" onClick={handleNavigation} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-gray-800 hover:bg-gray-50 hover:text-[#6c0dfa] transition-all cursor-pointer">
                    <Shirt size={18} className="text-gray-400" /> أزياء وموضة
                 </Link>
                 <Link href="/collection/home-appliances" onClick={handleNavigation} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-gray-800 hover:bg-gray-50 hover:text-[#6c0dfa] transition-all cursor-pointer">
                    <Laptop size={18} className="text-gray-400" /> أجهزة منزلية
                 </Link>
                 <Link href="/collection/home-office" onClick={handleNavigation} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-gray-800 hover:bg-gray-50 hover:text-[#6c0dfa] transition-all cursor-pointer">
                    <Armchair size={18} className="text-gray-400" /> البيت والمكتب
                 </Link>
              </div>
           </div>

           <div className="h-px bg-gray-100 mx-2"></div>

           {/* مركز المساعدة */}
           <div>
              <p className="text-xs text-gray-500 font-bold px-3 mb-2 uppercase tracking-wider">مركز المساعدة</p>
              <div className="space-y-1">
                 <Link href="/contact" onClick={handleNavigation} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-gray-800 hover:bg-gray-50 hover:text-[#6c0dfa] transition-all cursor-pointer">
                    <MessageSquare size={18} className="text-gray-400" /> تواصل معنا
                 </Link>
                 <Link href="/return-policy" onClick={handleNavigation} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-gray-800 hover:bg-gray-50 hover:text-[#6c0dfa] transition-all cursor-pointer">
                    <FileText size={18} className="text-gray-400" /> سياسة الاسترجاع
                 </Link>
              </div>
           </div>
           
           <div className="h-4"></div>
        </div>
        
        {/* Footer Sidebar */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/80 backdrop-blur-sm mt-auto">
          {isLoggedIn ? (
            <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-gray-200 shadow-sm transition-all">
               <Link href="/profile" onClick={handleNavigation} className="flex items-center gap-3 flex-1 hover:opacity-80 transition-opacity">
                 {avatarUrl && !imgError ? (
                   <div className="relative w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden">
                     <Image src={avatarUrl} onError={() => setImgError(true)} fill className="object-cover" alt="Profile" />
                   </div>
                 ) : (
                   <div className="w-10 h-10 rounded-full bg-[#6c0dfa] text-white flex items-center justify-center font-black text-sm border-2 border-white shadow uppercase">
                     {(fullName || user.email)?.charAt(0)}
                   </div>
                 )}
                 <div className="flex flex-col">
                   <span className="text-xs text-gray-500 font-bold">مرحباً</span>
                   <span className="text-base font-black text-[#6c0dfa] leading-tight truncate max-w-[140px]">
                     {fullName || user.email?.split('@')[0]}
                   </span>
                 </div>
               </Link>
               <button onClick={() => { supabase.auth.signOut(); handleNavigation(); }} className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all cursor-pointer">
                 <LogOut size={16} className="rtl:rotate-180" /> 
               </button>
            </div>
          ) : (
            <Link href="/login" onClick={handleNavigation} className="flex items-center justify-center gap-2 w-full h-12 bg-[#6c0dfa] hover:bg-[#5a0ac9] text-white rounded-xl font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
              <User size={18} /> تسجيل الدخول
            </Link>
          )}
        </div>
      </aside>
    </>
  );
};

// =========================================================
// 2. قائمة المستخدم (User Menu)
// =========================================================
const UserMenu = ({ isMobile = false, setIsSidebarOpen }: { isMobile?: boolean, setIsSidebarOpen?: (v: boolean) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, avatarUrl, fullName, refetchUser } = useSmartUser(); 
  const { closeCart } = useCart(); 
  const [imgError, setImgError] = useState(false); 
  const menuRef = useRef<HTMLDivElement>(null);
  
  // States for Editing
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [isSavingName, setIsSavingName] = useState(false);

  useEffect(() => { setImgError(false); }, [avatarUrl]);
  useEffect(() => { setMounted(true); }, []);
  
  useEffect(() => {
      if (fullName) setNewName(fullName);
  }, [fullName]);

  useEffect(() => {
    if (!isMobile) {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setIsEditingName(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobile]);

  const handleToggle = () => {
    if (!isMobile) {
      setIsOpen(!isOpen);
      return;
    }
    if (!isOpen) {
      if (setIsSidebarOpen) setIsSidebarOpen(true); 
      setTimeout(() => setIsOpen(true), 300);
    } else {
      setIsOpen(false);
      setTimeout(() => { if (setIsSidebarOpen) setIsSidebarOpen(false); }, 500);
    }
  };

  const handleItemClick = () => {
    closeCart(); 
    if (isMobile) {
        setIsOpen(false);
        setTimeout(() => { if (setIsSidebarOpen) setIsSidebarOpen(false); }, 500);
    } else {
        setIsOpen(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;
      setIsUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars') 
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      await refetchUser();
    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('حدث خطأ أثناء رفع الصورة');
    } finally {
      setIsUploading(false);
    }
  };

  const handleNameUpdate = async () => {
      if (!newName.trim() || newName === fullName) {
          setIsEditingName(false);
          return;
      }
      try {
          setIsSavingName(true);
          const { error } = await supabase
            .from('users')
            .update({ full_name: newName })
            .eq('id', user.id);
          
          if (error) throw error;

          await supabase.auth.updateUser({
            data: { full_name: newName }
          });

          await refetchUser();
          setIsEditingName(false);
      } catch (error) {
          console.error('Error updating name:', error);
          alert('حدث خطأ أثناء تحديث الاسم');
      } finally {
          setIsSavingName(false);
      }
  };

  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobile, isOpen]);

  const isLoggedIn = !!user;

  const menuItems = [
    { label: 'ملفي الشخصي', href: '/profile', icon: User },
    { label: 'طلباتي السابقة', href: '/orders', icon: Box },
    { label: 'العناوين المحفوظة', href: '/addresses', icon: MapPin },
    { label: 'المفضلة', href: '/wishlist', icon: Heart },
    { label: 'الإعدادات', href: '/settings', icon: Settings }
  ];

  const TriggerButton = (
    <button 
      onClick={handleToggle} 
      className={`relative w-10 h-10 rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer overflow-hidden border ${
        isOpen 
          ? 'border-[#6c0dfa] bg-purple-50 text-[#6c0dfa] scale-110' 
          : 'border-transparent hover:border-gray-200 hover:bg-gray-50 text-gray-600'
      }`}
    >
      {isLoggedIn && avatarUrl && !imgError ? (
        <div className="relative w-8 h-8 rounded-full overflow-hidden shadow-sm">
          <Image src={avatarUrl} onError={() => setImgError(true)} fill className="object-cover" alt="User" />
        </div>
      ) : (
        <User size={22} strokeWidth={2} />
      )}
    </button>
  );

  const renderProfileCardContent = (isInMobileModal: boolean) => (
    <>
      <div className={`flex flex-col items-center ${isInMobileModal ? '' : ''}`}>
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="relative mb-4 group"
          >
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
            />

            <div 
                onClick={isUploading ? undefined : handleAvatarClick}
                className={`rounded-full p-1 border-2 border-dashed border-[#6c0dfa]/30 cursor-pointer ${isInMobileModal ? 'w-24 h-24' : 'w-20 h-20'}`}
            >
                <div className="w-full h-full rounded-full overflow-hidden relative border-4 border-white shadow-lg bg-[#6c0dfa] text-white flex items-center justify-center text-3xl font-black">
                  {isUploading ? (
                      <Loader2 className="animate-spin text-white" />
                  ) : (
                      avatarUrl && !imgError ? (
                        <Image src={avatarUrl} onError={() => setImgError(true)} fill className="object-cover" alt="Profile" />
                      ) : (
                        (fullName || user.email)?.charAt(0)
                      )
                  )}
                </div>
            </div>
            
            <button 
                onClick={handleAvatarClick}
                className="absolute bottom-0 right-0 w-7 h-7 bg-[#6c0dfa] text-white rounded-full flex items-center justify-center border-2 border-white shadow-md hover:bg-[#5a0ac9] transition-colors"
                title="تغيير الصورة"
            >
                <Camera size={14} />
            </button>
          </motion.div>

          <div className="flex items-center justify-center gap-2 mb-1 w-full px-4">
            {isEditingName ? (
                <div className="flex items-center gap-2 w-full">
                    <input 
                        type="text" 
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full text-center border-b-2 border-[#6c0dfa] focus:outline-none bg-transparent font-bold text-[#001d3d] text-sm py-1"
                        autoFocus
                    />
                    <button onClick={handleNameUpdate} disabled={isSavingName} className="text-green-600 hover:text-green-700">
                        {isSavingName ? <Loader2 size={16} className="animate-spin"/> : <Check size={18} />}
                    </button>
                    <button onClick={() => setIsEditingName(false)} className="text-red-500 hover:text-red-600">
                        <X size={18} />
                    </button>
                </div>
            ) : (
                <>
                    <h3 className={`font-black text-[#001d3d] truncate max-w-[180px] ${isInMobileModal ? 'text-xl' : 'text-lg'}`}>
                        {fullName || 'ضيف الكابتن'}
                    </h3>
                    <button onClick={() => setIsEditingName(true)} className="text-gray-400 hover:text-[#6c0dfa] transition-colors p-1" title="تعديل الاسم">
                        <Edit3 size={14} />
                    </button>
                </>
            )}
          </div>
          <p className="text-xs font-medium text-gray-500 truncate max-w-full px-4">{user.email}</p>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        {TriggerButton}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }} 
                onClick={handleToggle} 
                className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-[2px] lg:hidden"
              />
              <motion.div 
                initial={{ y: "100%" }} 
                animate={{ y: 0 }} 
                exit={{ y: "100%" }} 
                transition={{ type: "spring", stiffness: 100, damping: 20, mass: 1.2 }}
                className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-[110] lg:hidden flex flex-col shadow-[0_-10px_60px_rgba(0,0,0,0.2)] overflow-hidden max-h-[85vh]"
              >
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mt-4 mb-2"></div>
                <div className="p-6 pt-2 border-b border-gray-100 bg-gradient-to-b from-gray-50 to-white">
                  {isLoggedIn ? (
                    renderProfileCardContent(true)
                  ) : (
                    <div className="text-center py-4">
                        <h3 className="text-lg font-black text-[#001d3d] mb-2">مرحباً بك في الكابتن</h3>
                        <p className="text-gray-500 text-sm mb-6">سجل دخولك لتستمتع بكافة المميزات وتتابع طلباتك</p>
                        <Link href="/login" onClick={handleItemClick} className="w-full block py-4 bg-[#6c0dfa] text-white rounded-2xl font-bold shadow-lg shadow-[#6c0dfa]/20 active:scale-95 transition-transform">
                          تسجيل الدخول / إنشاء حساب
                        </Link>
                    </div>
                  )}
                </div>
                {isLoggedIn && (
                  <div className="p-6 space-y-2 overflow-y-auto">
                    {menuItems.map((item, i) => (
                      <Link key={i} href={item.href} onClick={handleItemClick} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 transition-all group">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#6c0dfa] shadow-sm group-hover:bg-[#6c0dfa] group-hover:text-white transition-colors">
                              <item.icon size={18} />
                           </div>
                           <span className="font-bold text-[#001d3d]">{item.label}</span>
                        </div>
                        <ChevronRight size={18} className="text-gray-300 rtl:rotate-180" />
                      </Link>
                    ))}
                    <button onClick={() => { supabase.auth.signOut(); handleItemClick(); }} className="w-full mt-4 flex items-center justify-center gap-2 p-4 text-red-500 font-bold bg-red-50 rounded-2xl hover:bg-red-100 transition-colors">
                      <LogOut size={18} /> تسجيل خروج
                    </button>
                  </div>
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Desktop View
  return (
    <div className="relative z-40 h-10 flex items-center" ref={menuRef}>
      {isOpen && mounted && createPortal(
        <div 
          className="fixed inset-0 top-[76px] bg-black/50 z-[109] cursor-pointer"
          onClick={() => setIsOpen(false)}
        ></div>,
        document.body
      )}

      {TriggerButton}

      <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 origin-top z-[120] ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-gray-100 rotate-45"></div>
        <div className="p-5 bg-gray-50/80 border-b border-gray-100 text-center backdrop-blur-sm relative z-10 rounded-t-2xl">
          {isLoggedIn ? (
            renderProfileCardContent(false)
          ) : (
            <div>
              <p className="text-sm text-gray-600 font-bold mb-4">سجل دخولك لتجربة تسوق أفضل</p>
              <Link href="/login" onClick={handleItemClick} className="block w-full py-3 bg-[#6c0dfa] hover:bg-[#5a0ac9] text-white rounded-xl font-bold text-xs transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 cursor-pointer">
                تسجيل الدخول
              </Link>
              <div className="mt-3 text-[11px] text-gray-500 font-bold flex justify-center gap-1">
                <span>ليس لديك حساب؟</span>
                <Link href="/login" onClick={handleItemClick} className="text-[#6c0dfa] hover:underline cursor-pointer">انضم للكابتن</Link>
              </div>
            </div>
          )}
        </div>
        <div className="p-2 relative z-10 bg-white rounded-b-2xl">
          {menuItems.map((item, i) => (
            <Link key={i} href={item.href} onClick={handleItemClick} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-600 hover:text-[#6c0dfa] transition-colors">
              <item.icon size={16} /> <span>{item.label}</span>
            </Link>
          ))}
          {isLoggedIn && (
            <button onClick={() => { supabase.auth.signOut(); handleItemClick(); }} className="w-full mt-1 flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
              <LogOut size={16} /> <span>تسجيل خروج</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// =========================================================
// 3. الهيدر الرئيسي (Site Header)
// =========================================================
export const SiteHeader = () => {
  const pathname = usePathname();
  const { isSidebarOpen, setIsSidebarOpen } = useStore();
  const { openCart, closeCart, total, items } = useCart(); 
  
  // ✅ 1. تعريف حالة الوضع المظلم
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [profileActive, setProfileActive] = useState(false);

  // ✅ 2. تهيئة الوضع عند التحميل (قراءة من المتصفح أو LocalStorage)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  // ✅ 3. دالة التبديل
  const toggleTheme = (mode: 'light' | 'dark') => {
    if (mode === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
     if (!isSidebarOpen) setProfileActive(false);
  }, [isSidebarOpen]);

  if (pathname === '/login') return null;

  return (
    <>
      <GlobalSidebar isOpen={isSidebarOpen && !profileActive} onClose={() => setIsSidebarOpen(false)} />

      {/* Desktop Top Bar */}
      <div className="bg-[#0f172a] text-gray-300 py-1.5 border-b border-gray-800 text-[11px] font-medium hidden lg:block relative z-[111]">
        <div className="w-full px-4 flex justify-between items-center">
          <div className="flex gap-6">
            <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
              <Phone size={13} className="text-[#6c0dfa]" /> خدمة العملاء: <b className="font-sans text-white">19011</b>
            </span>
            <span className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
              <Mail size={13} className="text-[#6c0dfa]" /> support@kenzz.com
            </span>
          </div>
          <div className="flex gap-5">
            <span className="hover:text-[#6c0dfa] transition-colors cursor-pointer">تتبع شحنتك</span>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <header className="hidden lg:flex sticky top-0 z-[110] bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all">
        <div className="w-full px-4 h-[76px] flex items-center justify-between gap-4">
          <div className="flex items-center gap-6 shrink-0">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${isSidebarOpen && !profileActive ? 'bg-[#6c0dfa] text-white' : 'bg-gray-50 text-[#001d3d] hover:bg-gray-100'}`}
            >
              {isSidebarOpen && !profileActive ? <X size={24} /> : <Menu size={24} strokeWidth={2.5} />}
            </button>

            <Link href="/" onClick={closeCart} className="flex items-center gap-2 cursor-pointer group">
              <Image src="/logo/kenzz_small_logo.svg" alt="Kenzz" width={40} height={40} className="object-contain" priority />
              <span className="text-3xl font-black text-[#6c0dfa] tracking-tighter italic" style={{ fontFamily: 'Tahoma, sans-serif' }}>كنز</span>
            </Link>
            
            {/* ✅ أزرار التبديل المتصلة بالدالة الحقيقية */}
            <div className="bg-gray-100 p-1 rounded-full flex gap-1 mr-4">
              <button 
                onClick={() => toggleTheme('light')} 
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${!isDarkMode ? 'bg-white shadow text-yellow-500' : 'text-gray-400 hover:text-gray-600'}`}
                title="وضع نهاري"
              >
                <Sun size={16} />
              </button>
              <button 
                onClick={() => toggleTheme('dark')} 
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isDarkMode ? 'bg-[#001d3d] shadow text-white' : 'text-gray-400 hover:text-gray-600'}`}
                title="وضع ليلي"
              >
                <Moon size={16} />
              </button>
            </div>
          </div>

          <div className="flex flex-1 max-w-2xl relative group h-11">
            <input type="text" className="w-full h-full bg-white border border-gray-200 rounded-full focus:border-[#6c0dfa] focus:ring-1 focus:ring-[#6c0dfa] block pr-14 pl-6 text-sm text-gray-700 transition-all placeholder:text-gray-400 font-medium shadow-sm hover:border-gray-300" placeholder="ابحث عن منتج، براند، أو فئة..." />
            <button className="absolute inset-y-1 right-1 w-12 rounded-full flex items-center justify-center text-gray-400 hover:text-[#6c0dfa] transition-colors hover:bg-gray-50 cursor-pointer">
              <Search size={18} />
            </button>
          </div>

          <div className="flex items-center gap-5 shrink-0">
            <div className="flex items-center gap-3 text-gray-600">
               <Link href="/notifications" onClick={closeCart} className="w-10 h-10 hover:bg-purple-50 rounded-full transition-colors flex items-center justify-center hover:text-[#6c0dfa] cursor-pointer" title="الإشعارات">
                 <Bell size={22} strokeWidth={2} />
               </Link>
               <button className="w-10 h-10 hover:bg-purple-50 rounded-full transition-colors flex items-center justify-center hover:text-[#6c0dfa] cursor-pointer"><Heart size={22} strokeWidth={2} /></button>
               <UserMenu isMobile={false} />
            </div>
            
            <button onClick={openCart} className="group relative flex items-center justify-between w-[130px] h-11 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full pl-1 pr-1 transition-all duration-300 cursor-pointer"
            style={{ background: 'linear-gradient(90deg, #6c0dfa 0%, #5a0ac9 100%)' }}>
              <div className="flex flex-col items-start leading-none pl-4 z-10 text-white">
                 <span className="text-[9px] opacity-70 font-medium tracking-wide">الإجمالي</span>
                 <span className="font-bold text-sm tracking-wide font-mono">
                   {total.toLocaleString('en-US')} <span className="text-[9px] font-sans">ج.م</span>
                 </span>
              </div>
              <div className="w-9 h-9 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-inner group-hover:scale-105 transition-transform z-10">
                 <ShoppingBag size={18} className="text-white drop-shadow-sm group-hover:rotate-12 transition-transform duration-300" strokeWidth={2} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-[110] bg-white shadow-sm pb-2 transition-all overflow-hidden">
        <div className="px-3 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
               className={`p-2 rounded-full transition-colors cursor-pointer ${isSidebarOpen && !profileActive ? 'text-[#6c0dfa] bg-purple-50' : 'text-gray-600 hover:text-[#6c0dfa] hover:bg-gray-50'}`}
             >
               {isSidebarOpen && !profileActive ? <X size={24} /> : <Menu size={24} />}
             </button>
             <div className="flex items-center gap-2">
                <Image src="/logo/kenzz_small_logo.svg" alt="Kenzz" width={32} height={32} className="object-contain" priority />
                <span className="text-2xl font-black text-[#6c0dfa] tracking-tighter italic">كنز</span>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <Link href="/notifications" onClick={closeCart} className="p-2 text-gray-600 hover:text-[#6c0dfa] hover:bg-purple-50 rounded-full transition-colors cursor-pointer">
                <Bell size={20} />
             </Link>
             <button onClick={openCart} className="p-2 text-gray-600 hover:text-[#6c0dfa] hover:bg-purple-50 rounded-full transition-colors relative cursor-pointer">
               <ShoppingCart size={20} />
               {items.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-[#e31e24] rounded-full ring-1 ring-white"></span>}
             </button>
             
             <UserMenu isMobile={true} setIsSidebarOpen={(isOpen) => {
                setProfileActive(isOpen); 
                setIsSidebarOpen(isOpen); 
             }} />
          </div>
        </div>
        <div className="px-3">
          <div className="relative">
            <input type="text" placeholder="ابحث في المتجر..." className="w-full bg-gray-100 border-none rounded-lg h-10 pr-10 pl-4 text-sm font-medium focus:ring-1 transition-all" />
            <div className="absolute top-0 right-0 h-full w-10 flex items-center justify-center text-gray-400"><Search size={16} /></div>
          </div>
        </div>
      </header>
    </>
  );
};