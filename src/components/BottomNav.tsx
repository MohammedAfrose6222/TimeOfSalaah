import React from 'react';
import { Home, Building2, Calendar, Compass, Settings } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export type NavTab = 'home' | 'masjids' | 'timings' | 'qibla' | 'settings';

interface BottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const { t } = useLanguage();

  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: t.navHome, icon: Home },
    { id: 'masjids', label: t.navMasjids, icon: Building2 },
    { id: 'timings', label: t.navTimings, icon: Calendar },
    { id: 'qibla', label: t.navQibla, icon: Compass },
    { id: 'settings', label: t.navSettings, icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#021c13]/95 border-t border-emerald-500/25 shadow-2xl backdrop-blur-xl px-2 py-1.5 sm:py-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-emerald-300 font-bold scale-105'
                  : 'text-slate-400 hover:text-emerald-200'
              }`}
            >
              {isActive && (
                <span className="absolute -top-1.5 w-8 h-1 bg-gradient-to-r from-emerald-400 to-amber-400 rounded-full shadow-glow" />
              )}
              <div className={`p-1.5 rounded-xl transition-colors ${
                isActive ? 'bg-emerald-600/30 border border-emerald-400/40' : ''
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
