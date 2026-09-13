import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Users, 
  ExternalLink, 
  X, 
  Calendar, 
  Check, 
  Sparkles,
  Droplets,
  Car,
  Accessibility,
  BookOpen,
  Coffee,
  Clock,
  Megaphone
} from 'lucide-react';
import { Masjid } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface MasjidDetailsModalProps {
  masjid: Masjid | null;
  isOpen: boolean;
  onClose: () => void;
  isActive: boolean;
  onSelectAsActive: (masjid: Masjid) => void;
}

export const MasjidDetailsModal: React.FC<MasjidDetailsModalProps> = ({
  masjid,
  isOpen,
  onClose,
  isActive,
  onSelectAsActive,
}) => {
  const { t, getMasjidName } = useLanguage();

  if (!isOpen || !masjid) return null;

  // Render facility icon
  const renderFacilityIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets':
        return <Droplets className="w-4 h-4 text-cyan-400" />;
      case 'Users':
        return <Users className="w-4 h-4 text-pink-400" />;
      case 'Car':
        return <Car className="w-4 h-4 text-emerald-400" />;
      case 'Accessibility':
        return <Accessibility className="w-4 h-4 text-amber-400" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4 text-indigo-400" />;
      case 'Coffee':
        return <Coffee className="w-4 h-4 text-orange-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-emerald-400" />;
    }
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${masjid.coordinates.latitude},${masjid.coordinates.longitude}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl bg-gradient-to-b from-[#063826] via-[#04281b] to-[#021810] border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-500/25 flex items-center justify-between gap-3 bg-emerald-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {getMasjidName(masjid)}
              </h2>
              <p className="text-xs text-emerald-300/80">
                {masjid.city}, {masjid.country}
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Quick info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-900/60 border border-emerald-500/20 p-3.5 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="text-slate-400 font-medium block">{t.addressLabel}</span>
                <span className="text-white font-semibold">{masjid.address}, {masjid.city}</span>
              </div>
            </div>

            {masjid.phone && (
              <div className="rounded-2xl bg-slate-900/60 border border-emerald-500/20 p-3.5 flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="text-slate-400 font-medium block">{t.phoneLabel}</span>
                  <a href={`tel:${masjid.phone}`} className="text-emerald-300 font-semibold hover:underline">
                    {masjid.phone}
                  </a>
                </div>
              </div>
            )}

            {masjid.capacity && (
              <div className="rounded-2xl bg-slate-900/60 border border-emerald-500/20 p-3.5 flex items-start gap-3">
                <Users className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="text-slate-400 font-medium block">{t.capacityLabel}</span>
                  <span className="text-white font-semibold">~{masjid.capacity.toLocaleString()} worshippers</span>
                </div>
              </div>
            )}
          </div>

          {/* Announcement if available */}
          {masjid.announcement && (
            <div className="rounded-2xl bg-gradient-to-r from-amber-950/70 to-emerald-950/70 border border-amber-500/30 p-4">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-xs mb-1">
                <Megaphone className="w-4 h-4 text-amber-400" />
                <span>{t.announcementLabel}</span>
              </div>
              <h4 className="text-sm font-semibold text-white">{masjid.announcement.title}</h4>
              <p className="text-xs text-slate-300 mt-1">{masjid.announcement.content}</p>
            </div>
          )}

          {/* Friday Jumu'ah Timetable */}
          {masjid.jumuahSchedule && (
            <div className="rounded-2xl bg-emerald-950/60 border border-emerald-500/30 p-4 space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>{t.jumuahTimings}</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                {masjid.jumuahSchedule.firstKhutbah && (
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-emerald-500/20">
                    <span className="text-[10px] text-slate-400 block">{t.firstKhutbah}</span>
                    <span className="text-sm font-bold text-amber-300">{masjid.jumuahSchedule.firstKhutbah}</span>
                  </div>
                )}
                {masjid.jumuahSchedule.firstSalah && (
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-emerald-500/20">
                    <span className="text-[10px] text-slate-400 block">{t.firstSalah}</span>
                    <span className="text-sm font-bold text-emerald-300">{masjid.jumuahSchedule.firstSalah}</span>
                  </div>
                )}
                {masjid.jumuahSchedule.secondKhutbah && (
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-emerald-500/20">
                    <span className="text-[10px] text-slate-400 block">{t.secondKhutbah}</span>
                    <span className="text-sm font-bold text-amber-300">{masjid.jumuahSchedule.secondKhutbah}</span>
                  </div>
                )}
                {masjid.jumuahSchedule.secondSalah && (
                  <div className="bg-slate-900/80 p-2.5 rounded-xl border border-emerald-500/20">
                    <span className="text-[10px] text-slate-400 block">{t.secondSalah}</span>
                    <span className="text-sm font-bold text-emerald-300">{masjid.jumuahSchedule.secondSalah}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Daily Iqamah Times */}
          {masjid.iqamahTimes && (
            <div className="rounded-2xl bg-slate-900/60 border border-emerald-500/25 p-4 space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Masjid Iqamah Timetable</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                {Object.entries(masjid.iqamahTimes).map(([prayer, time]) => (
                  <div key={prayer} className="bg-emerald-950/70 p-2 rounded-xl border border-emerald-500/20">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block capitalize">{prayer}</span>
                    <span className="text-xs font-bold text-white font-mono mt-0.5">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Masjid Facilities */}
          {masjid.facilities && masjid.facilities.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{t.masjidFacilities}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {masjid.facilities.map((fac) => (
                  <div
                    key={fac.id}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs ${
                      fac.available
                        ? 'bg-slate-900/60 border-emerald-500/30 text-slate-200'
                        : 'bg-slate-950/40 border-slate-800 text-slate-500 line-through'
                    }`}
                  >
                    {renderFacilityIcon(fac.icon)}
                    <span className="font-medium">{fac.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-emerald-500/25 bg-emerald-950/80 flex items-center justify-between gap-3">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-emerald-300 text-xs font-semibold border border-emerald-500/30 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{t.viewOnMap}</span>
          </a>

          <button
            onClick={() => {
              onSelectAsActive(masjid);
              onClose();
            }}
            disabled={isActive}
            className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              isActive
                ? 'bg-emerald-800/60 text-emerald-300 border border-emerald-500/30 cursor-default'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white active:scale-95'
            }`}
          >
            {isActive ? <Check className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
            <span>{isActive ? t.activeBadge : t.setAsActiveMasjid}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
