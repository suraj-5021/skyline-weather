import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import WeatherIcon from '../UI/WeatherIcon';
import { Droplet } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HourlyForecast() {
  const { weatherData } = useWeather();

  if (!weatherData) return null;

  const { forecast } = weatherData;

  // Format hour label for display (e.g. "00:00" -> "12 AM", "14:00" -> "2 PM")
  const formatHourLabel = (timeStr) => {
    try {
      const hourVal = parseInt(timeStr.split(':')[0], 10);
      const ampm = hourVal >= 12 ? 'PM' : 'AM';
      const displayHour = hourVal % 12 === 0 ? 12 : hourVal % 12;
      return `${displayHour} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="p-5 sm:p-6 rounded-3xl bg-glass border border-white/20 dark:border-white/10 shadow-xl overflow-hidden"
    >
      <h3 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-white mb-4 tracking-tight flex items-center gap-2">
        <span className="w-2 h-4 bg-sky-500 rounded-full inline-block" />
        Hourly Forecast (Next 24 Hours)
      </h3>

      <div className="flex gap-4 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {forecast.hourly.map((hour, idx) => {
          const isCurrentHour = idx === 0;
          return (
            <motion.div
              key={`${hour.time}-${idx}`}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`min-w-[95px] flex-1 p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-between text-center gap-2 ${
                isCurrentHour
                  ? 'bg-sky-500/25 border-sky-500/40 text-slate-900 dark:text-white font-bold shadow-lg shadow-sky-500/5'
                  : 'bg-glass-card border-white/5 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className={`text-xs ${isCurrentHour ? 'text-sky-600 dark:text-sky-300 font-extrabold' : 'font-semibold text-slate-400 dark:text-slate-500'}`}>
                {isCurrentHour ? 'Now' : formatHourLabel(hour.time)}
              </span>

              <WeatherIcon
                type={hour.condition.text.includes('rain') || hour.condition.text.includes('shower') ? 'rainy' : 
                      hour.condition.text.includes('snow') ? 'snowy' : 
                      hour.condition.text.includes('thunder') ? 'stormy' : 
                      hour.condition.text.includes('sunny') || hour.condition.text.includes('clear') ? (hour.time.localeCompare("06:00") >= 0 && hour.time.localeCompare("19:00") < 0 ? 'sunny' : 'night') : 'cloudy'}
                className="w-10 h-10 my-1 drop-shadow-sm"
              />

              <span className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-white tracking-tight">
                {hour.temp_c}°
              </span>

              {/* Rain Chance */}
              <div className="flex items-center gap-0.5 text-[10px] font-bold h-4">
                {hour.pop > 0 ? (
                  <>
                    <Droplet className="w-3 h-3 text-sky-500 fill-sky-500/20" />
                    <span className="text-sky-500 dark:text-sky-400">{hour.pop}%</span>
                  </>
                ) : (
                  <span className="text-slate-400/50 dark:text-slate-600">-</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
