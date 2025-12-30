'use client';
import React, { createContext, useContext, useState } from 'react';

// تعريف الأنواع والألوان
export type AppContextType = 'auto' | 'gems';

export const AUTO_THEME = {
  id: 'auto',
  primary: '#001d3d',
  accent: '#e31e24',
  bg: '#f8fafc',
  text: '#001d3d'
};

export const GEM_THEMES = [
  { id: 'agate', name: 'عقيق كبدي', primary: '#4a0404', accent: '#dc2626', bg: '#fff5f5' }, 
  { id: 'emerald', name: 'زمرد ملكي', primary: '#064e3b', accent: '#059669', bg: '#f0fdf4' }, 
  { id: 'sapphire', name: 'ياقوت أزرق', primary: '#1e3a8a', accent: '#3b82f6', bg: '#eff6ff' }, 
];

type StoreContextInterface = {
  activeContext: AppContextType;
  setContext: (c: AppContextType) => void;
  currentTheme: any;
  activeGemThemeId: string;
  setGemTheme: (id: string) => void;
  // [جديد] حالة القائمة الجانبية عشان نتحكم فيها من الهيدر والفوتر
  isSidebarOpen: boolean;
  setIsSidebarOpen: (v: boolean) => void;
};

const StoreContext = createContext<StoreContextInterface | undefined>(undefined);

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeContext, setActiveContext] = useState<AppContextType>('auto');
  const [activeGemThemeId, setActiveGemThemeId] = useState('agate');
  // [جديد] تعريف الـ State هنا
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const currentTheme = activeContext === 'auto' 
    ? AUTO_THEME 
    : GEM_THEMES.find(t => t.id === activeGemThemeId) || GEM_THEMES[0];

  return (
    <StoreContext.Provider value={{ 
        activeContext, 
        setContext: setActiveContext, 
        currentTheme, 
        activeGemThemeId, 
        setGemTheme: setActiveGemThemeId,
        // [جديد] تمرير القيم للبروفايدر
        isSidebarOpen,
        setIsSidebarOpen
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};