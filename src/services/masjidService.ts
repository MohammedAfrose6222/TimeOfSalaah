import { Coordinates, Masjid } from '../types';
import { searchWorldwideMosques, searchNearbyMosques } from './worldwideMosqueService';

export const INITIAL_MASJIDS: Masjid[] = [
  {
    id: 'masjid-e-mohammadia-harichandrapuram',
    name: 'Masjid E Mohammadia',
    tamilName: 'மஸ்ஜித்-ஏ-முகம்மதியா (ஹரிசந்திராபுரம்)',
    arabicName: 'مسجد المحمدية، هاريشندرابورام',
    urduName: 'مسجد محمدیہ، ہری چندرا پورم',
    address: 'Main Bazaar Road, Harichandrapuram, Thiruvalangadu Post, PIN 631210',
    city: 'Harichandrapuram',
    taluk: 'Thiruvalangadu / Tiruttani',
    district: 'Tiruvallur District (near Ranipet border)',
    state: 'Tamil Nadu',
    country: 'India',
    coordinates: { latitude: 13.1250, longitude: 79.7650 },
    phone: '+91 94440 12345',
    capacity: 1200,
    isVerified: true,
    calculationMethod: 'KARACHI',
    juristicMethod: 'HANAFI',
    jumuahSchedule: {
      firstKhutbah: '01:00 PM',
      firstSalah: '01:30 PM',
    },
    facilities: [
      { id: 'wudu', name: 'Fresh Water Wudu Area', icon: 'Droplets', available: true },
      { id: 'women', name: 'Dedicated Women\'s Prayer Section', icon: 'Users', available: true },
      { id: 'parking', name: 'Two-Wheeler & Car Parking', icon: 'Car', available: true },
      { id: 'wheelchair', name: 'Ground Floor Wheelchair Access', icon: 'Accessibility', available: true },
      { id: 'madrasa', name: 'Noorani Maktab & Madrasa', icon: 'BookOpen', available: true },
      { id: 'generator', name: 'Backup Power Generator', icon: 'Zap', available: true },
    ],
    iqamahTimes: {
      fajr: '05:30 AM',
      zuhr: '01:15 PM',
      asr: '04:45 PM',
      maghrib: '06:35 PM',
      isha: '08:15 PM',
    },
    customOffsets: {
      fajr: 0,
      zuhr: 0,
      asr: 0,
      maghrib: 0,
      isha: 0,
    },
    announcement: {
      title: 'Daily & Weekly Hadith Halqa',
      content: 'Fajr & Maghrib Dars-e-Quran and Tajweed classes for youth and elders.',
      date: '2026-09-09',
    },
  },
  {
    id: 'masjid-wallajah-chennai',
    name: 'Wallajah Mosque (Big Mosque)',
    tamilName: 'வாலாஜா பெரிய பள்ளிவாசல் (சென்னை)',
    arabicName: 'مسجد والاجاه الكبير',
    urduName: 'والاجاہ مسجد (بڑی مسجد)، چنائی',
    address: 'Triplicane High Road, Triplicane',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    coordinates: { latitude: 13.0573, longitude: 80.2764 },
    phone: '+91 44 2848 1234',
    capacity: 5000,
    isVerified: true,
    calculationMethod: 'KARACHI',
    juristicMethod: 'HANAFI',
    jumuahSchedule: {
      firstKhutbah: '01:00 PM',
      firstSalah: '01:30 PM',
      secondKhutbah: '01:45 PM',
      secondSalah: '02:00 PM',
    },
    facilities: [
      { id: 'wudu', name: 'Wudu Area', icon: 'Droplets', available: true },
      { id: 'women', name: 'Women\'s Prayer Section', icon: 'Users', available: true },
      { id: 'parking', name: 'Car & Bike Parking', icon: 'Car', available: true },
      { id: 'wheelchair', name: 'Wheelchair Accessible', icon: 'Accessibility', available: true },
      { id: 'library', name: 'Islamic Library & Madrasa', icon: 'BookOpen', available: true },
    ],
    iqamahTimes: {
      fajr: '05:30 AM',
      zuhr: '01:30 PM',
      asr: '04:45 PM',
      maghrib: '06:40 PM',
      isha: '08:15 PM',
    },
    customOffsets: {
      fajr: 0,
      zuhr: 5,
      asr: 0,
      maghrib: 3,
      isha: 0,
    },
    announcement: {
      title: 'Weekly Tajweed & Hadith Dars',
      content: 'Every Sunday after Asr prayer by Chief Qazi.',
      date: '2026-08-20',
    },
  },
  {
    id: 'masjid-thousand-lights-chennai',
    name: 'Thousand Lights Mosque',
    tamilName: 'ஆயிரம் விளக்கு பள்ளிவாசல் (சென்னை)',
    arabicName: 'مسجد الألف قنديل',
    urduName: 'ہزار چراغ مسجد، چنائی',
    address: 'Anna Salai, Thousand Lights',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    coordinates: { latitude: 13.0612, longitude: 80.2529 },
    phone: '+91 44 2829 4567',
    capacity: 3500,
    isVerified: true,
    calculationMethod: 'KARACHI',
    juristicMethod: 'STANDARD',
    jumuahSchedule: {
      firstKhutbah: '01:15 PM',
      firstSalah: '01:45 PM',
    },
    facilities: [
      { id: 'wudu', name: 'Wudu Area', icon: 'Droplets', available: true },
      { id: 'women', name: 'Women\'s Prayer Section', icon: 'Users', available: true },
      { id: 'parking', name: 'Spacious Parking', icon: 'Car', available: true },
      { id: 'wheelchair', name: 'Wheelchair Access', icon: 'Accessibility', available: true },
    ],
    iqamahTimes: {
      fajr: '05:25 AM',
      zuhr: '01:15 PM',
      asr: '04:40 PM',
      maghrib: '06:38 PM',
      isha: '08:10 PM',
    },
  },
  {
    id: 'masjid-trichy-chowk',
    name: 'Big Chowk Jamia Masjid (Trichy)',
    tamilName: 'திருச்சி பெரிய சவுக் ஜாமிஆ பள்ளிவாசல்',
    arabicName: 'جامع تشوكي الكبير، تيروتشيرابالي',
    urduName: 'جامع مسجد چوک، تروچی',
    address: 'Chowk Maidan, Main Guard Gate',
    city: 'Tiruchirappalli',
    state: 'Tamil Nadu',
    country: 'India',
    coordinates: { latitude: 10.8281, longitude: 78.6946 },
    phone: '+91 431 270 9988',
    capacity: 4000,
    isVerified: true,
    calculationMethod: 'KARACHI',
    juristicMethod: 'STANDARD',
    jumuahSchedule: {
      firstKhutbah: '01:00 PM',
      firstSalah: '01:30 PM',
    },
    facilities: [
      { id: 'wudu', name: 'Wudu Facilities', icon: 'Droplets', available: true },
      { id: 'parking', name: 'Vehicle Parking', icon: 'Car', available: true },
      { id: 'wheelchair', name: 'Wheelchair Ramp', icon: 'Accessibility', available: true },
    ],
    iqamahTimes: {
      fajr: '05:30 AM',
      zuhr: '01:15 PM',
      asr: '04:50 PM',
      maghrib: '06:42 PM',
      isha: '08:20 PM',
    },
  },
  {
    id: 'masjid-kazimar-madurai',
    name: 'Kazimar Big Mosque (Madurai)',
    tamilName: 'காசிமார் பெரிய பள்ளிவாசல் (மதுரை)',
    arabicName: 'مسجد كازيمار الكبير، مدوراي',
    urduName: 'قاضی مار بڑی مسجد، مدورائے',
    address: 'Kazimar Street, Periyar',
    city: 'Madurai',
    state: 'Tamil Nadu',
    country: 'India',
    coordinates: { latitude: 9.9168, longitude: 78.1158 },
    phone: '+91 452 233 4455',
    capacity: 2500,
    isVerified: true,
    calculationMethod: 'KARACHI',
    juristicMethod: 'STANDARD',
    jumuahSchedule: {
      firstKhutbah: '01:10 PM',
      firstSalah: '01:40 PM',
    },
    facilities: [
      { id: 'wudu', name: 'Wudu Area', icon: 'Droplets', available: true },
      { id: 'women', name: 'Women\'s Facility', icon: 'Users', available: false },
      { id: 'parking', name: 'Limited Parking', icon: 'Car', available: true },
    ],
    iqamahTimes: {
      fajr: '05:35 AM',
      zuhr: '01:20 PM',
      asr: '04:55 PM',
      maghrib: '06:45 PM',
      isha: '08:20 PM',
    },
  },
  {
    id: 'masjid-al-haram-makkah',
    name: 'Masjid Al-Haram (The Grand Mosque)',
    tamilName: 'மஸ்ஜிதுல் ஹராம் (புனித மக்கா)',
    arabicName: 'المسجد الحرام، مكة المكرمة',
    urduName: 'مسجد الحرام، مکہ مکرمہ',
    address: 'Al Haram, Makkah 24231',
    city: 'Makkah',
    country: 'Saudi Arabia',
    coordinates: { latitude: 21.4225, longitude: 39.8262 },
    capacity: 2500000,
    isVerified: true,
    calculationMethod: 'MAKKAH',
    juristicMethod: 'STANDARD',
    jumuahSchedule: {
      firstKhutbah: '12:45 PM',
      firstSalah: '01:15 PM',
    },
    facilities: [
      { id: 'wudu', name: 'Extensive Wudu Stations', icon: 'Droplets', available: true },
      { id: 'women', name: 'Large Dedicated Women\'s Areas', icon: 'Users', available: true },
      { id: 'wheelchair', name: 'Electric Wheelchairs & Golf Carts', icon: 'Accessibility', available: true },
      { id: 'zamzam', name: 'Zamzam Water Fountains', icon: 'Sparkles', available: true },
      { id: 'library', name: 'Haram Library & Quran Center', icon: 'BookOpen', available: true },
    ],
    iqamahTimes: {
      fajr: '20 mins after Azan',
      zuhr: '20 mins after Azan',
      asr: '20 mins after Azan',
      maghrib: '10 mins after Azan',
      isha: '20 mins after Azan',
    },
  },
  {
    id: 'masjid-an-nabawi-madinah',
    name: 'Al-Masjid an-Nabawi (The Prophet\'s Mosque)',
    tamilName: 'மஸ்ஜிதுன் நபவீ (புனித மதீனா)',
    arabicName: 'المسجد النبوي الشريف، المدينة المنورة',
    urduName: 'مسجد نبوی ﷺ، مدینہ منورہ',
    address: 'Al Haram, Medina 42311',
    city: 'Madinah',
    country: 'Saudi Arabia',
    coordinates: { latitude: 24.4672, longitude: 39.6108 },
    capacity: 1000000,
    isVerified: true,
    calculationMethod: 'MAKKAH',
    juristicMethod: 'STANDARD',
    jumuahSchedule: {
      firstKhutbah: '12:40 PM',
      firstSalah: '01:10 PM',
    },
    facilities: [
      { id: 'wudu', name: 'Underground Wudu Complexes', icon: 'Droplets', available: true },
      { id: 'women', name: 'Dedicated Women\'s Courtyard & Rawdah', icon: 'Users', available: true },
      { id: 'wheelchair', name: 'Escalators & Wheelchair Paths', icon: 'Accessibility', available: true },
      { id: 'zamzam', name: 'Chilled Zamzam Stations', icon: 'Sparkles', available: true },
    ],
    iqamahTimes: {
      fajr: '20 mins after Azan',
      zuhr: '20 mins after Azan',
      asr: '20 mins after Azan',
      maghrib: '10 mins after Azan',
      isha: '20 mins after Azan',
    },
  },
  {
    id: 'masjid-sheikh-zayed-abudhabi',
    name: 'Sheikh Zayed Grand Mosque',
    tamilName: 'ஷேக் சயீத் பெரிய பள்ளிவாசல் (அபுதாபி)',
    arabicName: 'جامع الشيخ زايد الكبير، أبوظبي',
    urduName: 'شیخ زاید گرینڈ مسجد، ابوظہبی',
    address: 'Al Rawdah, Abu Dhabi',
    city: 'Abu Dhabi',
    country: 'United Arab Emirates',
    coordinates: { latitude: 24.4128, longitude: 54.4749 },
    capacity: 40000,
    isVerified: true,
    calculationMethod: 'GULF',
    juristicMethod: 'STANDARD',
    jumuahSchedule: {
      firstKhutbah: '01:00 PM',
      firstSalah: '01:30 PM',
    },
    facilities: [
      { id: 'wudu', name: 'Grand Wudu Facilities', icon: 'Droplets', available: true },
      { id: 'women', name: 'Women\'s Prayer Halls', icon: 'Users', available: true },
      { id: 'wheelchair', name: 'Full Wheelchair Accessibility', icon: 'Accessibility', available: true },
      { id: 'parking', name: 'Vast Parking Grounds', icon: 'Car', available: true },
    ],
    iqamahTimes: {
      fajr: '20 mins after Azan',
      zuhr: '20 mins after Azan',
      asr: '20 mins after Azan',
      maghrib: '10 mins after Azan',
      isha: '20 mins after Azan',
    },
  },
  {
    id: 'masjid-al-farooq-dubai',
    name: 'Al Farooq Omar Bin Al Khattab Mosque',
    tamilName: 'அல் ஃபாரூக் பள்ளிவாசல் (துபாய்)',
    arabicName: 'مسجد الفاروق عمر بن الخطاب، دبي',
    urduName: 'مسجد الفاروق عمر بن الخطاب، دبئی',
    address: 'Al Safa 1, Jumeirah, Dubai',
    city: 'Dubai',
    country: 'United Arab Emirates',
    coordinates: { latitude: 25.1843, longitude: 55.2443 },
    capacity: 2000,
    isVerified: true,
    calculationMethod: 'GULF',
    juristicMethod: 'STANDARD',
    jumuahSchedule: {
      firstKhutbah: '01:00 PM',
      firstSalah: '01:30 PM',
    },
    facilities: [
      { id: 'wudu', name: 'Wudu Facilities', icon: 'Droplets', available: true },
      { id: 'women', name: 'Women Section', icon: 'Users', available: true },
      { id: 'library', name: 'Islamic Cultural Center', icon: 'BookOpen', available: true },
    ],
    iqamahTimes: {
      fajr: '20 mins after Azan',
      zuhr: '20 mins after Azan',
      asr: '20 mins after Azan',
      maghrib: '10 mins after Azan',
      isha: '20 mins after Azan',
    },
  },
  {
    id: 'masjid-london-central',
    name: 'London Central Mosque (Regent\'s Park)',
    tamilName: 'லண்டன் மத்திய பள்ளிவாசல் (ரீஜென்ட்ஸ் பார்க்)',
    arabicName: 'مسجد لندن المركزي',
    urduName: 'لندن سینٹرل مسجد (ریجنٹس پارک)',
    address: '146 Park Road, London NW8 7RG',
    city: 'London',
    country: 'United Kingdom',
    coordinates: { latitude: 51.5298, longitude: -0.1666 },
    phone: '+44 20 7724 3363',
    capacity: 5000,
    isVerified: true,
    calculationMethod: 'MWL',
    juristicMethod: 'STANDARD',
    jumuahSchedule: {
      firstKhutbah: '01:00 PM',
      firstSalah: '01:30 PM',
      secondKhutbah: '02:00 PM',
      secondSalah: '02:30 PM',
    },
    facilities: [
      { id: 'wudu', name: 'Wudu Facilities', icon: 'Droplets', available: true },
      { id: 'women', name: 'Women\'s Gallery', icon: 'Users', available: true },
      { id: 'parking', name: 'On-site Parking', icon: 'Car', available: true },
      { id: 'library', name: 'Bookshop & Islamic Library', icon: 'BookOpen', available: true },
      { id: 'cafe', name: 'Halal Halqa & Cafe', icon: 'Coffee', available: true },
    ],
    iqamahTimes: {
      fajr: '05:45 AM',
      zuhr: '01:30 PM',
      asr: '05:30 PM',
      maghrib: '08:15 PM',
      isha: '09:45 PM',
    },
  },
  {
    id: 'masjid-icc-newyork',
    name: 'Islamic Cultural Center of New York (96th St)',
    tamilName: 'நியூயார்க் இஸ்லாமிய கலாச்சார மையம்',
    arabicName: 'المركز الثقافي الإسلامي بنيويورك',
    urduName: 'اسلامک کلچرل سینٹر، نیویارک',
    address: '1711 3rd Ave, New York, NY 10029',
    city: 'New York',
    state: 'NY',
    country: 'United States',
    coordinates: { latitude: 40.7856, longitude: -73.9515 },
    phone: '+1 212 722 5234',
    capacity: 2500,
    isVerified: true,
    calculationMethod: 'ISNA',
    juristicMethod: 'STANDARD',
    jumuahSchedule: {
      firstKhutbah: '01:00 PM',
      firstSalah: '01:30 PM',
    },
    facilities: [
      { id: 'wudu', name: 'Modern Wudu Facilities', icon: 'Droplets', available: true },
      { id: 'women', name: 'Dedicated Women Hall', icon: 'Users', available: true },
      { id: 'wheelchair', name: 'Wheelchair Elevator Access', icon: 'Accessibility', available: true },
    ],
    iqamahTimes: {
      fajr: '05:45 AM',
      zuhr: '01:15 PM',
      asr: '05:15 PM',
      maghrib: '07:55 PM',
      isha: '09:30 PM',
    },
  },
  {
    id: 'masjid-sultan-singapore',
    name: 'Sultan Mosque (Masjid Sultan)',
    tamilName: 'சுல்தான் பள்ளிவாசல் (சிங்கப்பூர்)',
    arabicName: 'مسجد سلطان، سنغافورة',
    urduName: 'سلطان مسجد، سنگاپور',
    address: '3 Muscat Street, Kampong Glam',
    city: 'Singapore',
    country: 'Singapore',
    coordinates: { latitude: 1.3023, longitude: 103.8590 },
    phone: '+65 6293 4405',
    capacity: 5000,
    isVerified: true,
    calculationMethod: 'MWL',
    juristicMethod: 'STANDARD',
    jumuahSchedule: {
      firstKhutbah: '01:15 PM',
      firstSalah: '01:45 PM',
    },
    facilities: [
      { id: 'wudu', name: 'Spacious Wudu Area', icon: 'Droplets', available: true },
      { id: 'women', name: 'Women\'s Prayer Area (Level 2)', icon: 'Users', available: true },
      { id: 'wheelchair', name: 'Wheelchair Accessible Lifts', icon: 'Accessibility', available: true },
      { id: 'heritage', name: 'Heritage Exhibition Gallery', icon: 'BookOpen', available: true },
    ],
    iqamahTimes: {
      fajr: '06:05 AM',
      zuhr: '01:15 PM',
      asr: '04:30 PM',
      maghrib: '07:22 PM',
      isha: '08:35 PM',
    },
  },
  {
    id: 'masjid-sultanahmet-istanbul',
    name: 'The Blue Mosque (Sultanahmet Camii)',
    tamilName: 'நீல பள்ளிவாசல் (சுல்தான் அஹ்மத், இஸ்தான்புல்)',
    arabicName: 'جامع السلطان أحمد (المسجد الأزرق)',
    urduName: 'جامع سلطان احمد (نیلی مسجد)، استنبول',
    address: 'Sultan Ahmet, Atmeydanı Cd. No:7, 34122 Fatih/İstanbul',
    city: 'Istanbul',
    country: 'Turkey',
    coordinates: { latitude: 41.0054, longitude: 28.9768 },
    capacity: 10000,
    isVerified: true,
    calculationMethod: 'MWL',
    juristicMethod: 'HANAFI',
    jumuahSchedule: {
      firstKhutbah: '01:00 PM',
      firstSalah: '01:30 PM',
    },
    facilities: [
      { id: 'wudu', name: 'Historical Ablution Fountains', icon: 'Droplets', available: true },
      { id: 'women', name: 'Women Section', icon: 'Users', available: true },
      { id: 'wheelchair', name: 'Wheelchair Accessible Entrances', icon: 'Accessibility', available: true },
    ],
    iqamahTimes: {
      fajr: '05:15 AM',
      zuhr: '01:15 PM',
      asr: '05:00 PM',
      maghrib: '08:05 PM',
      isha: '09:40 PM',
    },
  },
  {
    id: 'masjid-jama-delhi',
    name: 'Jama Masjid (Old Delhi)',
    tamilName: 'ஜுமா மஸ்ஜித் (தில்லி)',
    arabicName: 'مسجد جهان نما (جامع مسجد دلهي)',
    urduName: 'جامع مسجد دہلی',
    address: 'Chandni Chowk, Old Delhi',
    city: 'New Delhi',
    country: 'India',
    coordinates: { latitude: 28.6507, longitude: 77.2334 },
    capacity: 25000,
    isVerified: true,
    calculationMethod: 'KARACHI',
    juristicMethod: 'HANAFI',
    jumuahSchedule: {
      firstKhutbah: '01:15 PM',
      firstSalah: '01:45 PM',
    },
    facilities: [
      { id: 'wudu', name: 'Large Central Pool Wudu', icon: 'Droplets', available: true },
      { id: 'wheelchair', name: 'Ramp Entry from Gate 2', icon: 'Accessibility', available: true },
    ],
    iqamahTimes: {
      fajr: '05:20 AM',
      zuhr: '01:30 PM',
      asr: '05:00 PM',
      maghrib: '06:55 PM',
      isha: '08:25 PM',
    },
  },
  {
    id: 'masjid-makkah-hyderabad',
    name: 'Makkah Masjid (Charminar)',
    tamilName: 'மக்கா மஸ்ஜித் (ஹைதராபாத்)',
    arabicName: 'مسجد مكة، حيدر آباد',
    urduName: 'مکہ مسجد (چارمینار)، حیدرآباد',
    address: 'Near Charminar, Ghansi Bazaar',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    coordinates: { latitude: 17.3606, longitude: 78.4735 },
    capacity: 10000,
    isVerified: true,
    calculationMethod: 'KARACHI',
    juristicMethod: 'HANAFI',
    jumuahSchedule: {
      firstKhutbah: '01:00 PM',
      firstSalah: '01:30 PM',
    },
    facilities: [
      { id: 'wudu', name: 'Large Wudu Courtyard', icon: 'Droplets', available: true },
      { id: 'parking', name: 'Parking Available', icon: 'Car', available: true },
    ],
    iqamahTimes: {
      fajr: '05:15 AM',
      zuhr: '01:15 PM',
      asr: '04:45 PM',
      maghrib: '06:45 PM',
      isha: '08:15 PM',
    },
  },
];

/**
 * Calculates distance between two coordinates in kilometers using Haversine formula
 */
export function calculateDistanceKm(c1: Coordinates, c2: Coordinates): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((c2.latitude - c1.latitude) * Math.PI) / 180;
  const dLon = ((c2.longitude - c1.longitude) * Math.PI) / 180;
  const lat1 = (c1.latitude * Math.PI) / 180;
  const lat2 = (c2.latitude * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export class MasjidService {
  private masjids: Masjid[] = [...INITIAL_MASJIDS];
  private registeredWorldwideMasjids: Map<string, Masjid> = new Map();

  constructor() {
    this.loadPersistedMasjids();
  }

  private loadPersistedMasjids() {
    try {
      if (typeof localStorage !== 'undefined') {
        const saved = localStorage.getItem('time_of_salah_custom_masjids');
        if (saved) {
          const list: Masjid[] = JSON.parse(saved);
          list.forEach((m) => this.registeredWorldwideMasjids.set(m.id, m));
        }
      }
    } catch (e) {
      console.warn('Failed to load persisted masjids:', e);
    }
  }

  public registerMasjid(masjid: Masjid): void {
    this.registeredWorldwideMasjids.set(masjid.id, masjid);
    try {
      if (typeof localStorage !== 'undefined') {
        const list = Array.from(this.registeredWorldwideMasjids.values()).slice(-50); // Keep last 50
        localStorage.setItem('time_of_salah_custom_masjids', JSON.stringify(list));
      }
    } catch (e) {
      console.warn('Failed to persist masjid:', e);
    }
  }

  public updateMasjid(masjid: Masjid): void {
    const idx = this.masjids.findIndex((m) => m.id === masjid.id);
    if (idx !== -1) {
      this.masjids[idx] = { ...this.masjids[idx], ...masjid };
    }
    this.registerMasjid(masjid);
  }

  public getAllMasjids(): Masjid[] {
    return this.masjids;
  }

  public getMasjidById(id: string): Masjid | undefined {
    if (this.registeredWorldwideMasjids.has(id)) {
      return this.registeredWorldwideMasjids.get(id);
    }
    return this.masjids.find((m) => m.id === id) || this.masjids[0];
  }

  /**
   * Fast synchronous local search
   */
  public searchMasjidsLocal(query: string, userCoords?: Coordinates | null): Masjid[] {
    const q = query.trim().toLowerCase();
    const all = [...this.masjids, ...Array.from(this.registeredWorldwideMasjids.values())];

    const uniqueMap = new Map<string, Masjid>();
    for (const m of all) {
      uniqueMap.set(m.id, m);
    }
    let results = Array.from(uniqueMap.values());

    if (q) {
      results = results.filter((m) => {
        return (
          m.name.toLowerCase().includes(q) ||
          m.city.toLowerCase().includes(q) ||
          m.country.toLowerCase().includes(q) ||
          m.address.toLowerCase().includes(q) ||
          (m.tamilName && m.tamilName.toLowerCase().includes(q)) ||
          (m.arabicName && m.arabicName.toLowerCase().includes(q)) ||
          (m.urduName && m.urduName.toLowerCase().includes(q))
        );
      });
    }

    if (userCoords) {
      results = results.map((m) => ({
        ...m,
        distanceKm: calculateDistanceKm(userCoords, m.coordinates),
      }));

      // Sort nearest first
      results.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    }

    return results;
  }

  /**
   * Search nearby mosques around coordinates with auto-expanding radius (Nearest First)
   */
  public async searchNearby(coords: Coordinates, radiusKm: number = 15, signal?: AbortSignal): Promise<Masjid[]> {
    const allLocal = [...this.masjids, ...Array.from(this.registeredWorldwideMasjids.values())];
    const results = await searchNearbyMosques(coords, radiusKm, allLocal, signal);
    
    results.forEach((m) => {
      if (!this.registeredWorldwideMasjids.has(m.id)) {
        this.registeredWorldwideMasjids.set(m.id, m);
      }
    });

    return results;
  }

  /**
   * Complete Worldwide Mosque Search (Local + OpenStreetMap)
   */
  public async searchMasjidsWorldwide(
    query: string,
    userCoords?: Coordinates | null,
    signal?: AbortSignal
  ): Promise<Masjid[]> {
    const allLocal = [...this.masjids, ...Array.from(this.registeredWorldwideMasjids.values())];
    const results = await searchWorldwideMosques(query, allLocal, userCoords, signal);
    
    results.forEach((m) => {
      if (!this.registeredWorldwideMasjids.has(m.id)) {
        this.registeredWorldwideMasjids.set(m.id, m);
      }
    });

    return results;
  }

  /**
   * Future Backend Extensibility: Fetch from external database or API if custom endpoint configured
   */
  public async fetchRemoteMasjids(apiUrl: string, query?: string): Promise<Masjid[]> {
    try {
      const url = new URL(apiUrl);
      if (query) url.searchParams.append('q', query);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        return data as Masjid[];
      }
      return this.masjids;
    } catch (e) {
      console.warn('Could not fetch remote Masjids, using local cache:', e);
      return this.searchMasjidsLocal(query || '');
    }
  }
}

export const masjidService = new MasjidService();
