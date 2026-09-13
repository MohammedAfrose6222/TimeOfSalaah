import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  X, 
  Save, 
  RotateCcw, 
  Clock, 
  Calendar, 
  Megaphone, 
  Check, 
  Sliders
} from 'lucide-react';
import { Masjid } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface AdminTimingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  masjid: Masjid;
  onSaveMasjid: (updatedMasjid: Masjid) => void;
}

export const AdminTimingsModal: React.FC<AdminTimingsModalProps> = ({
  isOpen,
  onClose,
  masjid,
  onSaveMasjid,
}) => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState<Masjid>({ ...masjid });
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setFormData({ ...masjid });
  }, [masjid, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMasjid(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleResetOffsets = () => {
    setFormData({
      ...formData,
      customOffsets: { fajr: 0, zuhr: 0, asr: 0, maghrib: 0, isha: 0 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl bg-gradient-to-b from-[#063826] via-[#04281b] to-[#021810] border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-500/25 flex items-center justify-between gap-3 bg-emerald-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>
                  {language === 'ta' ? 'பள்ளிவாசல் நேரங்கள் & விவரங்கள் புதுப்பித்தல்' : language === 'ar' ? 'تحديث وتعديل مواقيت المسجد' : 'Update Mosque Timings & Details'}
                </span>
              </h2>
              <p className="text-xs text-emerald-300/80">
                {formData.name} • {formData.city}, {formData.state || 'Tamil Nadu'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-emerald-950/80 text-emerald-300 hover:text-white hover:bg-emerald-900 border border-emerald-500/30 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {savedSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-600/30 border border-emerald-400 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95 duration-150">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Timings & Mosque details successfully updated and saved!</span>
            </div>
          )}

          {/* Section 1: Mosque Identification */}
          <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-emerald-500/20">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Building2 className="w-4 h-4" />
              <span>Mosque Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-300 font-medium block mb-1">Mosque Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-medium block mb-1">Location / Village</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] text-slate-300 font-medium block mb-1">Full Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-medium block mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 94440 12345"
                  className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-medium block mb-1">Capacity (Worshippers)</label>
                <input
                  type="number"
                  value={formData.capacity || ''}
                  onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                  placeholder="1200"
                  className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Daily Iqamah Times */}
          <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Daily Iqamah Timings</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Format: 05:30 AM / 01:15 PM</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {(['fajr', 'zuhr', 'asr', 'maghrib', 'isha'] as const).map((prayer) => (
                <div key={prayer}>
                  <label className="text-[10px] text-slate-300 font-bold block mb-1 uppercase">
                    {prayer === 'zuhr' ? 'Dhuhr' : prayer}
                  </label>
                  <input
                    type="text"
                    value={formData.iqamahTimes?.[prayer] || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        iqamahTimes: {
                          ...formData.iqamahTimes,
                          [prayer]: e.target.value,
                        },
                      })
                    }
                    placeholder="HH:MM AM"
                    className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono text-center focus:outline-none focus:border-emerald-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Calculation Offsets (+/- Minutes) */}
          <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                <span>Timing Minute Offsets (+/- Mins)</span>
              </h3>
              <button
                type="button"
                onClick={handleResetOffsets}
                className="text-[10px] text-amber-300 hover:text-white flex items-center gap-1 underline font-semibold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to 0</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {(['fajr', 'zuhr', 'asr', 'maghrib', 'isha'] as const).map((prayer) => (
                <div key={prayer}>
                  <label className="text-[10px] text-slate-300 font-bold block mb-1 uppercase">
                    {prayer === 'zuhr' ? 'Dhuhr' : prayer} (min)
                  </label>
                  <input
                    type="number"
                    value={formData.customOffsets?.[prayer] ?? 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customOffsets: {
                          ...formData.customOffsets,
                          [prayer]: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono text-center focus:outline-none focus:border-emerald-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Friday Jumuah Schedule */}
          <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-emerald-500/20">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              <span>Friday Jumu'ah Timetable</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-300 font-medium block mb-1">Khutbah Time</label>
                <input
                  type="text"
                  value={formData.jumuahSchedule?.firstKhutbah || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      jumuahSchedule: {
                        ...formData.jumuahSchedule,
                        firstKhutbah: e.target.value,
                      },
                    })
                  }
                  placeholder="01:00 PM"
                  className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-medium block mb-1">Salah (Jama'ah) Time</label>
                <input
                  type="text"
                  value={formData.jumuahSchedule?.firstSalah || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      jumuahSchedule: {
                        ...formData.jumuahSchedule,
                        firstSalah: e.target.value,
                      },
                    })
                  }
                  placeholder="01:30 PM"
                  className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Mosque Announcement */}
          <div className="space-y-3 bg-slate-900/60 p-4 rounded-2xl border border-emerald-500/20">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Megaphone className="w-4 h-4" />
              <span>Notice Board / Announcement</span>
            </h3>

            <div>
              <label className="text-[11px] text-slate-300 font-medium block mb-1">Title</label>
              <input
                type="text"
                value={formData.announcement?.title || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    announcement: {
                      title: e.target.value,
                      content: formData.announcement?.content || '',
                      date: new Date().toISOString().split('T')[0],
                    },
                  })
                }
                placeholder="Weekly Hadith Dars / Tajweed Halqa"
                className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-300 font-medium block mb-1">Content / Details</label>
              <textarea
                value={formData.announcement?.content || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    announcement: {
                      title: formData.announcement?.title || 'Notice',
                      content: e.target.value,
                      date: new Date().toISOString().split('T')[0],
                    },
                  })
                }
                rows={2}
                placeholder="Details of the announcement for worshippers..."
                className="w-full bg-slate-950 border border-emerald-500/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-emerald-500/25 bg-emerald-950/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950 transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>Save & Apply Timings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
