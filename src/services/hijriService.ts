import { HijriDateInfo, SupportedLanguage } from '../types';

export const HIJRI_MONTHS = [
  { en: 'Muharram', ar: 'مُحَرَّم', ta: 'முஹர்ரம்', ur: 'محرم' },
  { en: 'Safar', ar: 'صَفَر', ta: 'ஸஃபர்', ur: 'صفر' },
  { en: 'Rabi al-Awwal', ar: 'رَبِيع الأوّل', ta: 'ரபீஉல் அவ்வல்', ur: 'ربیع الاول' },
  { en: 'Rabi al-Thani', ar: 'رَبِيع الثَّانِي', ta: 'ரபீஉஸ் ஸானீ', ur: 'ربیع الثانی' },
  { en: 'Jumada al-Awwal', ar: 'جُمَادَى الأُولَى', ta: 'ஜுமாதல் ஊலா', ur: 'جمادی الاول' },
  { en: 'Jumada al-Thani', ar: 'جُمَادَى الآخِرَة', ta: 'ஜுமாதஸ் ஸானிய்யா', ur: 'جمادی الثانی' },
  { en: 'Rajab', ar: 'رَجَب', ta: 'ரஜப்', ur: 'رجب' },
  { en: 'Sha\'ban', ar: 'شَعْبَان', ta: 'ஷஃபான்', ur: 'شعبان' },
  { en: 'Ramadan', ar: 'رَمَضَان', ta: 'ரமலான்', ur: 'رمضان' },
  { en: 'Shawwal', ar: 'شَوَّال', ta: 'ஷவ்வால்', ur: 'شوال' },
  { en: 'Dhu al-Qi\'dah', ar: 'ذُو القَعْدَة', ta: 'துல் கஃதா', ur: 'ذی القعدہ' },
  { en: 'Dhu al-Hijjah', ar: 'ذُو الحِجَّة', ta: 'துல் ஹிஜ்ஜா', ur: 'ذی الحجہ' },
];

export const SPECIAL_ISLAMIC_DAYS: Record<string, { en: string; ar: string; ta: string; ur: string }> = {
  '1-1': { en: 'Islamic New Year (14xx)', ar: 'رأس السنة الهجرية', ta: 'இஸ்லாமிய புத்தாண்டு', ur: 'نیا اسلامی سال' },
  '1-10': { en: 'Day of Ashura', ar: 'يوم عاشوراء', ta: 'ஆஷூரா நாள்', ur: 'یومِ عاشورہ' },
  '3-12': { en: 'Mawlid an-Nabi ﷺ', ar: 'المولد النبوي الشريف ﷺ', ta: 'மீலாதுன் நபி ﷺ', ur: 'عید میلاد النبی ﷺ' },
  '7-27': { en: 'Isra and Mi\'raj', ar: 'الإسراء والمعراج', ta: 'மிஃராஜ் இரவு', ur: 'شبِ معراج' },
  '8-15': { en: 'Laylat al-Bara\'at (Shab-e-Barat)', ar: 'ليلة البراءة', ta: 'பராஅத் இரவு', ur: 'شبِ برأت' },
  '9-1': { en: 'First Day of Ramadan Mubarak', ar: 'أول أيام رمضان المبارك', ta: 'புனித ரமலான் ஆரம்பம்', ur: 'پہلا روزہ مبارک' },
  '9-27': { en: 'Laylat al-Qadr (Night of Power)', ar: 'ليلة القدر المباركة', ta: 'லைலத்துல் கத்ர்', ur: 'شبِ قدر' },
  '10-1': { en: 'Eid al-Fitr Mubarak 🎉', ar: 'عيد الفطر المبارك 🎉', ta: 'ஈகைத் திருநாள் (ஈதுல் ஃபித்ர்) 🎉', ur: 'عید الفطر مبارک 🎉' },
  '12-9': { en: 'Day of Arafah', ar: 'يوم عرفة', ta: 'அரஃபா நாள்', ur: 'یومِ عرفہ' },
  '12-10': { en: 'Eid al-Adha Mubarak 🐑', ar: 'عيد الأضحى المبارك 🐑', ta: 'பக்ரீத் பெருநாள் (ஈதுல் அழ்ஹா) 🐑', ur: 'عید الاضحیٰ مبارک 🐑' },
};

/**
 * Converts a Gregorian Date + offsetDays into accurate Hijri Date
 */
export function getHijriDate(gregorianDate: Date, offsetDays: number = 0, lang: SupportedLanguage = 'en'): HijriDateInfo {
  // Apply moon sighting offset
  const date = new Date(gregorianDate);
  if (offsetDays !== 0) {
    date.setDate(date.getDate() + offsetDays);
  }

  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  let m = month + 1;
  let y = year;
  if (m < 3) {
    y -= 1;
    m += 12;
  }

  let a = Math.floor(y / 100);
  let b = 2 - a + Math.floor(a / 4);
  if (y < 1583) b = 0;
  if (y === 1582) {
    if (m > 10) b = -10;
    if (m === 10) {
      b = 0;
      if (day > 4) b = -10;
    }
  }

  let jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;
  b = 0;
  if (jd > 2299160) {
    a = Math.floor((jd - 1867216.25) / 36524.25);
    b = 1 + a - Math.floor(a / 4);
  }
  let bb = jd + b + 1524;
  let cc = Math.floor((bb - 122.1) / 365.25);
  let dd = Math.floor(365.25 * cc);
  let ee = Math.floor((bb - dd) / 30.6001);
  day = bb - dd - Math.floor(30.6001 * ee);
  month = ee - 1;
  if (ee > 13) {
    cc += 1;
    month = ee - 13;
  }
  year = cc - 4716;

  let iyear = 10631.0 / 30.0;
  let epochastro = 1948084;
  let shift1 = 8.01 / 60.0;

  let z = jd - epochastro;
  let cyc = Math.floor(z / 10631.0);
  z = z - 10631 * cyc;
  let j = Math.floor((z - shift1) / iyear);
  let iy = 30 * cyc + j;
  z = z - Math.floor(j * iyear + shift1);
  let im = Math.floor((z + 28.5001) / 29.5);
  if (im === 13) im = 12;
  let id = z - Math.floor(29.5001 * im - 29);

  const hijriDay = Math.max(1, Math.min(30, Math.floor(id)));
  const hijriMonth = Math.max(1, Math.min(12, Math.floor(im)));
  const hijriYear = Math.floor(iy) + 1;

  const monthObj = HIJRI_MONTHS[hijriMonth - 1] || HIJRI_MONTHS[0];

  // Check special Islamic day
  const key = `${hijriMonth}-${hijriDay}`;
  const specialDay = SPECIAL_ISLAMIC_DAYS[key];
  const specialEvent = specialDay ? specialDay[lang] || specialDay.en : undefined;

  let formattedString = '';
  switch (lang) {
    case 'ar':
      formattedString = `${hijriDay} ${monthObj.ar} ${hijriYear} هـ`;
      break;
    case 'ta':
      formattedString = `${hijriDay} ${monthObj.ta} ${hijriYear} ஹிஜ்ரி`;
      break;
    case 'ur':
      formattedString = `${hijriDay} ${monthObj.ur} ${hijriYear} ھ`;
      break;
    default:
      formattedString = `${hijriDay} ${monthObj.en} ${hijriYear} AH`;
      break;
  }

  return {
    day: hijriDay,
    month: hijriMonth,
    monthNameEn: monthObj.en,
    monthNameAr: monthObj.ar,
    monthNameTa: monthObj.ta,
    monthNameUr: monthObj.ur,
    year: hijriYear,
    formattedString,
    specialEvent,
  };
}
