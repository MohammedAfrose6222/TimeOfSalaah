import React, { useState } from 'react';
import { 
  Settings, 
  Globe2, 
  Compass, 
  Clock, 
  Volume2, 
  Server, 
  RotateCcw, 
  Check, 
  Flame
} from 'lucide-react';
import { CalculationMethod, SupportedLanguage, UserSettings } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { audioService } from '../services/audioService';

interface SettingsTabProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onResetDefaults: () => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  onUpdateSettings,
  onResetDefaults,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [formData, setFormData] = useState<UserSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const languages: { code: SupportedLanguage; label: string; flag: string; native: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧', native: 'English' },
    { code: 'ta', label: 'Tamil', flag: '🇮🇳', native: 'தமிழ்' },
    { code: 'ar', label: 'Arabic', flag: '🇸🇦', native: 'العربية' },
    { code: 'ur', label: 'Urdu', flag: '🇵🇰', native: 'اردو' },
  ];

  const calculationMethods: { id: CalculationMethod; label: string; desc: string }[] = [
    { id: 'KARACHI', label: 'Univ. of Islamic Sciences, Karachi', desc: 'Fajr 18°, Isha 18° (Widely used in South Asia)' },
    { id: 'MWL', label: 'Muslim World League (MWL)', desc: 'Fajr 18°, Isha 17° (Europe, Far East, parts of US)' },
    { id: 'MAKKAH', label: 'Umm Al-Qura University, Makkah', desc: 'Fajr 18.5°, Isha 90 mins after Maghrib (Saudi Arabia & Gulf)' },
    { id: 'EGYPT', label: 'Egyptian General Authority of Survey', desc: 'Fajr 19.5°, Isha 17.5° (Africa, Middle East)' },
    { id: 'ISNA', label: 'Islamic Society of North America (ISNA)', desc: 'Fajr 15°, Isha 15° (USA, Canada)' },
    { id: 'TEHRAN', label: 'Institute of Geophysics, Tehran (Jafari)', desc: 'Fajr 17.7°, Maghrib 4.5°, Isha 14°' },
    { id: 'GULF', label: 'Gulf Region', desc: 'Fajr 19.5°, Isha 90 min interval' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleTestAudio = async () => {
    setIsPlayingAudio(true);
    await audioService.playNotification(formData.selectedAdhanAudio);
    setTimeout(() => setIsPlayingAudio(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24">
      {/* Title */}
      <div className="rounded-3xl bg-gradient-to-r from-[#063826] via-[#04281b] to-[#063826] border border-emerald-500/30 p-5 shadow-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {t.settingsTitle}
            </h2>
            <p className="text-xs text-emerald-300/80">
              Customize language, calculation rules, and notifications
            </p>
          </div>
        </div>

        <button
          onClick={onResetDefaults}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700/60 transition-colors"
          title={t.resetDefaults}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t.resetDefaults}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* 1. Language Option */}
        <div className="rounded-3xl bg-slate-900/70 border border-emerald-500/25 p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
            <Globe2 className="w-4 h-4 text-emerald-400" />
            <span>{t.languageSection}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {languages.map((item) => (
              <button
                type="button"
                key={item.code}
                onClick={() => {
                  setLanguage(item.code);
                  setFormData((prev) => ({ ...prev, language: item.code }));
                }}
                className={`p-3 rounded-2xl border text-center transition-all ${
                  language === item.code
                    ? 'bg-emerald-600/30 border-emerald-400 text-white font-bold shadow-glow'
                    : 'bg-slate-950/60 border-emerald-500/20 text-slate-300 hover:bg-emerald-950/40'
                }`}
              >
                <span className="text-2xl block mb-1">{item.flag}</span>
                <span className="text-xs font-semibold block">{item.native}</span>
                <span className="text-[10px] text-slate-400 block">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. Calculation Method & Juristic Asr */}
        <div className="rounded-3xl bg-slate-900/70 border border-emerald-500/25 p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>{t.calculationSection}</span>
          </div>

          {/* Calculation Method Dropdown */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              {t.calcMethodLabel}
            </label>
            <select
              value={formData.calculationMethod}
              onChange={(e) => setFormData({ ...formData, calculationMethod: e.target.value as CalculationMethod })}
              className="w-full bg-slate-950 border border-emerald-500/30 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
            >
              {calculationMethods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label} ({m.desc})
                </option>
              ))}
            </select>
          </div>

          {/* Juristic Asr Selection (Hanafi / Standard) */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block">
              {t.juristicLabel}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer text-xs transition-all ${
                formData.juristicMethod === 'STANDARD'
                  ? 'bg-emerald-600/30 border-emerald-400 text-white font-bold'
                  : 'bg-slate-950/60 border-emerald-500/20 text-slate-300 hover:bg-emerald-950/30'
              }`}>
                <input
                  type="radio"
                  name="juristic"
                  value="STANDARD"
                  checked={formData.juristicMethod === 'STANDARD'}
                  onChange={() => setFormData({ ...formData, juristicMethod: 'STANDARD' })}
                  className="hidden"
                />
                <span className="w-4 h-4 rounded-full border border-emerald-400 flex items-center justify-center shrink-0">
                  {formData.juristicMethod === 'STANDARD' && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                </span>
                <span>{t.juristicStandard}</span>
              </label>

              <label className={`flex items-center gap-2.5 p-3 rounded-2xl border cursor-pointer text-xs transition-all ${
                formData.juristicMethod === 'HANAFI'
                  ? 'bg-emerald-600/30 border-emerald-400 text-white font-bold'
                  : 'bg-slate-950/60 border-emerald-500/20 text-slate-300 hover:bg-emerald-950/30'
              }`}>
                <input
                  type="radio"
                  name="juristic"
                  value="HANAFI"
                  checked={formData.juristicMethod === 'HANAFI'}
                  onChange={() => setFormData({ ...formData, juristicMethod: 'HANAFI' })}
                  className="hidden"
                />
                <span className="w-4 h-4 rounded-full border border-emerald-400 flex items-center justify-center shrink-0">
                  {formData.juristicMethod === 'HANAFI' && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                </span>
                <span>{t.juristicHanafi}</span>
              </label>
            </div>
          </div>
        </div>

        {/* 3. Time Display Format & Hijri Adjustment */}
        <div className="rounded-3xl bg-slate-900/70 border border-emerald-500/25 p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Time & Hijri Date Settings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Time Format */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                {t.timeFormatLabel}
              </label>
              <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-emerald-500/30 text-xs">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, timeFormat24: false })}
                  className={`flex-1 py-1.5 rounded-xl font-semibold transition-all ${
                    !formData.timeFormat24 ? 'bg-emerald-600 text-white' : 'text-slate-400'
                  }`}
                >
                  {t.format12h}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, timeFormat24: true })}
                  className={`flex-1 py-1.5 rounded-xl font-semibold transition-all ${
                    formData.timeFormat24 ? 'bg-emerald-600 text-white' : 'text-slate-400'
                  }`}
                >
                  {t.format24h}
                </button>
              </div>
            </div>

            {/* Hijri Adjustment (+/- 2 days) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                {t.hijriAdjustmentLabel}
              </label>
              <select
                value={formData.hijriOffsetDays}
                onChange={(e) => setFormData({ ...formData, hijriOffsetDays: parseInt(e.target.value, 10) })}
                className="w-full bg-slate-950 border border-emerald-500/30 rounded-2xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                <option value={-2}>-2 Days (Moon seen 2 days earlier)</option>
                <option value={-1}>-1 Day (Moon seen 1 day earlier)</option>
                <option value={0}>0 Days (Standard Umm Al-Qura)</option>
                <option value={1}>+1 Day (Moon seen 1 day later)</option>
                <option value={2}>+2 Days (Moon seen 2 days later)</option>
              </select>
              <span className="text-[10px] text-slate-400 block">{t.hijriAdjustmentHelp}</span>
            </div>
          </div>
        </div>

        {/* 4. Sound & Adhan Notifications */}
        <div className="rounded-3xl bg-slate-900/70 border border-emerald-500/25 p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>{t.notificationsSection}</span>
          </div>

          <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950/60 border border-emerald-500/20">
            <div>
              <span className="text-xs font-semibold text-white block">{t.enableSound}</span>
              <span className="text-[11px] text-slate-400">Play audio reminder at prayer times</span>
            </div>
            <input
              type="checkbox"
              checked={formData.soundNotification}
              onChange={(e) => setFormData({ ...formData, soundNotification: e.target.checked })}
              className="w-5 h-5 rounded accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Sound choice & Test */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 items-end">
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                {t.adhanAudioChoice}
              </label>
              <select
                value={formData.selectedAdhanAudio}
                onChange={(e) => setFormData({ ...formData, selectedAdhanAudio: e.target.value as any })}
                className="w-full bg-slate-950 border border-emerald-500/30 rounded-2xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="chime">Harmonic Peaceful Chime</option>
                <option value="makkah">Melodic Maqam Bayati (Adhan Tone)</option>
                <option value="soft_beep">Soft Discrete Beep</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleTestAudio}
              disabled={isPlayingAudio}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 hover:bg-emerald-900 text-xs font-semibold transition-all disabled:opacity-50"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>{isPlayingAudio ? t.soundPlaying : t.testSound}</span>
            </button>
          </div>
        </div>

        {/* 5. Backend Database & API Connection */}
        <div className="rounded-3xl bg-slate-900/70 border border-emerald-500/25 p-5 shadow-lg space-y-3">
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>{t.backendSection}</span>
          </div>
          <p className="text-xs text-slate-400">
            {t.backendDesc}
          </p>
          <input
            type="url"
            value={formData.customApiUrl || ''}
            onChange={(e) => setFormData({ ...formData, customApiUrl: e.target.value })}
            placeholder={t.apiUrlPlaceholder}
            className="w-full bg-slate-950 border border-emerald-500/30 rounded-2xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400 font-mono"
          />
        </div>

        {/* Submit & Save */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {isSaved && (
            <span className="flex items-center gap-1 text-xs text-emerald-300 font-bold animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-400" />
              {t.savedSuccess}
            </span>
          )}

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold shadow-xl shadow-emerald-950 transition-all active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>{t.savePreferences}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
