import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  Printer, 
  ChevronLeft, 
  ChevronRight, 
  Building2
} from 'lucide-react';
import { Masjid, UserSettings } from '../types';
import { calculatePrayerTimes, formatPrayerTime } from '../services/astronomy';
import { getHijriDate } from '../services/hijriService';
import { useLanguage } from '../i18n/LanguageContext';

interface TimetableTabProps {
  selectedMasjid: Masjid;
  settings: UserSettings;
}

export const TimetableTab: React.FC<TimetableTabProps> = ({ selectedMasjid, settings }) => {
  const { t, language, getMasjidName } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const today = new Date();

  // Generate 30/31 days of calculated prayer timings for this month
  const monthDays = useMemo(() => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const days = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(selectedYear, selectedMonth, day);
      const raw = calculatePrayerTimes(
        d,
        selectedMasjid.coordinates,
        settings.calculationMethod,
        settings.juristicMethod,
        selectedMasjid.customOffsets
      );

      const isToday =
        today.getDate() === day &&
        today.getMonth() === selectedMonth &&
        today.getFullYear() === selectedYear;

      const hijri = getHijriDate(d, settings.hijriOffsetDays, language);

      days.push({
        dayNumber: day,
        dayName: d.toLocaleDateString(language === 'ta' ? 'ta-IN' : language === 'ar' ? 'ar-SA' : language === 'ur' ? 'ur-PK' : 'en-US', { weekday: 'short' }),
        date: d,
        isToday,
        hijriDay: hijri.day,
        hijriMonthName: hijri.monthNameEn,
        fajr: formatPrayerTime(raw.fajr, settings.timeFormat24),
        sunrise: formatPrayerTime(raw.sunrise, settings.timeFormat24),
        ishraq: formatPrayerTime(raw.ishraq, settings.timeFormat24),
        chasht: formatPrayerTime(raw.chasht, settings.timeFormat24),
        zawal: formatPrayerTime(raw.zawal, settings.timeFormat24),
        zuhr: formatPrayerTime(raw.zuhr, settings.timeFormat24),
        asr: formatPrayerTime(raw.asr, settings.timeFormat24),
        maghrib: formatPrayerTime(raw.maghrib, settings.timeFormat24),
        isha: formatPrayerTime(raw.isha, settings.timeFormat24),
        tahajjud: formatPrayerTime(raw.tahajjud, settings.timeFormat24),
      });
    }

    return days;
  }, [selectedYear, selectedMonth, selectedMasjid, settings, language, today]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 pb-20">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#063826] via-[#04281b] to-[#063826] border border-emerald-500/30 p-4 sm:p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-start">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {t.monthlyTimetableTitle}
            </h2>
            <p className="text-xs text-emerald-300/80 flex items-center gap-1.5 justify-center sm:justify-start">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{getMasjidName(selectedMasjid)} ({selectedMasjid.city})</span>
            </p>
          </div>
        </div>

        {/* Month Navigation & Print */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900/90 rounded-2xl border border-emerald-500/30 p-1 text-xs">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl hover:bg-emerald-800 text-emerald-300 transition-colors"
              aria-label="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-3 font-bold text-white min-w-[120px] text-center">
              {monthNames[selectedMonth]} {selectedYear}
            </span>

            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl hover:bg-emerald-800 text-emerald-300 transition-colors"
              aria-label="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-600/80 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors"
            title="Print Timetable"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.printTimetable}</span>
          </button>
        </div>
      </div>

      {/* Timetable Table Card */}
      <div className="rounded-3xl bg-slate-900/60 border border-emerald-500/25 overflow-hidden shadow-2xl backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs border-collapse">
            <thead>
              <tr className="bg-emerald-950/90 border-b border-emerald-500/30 text-emerald-300 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-3 text-start">{t.dateCol}</th>
                <th className="py-3 px-2">Hijri</th>
                <th className="py-3 px-2 text-amber-300 font-bold">Fajr</th>
                <th className="py-3 px-2">Sunrise</th>
                <th className="py-3 px-2">Ishraq</th>
                <th className="py-3 px-2">Chasht</th>
                <th className="py-3 px-2">Zawal</th>
                <th className="py-3 px-2 text-amber-300 font-bold">Zuhr</th>
                <th className="py-3 px-2 text-amber-300 font-bold">Asr</th>
                <th className="py-3 px-2 text-amber-300 font-bold">Maghrib</th>
                <th className="py-3 px-2 text-amber-300 font-bold">Isha</th>
                <th className="py-3 px-2">Tahajjud</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-950/60 font-mono">
              {monthDays.map((item) => (
                <tr
                  key={item.dayNumber}
                  className={`transition-colors ${
                    item.isToday
                      ? 'bg-emerald-600/30 text-white font-bold ring-1 ring-emerald-400/50'
                      : 'text-slate-300 hover:bg-emerald-950/40'
                  }`}
                >
                  <td className="py-2.5 px-3 text-start font-sans">
                    <span className="font-semibold text-white">{item.dayNumber}</span>{' '}
                    <span className="text-emerald-400 text-[10px]">({item.dayName})</span>
                    {item.isToday && (
                      <span className="ms-1.5 inline-block text-[9px] bg-emerald-500 text-slate-950 font-bold px-1.5 py-0.2 rounded-full font-sans">
                        Today
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 text-amber-300/80 font-sans text-[11px]">
                    {item.hijriDay}
                  </td>
                  <td className="py-2.5 px-2 text-amber-200 font-semibold">{item.fajr}</td>
                  <td className="py-2.5 px-2 text-slate-400">{item.sunrise}</td>
                  <td className="py-2.5 px-2 text-slate-300">{item.ishraq}</td>
                  <td className="py-2.5 px-2 text-slate-300">{item.chasht}</td>
                  <td className="py-2.5 px-2 text-rose-300/80">{item.zawal}</td>
                  <td className="py-2.5 px-2 text-emerald-300 font-semibold">{item.zuhr}</td>
                  <td className="py-2.5 px-2 text-emerald-300 font-semibold">{item.asr}</td>
                  <td className="py-2.5 px-2 text-amber-200 font-semibold">{item.maghrib}</td>
                  <td className="py-2.5 px-2 text-emerald-300 font-semibold">{item.isha}</td>
                  <td className="py-2.5 px-2 text-teal-300/80">{item.tahajjud}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
