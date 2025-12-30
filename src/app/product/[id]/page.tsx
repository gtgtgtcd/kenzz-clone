'use client';

import React, { useState, useEffect, use, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Star, Truck, ShieldCheck, ChevronLeft,
  ShoppingCart, CheckCircle2, Info, Package, Minus, Plus,
  Maximize2, X, Wrench, ListFilter, PenLine, AlertCircle, Loader2, Home, Car, Trash2, Send, User, Smile, MoreVertical, Edit2, ArrowRight, UserCog, MessageSquare,
  Zap, Droplet, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../components/CartSystem';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Lottie from "lottie-react";
import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react';

import supportAnim from './anm/Support.json';
import confettiAnim from './anm/Confetti.json';

// ==================================================================================
// 1. LOCAL DATA STORE (لضمان فتح أي منتج)
// ==================================================================================

const ALL_PRODUCTS_DB = [
  // Okazyon
  { id: 'ok-1', name: 'مناديل تواليت وايت ماجيك - 5+1 بكرة', image: '/okazyon/14.webp', price: 59, oldPrice: 74, category: 'supermarket' },
  { id: 'ok-2', name: 'بيرسول مبيد للحشرات الطائرة - 300 مللي', image: '/okazyon/16.webp', price: 39, oldPrice: 48, category: 'supermarket' },
  { id: 'ok-3', name: 'فريدا معطر جو - العود - 460 مللي', image: '/okazyon/15.webp', price: 49, oldPrice: 58, category: 'supermarket' },
  { id: 'ok-4', name: 'شاور جل لوكس البنفسجي - 500 مللي', image: '/okazyon/1.webp', price: 55, oldPrice: 65, category: 'personal-care' },
  { id: 'ok-5', name: 'كريم نيفيا الأزرق المرطب - 60 مل', image: '/okazyon/8.webp', price: 35, oldPrice: 45, category: 'personal-care' },
  { id: 'ok-6', name: 'كلوركس ألوان - حماية للأقمشة', image: '/okazyon/13.webp', price: 28, oldPrice: 35, category: 'detergents' },
  { id: 'ok-7', name: 'معجون أسنان سيجنال المتكامل', image: '/okazyon/10.webp', price: 25, oldPrice: 30, category: 'personal-care' },
  { id: 'ok-8', name: 'ملمع أثاث ومفروشات', image: '/okazyon/2.webp', price: 45, oldPrice: 60, category: 'detergents' },
  // Food
  { id: 'food-1', name: 'مكرونة الملكة خواتم - 400 جم', image: '/eat/1.webp', price: 12, oldPrice: 15, category: 'food' },
  { id: 'food-2', name: 'مكرونة الملكة اسباجتي - 400 جم', image: '/eat/2.webp', price: 12, oldPrice: 15, category: 'food' },
  { id: 'food-3', name: 'زيت خليط الممتاز - 700 مللي', image: '/eat/3.webp', price: 45, oldPrice: 55, category: 'food' },
  { id: 'food-4', name: 'تونا صن شاين قطع - 185 جم', image: '/eat/4.webp', price: 65, oldPrice: 80, category: 'food' },
  { id: 'food-5', name: 'شاي العروسة ناعم - 250 جم', image: '/eat/5.webp', price: 55, oldPrice: 62, category: 'food' },
  { id: 'food-6', name: 'شاي كبوس ناعم - 100 فتلة', image: '/eat/6.webp', price: 95, oldPrice: 110, category: 'food' },
  { id: 'food-7', name: 'فول مدمس أمريكانا سادة - 400 جم', image: '/eat/7.webp', price: 18, oldPrice: 24, category: 'food' },
  { id: 'food-8', name: 'زيت كريستال عباد الشمس - 2.2 لتر', image: '/eat/8.webp', price: 185, oldPrice: 210, category: 'food' },
  { id: 'food-9', name: 'شيبسي تايجر بالشطة والليمون', image: '/eat/9.webp', price: 10, oldPrice: 12, category: 'food' },
  { id: 'food-10', name: 'أرز الضحى مصري فاخر - 1 كجم', image: '/eat/10.webp', price: 38, oldPrice: 45, category: 'food' },
  { id: 'food-11', name: 'جبنة دومتي بلس فيتا - 500 جم', image: '/eat/11.webp', price: 32, oldPrice: 38, category: 'food' },
  { id: 'food-12', name: 'مكرونة الملكة مقصوصة - 1 كجم', image: '/eat/12.webp', price: 28, oldPrice: 32, category: 'food' },
  { id: 'food-13', name: 'أرز الساعة مصري فاخر - 5 كجم', image: '/eat/13.webp', price: 180, oldPrice: 210, category: 'food' },
  { id: 'food-14', name: 'صلصة طماطم هارفيست - 320 جم', image: '/eat/14.webp', price: 22, oldPrice: 28, category: 'food' },
  // Home & Office
  { id: 'ho-1', name: 'بكرة معالجة سلك الناموس - لاصق قوي', image: '/Home_and_office_offers/1.webp', price: 53.9, oldPrice: 85, category: 'home' },
  { id: 'ho-2', name: 'شماعة حائط لاصقة شفافة - 6 خطافات', image: '/Home_and_office_offers/2.webp', price: 25, oldPrice: 40, category: 'home' },
  { id: 'ho-3', name: 'سلة غسيل قابلة للطي مقسمة 3 خانات', image: '/Home_and_office_offers/3.webp', price: 236, oldPrice: 537, category: 'home' },
  { id: 'ho-4', name: 'حامل تنظيم أدوات الاستحمام - 4 رف', image: '/Home_and_office_offers/4.webp', price: 306, oldPrice: 525, category: 'home' },
  { id: 'ho-5', name: 'كيس حفظ الغسيل الشبكي - مقاس كبير', image: '/Home_and_office_offers/5.webp', price: 31, oldPrice: 45, category: 'home' },
  { id: 'ho-6', name: 'طقم أكياس مخدة قطن - قطعتين 50x70', image: '/Home_and_office_offers/6.webp', price: 120, oldPrice: 195, category: 'home' },
  { id: 'ho-7', name: 'زعافة مايكروفايبر قابلة للتمدد', image: '/Home_and_office_offers/7.webp', price: 110, oldPrice: 150, category: 'home' },
  { id: 'ho-8', name: 'شماعة حديدية تعلق على الباب', image: '/Home_and_office_offers/8.webp', price: 59, oldPrice: 115, category: 'home' },
  { id: 'ho-9', name: 'باسكت غسيل أشكال ديزني - متعدد الألوان', image: '/Home_and_office_offers/9.webp', price: 146, oldPrice: 439, category: 'home' },
  { id: 'ho-10', name: 'شماعة ملابس خشبية فاخرة', image: '/Home_and_office_offers/10.webp', price: 19.98, oldPrice: 80, category: 'home' },
  { id: 'ho-11', name: 'ستارة مغناطيسية مانعة للحشرات - للباب', image: '/Home_and_office_offers/11.webp', price: 119.9, oldPrice: 225, category: 'home' },
  { id: 'ho-12', name: 'كشاف طوارئ شكل ميدالية متعدد الاستخدام', image: '/Home_and_office_offers/12.webp', price: 65, oldPrice: 132, category: 'home' },
  { id: 'ho-13', name: 'طقم شماعات ملابس - 10 قطع', image: '/Home_and_office_offers/13.webp', price: 59.99, oldPrice: 110, category: 'home' },
  { id: 'ho-14', name: 'شماعة بنطلونات متعددة - 5 طبقات', image: '/Home_and_office_offers/14.webp', price: 38, oldPrice: 75, category: 'home' },
  { id: 'ho-15', name: 'طقم فرش نحاس للتنظيف - 3 قطع', image: '/Home_and_office_offers/15.webp', price: 10, oldPrice: 30, category: 'home' },
  { id: 'ho-16', name: 'حمام سباحة للأطفال 10086-1', image: '/Home_and_office_offers/16.webp', price: 131, oldPrice: 170, category: 'home' },
  { id: 'ho-17', name: 'نجفة جوهرة مودرن - ذهبي', image: '/Home_and_office_offers/17.webp', price: 475, oldPrice: 689, category: 'home' },
  { id: 'ho-18', name: 'شنطة تخزين كابتونيه كحلي - حجم كبير', image: '/Home_and_office_offers/18.webp', price: 77, oldPrice: 120, category: 'home' },
  { id: 'ho-19', name: 'دابل فيس بديل المسمار - 10 قطع', image: '/Home_and_office_offers/19.webp', price: 21.99, oldPrice: 65, category: 'home' },
  // Car Accessories
  { id: 'car-1', name: 'طفاية كوب ينور للعربية - أسود', image: '/car/1.webp', price: 50, oldPrice: 75, category: 'car' },
  { id: 'car-2', name: 'حساس استشعار ركن مع شاشة عرض', image: '/car/2.webp', price: 385, oldPrice: 574, category: 'car' },
  { id: 'car-3', name: 'جهاز حساس ركن للسيارة', image: '/car/3.webp', price: 335, oldPrice: 461, category: 'car' },
  { id: 'car-4', name: 'شماسة سيارة قابلة للطي - أسود', image: '/car/4.webp', price: 117.99, oldPrice: 325, category: 'car' },
  { id: 'car-5', name: 'شريط ليد لصالون ودواسات السيارة', image: '/car/5.webp', price: 185, oldPrice: 240, category: 'car' },
  { id: 'car-6', name: 'دواسة للسيارة - شيفروليه - 4 قطع', image: '/car/6.webp', price: 744, oldPrice: 924, category: 'car' },
  { id: 'car-7', name: 'ستيكر لاصق مقاوم للماء للمراية', image: '/car/7.webp', price: 65, oldPrice: 95, category: 'car' },
  { id: 'car-8', name: 'حامل مناديل جلد - اسود', image: '/car/8.webp', price: 85, oldPrice: 131, category: 'car' },
  { id: 'car-9', name: 'لوحة ليد COB لسقف السيارة', image: '/car/9.webp', price: 35, oldPrice: 50, category: 'car' },
  { id: 'car-10', name: 'غطاء حزام امان فسفوري عاكس', image: '/car/10.webp', price: 32.5, oldPrice: 51, category: 'car' },
  { id: 'car-11', name: 'كشاف لوجو باب سيارة - CHEVROLET', image: '/car/11.webp', price: 225, oldPrice: 274, category: 'car' },
  { id: 'car-12', name: 'اريال هوائي للسيارة بلاستيك - أزرق', image: '/car/12.webp', price: 85, oldPrice: 150, category: 'car' },
  { id: 'car-13', name: 'شريط واقي لحافة باب السيارة - 5م', image: '/car/13.webp', price: 150, oldPrice: 258, category: 'car' },
  { id: 'car-14', name: 'مسند ضهر كرسي شبك', image: '/car/14.webp', price: 94, oldPrice: 124, category: 'car' },
  { id: 'car-15', name: 'ميدالية مفاتيح شكل جيركن معدن', image: '/car/15.webp', price: 60, oldPrice: 85, category: 'car' },
  // Home Appliances
  { id: 'home-1', name: 'دفاية كهربائية 3 شمعة', image: '/home/1.webp', price: 450, oldPrice: 550, category: 'appliances' },
  { id: 'home-2', name: 'دفاية أكاي كهربائية 4 شمعة - 2200 وات', image: '/home/2.webp', price: 699, oldPrice: 800, category: 'appliances' },
  { id: 'home-3', name: 'دفاية هالوجين 2 شمعة', image: '/home/3.webp', price: 350, oldPrice: 420, category: 'appliances' },
  { id: 'home-4', name: 'فرن إيكوماتيك 90 سم - غاز شواية', image: '/home/4.webp', price: 29376, oldPrice: 31000, category: 'appliances' },
  { id: 'home-5', name: 'فرن بلت إن 60 سم', image: '/home/5.webp', price: 13500, oldPrice: 15000, category: 'appliances' },
  { id: 'home-6', name: 'ساندوتش ميكر سيتي - 750 وات', image: '/home/6.webp', price: 697, oldPrice: 749, category: 'appliances' },
  { id: 'home-7', name: 'خلاط فريش جامبو مع 2 مطحنة', image: '/home/7.webp', price: 878, oldPrice: 1141, category: 'appliances' },
  { id: 'home-8', name: 'غلاية مياه ستانلس - 1.5 لتر', image: '/home/8.webp', price: 235, oldPrice: 340, category: 'appliances' },
  { id: 'home-9', name: 'فيرست مروحة حائط - 18 بوصة', image: '/home/9.webp', price: 715, oldPrice: 1024, category: 'appliances' },
  { id: 'home-10', name: 'كبة لحمة وخضروات', image: '/home/10.webp', price: 850, oldPrice: 1100, category: 'appliances' },
  { id: 'home-11', name: 'مكواة بخار ايه تي ايه 2200 وات', image: '/home/11.webp', price: 772, oldPrice: 965, category: 'appliances' },
  { id: 'home-12', name: 'مسطح غاز بلت إن 4 شعلة', image: '/home/12.webp', price: 3800, oldPrice: 4500, category: 'appliances' },
  { id: 'home-13', name: 'خلاط فريش جامبو - 1.5 لتر', image: '/home/13.webp', price: 960, oldPrice: 1100, category: 'appliances' },
  { id: 'home-14', name: 'مطحنة بن وتوابل', image: '/home/14.webp', price: 450, oldPrice: 550, category: 'appliances' },
  { id: 'home-15', name: 'غلاية مياه فريش بلاستيك 1.7 لتر', image: '/home/15.webp', price: 708, oldPrice: 921, category: 'appliances' },
  // Personal Care
  { id: 'pc-1', name: 'رول أون مزيل العرق نيفيا للرجال', image: '/Personal_Care_Offers/1.jpeg', price: 65, oldPrice: 85, category: 'personal-care' },
  { id: 'pc-2', name: 'شامبو هير كود + جل شعر', image: '/Personal_Care_Offers/2.jpeg', price: 115, oldPrice: 150, category: 'personal-care' },
  { id: 'pc-3', name: 'عطر ون مان شو الأصلي - 100 مل', image: '/Personal_Care_Offers/3.jpeg', price: 450, oldPrice: 600, category: 'personal-care' },
  { id: 'pc-4', name: 'لوكس شاور جل زهرة الأوركيد - 500 مل', image: '/Personal_Care_Offers/4.jpeg', price: 79, oldPrice: 91, category: 'personal-care' },
  { id: 'pc-5', name: 'كريم شعر فيفات - تغذية عميقة', image: '/Personal_Care_Offers/5.jpeg', price: 55, oldPrice: 70, category: 'personal-care' },
  { id: 'pc-6', name: 'كريم الشعر الجديد من تامارا - 110 مل', image: '/Personal_Care_Offers/6.jpeg', price: 40, oldPrice: 80, category: 'personal-care' },
  { id: 'pc-7', name: 'قناع سنيور للترطيب بالعسل - 500 جم', image: '/Personal_Care_Offers/7.jpeg', price: 85, oldPrice: 170, category: 'personal-care' },
  { id: 'pc-8', name: 'كريم تصفيف الشعر تامارا بالياسمين - 200 مل', image: '/Personal_Care_Offers/8.jpeg', price: 65, oldPrice: 130, category: 'personal-care' },
  { id: 'pc-9', name: 'كريم الشعر هيبتا بانثينول - 100 مل', image: '/Personal_Care_Offers/9.jpeg', price: 150, oldPrice: 305, category: 'personal-care' },
  { id: 'pc-10', name: 'إيفا وايت غسول الوجه للبشرة العادية - 100 مل', image: '/Personal_Care_Offers/10.jpeg', price: 39, oldPrice: 50, category: 'personal-care' },
  // Detergents
  { id: 'det-1', name: 'سائل غسيل الملابس لافندار', image: '/clean/1.jpeg', price: 35, oldPrice: 45, category: 'detergents' },
  { id: 'det-2', name: 'ويندكس ملمع زجاج - 2 عبوة', image: '/clean/2.jpeg', price: 85, oldPrice: 110, category: 'detergents' },
  { id: 'det-3', name: 'ملمع الأثاث المنزلي بشمع العسل', image: '/clean/3.webp', price: 65, oldPrice: 100, category: 'detergents' },
  { id: 'det-4', name: 'فريدا ملمع منظف زجاج - 2 قطعة', image: '/clean/4.webp', price: 89, oldPrice: 106, category: 'detergents' },
  { id: 'det-5', name: 'فريدا ملمع منظف زجاج - وردي', image: '/clean/5.webp', price: 45, oldPrice: 55, category: 'detergents' },
  { id: 'det-6', name: 'كلوركس منظف ومطهر - 700 مل', image: '/clean/6.webp', price: 42, oldPrice: 54, category: 'detergents' },
  { id: 'det-7', name: 'مناديل تواليت زينة - 3+1', image: '/clean/7.webp', price: 55, oldPrice: 65, category: 'detergents' },
  { id: 'det-8', name: 'داوني منعم ملابس - 1 لتر', image: '/clean/8.webp', price: 85, oldPrice: 110, category: 'detergents' },
  { id: 'det-10', name: 'مناديل وجه - 3 عبوات', image: '/clean/10.webp', price: 45, oldPrice: 60, category: 'detergents' },
  { id: 'det-11', name: 'كمفورت منعم ملابس نواعم الزهور', image: '/clean/11.webp', price: 83, oldPrice: 99, category: 'detergents' },
  { id: 'det-12', name: 'لوكس شاور جل', image: '/clean/12.webp', price: 79, oldPrice: 91, category: 'detergents' },
  { id: 'det-13', name: 'كلوركس ألوان - 950 مل', image: '/clean/13.webp', price: 28, oldPrice: 35, category: 'detergents' },
  { id: 'det-14', name: 'ملمع أثاث ومفروشات', image: '/clean/14.webp', price: 39, oldPrice: 48, category: 'detergents' },
  { id: 'det-15', name: 'ويندكس عبوة إعادة تعبئة', image: '/clean/15.webp', price: 42, oldPrice: 50, category: 'detergents' },
  { id: 'det-16', name: 'فريدا معطر جو - التوت', image: '/clean/16.webp', price: 50, oldPrice: 58, category: 'detergents' },
  { id: 'det-17', name: 'فريدا معطر جو - العود', image: '/clean/17.webp', price: 49, oldPrice: 58, category: 'detergents' },
  { id: 'det-18', name: 'جلاسي أكوا مارين اقتصادي', image: '/clean/18.webp', price: 28, oldPrice: 33, category: 'detergents' },
  { id: 'det-19', name: 'فواحة للمنزل أعواد - 85 مل', image: '/clean/19.webp', price: 379, oldPrice: 456, category: 'detergents' },
  { id: 'det-20', name: 'كلوركس مبيض ملابس - 1 لتر', image: '/clean/20.webp', price: 13, oldPrice: 15, category: 'detergents' },
  // New Arrivals
  { id: 'new-1', name: 'بنطلون جينز للأطفال', image: '/new/1.jpeg', price: 99, oldPrice: 280, category: 'fashion' },
  { id: 'new-2', name: 'موبايل سامسونج جالاكسي A13', image: '/new/2.jpeg', price: 6500, oldPrice: 7200, category: 'mobiles' },
  { id: 'new-17', name: 'بنطلون جينز رجالي قصة سليم', image: '/new/17.webp', price: 499, oldPrice: 623, category: 'fashion' },
  { id: 'new-19', name: 'سامسونج جالاكسي A04s', image: '/new/19.webp', price: 5489, oldPrice: 5999, category: 'mobiles' },
];

// ==================================================================================
// 0. HELPER FUNCTIONS & FAKE REVIEWS GENERATOR
// ==================================================================================

const formatReviewDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
};

// إنشاء تعليقات وهمية تبدو حقيقية
const generateFakeReviews = (productId: string) => {
  const reviews = [
    { id: `fake-1-${productId}`, user: "أحمد محمود", rating: 5, comment: "منتج ممتاز جداً والتوصيل كان سريع، شكراً كابتن!", date: "2024-12-20" },
    { id: `fake-2-${productId}`, user: "سارة علي", rating: 4, comment: "الجودة كويسة بس ياريت توفروا ألوان تانية.", date: "2024-12-18" },
    { id: `fake-3-${productId}`, user: "محمد إبراهيم", rating: 5, comment: "تمام زي الوصف بالظبط، والسعر ممتاز مقارنة بالسوق.", date: "2024-12-15" },
    { id: `fake-4-${productId}`, user: "عميل الكابتن", rating: 5, comment: "تجربة شراء ممتازة، المنتج أصلي وتغليف محترم.", date: "2024-12-10" },
    { id: `fake-5-${productId}`, user: "ياسر كمال", rating: 4, comment: "المنتج كويس وشغال تمام.", date: "2024-12-05" },
  ];
  return reviews;
};

const renderContentWithEmojis = (text: string) => {
  if (!text) return null;
  const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;
  const parts = text.split(emojiRegex);
  
  return parts.map((part, index) => {
    if (part.match(emojiRegex)) {
      return <span key={index} style={{ fontFamily: '"Noto Color Emoji", "Apple Color Emoji", sans-serif' }}>{part}</span>;
    }
    return <span key={index}>{part}</span>;
  });
};

const ImageMagnifier = ({ src, alt }: { src: string; alt: string }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setPosition({ x, y });
    setCursorPosition({ x: e.pageX - left, y: e.pageY - top });
    setShowMagnifier(true);
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden cursor-crosshair rounded-xl"
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
    >
      <Image src={src} alt={alt} fill className="object-contain p-2 transition-transform duration-500 hover:scale-105" />
      <AnimatePresence>
        {showMagnifier && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute z-20 pointer-events-none border border-gray-200 bg-white shadow-2xl rounded-full w-32 h-32 hidden lg:block"
            style={{
              left: `${cursorPosition.x - 64}px`,
              top: `${cursorPosition.y - 64}px`,
              backgroundImage: `url('${src}')`,
              backgroundPosition: `${position.x}% ${position.y}%`,
              backgroundSize: '250%',
              backgroundRepeat: 'no-repeat'
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const RANDOM_STARS = [
    { top: '10%', left: '5%', delay: '0s', size: '2px' },
    { top: '15%', left: '85%', delay: '1s', size: '3px' },
    { top: '40%', left: '15%', delay: '2s', size: '2px' },
    { top: '30%', left: '60%', delay: '0.5s', size: '4px' },
    { top: '70%', left: '10%', delay: '1.5s', size: '2px' },
    { top: '80%', left: '80%', delay: '3s', size: '3px' },
];

// ==================================================================================
// 2. PRODUCT PAGE COMPONENT
// ==================================================================================

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  // البحث عن المنتج محلياً
  const productData = ALL_PRODUCTS_DB.find(p => p.id === id);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'compatibility' | 'reviews'>('desc');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // Reviews State (Local)
  const [reviews, setReviews] = useState<any[]>([]);
  
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [displayName, setDisplayName] = useState(''); 
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null); 
  const [modalStep, setModalStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false); 
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null); 

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addToCart } = useCart(); 

  // Load Reviews from LocalStorage + Dummy Data
  useEffect(() => {
    const savedReviews = JSON.parse(localStorage.getItem(`kenzz_reviews_${id}`) || '[]');
    const dummyReviews = generateFakeReviews(id);
    setReviews([...savedReviews, ...dummyReviews]);
  }, [id]);

  useEffect(() => {
    if (isReviewModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isReviewModalOpen]);

  // تحديد التبويبات بناءً على نوع المنتج
  const isCar = productData?.category === 'car';
  const isFood = productData?.category === 'food' || productData?.category === 'supermarket';
  const isAppliance = productData?.category === 'appliances';

  const getDynamicDescription = () => {
      if (isCar) return `تم تصميم ${productData?.name} بأعلى معايير الجودة لضمان أداء مثالي لسيارتك. قطعة غيار أصلية تتحمل الاستخدام الشاق وتوفر لك الأمان على الطريق.`;
      if (isFood) return `استمتع بأفضل طعم وجودة مع ${productData?.name}. منتج طازج ومغلف بعناية للحفاظ على النكهة الأصلية. مثالي للاستخدام اليومي.`;
      if (isAppliance) return `${productData?.name} هو الإضافة المثالية لمنزلك. يتميز بالكفاءة العالية في استهلاك الطاقة، تصميم عصري، وخامات متينة تعيش طويلاً.`;
      return `احصل الآن على ${productData?.name} بسعر مميز. منتج عالي الجودة يجمع بين الأداء العملي والتصميم الأنيق، مع ضمان كامل من الكابتن.`;
  };

  const handleOpenCreateModal = () => {
      setEditingReviewId(null);
      setNewComment('');
      setNewRating(5);
      setDisplayName('');
      setModalStep(1); 
      setIsReviewModalOpen(true);
  };

  const handleEditComment = (review: any) => {
      setEditingReviewId(review.id);
      setNewComment(review.comment);
      setNewRating(review.rating);
      setDisplayName(review.user);
      setActiveMenuId(null); 
      setModalStep(1); 
      setIsReviewModalOpen(true);
  };

  const handleEditName = (review: any) => {
      setEditingReviewId(review.id);
      setNewComment(review.comment);
      setNewRating(review.rating);
      setDisplayName(review.user);
      setActiveMenuId(null); 
      setModalStep(2); 
      setIsReviewModalOpen(true);
  };

  const handleStep1Submit = () => {
      if (!newComment.trim()) return;
      // في اللوكال بنعتبره دايماً مش مسجل دخول رسمي فبندخله على خطوة الاسم لو مش موجود
      if (displayName || editingReviewId) {
          handleSubmitReview();
      } else {
          setModalStep(2);
      }
  };

  const handleSubmitReview = async () => {
    // لو مفيش اسم، حط اسم افتراضي
    const finalName = displayName || 'عميل الكابتن';
    
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 800)); // محاكاة الشبكة

    const newReview = {
        id: editingReviewId || `local-${Date.now()}`,
        user: finalName, 
        rating: newRating,
        comment: newComment,
        date: new Date().toISOString(),
        isLocal: true // علامة لتمييز تعليقاتي
    };

    let updatedReviews;
    if (editingReviewId) {
        updatedReviews = reviews.map(r => r.id === editingReviewId ? newReview : r);
    } else {
        updatedReviews = [newReview, ...reviews];
    }

    // حفظ تعليقات المستخدم فقط في LocalStorage (مش هنحفظ الوهمي)
    const userReviews = updatedReviews.filter(r => r.isLocal);
    localStorage.setItem(`kenzz_reviews_${id}`, JSON.stringify(userReviews));

    setReviews(updatedReviews);
    setNewComment('');
    setNewRating(5);
    setEditingReviewId(null);
    setModalStep(1);
    setShowEmojiPicker(false);
    setIsReviewModalOpen(false); 
    setShowConfetti(true); 
    setIsSubmitting(false);

    setTimeout(() => setShowConfetti(false), 5000);
  };

  const handleDeleteReview = (reviewId: string) => {
    if(!confirm('هل أنت متأكد من حذف هذا التعليق؟')) return;
    
    const updatedReviews = reviews.filter(r => r.id !== reviewId);
    const userReviews = updatedReviews.filter(r => r.isLocal);
    localStorage.setItem(`kenzz_reviews_${id}`, JSON.stringify(userReviews));
    setReviews(updatedReviews);
    setActiveMenuId(null);
  };

  const onEmojiClick = (emojiObject: any) => {
    setNewComment((prevInput) => prevInput + emojiObject.emoji);
  };

  if (!productData) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center px-4" dir="rtl">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <AlertCircle size={32} />
              </div>
              <h1 className="text-2xl font-black text-[#001d3d] mb-2">عفواً، المنتج غير موجود</h1>
              <Link href="/" className="px-6 py-3 bg-[#001d3d] text-white rounded-xl font-bold text-sm hover:bg-[#e31e24] transition-all">
                  العودة للرئيسية
              </Link>
          </div>
      );
  }

  const product = {
      ...productData,
      images: [productData.image], // مصفوفة وهمية لأن عندنا صورة واحدة
      description: getDynamicDescription(),
      rating: 4.8,
      reviewsCount: reviews.length
  };

  const totalPrice = product.price * quantity;
  const savedAmount = (product.oldPrice - product.price) * quantity;

  return (
    <main className="min-h-screen bg-[#f8fafc] text-right font-sans pt-[56px] lg:pt-[0px]" dir="rtl">
      
      <style jsx global>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap');`}</style>
      
      <AnimatePresence>
        {showConfetti && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[10000] pointer-events-none flex items-center justify-center">
              <Lottie animationData={confettiAnim} loop={false} className="w-full h-full object-cover" />
           </motion.div>
        )}
      </AnimatePresence>

      {/* 1. REVIEW MODAL (التصميم الأصلي بالكامل) */}
      <AnimatePresence>
        {isReviewModalOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-xl px-4" onClick={() => setIsReviewModalOpen(false)}>
                <motion.div initial={{ scale: 0.95, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 30 }} transition={{ type: "spring", duration: 0.5 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl overflow-hidden relative flex flex-col max-h-[90vh]">
                    <button onClick={() => setIsReviewModalOpen(false)} className="absolute top-4 right-4 z-[40] w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 transition-colors"><X size={20} /></button>

                    <div className="w-full h-40 bg-gray-50 rounded-t-[32px] flex items-center justify-center border-b border-gray-100 relative overflow-hidden">
                        <div className="w-64 h-64 absolute -bottom-20"><Lottie animationData={supportAnim} loop={true} /></div>
                    </div>

                    <div className="p-8 pt-6 overflow-y-auto no-scrollbar relative">
                        <AnimatePresence mode="wait">
                            {modalStep === 1 ? (
                                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6">
                                    <div className="text-center mb-2">
                                        <h3 className="text-[#001d3d] font-black text-2xl mb-2">{editingReviewId ? 'تعديل الرسالة' : 'كيف كانت تجربتك؟'}</h3>
                                        <p className="text-gray-500 text-sm">شاركنا رأيك في المنتج.</p>
                                    </div>

                                    <div className="flex flex-col items-center gap-2">
                                        <div className="flex justify-center gap-3" dir="ltr">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button key={star} onClick={() => setNewRating(star)} className="group focus:outline-none transition-transform active:scale-90">
                                                    <Star size={42} fill={star <= newRating ? "#fbbf24" : "transparent"} className={`transition-all duration-300 ${star <= newRating ? 'text-yellow-400 drop-shadow-md scale-110' : 'text-gray-200 group-hover:text-gray-300'}`} strokeWidth={1.5} />
                                                </button>
                                            ))}
                                        </div>
                                        <span className="text-sm font-bold text-[#e31e24] bg-red-50 px-3 py-1 rounded-full">
                                            {newRating === 5 ? 'تجربة ممتازة 😍' : newRating === 4 ? 'تجربة رائعة 😄' : newRating === 3 ? 'تجربة جيدة 🙂' : newRating === 2 ? 'مقبول 😐' : 'تجربة سيئة 😔'}
                                        </span>
                                    </div>

                                    <div className="relative">
                                        <textarea ref={textareaRef} value={newComment} onFocus={() => setShowEmojiPicker(false)} onChange={(e) => setNewComment(e.target.value)} placeholder="اكتب تفاصيل تجربتك هنا... ما الذي أعجبك؟ وما الذي يمكننا تحسينه؟" className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-[#001d3d] focus:bg-white focus:ring-4 focus:ring-[#001d3d]/5 transition-all text-lg placeholder:text-sm min-h-[140px] resize-none leading-relaxed text-gray-700 font-sans" />
                                        
                                        <div className="absolute bottom-4 left-4 z-10 flex gap-2">
                                            <button onMouseDown={(e) => { e.preventDefault(); if (showEmojiPicker) { setShowEmojiPicker(false); } else { textareaRef.current?.blur(); setShowEmojiPicker(true); } }} className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-full transition-colors active:scale-90"><Smile size={24} /></button>
                                        </div>

                                        <button onClick={() => setModalStep(2)} className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-[10px] font-bold text-gray-600 transition-colors"><UserCog size={14} /> تغيير الاسم</button>
                                    </div>

                                    <button onClick={handleStep1Submit} disabled={!newComment.trim()} className="w-full h-14 bg-[#001d3d] text-white rounded-xl font-bold text-base shadow-xl shadow-[#001d3d]/20 hover:bg-[#e31e24] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-2"><Loader2 className="animate-spin" size={20} /><span>جاري النشر...</span></div>
                                        ) : (
                                            <>{editingReviewId ? 'حفظ التعديلات' : 'نشر التقييم'} <Send size={20} /></>
                                        )}
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-6 pt-4">
                                    <div className="text-center">
                                        <h3 className="text-[#001d3d] font-black text-xl mb-2">تعديل الاسم</h3>
                                        <p className="text-gray-500 text-xs">الاسم ده هو اللي هيظهر للناس بجانب تعليقك.</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                        <label className="text-xs font-bold text-gray-500 block mb-2">الاسم الظاهر</label>
                                        <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="w-full h-12 px-4 rounded-xl bg-white border border-gray-200 focus:border-[#001d3d] text-lg font-bold text-[#001d3d] transition-all outline-none text-center" />
                                    </div>
                                    <div className="flex gap-3">
                                        <button onClick={() => setModalStep(1)} className="h-14 px-6 rounded-xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50">رجوع</button>
                                        <button onClick={handleSubmitReview} disabled={isSubmitting} className="flex-1 h-14 bg-[#001d3d] text-white rounded-xl font-bold text-base shadow-xl hover:bg-[#e31e24] transition-all flex items-center justify-center gap-3">
                                            {isSubmitting ? <div className="flex items-center gap-2"><Loader2 className="animate-spin" size={20} /><span>جاري الحفظ...</span></div> : <>حفظ ونشر <Send size={20} /></>}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <AnimatePresence>
                        {showEmojiPicker && modalStep === 1 && (
                            <motion.div initial={{ y: "-100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute top-0 left-0 right-0 bottom-[270px] z-[100] bg-white flex flex-col border-b border-gray-100 shadow-lg rounded-b-2xl">
                                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50 rounded-t-[32px]">
                                    <span className="font-bold text-[#001d3d]">اختر إيموجي</span>
                                    <button onClick={() => setShowEmojiPicker(false)} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors"><X size={18} /></button>
                                </div>
                                <div className="flex-1 w-full h-full overflow-hidden">
                                    <EmojiPicker onEmojiClick={onEmojiClick} emojiStyle={EmojiStyle.APPLE} theme={Theme.LIGHT} searchDisabled={true} width="100%" height="100%" previewConfig={{ showPreview: false }} className="!border-none" />
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white border-b border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] w-full sticky top-[56px] lg:top-[10px] z-10 transition-all">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 h-12 flex items-center">
            <nav className="flex items-center gap-2 text-[11px] md:text-xs font-bold text-gray-500">
                <Link href="/" className="flex items-center gap-1 hover:text-[#001d3d] transition-colors group">
                   <Home size={14} className="mb-0.5 group-hover:text-[#e31e24] transition-colors" /><span>الرئيسية</span>
                </Link>
                <ChevronLeft size={12} className="text-gray-300" />
                <span className="text-[#001d3d] bg-gray-50 px-2 py-1 rounded-md border border-gray-100 line-clamp-1 max-w-[150px] md:max-w-none">{product.name}</span>
            </nav>
        </div>
      </div>

      <AnimatePresence>
        {isLightboxOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/95 flex flex-col">
                <div className="flex items-center justify-between p-4 z-50">
                    <span className="text-white/70 text-sm font-bold px-2">{selectedImage + 1} / {product.images.length}</span>
                    <button onClick={() => setIsLightboxOpen(false)} className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"><X size={24} /></button>
                </div>
                <div className="flex-1 flex items-center justify-center relative overflow-hidden">
                    <TransformWrapper initialScale={1} minScale={1} maxScale={4} centerOnInit>
                        <TransformComponent wrapperClass="w-full h-full flex items-center justify-center" contentClass="w-full h-full flex items-center justify-center">
                            <div className="relative w-full h-full max-h-[80vh] flex items-center justify-center">
                                <img src={product.images[selectedImage]} alt="Product Fullscreen" className="max-w-full max-h-full object-contain" />
                            </div>
                        </TransformComponent>
                    </TransformWrapper>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6 pb-24 lg:pb-12">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[420px]">
                <div className="lg:col-span-5 bg-[#f9fafb] border-l border-gray-100 p-4 relative group flex flex-col items-center justify-center">
                    <button onClick={() => setIsLightboxOpen(true)} className="absolute top-3 left-3 z-10 w-9 h-9 bg-white rounded-full shadow border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#001d3d] hover:scale-105 transition-all cursor-pointer"><Maximize2 size={18} /></button>
                    <div className="w-full relative h-[250px] lg:h-[280px] mb-4">
                         <ImageMagnifier src={product.images[selectedImage]} alt={product.name} />
                    </div>
                </div>

                <div className="lg:col-span-7 flex flex-col h-full">
                    <div className="p-6 pb-0 flex justify-between items-start">
                         <div>
                           <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-black rounded tracking-wide border border-gray-200 mb-2 inline-block uppercase">
                               {isCar ? 'Auto Parts' : isFood ? 'Supermarket' : isAppliance ? 'Home Appliances' : 'Best Offers'}
                           </span>
                           <h1 className="text-xl lg:text-2xl font-black text-[#001d3d] leading-tight max-w-sm">{product.name}</h1>
                         </div>
                         <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                             <span className="text-sm font-black text-[#001d3d] pt-0.5">{product.rating}</span>
                             <Star size={14} className="fill-yellow-400 text-yellow-400" />
                         </div>
                    </div>

                    <div className="p-6 pt-4 flex-1 flex flex-col justify-center">
                        <p className="text-gray-500 text-xs lg:text-sm font-medium leading-6 mb-4 line-clamp-3">{product.description}</p>

                        <div className="mb-6">
                            {isCar && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                                    <div className="bg-blue-100 p-2 rounded-full text-blue-600 shrink-0"><Wrench size={18} /></div>
                                    <div>
                                        <h4 className="font-bold text-[#001d3d] text-sm mb-1">التوافق</h4>
                                        <p className="text-xs text-gray-600 leading-relaxed">متوافق مع معظم الموديلات الحديثة. يرجى التأكد من المقاس قبل الشراء.</p>
                                    </div>
                                </motion.div>
                            )}
                            {isFood && (
                                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start gap-3">
                                    <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 shrink-0"><CheckCircle2 size={18} /></div>
                                    <div>
                                        <h4 className="font-bold text-[#001d3d] text-sm mb-1">طازج ومضمون</h4>
                                        <p className="text-xs text-gray-600 leading-relaxed">تاريخ صلاحية جديد وتغليف آمن لضمان الجودة.</p>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <div className="flex items-center justify-between w-full mb-4">
                             <div className="flex items-center gap-4">
                                <span className="text-4xl font-black text-[#001d3d]">{product.price.toLocaleString('en-US')} <span className="text-sm font-bold text-gray-400">ج.م</span></span>
                                {product.oldPrice > 0 && (<span className="text-2xl font-bold text-gray-400 line-through decoration-red-500/50 mt-2 font-mono">{product.oldPrice.toLocaleString('en-US')}</span>)}
                             </div>
                             {savedAmount > 0 && (<span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">وفرت {savedAmount.toLocaleString('en-US')} ج.م</span>)}
                        </div>
                    </div>

                    <div className="px-6 pb-6 mt-auto">
                        <div className="flex items-center gap-3">
                             <div className="flex items-center bg-white rounded-xl border border-gray-200 h-12 w-32 shrink-0 shadow-sm">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-[#e31e24] active:scale-90 transition-transform"><Minus size={18} /></button>
                                <span className="flex-1 text-center font-black text-sm text-[#001d3d]">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center text-gray-500 hover:text-[#e31e24] active:scale-90 transition-transform"><Plus size={18} /></button>
                             </div>
                             <button onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.images[0], car: product.category, quantity: quantity })} className="flex-1 h-12 bg-[#001d3d] hover:bg-[#e31e24] text-white rounded-xl font-bold text-sm shadow-md shadow-[#001d3d]/10 transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                                <ShoppingCart size={18} /> إضافة للعربة
                             </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 divide-x divide-x-reverse divide-gray-100 border-t border-gray-100 bg-gray-50/50">
                        <div className="p-3 flex flex-col items-center justify-center gap-1 text-center hover:bg-gray-50 transition-colors">
                            <ShieldCheck size={18} className="text-purple-600 mb-0.5" /><span className="text-[10px] font-bold text-gray-400">الضمان</span><span className="text-[10px] font-black text-[#001d3d]">14 يوم</span>
                        </div>
                        <div className="p-3 flex flex-col items-center justify-center gap-1 text-center hover:bg-gray-50 transition-colors">
                            <Truck size={18} className="text-blue-600 mb-0.5" /><span className="text-[10px] font-bold text-gray-400">الشحن</span><span className="text-[10px] font-black text-[#001d3d]">سريع 24H</span>
                        </div>
                        <div className="p-3 flex flex-col items-center justify-center gap-1 text-center hover:bg-gray-50 transition-colors">
                            <Package size={18} className="text-emerald-600 mb-0.5" /><span className="text-[10px] font-bold text-gray-400">الحالة</span><span className="text-[10px] font-black text-[#001d3d]">متوفر</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-gray-100/80 p-1 rounded-xl w-full mb-6 flex flex-nowrap overflow-x-auto no-scrollbar gap-1 md:grid md:grid-cols-4 border border-gray-200">
            {[{ id: 'desc', label: 'الوصف', icon: Info }, { id: 'compatibility', label: isCar ? 'التوافق' : isFood ? 'المكونات' : 'التفاصيل', icon: isCar ? Car : Layers }, { id: 'specs', label: 'المواصفات', icon: ListFilter }, { id: 'reviews', label: 'التقييمات', icon: Star }].map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-bold rounded-lg transition-all duration-300 shrink-0 min-w-[100px] md:min-w-0 ${activeTab === tab.id ? 'bg-white text-[#001d3d] shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'}`}>
                    <tab.icon size={14} /> <span>{tab.label}</span>
                </button>
            ))}
        </div>

        <div className="w-full">
            <AnimatePresence mode="wait">
                {activeTab === 'desc' && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 grid grid-cols-1 gap-4 w-full">
                        <div>
                            <h3 className="text-sm font-black text-[#001d3d] mb-3 flex items-center gap-2"><Info size={16} className="text-[#e31e24]" /> تفاصيل المنتج</h3>
                            <p className="text-gray-600 leading-7 text-xs lg:text-sm font-medium">{product.description}</p>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'compatibility' && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="border border-gray-200 rounded-2xl p-5 bg-white w-full flex items-center justify-center">
                        <p className="text-sm text-gray-500 font-bold">{isCar ? 'يتوافق هذا المنتج مع السيارات المذكورة في الكتالوج.' : isFood ? 'منتج طبيعي خالي من المواد الحافظة الضارة.' : 'منتج أصلي مطابق للمواصفات القياسية.'}</p>
                    </motion.div>
                )}

                {activeTab === 'specs' && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="border border-gray-200 rounded-2xl p-5 bg-gray-50/50 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                <span className="text-gray-500 font-bold text-xs">العلامة التجارية</span><span className="text-[#001d3d] font-black text-xs">كابتن ستور</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                                <span className="text-gray-500 font-bold text-xs">النوع</span><span className="text-[#001d3d] font-black text-xs">{product.category}</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'reviews' && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full relative rounded-2xl border border-gray-200 bg-white p-5">
                         <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                            {RANDOM_STARS.map((star, i) => (
                                <div key={i} className="absolute bg-yellow-400 rounded-full opacity-40 pointer-events-none" style={{ top: star.top, left: star.left, width: star.size, height: star.size }} />
                            ))}
                         </div>

                         <div className="relative z-10 flex flex-col gap-6">
                           <div className="w-full bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                               <div className="text-center md:text-right flex flex-col md:flex-row items-center gap-2 md:gap-4">
                                   <div className="flex items-center gap-2">
                                       <span className="text-3xl font-black text-[#001d3d]">{product.rating}</span>
                                       <div className="flex text-yellow-400 gap-0.5">{[...Array(5)].map((_, i) => (<Star key={i} size={14} className={i < Math.round(product.rating) ? "fill-current" : "text-gray-300"} />))}</div>
                                   </div>
                                   <span className="text-[10px] font-bold text-gray-400 border-t md:border-t-0 md:border-r border-gray-200 pt-2 md:pt-0 md:pr-4 mt-2 md:mt-0">{reviews.length} تقييم</span>
                               </div>
                               <button onClick={handleOpenCreateModal} className="w-full md:w-auto px-6 h-10 bg-white border border-gray-200 text-[#001d3d] text-xs font-bold rounded-lg hover:border-[#001d3d] transition-colors shadow-sm">أضف تقييمك</button>
                           </div>

                           <div className="w-full space-y-4">
                               {reviews.length > 0 ? (
                                   reviews.map((rev: any) => (
                                       <div key={rev.id} className={`bg-white border rounded-xl p-4 transition-colors relative group ${rev.isLocal ? 'border-[#e31e24] shadow-sm bg-red-50/10' : 'border-gray-100 hover:border-gray-200'}`}>
                                            <div className="flex items-start gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center text-gray-400"><User size={20} /></div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <div>
                                                            <h4 className="font-bold text-[#001d3d] text-xs flex items-center gap-1">{rev.user} {rev.isLocal && <span className="text-[9px] bg-[#e31e24] text-white px-1.5 py-0.5 rounded-full">أنت</span>}</h4>
                                                            <div className="flex text-yellow-400 gap-0.5 mt-1">{[...Array(5)].map((_, i) => <Star key={i} size={9} className={i < rev.rating ? "fill-current" : "text-gray-200"} />)}</div>
                                                        </div>
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-[10px] text-gray-400 font-medium">{formatReviewDate(rev.date)}</span>
                                                            {rev.isLocal && (
                                                                <div className="relative mt-1">
                                                                    <button onClick={() => setActiveMenuId(activeMenuId === rev.id ? null : rev.id)} className="p-1 text-gray-400 hover:text-[#001d3d]"><MoreVertical size={16} /></button>
                                                                    <AnimatePresence>
                                                                        {activeMenuId === rev.id && (
                                                                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute top-full left-0 mt-1 bg-white border border-gray-100 shadow-xl rounded-lg w-32 overflow-hidden z-50 flex flex-col">
                                                                                <button onClick={() => handleEditComment(rev)} className="w-full text-right px-3 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-50"><Edit2 size={14} /> تعديل</button>
                                                                                <button onClick={() => handleDeleteReview(rev.id)} className="w-full text-right px-3 py-2 text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2"><Trash2 size={14} /> حذف</button>
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-600 leading-relaxed font-medium mt-2">{renderContentWithEmojis(rev.comment)}</p>
                                                </div>
                                            </div>
                                       </div>
                                   ))
                               ) : (
                                   <div className="text-center py-8 text-gray-400 flex flex-col items-center">
                                       <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-2"><Star size={20} className="text-gray-300" /></div>
                                       <p className="text-xs font-bold">لا توجد تقييمات بعد</p>
                                   </div>
                               )}
                           </div>
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-50 flex items-center gap-3 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] pb-safe">
        <div className="flex-1">
            <span className="block text-[10px] text-gray-400 font-bold">الإجمالي ({quantity})</span>
            <span className="text-lg font-black text-[#001d3d]">{totalPrice.toLocaleString('en-US')} ج.م</span>
        </div>
        <button onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.images[0], car: product.category, quantity: quantity })} className="flex-1 h-10 bg-[#e31e24] text-white rounded-lg font-bold text-sm flex items-center justify-center gap-2 shadow-md">
            شراء <ShoppingCart size={16} />
        </button>
      </div>

    </main>
  );
}