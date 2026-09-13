import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, MapPin } from 'lucide-react';
import { Coordinates, Masjid } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface QiblaCompassProps {
  selectedMasjid: Masjid;
}

/**
 * Calculates Qibla direction in degrees from True North to Kaaba (21.4225, 39.8262)
 */
export function calculateQiblaAngle(coords: Coordinates): number {
  const kaabaLat = (21.4225 * Math.PI) / 180.0;
  const kaabaLng = (39.8262 * Math.PI) / 180.0;
  const userLat = (coords.latitude * Math.PI) / 180.0;
  const userLng = (coords.longitude * Math.PI) / 180.0;

  const dLng = kaabaLng - userLng;

  const y = Math.sin(dLng);
  const x = Math.cos(userLat) * Math.tan(kaabaLat) - Math.sin(userLat) * Math.cos(dLng);

  let qiblaRad = Math.atan2(y, x);
  let qiblaDeg = (qiblaRad * 180.0) / Math.PI;
  return Math.round(((qiblaDeg % 360) + 360) % 360);
}

export const QiblaCompass: React.FC<QiblaCompassProps> = ({ selectedMasjid }) => {
  const { t, getMasjidName } = useLanguage();
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);

  const qiblaAngle = calculateQiblaAngle(selectedMasjid.coordinates);

  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        // e.alpha represents the rotation around z axis
        // For iOS devices with webkitCompassHeading
        const heading = (e as unknown as { webkitCompassHeading?: number }).webkitCompassHeading !== undefined
          ? (e as unknown as { webkitCompassHeading: number }).webkitCompassHeading
          : 360 - e.alpha;
        setDeviceHeading(Math.round(heading));
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  // Pointer angle
  const compassRotation = deviceHeading !== null ? -deviceHeading : 0;
  const pointerRotation = deviceHeading !== null ? qiblaAngle - deviceHeading : qiblaAngle;

  return (
    <div className="max-w-md mx-auto space-y-5 pb-20 text-center">
      {/* Header card */}
      <div className="rounded-3xl bg-gradient-to-b from-[#063826] to-[#04281b] border border-emerald-500/30 p-5 shadow-xl">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-600/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 mb-3 shadow-glow">
          <Compass className="w-6 h-6 animate-spin-slow" />
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          {t.qiblaTitle}
        </h2>
        <p className="text-xs text-emerald-300/80 mt-1">
          {t.qiblaHeading}
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-xs text-emerald-200">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>{getMasjidName(selectedMasjid)} ({selectedMasjid.city})</span>
        </div>
      </div>

      {/* Compass Dial Card */}
      <div className="rounded-3xl bg-slate-900/80 border border-emerald-500/30 p-6 shadow-2xl backdrop-blur-md relative overflow-hidden flex flex-col items-center">
        {/* Degree Readout */}
        <div className="mb-6">
          <span className="text-4xl font-extrabold text-amber-300 font-mono tracking-wider">
            {qiblaAngle}°
          </span>
          <span className="text-xs text-slate-400 block mt-0.5">
            {t.degreesFromNorth}
          </span>
        </div>

        {/* Visual Compass Ring */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-emerald-500/30 bg-gradient-to-br from-emerald-950/90 via-[#032014] to-slate-950 p-2 shadow-2xl flex items-center justify-center">
          {/* Compass Rose Markings (N, E, S, W) */}
          <div 
            className="absolute inset-0 rounded-full transition-transform duration-300"
            style={{ transform: `rotate(${compassRotation}deg)` }}
          >
            <span className="absolute top-2 left-1/2 -translate-x-1/2 font-bold text-rose-400 text-sm">N</span>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">E</span>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 font-bold text-slate-400 text-sm">S</span>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">W</span>

            {/* Subtle tick marks */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <div
                key={deg}
                className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-emerald-500/40 origin-bottom"
                style={{
                  height: deg % 90 === 0 ? '12px' : '6px',
                  transform: `rotate(${deg}deg) translateY(6px)`,
                  transformOrigin: '0 120px',
                }}
              />
            ))}
          </div>

          {/* Qibla Direction Needle */}
          <div
            className="absolute inset-0 flex items-center justify-center transition-transform duration-500 ease-out pointer-events-none"
            style={{ transform: `rotate(${pointerRotation}deg)` }}
          >
            {/* Kaaba Golden Pointer Indicator */}
            <div className="flex flex-col items-center -translate-y-20">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-glow-gold flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300/30" />
                </div>
              </div>
              <div className="w-0.5 h-12 bg-gradient-to-t from-transparent via-amber-400 to-amber-300 mt-1" />
            </div>

            {/* Opposite tail needle */}
            <div className="absolute w-1.5 h-12 bg-slate-700/60 rounded-full translate-y-16" />

            {/* Center Pivot Pin */}
            <div className="w-6 h-6 rounded-full bg-amber-400 border-4 border-slate-950 shadow-md z-10" />
          </div>
        </div>

        {/* Instructions */}
        <p className="text-xs text-slate-400 max-w-xs mt-6 leading-relaxed">
          {t.qiblaInstruction}
        </p>
      </div>
    </div>
  );
};
