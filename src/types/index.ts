export type SupportedLanguage = 'en' | 'ta' | 'ar' | 'ur';

export type CalculationMethod =
  | 'MWL'      // Muslim World League
  | 'ISNA'     // Islamic Society of North America
  | 'EGYPT'    // Egyptian General Authority of Survey
  | 'MAKKAH'   // Umm Al-Qura University, Makkah
  | 'KARACHI'  // Univ. of Islamic Sciences, Karachi
  | 'TEHRAN'   // Institute of Geophysics, Tehran (Jafari)
  | 'GULF';    // Gulf Region

export type JuristicMethod = 'STANDARD' | 'HANAFI'; // Asr shadow factor: STANDARD=1, HANAFI=2

export type PrayerId =
  | 'fajr'
  | 'sunrise'
  | 'ishraq'
  | 'chasht'
  | 'zawal'
  | 'zuhr'
  | 'asr'
  | 'maghrib'
  | 'isha'
  | 'tahajjud';

export type PrayerStatus = 'completed' | 'now' | 'upcoming';

export interface PrayerTimingItem {
  id: PrayerId;
  name: string;
  arabicName: string;
  subName?: string;
  time: string;           // Formatted time string e.g. "05:12 AM"
  time24: string;         // "05:12"
  rawDate: Date;          // Accurate Date object for today
  iqamahTime?: string;    // Masjid specific Iqamah time e.g. "05:30 AM"
  status: PrayerStatus;
  isMainPrayer: boolean;  // 5 obligatory prayers (Fajr, Zuhr, Asr, Maghrib, Isha) vs Non-fardh (Sunrise, Ishraq, Chasht, Zawal, Tahajjud)
  isMakruh?: boolean;     // Zawal / Sunrise makruh windows
  iconName: string;
  descriptionKey?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface MasjidFacility {
  id: string;
  name: string;
  icon: string;
  available: boolean;
}

export interface JumuahSchedule {
  firstKhutbah?: string;
  firstSalah?: string;
  secondKhutbah?: string;
  secondSalah?: string;
}

export interface Masjid {
  id: string;
  name: string;
  arabicName?: string;
  tamilName?: string;
  urduName?: string;
  address: string;
  city: string;
  district?: string;
  taluk?: string;
  state?: string;
  country: string;
  coordinates: Coordinates;
  distanceKm?: number; // Calculated dynamically from user GPS
  phone?: string;
  website?: string;
  capacity?: number;
  imageUrl?: string;
  isVerified?: boolean;
  jumuahSchedule?: JumuahSchedule;
  facilities: MasjidFacility[];
  calculationMethod?: CalculationMethod;
  juristicMethod?: JuristicMethod;
  // Masjid-specific custom offsets in minutes (if any) or fixed Iqamah times
  customOffsets?: {
    fajr?: number;
    zuhr?: number;
    asr?: number;
    maghrib?: number;
    isha?: number;
  };
  iqamahTimes?: {
    fajr?: string;
    zuhr?: string;
    asr?: string;
    maghrib?: string;
    isha?: string;
  };
  announcement?: {
    title: string;
    content: string;
    date: string;
  };
}

export interface UserSettings {
  language: SupportedLanguage;
  calculationMethod: CalculationMethod;
  juristicMethod: JuristicMethod;
  timeFormat24: boolean;
  hijriOffsetDays: number; // -2, -1, 0, 1, 2 for moon sighting adjustment
  soundNotification: boolean;
  selectedAdhanAudio: 'makkah' | 'madinah' | 'chime' | 'soft_beep';
  vibrationNotification: boolean;
  highLatitudeRule: 'None' | 'MidNight' | 'OneSeventh' | 'AngleBased';
  selectedMasjidId: string;
  favouriteMasjidIds: string[];
  customApiUrl?: string;
  enableGps: boolean;
  manualLocation?: {
    city: string;
    country: string;
    coordinates: Coordinates;
  };
}

export interface HijriDateInfo {
  day: number;
  month: number;
  monthNameEn: string;
  monthNameAr: string;
  monthNameTa: string;
  monthNameUr: string;
  year: number;
  formattedString: string;
  specialEvent?: string;
}

export interface NextPrayerInfo {
  nextPrayer: PrayerTimingItem;
  currentPrayer?: PrayerTimingItem;
  remainingSeconds: number;
  totalDurationSeconds: number;
  progressPercent: number;
  hoursLeft: number;
  minutesLeft: number;
  secondsLeft: number;
}
