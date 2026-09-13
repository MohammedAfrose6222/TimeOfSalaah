import React from 'react';
import { 
  Sunrise, 
  Sun, 
  SunMedium, 
  SunDim, 
  CloudSun, 
  Sunset, 
  Moon, 
  MoonStar, 
  Sparkles,
  AlertTriangle,
  Clock,
  CheckCircle2,
  BellRing
} from 'lucide-react';
import { PrayerTimingItem } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface PrayerCardProps {
  prayer: PrayerTimingItem;
  isNextUpcoming: boolean;
}

export const PrayerCard: React.FC<PrayerCardProps> = ({ prayer, isNextUpcoming }) => {
  const { t } = useLanguage();

  // Render proper icon based on icon name
  const renderIcon = () => {
    const iconClass = `w-5 h-5 ${
      isNextUpcoming
        ? 'text-amber-400'
        : prayer.status === 'now'
        ? 'text-emerald-300'
        : prayer.status === 'completed'
        ? 'text-slate-400'
        : 'text-emerald-400'
    }`;

    switch (prayer.iconName) {
      case 'Sunrise':
        return <Sunrise className={iconClass} />;
      case 'SunMedium':
        return <SunMedium className={iconClass} />;
      case 'Sparkles':
        return <Sparkles className={iconClass} />;
      case 'Sun':
        return <Sun className={iconClass} />;
      case 'SunDim':
        return <SunDim className={iconClass} />;
      case 'CloudSun':
        return <CloudSun className={iconClass} />;
      case 'Sunset':
        return <Sunset className={iconClass} />;
      case 'Moon':
        return <Moon className={iconClass} />;
      case 'MoonStar':
        return <MoonStar className={iconClass} />;
      default:
        return <Clock className={iconClass} />;
    }
  };

  const localizedPrayer = t.prayers[prayer.id as keyof typeof t.prayers];
  const displayName = localizedPrayer?.name || prayer.name;
  const displaySub = localizedPrayer?.sub || prayer.subName || '';

  // Card styling depending on status and upcoming highlight
  let cardBg = 'bg-[#04281b]/70 border-emerald-500/20 hover:border-emerald-500/40 hover:bg-[#063826]/80';
  let statusBadge = (
    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30">
      {t.statusUpcoming}
    </span>
  );

  if (prayer.status === 'now') {
    cardBg = 'bg-gradient-to-r from-emerald-900/90 via-emerald-800/80 to-emerald-900/90 border-emerald-400/60 shadow-lg shadow-emerald-950/90 ring-1 ring-emerald-400/40';
    statusBadge = (
      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-slate-950 animate-pulse">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-950" />
        {t.statusNow}
      </span>
    );
  } else if (isNextUpcoming) {
    cardBg = 'bg-gradient-to-r from-[#0a4833] via-[#0d593f] to-[#0a4833] border-amber-400/60 shadow-lg shadow-emerald-950/60 ring-2 ring-amber-400/40';
    statusBadge = (
      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 shadow-sm">
        <BellRing className="w-2.5 h-2.5" />
        {t.statusUpcoming}
      </span>
    );
  } else if (prayer.status === 'completed') {
    cardBg = 'bg-slate-950/40 border-slate-800/60 opacity-70 hover:opacity-90';
    statusBadge = (
      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-900 text-slate-400 border border-slate-700/50">
        <CheckCircle2 className="w-2.5 h-2.5" />
        {t.statusCompleted}
      </span>
    );
  }

  return (
    <div className={`group relative rounded-2xl border p-4 transition-all duration-200 backdrop-blur-sm ${cardBg}`}>
      <div className="flex items-center justify-between gap-3">
        {/* Left Section: Icon & Names */}
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
            isNextUpcoming
              ? 'bg-amber-400/20 border border-amber-400/40 shadow-glow-gold'
              : prayer.status === 'now'
              ? 'bg-emerald-400/20 border border-emerald-400/50'
              : 'bg-emerald-950/60 border border-emerald-500/20'
          }`}>
            {renderIcon()}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`text-base font-bold truncate ${
                isNextUpcoming ? 'text-amber-200' : prayer.status === 'now' ? 'text-white' : 'text-slate-100'
              }`}>
                {displayName}
              </h3>
              <span className="text-xs font-arabic text-amber-300/80 font-bold">
                {prayer.arabicName}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs mt-0.5">
              {displaySub && (
                <span className="text-emerald-300/70 truncate text-[11px] font-medium">
                  {displaySub}
                </span>
              )}
              {prayer.isMakruh && (
                <span className="inline-flex items-center gap-0.5 text-[10px] text-rose-300/90 font-medium bg-rose-950/60 px-1.5 py-0.5 rounded border border-rose-500/30">
                  <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                  Makruh
                </span>
              )}
              {prayer.isMainPrayer && (
                <span className="text-[10px] text-emerald-400/70 font-semibold hidden xs:inline">
                  • {t.fardhPrayer}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Time, Iqamah & Status */}
        <div className="text-end shrink-0">
          <div className={`text-lg sm:text-xl font-extrabold tracking-tight font-mono ${
            prayer.time === 'Timing not available'
              ? 'text-slate-400 text-xs italic font-sans'
              : isNextUpcoming
              ? 'text-amber-300'
              : prayer.status === 'now'
              ? 'text-emerald-300'
              : 'text-white'
          }`}>
            {prayer.time || 'Timing not available'}
          </div>

          <div className="mt-1 flex items-center justify-end gap-1.5">
            {prayer.iqamahTime && (
              <span className="text-[10px] font-medium text-amber-300/90 bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-500/30 font-mono">
                {t.iqamahTime}: {prayer.iqamahTime}
              </span>
            )}
            {statusBadge}
          </div>
        </div>
      </div>
    </div>
  );
};
