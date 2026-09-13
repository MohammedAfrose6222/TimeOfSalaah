import { UserSettings } from '../types';

const STORAGE_KEY = 'time_of_salah_settings_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  language: 'en',
  calculationMethod: 'KARACHI',
  juristicMethod: 'HANAFI',
  timeFormat24: false,
  hijriOffsetDays: 0,
  soundNotification: true,
  selectedAdhanAudio: 'chime',
  vibrationNotification: true,
  highLatitudeRule: 'None',
  selectedMasjidId: 'masjid-e-mohammadia-harichandrapuram',
  favouriteMasjidIds: ['masjid-e-mohammadia-harichandrapuram', 'masjid-wallajah-chennai', 'masjid-al-haram-makkah'],
  enableGps: false,
};

export const storageService = {
  loadSettings(): UserSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to load settings from storage:', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: UserSettings): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings to storage:', e);
    }
  },
};
