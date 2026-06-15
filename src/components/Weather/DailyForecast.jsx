import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import WeatherIcon from '../UI/WeatherIcon';
import { motion } from 'framer-motion';

export default function DailyForecast() {
  const { weatherData } = useWeather();

  if (!weatherData) return null;

  const { forecast } = weatherData;

  // Apple Weather style temperature range bar calculation
  const allTemps = forecast.daily.flatMap(d => [d.minTemp, d.maxTemp]);
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const globalRange = globalMax - globalMin || 1; // avoid divide by zero

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 120, damping: 15 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="p-4 sm:p-6 rounded-3xl bg-glass border border-white/20 dark:border-white/10 shadow-xl"
    >
      <h3 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-white mb-4 tracking-tight flex items-center gap-2">
        <span className="w-2 h-4 bg-sky-500 rounded-full inline-block" />
        7-Day Forecast
      </h3>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-3.5"
      >
        {forecast.daily.map((day, idx) => {
          // Calculate proportional offsets for the temp slider bar
          const leftPercent = ((day.minTemp - globalMin) / globalRange) * 100;
          const widthPercent = ((day.maxTemp - day.minTemp) / globalRange) * 100;

          return (
            <motion.div
              key={day.date}
              variants={itemVariants}
              className="flex items-center justify-between gap-4 py-2.5 px-3 rounded-2xl hover:bg-white/5 dark:hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/5 group"
            >
              {/* Day Name */}
              <div className="w-16 sm:w-24 shrink-0">
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-500 transition-colors">
                  {day.day}
                </span>
              </div>

              {/* Icon */}
              <div className="shrink-0 flex items-center justify-center">
                <WeatherIcon type={day.conditionType} className="w-10 h-10 drop-shadow-sm" />
              </div>

              {/* Condition Label (Hidden on small screens) */}
              <div className="hidden md:block flex-1 pl-4 truncate">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 capitalize">
                  {day.condition.text}
                </span>
              </div>

              {/* Temperature Range Bar Visualizer */}
              <div className="flex items-center gap-1.5 sm:gap-3 w-28 sm:w-44 shrink-0 text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="w-8 text-right font-medium text-slate-400 dark:text-slate-500">
                  {day.minTemp}°
                </span>
                
                {/* Visual bar container */}
                <div className="relative flex-1 h-2 bg-slate-200/50 dark:bg-slate-800/60 rounded-full overflow-hidden">
                  <div
                    style={{
                      left: `${leftPercent}%`,
                      width: `${Math.max(10, widthPercent)}%`
                    }}
                    className="absolute h-full bg-gradient-to-r from-sky-400 to-amber-400 rounded-full"
                  />
                </div>
                
                <span className="w-8 text-left font-extrabold text-slate-900 dark:text-white">
                  {day.maxTemp}°
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
