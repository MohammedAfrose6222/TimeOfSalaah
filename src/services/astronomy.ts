import { CalculationMethod, Coordinates, JuristicMethod, PrayerId, PrayerTimingItem, PrayerStatus } from '../types';

export interface MethodParams {
  fajrAngle: number;
  ishaAngle?: number;
  ishaIntervalMinutes?: number; // E.g., 90 mins after Maghrib for Makkah
  maghribAngle?: number;
}

export const CALCULATION_METHOD_PARAMS: Record<CalculationMethod, MethodParams> = {
  MWL: { fajrAngle: 18.0, ishaAngle: 17.0 },
  ISNA: { fajrAngle: 15.0, ishaAngle: 15.0 },
  EGYPT: { fajrAngle: 19.5, ishaAngle: 17.5 },
  MAKKAH: { fajrAngle: 18.5, ishaIntervalMinutes: 90 },
  KARACHI: { fajrAngle: 18.0, ishaAngle: 18.0 },
  TEHRAN: { fajrAngle: 17.7, maghribAngle: 4.5, ishaAngle: 14.0 },
  GULF: { fajrAngle: 19.5, ishaIntervalMinutes: 90 },
};

// Math helpers for trigonometric degrees
const d2r = (d: number) => (d * Math.PI) / 180.0;
const r2d = (r: number) => (r * 180.0) / Math.PI;
const sinD = (d: number) => Math.sin(d2r(d));
const cosD = (d: number) => Math.cos(d2r(d));
const tanD = (d: number) => Math.tan(d2r(d));
const asinD = (x: number) => r2d(Math.asin(x));
const acosD = (x: number) => r2d(Math.acos(x));
const atan2D = (y: number, x: number) => r2d(Math.atan2(y, x));

// Julian Date calculation
function getJulianDate(year: number, month: number, day: number): number {
  if (month <= 2) {
    year -= 1;
    month += 12;
  }
  const A = Math.floor(year / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

// Compute Solar Coordinates (Declination, Equation of Time)
function getSunCoordinates(julianDate: number) {
  const d = julianDate - 2451545.0;
  const g = (357.529 + 0.98560028 * d) % 360;
  const q = (280.459 + 0.98564736 * d) % 360;
  const L = (q + 1.915 * sinD(g) + 0.02 * sinD(2 * g)) % 360;
  const e = 23.439 - 0.00000036 * d; // Obliquity of the Ecliptic

  const RA = atan2D(cosD(e) * sinD(L), cosD(L)) / 15.0; // Right Ascension in hours
  const normalizedRA = ((RA % 24) + 24) % 24;

  const declination = asinD(sinD(e) * sinD(L));
  const equationOfTime = q / 15.0 - normalizedRA;

  return { declination, equationOfTime };
}

// Hour Angle for a given solar altitude angle
function getHourAngle(angle: number, lat: number, declination: number): number | null {
  const cosH = (-sinD(angle) - sinD(lat) * sinD(declination)) / (cosD(lat) * cosD(declination));
  if (cosH > 1 || cosH < -1) {
    return null; // Sun doesn't reach this angle (high latitude extreme)
  }
  return acosD(cosH) / 15.0; // In hours
}

// Hour Angle for Asr based on shadow length factor
function getAsrHourAngle(shadowFactor: number, lat: number, declination: number): number {
  const noonSunAltitude = 90 - Math.abs(lat - declination);
  const shadowAtNoon = 1 / tanD(noonSunAltitude);
  const asrShadow = shadowFactor + shadowAtNoon;
  const asrAngle = 90 - r2d(Math.atan(asrShadow));
  const cosH = (sinD(asrAngle) - sinD(lat) * sinD(declination)) / (cosD(lat) * cosD(declination));
  const clampedCosH = Math.max(-1, Math.min(1, cosH));
  return acosD(clampedCosH) / 15.0;
}

export interface RawCalculatedTimes {
  fajr: Date;
  sunrise: Date;
  ishraq: Date;
  chasht: Date;
  zawal: Date;
  zuhr: Date;
  asr: Date;
  sunset: Date;
  maghrib: Date;
  isha: Date;
  tahajjud: Date;
  solarNoon: Date;
  solarMidnight: Date;
}

export interface SolarPointItem {
  id: 'sunrise' | 'sunset' | 'solarNoon' | 'solarMidnight';
  name: string;
  arabicName: string;
  tamilName: string;
  urduName: string;
  time: string;
  time24: string;
  rawDate: Date;
  description: string;
  iconName: string;
}

/**
 * Calculates raw Date instances for all prayers and solar markers
 */
export function calculatePrayerTimes(
  date: Date,
  coordinates: Coordinates,
  method: CalculationMethod = 'KARACHI',
  juristic: JuristicMethod = 'HANAFI',
  customOffsets?: {
    fajr?: number;
    zuhr?: number;
    asr?: number;
    maghrib?: number;
    isha?: number;
  }
): RawCalculatedTimes {
  const lat = coordinates.latitude;
  const lng = coordinates.longitude;
  const timezoneOffsetHours = -date.getTimezoneOffset() / 60; // Local timezone offset from UTC in hours

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const jd = getJulianDate(year, month, day);
  const { declination, equationOfTime } = getSunCoordinates(jd);

  // Solar Noon (in hours local time)
  const solarNoonUtc = 12 - equationOfTime - lng / 15.0;
  const solarNoonLocal = solarNoonUtc + timezoneOffsetHours;

  const params = CALCULATION_METHOD_PARAMS[method] || CALCULATION_METHOD_PARAMS.KARACHI;

  // 1. Sunrise / Sunset (standard refraction 0.833°)
  const sunAngle = 0.833;
  const sunriseSunsetHa = getHourAngle(sunAngle, lat, declination) || 6;
  const sunriseLocal = solarNoonLocal - sunriseSunsetHa;
  const sunsetLocal = solarNoonLocal + sunriseSunsetHa;

  // 2. Fajr (dawn angle)
  const fajrHa = getHourAngle(params.fajrAngle, lat, declination) || 7.5;
  const fajrLocal = solarNoonLocal - fajrHa;

  // 3. Ishraq (approx 15-20 min post sunrise or sun at 4.5 degrees)
  const ishraqHa = getHourAngle(-4.5, lat, declination);
  const ishraqLocal = ishraqHa !== null ? solarNoonLocal - ishraqHa : sunriseLocal + (18 / 60);

  // 4. Chasht / Duha (Midway between Sunrise and Solar Noon)
  const chashtLocal = (sunriseLocal + solarNoonLocal) / 2;

  // 5. Zawal (Solar noon - 10 to 12 minutes makruh window before Zuhr)
  const zawalLocal = solarNoonLocal - (12 / 60);

  // 6. Zuhr / Dhuhr (Solar Noon + 2 mins buffer after zenith)
  const zuhrLocal = solarNoonLocal + (2 / 60);

  // 7. Asr (shadow factor: 1 for Standard/Shafi, 2 for Hanafi)
  const shadowFactor = juristic === 'HANAFI' ? 2 : 1;
  const asrHa = getAsrHourAngle(shadowFactor, lat, declination);
  const asrLocal = solarNoonLocal + asrHa;

  // 8. Maghrib
  let maghribLocal = sunsetLocal;
  if (params.maghribAngle) {
    const maghribHa = getHourAngle(params.maghribAngle, lat, declination);
    if (maghribHa !== null) {
      maghribLocal = solarNoonLocal + maghribHa;
    }
  }

  // 9. Isha
  let ishaLocal: number;
  if (params.ishaIntervalMinutes) {
    ishaLocal = maghribLocal + params.ishaIntervalMinutes / 60;
  } else {
    const ishaAngle = params.ishaAngle || 18.0;
    const ishaHa = getHourAngle(ishaAngle, lat, declination) || 7.5;
    ishaLocal = solarNoonLocal + ishaHa;
  }

  // Helper to convert decimal hours to Date
  const toDate = (decimalHours: number, baseDate: Date = date): Date => {
    if (isNaN(decimalHours) || !isFinite(decimalHours)) {
      return new Date(NaN);
    }
    const normalized = ((decimalHours % 24) + 24) % 24;
    const hours = Math.floor(normalized);
    const minutesDecimal = (normalized - hours) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = Math.floor((minutesDecimal - minutes) * 60);

    const d = new Date(baseDate);
    d.setHours(hours, minutes, seconds, 0);
    return d;
  };

  // Build raw dates
  let fajrDate = toDate(fajrLocal);
  let sunriseDate = toDate(sunriseLocal);
  let ishraqDate = toDate(ishraqLocal);
  let chashtDate = toDate(chashtLocal);
  let zawalDate = toDate(zawalLocal);
  let zuhrDate = toDate(zuhrLocal);
  let asrDate = toDate(asrLocal);
  let sunsetDate = toDate(sunsetLocal);
  let maghribDate = toDate(maghribLocal);
  let ishaDate = toDate(ishaLocal);
  let solarNoonDate = toDate(solarNoonLocal);

  // Apply Masjid-specific custom offsets if configured
  if (customOffsets) {
    if (customOffsets.fajr) fajrDate = new Date(fajrDate.getTime() + customOffsets.fajr * 60000);
    if (customOffsets.zuhr) zuhrDate = new Date(zuhrDate.getTime() + customOffsets.zuhr * 60000);
    if (customOffsets.asr) asrDate = new Date(asrDate.getTime() + customOffsets.asr * 60000);
    if (customOffsets.maghrib) maghribDate = new Date(maghribDate.getTime() + customOffsets.maghrib * 60000);
    if (customOffsets.isha) ishaDate = new Date(ishaDate.getTime() + customOffsets.isha * 60000);
  }

  // Calculate tomorrow's Sunrise and Fajr for accurate Tahajjud and Solar Midnight
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowJd = getJulianDate(tomorrow.getFullYear(), tomorrow.getMonth() + 1, tomorrow.getDate());
  const tomorrowSun = getSunCoordinates(tomorrowJd);
  const tomorrowNoonUtc = 12 - tomorrowSun.equationOfTime - lng / 15.0;
  const tomorrowNoonLocal = tomorrowNoonUtc + timezoneOffsetHours;
  const tomorrowFajrHa = getHourAngle(params.fajrAngle, lat, tomorrowSun.declination) || 7.5;
  const tomorrowSunriseHa = getHourAngle(sunAngle, lat, tomorrowSun.declination) || 6;
  const tomorrowSunriseLocal = tomorrowNoonLocal - tomorrowSunriseHa;
  const tomorrowFajrLocal = tomorrowNoonLocal - tomorrowFajrHa;
  
  let tomorrowFajrDate = toDate(tomorrowFajrLocal, tomorrow);
  let tomorrowSunriseDate = toDate(tomorrowSunriseLocal, tomorrow);

  if (customOffsets?.fajr) {
    tomorrowFajrDate = new Date(tomorrowFajrDate.getTime() + customOffsets.fajr * 60000);
  }

  // 10. Tahajjud: Last 1/3 of the night between Maghrib and Next Fajr
  const nightDurationMs = tomorrowFajrDate.getTime() - maghribDate.getTime();
  const tahajjudDate = new Date(maghribDate.getTime() + (nightDurationMs * 2) / 3);

  // Solar Midnight: Exact astronomical midpoint between Sunset and Next Sunrise
  const solarMidnightDate = new Date((sunsetDate.getTime() + tomorrowSunriseDate.getTime()) / 2);

  return {
    fajr: fajrDate,
    sunrise: sunriseDate,
    ishraq: ishraqDate,
    chasht: chashtDate,
    zawal: zawalDate,
    zuhr: zuhrDate,
    asr: asrDate,
    sunset: sunsetDate,
    maghrib: maghribDate,
    isha: ishaDate,
    tahajjud: tahajjudDate,
    solarNoon: solarNoonDate,
    solarMidnight: solarMidnightDate,
  };
}

/**
 * Formats a Date to 12-hour or 24-hour string (Gracefully handles invalid dates)
 */
export function formatPrayerTime(d?: Date | null, use24Hour: boolean = false): string {
  if (!d || isNaN(d.getTime())) {
    return 'Timing not available';
  }

  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');

  if (use24Hour) {
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  }

  const period = hours >= 12 ? 'PM' : 'AM';
  const h12 = hours % 12 || 12;
  return `${h12}:${minutes} ${period}`;
}

/**
 * Builds the ordered list of 9 Daily Salah / Sunnah timings
 * (Fajr, Ishraq, Chasht, Zawal, Dhuhr, Asr, Maghrib, Isha, Tahajjud)
 */
export function buildPrayerTimingItems(
  rawTimes: RawCalculatedTimes,
  now: Date,
  use24Hour: boolean = false,
  iqamahTimes?: { fajr?: string; zuhr?: string; asr?: string; maghrib?: string; isha?: string }
): PrayerTimingItem[] {
  const currentTimeMs = now.getTime();

  const prayerDefs: {
    id: PrayerId;
    name: string;
    arabicName: string;
    subName?: string;
    isMain: boolean;
    isMakruh?: boolean;
    icon: string;
    rawDate: Date;
    iqamah?: string;
  }[] = [
    { id: 'fajr', name: 'Fajr', arabicName: 'الفجر', isMain: true, icon: 'Sunrise', rawDate: rawTimes.fajr, iqamah: iqamahTimes?.fajr },
    { id: 'ishraq', name: 'Ishraq', arabicName: 'الإشراق', subName: 'இஷ்ராக் (சூரிய உதயத்திற்கு பின்)', isMain: false, icon: 'Sparkles', rawDate: rawTimes.ishraq },
    { id: 'chasht', name: 'Chasht / Duha', arabicName: 'الضحى', subName: 'ளுஹா / சாஷ்த் தொழுகை', isMain: false, icon: 'Sun', rawDate: rawTimes.chasht },
    { id: 'zawal', name: 'Zawal', arabicName: 'الزوال', subName: 'சூரிய உச்சம் (மக்ரூஹ் நேரம்)', isMain: false, isMakruh: true, icon: 'SunDim', rawDate: rawTimes.zawal },
    { id: 'zuhr', name: 'Dhuhr', arabicName: 'الظهر', subName: 'ளுஹர் தொழுகை', isMain: true, icon: 'SunMedium', rawDate: rawTimes.zuhr, iqamah: iqamahTimes?.zuhr },
    { id: 'asr', name: 'Asr', arabicName: 'العصر', subName: 'அஸர் தொழுகை', isMain: true, icon: 'CloudSun', rawDate: rawTimes.asr, iqamah: iqamahTimes?.asr },
    { id: 'maghrib', name: 'Maghrib', arabicName: 'المغرب', subName: 'மஹ்ரிப் தொழுகை', isMain: true, icon: 'Sunset', rawDate: rawTimes.maghrib, iqamah: iqamahTimes?.maghrib },
    { id: 'isha', name: 'Isha', arabicName: 'العشاء', subName: 'இஷா தொழுகை', isMain: true, icon: 'Moon', rawDate: rawTimes.isha, iqamah: iqamahTimes?.isha },
    { id: 'tahajjud', name: 'Tahajjud', arabicName: 'التهجد', subName: 'தஹஜ்ஜுத் (இரவுத் தொழுகை)', isMain: false, icon: 'MoonStar', rawDate: rawTimes.tahajjud },
  ];

  let nextFound = false;

  return prayerDefs.map((p, index) => {
    const itemMs = p.rawDate ? p.rawDate.getTime() : NaN;
    const nextItemMs = index < prayerDefs.length - 1 && prayerDefs[index + 1].rawDate
      ? prayerDefs[index + 1].rawDate.getTime()
      : itemMs + 3600000;

    let status: PrayerStatus = 'completed';

    if (!isNaN(itemMs)) {
      if (currentTimeMs < itemMs) {
        status = 'upcoming';
        if (!nextFound) {
          nextFound = true;
        }
      } else if (currentTimeMs >= itemMs && currentTimeMs < nextItemMs) {
        status = 'now';
      } else {
        status = 'completed';
      }
    }

    return {
      id: p.id,
      name: p.name,
      arabicName: p.arabicName,
      subName: p.subName,
      time: formatPrayerTime(p.rawDate, use24Hour),
      time24: formatPrayerTime(p.rawDate, true),
      rawDate: p.rawDate,
      iqamahTime: p.iqamah,
      status,
      isMainPrayer: p.isMain,
      isMakruh: p.isMakruh,
      iconName: p.icon,
    };
  });
}

/**
 * Builds the 4 Key Solar Celestial Points (Sunrise, Sunset, Solar Noon, Solar Midnight)
 */
export function buildSolarCelestialPoints(
  rawTimes: RawCalculatedTimes,
  use24Hour: boolean = false
): SolarPointItem[] {
  return [
    {
      id: 'sunrise',
      name: 'Sunrise',
      arabicName: 'الشروق',
      tamilName: 'சூரிய உதயம்',
      urduName: 'طلوع آفتاب',
      time: formatPrayerTime(rawTimes.sunrise, use24Hour),
      time24: formatPrayerTime(rawTimes.sunrise, true),
      rawDate: rawTimes.sunrise,
      description: 'Dawn concludes, Fajr time ends. Makruh prayer period begins.',
      iconName: 'Sunrise',
    },
    {
      id: 'sunset',
      name: 'Sunset',
      arabicName: 'الغروب',
      tamilName: 'சூரிய மறைவு',
      urduName: 'غروب آفتاب',
      time: formatPrayerTime(rawTimes.sunset, use24Hour),
      time24: formatPrayerTime(rawTimes.sunset, true),
      rawDate: rawTimes.sunset,
      description: 'Sun disk sinks below horizon. Maghrib time commences immediately.',
      iconName: 'Sunset',
    },
    {
      id: 'solarNoon',
      name: 'Solar Noon',
      arabicName: 'منتصف النهار الشمسي',
      tamilName: 'சூரிய உச்சம் (ஜவால்)',
      urduName: 'نصف النہار',
      time: formatPrayerTime(rawTimes.solarNoon, use24Hour),
      time24: formatPrayerTime(rawTimes.solarNoon, true),
      rawDate: rawTimes.solarNoon,
      description: 'Sun reaches its highest celestial altitude today. Dhuhr begins right after zenith.',
      iconName: 'Sun',
    },
    {
      id: 'solarMidnight',
      name: 'Solar Midnight',
      arabicName: 'منتصف الليل الشمسي',
      tamilName: 'சூரிய நள்ளிரவு',
      urduName: 'نصف شب',
      time: formatPrayerTime(rawTimes.solarMidnight, use24Hour),
      time24: formatPrayerTime(rawTimes.solarMidnight, true),
      rawDate: rawTimes.solarMidnight,
      description: 'Astronomical halfway point of the night between Sunset and Sunrise.',
      iconName: 'Moon',
    },
  ];
}
