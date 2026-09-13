import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Calendar, 
  Globe2, 
  MapPin, 
  Sparkles, 
  Star,
  ChevronDown,
  Moon
} from 'lucide-react';
import { Masjid, SupportedLanguage } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { getHijriDate } from '../services/hijriService';

interface HeaderProps {
  selectedMasjid: Masjid;
  onOpenMasjidSearch: () => void;
  onOpenMasjidDetails: () => void;
  isFavourite: boolean;
  onToggleFavourite: () => void;
  hijriOffsetDays: number;
}

export const Header: React.FC<HeaderProps> = ({
  selectedMasjid,
  onOpenMasjidSearch,
  onOpenMasjidDetails,
  isFavourite,
  onToggleFavourite,
  hijriOffsetDays,
}) => {
  const { language, setLanguage, t, getMasjidName, isRtl } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLangOpen, setIsLangOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hijri = getHijriDate(currentDate, hijriOffsetDays, language);

  const formatGregorianDate = (d: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
    return d.toLocaleDateString(language === 'ta' ? 'ta-IN' : language === 'ar' ? 'ar-SA' : language === 'ur' ? 'ur-PK' : 'en-US', options);
  };

  const languages: { code: SupportedLanguage; label: string; flag: string; native: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧', native: 'English' },
    { code: 'ta', label: 'Tamil', flag: '🇮🇳', native: 'தமிழ்' },
    { code: 'ar', label: 'Arabic', flag: '🇸🇦', native: 'العربية' },
    { code: 'ur', label: 'Urdu', flag: '🇵🇰', native: 'اردو' },
  ];

  return (
    <header className="relative z-30 bg-gradient-to-b from-[#022c22] via-[#043324] to-transparent pt-4 pb-3 px-4 sm:px-6">
      {/* Top bar: App Name & Language Picker */}
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2 mb-3">
        {/* App Branding */}
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-glow flex items-center justify-center">
            <div className="w-full h-full bg-slate-950/80 rounded-[14px] flex items-center justify-center">
              <Moon className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
            </div>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-white via-emerald-100 to-emerald-300 bg-clip-text text-transparent">
              {t.appName}
            </h1>
            <p className="text-[11px] text-emerald-400/80 font-medium">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-200 hover:bg-emerald-900/60 hover:border-emerald-400 transition-all text-xs font-medium backdrop-blur-md"
            aria-label={t.selectLanguage}
          >
            <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{languages.find((l) => l.code === language)?.flag}</span>
            <span className="hidden xs:inline">{languages.find((l) => l.code === language)?.native}</span>
            <ChevronDown className="w-3 h-3 text-emerald-400/70" />
          </button>

          {isLangOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsLangOpen(false)} 
              />
              <div 
                className={`absolute ${isRtl ? 'left-0' : 'right-0'} mt-2 w-44 rounded-2xl bg-slate-900/95 border border-emerald-500/30 shadow-2xl p-1.5 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150`}
              >
                <div className="px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-emerald-400/60 font-semibold">
                  {t.selectLanguage}
                </div>
                {languages.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all ${
                      language === item.code
                        ? 'bg-emerald-600/30 text-emerald-300 font-semibold border border-emerald-500/30'
                        : 'text-slate-300 hover:bg-emerald-950/60 hover:text-emerald-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{item.flag}</span>
                      <span>{item.native}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">{item.label}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Selected Masjid Banner Bar */}
      <div className="max-w-4xl mx-auto">
        <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/90 via-[#063b28]/80 to-emerald-950/90 border border-emerald-500/25 p-3.5 shadow-lg backdrop-blur-md">
          {/* Subtle Islamic pattern overlay */}
          <div className="absolute inset-0 islamic-pattern opacity-30 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            {/* Masjid info */}
            <div className="flex items-start gap-3 min-w-0">
              <div 
                onClick={onOpenMasjidDetails}
                className="cursor-pointer shrink-0 w-10 h-10 rounded-xl bg-emerald-800/50 border border-emerald-400/30 flex items-center justify-center text-emerald-300 hover:bg-emerald-700/60 transition-colors shadow-inner"
                title={t.masjidDetailsTitle}
              >
                <Building2 className="w-5 h-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    {t.selectedMasjid}
                  </span>
                  {selectedMasjid.isVerified && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 font-medium bg-amber-950/50 px-1.5 py-0.5 rounded-full border border-amber-500/30">
                      <Sparkles className="w-2.5 h-2.5" />
                      {t.verifiedMasjid}
                    </span>
                  )}
                </div>

                <div 
                  onClick={onOpenMasjidDetails}
                  className="cursor-pointer group-hover:text-emerald-200 transition-colors"
                >
                  <h2 className="text-base sm:text-lg font-bold text-white truncate mt-0.5">
                    {getMasjidName(selectedMasjid)}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-300/80 truncate">
                    <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate">{selectedMasjid.city}, {selectedMasjid.country}</span>
                    {selectedMasjid.distanceKm !== undefined && (
                      <span className="text-amber-400/90 text-[11px] font-semibold">
                        • {selectedMasjid.distanceKm} {t.distanceKm}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions: Favourite & Change Masjid */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={onToggleFavourite}
                className={`p-2 rounded-xl border transition-all ${
                  isFavourite 
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30' 
                    : 'bg-emerald-950/60 border-emerald-500/30 text-slate-400 hover:text-amber-300 hover:bg-emerald-900/40'
                }`}
                title={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                aria-label="Toggle favourite"
              >
                <Star className={`w-4 h-4 ${isFavourite ? 'fill-amber-400' : ''}`} />
              </button>

              <button
                onClick={onOpenMasjidSearch}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition-all active:scale-95"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{t.changeMasjid}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Date & Hijri banner */}
        <div className="mt-2.5 flex items-center justify-between gap-2 px-1 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-300/90 font-medium">
            <Calendar className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>{formatGregorianDate(currentDate)}</span>
          </div>

          <div className="flex items-center gap-1.5 text-amber-300/90 font-semibold bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            <Moon className="w-3 h-3 text-amber-400 shrink-0" />
            <span>{hijri.formattedString}</span>
          </div>
        </div>

        {/* Special Islamic Event Notification if today is an Islamic occasion */}
        {hijri.specialEvent && (
          <div className="mt-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-emerald-500/15 to-amber-500/15 border border-amber-500/30 text-amber-200 text-xs font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
            <span>{hijri.specialEvent}</span>
          </div>
        )}
      </div>
    </header>
  );
};
