'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Menu, Languages, Loader2, Mail, X } from 'lucide-react'; 
import { useStore } from '../context/StoreContext'; 
import { GlobalSidebar } from '../components/SiteHeader'; 
import { motion, AnimatePresence } from 'framer-motion';
import './login.css';

// استيراد ملف الانيميشن الجديد
import verifiedAnim from './Verified.json';

// تحميل اللوتي بلاير
const Player = dynamic(() => import('@lottiefiles/react-lottie-player').then(mod => mod.Player), {
  ssr: false,
});

export default function LoginPage() {
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [theme, setTheme] = useState('light');
  const [showLangModal, setShowLangModal] = useState(false);
  
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);   
  const [targetEmail, setTargetEmail] = useState('');                

  const { activeContext, isSidebarOpen, setIsSidebarOpen } = useStore();

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleLang = () => setShowLangModal(!showLangModal);

  // تفعيل تسجيل الدخول بجوجل
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error(err);
      setErrorMsg('فشل تسجيل الدخول عبر جوجل.');
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, phone: phone },
          },
        });
        if (error) throw error;

        setTargetEmail(email);
        setShowSuccessModal(true);
        setIsSignup(false); 

      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        router.push('/'); 
        router.refresh();
      }
    } catch (err: any) {
      console.error(err);
      
      if (err.message.includes("Email not confirmed")) {
        setTargetEmail(email);
        setShowVerifyModal(true); 
      } else if (err.message.includes("Invalid login credentials")) {
        setErrorMsg('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      } else {
        setErrorMsg(err.message || 'حدث خطأ ما.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      
      <GlobalSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        context={activeContext} 
      />

      <header className="login-header">
        <div className="logo">
          {/* تم تعديل الـ onClick هنا ليعمل كـ Toggle */}
          <button 
            className="icon-btn" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
            title="القائمة" 
            style={{ border: 'none', background: 'transparent', padding: 0, width: 'auto', marginLeft: '5px' }}
          >
             {isSidebarOpen ? <X size={28} strokeWidth={2.5} /> : <Menu size={28} strokeWidth={2.5} />}
          </button>
          <span>الكابتن & العميد</span>
        </div>
        
        <div className="header-actions">
          <div className="nav-links">
            <Link href="#">المنتجات</Link>
            <Link href="#">العروض</Link>
            <Link href="#">تواصل معنا</Link>
          </div>

          <button className="icon-btn" onClick={toggleLang} title="اللغة">
            <Languages size={20} />
          </button>

          <button className="icon-btn" onClick={toggleTheme} title="المظهر">
            {theme === 'light' ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            )}
          </button>
        </div>
      </header>

      <div className="main-wrapper">
        <div className="right-side">
          <div className="form-container-center">
            <div className="auth-card">
              
              <div className="mobile-header-img">
                <img src={isSignup ? "/2.png" : "/1.png"} alt="Login Art" />
              </div>
              
              <div className="welcome-text">
                <h1>{isSignup ? "انضم للكابتن & العميد" : "أهلاً بك يا كابتن!"}</h1>
                <p>{isSignup ? "أنشئ حسابك وابدأ التسوق فوراً." : "سجل دخولك واستمتع بأقوى الخصومات والمنتجات."}</p>
              </div>

              <div className="social-container">
                <div className="social-item" onClick={handleGoogleLogin} style={{cursor: 'pointer'}}>
                  <svg viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
                
                <div className="social-item" style={{color: 'var(--text-main)'}}>
                  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05 1.72-3.21 1.72-1.13 0-1.42-.69-2.79-.69-1.35 0-1.74.67-2.76.69-1.06.02-2.13-.85-3.15-1.76-2.08-1.85-3.61-5.21-3.61-8.38 0-5.02 3.09-7.66 6.02-7.66 1.54 0 2.59.88 3.53.88.91 0 2.21-.93 3.86-.93 1.51 0 4.02.56 5.41 2.6-2.81 1.63-2.35 5.51.52 6.72-1.12 2.68-2.84 5.79-3.82 6.75zM12.03 5.16c-.02-2.26 1.86-4.22 3.96-4.16.23 2.45-2.12 4.49-3.96 4.16z"/></svg>
                </div>
                
                <div className="social-item">
                  <svg viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
              </div>

              <div className="line-divider">أو عبر البريد الإلكتروني</div>

              <form onSubmit={handleAuth}>
                {isSignup && (
                  <>
                    <div className="form-group">
                      <label>الاسم الكامل</label>
                      <input type="text" placeholder="الاسم كما تحب أن نناديك" value={fullName} onChange={(e) => setFullName(e.target.value)} required={isSignup} />
                    </div>
                    <div className="form-group">
                      <label>رقم الهاتف</label>
                      <input type="tel" placeholder="01xxxxxxxxx" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                  </>
                )}
                
                <div className="form-group">
                  <label>البريد الإلكتروني</label>
                  <input type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>كلمة المرور</label>
                  <input type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                
                {errorMsg && (
                  <div style={{ color: '#dc2626', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px', textAlign: 'center', border: '1px solid #fee2e2' }}>
                    {errorMsg}
                  </div>
                )}

                <button type="submit" className="main-btn" disabled={loading}>
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                      <Loader2 className="animate-spin" size={20} /> جاري التحميل...
                    </span>
                  ) : (
                    isSignup ? "إنشاء الحساب" : "تسجيل الدخول"
                  )}
                </button>
              </form>

              <div className="toggle-view">
                <p>
                  {isSignup ? "لديك حساب بالفعل؟" : "جديد معنا؟"}{" "}
                  <span onClick={() => { setIsSignup(!isSignup); setErrorMsg(''); }}>
                    {isSignup ? "تسجيل الدخول" : "إنشاء حساب جديد"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="left-side">
          <Player autoplay loop src="/page.json" style={{ height: '100%', width: '100%', minHeight: '500px' }} />
          <div style={{ textAlign: 'center', padding: '0 40px', marginTop: '-50px', position: 'relative', zIndex: 10 }}>
            <h2 style={{ fontSize: '28px', color: 'var(--text-main)', marginBottom: '10px' }}>عالم التسوق بين يديك</h2>
            <p style={{ color: 'var(--text-sub)', maxWidth: '400px' }}>تصفح آلاف المنتجات المميزة واحصل على أفضل العروض يومياً.</p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccessModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-gray-800 to-gray-400"></div>
              
              <div className="flex justify-center mb-2">
                <Player
                  autoplay
                  keepLastFrame
                  src={verifiedAnim} 
                  style={{ height: '120px', width: '120px' }}
                />
              </div>
              
              <h2 className="text-2xl font-black text-[#001d3d] mb-2">تم الإنشاء بنجاح!</h2>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                أهلاً بك في عائلة الكابتن. لقد أرسلنا رابط تفعيل إلى بريدك الإلكتروني:
                <br />
                <span className="font-bold text-black dir-ltr block mt-1">{targetEmail}</span>
              </p>
              
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 bg-[#001d3d] text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg"
              >
                حسناً، سأقوم بالتفعيل
              </button>
            </motion.div>
          </motion.div>
        )}

        {showVerifyModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-t-4 border-[#e31e24]"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#e31e24]">
                <Mail size={32} />
              </div>
              
              <h2 className="text-xl font-black text-[#001d3d] mb-2">الحساب غير مفعل</h2>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                عذراً، لا يمكنك تسجيل الدخول قبل تأكيد بريدك الإلكتروني. يرجى التحقق من الرسائل الواردة في:
                <br />
                <span className="font-bold text-[#e31e24] dir-ltr block mt-1">{targetEmail}</span>
              </p>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowVerifyModal(false)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  إغلاق
                </button>
                <Link href="https://mail.google.com" target="_blank" className="flex-1 py-3 bg-[#e31e24] text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2">
                   فتح البريد
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`modal-overlay ${showLangModal ? 'show' : ''}`} style={{display: showLangModal ? 'block' : 'none', opacity: showLangModal ? 1 : 0}} onClick={toggleLang}></div>
      <div className="lang-modal" style={{bottom: showLangModal ? '0px' : '-100%'}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
            <span style={{fontSize:'18px', fontWeight:'800', color:'var(--text-main)'}}>اختر الدولة واللغة</span>
            <span onClick={toggleLang} style={{cursor:'pointer', fontSize:'24px'}}>&times;</span>
        </div>
        <ul style={{listStyle:'none'}}>
            <li className="lang-item active" onClick={toggleLang}>
                <div style={{display:'flex', gap:'15px', alignItems:'center'}}>
                    <span style={{fontSize:'24px'}}>🇪🇬</span>
                    <span style={{fontWeight:'700', color:'var(--text-main)'}}>مصر (العربية)</span>
                </div>
                <div className="check-icon">✔</div>
            </li>
        </ul>
      </div>

    </div>
  );
}