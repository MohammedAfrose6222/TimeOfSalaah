import { Coordinates } from '../types';

export interface LocationItem {
  id: string;
  name: string;
  nativeName?: string;
  code?: string;
  coordinates?: Coordinates;
  type?: 'country' | 'state' | 'district' | 'taluk' | 'village';
}

export interface HierarchyLabels {
  country: string;
  state: string;
  district: string;
  taluk: string;
  village: string;
}

export function getHierarchyLabels(countryCode?: string): HierarchyLabels {
  const code = (countryCode || '').toUpperCase();
  if (code === 'IN') {
    return {
      country: 'Country',
      state: 'State / Union Territory',
      district: 'District',
      taluk: 'Taluk / Tehsil / Sub-District',
      village: 'City / Town / Village / Locality',
    };
  }
  if (code === 'US') {
    return {
      country: 'Country',
      state: 'State',
      district: 'County',
      taluk: 'Township / Sub-Division',
      village: 'City / Town / Locality',
    };
  }
  if (code === 'GB') {
    return {
      country: 'Country',
      state: 'Country / Region (England, Scotland, Wales, NI)',
      district: 'County / Borough',
      taluk: 'District / Area',
      village: 'Town / Village / Locality',
    };
  }
  if (code === 'SA' || code === 'AE' || code === 'QA' || code === 'KW' || code === 'BH' || code === 'OM') {
    return {
      country: 'Country',
      state: 'Province / Region / Emirate',
      district: 'Governorate / Sector',
      taluk: 'Municipality / District',
      village: 'City / Neighborhood / Locality',
    };
  }
  return {
    country: 'Country',
    state: 'State / Province / Region',
    district: 'District / County / Division',
    taluk: 'Taluk / Tehsil / Sub-District',
    village: 'City / Town / Village / Locality',
  };
}

export const POPULAR_COUNTRIES: LocationItem[] = [
  { id: 'IN', code: 'IN', name: 'India', nativeName: 'இந்தியா / भारत' },
  { id: 'SA', code: 'SA', name: 'Saudi Arabia', nativeName: 'المملكة العربية السعودية' },
  { id: 'AE', code: 'AE', name: 'United Arab Emirates', nativeName: 'الإمارات العربية المتحدة' },
  { id: 'GB', code: 'GB', name: 'United Kingdom', nativeName: 'Great Britain' },
  { id: 'US', code: 'US', name: 'United States', nativeName: 'USA' },
  { id: 'CA', code: 'CA', name: 'Canada', nativeName: 'Canada' },
  { id: 'MY', code: 'MY', name: 'Malaysia', nativeName: 'Malaysia' },
  { id: 'ID', code: 'ID', name: 'Indonesia', nativeName: 'Indonesia' },
  { id: 'PK', code: 'PK', name: 'Pakistan', nativeName: 'پاکستان' },
  { id: 'BD', code: 'BD', name: 'Bangladesh', nativeName: 'বাংলাদেশ' },
  { id: 'TR', code: 'TR', name: 'Turkey', nativeName: 'Türkiye' },
  { id: 'EG', code: 'EG', name: 'Egypt', nativeName: 'مصر' },
  { id: 'SG', code: 'SG', name: 'Singapore', nativeName: 'Singapore' },
  { id: 'QA', code: 'QA', name: 'Qatar', nativeName: 'دولة قطر' },
  { id: 'KW', code: 'KW', name: 'Kuwait', nativeName: 'دولة الكويت' },
  { id: 'OM', code: 'OM', name: 'Oman', nativeName: 'سلطنة عمان' },
  { id: 'ZA', code: 'ZA', name: 'South Africa', nativeName: 'South Africa' },
  { id: 'AU', code: 'AU', name: 'Australia', nativeName: 'Australia' },
  { id: 'DE', code: 'DE', name: 'Germany', nativeName: 'Deutschland' },
  { id: 'FR', code: 'FR', name: 'France', nativeName: 'France' },
  { id: 'LK', code: 'LK', name: 'Sri Lanka', nativeName: 'இலங்கை' },
];

// Rich Index for Indian States & Districts
export const INDIAN_STATES: LocationItem[] = [
  { id: 'TN', name: 'Tamil Nadu', nativeName: 'தமிழ்நாடு' },
  { id: 'KL', name: 'Kerala', nativeName: 'കേരളം' },
  { id: 'KA', name: 'Karnataka', nativeName: 'ಕರ್ನಾಟಕ' },
  { id: 'AP', name: 'Andhra Pradesh', nativeName: 'ఆంధ్ర ప్రదేశ్' },
  { id: 'TS', name: 'Telangana', nativeName: 'తెలంగాణ' },
  { id: 'MH', name: 'Maharashtra', nativeName: 'महाराष्ट्र' },
  { id: 'DL', name: 'Delhi NCR', nativeName: 'दिल्ली' },
  { id: 'UP', name: 'Uttar Pradesh', nativeName: 'उत्तर प्रदेश' },
  { id: 'WB', name: 'West Bengal', nativeName: 'পশ্চিমবঙ্গ' },
  { id: 'BR', name: 'Bihar', nativeName: 'बिहार' },
  { id: 'GJ', name: 'Gujarat', nativeName: 'ગુજરાત' },
  { id: 'RJ', name: 'Rajasthan', nativeName: 'राजस्थान' },
  { id: 'MP', name: 'Madhya Pradesh', nativeName: 'मध्य प्रदेश' },
  { id: 'PB', name: 'Punjab', nativeName: 'ਪੰਜਾਬ' },
  { id: 'HR', name: 'Haryana', nativeName: 'हरियाणा' },
  { id: 'JK', name: 'Jammu & Kashmir', nativeName: 'جموں و کشمیر' },
  { id: 'AS', name: 'Assam', nativeName: 'অসম' },
  { id: 'GA', name: 'Goa', nativeName: 'गोवा' },
  { id: 'UT', name: 'Uttarakhand', nativeName: 'उत्तराखंड' },
  { id: 'PY', name: 'Puducherry', nativeName: 'புதுச்சேரி' },
];

export const TAMIL_NADU_DISTRICTS: LocationItem[] = [
  { id: 'ranipet', name: 'Ranipet District', nativeName: 'ராணிப்பேட்டை' },
  { id: 'tiruvallur', name: 'Tiruvallur District', nativeName: 'திருவள்ளூர்' },
  { id: 'chennai', name: 'Chennai District', nativeName: 'சென்னை' },
  { id: 'vellore', name: 'Vellore District', nativeName: 'வேலூர்' },
  { id: 'kancheepuram', name: 'Kancheepuram District', nativeName: 'காஞ்சிபுரம்' },
  { id: 'chengalpattu', name: 'Chengalpattu District', nativeName: 'செங்கல்பட்டு' },
  { id: 'madurai', name: 'Madurai District', nativeName: 'மதுரை' },
  { id: 'tiruchirappalli', name: 'Tiruchirappalli (Trichy)', nativeName: 'திருச்சிராப்பள்ளி' },
  { id: 'tirunelveli', name: 'Tirunelveli District', nativeName: 'திருநெல்வேலி' },
  { id: 'tenkasi', name: 'Tenkasi District', nativeName: 'தென்காசி' },
  { id: 'coimbatore', name: 'Coimbatore District', nativeName: 'கோயம்புத்தூர்' },
  { id: 'salem', name: 'Salem District', nativeName: 'சேலம்' },
  { id: 'tanjore', name: 'Thanjavur District', nativeName: 'தஞ்சாவூர்' },
  { id: 'cuddalore', name: 'Cuddalore District', nativeName: 'கடலூர்' },
  { id: 'villupuram', name: 'Villupuram District', nativeName: 'விழுப்புரம்' },
  { id: 'tiruvannamalai', name: 'Tiruvannamalai District', nativeName: 'திருவண்ணாமலை' },
  { id: 'dindigul', name: 'Dindigul District', nativeName: 'திண்டுக்கல்' },
  { id: 'nagapattinam', name: 'Nagapattinam District', nativeName: 'நாகப்பட்டினம்' },
  { id: 'ramanathapuram', name: 'Ramanathapuram District', nativeName: 'இராமநாதபுரம்' },
  { id: 'kanyakumari', name: 'Kanyakumari District', nativeName: 'கன்னியாகுமரி' },
  { id: 'erode', name: 'Erode District', nativeName: 'ஈரோடு' },
  { id: 'tirupur', name: 'Tiruppur District', nativeName: 'திருப்பூர்' },
  { id: 'krishnagiri', name: 'Krishnagiri District', nativeName: 'கிருஷ்ணகிரி' },
  { id: 'dharmapuri', name: 'Dharmapuri District', nativeName: 'தருமபுரி' },
  { id: 'pudukkottai', name: 'Pudukkottai District', nativeName: 'புதுக்கோட்டை' },
];

export const TALUKS_INDEX: Record<string, LocationItem[]> = {
  ranipet: [
    { id: 'arakkonam', name: 'Arakkonam Taluk', nativeName: 'அரக்கோணம்' },
    { id: 'wallajah', name: 'Wallajah Taluk', nativeName: 'வாலாஜா' },
    { id: 'nemili', name: 'Nemili Taluk', nativeName: 'நெமிலி' },
    { id: 'arcot', name: 'Arcot Taluk', nativeName: 'ஆற்காடு' },
    { id: 'kalavai', name: 'Kalavai Taluk', nativeName: 'கலவை' },
    { id: 'sholinghur', name: 'Sholinghur Taluk', nativeName: 'சோளிங்கர்' },
  ],
  tiruvallur: [
    { id: 'thiruvalangadu', name: 'Thiruvalangadu Block / Sub-District', nativeName: 'திருவாலங்காடு' },
    { id: 'tiruttani', name: 'Tiruttani Taluk', nativeName: 'திருத்தணி' },
    { id: 'tiruvallur_taluk', name: 'Tiruvallur Taluk', nativeName: 'திருவள்ளூர்' },
    { id: 'poonamallee', name: 'Poonamallee Taluk', nativeName: 'பூந்தமல்லி' },
    { id: 'avadi', name: 'Avadi Taluk', nativeName: 'ஆவடி' },
    { id: 'gummidipoondi', name: 'Gummidipoondi Taluk', nativeName: 'கும்மிடிப்பூண்டி' },
    { id: 'ponneri', name: 'Ponneri Taluk', nativeName: 'பொன்னேரி' },
    { id: 'r_k_pet', name: 'R.K. Pet Taluk', nativeName: 'ஆர்.கே. பேட்டை' },
    { id: 'pallipattu', name: 'Pallipattu Taluk', nativeName: 'பள்ளிப்பட்டு' },
  ],
  chennai: [
    { id: 'triplicane', name: 'Triplicane Taluk', nativeName: 'திருவல்லிக்கேணி' },
    { id: 'mylapore', name: 'Mylapore Taluk', nativeName: 'மயிலாப்பூர்' },
    { id: 'egmore', name: 'Egmore Taluk', nativeName: 'எழும்பூர்' },
    { id: 'george_town', name: 'Fort-Tondiarpet / George Town', nativeName: 'ஜார்ஜ் டவுன்' },
    { id: 'guindy', name: 'Guindy Taluk', nativeName: 'கிண்டி' },
    { id: 'perambur', name: 'Perambur Taluk', nativeName: 'பெரம்பூர்' },
    { id: 'aminjikarai', name: 'Aminjikarai Taluk', nativeName: 'அமைந்தகரை' },
    { id: 'mambalam', name: 'Mambalam Taluk', nativeName: 'மாம்பலம்' },
    { id: 'sholinganallur', name: 'Sholinganallur Taluk', nativeName: 'சோழிங்கநல்லூர்' },
    { id: 'velachery', name: 'Velachery Taluk', nativeName: 'வேளச்சேரி' },
  ],
  madurai: [
    { id: 'madurai_north', name: 'Madurai North Taluk', nativeName: 'மதுரை வடக்கு' },
    { id: 'madurai_south', name: 'Madurai South Taluk (Kazimar/Periyar)', nativeName: 'மதுரை தெற்கு' },
    { id: 'melur', name: 'Melur Taluk', nativeName: 'மேலூர்' },
    { id: 'thirumangalam', name: 'Thirumangalam Taluk', nativeName: 'திருமங்கலம்' },
    { id: 'usilampatti', name: 'Usilampatti Taluk', nativeName: 'உசிலம்பட்டி' },
    { id: 'vadipatti', name: 'Vadipatti Taluk', nativeName: 'வாடிப்பட்டி' },
  ],
  tirunelveli: [
    { id: 'tirunelveli_taluk', name: 'Tirunelveli Taluk', nativeName: 'திருநெல்வேலி' },
    { id: 'palayamkottai', name: 'Palayamkottai Taluk', nativeName: 'பாளையங்கோட்டை' },
    { id: 'ambasamudram', name: 'Ambasamudram Taluk', nativeName: 'அம்பாசமுத்திரம்' },
    { id: 'nanguneri', name: 'Nanguneri Taluk', nativeName: 'நாங்குநேரி' },
    { id: 'radhapuram', name: 'Radhapuram Taluk', nativeName: 'ராதாபுரம்' },
  ],
  tenkasi: [
    { id: 'tenkasi_taluk', name: 'Tenkasi Taluk', nativeName: 'தென்காசி' },
    { id: 'kadayanallur', name: 'Kadayanallur Taluk', nativeName: 'கடையநல்லூர்' },
    { id: 'sankarankovil', name: 'Sankarankovil Taluk', nativeName: 'சங்கரன்கோவில்' },
    { id: 'shenkottai', name: 'Shenkottai Taluk', nativeName: 'செங்கோட்டை' },
    { id: 'alangulam', name: 'Alangulam Taluk', nativeName: 'ஆலங்குளம்' },
    { id: 'sivagiri', name: 'Sivagiri Taluk', nativeName: 'சிவகிரி' },
  ],
  vellore: [
    { id: 'vellore_taluk', name: 'Vellore Taluk', nativeName: 'வேலூர்' },
    { id: 'katpadi', name: 'Katpadi Taluk', nativeName: 'காட்பாடி' },
    { id: 'gudiyatham', name: 'Gudiyatham Taluk', nativeName: 'குடியாத்தம்' },
    { id: 'anaicut', name: 'Anaicut Taluk', nativeName: 'அணைக்கட்டு' },
    { id: 'peranambut', name: 'Pernambut Taluk', nativeName: 'பேரணாம்பட்டு' },
  ],
};

export const VILLAGES_INDEX: Record<string, LocationItem[]> = {
  arakkonam: [
    { id: 'arakkonam_town', name: 'Arakkonam Town / Central', nativeName: 'அரக்கோணம் நகரம்' },
    { id: 'arakkonam_rs', name: 'Arakkonam Railway Colony / New Bus Stand', nativeName: 'ரயில்வே காலனி' },
    { id: 'itagi', name: 'Itchiputhur Village', nativeName: 'இச்சிபுத்தூர்' },
    { id: 'mosur', name: 'Mosur Village', nativeName: 'மோசூர்' },
    { id: 'mudur', name: 'Mudur Village', nativeName: 'முதூர்' },
    { id: 'chittoor_gate', name: 'Chittoor Gate / Winterpet', nativeName: 'வின்டர்பேட்டை' },
    { id: 'suvalpet', name: 'Suvalpet Locality', nativeName: 'சுவால்பேட்டை' },
    { id: 'banavaram', name: 'Banavaram Town', nativeName: 'பனாவரம்' },
    { id: 'thakkolam', name: 'Thakkolam Town', nativeName: 'தக்கோலம்' },
    { id: 'kavanur', name: 'Kavanur Village', nativeName: 'காவனூர்' },
    { id: 'nagavedu', name: 'Nagavedu Village', nativeName: 'நாகவேடு' },
  ],
  thiruvalangadu: [
    { id: 'thiruvalangadu_village', name: 'Thiruvalangadu Village Center', nativeName: 'திருவாலங்காடு' },
    { id: 'thiruvalangadu_rs', name: 'Thiruvalangadu Railway Station Area', nativeName: 'ரயில் நிலையம்' },
    { id: 'harichandrapuram', name: 'Harichandrapuram Village', nativeName: 'ஹரிசந்திராபுரம்' },
    { id: 'veeraraghavapuram', name: 'Veeraraghavapuram Village', nativeName: 'வீரராகவபுரம்' },
    { id: 'pennalurpet', name: 'Pennalurpet Locality', nativeName: 'பெண்ணாலூர்பேட்டை' },
    { id: 'manavur', name: 'Manavur Village', nativeName: 'மணவூர்' },
    { id: 'chinnammapet', name: 'Chinnammapet Village', nativeName: 'சின்னம்மாபேட்டை' },
    { id: 'kanakammachatram', name: 'Kanakammachatram Village', nativeName: 'கனகம்மாசத்திரம்' },
    { id: 'vyasapuram', name: 'Vyasapuram Village', nativeName: 'வியாசபுரம்' },
  ],
  wallajah: [
    { id: 'wallajah_town', name: 'Wallajah Town (Walajapet)', nativeName: 'வாலாஜாபேட்டை' },
    { id: 'ranipet_town', name: 'Ranipet Town', nativeName: 'ராணிப்பேட்டை நகரம்' },
    { id: 'vanapadi', name: 'Vanapadi Industrial Area', nativeName: 'வானாபாடி' },
    { id: 'bhel_township', name: 'BHEL Township Ranipet', nativeName: 'பி.எச்.இ.எல்' },
    { id: 'lalapet', name: 'Lalapet Village', nativeName: 'லாலாபேட்டை' },
  ],
  triplicane: [
    { id: 'triplicane_high_road', name: 'Triplicane High Road (Big Mosque Area)', nativeName: 'திருவல்லிக்கேணி ஹை ரோடு' },
    { id: 'chepauk', name: 'Chepauk / Bells Road', nativeName: 'சேப்பாக்கம்' },
    { id: 'ice_house', name: 'Ice House (Dr. Besant Road)', nativeName: 'ஐஸ் ஹவுஸ்' },
    { id: 'thousand_lights', name: 'Thousand Lights / Mount Road', nativeName: 'ஆயிரம் விளக்கு' },
    { id: 'pudupet', name: 'Pudupet / Komaleeswaranpet', nativeName: 'புதுப்பேட்டை' },
    { id: 'mirbakshi_ali', name: 'Mirbakshi Ali Street Area', nativeName: 'மீர்பக்ஷி அலி' },
  ],
  tenkasi_taluk: [
    { id: 'tenkasi_town', name: 'Tenkasi Town', nativeName: 'தென்காசி' },
    { id: 'melapuliyur', name: 'Melapuliyur Village', nativeName: 'மேலப்புலியூர்' },
    { id: 'surandai', name: 'Surandai Town', nativeName: 'சுரண்டை' },
    { id: 'pavoorchatram', name: 'Pavoorchatram Village', nativeName: 'பாவூர்சத்திரம்' },
    { id: 'courtallam', name: 'Courtallam', nativeName: 'குற்றாலம்' },
  ],
};

/**
 * Dynamic OpenStreetMap Hierarchy Resolver:
 * Resolves states, districts, taluks, and villages dynamically for any country/region on Earth!
 */
export async function fetchDynamicAdministrativeUnits(
  query: string,
  parentLocationName?: string,
  countryCode?: string,
  signal?: AbortSignal
): Promise<LocationItem[]> {
  const searchTerm = parentLocationName ? `${query}, ${parentLocationName}` : query;
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('q', searchTerm);
  url.searchParams.set('format', 'json');
  url.searchParams.set('addressdetails', '1');
  url.searchParams.set('extratags', '1');
  url.searchParams.set('limit', '30');
  if (countryCode) {
    url.searchParams.set('countrycodes', countryCode.toLowerCase());
  }

  try {
    const res = await fetch(url.toString(), {
      signal,
      headers: {
        'User-Agent': 'TimeOfSalahApp/1.0 (Islamic Mosque & Location Hierarchy)',
        'Accept-Language': 'en,ta,ar,ur',
      },
    });

    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];

    const items: LocationItem[] = [];
    const seen = new Set<string>();

    data.forEach((item: any) => {
      const lat = parseFloat(item.lat);
      const lon = parseFloat(item.lon);
      const addr = item.address || {};
      const name = item.name || item.display_name.split(',')[0];
      const nativeName = item.namedetails?.['name:ta'] || item.namedetails?.['name:ar'] || item.namedetails?.['name:ur'] || '';

      const key = `${name.toLowerCase()}_${addr.state || ''}_${addr.country || ''}`;
      if (!seen.has(key)) {
        seen.add(key);
        items.push({
          id: `osm-loc-${item.osm_type || 'place'}-${item.osm_id || Math.round(lat * 10000)}`,
          name,
          nativeName: nativeName || (addr.city || addr.town || addr.village || ''),
          coordinates: !isNaN(lat) && !isNaN(lon) ? { latitude: lat, longitude: lon } : undefined,
        });
      }
    });

    return items;
  } catch (e: any) {
    if (e.name === 'AbortError') throw e;
    console.warn('Dynamic hierarchy fetch error:', e);
    return [];
  }
}
