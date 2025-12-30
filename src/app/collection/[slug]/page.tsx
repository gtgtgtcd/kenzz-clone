'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, Filter, ArrowDownUp, LayoutGrid, List,
  Star, ChevronDown, Check, Truck, ShieldCheck,
  Settings2, Home, Gauge, Banknote, Package, X,
  Sparkles, Percent, Bell, ShoppingCart,
  ChevronLeft, ChevronRight, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import Lottie from 'lottie-react';

// نستخدم useQuery عشان نحافظ على هيكلة الكود ونستفيد من الكاشنج والتحميل
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useCart } from '../../components/CartSystem'; 

// ==================================================================================
// 1. DATA LAYER (نسخنا البيانات هنا عشان تشتغل لوكال)
// ==================================================================================

const OKAZYON_PRODUCTS = [
  { id: 'ok-1', name: 'مناديل تواليت وايت ماجيك - 5+1 بكرة', image: '/okazyon/14.webp', price: 59, oldPrice: 74, discount: 20, rating: 5.0, count: 1, badge: null },
  { id: 'ok-2', name: 'بيرسول مبيد للحشرات الطائرة - 300 مللي', image: '/okazyon/16.webp', price: 39, oldPrice: 48, discount: 19, rating: 4.5, count: 44, badge: 'اطلبت كتير' },
  { id: 'ok-3', name: 'فريدا معطر جو - العود - 460 مللي', image: '/okazyon/15.webp', price: 49, oldPrice: 58, discount: 16, rating: 4.6, count: 29, badge: null },
  { id: 'ok-4', name: 'شاور جل لوكس البنفسجي - 500 مللي', image: '/okazyon/1.webp', price: 55, oldPrice: 65, discount: 15, rating: 4.8, count: 120, badge: 'اطلبت كتير' },
  { id: 'ok-5', name: 'كريم نيفيا الأزرق المرطب - 60 مل', image: '/okazyon/8.webp', price: 35, oldPrice: 45, discount: 22, rating: 4.9, count: 200, badge: null },
  { id: 'ok-6', name: 'كلوركس ألوان - حماية للأقمشة', image: '/okazyon/13.webp', price: 28, oldPrice: 35, discount: 20, rating: 4.7, count: 80, badge: null },
  { id: 'ok-7', name: 'معجون أسنان سيجنال المتكامل', image: '/okazyon/10.webp', price: 25, oldPrice: 30, discount: 17, rating: 4.5, count: 50, badge: null },
  { id: 'ok-8', name: 'ملمع أثاث ومفروشات', image: '/okazyon/2.webp', price: 45, oldPrice: 60, discount: 25, rating: 4.4, count: 15, badge: null },
];

const FOOD_OFFERS = [
  { id: 'food-1', name: 'مكرونة الملكة خواتم - 400 جم', image: '/eat/1.webp', price: 12, oldPrice: 15, badge: 'الأكثر طلباً' },
  { id: 'food-2', name: 'مكرونة الملكة اسباجتي - 400 جم', image: '/eat/2.webp', price: 12, oldPrice: 15, badge: null },
  { id: 'food-3', name: 'زيت خليط الممتاز - 700 مللي', image: '/eat/3.webp', price: 45, oldPrice: 55, badge: 'توفير' },
  { id: 'food-4', name: 'تونا صن شاين قطع - 185 جم', image: '/eat/4.webp', price: 65, oldPrice: 80, badge: null },
  { id: 'food-5', name: 'شاي العروسة ناعم - 250 جم', image: '/eat/5.webp', price: 55, oldPrice: 62, badge: 'اطلبت كتير' },
  { id: 'food-6', name: 'شاي كبوس ناعم - 100 فتلة', image: '/eat/6.webp', price: 95, oldPrice: 110, badge: null },
  { id: 'food-7', name: 'فول مدمس أمريكانا سادة - 400 جم', image: '/eat/7.webp', price: 18, oldPrice: 24, badge: null },
  { id: 'food-8', name: 'زيت كريستال عباد الشمس - 2.2 لتر', image: '/eat/8.webp', price: 185, oldPrice: 210, badge: 'خصم خاص' },
  { id: 'food-9', name: 'شيبسي تايجر بالشطة والليمون', image: '/eat/9.webp', price: 10, oldPrice: 12, badge: null },
  { id: 'food-10', name: 'أرز الضحى مصري فاخر - 1 كجم', image: '/eat/10.webp', price: 38, oldPrice: 45, badge: 'جودة عالية' },
  { id: 'food-11', name: 'جبنة دومتي بلس فيتا - 500 جم', image: '/eat/11.webp', price: 32, oldPrice: 38, badge: null },
  { id: 'food-12', name: 'مكرونة الملكة مقصوصة - 1 كجم', image: '/eat/12.webp', price: 28, oldPrice: 32, badge: null },
  { id: 'food-13', name: 'أرز الساعة مصري فاخر - 5 كجم', image: '/eat/13.webp', price: 180, oldPrice: 210, badge: 'توفير العيلة' },
  { id: 'food-14', name: 'صلصة طماطم هارفيست - 320 جم', image: '/eat/14.webp', price: 22, oldPrice: 28, badge: null },
];

const NEW_ARRIVALS = [
  { id: 'new-1', name: 'بنطلون جينز للأطفال', image: '/new/1.jpeg', price: 99, oldPrice: 280, discount: 65, badge: 'أحدث صيحة' },
  { id: 'new-2', name: 'موبايل سامسونج جالاكسي A13', image: '/new/2.jpeg', price: 6500, oldPrice: 7200, discount: 10, badge: 'جديد' },
  { id: 'new-3', name: 'بطانة سيليكون للمقلاة الهوائية', image: '/new/3.webp', price: 51, oldPrice: 72, discount: 29, badge: 'تريند' },
  { id: 'new-4', name: 'قفل باب ثلاجة بلاستيك - أبيض', image: '/new/4.webp', price: 42, oldPrice: 127, discount: 67, badge: null },
  { id: 'new-5', name: 'كيس حفظ الغسيل - مقاس كبير', image: '/new/5.webp', price: 31, oldPrice: 45, discount: 31, badge: null },
  { id: 'new-6', name: 'فريدا معطر جو - العود 460 مللي', image: '/new/6.webp', price: 49, oldPrice: 58, discount: 16, badge: null },
  { id: 'new-7', name: 'شنطة تخزين كابتونيه كحلي', image: '/new/7.webp', price: 77, oldPrice: 120, discount: 36, badge: null },
  { id: 'new-8', name: 'شماعة بنطلونات متعددة - 5 طبقات', image: '/new/8.webp', price: 38, oldPrice: 75, discount: 49, badge: null },
  { id: 'new-9', name: 'رول رخامي للمطبخ - أبيض 5 متر', image: '/new/9.webp', price: 60, oldPrice: 75, discount: 20, badge: null },
  { id: 'new-10', name: 'نيفيا كريم مرطب للبشرة 60 مل', image: '/new/10.webp', price: 54, oldPrice: 56, discount: 4, badge: null },
  { id: 'new-11', name: 'باسكت غسيل أشكال ديزني', image: '/new/11.webp', price: 146, oldPrice: 439, discount: 67, badge: null },
  { id: 'new-12', name: 'مكبس برجر معدن', image: '/new/12.webp', price: 75, oldPrice: 113, discount: 34, badge: null },
  { id: 'new-13', name: 'ملمع للأحذية الرهيب - 75 مل', image: '/new/13.webp', price: 66.7, oldPrice: 109, discount: 39, badge: null },
  { id: 'new-14', name: 'سلة غسيل قابلة للطي - 3 أقسام', image: '/new/14.webp', price: 236, oldPrice: 537, discount: 56, badge: null },
  { id: 'new-15', name: 'بكرة معالجة سلك الناموس', image: '/new/15.webp', price: 53.9, oldPrice: 85, discount: 37, badge: null },
  { id: 'new-16', name: 'ورق للمقلاة الهوائية - 100 قطعة', image: '/new/16.webp', price: 67, oldPrice: 98, discount: 32, badge: null },
  { id: 'new-17', name: 'بنطلون جينز رجالي قصة سليم', image: '/new/17.webp', price: 499, oldPrice: 623, discount: 20, badge: null },
  { id: 'new-18', name: 'ميزان بلوتوث ديجيتال - أسود', image: '/new/18.webp', price: 283.9, oldPrice: 499, discount: 43, badge: null },
  { id: 'new-19', name: 'سامسونج جالاكسي A04s', image: '/new/19.webp', price: 5489, oldPrice: 5999, discount: 9, badge: null },
];

const DETERGENT_OFFERS = [
  { id: 'det-1', name: 'سائل غسيل الملابس لافندار', image: '/clean/1.jpeg', price: 35, oldPrice: 45, discount: 22, badge: null },
  { id: 'det-2', name: 'ويندكس ملمع زجاج - 2 عبوة', image: '/clean/2.jpeg', price: 85, oldPrice: 110, discount: 23, badge: null },
  { id: 'det-3', name: 'ملمع الأثاث المنزلي بشمع العسل', image: '/clean/3.webp', price: 65, oldPrice: 100, discount: 35, badge: 'جديد' },
  { id: 'det-4', name: 'فريدا ملمع منظف زجاج - 2 قطعة', image: '/clean/4.webp', price: 89, oldPrice: 106, discount: 16, badge: null },
  { id: 'det-5', name: 'فريدا ملمع منظف زجاج - وردي', image: '/clean/5.webp', price: 45, oldPrice: 55, discount: 18, badge: null },
  { id: 'det-6', name: 'كلوركس منظف ومطهر - 700 مل', image: '/clean/6.webp', price: 42, oldPrice: 54, discount: 22, badge: null },
  { id: 'det-7', name: 'مناديل تواليت زينة - 3+1', image: '/clean/7.webp', price: 55, oldPrice: 65, discount: 15, badge: null },
  { id: 'det-8', name: 'داوني منعم ملابس - 1 لتر', image: '/clean/8.webp', price: 85, oldPrice: 110, discount: 23, badge: null },
  { id: 'det-10', name: 'مناديل وجه - 3 عبوات', image: '/clean/10.webp', price: 45, oldPrice: 60, discount: 25, badge: null },
  { id: 'det-11', name: 'كمفورت منعم ملابس نواعم الزهور', image: '/clean/11.webp', price: 83, oldPrice: 99, discount: 16, badge: null },
  { id: 'det-12', name: 'لوكس شاور جل', image: '/clean/12.webp', price: 79, oldPrice: 91, discount: 13, badge: null },
  { id: 'det-13', name: 'كلوركس ألوان - 950 مل', image: '/clean/13.webp', price: 28, oldPrice: 35, discount: 20, badge: null },
  { id: 'det-14', name: 'ملمع أثاث ومفروشات', image: '/clean/14.webp', price: 39, oldPrice: 48, discount: 19, badge: null },
  { id: 'det-15', name: 'ويندكس عبوة إعادة تعبئة', image: '/clean/15.webp', price: 42, oldPrice: 50, discount: 16, badge: null },
  { id: 'det-16', name: 'فريدا معطر جو - التوت', image: '/clean/16.webp', price: 50, oldPrice: 58, discount: 14, badge: null },
  { id: 'det-17', name: 'فريدا معطر جو - العود', image: '/clean/17.webp', price: 49, oldPrice: 58, discount: 16, badge: null },
  { id: 'det-18', name: 'جلاسي أكوا مارين اقتصادي', image: '/clean/18.webp', price: 28, oldPrice: 33, discount: 15, badge: null },
  { id: 'det-19', name: 'فواحة للمنزل أعواد - 85 مل', image: '/clean/19.webp', price: 379, oldPrice: 456, discount: 17, badge: 'فخامة' },
  { id: 'det-20', name: 'كلوركس مبيض ملابس - 1 لتر', image: '/clean/20.webp', price: 13, oldPrice: 15, discount: 13, badge: null },
];

const CAR_ACCESSORIES = [
  { id: 'car-1', name: 'طفاية كوب ينور للعربية - أسود', image: '/car/1.webp', price: 50, oldPrice: 75, discount: 33, badge: null },
  { id: 'car-2', name: 'حساس استشعار ركن مع شاشة عرض', image: '/car/2.webp', price: 385, oldPrice: 574, discount: 33, badge: null },
  { id: 'car-3', name: 'جهاز حساس ركن للسيارة', image: '/car/3.webp', price: 335, oldPrice: 461, discount: 27, badge: null },
  { id: 'car-4', name: 'شماسة سيارة قابلة للطي - أسود', image: '/car/4.webp', price: 117.99, oldPrice: 325, discount: 64, badge: 'اطلبت كتير' },
  { id: 'car-5', name: 'شريط ليد لصالون ودواسات السيارة', image: '/car/5.webp', price: 185, oldPrice: 240, discount: 23, badge: 'اطلبت كتير' },
  { id: 'car-6', name: 'دواسة للسيارة - شيفروليه - 4 قطع', image: '/car/6.webp', price: 744, oldPrice: 924, discount: 19, badge: null },
  { id: 'car-7', name: 'ستيكر لاصق مقاوم للماء للمراية', image: '/car/7.webp', price: 65, oldPrice: 95, discount: 32, badge: null },
  { id: 'car-8', name: 'حامل مناديل جلد - اسود', image: '/car/8.webp', price: 85, oldPrice: 131, discount: 35, badge: 'اطلبت كتير' },
  { id: 'car-9', name: 'لوحة ليد COB لسقف السيارة', image: '/car/9.webp', price: 35, oldPrice: 50, discount: 30, badge: null },
  { id: 'car-10', name: 'غطاء حزام امان فسفوري عاكس', image: '/car/10.webp', price: 32.5, oldPrice: 51, discount: 36, badge: null },
  { id: 'car-11', name: 'كشاف لوجو باب سيارة - CHEVROLET', image: '/car/11.webp', price: 225, oldPrice: 274, discount: 18, badge: 'اطلبت كتير' },
  { id: 'car-12', name: 'اريال هوائي للسيارة بلاستيك - أزرق', image: '/car/12.webp', price: 85, oldPrice: 150, discount: 43, badge: null },
  { id: 'car-13', name: 'شريط واقي لحافة باب السيارة - 5م', image: '/car/13.webp', price: 150, oldPrice: 258, discount: 42, badge: null },
  { id: 'car-14', name: 'مسند ضهر كرسي شبك', image: '/car/14.webp', price: 94, oldPrice: 124, discount: 24, badge: 'اطلبت كتير' },
  { id: 'car-15', name: 'ميدالية مفاتيح شكل جيركن معدن', image: '/car/15.webp', price: 60, oldPrice: 85, discount: 29, badge: null },
];

const HOME_APPLIANCES_OFFERS = [
  { id: 'home-1', name: 'دفاية كهربائية 3 شمعة', image: '/home/1.webp', price: 450, oldPrice: 550, discount: 18, badge: null },
  { id: 'home-2', name: 'دفاية أكاي كهربائية 4 شمعة - 2200 وات', image: '/home/2.webp', price: 699, oldPrice: 800, discount: 13, badge: 'اطلبت كتير' },
  { id: 'home-3', name: 'دفاية هالوجين 2 شمعة', image: '/home/3.webp', price: 350, oldPrice: 420, discount: 17, badge: null },
  { id: 'home-4', name: 'فرن إيكوماتيك 90 سم - غاز شواية', image: '/home/4.webp', price: 29376, oldPrice: 31000, discount: 5, badge: null },
  { id: 'home-5', name: 'فرن بلت إن 60 سم', image: '/home/5.webp', price: 13500, oldPrice: 15000, discount: 10, badge: null },
  { id: 'home-6', name: 'ساندوتش ميكر سيتي - 750 وات', image: '/home/6.webp', price: 697, oldPrice: 749, discount: 7, badge: null },
  { id: 'home-7', name: 'خلاط فريش جامبو مع 2 مطحنة', image: '/home/7.webp', price: 878, oldPrice: 1141, discount: 23, badge: 'اطلبت كتير' },
  { id: 'home-8', name: 'غلاية مياه ستانلس - 1.5 لتر', image: '/home/8.webp', price: 235, oldPrice: 340, discount: 31, badge: 'اطلبت كتير' },
  { id: 'home-9', name: 'فيرست مروحة حائط - 18 بوصة', image: '/home/9.webp', price: 715, oldPrice: 1024, discount: 30, badge: null },
  { id: 'home-10', name: 'كبة لحمة وخضروات', image: '/home/10.webp', price: 850, oldPrice: 1100, discount: 23, badge: null },
  { id: 'home-11', name: 'مكواة بخار ايه تي ايه 2200 وات', image: '/home/11.webp', price: 772, oldPrice: 965, discount: 20, badge: null },
  { id: 'home-12', name: 'مسطح غاز بلت إن 4 شعلة', image: '/home/12.webp', price: 3800, oldPrice: 4500, discount: 15, badge: null },
  { id: 'home-13', name: 'خلاط فريش جامبو - 1.5 لتر', image: '/home/13.webp', price: 960, oldPrice: 1100, discount: 13, badge: null },
  { id: 'home-14', name: 'مطحنة بن وتوابل', image: '/home/14.webp', price: 450, oldPrice: 550, discount: 18, badge: null },
  { id: 'home-15', name: 'غلاية مياه فريش بلاستيك 1.7 لتر', image: '/home/15.webp', price: 708, oldPrice: 921, discount: 23, badge: 'اطلبت كتير' },
];

const PERSONAL_CARE_OFFERS = [
  { id: 'pc-1', name: 'رول أون مزيل العرق نيفيا للرجال', image: '/Personal_Care_Offers/1.jpeg', price: 65, oldPrice: 85, discount: 23, badge: null },
  { id: 'pc-2', name: 'شامبو هير كود + جل شعر', image: '/Personal_Care_Offers/2.jpeg', price: 115, oldPrice: 150, discount: 23, badge: null },
  { id: 'pc-3', name: 'عطر ون مان شو الأصلي - 100 مل', image: '/Personal_Care_Offers/3.jpeg', price: 450, oldPrice: 600, discount: 25, badge: 'أصلي 100%' },
  { id: 'pc-4', name: 'لوكس شاور جل زهرة الأوركيد - 500 مل', image: '/Personal_Care_Offers/4.jpeg', price: 79, oldPrice: 91, discount: 13, badge: 'عرض اليوم' },
  { id: 'pc-5', name: 'كريم شعر فيفات - تغذية عميقة', image: '/Personal_Care_Offers/5.jpeg', price: 55, oldPrice: 70, discount: 21, badge: null },
  { id: 'pc-6', name: 'كريم الشعر الجديد من تامارا - 110 مل', image: '/Personal_Care_Offers/6.jpeg', price: 40, oldPrice: 80, discount: 50, badge: 'اطلبت كتير' },
  { id: 'pc-7', name: 'قناع سنيور للترطيب بالعسل - 500 جم', image: '/Personal_Care_Offers/7.jpeg', price: 85, oldPrice: 170, discount: 50, badge: null },
  { id: 'pc-8', name: 'كريم تصفيف الشعر تامارا بالياسمين - 200 مل', image: '/Personal_Care_Offers/8.jpeg', price: 65, oldPrice: 130, discount: 50, badge: null },
  { id: 'pc-9', name: 'كريم الشعر هيبتا بانثينول - 100 مل', image: '/Personal_Care_Offers/9.jpeg', price: 150, oldPrice: 305, discount: 51, badge: null },
  { id: 'pc-10', name: 'إيفا وايت غسول الوجه للبشرة العادية - 100 مل', image: '/Personal_Care_Offers/10.jpeg', price: 39, oldPrice: 50, discount: 22, badge: null },
];

const HOME_OFFICE_OFFERS = [
  { id: 'ho-1', name: 'بكرة معالجة سلك الناموس - لاصق قوي', image: '/Home_and_office_offers/1.webp', price: 53.9, oldPrice: 85, discount: 37, badge: 'اطلبت كتير' },
  { id: 'ho-2', name: 'شماعة حائط لاصقة شفافة - 6 خطافات', image: '/Home_and_office_offers/2.webp', price: 25, oldPrice: 40, discount: 37, badge: null },
  { id: 'ho-3', name: 'سلة غسيل قابلة للطي مقسمة 3 خانات', image: '/Home_and_office_offers/3.webp', price: 236, oldPrice: 537, discount: 56, badge: 'اطلبت كتير' },
  { id: 'ho-4', name: 'حامل تنظيم أدوات الاستحمام - 4 رف', image: '/Home_and_office_offers/4.webp', price: 306, oldPrice: 525, discount: 42, badge: 'اطلبت كتير' },
  { id: 'ho-5', name: 'كيس حفظ الغسيل الشبكي - مقاس كبير', image: '/Home_and_office_offers/5.webp', price: 31, oldPrice: 45, discount: 31, badge: 'اطلبت كتير' },
  { id: 'ho-6', name: 'طقم أكياس مخدة قطن - قطعتين 50x70', image: '/Home_and_office_offers/6.webp', price: 120, oldPrice: 195, discount: 38, badge: null },
  { id: 'ho-7', name: 'زعافة مايكروفايبر قابلة للتمدد', image: '/Home_and_office_offers/7.webp', price: 110, oldPrice: 150, discount: 27, badge: 'اطلبت كتير' },
  { id: 'ho-8', name: 'شماعة حديدية تعلق على الباب', image: '/Home_and_office_offers/8.webp', price: 59, oldPrice: 115, discount: 49, badge: 'اطلبت كتير' },
  { id: 'ho-9', name: 'باسكت غسيل أشكال ديزني - متعدد الألوان', image: '/Home_and_office_offers/9.webp', price: 146, oldPrice: 439, discount: 67, badge: 'اللي مستنينه رجع' },
  { id: 'ho-10', name: 'شماعة ملابس خشبية فاخرة', image: '/Home_and_office_offers/10.webp', price: 19.98, oldPrice: 80, discount: 75, badge: 'اطلبت كتير' },
  { id: 'ho-11', name: 'ستارة مغناطيسية مانعة للحشرات - للباب', image: '/Home_and_office_offers/11.webp', price: 119.9, oldPrice: 225, discount: 47, badge: 'اطلبت كتير' },
  { id: 'ho-12', name: 'كشاف طوارئ شكل ميدالية متعدد الاستخدام', image: '/Home_and_office_offers/12.webp', price: 65, oldPrice: 132, discount: 51, badge: 'اطلبت كتير' },
  { id: 'ho-13', name: 'طقم شماعات ملابس - 10 قطع', image: '/Home_and_office_offers/13.webp', price: 59.99, oldPrice: 110, discount: 45, badge: 'اطلبت كتير' },
  { id: 'ho-14', name: 'شماعة بنطلونات متعددة - 5 طبقات', image: '/Home_and_office_offers/14.webp', price: 38, oldPrice: 75, discount: 49, badge: 'اطلبت كتير' },
  { id: 'ho-15', name: 'طقم فرش نحاس للتنظيف - 3 قطع', image: '/Home_and_office_offers/15.webp', price: 10, oldPrice: 30, discount: 67, badge: 'اطلبت كتير' },
  { id: 'ho-16', name: 'حمام سباحة للأطفال 10086-1', image: '/Home_and_office_offers/16.webp', price: 131, oldPrice: 170, discount: 23, badge: null },
  { id: 'ho-17', name: 'نجفة جوهرة مودرن - ذهبي', image: '/Home_and_office_offers/17.webp', price: 475, oldPrice: 689, discount: 31, badge: 'عروض ما تتفوتش' },
  { id: 'ho-18', name: 'شنطة تخزين كابتونيه كحلي - حجم كبير', image: '/Home_and_office_offers/18.webp', price: 77, oldPrice: 120, discount: 36, badge: null },
  { id: 'ho-19', name: 'دابل فيس بديل المسمار - 10 قطع', image: '/Home_and_office_offers/19.webp', price: 21.99, oldPrice: 65, discount: 66, badge: 'اطلبت كتير' },
];

// قاعدة بيانات محلية تربط بين الـ Slug والداتا
const MASTER_DATA: Record<string, { title: string; data: any[] }> = {
  // الأقسام الرئيسية
  'supermarket': { title: 'سوبر ماركت', data: OKAZYON_PRODUCTS }, // fallback to Okazyon data if no full supermarket array
  'new-arrivals': { title: 'الحاجات الجديدة', data: NEW_ARRIVALS },
  'food-offers': { title: 'عروض الأكل والشرب', data: FOOD_OFFERS },
  'detergents': { title: 'عروض المنظفات', data: DETERGENT_OFFERS },
  'personal-care': { title: 'العناية الشخصية', data: PERSONAL_CARE_OFFERS },
  'home-office': { title: 'البيت والمكتب', data: HOME_OFFICE_OFFERS },
  'car-accessories': { title: 'لوازم العربية', data: CAR_ACCESSORIES },
  'home-appliances': { title: 'أجهزة منزلية', data: HOME_APPLIANCES_OFFERS },
  // يمكن إضافة المزيد هنا
};

// ==================================================================================
// 0. SPECIAL COMPONENTS
// ==================================================================================

const Counter = ({ from, to }: { from: number; to: number }) => {
  const spring = useSpring(from, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString('en-US'));
  
  useEffect(() => { spring.set(to); }, [spring, to]);
  
  return <motion.span suppressHydrationWarning>{display}</motion.span>;
};

// ==================================================================================
// 1. FILTER CONTENT
// ==================================================================================

const FilterContent = ({ filters, setFilters, applyFilters }: any) => {
  
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const val = e.target.value;
    setFilters((prev: any) => ({ ...prev, [type === 'min' ? 'minPrice' : 'maxPrice']: val }));
  };

  const handleSubCategoryChange = (cat: string) => {
    setFilters((prev: any) => {
      const current = prev.subCategories || [];
      const exists = current.includes(cat);
      return {
        ...prev,
        subCategories: exists ? current.filter((c: string) => c !== cat) : [...current, cat]
      };
    });
  };

  return (
    <div className="space-y-8 pb-8">
      
      {/* 1. السعر */}
      <div className="border-b border-gray-100 pb-6">
        <h4 className="font-bold text-xs text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2">
          <Banknote size={14} className="text-gray-400" /> الميزانية (ج.م)
        </h4>
        <div className="flex items-center gap-2 mb-4">
           <div className="relative flex-1 group">
             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">من</span>
             <input 
               type="number" 
               value={filters.minPrice}
               onChange={(e) => handlePriceChange(e, 'min')}
               className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pl-8 text-xs font-bold text-left outline-none focus:border-[#e31e24] transition-all shadow-sm dir-ltr" 
               placeholder="0" 
             />
           </div>
           <span className="text-gray-300 font-bold">-</span>
           <div className="relative flex-1 group">
             <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 font-bold">إلى</span>
             <input 
               type="number" 
               value={filters.maxPrice}
               onChange={(e) => handlePriceChange(e, 'max')}
               className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 pl-8 text-xs font-bold text-left outline-none focus:border-[#e31e24] transition-all shadow-sm dir-ltr" 
               placeholder="max" 
             />
           </div>
        </div>
        <button 
          onClick={applyFilters}
          className="w-full py-2.5 bg-gray-100 hover:bg-[#e31e24] hover:text-white text-gray-700 rounded-lg text-xs font-bold transition-all shadow-sm"
        >
          تطبيق السعر
        </button>
      </div>

      {/* 2. الحالة */}
      <div className="border-b border-gray-100 pb-6">
        <h4 className="font-bold text-xs text-gray-900 mb-4 uppercase tracking-wider flex items-center gap-2">
          <Package size={14} className="text-gray-400" /> الحالة
        </h4>
        <div className="space-y-3">
           <label className="flex items-center justify-between cursor-pointer group select-none">
             <span className="text-xs font-bold text-gray-600 group-hover:text-[#001d3d] transition-colors">متوفر في المخزون</span>
             <input 
               type="checkbox" 
               checked={filters.inStock}
               onChange={(e) => setFilters((prev: any) => ({ ...prev, inStock: e.target.checked }))}
               className="accent-[#001d3d] w-4 h-4 cursor-pointer" 
             />
           </label>
           <label className="flex items-center justify-between cursor-pointer group select-none">
             <span className="text-xs font-bold text-gray-600 group-hover:text-[#e31e24] transition-colors">عليه خصم</span>
             <input 
                type="checkbox" 
                checked={filters.onSale}
                onChange={(e) => setFilters((prev: any) => ({ ...prev, onSale: e.target.checked }))}
                className="accent-[#e31e24] w-4 h-4 cursor-pointer" 
             />
           </label>
        </div>
      </div>

      {/* 3. التصنيف الفرعي */}
      <div>
        <h4 className="font-bold text-xs text-gray-900 mb-4 uppercase tracking-wider">بحث في القسم</h4>
        <div className="space-y-1">
          {['قطعة', 'طقم', 'عرض', 'جديد', 'أصلي'].map((c, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-all group select-none">
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors shadow-sm ${filters.subCategories?.includes(c) ? 'bg-[#e31e24] border-[#e31e24]' : 'border-gray-300 bg-white'}`}>
                {filters.subCategories?.includes(c) && <Check size={12} className="text-white" />}
              </div>
              <input 
                type="checkbox" 
                className="hidden"
                checked={filters.subCategories?.includes(c) || false}
                onChange={() => handleSubCategoryChange(c)}
              />
              <span className={`text-xs font-bold ${filters.subCategories?.includes(c) ? 'text-[#001d3d]' : 'text-gray-600'}`}>{c}</span>
            </label>
          ))}
        </div>
      </div>

    </div>
  );
};

// ==================================================================================
// 2. PAGINATION COMPONENT
// ==================================================================================

const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (p: number) => void }) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="mt-16 flex items-center justify-center gap-2 pb-10 select-none" dir="rtl">
      <button 
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="h-10 px-4 rounded-lg border border-gray-200 text-[#001d3d] font-bold text-xs hover:border-[#001d3d] hover:bg-gray-50 transition-all flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200"
      >
        <ChevronRight size={14} /> السابق
      </button>
      
      <div className="flex items-center gap-1">
        {getPageNumbers().map((page, index) => (
          <button 
            key={index}
            onClick={() => typeof page === 'number' ? onPageChange(page) : null}
            disabled={typeof page !== 'number'}
            className={`w-10 h-10 rounded-lg font-bold text-sm transition-all flex items-center justify-center
              ${page === currentPage 
                ? 'bg-[#001d3d] text-white shadow-md' 
                : typeof page === 'number' 
                  ? 'border border-gray-200 text-gray-600 hover:border-[#001d3d] hover:text-[#001d3d] cursor-pointer' 
                  : 'text-gray-400 border-none cursor-default'}`}
          >
            {page}
          </button>
        ))}
      </div>

      <button 
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="h-10 px-4 rounded-lg border border-gray-200 text-[#001d3d] font-bold text-xs hover:border-[#001d3d] hover:bg-gray-50 transition-all flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-gray-200"
      >
        التالي <ChevronLeft size={14} />
      </button>
    </div>
  );
};

// ==================================================================================
// 3. PRODUCT CARD
// ==================================================================================

const ProductCard = ({ product, viewMode }: { product: any, viewMode: 'grid' | 'list' }) => {
  const isList = viewMode === 'list';
  const isSoldOut = false; // افتراضياً متاح في اللوكال
  const { addToCart } = useCart();

  const renderBadge = () => {
    if (product.badge) {
       return <span className="absolute top-3 right-3 flex items-center gap-1 bg-[#e31e24] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md z-20"><Sparkles size={10} /> {product.badge}</span>;
    }
    if (product.discount > 0) {
       return <span className="absolute top-3 right-3 flex items-center gap-1 bg-[#e31e24] text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md z-20"><Percent size={10} /> وفر {product.discount}%</span>;
    }
    return null;
  };

  // التعامل مع الصورة سواء كانت image أو image_url
  const productImage = product.image || product.image_url;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className={`group bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-[#001d3d] hover:shadow-xl transition-all duration-300 relative flex ${isList ? 'flex-row min-h-[140px] lg:min-h-[220px]' : 'flex-col h-full'} ${isSoldOut ? 'bg-gray-50' : ''}`}
    >
      {renderBadge()}
      
      <Link href={`/product/${product.id}`} className={`relative bg-gray-50/80 overflow-hidden flex items-center justify-center p-4 lg:p-6 ${isList ? 'w-[120px] lg:w-[280px] shrink-0 border-l border-gray-100' : 'h-[180px] lg:h-[240px] w-full border-b border-gray-100'}`}>
         {productImage ? (
            <Image 
                src={productImage} 
                alt={product.name} 
                width={isList ? 150 : 180} 
                height={isList ? 150 : 180} 
                className={`object-contain group-hover:scale-110 transition-transform duration-500 mix-blend-multiply drop-shadow-sm ${isSoldOut ? 'grayscale contrast-75' : ''}`} 
            />
         ) : (
            <div className="flex flex-col items-center justify-center text-gray-300">
                <Package size={40} strokeWidth={1} />
                <span className="text-[10px] font-bold mt-2">لا توجد صورة</span>
            </div>
         )}
      </Link>

      <div className={`flex flex-col ${isList ? 'p-3 lg:p-6 flex-1 justify-between' : 'p-3 lg:p-4 flex-1'}`}>
        <div>
          <div className="flex items-center justify-between mb-1 lg:mb-2">
              <span className="text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1"><Settings2 size={10} /> {product.car_model || 'عام'}</span>
              <div className="flex items-center gap-1"><Star size={10} className="text-yellow-400 fill-yellow-400" /><span className="text-[9px] lg:text-[10px] text-gray-500 font-bold">{product.rating || 5.0}</span></div>
          </div>
          
          <Link href={`/product/${product.id}`}>
            <h3 className={`font-bold text-[#001d3d] leading-snug group-hover:text-[#e31e24] transition-colors ${isList ? 'text-sm lg:text-xl mb-1 lg:mb-3' : 'text-xs lg:text-sm mb-2 line-clamp-2'}`}>{product.name}</h3>
          </Link>

          {isList && (
             <div className="mb-2 lg:mb-4 hidden lg:block">
               <p className="text-xs text-gray-500 leading-relaxed mb-3 max-w-2xl">{product.description}</p>
               <div className="flex gap-4 text-[10px] text-gray-500 font-bold">
                  <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded"><Truck size={12} /> شحن مجاني</span>
                  <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded"><ShieldCheck size={12} /> ضمان أصلي</span>
               </div>
             </div>
          )}
        </div>
        <div className={`mt-auto flex items-end justify-between ${isList ? 'border-t border-gray-100 pt-2 lg:pt-4' : ''}`}>
           <div className="flex flex-col">
              {product.oldPrice > 0 && <span className="text-[9px] lg:text-[10px] text-gray-400 line-through decoration-red-500/30">{product.oldPrice} ج.م</span>}
              <span className="text-sm lg:text-lg font-black text-[#001d3d]">{product.price} <span className="text-[9px] lg:text-[10px] font-medium text-gray-500">ج.م</span></span>
           </div>
           <button 
             disabled={isSoldOut} 
             onClick={() => { 
                 if(!isSoldOut) {
                     addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: productImage,
                        car: product.car_model
                     }); 
                 }
             }}
             className={`flex items-center gap-2 transition-all rounded-lg font-bold shadow-md active:scale-95 ${isList ? 'px-3 py-1.5 lg:px-6 lg:py-2.5 text-[10px] lg:text-sm' : 'w-7 h-7 lg:w-8 lg:h-8 justify-center rounded-full'} ${isSoldOut ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none' : 'bg-[#001d3d] text-white hover:bg-[#e31e24]'}`}
           >
             {isSoldOut ? <Bell size={isList ? 14 : 12} /> : <ShoppingCart size={isList ? 14 : 12} />}
             {isList && <span>{isSoldOut ? 'أعلمني' : 'أضف'}</span>}
           </button>
        </div>
      </div>
    </motion.div>
  );
};

// ==================================================================================
// 4. DATA FETCHING FUNCTION (LOCAL DATA LOGIC)
// ==================================================================================

const fetchCollectionData = async ({ queryKey }: any) => {
    const [_key, slug, page, filters] = queryKey;
    const ITEMS_PER_PAGE = 12; 
    
    // 1. تحديد البيانات بناءً على الـ Slug من الـ Local Data
    const localData = MASTER_DATA[slug];
    const categoryName = localData ? localData.title : 'قسم غير معروف';
    let products = localData ? localData.data : [];

    // 2. تطبيق الفلاتر محلياً (Javascript Filtering)
    if (filters.minPrice) {
        products = products.filter(p => p.price >= Number(filters.minPrice));
    }
    if (filters.maxPrice) {
        products = products.filter(p => p.price <= Number(filters.maxPrice));
    }
    if (filters.onSale) {
        products = products.filter(p => p.oldPrice > p.price || p.discount > 0);
    }
    if (filters.subCategories && filters.subCategories.length > 0) {
        // بحث نصي بسيط في الاسم
        products = products.filter(p => 
            filters.subCategories.some((term: string) => p.name.includes(term))
        );
    }

    const totalCount = products.length;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    // 3. الترقيم (Pagination)
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE;
    const paginatedProducts = products.slice(from, to);

    // محاكاة تأخير الشبكة لظهور اللودر (اختياري)
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
        categoryName,
        products: paginatedProducts,
        totalCount,
        totalPages
    };
};

// ==================================================================================
// 5. MAIN COLLECTION PAGE
// ==================================================================================

export default function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);
  
  // States
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
      minPrice: '',
      maxPrice: '',
      inStock: true,
      onSale: false,
      subCategories: [] as string[]
  });
  
  const [activeFilters, setActiveFilters] = useState(filters);

  useEffect(() => {
      setActiveFilters(prev => ({...prev, inStock: filters.inStock, onSale: filters.onSale, subCategories: filters.subCategories}));
      setCurrentPage(1); 
  }, [filters.inStock, filters.onSale, filters.subCategories]);

  const { slug } = use(params);

  const { data, isLoading } = useQuery({
    queryKey: ['collection', slug, currentPage, activeFilters], 
    queryFn: fetchCollectionData,
    placeholderData: keepPreviousData, 
    staleTime: 5 * 60 * 1000, 
  });

  const applyFilters = () => {
      setActiveFilters(filters); 
      setCurrentPage(1); 
      setIsMobileFilterOpen(false); 
  };

  useEffect(() => {
    fetch('/animation/car.json').then(res => res.json()).then(data => setAnimationData(data)).catch(() => {});
  }, []);

  const products = data?.products || [];
  const categoryName = data?.categoryName || '...';
  const totalCount = data?.totalCount || 0;
  const totalPages = data?.totalPages || 0; 

  return (
    <main className="min-h-screen flex flex-col bg-white font-sans text-right" dir="rtl">
      
      <AnimatePresence mode="wait">
        {isLoading && !data && (
          <motion.div className="fixed inset-0 z-[100] bg-[#001d3d] flex flex-col items-center justify-center" exit={{ opacity: 0, y: -50, transition: { duration: 0.6 } }}>
            <motion.div layoutId="hero-icon-gauge" className="w-32 lg:w-48 h-32 lg:h-48 mb-6 flex items-center justify-center">
              {animationData ? (<Lottie animationData={animationData} loop={true} className="w-full h-full" />) : (<Gauge size={60} className="text-[#e31e24] animate-pulse" />)}
            </motion.div>
            <div className="text-center relative z-10 px-4">
              <h2 className="text-5xl lg:text-7xl font-black text-white mb-2 font-mono tracking-tighter flex items-center justify-center gap-2">
                  <Counter from={0} to={100} /><span className="text-xl lg:text-2xl text-[#e31e24]">%</span>
              </h2>
              <p className="text-gray-400 text-xs lg:text-sm font-bold tracking-widest uppercase mb-8">جاري استدعاء القسم...</p>
            </div>
            <div className="w-48 lg:w-64 h-1 bg-white/5 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.5, ease: "linear" }} className="h-full bg-gradient-to-r from-[#e31e24] to-orange-500"/></div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1">
        
        {/* Mobile Tools Bar */}
        <div className="lg:hidden sticky top-[60px] bg-[#f8fafc]/95 backdrop-blur-sm border-b border-gray-100 px-4 py-2 flex gap-3 z-30 shadow-sm">
            <button onClick={() => setIsMobileFilterOpen(true)} className="flex-1 h-11 bg-[#001d3d] text-white rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-lg active:scale-95 transition-transform"><Filter size={16} /> تصفية ({totalCount})</button>
            <div className="flex-1 h-11 bg-white border border-gray-200 rounded-xl flex items-center px-1 shadow-sm">
                <button onClick={() => setViewMode('grid')} className={`flex-1 h-9 rounded-lg flex items-center justify-center transition-all ${viewMode === 'grid' ? 'bg-gray-100 text-[#001d3d]' : 'text-gray-400'}`}><LayoutGrid size={16} /></button>
                <div className="w-px h-6 bg-gray-100 mx-1"></div>
                <button onClick={() => setViewMode('list')} className={`flex-1 h-9 rounded-lg flex items-center justify-center transition-all ${viewMode === 'list' ? 'bg-gray-100 text-[#001d3d]' : 'text-gray-400'}`}><List size={16} /></button>
            </div>
        </div>

        {/* Mobile Filter Modal */}
        <AnimatePresence>
          {isMobileFilterOpen && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileFilterOpen(false)} className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm" />
              <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-[70] lg:hidden h-[85vh] flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.2)]">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between"><h3 className="font-black text-[#001d3d] text-lg flex items-center gap-2"><Filter size={20} className="text-[#e31e24]" /> تصفية النتائج</h3><button onClick={() => setIsMobileFilterOpen(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-[#e31e24]"><X size={18} /></button></div>
                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                    <FilterContent filters={filters} setFilters={setFilters} applyFilters={applyFilters} />
                </div>
                <div className="p-5 border-t border-gray-100 bg-white pb-safe"><button onClick={applyFilters} className="w-full h-12 bg-[#001d3d] text-white rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2">عرض النتائج <Check size={16} /></button></div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <section className="bg-[#001d3d] relative overflow-hidden border-b border-[#e31e24]/20">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
          <div className="max-w-[1440px] mx-auto px-4 lg:px-6 py-6 lg:py-8 relative z-10 text-white">
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-gray-400 mb-4 lg:mb-6"><Link href="/" className="hover:text-white flex items-center gap-1"><Home size={12} /> الرئيسية</Link><ChevronDown size={10} className="-rotate-90" /><span>{categoryName}</span></div>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2 lg:mb-3">
                  {!isLoading && (<motion.div layoutId="hero-icon-gauge" className="w-10 h-10 lg:w-16 lg:h-16 flex items-center justify-center bg-white/5 rounded-xl lg:rounded-2xl backdrop-blur-md border border-white/10 shadow-lg">{animationData ? (<Lottie animationData={animationData} loop={true} className="w-8 h-8 lg:w-12 lg:h-12" />) : (<Gauge size={20} className="text-[#e31e24]" />)}</motion.div>)}
                  <h1 className="text-2xl lg:text-4xl font-black tracking-tight">{categoryName}</h1>
                </div>
                <p className="text-xs lg:text-sm text-gray-300 font-medium flex items-center gap-2"><Check size={12} className="text-[#e31e24]" /><span className="font-bold text-white bg-white/10 px-1.5 rounded">{totalCount}</span> منتج أصلي</p>
              </div>
              <div className="hidden lg:flex flex-wrap items-center gap-4 p-2 bg-[#00152e]/80 backdrop-blur-md rounded-xl border border-white/10">
                <div className="relative group"><select className="appearance-none bg-transparent border border-white/20 text-white text-xs font-bold py-3 pr-4 pl-10 rounded-lg outline-none cursor-pointer min-w-[180px] transition-all shadow-sm"><option className="text-black">ترتيب: الأكثر مبيعاً</option></select><ArrowDownUp size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /></div>
                <div className="flex bg-white/10 border border-white/20 rounded-lg p-1 gap-1"><button onClick={() => setViewMode('grid')} className={`p-2.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-[#e31e24] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}><LayoutGrid size={18} /></button><button onClick={() => setViewMode('list')} className={`p-2.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-[#e31e24] text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}><List size={18} /></button></div>
              </div>
            </div>
          </div>
        </section>

        {/* Content Area */}
        <div className="max-w-[1440px] mx-auto px-4 lg:px-6 flex items-start relative bg-[#f8fafc]">
          <aside className="w-72 shrink-0 hidden lg:block sticky top-[90px] h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar px-4 py-6 border-l border-gray-100">
              <div className="flex items-center justify-between mb-8">
                  <h3 className="font-black text-[#001d3d] text-base flex items-center gap-2 uppercase tracking-wider">
                      <Filter size={18} className="text-[#e31e24]" /> الفلاتر المتقدمة
                  </h3>
                  <button onClick={() => { setFilters({minPrice:'', maxPrice:'', inStock:true, onSale:false, subCategories:[]}); applyFilters(); }} className="text-[10px] text-gray-400 font-bold hover:text-[#e31e24] transition-colors">إعادة تعيين</button>
              </div>
              <FilterContent filters={filters} setFilters={setFilters} applyFilters={applyFilters} />
          </aside>

          <div className="flex-1 min-h-[600px] py-6 lg:py-8 lg:pr-8">
              {!isLoading && products.length === 0 ? (
                 <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                       <AlertCircle size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">لا توجد منتجات تطابق بحثك</h3>
                    <p className="text-gray-500 mt-2 text-sm">جرب تغيير الفلاتر أو البحث عن منتج آخر.</p>
                    <button onClick={() => { setFilters({minPrice:'', maxPrice:'', inStock:true, onSale:false, subCategories:[]}); applyFilters(); }} className="mt-6 px-6 py-3 bg-[#001d3d] text-white rounded-xl font-bold text-sm hover:bg-[#e31e24] transition-all">إلغاء الفلترة</button>
                 </div>
              ) : (
                 <div className={`grid gap-3 lg:gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                    {products.map((product: any) => (<ProductCard key={product.id} product={product} viewMode={viewMode} />))}
                 </div>
              )}
              
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
              />
          </div>
        </div>
      </div>

    </main>
  );
}