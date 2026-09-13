import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Masjid, NextPrayerInfo, PrayerTimingItem, UserSettings } from './types';
import { storageService, DEFAULT_SETTINGS } from './services/storageService';
import { masjidService } from './services/masjidService';
import { calculatePrayerTimes, buildPrayerTimingItems, buildSolarCelestialPoints } from './services/astronomy';
import { audioService } from './services/audioService';
import { Header } from './components/Header';
import { NextPrayerHero } from './components/NextPrayerHero';
import { PrayerList } from './components/PrayerList';
import { MasjidSearchModal } from './components/MasjidSearchModal';
import { MasjidDetailsModal } from './components/MasjidDetailsModal';
import { AdminTimingsModal } from './components/AdminTimingsModal';
import { TimetableTab } from './components/TimetableTab';
import { QiblaCompass } from './components/QiblaCompass';
import { SettingsTab } from './components/SettingsTab';
import { BottomNav, NavTab } from './components/BottomNav';

export const App: React.FC = () => {
  // Load User Settings
  const [settings, setSettings] = useState<UserSettings>(() => storageService.loadSettings());
  
  // Active Tab
  const [activeTab, setActiveTab] = useState<NavTab>('home');

  // Selected Masjid (Defaults to Masjid E Mohammadia)
  const [selectedMasjid, setSelectedMasjid] = useState<Masjid>(() => {
    return masjidService.getMasjidById(settings.selectedMasjidId) || masjidService.getAllMasjids()[0];
  });

  // Modal States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [detailsMasjid, setDetailsMasjid] = useState<Masjid | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isAdminTimingsOpen, setIsAdminTimingsOpen] = useState(false);

  // Live Timer state (updates every second)
  const [now, setNow] = useState(new Date());

  // Track last notified prayer to avoid repeated alerts in the same minute
  const lastNotifiedPrayerRef = useRef<string | null>(null);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save settings on update
  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    storageService.saveSettings(newSettings);
  };

  // Reset defaults
  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    storageService.saveSettings(DEFAULT_SETTINGS);
    const defaultM = masjidService.getMasjidById(DEFAULT_SETTINGS.selectedMasjidId);
    if (defaultM) setSelectedMasjid(defaultM);
  };

  // Handle Masjid Selection
  const handleSelectMasjid = (masjid: Masjid) => {
    setSelectedMasjid(masjid);
    const updated: UserSettings = {
      ...settings,
      selectedMasjidId: masjid.id,
      calculationMethod: masjid.calculationMethod || settings.calculationMethod,
      juristicMethod: masjid.juristicMethod || settings.juristicMethod,
    };
    setSettings(updated);
    storageService.saveSettings(updated);
  };

  // Save updated masjid from Admin Timing Manager
  const handleSaveUpdatedMasjid = (updatedMasjid: Masjid) => {
    masjidService.updateMasjid(updatedMasjid);
    setSelectedMasjid({ ...updatedMasjid });
    if (detailsMasjid?.id === updatedMasjid.id) {
      setDetailsMasjid({ ...updatedMasjid });
    }
  };

  // Toggle Favourite Masjid
  const handleToggleFavourite = (id: string) => {
    const exists = settings.favouriteMasjidIds.includes(id);
    const nextFavs = exists
      ? settings.favouriteMasjidIds.filter((mId) => mId !== id)
      : [...settings.favouriteMasjidIds, id];

    const updated = { ...settings, favouriteMasjidIds: nextFavs };
    setSettings(updated);
    storageService.saveSettings(updated);
  };

  // Compute Raw & Formatted Daily Timings for Today
  const rawCalculatedTimes = useMemo(() => {
    return calculatePrayerTimes(
      now,
      selectedMasjid.coordinates,
      settings.calculationMethod,
      settings.juristicMethod,
      selectedMasjid.customOffsets
    );
  }, [now.getDate(), now.getMonth(), now.getFullYear(), selectedMasjid, settings.calculationMethod, settings.juristicMethod]);

  // 9 Daily Prayers
  const prayerItems: PrayerTimingItem[] = useMemo(() => {
    return buildPrayerTimingItems(
      rawCalculatedTimes,
      now,
      settings.timeFormat24,
      selectedMasjid.iqamahTimes
    );
  }, [rawCalculatedTimes, now, settings.timeFormat24, selectedMasjid.iqamahTimes]);

  // 4 Solar Celestial Points (Sunrise, Sunset, Solar Noon, Solar Midnight)
  const solarPoints = useMemo(() => {
    return buildSolarCelestialPoints(rawCalculatedTimes, settings.timeFormat24);
  }, [rawCalculatedTimes, settings.timeFormat24]);

  // Compute Next Prayer and Live Countdown
  const nextPrayerInfo: NextPrayerInfo = useMemo(() => {
    const currentTimeMs = now.getTime();

    // Find the next upcoming prayer today
    let nextIndex = prayerItems.findIndex((p) => p.rawDate && p.rawDate.getTime() > currentTimeMs);
    let nextItem: PrayerTimingItem;
    let prevItem: PrayerTimingItem | undefined;

    if (nextIndex !== -1) {
      nextItem = prayerItems[nextIndex];
      prevItem = nextIndex > 0 ? prayerItems[nextIndex - 1] : undefined;
    } else {
      // If all prayers today completed, next prayer is Fajr tomorrow
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowTimes = calculatePrayerTimes(
        tomorrow,
        selectedMasjid.coordinates,
        settings.calculationMethod,
        settings.juristicMethod,
        selectedMasjid.customOffsets
      );
      const tomorrowPrayerItems = buildPrayerTimingItems(
        tomorrowTimes,
        tomorrow,
        settings.timeFormat24,
        selectedMasjid.iqamahTimes
      );
      nextItem = tomorrowPrayerItems[0];
      prevItem = prayerItems[prayerItems.length - 1];
    }

    const currentItem = prayerItems.find((p) => p.status === 'now');

    const nextTimeMs = nextItem.rawDate ? nextItem.rawDate.getTime() : currentTimeMs + 3600000;
    const prevTimeMs = prevItem?.rawDate ? prevItem.rawDate.getTime() : nextTimeMs - 3600 * 6 * 1000;
    const remainingMs = Math.max(0, nextTimeMs - currentTimeMs);
    const totalSpanMs = Math.max(1, nextTimeMs - prevTimeMs);

    const remainingSeconds = Math.floor(remainingMs / 1000);
    const totalDurationSeconds = Math.floor(totalSpanMs / 1000);
    const elapsedSeconds = totalDurationSeconds - remainingSeconds;
    const progressPercent = Math.min(100, Math.max(0, (elapsedSeconds / totalDurationSeconds) * 100));

    const hoursLeft = Math.floor(remainingSeconds / 3600);
    const minutesLeft = Math.floor((remainingSeconds % 3600) / 60);
    const secondsLeft = remainingSeconds % 60;

    return {
      nextPrayer: nextItem,
      currentPrayer: currentItem,
      remainingSeconds,
      totalDurationSeconds,
      progressPercent,
      hoursLeft,
      minutesLeft,
      secondsLeft,
    };
  }, [prayerItems, now, selectedMasjid, settings]);

  // Audio Notification trigger check when remaining seconds == 0
  useEffect(() => {
    if (!settings.soundNotification) return;

    prayerItems.forEach((p) => {
      if (!p.rawDate) return;
      const diffSecs = Math.abs(Math.floor((p.rawDate.getTime() - now.getTime()) / 1000));
      if (diffSecs <= 1 && lastNotifiedPrayerRef.current !== p.id) {
        lastNotifiedPrayerRef.current = p.id;
        audioService.playNotification(settings.selectedAdhanAudio);
        audioService.sendNotification(
          `Time for ${p.name} (${selectedMasjid.name})`,
          `It is now time for ${p.name} prayer.`
        );
      }
    });
  }, [now, prayerItems, settings, selectedMasjid]);

  const isCurrentMasjidFav = settings.favouriteMasjidIds.includes(selectedMasjid.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#02150e] text-slate-100 selection:bg-emerald-500 selection:text-white">
      {/* App Header with Language Selector & Mosque details */}
      <Header
        selectedMasjid={selectedMasjid}
        onOpenMasjidSearch={() => setIsSearchOpen(true)}
        onOpenMasjidDetails={() => {
          setDetailsMasjid(selectedMasjid);
          setIsDetailsOpen(true);
        }}
        isFavourite={isCurrentMasjidFav}
        onToggleFavourite={() => handleToggleFavourite(selectedMasjid.id)}
        hijriOffsetDays={settings.hijriOffsetDays}
      />

      {/* Main Content Area based on Active Tab */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 pt-2 pb-24">
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Next Prayer Countdown Hero */}
            <NextPrayerHero
              nextInfo={nextPrayerInfo}
              soundEnabled={settings.soundNotification}
              onToggleSound={() => handleUpdateSettings({ ...settings, soundNotification: !settings.soundNotification })}
              onPlayAdhanTest={() => audioService.playNotification(settings.selectedAdhanAudio)}
            />

            {/* Complete 9 Daily Prayers List + Solar Celestial Points */}
            <PrayerList
              prayers={prayerItems}
              nextInfo={nextPrayerInfo}
              solarPoints={solarPoints}
              selectedMasjid={selectedMasjid}
              onOpenAdminTimings={() => setIsAdminTimingsOpen(true)}
              onOpenMasjidDetails={() => {
                setDetailsMasjid(selectedMasjid);
                setIsDetailsOpen(true);
              }}
            />
          </div>
        )}

        {activeTab === 'masjids' && (
          <div className="animate-in fade-in duration-300">
            <div className="mb-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="w-full py-3 px-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 hover:text-white flex items-center justify-center gap-2 font-semibold shadow-md transition-colors"
              >
                <span>🔍 Open Mosque Search & Location Finder</span>
              </button>
            </div>

            {/* Timetable of selected masjid */}
            <TimetableTab
              selectedMasjid={selectedMasjid}
              settings={settings}
            />
          </div>
        )}

        {activeTab === 'timings' && (
          <div className="animate-in fade-in duration-300">
            <TimetableTab
              selectedMasjid={selectedMasjid}
              settings={settings}
            />
          </div>
        )}

        {activeTab === 'qibla' && (
          <div className="animate-in fade-in duration-300">
            <QiblaCompass
              selectedMasjid={selectedMasjid}
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-in fade-in duration-300">
            <SettingsTab
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onResetDefaults={handleResetDefaults}
            />
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          if (tab === 'masjids') {
            setIsSearchOpen(true);
          }
          setActiveTab(tab);
        }}
      />

      {/* Masjid Search & Finder Modal */}
      <MasjidSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        selectedMasjidId={selectedMasjid.id}
        onSelectMasjid={(m) => {
          handleSelectMasjid(m);
          setActiveTab('home');
        }}
        favouriteIds={settings.favouriteMasjidIds}
        onToggleFavourite={handleToggleFavourite}
        onOpenDetails={(m) => {
          setDetailsMasjid(m);
          setIsDetailsOpen(true);
        }}
      />

      {/* Masjid Details Modal */}
      <MasjidDetailsModal
        masjid={detailsMasjid}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        isActive={detailsMasjid?.id === selectedMasjid.id}
        onSelectAsActive={(m) => {
          handleSelectMasjid(m);
          setActiveTab('home');
        }}
      />

      {/* Admin Mosque Timings & Details Update Modal */}
      <AdminTimingsModal
        isOpen={isAdminTimingsOpen}
        onClose={() => setIsAdminTimingsOpen(false)}
        masjid={selectedMasjid}
        onSaveMasjid={handleSaveUpdatedMasjid}
      />
    </div>
  );
};
