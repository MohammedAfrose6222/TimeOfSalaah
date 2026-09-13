import { Coordinates, Masjid, CalculationMethod, JuristicMethod } from '../types';
import { calculateDistanceKm } from './masjidService';

interface CacheEntry {
  timestamp: number;
  results: Masjid[];
}

const searchCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

// Non-Islamic place filter (to prevent monasteries, churches, temples from polluting results)
const NON_ISLAMIC_REGEX = /\b(church|temple|cathedral|synagogue|gurudwara|gurdwara|chapel|monastery|mandir|kovil|koil|kerk|kirche|kyrka|eglise|chiesa|igreja|shrine|parish|basilica|abbey|abdij|ashram|congregation|pentecostal|baptist|adventist|lutheran|methodist|presbyterian|hindu|buddhist|jain|sikh|jewish|catholic|orthodox|evangelical|convent)\b/i;

// Islamic terms regex (broad multilingual coverage)
const ISLAMIC_REGEX = /\b(mosque|masjid|jami|jamia|markaz|musallah|musalla|islamic|camii|cami|cuma|surau|mezquita|mescit|zawiya|khanqah|madrassa|madrasa|maktab|imam|dargah|qazi|palli)\b|[\u0600-\u06FF]|[\u0B80-\u0BFF]/i;

/**
 * Checks if a place is an Islamic mosque or prayer hall
 */
export function isMosqueRecord(name: string, category?: string, type?: string, tags: Record<string, any> = {}): boolean {
  if (!name) return false;
  if (NON_ISLAMIC_REGEX.test(name)) return false;

  const rel = (tags.religion || '').toLowerCase();
  if (rel && rel !== 'muslim' && rel !== 'islamic') return false;

  if (rel === 'muslim' || tags.building === 'mosque' || tags.amenity === 'mosque' || type === 'mosque' || category === 'mosque') {
    return true;
  }

  if (ISLAMIC_REGEX.test(name)) return true;

  // If tagged as place of worship and doesn't have non-islamic tag/name
  if (category === 'amenity' && (type === 'place_of_worship' || type === 'mosque')) {
    return true;
  }

  return false;
}

/**
 * Determines the most standard prayer calculation method for a given country or coordinate
 */
export function getDefaultCalculationMethodForCountry(country: string, coords: Coordinates): CalculationMethod {
  const c = country.toLowerCase();

  // North America
  if (c.includes('united states') || c.includes('usa') || c.includes('canada') || c === 'us' || c === 'ca') {
    return 'ISNA';
  }

  // Saudi Arabia & Gulf
  if (c.includes('saudi') || c.includes('arabia') || c.includes('yemen')) {
    return 'MAKKAH';
  }
  if (c.includes('emirates') || c.includes('uae') || c.includes('dubai') || c.includes('qatar') || c.includes('kuwait') || c.includes('bahrain') || c.includes('oman')) {
    return 'GULF';
  }

  // Egypt, North Africa & Levant
  if (c.includes('egypt') || c.includes('libya') || c.includes('algeria') || c.includes('tunisia') || c.includes('morocco') || c.includes('sudan') || c.includes('jordan') || c.includes('lebanon') || c.includes('syria') || c.includes('palestine')) {
    return 'EGYPT';
  }

  // South Asia
  if (c.includes('india') || c.includes('pakistan') || c.includes('bangladesh') || c.includes('afghanistan') || c.includes('sri lanka')) {
    return 'KARACHI';
  }

  // Iran
  if (c.includes('iran')) {
    return 'TEHRAN';
  }

  // Geographic Lat/Lng Fallbacks
  if (coords.latitude >= 24 && coords.latitude <= 49 && coords.longitude >= -125 && coords.longitude <= -65) {
    return 'ISNA'; // North America
  }
  if (coords.latitude >= 12 && coords.latitude <= 32 && coords.longitude >= 34 && coords.longitude <= 60) {
    return 'MAKKAH'; // Middle East
  }
  if (coords.latitude >= 5 && coords.latitude <= 38 && coords.longitude >= 60 && coords.longitude <= 95) {
    return 'KARACHI'; // South Asia
  }

  return 'MWL';
}

/**
 * Standard juristic method by region (Hanafi in South Asia/Turkey/Levant vs Standard elsewhere)
 */
export function getDefaultJuristicMethod(country: string): JuristicMethod {
  const c = country.toLowerCase();
  if (c.includes('india') || c.includes('pakistan') || c.includes('bangladesh') || c.includes('turkey') || c.includes('afghanistan')) {
    return 'HANAFI';
  }
  return 'STANDARD';
}

/**
 * Cleans and formats Mosque name
 */
function cleanMosqueName(rawName: string, alternativeFallback?: string): string {
  if (!rawName || rawName.trim().length === 0) {
    return alternativeFallback || 'Masjid';
  }

  let name = rawName.trim();
  if (name === name.toLowerCase()) {
    name = name.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  return name;
}

/**
 * Rank search results by relevance for GLOBAL NAME / LOCATION search:
 * 1. Exact name match
 * 2. Starts with query (e.g. "Ar..." -> "Ar-Rahman...", "Abdullah...")
 * 3. Word inside name starts with query (e.g. "Rahman" matches "Ar-Rahman")
 * 4. Substring anywhere in name (beginning, middle, end)
 * 5. Location match (city, district, state, country)
 */
function rankWorldwideResults(query: string, list: Masjid[]): Masjid[] {
  const q = query.toLowerCase().trim();
  if (!q) return list;

  return list.sort((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();

    // 1. Exact Match
    if (aName === q && bName !== q) return -1;
    if (bName === q && aName !== q) return 1;

    // 2. Starts With Query
    const aStarts = aName.startsWith(q) || aName.startsWith(`masjid ${q}`) || aName.startsWith(`mosque ${q}`);
    const bStarts = bName.startsWith(q) || bName.startsWith(`masjid ${q}`) || bName.startsWith(`mosque ${q}`);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    // 3. Word starts with query (e.g. "Rahman" in "Ar-Rahman Masjid")
    const aWordStarts = aName.split(/[\s\-_]+/).some((w) => w.startsWith(q));
    const bWordStarts = bName.split(/[\s\-_]+/).some((w) => w.startsWith(q));
    if (aWordStarts && !bWordStarts) return -1;
    if (!aWordStarts && bWordStarts) return 1;

    // 4. Substring in Name (Middle or End)
    const aInName = aName.includes(q);
    const bInName = bName.includes(q);
    if (aInName && !bInName) return -1;
    if (!aInName && bInName) return 1;

    // 5. City/District/State Match
    const aLoc = `${a.city} ${a.district || ''} ${a.taluk || ''} ${a.state || ''} ${a.country}`.toLowerCase();
    const bLoc = `${b.city} ${b.district || ''} ${b.taluk || ''} ${b.state || ''} ${b.country}`.toLowerCase();
    const aInLoc = aLoc.includes(q);
    const bInLoc = bLoc.includes(q);
    if (aInLoc && !bInLoc) return -1;
    if (!aInLoc && bInLoc) return 1;

    return 0;
  });
}

export interface LocationHierarchyParams {
  country?: string;
  state?: string;
  district?: string;
  taluk?: string;
  village?: string;
  coordinates?: Coordinates;
  query?: string;
}

/**
 * HIERARCHICAL DISCOVERY ENGINE:
 * Discovers ALL available masjids in a selected village, town, taluk, district, state, or country.
 */
export async function searchMasjidsByLocationHierarchy(
  params: LocationHierarchyParams,
  localMasjids: Masjid[] = [],
  signal?: AbortSignal
): Promise<Masjid[]> {
  const { country = '', state = '', district = '', taluk = '', village = '', coordinates, query = '' } = params;

  const targetLocation = [village, taluk, district, state, country].filter(Boolean).join(', ');
  const cacheKey = `hier_${targetLocation.toLowerCase()}_${query.toLowerCase()}`;

  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.results;
  }

  const resultsMap = new Map<string, Masjid>();

  // 1. Check local database
  const qLower = query.toLowerCase().trim();
  for (const m of localMasjids) {
    const locString = `${m.city} ${m.taluk || ''} ${m.district || ''} ${m.state || ''} ${m.country}`.toLowerCase();
    const matchesLoc = [village, taluk, district, state].some((term) => term && locString.includes(term.toLowerCase()));
    const matchesName = !qLower || m.name.toLowerCase().includes(qLower) || (m.tamilName && m.tamilName.toLowerCase().includes(qLower));

    if (matchesLoc && matchesName) {
      const dist = coordinates ? calculateDistanceKm(coordinates, m.coordinates) : undefined;
      resultsMap.set(`${m.coordinates.latitude.toFixed(3)}_${m.coordinates.longitude.toFixed(3)}`, {
        ...m,
        distanceKm: dist,
      });
    }
  }

  // 2. Fetch coordinates of target locality if not already provided
  let centerCoords = coordinates;
  if (!centerCoords && targetLocation) {
    try {
      const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(targetLocation)}&format=json&limit=1&addressdetails=1`;
      const res = await fetch(geoUrl, { signal, headers: { 'User-Agent': 'TimeOfSalahApp/1.0' } });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          centerCoords = {
            latitude: parseFloat(data[0].lat),
            longitude: parseFloat(data[0].lon),
          };
        }
      }
    } catch (e: any) {
      if (e.name === 'AbortError') throw e;
      console.warn('Geocoding target locality error:', e);
    }
  }

  // 3. Multi-Query Discovery around the target location & surrounding areas
  const queriesToRun: Promise<any>[] = [];

  // A. Spatial Proximity if coordinates available (search 30km radius for village/taluk)
  if (centerCoords) {
    const photonNearbyUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(qLower ? `${qLower} mosque` : 'mosque')}&lat=${centerCoords.latitude}&lon=${centerCoords.longitude}&limit=50`;
    queriesToRun.push(
      fetch(photonNearbyUrl, { signal, headers: { 'User-Agent': 'Mozilla/5.0' } })
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => ({ type: 'photon', features: d?.features || [] }))
        .catch(() => ({ type: 'photon', features: [] }))
    );

    // Delta box for Nominatim (~25-35km radius)
    const delta = 0.25;
    const minLat = centerCoords.latitude - delta;
    const maxLat = centerCoords.latitude + delta;
    const minLon = centerCoords.longitude - delta;
    const maxLon = centerCoords.longitude + delta;

    const nomBoundedUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(qLower ? `${qLower} mosque` : 'mosque')}&format=json&viewbox=${minLon},${maxLat},${maxLon},${minLat}&bounded=1&limit=40&addressdetails=1&extratags=1&namedetails=1`;
    queriesToRun.push(
      fetch(nomBoundedUrl, { signal, headers: { 'User-Agent': 'TimeOfSalahApp/1.0' } })
        .then((r) => (r.ok ? r.json() : []))
        .then((d) => ({ type: 'nominatim', items: Array.isArray(d) ? d : [] }))
        .catch(() => ({ type: 'nominatim', items: [] }))
    );
  }

  // B. Specific Location string searches
  const specificTerms = [
    qLower ? `${qLower} in ${village || taluk || district || state}` : `mosque in ${village || taluk || district || state}`,
    qLower ? `${qLower} ${village || taluk || district}` : `masjid in ${village || taluk || district}`,
  ];

  specificTerms.forEach((term) => {
    const nomUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(term)}&format=json&limit=30&addressdetails=1&extratags=1&namedetails=1`;
    queriesToRun.push(
      fetch(nomUrl, { signal, headers: { 'User-Agent': 'TimeOfSalahApp/1.0' } })
        .then((r) => (r.ok ? r.json() : []))
        .then((d) => ({ type: 'nominatim', items: Array.isArray(d) ? d : [] }))
        .catch(() => ({ type: 'nominatim', items: [] }))
    );
  });

  try {
    const responses = await Promise.all(queriesToRun);

    for (const res of responses) {
      if (res.type === 'photon') {
        res.features.forEach((f: any) => {
          const p = f.properties || {};
          const [lon, lat] = f.geometry?.coordinates || [0, 0];
          if (!lat || !lon) return;

          const rawName = p.name || `Masjid (${p.city || village || district || country})`;
          if (!isMosqueRecord(rawName, 'amenity', p.osm_value, p)) return;

          // Partial name check if query specified
          if (qLower && !rawName.toLowerCase().includes(qLower)) return;

          const pointCoords: Coordinates = { latitude: lat, longitude: lon };
          const dist = centerCoords ? calculateDistanceKm(centerCoords, pointCoords) : undefined;

          // Keep within reasonable vicinity of the location (within 45 km)
          if (dist !== undefined && dist > 45) return;

          const c = p.country || country || 'Worldwide';
          const cit = p.city || p.town || p.village || village || p.district || district || c;
          const dis = p.district || p.county || district || '';
          const st = p.state || state || '';
          const street = p.street ? (p.housenumber ? `${p.housenumber} ${p.street}` : p.street) : '';
          const name = cleanMosqueName(rawName, `Masjid in ${cit}`);

          const key = `${lat.toFixed(3)}_${lon.toFixed(3)}`;
          if (!resultsMap.has(key)) {
            resultsMap.set(key, {
              id: `osm-hier-p-${p.osm_id || Math.round(lat * 10000)}`,
              name,
              address: street ? `${street}, ${cit}` : `${cit}, ${dis || st}, ${c}`,
              city: cit,
              district: dis,
              taluk: taluk || p.district,
              state: st,
              country: c,
              coordinates: pointCoords,
              distanceKm: dist,
              isVerified: false,
              calculationMethod: getDefaultCalculationMethodForCountry(c, pointCoords),
              juristicMethod: getDefaultJuristicMethod(c),
              facilities: [
                { id: 'wudu', name: 'Wudu Facilities', icon: 'Droplets', available: true },
                { id: 'women', name: 'Women\'s Area', icon: 'Users', available: true },
                { id: 'parking', name: 'Parking Available', icon: 'Car', available: true },
                { id: 'wheelchair', name: 'Wheelchair Ramp', icon: 'Accessibility', available: true },
              ],
              jumuahSchedule: { firstKhutbah: '01:00 PM', firstSalah: '01:30 PM' },
              iqamahTimes: { fajr: '20m after Azan', zuhr: '15m after Azan', asr: '15m after Azan', maghrib: '5m after Azan', isha: '15m after Azan' },
            });
          }
        });
      } else if (res.type === 'nominatim') {
        res.items.forEach((item: any) => {
          const lat = parseFloat(item.lat);
          const lon = parseFloat(item.lon);
          if (!lat || !lon) return;

          const namedetails = item.namedetails || {};
          const extratags = item.extratags || {};
          const rawName = namedetails['name:en'] || item.name || item.display_name.split(',')[0];
          if (!isMosqueRecord(rawName, item.category, item.type, extratags)) return;

          if (qLower && !rawName.toLowerCase().includes(qLower)) return;

          const pointCoords: Coordinates = { latitude: lat, longitude: lon };
          const dist = centerCoords ? calculateDistanceKm(centerCoords, pointCoords) : undefined;

          if (dist !== undefined && dist > 45) return;

          const addr = item.address || {};
          const c = addr.country || country || 'Worldwide';
          const cit = addr.village || addr.town || addr.city || village || addr.suburb || district || c;
          const dis = addr.county || addr.district || addr.state_district || district || '';
          const tlk = addr.suburb || addr.neighbourhood || taluk || '';
          const st = addr.state || state || '';
          const road = addr.road || addr.street || '';

          const arabicName = namedetails['name:ar'] || (item.name && /[\u0600-\u06FF]/.test(item.name) ? item.name : undefined);
          const tamilName = namedetails['name:ta'] || (item.name && /[\u0B80-\u0BFF]/.test(item.name) ? item.name : undefined);
          const urduName = namedetails['name:ur'] || (item.name && /[\u0600-\u06FF]/.test(item.name) ? item.name : undefined);
          const name = cleanMosqueName(rawName, `Masjid in ${cit}`);

          const key = `${lat.toFixed(3)}_${lon.toFixed(3)}`;
          if (!resultsMap.has(key)) {
            resultsMap.set(key, {
              id: `osm-hier-n-${item.osm_type || 'place'}-${item.osm_id || Math.round(lat * 10000)}`,
              name,
              arabicName,
              tamilName,
              urduName,
              address: road ? `${road}, ${cit}` : item.display_name.split(',').slice(0, 3).join(','),
              city: cit,
              district: dis,
              taluk: tlk,
              state: st,
              country: c,
              coordinates: pointCoords,
              distanceKm: dist,
              isVerified: false,
              calculationMethod: getDefaultCalculationMethodForCountry(c, pointCoords),
              juristicMethod: getDefaultJuristicMethod(c),
              facilities: [
                { id: 'wudu', name: 'Wudu Facilities', icon: 'Droplets', available: true },
                { id: 'women', name: 'Women\'s Area', icon: 'Users', available: true },
                { id: 'parking', name: 'Parking Available', icon: 'Car', available: true },
                { id: 'wheelchair', name: 'Wheelchair Ramp', icon: 'Accessibility', available: true },
              ],
              jumuahSchedule: { firstKhutbah: '01:00 PM', firstSalah: '01:30 PM' },
              iqamahTimes: { fajr: '20m after Azan', zuhr: '15m after Azan', asr: '15m after Azan', maghrib: '5m after Azan', isha: '15m after Azan' },
            });
          }
        });
      }
    }
  } catch (e: any) {
    if (e.name === 'AbortError') throw e;
    console.warn('Hierarchy mosque discovery error:', e);
  }

  const list = Array.from(resultsMap.values());
  // Sort: If coordinates exist, nearest to the village center first; otherwise ranked by name
  if (centerCoords) {
    list.sort((a, b) => (a.distanceKm ?? 999999) - (b.distanceKm ?? 999999));
  } else {
    rankWorldwideResults(qLower, list);
  }

  if (list.length > 0) {
    searchCache.set(cacheKey, { timestamp: Date.now(), results: list });
  }

  return list;
}

/**
 * MAP BOUNDING BOX DISCOVERY:
 * Discovers all masjids currently visible within the interactive map viewport
 */
export async function searchMasjidsInBoundingBox(
  bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number },
  userCoords?: Coordinates | null,
  signal?: AbortSignal
): Promise<Masjid[]> {
  const { minLat, maxLat, minLon, maxLon } = bounds;
  const centerLat = (minLat + maxLat) / 2;
  const centerLon = (minLon + maxLon) / 2;
  const center: Coordinates = { latitude: centerLat, longitude: centerLon };

  const resultsMap = new Map<string, Masjid>();

  // 1. Query Nominatim Viewbox
  try {
    const nomUrl = `https://nominatim.openstreetmap.org/search?q=mosque&format=json&viewbox=${minLon},${maxLat},${maxLon},${minLat}&bounded=1&limit=50&addressdetails=1&extratags=1&namedetails=1`;
    const res = await fetch(nomUrl, { signal, headers: { 'User-Agent': 'TimeOfSalahApp/1.0' } });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        data.forEach((item: any) => {
          const lat = parseFloat(item.lat);
          const lon = parseFloat(item.lon);
          if (!lat || !lon) return;

          const rawName = item.namedetails?.['name:en'] || item.name || item.display_name.split(',')[0];
          if (!isMosqueRecord(rawName, item.category, item.type, item.extratags || {})) return;

          const pointCoords: Coordinates = { latitude: lat, longitude: lon };
          const dist = userCoords ? calculateDistanceKm(userCoords, pointCoords) : calculateDistanceKm(center, pointCoords);

          const addr = item.address || {};
          const country = addr.country || 'Worldwide';
          const city = addr.village || addr.town || addr.city || addr.suburb || country;
          const district = addr.county || addr.district || addr.state_district || '';
          const state = addr.state || '';
          const road = addr.road || addr.street || '';
          const name = cleanMosqueName(rawName, `Masjid in ${city}`);

          const key = `${lat.toFixed(3)}_${lon.toFixed(3)}`;
          resultsMap.set(key, {
            id: `osm-map-n-${item.osm_type || 'node'}-${item.osm_id || Math.round(lat * 10000)}`,
            name,
            address: road ? `${road}, ${city}` : item.display_name.split(',').slice(0, 3).join(','),
            city,
            district,
            state,
            country,
            coordinates: pointCoords,
            distanceKm: dist,
            isVerified: false,
            calculationMethod: getDefaultCalculationMethodForCountry(country, pointCoords),
            juristicMethod: getDefaultJuristicMethod(country),
            facilities: [
              { id: 'wudu', name: 'Wudu Facilities', icon: 'Droplets', available: true },
              { id: 'women', name: 'Women\'s Area', icon: 'Users', available: true },
              { id: 'parking', name: 'Parking Available', icon: 'Car', available: true },
              { id: 'wheelchair', name: 'Wheelchair Ramp', icon: 'Accessibility', available: true },
            ],
            jumuahSchedule: { firstKhutbah: '01:00 PM', firstSalah: '01:30 PM' },
            iqamahTimes: { fajr: '20m after Azan', zuhr: '15m after Azan', asr: '15m after Azan', maghrib: '5m after Azan', isha: '15m after Azan' },
          });
        });
      }
    }
  } catch (e: any) {
    if (e.name === 'AbortError') throw e;
    console.warn('Map bounds Nominatim error:', e);
  }

  // 2. Query Photon proximity around map center
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=mosque&lat=${centerLat}&lon=${centerLon}&limit=50`;
    const res = await fetch(photonUrl, { signal, headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.features)) {
        data.features.forEach((f: any) => {
          const p = f.properties || {};
          const [lon, lat] = f.geometry?.coordinates || [0, 0];
          if (!lat || !lon) return;

          if (lat < minLat - 0.1 || lat > maxLat + 0.1 || lon < minLon - 0.1 || lon > maxLon + 0.1) return;

          const rawName = p.name || `Masjid (${p.city || p.country})`;
          if (!isMosqueRecord(rawName, 'amenity', p.osm_value, p)) return;

          const pointCoords: Coordinates = { latitude: lat, longitude: lon };
          const dist = userCoords ? calculateDistanceKm(userCoords, pointCoords) : calculateDistanceKm(center, pointCoords);

          const country = p.country || 'Worldwide';
          const city = p.city || p.town || p.district || country;
          const district = p.district || p.county || '';
          const state = p.state || '';
          const street = p.street || '';
          const name = cleanMosqueName(rawName, `Masjid in ${city}`);

          const key = `${lat.toFixed(3)}_${lon.toFixed(3)}`;
          if (!resultsMap.has(key)) {
            resultsMap.set(key, {
              id: `osm-map-p-${p.osm_id || Math.round(lat * 10000)}`,
              name,
              address: street ? `${street}, ${city}` : `${city}, ${country}`,
              city,
              district,
              state,
              country,
              coordinates: pointCoords,
              distanceKm: dist,
              isVerified: false,
              calculationMethod: getDefaultCalculationMethodForCountry(country, pointCoords),
              juristicMethod: getDefaultJuristicMethod(country),
              facilities: [
                { id: 'wudu', name: 'Wudu Facilities', icon: 'Droplets', available: true },
                { id: 'women', name: 'Women\'s Area', icon: 'Users', available: true },
                { id: 'parking', name: 'Parking Available', icon: 'Car', available: true },
                { id: 'wheelchair', name: 'Wheelchair Ramp', icon: 'Accessibility', available: true },
              ],
              jumuahSchedule: { firstKhutbah: '01:00 PM', firstSalah: '01:30 PM' },
              iqamahTimes: { fajr: '20m after Azan', zuhr: '15m after Azan', asr: '15m after Azan', maghrib: '5m after Azan', isha: '15m after Azan' },
            });
          }
        });
      }
    }
  } catch (e: any) {
    if (e.name === 'AbortError') throw e;
    console.warn('Map bounds Photon error:', e);
  }

  const list = Array.from(resultsMap.values());
  list.sort((a, b) => (a.distanceKm ?? 999999) - (b.distanceKm ?? 999999));
  return list;
}

/**
 * GPS NEARBY MOSQUES (Sorted nearest first)
 */
export async function searchNearbyMosques(
  coords: Coordinates,
  radiusKm: number = 20,
  localMasjids: Masjid[] = [],
  signal?: AbortSignal
): Promise<Masjid[]> {
  const resultsMap = new Map<string, Masjid>();

  // Local verified masjids
  for (const m of localMasjids) {
    const dist = calculateDistanceKm(coords, m.coordinates);
    if (dist <= radiusKm * 2) {
      resultsMap.set(`${m.coordinates.latitude.toFixed(3)}_${m.coordinates.longitude.toFixed(3)}`, {
        ...m,
        distanceKm: dist,
      });
    }
  }

  // Photon proximity
  try {
    const photonUrl = `https://photon.komoot.io/api/?q=mosque&lat=${coords.latitude}&lon=${coords.longitude}&limit=50`;
    const res = await fetch(photonUrl, { signal, headers: { 'User-Agent': 'TimeOfSalahApp/1.0' } });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.features)) {
        data.features.forEach((f: any) => {
          const p = f.properties || {};
          const [lon, lat] = f.geometry?.coordinates || [0, 0];
          if (!lat || !lon) return;

          const rawName = p.name || `Masjid (${p.city || p.country || 'Nearby'})`;
          if (!isMosqueRecord(rawName, 'amenity', p.osm_value, p)) return;

          const pointCoords: Coordinates = { latitude: lat, longitude: lon };
          const dist = calculateDistanceKm(coords, pointCoords);

          if (dist > radiusKm * 2.5) return;

          const country = p.country || 'Nearby Location';
          const city = p.city || p.town || p.district || p.state || country;
          const district = p.district || p.county || '';
          const state = p.state || '';
          const street = p.street ? (p.housenumber ? `${p.housenumber} ${p.street}` : p.street) : '';
          const name = cleanMosqueName(rawName, `Masjid in ${city}`);

          const key = `${lat.toFixed(3)}_${lon.toFixed(3)}`;
          if (!resultsMap.has(key)) {
            resultsMap.set(key, {
              id: `osm-nearby-${p.osm_id || Math.round(lat * 10000)}`,
              name,
              address: street ? `${street}, ${city}` : `${city}, ${country}`,
              city,
              district,
              state,
              country,
              coordinates: pointCoords,
              distanceKm: dist,
              isVerified: false,
              calculationMethod: getDefaultCalculationMethodForCountry(country, pointCoords),
              juristicMethod: getDefaultJuristicMethod(country),
              facilities: [
                { id: 'wudu', name: 'Wudu Facilities', icon: 'Droplets', available: true },
                { id: 'women', name: 'Women\'s Area', icon: 'Users', available: true },
                { id: 'parking', name: 'Parking Available', icon: 'Car', available: true },
                { id: 'wheelchair', name: 'Wheelchair Ramp', icon: 'Accessibility', available: true },
              ],
              jumuahSchedule: { firstKhutbah: '01:00 PM', firstSalah: '01:30 PM' },
              iqamahTimes: { fajr: '20m after Azan', zuhr: '15m after Azan', asr: '15m after Azan', maghrib: '5m after Azan', isha: '15m after Azan' },
            });
          }
        });
      }
    }
  } catch (e: any) {
    if (e.name === 'AbortError') throw e;
    console.warn('Photon nearby failed:', e);
  }

  // Nominatim bounded viewbox
  if (resultsMap.size < 10) {
    try {
      const delta = Math.max(0.12, (radiusKm / 111) * 1.5);
      const minLat = coords.latitude - delta;
      const maxLat = coords.latitude + delta;
      const minLon = coords.longitude - delta;
      const maxLon = coords.longitude + delta;

      const nomUrl = `https://nominatim.openstreetmap.org/search?q=mosque&format=json&viewbox=${minLon},${maxLat},${maxLon},${minLat}&bounded=1&limit=40&addressdetails=1&extratags=1&namedetails=1`;
      const res = await fetch(nomUrl, { signal, headers: { 'User-Agent': 'TimeOfSalahApp/1.0' } });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          data.forEach((item: any) => {
            const lat = parseFloat(item.lat);
            const lon = parseFloat(item.lon);
            if (!lat || !lon) return;

            const namedetails = item.namedetails || {};
            const rawName = namedetails['name:en'] || item.name || item.display_name.split(',')[0];
            if (!isMosqueRecord(rawName, item.category, item.type, item.extratags || {})) return;

            const pointCoords: Coordinates = { latitude: lat, longitude: lon };
            const dist = calculateDistanceKm(coords, pointCoords);

            const address = item.address || {};
            const country = address.country || 'Nearby Location';
            const city = address.city || address.town || address.village || address.municipality || address.suburb || address.state || country;
            const district = address.county || address.district || address.state_district || '';
            const road = address.road || address.pedestrian || address.street || '';

            const arabicName = namedetails['name:ar'] || (item.name && /[\u0600-\u06FF]/.test(item.name) ? item.name : undefined);
            const tamilName = namedetails['name:ta'] || (item.name && /[\u0B80-\u0BFF]/.test(item.name) ? item.name : undefined);
            const urduName = namedetails['name:ur'] || (item.name && /[\u0600-\u06FF]/.test(item.name) ? item.name : undefined);
            const name = cleanMosqueName(rawName, `Masjid in ${city}`);

            const key = `${lat.toFixed(3)}_${lon.toFixed(3)}`;
            if (!resultsMap.has(key)) {
              resultsMap.set(key, {
                id: `osm-nom-${item.osm_type || 'node'}-${item.osm_id || Math.round(lat * 10000)}`,
                name,
                arabicName,
                tamilName,
                urduName,
                address: road ? `${road}, ${city}` : item.display_name.split(',').slice(0, 3).join(','),
                city,
                district,
                state: address.state,
                country,
                coordinates: pointCoords,
                distanceKm: dist,
                isVerified: false,
                calculationMethod: getDefaultCalculationMethodForCountry(country, pointCoords),
                juristicMethod: getDefaultJuristicMethod(country),
                facilities: [
                  { id: 'wudu', name: 'Wudu Facilities', icon: 'Droplets', available: true },
                  { id: 'women', name: 'Women\'s Area', icon: 'Users', available: true },
                  { id: 'parking', name: 'Parking Available', icon: 'Car', available: true },
                  { id: 'wheelchair', name: 'Wheelchair Ramp', icon: 'Accessibility', available: true },
                ],
                jumuahSchedule: { firstKhutbah: '01:00 PM', firstSalah: '01:30 PM' },
                iqamahTimes: { fajr: '20m after Azan', zuhr: '15m after Azan', asr: '15m after Azan', maghrib: '5m after Azan', isha: '15m after Azan' },
              });
            }
          });
        }
      }
    } catch (e: any) {
      if (e.name === 'AbortError') throw e;
      console.warn('Nominatim nearby bounded error:', e);
    }
  }

  const list = Array.from(resultsMap.values());
  list.sort((a, b) => (a.distanceKm ?? 999999) - (b.distanceKm ?? 999999));
  return list;
}

/**
 * GLOBAL PARTIAL NAME & LOCATION SEARCH:
 * Searches globally by partial name (beginning, middle, end e.g. "Ar", "Rah", "Rahman"),
 * city, village, district, state, country.
 */
export async function searchWorldwideMosques(
  query: string,
  localMasjids: Masjid[],
  userCoords?: Coordinates | null,
  signal?: AbortSignal
): Promise<Masjid[]> {
  const cleanQ = query.trim();
  if (!cleanQ) return localMasjids;

  const cacheKey = `global_${cleanQ.toLowerCase()}`;
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.results;
  }

  const resultsMap = new Map<string, Masjid>();

  // 1. Search local curated database
  const qLower = cleanQ.toLowerCase();
  for (const m of localMasjids) {
    const nameMatch = m.name.toLowerCase().includes(qLower) || (m.tamilName && m.tamilName.toLowerCase().includes(qLower)) || (m.arabicName && m.arabicName.includes(cleanQ)) || (m.urduName && m.urduName.includes(cleanQ));
    const locMatch = `${m.city} ${m.taluk || ''} ${m.district || ''} ${m.state || ''} ${m.country} ${m.address}`.toLowerCase().includes(qLower);

    if (nameMatch || locMatch) {
      const dist = userCoords ? calculateDistanceKm(userCoords, m.coordinates) : undefined;
      resultsMap.set(`${m.coordinates.latitude.toFixed(3)}_${m.coordinates.longitude.toFixed(3)}`, {
        ...m,
        distanceKm: dist,
      });
    }
  }

  // 2. Parallel queries to Photon & Nominatim
  const photonEndpoints = [
    `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQ)}&osm_tag=amenity:place_of_worship&limit=50`,
    `https://photon.komoot.io/api/?q=${encodeURIComponent(cleanQ + ' mosque')}&limit=50`,
    `https://photon.komoot.io/api/?q=${encodeURIComponent('Masjid ' + cleanQ)}&limit=50`,
  ];

  const nominatimEndpoints = [
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanQ)}&format=json&addressdetails=1&extratags=1&namedetails=1&limit=50`,
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent('mosque in ' + cleanQ)}&format=json&addressdetails=1&extratags=1&namedetails=1&limit=50`,
  ];

  const fetchPhoton = Promise.all(
    photonEndpoints.map(async (url) => {
      try {
        const res = await fetch(url, { signal, headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data.features) ? data.features : [];
      } catch (e: any) {
        if (e.name === 'AbortError') throw e;
        return [];
      }
    })
  );

  const fetchNominatim = Promise.all(
    nominatimEndpoints.map(async (url) => {
      try {
        const res = await fetch(url, {
          signal,
          headers: {
            'User-Agent': 'TimeOfSalahApp/1.0 (Islamic Prayer Timing App)',
            'Accept-Language': 'en,ar,ta,ur',
          },
        });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (e: any) {
        if (e.name === 'AbortError') throw e;
        return [];
      }
    })
  );

  try {
    const [photonArrays, nomArrays] = await Promise.all([fetchPhoton, fetchNominatim]);

    photonArrays.flat().forEach((f: any) => {
      const p = f.properties || {};
      const [lon, lat] = f.geometry?.coordinates || [0, 0];
      if (!lat || !lon) return;

      const rawName = p.name || `Masjid (${p.city || p.country || 'Location'})`;
      if (!isMosqueRecord(rawName, 'amenity', p.osm_value, p)) return;

      const pointCoords: Coordinates = { latitude: lat, longitude: lon };
      const dist = userCoords ? calculateDistanceKm(userCoords, pointCoords) : undefined;

      const country = p.country || 'Worldwide';
      const city = p.city || p.town || p.district || p.state || country;
      const district = p.district || p.county || '';
      const state = p.state || '';
      const street = p.street ? (p.housenumber ? `${p.housenumber} ${p.street}` : p.street) : '';
      const name = cleanMosqueName(rawName, `Masjid in ${city}`);

      const key = `${lat.toFixed(3)}_${lon.toFixed(3)}`;
      if (!resultsMap.has(key)) {
        resultsMap.set(key, {
          id: `osm-photon-${p.osm_id || Math.round(lat * 10000)}`,
          name,
          address: street ? `${street}, ${city}` : `${city}, ${country}`,
          city,
          district,
          state,
          country,
          coordinates: pointCoords,
          distanceKm: dist,
          isVerified: false,
          calculationMethod: getDefaultCalculationMethodForCountry(country, pointCoords),
          juristicMethod: getDefaultJuristicMethod(country),
          facilities: [
            { id: 'wudu', name: 'Wudu Facilities', icon: 'Droplets', available: true },
            { id: 'women', name: 'Women\'s Area', icon: 'Users', available: true },
            { id: 'parking', name: 'Parking Available', icon: 'Car', available: true },
            { id: 'wheelchair', name: 'Wheelchair Ramp', icon: 'Accessibility', available: true },
          ],
          jumuahSchedule: { firstKhutbah: '01:00 PM', firstSalah: '01:30 PM' },
          iqamahTimes: { fajr: '20m after Azan', zuhr: '15m after Azan', asr: '15m after Azan', maghrib: '5m after Azan', isha: '15m after Azan' },
        });
      }
    });

    nomArrays.flat().forEach((item: any) => {
      const lat = parseFloat(item.lat);
      const lon = parseFloat(item.lon);
      if (!lat || !lon) return;

      const namedetails = item.namedetails || {};
      const extratags = item.extratags || {};
      const rawName = namedetails['name:en'] || item.name || item.display_name.split(',')[0];
      if (!isMosqueRecord(rawName, item.category, item.type, extratags)) return;

      const pointCoords: Coordinates = { latitude: lat, longitude: lon };
      const dist = userCoords ? calculateDistanceKm(userCoords, pointCoords) : undefined;

      const address = item.address || {};
      const country = address.country || address.country_code?.toUpperCase() || 'Worldwide';
      const city = address.village || address.town || address.city || address.municipality || address.county || address.state || country;
      const district = address.county || address.district || address.state_district || address.suburb || '';
      const taluk = address.suburb || address.neighbourhood || '';
      const state = address.state || address.region || '';
      const road = address.road || address.pedestrian || address.street || '';

      const arabicName = namedetails['name:ar'] || (item.name && /[\u0600-\u06FF]/.test(item.name) ? item.name : undefined);
      const tamilName = namedetails['name:ta'] || (item.name && /[\u0B80-\u0BFF]/.test(item.name) ? item.name : undefined);
      const urduName = namedetails['name:ur'] || (item.name && /[\u0600-\u06FF]/.test(item.name) ? item.name : undefined);
      const name = cleanMosqueName(rawName, `Masjid in ${city}`);

      const key = `${lat.toFixed(3)}_${lon.toFixed(3)}`;
      if (!resultsMap.has(key)) {
        resultsMap.set(key, {
          id: `osm-nom-${item.osm_type || 'node'}-${item.osm_id || Math.round(lat * 10000)}`,
          name,
          arabicName,
          tamilName,
          urduName,
          address: road ? `${road}, ${city}` : item.display_name.split(',').slice(0, 3).join(','),
          city,
          district,
          taluk,
          state,
          country,
          coordinates: pointCoords,
          distanceKm: dist,
          isVerified: false,
          calculationMethod: getDefaultCalculationMethodForCountry(country, pointCoords),
          juristicMethod: getDefaultJuristicMethod(country),
          facilities: [
            { id: 'wudu', name: 'Wudu Facilities', icon: 'Droplets', available: true },
            { id: 'women', name: 'Women\'s Area', icon: 'Users', available: true },
            { id: 'parking', name: 'Parking Available', icon: 'Car', available: true },
            { id: 'wheelchair', name: 'Wheelchair Ramp', icon: 'Accessibility', available: true },
          ],
          jumuahSchedule: { firstKhutbah: '01:00 PM', firstSalah: '01:30 PM' },
          iqamahTimes: { fajr: '20m after Azan', zuhr: '15m after Azan', asr: '15m after Azan', maghrib: '5m after Azan', isha: '15m after Azan' },
        });
      }
    });
  } catch (e: any) {
    if (e.name === 'AbortError') throw e;
    console.warn('Worldwide parallel fetch error:', e);
  }

  let rawList = Array.from(resultsMap.values());
  const ranked = rankWorldwideResults(cleanQ, rawList);

  if (ranked.length > 0) {
    searchCache.set(cacheKey, { timestamp: Date.now(), results: ranked });
  }

  return ranked;
}
