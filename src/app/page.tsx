'use client';

import React, { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Search, Truck, Zap, Car, Gem, Filter, ShoppingCart, 
  ArrowLeft, ArrowRight, Loader2, Palette, ChevronDown, X, Eye, PlusCircle, Star, ShieldCheck, Flame 
} from 'lucide-react';
import dynamic from 'next/dynamic';
const Player = dynamic(() => import('@lottiefiles/react-lottie-player').then(mod => mod.Player), { ssr: false });

import { useCart } from './components/CartSystem';

// ==================================================================================
// 1. DATA LAYER
// ==================================================================================

const KENZ_TILES = [
  { name: 'سوبر ماركت', image: '/categorytiles/FinalTiles_Supermarket.webp', slug: 'supermarket' },
  { name: 'موبايلات', image: '/categorytiles/FinalTiles_Mobiles.webp', slug: 'mobiles' },
  { name: 'فاشون', image: '/categorytiles/FinalTiles_Fashion.webp', slug: 'fashion' },
  { name: 'صحة وجمال', image: '/categorytiles/FinalTiles_Health-Beauty.webp', slug: 'health-beauty' },
  { name: 'أجهزة منزلية', image: '/categorytiles/FinalTiles_Appliaces.webp', slug: 'appliances' },
  { name: 'المطبخ', image: '/categorytiles/FinalTiles_Kitchen.webp', slug: 'kitchen' },
  { name: 'البيت والمكتب', image: '/categorytiles/FinalTiles_Home-Office.webp', slug: 'home-office' },
  { name: 'تلفزيونات', image: '/categorytiles/FinalTiles_TVs.webp', slug: 'tvs' },
  { name: 'لابتوب', image: '/categorytiles/FinalTiles_Laptops-Computers.webp', slug: 'laptops' },
  { name: 'إلكترونيات', image: '/categorytiles/FinalTiles_Electronics.webp', slug: 'electronics' },
  { name: 'ألعاب فيديو', image: '/categorytiles/FinalTiles_Videogames-Consoles.webp', slug: 'videogames' },
  { name: 'سيارات', image: '/categorytiles/FinalTiles_Car.webp', slug: 'car' },
  { name: 'جيم ورياضة', image: '/categorytiles/FinalTiles_Gym.webp', slug: 'gym' },
  { name: 'منتجات أطفال', image: '/categorytiles/FinalTiles_Baby.webp', slug: 'baby' },
];

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

const SUPERMARKET_STARS = [
  { id: 'br-1', name: 'أبو عوف', image: '/Brand_Tiles/1.webp', offer: 'خصم لحد 20%' },
  { id: 'br-2', name: 'عافية', image: '/Brand_Tiles/2.webp', offer: 'خصم لحد 10%' },
  { id: 'br-3', name: 'آجا', image: '/Brand_Tiles/3.webp', offer: 'خصم لحد 45%' },
  { id: 'br-4', name: 'كلوريل', image: '/Brand_Tiles/4.webp', offer: 'خصم لحد 15%' },
  { id: 'br-5', name: 'ديفا', image: '/Brand_Tiles/5.webp', offer: 'خصم لحد 30%' },
  { id: 'br-6', name: 'ديوركس', image: '/Brand_Tiles/6.webp', offer: 'خصم لحد 25%' },
  { id: 'br-7', name: 'الضحى', image: '/Brand_Tiles/7.webp', offer: 'خصم لحد 15%' },
  { id: 'br-8', name: 'نمرة 1', image: '/Brand_Tiles/8.webp', offer: 'خصم لحد 20%' },
  { id: 'br-9', name: 'فيبا', image: '/Brand_Tiles/9.webp', offer: 'خصم لحد 15%' },
  { id: 'br-10', name: 'جلاسي', image: '/Brand_Tiles/10.webp', offer: 'خصم لحد 20%' },
  { id: 'br-11', name: 'إندومي', image: '/Brand_Tiles/11.webp', offer: 'خصم لحد 20%' },
  { id: 'br-12', name: 'جهينة', image: '/Brand_Tiles/12.webp', offer: 'خصم لحد 10%' },
  { id: 'br-13', name: 'ماكسيل', image: '/Brand_Tiles/13.webp', offer: 'خصم لحد 25%' },
  { id: 'br-14', name: 'بامبرز', image: '/Brand_Tiles/14.webp', offer: 'خصم لحد 10%' },
  { id: 'br-15', name: 'ريحانة', image: '/Brand_Tiles/15.webp', offer: 'خصم لحد 15%' },
  { id: 'br-16', name: 'سكاي', image: '/Brand_Tiles/16.webp', offer: 'خصم لحد 25%' },
  { id: 'br-17', name: 'سبيرو سباتس', image: '/Brand_Tiles/17.webp', offer: 'خصم لحد 25%' },
  { id: 'br-18', name: 'V7', image: '/Brand_Tiles/18.webp', offer: 'خصم لحد 20%' },
  { id: 'br-19', name: 'فيلفيتا', image: '/Brand_Tiles/19.webp', offer: 'خصم لحد 20%' },
  { id: 'br-20', name: 'وايت', image: '/Brand_Tiles/20.webp', offer: 'خصم لحد 15%' },
  { id: 'br-21', name: 'زينة', image: '/Brand_Tiles/21.webp', offer: 'خصم لحد 10%' },
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

// 🔥 [NEW] عروض الأجهزة المنزلية (15 منتج - home folder)
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

// ==================================================================================
// 2. LAYOUT LOGIC
// ==================================================================================

const FLUID_CONTAINER = "w-full lg:max-w-[98%] lg:mx-auto lg:px-4"; 

const HeroSlider = () => {
  const banners = [
    '/Home_Page_Banners/1.webp', '/Home_Page_Banners/2.webp', '/Home_Page_Banners/3.webp',
    '/Home_Page_Banners/4.webp', '/Home_Page_Banners/5.webp', '/Home_Page_Banners/6.webp', '/Home_Page_Banners/7.webp',
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => { setCurrentIndex((prev) => (prev + 1) % banners.length); }, 4000); 
    return () => clearInterval(timer);
  }, [banners.length]);

  return (
    <div className="w-full bg-white py-4 mb-6 border-b border-gray-100">
      <div className={FLUID_CONTAINER + " px-2"}> 
        <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[300px] xl:h-[320px] justify-center items-stretch">
          
          {/* ================= كارت مهرجان التسوق (النسخة العملاقة - كابتن يوسف) ================= */}
          <div className="hidden lg:flex w-[240px] xl:w-[280px] 2xl:w-[320px] flex-shrink-0 bg-gradient-to-br from-[#001d3d] via-[#0f172a] to-[#000000] rounded-2xl relative overflow-hidden group hover:shadow-2xl hover:shadow-[#e31e24]/20 transition-all duration-500 border border-white/5">
              
              {/* 1. خلفية إضاءة خافتة */}
              <div className="absolute top-0 right-0 w-full h-full bg-[#e31e24] rounded-full blur-[120px] opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>

              {/* 2. مسرح الأنيميشن (التعديل الجديد: تكبير ملحوظ) */}
              {/* خليناه ياخد المساحة كلها وزيادة شوية عشان يبقى مالي مركزه */}
              <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[115%] h-[115%] flex items-center justify-center group-hover:scale-105 transition-transform duration-700 ease-in-out">
                       <Player
                          autoplay
                          loop
                          src="/anm/shopping.json"
                          // الستايل ده بيضمن إنه يملا الكونتينر بتاعه بالكامل
                          style={{ height: '100%', width: '100%' }}
                      />
                  </div>
              </div>

              {/* 3. الجزء السفلي (الزرار فقط) */}
              <div className="absolute bottom-0 left-0 w-full z-20 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <Link href="/offers" className="w-full py-3 bg-white text-[#001d3d] rounded-xl font-black text-sm hover:bg-[#e31e24] hover:text-white transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 group/btn">
                      تسوق الآن 
                      <span className="bg-[#001d3d] text-white text-[10px] px-1.5 py-0.5 rounded group-hover:bg-white group-hover:text-[#e31e24] transition-colors">50%</span>
                      <ArrowLeft size={16} className="group-hover/btn:-translate-x-1 transition-transform" />
                  </Link>
              </div>

          </div>
          {/* ================= نهاية الكارت ================= */}

          <div className="w-full lg:flex-1 h-[160px] md:h-[240px] lg:h-auto relative rounded-2xl overflow-hidden shadow-sm group border border-gray-100">
            {banners.map((src, index) => (
              <div key={index} className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                <Image src={src} alt={`Offer ${index + 1}`} fill className="object-cover lg:object-fill" priority={index === 0} />
              </div>
            ))}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full">
              {banners.map((_, idx) => (
                <button key={idx} onClick={() => setCurrentIndex(idx)} className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-[#e31e24] w-6' : 'bg-white/60 w-1.5 hover:bg-white'}`} />
              ))}
            </div>
          </div>

          <div className="hidden lg:flex w-[240px] xl:w-[280px] 2xl:w-[320px] flex-shrink-0 flex-col gap-4">
             <div className="flex-1 bg-[#f8f9fa] rounded-2xl p-5 border border-gray-100 flex items-center justify-between hover:border-[#e31e24]/30 transition-colors group cursor-pointer relative overflow-hidden">
                <div className="relative z-10">
                   <h4 className="font-bold text-[#001d3d] text-sm mb-1">شحن سريع</h4>
                   <p className="text-[10px] text-gray-500 font-bold">لجميع المحافظات خلال 48 ساعة</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#e31e24] group-hover:scale-110 transition-transform relative z-10"><Truck size={20} /></div>
             </div>
             <div className="flex-1 bg-[#f8f9fa] rounded-2xl p-5 border border-gray-100 flex items-center justify-between hover:border-[#e31e24]/30 transition-colors group cursor-pointer relative overflow-hidden">
                <div className="relative z-10">
                   <h4 className="font-bold text-[#001d3d] text-sm mb-1">قطع أصلية</h4>
                   <p className="text-[10px] text-gray-500 font-bold">ضمان حقيقي على جميع المنتجات</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#001d3d] group-hover:scale-110 transition-transform relative z-10"><ShieldCheck size={20} /></div>
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

const CategoryTilesSection = () => {
  return (
    <section className="py-4">
      <div className={FLUID_CONTAINER + " mb-8"}>
        <h3 className="text-lg font-bold text-gray-700 mb-6 flex items-center justify-center gap-2 px-2">بتدور على ايه؟</h3>
        
        <div className="w-full overflow-x-auto pb-4 hide-scrollbar pr-2 pl-0">
          <div className="grid grid-rows-1 grid-flow-col gap-4 min-w-max lg:min-w-0 lg:grid-flow-row lg:grid-cols-7 lg:grid-rows-2 lg:justify-items-center">
            {KENZ_TILES.map((tile, idx) => (
              <Link key={idx} href={`/collection/${tile.slug}`} className="group flex flex-col items-center gap-2 w-[80px] md:w-[100px] xl:w-[120px]">
                <div className="w-full aspect-square relative flex items-center justify-center transition-transform duration-300 group-hover:-translate-y-2">
                   <Image src={tile.image} alt={tile.name} fill className="object-contain drop-shadow-sm group-hover:drop-shadow-md transition-all" sizes="(max-width: 768px) 80px, 120px" />
                </div>
                <span className="text-[11px] lg:text-sm font-bold text-gray-600 group-hover:text-[#e31e24] transition-colors text-center">{tile.name}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

const BrandsRail = () => {
  return (
    <section className="py-6 bg-white">
      <div className={FLUID_CONTAINER}>
        <div className="flex items-center justify-between mb-4 px-2"> 
           <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
             <span className="w-1.5 h-6 bg-[#e31e24] rounded-full"></span>
             🌟 نجوم السوبرماركت
           </h2>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory w-full pr-2 pl-0">
           {SUPERMARKET_STARS.map((brand) => (
             <div key={brand.id} className="min-w-[100px] lg:min-w-[160px] snap-start group cursor-pointer">
               <div className="bg-white border border-gray-100 rounded-xl p-2 aspect-square flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-[#e31e24]/30 transition-all relative overflow-hidden">
                  <Image src={brand.image} alt={brand.name} fill className="object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
               </div>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
};

const OkazyonSection = () => {
  const { addToCart } = useCart();
  return (
    <section className="py-6 w-full"> 
      <div className={FLUID_CONTAINER}>
        <div className="bg-[#6c0dfa] mr-2 ml-0 rounded-tr-2xl rounded-br-none rounded-l-none lg:mr-0 lg:ml-0 lg:rounded-t-2xl p-4 lg:p-6 flex items-center justify-between shadow-md relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
           <h2 className="text-white font-black text-lg lg:text-2xl relative z-10 flex items-center gap-2">
             أوكازيون سوبرماركت الحبايب <ChevronDown size={20} className="text-white/70" />
           </h2>
           <Link href="/collection/supermarket" className="text-white text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all relative z-10">عرض الكل <ArrowLeft size={16} /></Link>
        </div>
        
        <div className="bg-[#6c0dfa] p-4 lg:p-6 lg:pt-0 mr-2 ml-0 rounded-br-2xl rounded-tr-none rounded-l-none lg:mr-0 lg:ml-0 lg:rounded-b-2xl lg:rounded-t-none shadow-lg">
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory w-full">
            {OKAZYON_PRODUCTS.map((product) => (
              <div key={product.id} className="min-w-[145px] md:min-w-[180px] lg:min-w-[220px] bg-white rounded-xl p-3 lg:p-4 snap-start relative flex flex-col justify-between group cursor-pointer hover:shadow-xl transition-shadow duration-300">
                <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-1">
                  {product.badge && <span className="bg-[#e31e24] text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">{product.badge}</span>}
                  {product.discount > 0 && <span className="bg-[#10b981]/10 text-[#10b981] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#10b981]/20">-{product.discount}%</span>}
                </div>
                <div className="relative h-28 lg:h-36 w-full mb-2 flex items-center justify-center">
                   <Image src={product.image} alt={product.name} fill className="object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div>
                   <h3 className="font-bold text-gray-800 text-xs lg:text-sm leading-snug line-clamp-2 h-9 lg:h-10 mb-2">{product.name}</h3>
                   <div className="flex items-center gap-1 mb-2">
                      <Star size={12} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-[10px] lg:text-[11px] font-bold text-gray-500">{product.rating} ({product.count})</span>
                   </div>
                   <div className="flex items-end justify-between">
                      <div className="flex flex-col leading-none">
                         <span className="text-[10px] lg:text-[11px] text-gray-400 line-through mb-1">{product.oldPrice}</span>
                         <span className="font-black text-[#001d3d] text-base lg:text-lg">{product.price} <span className="text-[9px] lg:text-[10px]">ج.م</span></span>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-[#001d3d] hover:bg-[#6c0dfa] hover:text-white transition-colors shadow-sm"><PlusCircle size={18} /></button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ProductCard = memo(({ product, addToCart }: any) => {
  return (
    <Link href={`/product/${product.id}`} className="min-w-[155px] lg:min-w-[240px] bg-white rounded-xl p-3 border border-gray-100 hover:border-[#e31e24]/20 hover:shadow-lg transition-all duration-300 group relative flex flex-col justify-between">
      {product.badge && <span className="absolute top-3 right-3 bg-[#e31e24] text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm z-10">{product.badge}</span>}
      
      {product.discount && <span className="absolute top-3 left-3 bg-[#10b981]/10 text-[#10b981] text-[10px] font-bold px-1.5 py-0.5 rounded border border-[#10b981]/20 z-10">-{product.discount}%</span>}

      <div className="relative h-36 lg:h-44 w-full mb-3 flex items-center justify-center overflow-hidden">
          {product.image ? (
            <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 180px, 240px" className="object-contain hover:scale-105 transition-transform duration-500" loading="lazy" />
          ) : ( <Truck className="text-gray-200 w-16 h-16" /> )}
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="font-bold text-gray-800 text-xs lg:text-sm leading-relaxed line-clamp-2 min-h-[36px] lg:min-h-[40px] group-hover:text-[#e31e24] transition-colors">{product.name}</h3>
        <div className="flex items-center gap-1">
           <Star size={12} className="fill-yellow-400 text-yellow-400" />
           <span className="text-[10px] lg:text-[11px] text-gray-400 font-bold">4.8</span>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-col">
              {product.oldPrice > 0 && <span className="text-[10px] lg:text-[11px] text-gray-400 line-through">{product.oldPrice.toLocaleString('en-US')}</span>}
              <span className="text-sm lg:text-base font-black text-[#001d3d]">{product.price.toLocaleString('en-US')} <span className="text-[10px]">ج.م</span></span>
           </div>
           <button onClick={(e) => { e.preventDefault(); addToCart(product); }} className="w-8 h-8 lg:w-9 lg:h-9 rounded-full bg-gray-50 flex items-center justify-center text-[#001d3d] hover:bg-[#e31e24] hover:text-white transition-all shadow-sm"><PlusCircle size={18} /></button>
        </div>
      </div>
    </Link>
  );
});

ProductCard.displayName = 'ProductCard';

export default function HomePage() {
  const { addToCart } = useCart();
  
  return (
    <main className="min-h-screen bg-[#f1f5f9] font-sans text-right pb-20 overflow-x-hidden" dir="rtl">
      
      <HeroSlider />
      <CategoryTilesSection />
      <OkazyonSection />
      
      <div className={FLUID_CONTAINER + " space-y-4 mt-4"}>
        
        <BrandsRail />

        {/* 1. الحاجات الجديدة */}
        <section className="bg-white mr-2 ml-0 rounded-r-2xl rounded-l-none lg:mr-0 lg:ml-0 lg:rounded-2xl py-4 lg:p-6 shadow-sm border-y lg:border border-gray-100 w-full lg:w-auto">
          <div className="flex items-center justify-between mb-4 px-2 lg:px-0">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-black rounded-full"></span>
                الحاجات الجديدة
              </h2>
              <Link href="/collection/new-arrivals" className="text-sm font-bold text-black hover:underline">عرض الكل</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory w-full pr-2 pl-0">
            {NEW_ARRIVALS.map((product: any) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        </section>

        {/* 2. عروض الأكل والشرب */}
        <section className="bg-white mr-2 ml-0 rounded-r-2xl rounded-l-none lg:mr-0 lg:ml-0 lg:rounded-2xl py-4 lg:p-6 shadow-sm border-y lg:border border-gray-100 w-full lg:w-auto">
          <div className="flex items-center justify-between mb-4 px-2 lg:px-0">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#001d3d] rounded-full"></span>
                عروض الأكل والشرب
              </h2>
              <Link href="/collection/food-offers" className="text-sm font-bold text-[#001d3d] hover:underline">عرض الكل</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory w-full pr-2 pl-0">
            {FOOD_OFFERS.map((product: any) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        </section>

        {/* 3. عروض المنظفات */}
        <section className="bg-white mr-2 ml-0 rounded-r-2xl rounded-l-none lg:mr-0 lg:ml-0 lg:rounded-2xl py-4 lg:p-6 shadow-sm border-y lg:border border-gray-100 w-full lg:w-auto">
          <div className="flex items-center justify-between mb-4 px-2 lg:px-0">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#0ea5e9] rounded-full"></span>
                عروض المنظفات
              </h2>
              <Link href="/collection/detergents" className="text-sm font-bold text-[#0ea5e9] hover:underline">عرض الكل</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory w-full pr-2 pl-0">
            {DETERGENT_OFFERS.map((product: any) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        </section>

        {/* 4. عروض العناية الشخصية */}
        <section className="bg-white mr-2 ml-0 rounded-r-2xl rounded-l-none lg:mr-0 lg:ml-0 lg:rounded-2xl py-4 lg:p-6 shadow-sm border-y lg:border border-gray-100 w-full lg:w-auto">
          <div className="flex items-center justify-between mb-4 px-2 lg:px-0">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#d946ef] rounded-full"></span>
                عروض العناية الشخصية
              </h2>
              <Link href="/collection/personal-care" className="text-sm font-bold text-[#d946ef] hover:underline">عرض الكل</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory w-full pr-2 pl-0">
            {PERSONAL_CARE_OFFERS.map((product: any) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        </section>

        {/* 5. عروض البيت والمكتب */}
        <section className="bg-white mr-2 ml-0 rounded-r-2xl rounded-l-none lg:mr-0 lg:ml-0 lg:rounded-2xl py-4 lg:p-6 shadow-sm border-y lg:border border-gray-100 w-full lg:w-auto">
          <div className="flex items-center justify-between mb-4 px-2 lg:px-0">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#3b82f6] rounded-full"></span>
                عروض البيت والمكتب
              </h2>
              <Link href="/collection/home-office" className="text-sm font-bold text-[#3b82f6] hover:underline">عرض الكل</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory w-full pr-2 pl-0">
            {HOME_OFFICE_OFFERS.map((product: any) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        </section>

        {/* 6. عروض الأجهزة المنزلية (NEW 🔥) */}
        <section className="bg-white mr-2 ml-0 rounded-r-2xl rounded-l-none lg:mr-0 lg:ml-0 lg:rounded-2xl py-4 lg:p-6 shadow-sm border-y lg:border border-gray-100 w-full lg:w-auto">
          <div className="flex items-center justify-between mb-4 px-2 lg:px-0">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#22c55e] rounded-full"></span> {/* أخضر للأجهزة */}
                عروض الأجهزة المنزلية
              </h2>
              <Link href="/collection/home-appliances" className="text-sm font-bold text-[#22c55e] hover:underline">عرض الكل</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory w-full pr-2 pl-0">
            {HOME_APPLIANCES_OFFERS.map((product: any) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        </section>

        {/* 7. عروض لوازم العربية */}
        <section className="bg-white mr-2 ml-0 rounded-r-2xl rounded-l-none lg:mr-0 lg:ml-0 lg:rounded-2xl py-4 lg:p-6 shadow-sm border-y lg:border border-gray-100 w-full lg:w-auto">
          <div className="flex items-center justify-between mb-4 px-2 lg:px-0">
              <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-[#ef4444] rounded-full"></span>
                عروض لوازم العربية
              </h2>
              <Link href="/collection/car-accessories" className="text-sm font-bold text-[#ef4444] hover:underline">عرض الكل</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory w-full pr-2 pl-0">
            {CAR_ACCESSORIES.map((product: any) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))}
          </div>
        </section>

      </div>

    </main>
  );
}