import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  Star, 
  X, 
  Building2, 
  Check, 
  Sparkles, 
  Info, 
  Loader2, 
  Globe2, 
  ExternalLink, 
  RotateCcw, 
  Compass, 
  AlertCircle,
  ChevronDown
} from 'lucide-react';
import { Coordinates, Masjid } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { masjidService } from '../services/masjidService';

interface MasjidSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMasjidId: string;
  onSelectMasjid: (masjid: Masjid) => void;
  favouriteIds: string[];
  onToggleFavourite: (id: string) => void;
  onOpenDetails: (masjid: Masjid) => void;
}

const POPULAR_GLOBAL_SUGGESTIONS = [
  { name: 'Makkah', label: 'Makkah 🇸🇦' },
  { name: 'Madinah', label: 'Madinah 🇸🇦' },
  { name: 'Dubai', label: 'Dubai 🇦🇪' },
  { name: 'London', label: 'London 🇬🇧' },
  { name: 'New York', label: 'New York 🇺🇸' },
  { name: 'Chennai', label: 'Chennai 🇮🇳' },
  { name: 'Kerala', label: 'Kerala 🇮🇳' },
  { name: 'India', label: 'India 🇮🇳' },
  { name: 'Istanbul', label: 'Istanbul 🇹🇷' },
  { name: 'Kuala Lumpur', label: 'Kuala Lumpur 🇲🇾' },
];

const ITEMS_PER_PAGE = 15;

export const MasjidSearchModal: React.FC<MasjidSearchModalProps> = ({
  isOpen,
  onClose,
  selectedMasjidId,
  onSelectMasjid,
  favouriteIds,
  onToggleFavourite,
  onOpenDetails,
}) => {
  const { t, getMasjidName, isRtl } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'nearby' | 'global' | 'favourites'>('nearby');
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'detecting' | 'detected' | 'denied'>('idle');

  // Search results & pagination
  const [allResults, setAllResults] = useState<Masjid[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<number | null>(null);

  // Load nearby mosques around coords
  const loadNearby = useCallback(async (coords: Coordinates) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    // Instant local nearest results
    const local = masjidService.searchMasjidsLocal('', coords);
    setAllResults(local);
    setVisibleCount(ITEMS_PER_PAGE);

    setIsLoading(true);
    setSearchError(null);

    try {
      const nearbyResults = await masjidService.searchNearby(coords, 25, signal);
      if (nearbyResults.length > 0) {
        setAllResults(nearbyResults);
      }
      setIsLoading(false);
    } catch (e: any) {
      if (e.name === 'AbortError') return;
      console.warn('Nearby search error:', e);
      setIsLoading(false);
    }
  }, []);

  // Global search by name, city, area, country
  const executeGlobalSearch = useCallback(async (query: string) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const trimmed = query.trim();
    if (!trimmed) {
      if (userCoords) loadNearby(userCoords);
      else setAllResults(masjidService.getAllMasjids());
      return;
    }

    // Instant local matches so UI feels responsive
    const local = masjidService.searchMasjidsLocal(trimmed, userCoords);
    setAllResults(local);
    setVisibleCount(ITEMS_PER_PAGE);

    setIsLoading(true);
    setSearchError(null);

    try {
      const worldwideResults = await masjidService.searchMasjidsWorldwide(trimmed, userCoords, signal);
      setAllResults(worldwideResults);
      setVisibleCount(ITEMS_PER_PAGE);
      setIsLoading(false);
    } catch (e: any) {
      if (e.name === 'AbortError') return;
      console.warn('Global search error:', e);
      setIsLoading(false);
      setSearchError(t.searchError);
    }
  }, [userCoords, loadNearby, t.searchError]);

  // Initial load when modal opens
  useEffect(() => {
    if (!isOpen) return;

    if (!userCoords && navigator.geolocation) {
      setIsLocating(true);
      setLocationStatus('detecting');

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: Coordinates = {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          setUserCoords(coords);
          setIsLocating(false);
          setLocationStatus('detected');
          if (searchMode === 'nearby' && !searchQuery) {
            loadNearby(coords);
          }
        },
        (err) => {
          console.warn('GPS prompt/denied:', err);
          setIsLocating(false);
          setLocationStatus('denied');
          // Fallback to active masjid
          const active = masjidService.getMasjidById(selectedMasjidId);
          if (active && searchMode === 'nearby' && !searchQuery) {
            loadNearby(active.coordinates);
          } else if (!searchQuery) {
            setAllResults(masjidService.getAllMasjids());
          }
        },
        { timeout: 7000, enableHighAccuracy: true }
      );
    } else if (userCoords && searchMode === 'nearby' && !searchQuery) {
      loadNearby(userCoords);
    } else if (!searchQuery) {
      const active = masjidService.getMasjidById(selectedMasjidId);
      if (active) loadNearby(active.coordinates);
      else setAllResults(masjidService.getAllMasjids());
    }
  }, [isOpen]);

  // Debounced input handler (250ms for instant autocomplete)
  useEffect(() => {
    if (!isOpen) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = window.setTimeout(() => {
      const trimmed = searchQuery.trim();
      if (trimmed.length >= 2) {
        setSearchMode('global');
        executeGlobalSearch(trimmed);
      } else if (!trimmed && searchMode === 'nearby' && userCoords) {
        loadNearby(userCoords);
      }
    }, 250);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, userCoords, isOpen, executeGlobalSearch, loadNearby, searchMode]);

  // Locate Me button
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }

    setIsLocating(true);
    setLocationStatus('detecting');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: Coordinates = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        };
        setUserCoords(coords);
        setIsLocating(false);
        setLocationStatus('detected');
        setSearchQuery('');
        setSearchMode('nearby');
        loadNearby(coords);
      },
      (err) => {
        console.warn('GPS error:', err);
        setIsLocating(false);
        setLocationStatus('denied');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Filter list by favourites if tab active
  const filteredList = searchMode === 'favourites'
    ? allResults.filter((m) => favouriteIds.includes(m.id))
    : allResults;

  const paginatedList = filteredList.slice(0, visibleCount);
  const hasMore = visibleCount < filteredList.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-3xl bg-gradient-to-b from-[#063826] via-[#04281b] to-[#021810] border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-emerald-500/25 flex items-center justify-between gap-3 bg-emerald-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shadow-glow shrink-0">
              <Globe2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {t.changeMasjid}
                </h2>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-300 bg-emerald-900/80 px-2 py-0.5 rounded-full border border-emerald-400/40">
                  <Globe2 className="w-3 h-3 text-emerald-400" />
                  {locationStatus === 'detected' ? 'GPS Active' : 'Global Search & Nearby'}
                </span>
              </div>
              <p className="text-xs text-emerald-300/80">
                Search globally by mosque name (e.g. "abd", "masjid"), city, state, or country
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-emerald-950/80 text-emerald-300 hover:text-white hover:bg-emerald-900 border border-emerald-500/30 transition-colors shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar, Mode Tabs, and Popular Suggestions */}
        <div className="p-4 sm:p-5 space-y-3 bg-slate-950/50 border-b border-emerald-500/20">
          {/* Search Input */}
          <div className="relative">
            <Search className={`absolute ${isRtl ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type mosque name (e.g. abd, moh), city, district, state, country..."
              className={`w-full bg-slate-900/90 border border-emerald-500/35 rounded-2xl ${
                isRtl ? 'pr-10 pl-10' : 'pl-10 pr-10'
              } py-3 text-sm text-white placeholder-emerald-400/50 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/25 transition-all shadow-inner`}
              autoFocus
            />
            {isLoading ? (
              <div className={`absolute ${isRtl ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2`}>
                <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
              </div>
            ) : searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  if (userCoords) loadNearby(userCoords);
                }}
                className={`absolute ${isRtl ? 'left-3.5' : 'right-3.5'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-white`}
              >
                <X className="w-4 h-4" />
              </button>
            ) : null}
          </div>

          {/* Quick Popular Suggestions Pills */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-emerald-300/70 font-semibold block uppercase tracking-wider">
              {t.quickCitySuggestions}:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={handleLocateMe}
                disabled={isLocating}
                className="shrink-0 px-2.5 py-1 rounded-xl text-xs font-bold bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-600 hover:to-emerald-600 text-white flex items-center gap-1.5 shadow-sm border border-emerald-400/40"
              >
                {isLocating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3 text-teal-200" />}
                <span>📍 Nearby Me</span>
              </button>

              {POPULAR_GLOBAL_SUGGESTIONS.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setSearchQuery(item.name)}
                  className={`shrink-0 px-2.5 py-1 rounded-xl text-xs font-medium transition-all ${
                    searchQuery.toLowerCase() === item.name.toLowerCase()
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-emerald-950/70 text-emerald-200 border border-emerald-500/25 hover:bg-emerald-900/60 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Mode Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-1.5 bg-emerald-950/80 p-1 rounded-xl border border-emerald-500/30 text-xs">
              <button
                onClick={() => {
                  setSearchMode('nearby');
                  if (searchQuery) setSearchQuery('');
                  if (userCoords) loadNearby(userCoords);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                  searchMode === 'nearby' && !searchQuery
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-300/70 hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>📍 Nearby Mosques</span>
              </button>

              <button
                onClick={() => {
                  setSearchMode('global');
                  if (searchQuery) executeGlobalSearch(searchQuery);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                  searchMode === 'global' || searchQuery
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-300/70 hover:text-white'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>🌐 Search Name / Location</span>
              </button>

              <button
                onClick={() => setSearchMode('favourites')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                  searchMode === 'favourites'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-emerald-300/70 hover:text-white'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{t.favourites} ({favouriteIds.length})</span>
              </button>
            </div>

            {/* Counter */}
            <span className="text-[11px] text-emerald-300/80 font-medium bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/20">
              {filteredList.length} mosques available
            </span>
          </div>

          {/* Loading status */}
          {isLoading && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 text-xs font-medium animate-pulse">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>{searchQuery ? `Searching worldwide for "${searchQuery}"...` : 'Discovering nearby mosques...'}</span>
            </div>
          )}

          {searchError && !isLoading && (
            <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{searchError}</span>
              </div>
              <button
                onClick={() => executeGlobalSearch(searchQuery)}
                className="flex items-center gap-1 font-bold underline hover:text-white shrink-0"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.retrySearch}</span>
              </button>
            </div>
          )}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {paginatedList.length === 0 && !isLoading ? (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <Building2 className="w-12 h-12 mx-auto text-emerald-500/40" />
              <p className="text-sm max-w-md mx-auto">{t.noMasjidsFound}</p>
              {searchQuery && (
                <button
                  onClick={() => executeGlobalSearch(searchQuery)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 hover:text-white text-xs font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.retrySearch}</span>
                </button>
              )}
            </div>
          ) : (
            <>
              {paginatedList.map((masjid, index) => {
                const isSelected = masjid.id === selectedMasjidId;
                const isFav = favouriteIds.includes(masjid.id);
                const isOsm = masjid.id.startsWith('osm-');
                const isCloseNearby = masjid.distanceKm !== undefined && masjid.distanceKm <= 15;

                const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${masjid.coordinates.latitude},${masjid.coordinates.longitude}`;

                // Location hierarchy display (village/town/city, taluk, district, state, country)
                const locationParts = [
                  masjid.city,
                  masjid.taluk && masjid.taluk !== masjid.city ? masjid.taluk : undefined,
                  masjid.district && masjid.district !== masjid.city ? masjid.district : undefined,
                  masjid.state,
                  masjid.country,
                ].filter(Boolean);

                return (
                  <div
                    key={masjid.id || `masjid-${index}`}
                    className={`group relative rounded-2xl border p-3.5 sm:p-4 transition-all duration-200 ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-900/90 via-[#074831] to-emerald-900/90 border-emerald-400 shadow-lg ring-1 ring-emerald-400/50'
                        : 'bg-slate-900/70 border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-950/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Left: Mosque Details */}
                      <div
                        onClick={() => {
                          masjidService.registerMasjid(masjid);
                          onSelectMasjid(masjid);
                          onClose();
                        }}
                        className="flex-1 cursor-pointer min-w-0"
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                            {getMasjidName(masjid)}
                          </h3>

                          {masjid.arabicName && (
                            <span className="text-xs font-arabic text-amber-300/90 font-bold px-1.5 py-0.5 rounded bg-emerald-950/60 border border-amber-500/20">
                              {masjid.arabicName}
                            </span>
                          )}

                          {isCloseNearby && searchMode === 'nearby' && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-300 font-bold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-400/40">
                              <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                              Nearby
                            </span>
                          )}

                          {masjid.isVerified ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-300 font-semibold bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">
                              <Sparkles className="w-2.5 h-2.5" />
                              {t.verifiedMasjid}
                            </span>
                          ) : isOsm ? (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-teal-300 font-medium bg-teal-950/60 px-1.5 py-0.5 rounded border border-teal-500/30">
                              <Globe2 className="w-2.5 h-2.5" />
                              {t.osmWorldwideBadge}
                            </span>
                          ) : null}

                          {isSelected && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-200 font-bold bg-emerald-600 px-2 py-0.5 rounded-full shadow-sm">
                              <Check className="w-3 h-3" />
                              {t.activeBadge}
                            </span>
                          )}
                        </div>

                        {/* Location Hierarchy */}
                        <p className="text-xs text-emerald-300/80 mt-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{locationParts.join(', ')}</span>
                        </p>

                        {/* Full Address if available */}
                        {masjid.address && masjid.address !== masjid.city && (
                          <p className="text-[11px] text-slate-400 mt-0.5 truncate pl-4.5">
                            {masjid.address}
                          </p>
                        )}

                        {/* Distance & Coordinates Info */}
                        <div className="mt-2 flex items-center gap-2 text-xs flex-wrap">
                          {masjid.distanceKm !== undefined && (
                            <span className={`font-bold px-2.5 py-0.5 rounded-md text-[11px] border ${
                              masjid.distanceKm <= 5
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 font-bold'
                                : 'bg-amber-950/50 text-amber-300 border-amber-500/25'
                            }`}>
                              📍 {masjid.distanceKm} {t.distanceKm}
                            </span>
                          )}

                          <span className="text-slate-400 font-mono text-[10px] bg-slate-950/60 px-2 py-0.5 rounded-md border border-slate-800 flex items-center gap-1">
                            <Compass className="w-2.5 h-2.5 text-slate-500" />
                            {masjid.coordinates.latitude.toFixed(4)}°, {masjid.coordinates.longitude.toFixed(4)}°
                          </span>

                          {masjid.calculationMethod && (
                            <span className="text-emerald-400/80 text-[10px] bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/20">
                              Method: {masjid.calculationMethod}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 rounded-xl bg-slate-900/80 border border-emerald-500/20 text-slate-300 hover:text-emerald-300 hover:bg-slate-800 transition-colors"
                          title={t.viewOnMap}
                          aria-label="Open in Google Maps"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenDetails(masjid);
                          }}
                          className="p-2 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-emerald-300 hover:text-white hover:bg-emerald-900/60 transition-colors"
                          title={t.masjidDetailsTitle}
                        >
                          <Info className="w-4 h-4" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavourite(masjid.id);
                          }}
                          className={`p-2 rounded-xl border transition-all ${
                            isFav
                              ? 'bg-amber-500/20 border-amber-500/50 text-amber-400 hover:bg-amber-500/30'
                              : 'bg-emerald-950/70 border-emerald-500/30 text-slate-400 hover:text-amber-300 hover:bg-emerald-900/40'
                          }`}
                          title={isFav ? 'Remove favourite' : 'Add to favourites'}
                        >
                          <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Load More Pagination */}
              {hasMore && (
                <div className="text-center pt-2 pb-1">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-emerald-900/80 hover:bg-emerald-800 text-white font-semibold text-xs border border-emerald-400/30 shadow-md transition-all active:scale-95"
                  >
                    <span>Load More Mosques ({filteredList.length - visibleCount} remaining)</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
