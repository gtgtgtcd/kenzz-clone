'use client';

import React from 'react';
import Image, { ImageProps } from 'next/image';

// استبدل مسار اللوجو بمسار اللوجو بتاعك الحقيقي
const WATERMARK_TEXT = "AL CAPTAIN"; // أو ممكن تحط صورة

export const WatermarkImage = (props: ImageProps) => {
  return (
    <div className="relative inline-block overflow-hidden w-full h-full group">
      {/* 1. الصورة الأصلية */}
      <Image {...props} />

      {/* 2. الختم المائي (Watermark Layer) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none opacity-30 select-none mix-blend-overlay">
        {/* تصميم الختم: نص مائل ومتكرر */}
        <div className="transform -rotate-45 text-center">
          <span className="text-4xl font-black text-gray-500/50 block whitespace-nowrap">
            {WATERMARK_TEXT}
          </span>
          <span className="text-2xl font-bold text-gray-400/30 block mt-2">
            Original Product
          </span>
        </div>
        
        {/* نمط متكرر (Pattern) لو عايز تغطي الصورة كلها */}
        <div 
            className="absolute inset-0 w-full h-full opacity-10"
            style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, #000 20px, #000 22px)'
            }}
        ></div>
      </div>
    </div>
  );
};