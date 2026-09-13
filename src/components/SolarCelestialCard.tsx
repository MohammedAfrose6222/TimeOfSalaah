import React from 'react';
import { Sunrise, Sunset, Sun, Moon, Compass, Sparkles } from 'lucide-react';
import { SolarPointItem } from '../services/astronomy';
import { useLanguage } from '../i18n/LanguageContext';

interface SolarCelestialCardProps {
  solarPoints: SolarPointItem[];
}

export const SolarCelestialCard: React.FC<SolarCelestialCardProps> = ({ solarPoints }) => {
  const { language } = useLanguage();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sunrise':
        return <Sunrise className="w-5 h-5 text-amber-400" />;
      case 'Sunset':
        return <Sunset className="w-5 h-5 text-orange-400" />;
      case 'Sun':
        return <Sun className="w-5 h-5 text-yellow-300 animate-spin-slow" />;
      case 'Moon':
        return <Moon className="w-5 h-5 text-indigo-300" />;
      default:
        return <Compass className="w-5 h-5 text-emerald-400" />;
    }
  };

  const getLocalizedName = (item: SolarPointItem) => {
    if (language === 'ta' && item.tamilName) return item.tamilName;
    if (language === 'ar' && item.arabicName) return item.arabicName;
    if (language === 'ur' && item.urduName) return item.urduName;
    return item.name;
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#063826] via-[#04281b] to-[#021810] border border-emerald-500/30 p-4 sm:p-5 shadow-xl relative overflow-hidden backdrop-blur-md">
      {/* Background Islamic geometric subtle accent */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header */}
      <div className="flex items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-emerald-500/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-inner">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>
                {language === 'ta' ? 'சூரிய & வானியல் நிகழ்வுகள்' : language === 'ar' ? 'المواقيت الفلكية والشمسية' : 'Solar & Celestial Timings'}
              </span>
            </h3>
            <p className="text-[11px] text-emerald-300/80">
              {language === 'ta' ? 'உதய, மறைவு, சூரிய உச்சம் மற்றும் நள்ளிரவு நேரம்' : language === 'ar' ? 'الشروق، الغروب، الزوال ومنتصف الليل الشمسي' : 'Sunrise, Sunset, Solar Noon & Solar Midnight'}
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-500/30 font-mono">
          12-Hour AM/PM
        </span>
      </div>

      {/* 4 Solar Points Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {solarPoints.map((point) => {
          const localizedName = getLocalizedName(point);
          const isNoonOrMidnight = point.id === 'solarNoon' || point.id === 'solarMidnight';

          return (
            <div
              key={point.id}
              className={`rounded-2xl p-3 sm:p-3.5 border transition-all duration-200 flex flex-col justify-between ${
                isNoonOrMidnight
                  ? 'bg-slate-900/80 border-emerald-500/30 hover:border-emerald-400/50 hover:bg-emerald-950/40'
                  : 'bg-emerald-950/60 border-amber-500/25 hover:border-amber-400/40 hover:bg-slate-900/90'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-2">
                <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  {getIcon(point.iconName)}
                </div>
                {point.arabicName && (
                  <span className="text-[10px] font-arabic text-amber-300/80 font-bold">
                    {point.arabicName}
                  </span>
                )}
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-300 block truncate">
                  {localizedName}
                </span>
                <span className="text-base sm:text-lg font-extrabold text-white font-mono tracking-tight block mt-0.5">
                  {point.time || 'Timing not available'}
                </span>
              </div>

              <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                {point.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
