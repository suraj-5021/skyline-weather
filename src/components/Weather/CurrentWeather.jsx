import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import WeatherIcon from '../UI/WeatherIcon';
import { Star, MapPin, Calendar, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CurrentWeather() {
  const { weatherData, favorites, toggleFavorite } = useWeather();

  if (!weatherData) return null;

  const { location, current, isMock } = weatherData;
  const isFavorite = favorites.some(name => name.toLowerCase() === location.name.toLowerCase());

  // Format local date for display
  const getFormattedDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative p-6 sm:p-8 rounded-3xl bg-glass border border-white/20 dark:border-white/10 flex flex-col justify-between overflow-hidden shadow-xl min-h-[380px]"
    >
      {/* Background soft glow based on condition */}
      <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Header Info */}
      <div className="space-y-3 z-10">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1 truncate">
            <div className="flex items-center gap-1.5 text-slate-800 dark:text-white">
              <MapPin className="w-5 h-5 text-sky-500 shrink-0" />
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight truncate">
                {location.name}
              </h2>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 pl-6 uppercase tracking-wider">
              {location.country}
            </p>
          </div>
          
          <button
            onClick={() => toggleFavorite(location.name)}
            className={`p-2.5 rounded-xl border transition-all duration-300 ${
              isFavorite 
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-500' 
                : 'bg-glass border-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
            }`}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
          >
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-amber-500' : ''}`} />
          </button>
        </div>

        {/* Date / Time */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 pl-1 pt-1">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{getFormattedDate()}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Local Time: {location.localtime}</span>
          </div>
        </div>
      </div>

      {/* Temperature and Icon */}
      <div className="flex justify-between items-end mt-8 z-10">
        <WeatherIcon 
          type={current.conditionType} 
          className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-[0_8px_16px_rgba(0,0,0,0.1)]" 
        />
        
        <div className="text-right">
          <div className="flex justify-end items-start">
            <span className="text-6xl sm:text-7xl font-extrabold tracking-tighter text-slate-900 dark:text-white">
              {current.temp_c}
            </span>
            <span className="text-3xl sm:text-4xl font-bold text-sky-500 mt-1">°C</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 capitalize mt-1">
            {current.condition.text}
          </p>
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-slate-200/50 dark:border-white/5 pt-4 mt-8 flex justify-between items-center text-sm z-10">
        <div className="text-slate-500 dark:text-slate-400 font-medium">
          Feels like <span className="font-bold text-slate-800 dark:text-slate-200">{current.feelslike_c}°C</span>
        </div>
      </div>
    </motion.div>
  );
}
