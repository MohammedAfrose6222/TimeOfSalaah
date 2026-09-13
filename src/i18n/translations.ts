import { SupportedLanguage } from '../types';

export interface TranslationSchema {
  appName: string;
  tagline: string;
  
  // Navigation
  navHome: string;
  navMasjids: string;
  navTimings: string;
  navQibla: string;
  navSettings: string;

  // Header & Dashboard
  selectedMasjid: string;
  changeMasjid: string;
  searchMasjidPlaceholder: string;
  findNearby: string;
  gpsLocating: string;
  favourites: string;
  allMasjids: string;
  noMasjidsFound: string;
  todayDate: string;
  hijriDate: string;
  liveClock: string;

  // Worldwide Search
  worldwideSearch: string;
  searchingWorldwide: string;
  osmWorldwideBadge: string;
  quickCitySuggestions: string;
  searchTips: string;
  searchError: string;
  retrySearch: string;
  resultsCount: string;

  // Next Prayer Hero
  nextPrayer: string;
  currentPrayer: string;
  timeRemaining: string;
  startsIn: string;
  hoursShort: string;
  minsShort: string;
  secsShort: string;
  iqamahIn: string;
  iqamahTime: string;
  untilNextPrayer: string;

  // Prayer Names & Descriptions
  prayers: {
    fajr: { name: string; arabic: string; sub: string; desc: string };
    sunrise: { name: string; arabic: string; sub: string; desc: string };
    ishraq: { name: string; arabic: string; sub: string; desc: string };
    chasht: { name: string; arabic: string; sub: string; desc: string };
    zawal: { name: string; arabic: string; sub: string; desc: string };
    zuhr: { name: string; arabic: string; sub: string; desc: string };
    asr: { name: string; arabic: string; sub: string; desc: string };
    maghrib: { name: string; arabic: string; sub: string; desc: string };
    isha: { name: string; arabic: string; sub: string; desc: string };
    tahajjud: { name: string; arabic: string; sub: string; desc: string };
  };

  // Statuses
  statusUpcoming: string;
  statusNow: string;
  statusCompleted: string;
  makruhPeriod: string;
  fardhPrayer: string;
  sunnahNafl: string;

  // Masjid Details
  masjidDetailsTitle: string;
  masjidFacilities: string;
  jumuahTimings: string;
  firstKhutbah: string;
  firstSalah: string;
  secondKhutbah: string;
  secondSalah: string;
  capacityLabel: string;
  phoneLabel: string;
  addressLabel: string;
  setAsActiveMasjid: string;
  activeBadge: string;
  viewOnMap: string;
  verifiedMasjid: string;
  distanceKm: string;
  announcementLabel: string;

  // Timetable
  monthlyTimetableTitle: string;
  dateCol: string;
  dayCol: string;
  printTimetable: string;
  qiblaTitle: string;
  qiblaHeading: string;
  qiblaInstruction: string;
  degreesFromNorth: string;
  towardsKaaba: string;

  // Settings
  settingsTitle: string;
  languageSection: string;
  selectLanguage: string;
  calculationSection: string;
  calcMethodLabel: string;
  juristicLabel: string;
  juristicStandard: string;
  juristicHanafi: string;
  timeFormatLabel: string;
  format12h: string;
  format24h: string;
  hijriAdjustmentLabel: string;
  hijriAdjustmentHelp: string;
  notificationsSection: string;
  enableSound: string;
  adhanAudioChoice: string;
  testSound: string;
  soundPlaying: string;
  enableVibration: string;
  backendSection: string;
  backendDesc: string;
  apiUrlPlaceholder: string;
  savePreferences: string;
  savedSuccess: string;
  resetDefaults: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, TranslationSchema> = {
  en: {
    appName: 'Time of Salah',
    tagline: 'Accurate Masjid-Specific Prayer Timings',
    navHome: 'Home',
    navMasjids: 'Masjids',
    navTimings: 'Timetable',
    navQibla: 'Qibla',
    navSettings: 'Settings',

    selectedMasjid: 'Selected Masjid',
    changeMasjid: 'Change Masjid',
    searchMasjidPlaceholder: 'Search mosques worldwide by name, city, area, country...',
    findNearby: 'Find Nearby Masjids',
    gpsLocating: 'Detecting your location...',
    favourites: 'Favourites',
    allMasjids: 'All / Worldwide',
    noMasjidsFound: 'No mosques found matching your search. Try searching by city name (e.g. Dubai, London, Makkah) or general terms.',
    todayDate: 'Today',
    hijriDate: 'Hijri Date',
    liveClock: 'Current Time',

    worldwideSearch: 'Worldwide Search',
    searchingWorldwide: 'Searching worldwide mosques on OpenStreetMap...',
    osmWorldwideBadge: 'Worldwide Map',
    quickCitySuggestions: 'Popular Locations',
    searchTips: 'Search anywhere: Mosque name, City, Neighborhood, Country, or Postal Code',
    searchError: 'Unable to connect to worldwide map data. Showing local results.',
    retrySearch: 'Retry Worldwide Search',
    resultsCount: 'mosques found',

    nextPrayer: 'Next Prayer',
    currentPrayer: 'Current Prayer Window',
    timeRemaining: 'Time Remaining',
    startsIn: 'Starts in',
    hoursShort: 'h',
    minsShort: 'm',
    secsShort: 's',
    iqamahIn: 'Iqamah in',
    iqamahTime: 'Iqamah',
    untilNextPrayer: 'until next prayer',

    prayers: {
      fajr: { name: 'Fajr', arabic: 'الفجر', sub: 'Dawn Prayer', desc: 'Starts at the true dawn' },
      sunrise: { name: 'Sunrise', arabic: 'الشروق', sub: 'சூரிய உதயம்', desc: 'End of Fajr & prohibited prayer window' },
      ishraq: { name: 'Ishraq', arabic: 'الإشراق', sub: 'Post-Sunrise', desc: '15-20 minutes after sunrise' },
      chasht: { name: 'Chasht / Duha', arabic: 'الضحى', sub: 'Forenoon Prayer', desc: 'Mid-morning sunnah prayer' },
      zawal: { name: 'Zawal', arabic: 'الزوال', sub: 'சூரிய உச்சம்', desc: 'Solar Zenith / Makruh before Zuhr' },
      zuhr: { name: 'Zuhr', arabic: 'الظهر', sub: 'Noon Prayer', desc: 'Starts right after solar noon' },
      asr: { name: 'Asr', arabic: 'العصر', sub: 'Afternoon Prayer', desc: 'Mid-afternoon prayer' },
      maghrib: { name: 'Maghrib', arabic: 'المغرب', sub: 'சூரிய மறைவு', desc: 'Starts immediately at sunset' },
      isha: { name: 'Isha', arabic: 'العشاء', sub: 'Night Prayer', desc: 'Starts after twilight fades' },
      tahajjud: { name: 'Tahajjud', arabic: 'التهجد', sub: 'Night Vigil Prayer', desc: 'Last third of the night' },
    },

    statusUpcoming: 'Upcoming',
    statusNow: 'Now',
    statusCompleted: 'Completed',
    makruhPeriod: 'Prohibited Time (Makruh)',
    fardhPrayer: 'Obligatory (Fardh)',
    sunnahNafl: 'Sunnah / Nafl',

    masjidDetailsTitle: 'Masjid Information',
    masjidFacilities: 'Facilities Available',
    jumuahTimings: 'Friday Jumu\'ah Timings',
    firstKhutbah: '1st Khutbah',
    firstSalah: '1st Salah',
    secondKhutbah: '2nd Khutbah',
    secondSalah: '2nd Salah',
    capacityLabel: 'Capacity',
    phoneLabel: 'Phone',
    addressLabel: 'Address',
    setAsActiveMasjid: 'Select this Masjid',
    activeBadge: 'Active Masjid',
    viewOnMap: 'View on Google Maps',
    verifiedMasjid: 'Verified Timings',
    distanceKm: 'km away',
    announcementLabel: 'Masjid Announcement',

    monthlyTimetableTitle: 'Monthly Prayer Timetable',
    dateCol: 'Date',
    dayCol: 'Day',
    printTimetable: 'Print / Save PDF',
    qiblaTitle: 'Qibla Direction Compass',
    qiblaHeading: 'Find the direction of the Holy Kaaba in Makkah',
    qiblaInstruction: 'Keep your phone flat on a level surface for maximum accuracy.',
    degreesFromNorth: 'from True North',
    towardsKaaba: 'Towards Makkah Al-Mukarramah',

    settingsTitle: 'App Settings',
    languageSection: 'Language / மொழி / اللغة / زبان',
    selectLanguage: 'Choose Language',
    calculationSection: 'Prayer Calculation Methodology',
    calcMethodLabel: 'Calculation Method',
    juristicLabel: 'Asr Juristic Method',
    juristicStandard: 'Standard (Shafi\'i, Maliki, Hanbali)',
    juristicHanafi: 'Hanafi (Later Asr shadow ratio 2:1)',
    timeFormatLabel: 'Time Display Format',
    format12h: '12-Hour (05:30 PM)',
    format24h: '24-Hour (17:30)',
    hijriAdjustmentLabel: 'Hijri Date Manual Adjustment',
    hijriAdjustmentHelp: 'Adjust +/- days according to local moon sighting',
    notificationsSection: 'Sound & Notifications',
    enableSound: 'Adhan & Prayer Reminder Audio',
    adhanAudioChoice: 'Adhan Ringtone / Melody',
    testSound: 'Play Test Adhan',
    soundPlaying: 'Playing sound...',
    enableVibration: 'Vibrate on Prayer Time',
    backendSection: 'Backend API & Database Connection',
    backendDesc: 'Connect to external Masjid database API or custom REST server',
    apiUrlPlaceholder: 'https://api.timeofsalah.org/v1/masjids',
    savePreferences: 'Save Preferences',
    savedSuccess: 'Settings saved successfully!',
    resetDefaults: 'Reset to Defaults',
  },

  ta: {
    appName: 'டைம் ஆஃப் ஸலாஹ்',
    tagline: 'துல்லியமான பள்ளிவாசல் தொழுகை நேரங்கள்',
    navHome: 'முகப்பு',
    navMasjids: 'பள்ளிவாசல்கள்',
    navTimings: 'நேர அட்டவணை',
    navQibla: 'கிப்லா',
    navSettings: 'அமைப்புகள்',

    selectedMasjid: 'தேர்ந்தெடுக்கப்பட்ட பள்ளிவாசல்',
    changeMasjid: 'பள்ளிவாசலை மாற்றுக',
    searchMasjidPlaceholder: 'உலகளாவிய பள்ளிவாசல்களை பெயர், ஊர், நாடு மூலம் தேடுக...',
    findNearby: 'அருகிலுள்ள பள்ளிவாசல்கள்',
    gpsLocating: 'தங்கள் இருப்பிடம் கண்டறியப்படுகிறது...',
    favourites: 'விருப்பமானவை',
    allMasjids: 'அனைத்து / உலகம்',
    noMasjidsFound: 'பள்ளிவாசல்கள் எதுவும் கிடைக்கவில்லை. ஊரின் பெயரை தட்டச்சு செய்து தேடவும் (எ.கா: Dubai, Makkah, Chennai, London).',
    todayDate: 'இன்று',
    hijriDate: 'ஹிஜ்ரி நாள்',
    liveClock: 'தற்போதைய நேரம்',

    worldwideSearch: 'உலகளாவிய தேடல்',
    searchingWorldwide: 'OpenStreetMap மூலம் உலகெங்கிலும் உள்ள பள்ளிவாசல்கள் தேடப்படுகிறது...',
    osmWorldwideBadge: 'உலகளாவிய வரைபடம்',
    quickCitySuggestions: 'பிரபலமான இடங்கள்',
    searchTips: 'எந்த இடத்தையும் தேடுங்கள்: பள்ளிவாசல் பெயர், நகரம், பகுதி, நாடு, அஞ்சல் குறியீடு',
    searchError: 'வரைபட சேவையை இணைக்க இயலவில்லை. உள்ளூர் விபரங்கள் காட்டப்படுகின்றன.',
    retrySearch: 'மீண்டும் தேடுக',
    resultsCount: 'பள்ளிவாசல்கள் கிடைத்துள்ளன',

    nextPrayer: 'அடுத்த தொழுகை',
    currentPrayer: 'தற்போதைய தொழுகை நேரம்',
    timeRemaining: 'மீதமுள்ள நேரம்',
    startsIn: 'ஆரம்பிக்க இன்னும்',
    hoursShort: 'மணி',
    minsShort: 'நிமி',
    secsShort: 'விநாடி',
    iqamahIn: 'இகாமத் நேரம் இன்னும்',
    iqamahTime: 'இகாமத்',
    untilNextPrayer: 'அடுத்த தொழுகைக்கு',

    prayers: {
      fajr: { name: 'ஃபஜ்ர்', arabic: 'الفجر', sub: 'விடியற்காலை தொழுகை', desc: 'சுப்ஹு சாதிக் ஆரம்பம்' },
      sunrise: { name: 'சூரிய உதயம்', arabic: 'الشروق', sub: 'சூரிய உதயம்', desc: 'ஃபஜ்ர் முடிகிறது & தொழ தடைபட்ட நேரம்' },
      ishraq: { name: 'இஷ்ராக்', arabic: 'الإشراق', sub: 'இஷ்ராக் நஃபில்', desc: 'சூரிய உதயத்திற்கு பின் 15-20 நிமிடம்' },
      chasht: { name: 'சாஷ்த் / லுஹா', arabic: 'الضحى', sub: 'சாஷ்த் தொழுகை', desc: 'முற்பகல் சுன்னத் தொழுகை' },
      zawal: { name: 'ஜவால்', arabic: 'الزوال', sub: 'சூரிய உச்சம்', desc: 'சூரிய உச்சம் (மக்ரூஹ் / தொழ தடை நேரம்)' },
      zuhr: { name: 'ழுஹர்', arabic: 'الظهر', sub: 'நண்பகல் தொழுகை', desc: 'சூரியன் சாய்ந்தவுடன் ஆரம்பம்' },
      asr: { name: 'அஸர்', arabic: 'العصر', sub: 'பிற்பகல் தொழுகை', desc: 'நிழல் அளவு இரட்டிப்பாகும் வரை' },
      maghrib: { name: 'மஃக்ரிப்', arabic: 'المغرب', sub: 'சூரிய மறைவு', desc: 'சூரிய அஸ்தமனத்தின் உடனடி ஆரம்பம்' },
      isha: { name: 'இஷா', arabic: 'العشاء', sub: 'இரவுத் தொழுகை', desc: 'செவ்வானம் மறைந்த பின்' },
      tahajjud: { name: 'தஹஜ்ஜுத்', arabic: 'التهجد', sub: 'இரவு நஃபில் தொழுகை', desc: 'இரவின் கடைசி மூன்றில் ஒரு பகுதி' },
    },

    statusUpcoming: 'அடுத்து வருகிறது',
    statusNow: 'இப்போது',
    statusCompleted: 'முடிந்தது',
    makruhPeriod: 'தொழுக தடைபட்ட நேரம் (மக்ரூஹ்)',
    fardhPrayer: 'ஃபர்ளு தொழுகை',
    sunnahNafl: 'சுன்னத் / நஃபில்',

    masjidDetailsTitle: 'பள்ளிவாசல் விபரங்கள்',
    masjidFacilities: 'வசதிகள்',
    jumuahTimings: 'ஜுமுஆ தொழுகை நேரங்கள்',
    firstKhutbah: '1-வது குத்பா',
    firstSalah: '1-வது தொழுகை',
    secondKhutbah: '2-வது குத்பா',
    secondSalah: '2-வது தொழுகை',
    capacityLabel: 'கொள்ளளவு',
    phoneLabel: 'தொலைபேசி',
    addressLabel: 'முகவரி',
    setAsActiveMasjid: 'இந்த பள்ளிவாசலை தேர்வு செய்க',
    activeBadge: 'தேர்வு செய்யப்பட்டது',
    viewOnMap: 'கூகுள் மேப்பில் பார்க்க',
    verifiedMasjid: 'சரிபார்க்கப்பட்ட நேரங்கள்',
    distanceKm: 'கி.மீ தூரம்',
    announcementLabel: 'பள்ளிவாசல் அறிவிப்பு',

    monthlyTimetableTitle: 'மாதாந்திர தொழுகை அட்டவணை',
    dateCol: 'தேதி',
    dayCol: 'கிழமை',
    printTimetable: 'அச்சிடுக / PDF சேமிக்க',
    qiblaTitle: 'கிப்லா திசை காட்டி',
    qiblaHeading: 'புனித மக்கா கஃபாவின் சரியான திசை',
    qiblaInstruction: 'சரியான திசைக்கு உங்கள் கைபேசியை சமதளத்தில் வைக்கவும்.',
    degreesFromNorth: 'வடக்கு திசையிலிருந்து',
    towardsKaaba: 'புனித மக்கா கஃபா நோக்கி',

    settingsTitle: 'அமைப்புகள்',
    languageSection: 'மொழி தேர்வு (Language)',
    selectLanguage: 'மொழியை மாற்றுக',
    calculationSection: 'தொழுகை கணக்கீட்டு முறை',
    calcMethodLabel: 'கணக்கீட்டு அமைப்பு',
    juristicLabel: 'அஸர் மத்ஹப் முறை',
    juristicStandard: 'ஷாஃபிஈ, மாலிகீ, ஹன்பலீ (வழக்கமான நிழல்)',
    juristicHanafi: 'ஹனஃபீ (இரட்டை நிழல் முறை 2:1)',
    timeFormatLabel: 'நேர வடிவம்',
    format12h: '12 மணி நேரம் (05:30 PM)',
    format24h: '24 மணி நேரம் (17:30)',
    hijriAdjustmentLabel: 'ஹிஜ்ரி பிறை சரிசெய்தல் (+/- நாட்கள்)',
    hijriAdjustmentHelp: 'உள்ளூர் பிறை பார்த்தலுக்கு ஏற்ப மாற்றுக',
    notificationsSection: 'அதான் ஒலி & அறிவிப்புகள்',
    enableSound: 'தொழுகை நேர அதான் ஒலி',
    adhanAudioChoice: 'அதான் / ஒலி வடிவம்',
    testSound: 'ஒலியை சோதிக்கவும்',
    soundPlaying: 'ஒலி இசைக்கிறது...',
    enableVibration: 'அதிர்வு இயக்கம்',
    backendSection: 'பின்னணி API மற்றும் சர்வர் இணைப்பு',
    backendDesc: 'பள்ளிவாசல் சர்வர் தரவுத்தள இணைப்பு',
    apiUrlPlaceholder: 'https://api.timeofsalah.org/v1/masjids',
    savePreferences: 'அமைப்புகளைச் சேமிக்கவும்',
    savedSuccess: 'அமைப்புகள் வெற்றிகரமாக சேமிக்கப்பட்டன!',
    resetDefaults: 'முந்தைய நிலைக்கு மாற்றுக',
  },

  ar: {
    appName: 'وقت الصلاة',
    tagline: 'مواقيت الصلاة الدقيقة حسب المسجد',
    navHome: 'الرئيسية',
    navMasjids: 'المساجد',
    navTimings: 'المواقيت',
    navQibla: 'القبلة',
    navSettings: 'الإعدادات',

    selectedMasjid: 'المسجد المختار',
    changeMasjid: 'تغيير المسجد',
    searchMasjidPlaceholder: 'ابحث عن مساجد العالم بالاسم، المدينة، الحي، الدولة...',
    findNearby: 'المساجد القريبة مني',
    gpsLocating: 'جاري تحديد موقعك الجغرافي...',
    favourites: 'المفضلة',
    allMasjids: 'الكل / حول العالم',
    noMasjidsFound: 'لم يتم العثور على مساجد مطابقة. جرب البحث باسم المدينة (مثل دبي، مكة، لندن) أو اسم المسجد.',
    todayDate: 'اليوم',
    hijriDate: 'التاريخ الهجري',
    liveClock: 'الوقت الحالي',

    worldwideSearch: 'بحث عالمي',
    searchingWorldwide: 'جاري البحث عن المساجد حول العالم عبر خريطة OpenStreetMap...',
    osmWorldwideBadge: 'خريطة عالمية',
    quickCitySuggestions: 'مدن شهيرة',
    searchTips: 'ابحث في أي مكان: اسم المسجد، المدينة، الحي، البلد، أو الرمز البريدي',
    searchError: 'تعذر الاتصال ببيانات الخريطة العالمية. يتم عرض المساجد المتاحة محلياً.',
    retrySearch: 'إعادة محاولة البحث',
    resultsCount: 'مسجد تم العثور عليه',

    nextPrayer: 'الصلاة القادمة',
    currentPrayer: 'وقت الصلاة الحالي',
    timeRemaining: 'الوقت المتبقي',
    startsIn: 'يبدأ بعد',
    hoursShort: 'س',
    minsShort: 'د',
    secsShort: 'ث',
    iqamahIn: 'الإقامة بعد',
    iqamahTime: 'الإقامة',
    untilNextPrayer: 'حتى الصلاة التالية',

    prayers: {
      fajr: { name: 'الفجر', arabic: 'الفجر', sub: 'صلاة الفجر', desc: 'من طلوع الفجر الصادق' },
      sunrise: { name: 'الشروق', arabic: 'الشروق', sub: 'சூரிய உதயம்', desc: 'نهاية وقت الفجر ووقت كراهة الصلاة' },
      ishraq: { name: 'الإشراق', arabic: 'الإشراق', sub: 'صلاة الإشراق', desc: 'بعد الشروق بـ 15 إلى 20 دقيقة' },
      chasht: { name: 'الضحى', arabic: 'الضحى', sub: 'صلاة الضحى', desc: 'صلاة الأوابين في منتصف الضحى' },
      zawal: { name: 'الزوال', arabic: 'الزوال', sub: 'சூரிய உச்சம்', desc: 'وقت استواء الشمس (وقت نهي)' },
      zuhr: { name: 'الظهر', arabic: 'الظهر', sub: 'صلاة الظهر', desc: 'يبدأ بزوال الشمس عن كبد السماء' },
      asr: { name: 'العصر', arabic: 'العصر', sub: 'صلاة العصر', desc: 'إذا صار ظل كل شيء مثله أو مثليه' },
      maghrib: { name: 'المغرب', arabic: 'المغرب', sub: 'சூரிய மறைவு', desc: 'يبدأ فور غروب قرص الشمس' },
      isha: { name: 'العشاء', arabic: 'العشاء', sub: 'صلاة العشاء', desc: 'يبدأ بمغيب الشفق الأحمر' },
      tahajjud: { name: 'التهجد', arabic: 'التهجد', sub: 'قيام الليل', desc: 'في الثلث الأخير من الليل' },
    },

    statusUpcoming: 'قادمة',
    statusNow: 'الآن',
    statusCompleted: 'انتهت',
    makruhPeriod: 'وقت نهي وكراهة (مكروه)',
    fardhPrayer: 'صلاة مفروضة',
    sunnahNafl: 'سنة / نفل',

    masjidDetailsTitle: 'تفاصيل المسجد',
    masjidFacilities: 'الخدمات والمرافق',
    jumuahTimings: 'مواقيت صلاة الجمعة',
    firstKhutbah: 'الخطبة الأولى',
    firstSalah: 'الصلاة الأولى',
    secondKhutbah: 'الخطبة الثانية',
    secondSalah: 'الصلاة الثانية',
    capacityLabel: 'السعة الاستيعابية',
    phoneLabel: 'رقم الهاتف',
    addressLabel: 'العنوان',
    setAsActiveMasjid: 'اختيار هذا المسجد كمسجد رئيسي',
    activeBadge: 'المسجد المختار',
    viewOnMap: 'عرض على خرائط جوجل',
    verifiedMasjid: 'مواقيت معتمدة',
    distanceKm: 'كم يبعد',
    announcementLabel: 'إعلان المسجد',

    monthlyTimetableTitle: 'جدول مواقيت الصلاة الشهري',
    dateCol: 'التاريخ',
    dayCol: 'اليوم',
    printTimetable: 'طباعة / حفظ PDF',
    qiblaTitle: 'بوصلة اتجاه القبلة',
    qiblaHeading: 'تحديد اتجاه الكعبة المشرفة بمكة المكرمة',
    qiblaInstruction: 'يرجى وضع هاتفك على سطح مستوٍ لضمان دقة المؤشر.',
    degreesFromNorth: 'درجة من الشمال الحقيقي',
    towardsKaaba: 'باتجاه الكعبة المشرفة',

    settingsTitle: 'إعدادات التطبيق',
    languageSection: 'اختيار اللغة / Language',
    selectLanguage: 'تغيير اللغة',
    calculationSection: 'طريقة حساب المواقيت الفلكية',
    calcMethodLabel: 'هيئة الحساب',
    juristicLabel: 'المذهب الفقهي لصلاة العصر',
    juristicStandard: 'الجمهور (الشافعي، المالكي، الحنبلي)',
    juristicHanafi: 'الحنفي (ظل الشيء مثليه)',
    timeFormatLabel: 'تنسيق الوقت',
    format12h: 'نظام 12 ساعة (05:30 م)',
    format24h: 'نظام 24 ساعة (17:30)',
    hijriAdjustmentLabel: 'تعديل التاريخ الهجري (+/- يوم)',
    hijriAdjustmentHelp: 'للتوافق مع رؤية الهلال المحلية',
    notificationsSection: 'الأذان والتنبيهات',
    enableSound: 'تشغيل تنبيه الأذان',
    adhanAudioChoice: 'نغمة الأذان / الصوت',
    testSound: 'تجربة صوت الأذان',
    soundPlaying: 'جاري تشغيل الصوت...',
    enableVibration: 'الاهتزاز عند دخول الوقت',
    backendSection: 'الاتصال بقاعدة بيانات المساجد',
    backendDesc: 'ربط التطبيق بخادم خارجي أو واجهة برمجية API',
    apiUrlPlaceholder: 'https://api.timeofsalah.org/v1/masjids',
    savePreferences: 'حفظ الإعدادات',
    savedSuccess: 'تم حفظ الإعدادات بنجاح!',
    resetDefaults: 'استعادة الإعدادات الافتراضية',
  },

  ur: {
    appName: 'وقتِ صلاۃ',
    tagline: 'مساجد کے مطابق نماز کے درست اور مصدقہ اوقات',
    navHome: 'ہوم',
    navMasjids: 'مساجد',
    navTimings: 'اوقات نامہ',
    navQibla: 'قبلہ',
    navSettings: 'سیٹنگز',

    selectedMasjid: 'منتخب کردہ مسجد',
    changeMasjid: 'مسجد تبدیل کریں',
    searchMasjidPlaceholder: 'دنیا بھر کی مساجد نام، شہر، ملک یا محلے سے تلاش کریں...',
    findNearby: 'قریبی مساجد تلاش کریں',
    gpsLocating: 'آپ کا مقام تلاش کیا جا رہا ہے...',
    favourites: 'پسندیدہ مساجد',
    allMasjids: 'سب / دنیا بھر میں',
    noMasjidsFound: 'کوئی مسجد نہیں ملی۔ کسی شہر کا نام لکھ کر تلاش کریں (مثلاً دبئی، مکہ، لندن، کراچی)۔',
    todayDate: 'آج',
    hijriDate: 'ہجری تاریخ',
    liveClock: 'موجودہ وقت',

    worldwideSearch: 'عالمی تلاش',
    searchingWorldwide: 'اوپن اسٹریٹ میپ سے دنیا بھر کی مساجد تلاش کی جا رہی ہیں...',
    osmWorldwideBadge: 'عالمی نقشہ',
    quickCitySuggestions: 'مشہور شہر',
    searchTips: 'کہیں بھی تلاش کریں: مسجد کا نام، شہر، علاقہ، ملک یا پوسٹل کوڈ',
    searchError: 'عالمی نقشے کے ڈیٹا سے رابطہ نہیں ہوسکا۔ مقامی مساجد دکھائی جا رہی ہیں۔',
    retrySearch: 'دوبارہ تلاش کریں',
    resultsCount: 'مساجد ملیں',

    nextPrayer: 'اگلی نماز',
    currentPrayer: 'موجودہ نماز کا وقت',
    timeRemaining: 'باقی وقت',
    startsIn: 'شروع ہونے میں باقی',
    hoursShort: 'گھنٹہ',
    minsShort: 'منٹ',
    secsShort: 'سیکنڈ',
    iqamahIn: 'جماعت میں باقی',
    iqamahTime: 'اقامت',
    untilNextPrayer: 'اگلی نماز تک',

    prayers: {
      fajr: { name: 'فجر', arabic: 'الفجر', sub: 'صبح صادق', desc: 'طلوعِ صبح صادق سے شروع' },
      sunrise: { name: 'طلوعِ آفتاب', arabic: 'الشروق', sub: 'சூரிய உதயம்', desc: 'فجر کا وقت ختم، نماز مکروہ' },
      ishraq: { name: 'اشراق', arabic: 'الإشراق', sub: 'نمازِ اشراق', desc: 'طلوع آفتاب کے 15 سے 20 منٹ بعد' },
      chasht: { name: 'چاشت / ضحیٰ', arabic: 'الضحى', sub: 'نمازِ چاشت', desc: 'دن چڑھے کی سنت نماز' },
      zawal: { name: 'زوال', arabic: 'الزوال', sub: 'சூரிய உச்சم', desc: 'نصف النہار (مکروہ وقت)' },
      zuhr: { name: 'ظہر', arabic: 'الظهر', sub: 'دوپہر کی نماز', desc: 'زوالِ آفتاب کے فوراً بعد' },
      asr: { name: 'عصر', arabic: 'العصر', sub: 'سہ پہر کی نماز', desc: 'سایہ دوگنا ہونے پر' },
      maghrib: { name: 'مغرب', arabic: 'المغرب', sub: 'சூரிய மறைவு', desc: 'غروبِ آفتاب کے فوراً بعد' },
      isha: { name: 'عشاء', arabic: 'العشاء', sub: 'رات کی نماز', desc: 'شفقِ احمر کے غائب ہونے کے بعد' },
      tahajjud: { name: 'تہجد', arabic: 'التهجد', sub: 'قیام اللیل', desc: 'رات کا آخری تہائی حصہ' },
    },

    statusUpcoming: 'آنے والی ہے',
    statusNow: 'ابھی کا وقت',
    statusCompleted: 'مکمل ہوچکی',
    makruhPeriod: 'مکروہ و ممنوع وقت',
    fardhPrayer: 'فرض نماز',
    sunnahNafl: 'سنت / نفل',

    masjidDetailsTitle: 'مسجد کی تفصیلات',
    masjidFacilities: 'دستیاب سہولیات',
    jumuahTimings: 'جمعۃ المبارک کے اوقات',
    firstKhutbah: 'پہلا خطبہ',
    firstSalah: 'پہلی نماز',
    secondKhutbah: 'دوسرا خطبہ',
    secondSalah: 'دوسری نماز',
    capacityLabel: 'گنجائش',
    phoneLabel: 'فون نمبر',
    addressLabel: 'پتہ',
    setAsActiveMasjid: 'اس مسجد کو منتخب کریں',
    activeBadge: 'منتخب مسجد',
    viewOnMap: 'گوگل میپس پر دیکھیں',
    verifiedMasjid: 'مصدقہ اوقات',
    distanceKm: 'کلومیٹر دور',
    announcementLabel: 'مسجد کا اعلان',

    monthlyTimetableTitle: 'ماہانہ نماز کا نقشہ اوقات',
    dateCol: 'تاریخ',
    dayCol: 'دن',
    printTimetable: 'پرنٹ / پی ڈی ایف محفوظ کریں',
    qiblaTitle: 'قبلہ نما (قطب نما)',
    qiblaHeading: 'مکہ مکرمہ خانہ کعبہ کی درست سمت',
    qiblaInstruction: 'درست سمت معلوم کرنے کے لیے اپنے فون کو ہموار سطح پر رکھیں۔',
    degreesFromNorth: 'درجے شمال سے',
    towardsKaaba: 'خانہ کعبہ کی سمت',

    settingsTitle: 'ایپ سیٹنگز',
    languageSection: 'زبان منتخب کریں (Language)',
    selectLanguage: 'زبان تبدیل کریں',
    calculationSection: 'حساب کے قواعد و طریقہ کار',
    calcMethodLabel: 'حسابی ادارہ',
    juristicLabel: 'نمازِ عصر کا فقہی طریقہ',
    juristicStandard: 'شافعی، مالکی، حنبلی (مثلِ اول)',
    juristicHanafi: 'حنفی (سایہ دوگنا، مثلِ ثانی)',
    timeFormatLabel: 'وقت کا فارمیٹ',
    format12h: '12 گھنٹے کا فارمیٹ (05:30 شام)',
    format24h: '24 گھنٹے کا فارمیٹ (17:30)',
    hijriAdjustmentLabel: 'ہجری تاریخ میں رد و بدل (+/- دن)',
    hijriAdjustmentHelp: 'رویتِ ہلال کے مطابق دن تبدیل کریں',
    notificationsSection: 'آواز اور اعلانات',
    enableSound: 'اذان کی آواز اور یاد دہانی',
    adhanAudioChoice: 'اذان کی دھن',
    testSound: 'اذان کی آواز سنیں',
    soundPlaying: 'آواز چل رہی ہے...',
    enableVibration: 'وائبریشن آن کریں',
    backendSection: 'سرور اور ڈیٹا بیس کنکشن',
    backendDesc: 'مسجد کے کسٹم ڈیٹا بیس یا API کے ساتھ منسلک کریں',
    apiUrlPlaceholder: 'https://api.timeofsalah.org/v1/masjids',
    savePreferences: 'سیٹنگز محفوظ کریں',
    savedSuccess: 'سیٹنگز کامیابی سے محفوظ ہوگئیں!',
    resetDefaults: 'پہلے جیسی حالت پر لائیں',
  },
};
