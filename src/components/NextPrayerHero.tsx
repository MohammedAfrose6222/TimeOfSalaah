import React from 'react';
import { 
  Clock, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Flame
} from 'lucide-react';
import { NextPrayerInfo, PrayerTimingItem } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface NextPrayerHeroProps {
  nextInfo: NextPrayerInfo;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onPlayAdhanTest: () => void;
}

export const NextPrayerHero: React.FC<NextPrayerHeroProps> = ({
  nextInfo,
  soundEnabled,
  onToggleSound,
  onPlayAdhanTest,
}) => {
  const { t } = useLanguage();
  const { nextPrayer, currentPrayer, hoursLeft, minutesLeft, secondsLeft, progressPercent } = nextInfo;

  // Localized prayer name
  const getLocalizedName = (item: PrayerTimingItem) => {
    const key = item.id as keyof typeof t.prayers;
    return t.prayers[key]?.name || item.name;
  };

  const getLocalizedSubName = (item: PrayerTimingItem) => {
    const key = item.id as keyof typeof t.prayers;
    return t.prayers[key]?.sub || item.subName || '';
  };

  // Format countdown pad
  const pad = (n: number) => n.toString().padStart(2, '0');

  // SVG Circular progress radius
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#064e3b] via-[#043d2c] to-[#022419] border border-emerald-500/40 p-5 sm:p-6 shadow-2xl shadow-emerald-950/80 mihrab-card animate-pulse-glow">
      {/* Decorative background Islamic geometry watermark */}
      <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" className="w-full h-full text-emerald-400">
          <circle cx="100" cy="100" r="90" strokeWidth="2" />
          <polygon points="100,10 190,100 100,190 10,100" strokeWidth="1.5" />
          <polygon points="36,36 164,36 164,164 36,164" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="50" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left column: Next Prayer details */}
        <div className="flex-1 text-center md:text-start w-full">
          {/* Header pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/60 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{t.nextPrayer}</span>
            {currentPrayer && (
              <span className="text-emerald-400/70 text-[11px] hidden sm:inline">
                ({t.currentPrayer}: {getLocalizedName(currentPrayer)})
              </span>
            )}
          </div>

          {/* Large Prayer Title with Arabic calligraphy */}
          <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {getLocalizedName(nextPrayer)}
            </h2>
            <span className="text-2xl sm:text-3xl font-arabic text-amber-300/90 font-bold px-2 py-0.5 rounded-lg bg-emerald-950/50 border border-amber-500/20">
              {nextPrayer.arabicName}
            </span>
          </div>

          {/* Subtitle & Scheduled Time */}
          <p className="text-xs sm:text-sm text-emerald-200/80 mb-3 font-medium">
            {getLocalizedSubName(nextPrayer)} • {t.startsIn} <span className="font-bold text-amber-300">{nextPrayer.time}</span>
          </p>

          {/* Iqamah notice if available */}
          {nextPrayer.iqamahTime && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.iqamahTime}: {nextPrayer.iqamahTime}</span>
            </div>
          )}

          {/* Audio toggle button & test sound */}
          <div className="mt-4 flex items-center justify-center md:justify-start gap-2">
            <button
              onClick={onToggleSound}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                soundEnabled
                  ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200 hover:bg-emerald-500/30'
                  : 'bg-slate-900/60 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundEnabled ? t.enableSound : 'Sound Muted'}</span>
            </button>

            <button
              onClick={onPlayAdhanTest}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/60 hover:text-white text-xs font-medium transition-all"
              title="Test Adhan tone"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.testSound}</span>
            </button>
          </div>
        </div>

        {/* Right column: Circular countdown ticker */}
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
            {/* Background SVG Circle */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 130 130">
              <circle
                cx="65"
                cy="65"
                r={radius}
                className="text-emerald-950"
                strokeWidth="8"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Progress Ring */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="url(#emeraldGradient)"
                fill="transparent"
                className="transition-all duration-1000 ease-linear"
              />
              <defs>
                <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="50%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>

            {/* Live Numerical Countdown in center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
              <Clock className="w-4 h-4 text-emerald-400 mb-1 opacity-80" />
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-white tracking-wider flex items-center">
                <span>{pad(hoursLeft)}</span>
                <span className="text-emerald-400 animate-pulse px-0.5">:</span>
                <span>{pad(minutesLeft)}</span>
                <span className="text-emerald-400 animate-pulse px-0.5">:</span>
                <span className="text-amber-400 text-lg sm:text-xl font-bold">{pad(secondsLeft)}</span>
              </div>
              <span className="text-[10px] uppercase font-semibold text-emerald-300/80 tracking-widest mt-0.5">
                {t.timeRemaining}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
