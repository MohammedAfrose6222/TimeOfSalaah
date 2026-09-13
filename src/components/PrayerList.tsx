import React, { useState } from 'react';
import { PrayerTimingItem, NextPrayerInfo, Masjid } from '../types';
import { SolarPointItem } from '../services/astronomy';
import { PrayerCard } from './PrayerCard';
import { SolarCelestialCard } from './SolarCelestialCard';
import { Sparkles, Sliders, Info, Building2, MapPin } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface PrayerListProps {
  prayers: PrayerTimingItem[];
  nextInfo: NextPrayerInfo;
  solarPoints: SolarPointItem[];
  selectedMasjid: Masjid;
  onOpenAdminTimings?: () => void;
  onOpenMasjidDetails?: () => void;
}

export const PrayerList: React.FC<PrayerListProps> = ({ 
  prayers, 
  nextInfo, 
  solarPoints,
  selectedMasjid,
  onOpenAdminTimings,
  onOpenMasjidDetails,
}) => {
  const { language, getMasjidName } = useLanguage();
  const [filterMode, setFilterMode] = useState<'all' | 'fardh'>('all');

  const displayedPrayers = filterMode === 'fardh' ? prayers.filter((p) => p.isMainPrayer) : prayers;

  return (
    <div className="space-y-6">
      {/* Masjid Quick Banner & Admin Bar */}
      <div className="rounded-2xl bg-slate-900/80 border border-emerald-500/25 p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                {getMasjidName(selectedMasjid)}
              </h3>
              <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Active Mosque Timings
              </span>
            </div>
            <p className="text-xs text-emerald-300/80 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
              <span>{selectedMasjid.address || `${selectedMasjid.city}, Tamil Nadu 631210`}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons: Admin Edit & Masjid Details */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {onOpenMasjidDetails && (
            <button
              onClick={onOpenMasjidDetails}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-semibold transition-colors"
              title="View Masjid Details"
            >
              <Info className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'விவரங்கள்' : language === 'ar' ? 'تفاصيل المسجد' : 'Masjid Details'}</span>
            </button>
          )}

          {onOpenAdminTimings && (
            <button
              onClick={onOpenAdminTimings}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
              title="Update Mosque Prayer & Iqamah Timings"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'நேரம் மாற்று' : language === 'ar' ? 'تحديث المواقيت' : 'Update Timings'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main 9 Daily Salah / Sunnah List */}
      <div className="space-y-3.5">
        {/* Header & Filter Toggle */}
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              {filterMode === 'all' 
                ? (language === 'ta' ? 'தினசரி தொழுகை & நஃபில் நேரங்கள்' : language === 'ar' ? 'مواقيت الصلوات والنوافل اليومية' : 'Daily Salah & Sunnah Timings (9 Prayers)')
                : (language === 'ta' ? '5 கடமையான தொழுகைகள் (ஃபர்ள்)' : language === 'ar' ? 'الصلوات الخمس المفروضة' : '5 Obligatory Prayers (Fardh)')
              }
            </h3>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-emerald-950/70 p-1 rounded-xl border border-emerald-500/30 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                filterMode === 'all'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-300/70 hover:text-white'
              }`}
            >
              {language === 'ta' ? 'அனைத்து 9' : language === 'ar' ? 'الكل' : 'All 9'}
            </button>
            <button
              onClick={() => setFilterMode('fardh')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                filterMode === 'fardh'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-300/70 hover:text-white'
              }`}
            >
              {language === 'ta' ? '5 ஃபர்ள்' : language === 'ar' ? 'الفرائض' : '5 Fardh'}
            </button>
          </div>
        </div>

        {/* Grid / List of prayer cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {displayedPrayers.map((prayer) => {
            const isNext = prayer.id === nextInfo.nextPrayer.id;
            return (
              <PrayerCard
                key={prayer.id}
                prayer={prayer}
                isNextUpcoming={isNext}
              />
            );
          })}
        </div>
      </div>

      {/* Solar Celestial Points Section (Sunrise, Sunset, Solar Noon, Solar Midnight) */}
      <SolarCelestialCard solarPoints={solarPoints} />
    </div>
  );
};
