import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { Droplets, Wind, Compass, Gauge, Eye, SunDim, Sunrise, Sunset } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WeatherMetrics() {
  const { weatherData } = useWeather();

  if (!weatherData) return null;

  const { current } = weatherData;

  // Determine UV index level text
  const getUVLevel = (uv) => {
    if (uv <= 2) return 'Low';
    if (uv <= 5) return 'Moderate';
    if (uv <= 7) return 'High';
    if (uv <= 10) return 'Very High';
    return 'Extreme';
  };

  const getUVColor = (uv) => {
    if (uv <= 2) return 'text-emerald-500';
    if (uv <= 5) return 'text-amber-500';
    if (uv <= 7) return 'text-orange-500';
    if (uv <= 10) return 'text-red-500';
    return 'text-purple-500';
  };

  // Determine Humidity description
  const getHumidityDesc = (humidity) => {
    if (humidity < 30) return 'Dry air';
    if (humidity <= 60) return 'Comfortable';
    if (humidity <= 80) return 'Humid';
    return 'Very sticky';
  };

  const metrics = [
    {
      title: 'Wind Status',
      value: `${current.wind_kph} km/h`,
      icon: <Wind className="w-5 h-5 text-sky-500" />,
      sub: (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Compass className="w-3.5 h-3.5" />
          <span>Direction: {current.wind_dir}</span>
        </div>
      ),
      bgGlow: 'from-sky-500/10 to-transparent'
    },
    {
      title: 'Humidity',
      value: `${current.humidity}%`,
      icon: <Droplets className="w-5 h-5 text-blue-500" />,
      sub: <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{getHumidityDesc(current.humidity)}</span>,
      bgGlow: 'from-blue-500/10 to-transparent'
    },
    {
      title: 'UV Index',
      value: current.uv,
      icon: <SunDim className="w-5 h-5 text-amber-500" />,
      sub: (
        <span className={`text-xs font-bold ${getUVColor(current.uv)}`}>
          {getUVLevel(current.uv)}
        </span>
      ),
      bgGlow: 'from-amber-500/10 to-transparent'
    },
    {
      title: 'Air Pressure',
      value: `${current.pressure_mb} hPa`,
      icon: <Gauge className="w-5 h-5 text-emerald-500" />,
      sub: <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Standard: 1013 hPa</span>,
      bgGlow: 'from-emerald-500/10 to-transparent'
    },
    {
      title: 'Visibility',
      value: `${current.vis_km} km`,
      icon: <Eye className="w-5 h-5 text-violet-500" />,
      sub: <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{current.vis_km >= 10 ? 'Excellent visibility' : 'Partial visibility'}</span>,
      bgGlow: 'from-violet-500/10 to-transparent'
    },
    {
      title: 'Sunrise & Sunset',
      value: current.sunrise,
      icon: <Sunrise className="w-5 h-5 text-orange-500" />,
      sub: (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Sunset className="w-3.5 h-3.5 text-rose-500" />
          <span>Sunset: {current.sunset}</span>
        </div>
      ),
      bgGlow: 'from-orange-500/10 to-transparent'
    }
  ];

  // Container variants for staggered cards
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 150, damping: 14 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
    >
      {metrics.map((m, idx) => (
        <motion.div
          key={m.title}
          variants={itemVariants}
          className="relative p-4 sm:p-5 rounded-2xl bg-glass border border-white/20 dark:border-white/10 overflow-hidden shadow-md flex flex-col justify-between min-h-[120px] sm:min-h-[135px] group hover:border-sky-500/30 dark:hover:border-sky-500/20 transition-all duration-300 bg-glass-hover"
        >
          {/* Ambient Glow */}
          <div className={`absolute -inset-1 bg-gradient-to-br ${m.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

          <div className="flex items-center gap-1.5 sm:gap-2.5 z-10">
            <div className="p-1.5 sm:p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 group-hover:scale-110 transition-transform duration-300">
              {m.icon}
            </div>
            <span className="text-[11px] sm:text-sm font-bold text-slate-500 dark:text-slate-400">
              {m.title}
            </span>
          </div>

          <div className="space-y-0.5 sm:space-y-1 mt-3 sm:mt-4 z-10">
            <h3 className="text-lg sm:text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
              {m.value}
            </h3>
            {m.sub}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
