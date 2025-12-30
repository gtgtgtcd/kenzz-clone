import React from 'react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        
        {/* اللوجو بيعمل نبض */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#e2e8f0] border-t-[#e31e24] border-b-[#001d3d] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center font-black text-[#001d3d] text-xs">
            C&A
          </div>
        </div>

        {/* نص التحميل */}
        <div className="flex items-center gap-1">
          <span className="text-[#001d3d] font-bold text-sm">جاري التحميل</span>
          <span className="flex gap-0.5 mt-1">
            <span className="w-1 h-1 bg-[#e31e24] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1 h-1 bg-[#e31e24] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1 h-1 bg-[#e31e24] rounded-full animate-bounce"></span>
          </span>
        </div>

      </div>
    </div>
  );
}