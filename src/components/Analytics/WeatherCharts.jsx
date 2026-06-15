import React, { useState } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { useTheme } from '../../context/ThemeContext';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Thermometer, Droplet, Wind, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WeatherCharts() {
  const { weatherData } = useWeather();
  const { darkMode } = useTheme();
  const [activeChart, setActiveChart] = useState('temp'); // 'temp' | 'humidity' | 'wind'

  if (!weatherData) return null;

  const { forecast } = weatherData;
  const data = forecast.hourly;

  // Format hour label for chart X-axis
  const formatXAxis = (timeStr) => {
    try {
      const hourVal = parseInt(timeStr.split(':')[0], 10);
      const ampm = hourVal >= 12 ? 'PM' : 'AM';
      const displayHour = hourVal % 12 === 0 ? 12 : hourVal % 12;
      return `${displayHour} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  // Glassmorphic Custom Tooltip for Recharts
  const CustomTooltip = ({ active, payload, label, unit }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-white/10 rounded-xl shadow-xl text-xs font-semibold">
          <p className="text-slate-400 dark:text-slate-500 mb-1">{`Time: ${formatXAxis(label)}`}</p>
          <p className="text-slate-900 dark:text-white flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            <span>{`${payload[0].name}: `}</span>
            <span className="font-extrabold text-sm text-sky-500">{`${payload[0].value}${unit}`}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const chartThemes = {
    grid: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
    text: darkMode ? '#94a3b8' : '#64748b'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="p-5 sm:p-6 rounded-3xl bg-glass border border-white/20 dark:border-white/10 shadow-xl space-y-6"
    >
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
          <span className="w-2 h-4 bg-sky-500 rounded-full inline-block" />
          Weather Analytics
        </h3>

        {/* Tab Selection buttons */}
        <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200/50 dark:border-white/5 self-start sm:self-auto text-xs font-bold">
          <button
            onClick={() => setActiveChart('temp')}
            className={`flex items-center gap-1.5 py-2 px-3 rounded-lg transition-all ${
              activeChart === 'temp'
                ? 'bg-white dark:bg-slate-800 text-sky-500 dark:text-sky-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temperature</span>
          </button>
          
          <button
            onClick={() => setActiveChart('humidity')}
            className={`flex items-center gap-1.5 py-2 px-3 rounded-lg transition-all ${
              activeChart === 'humidity'
                ? 'bg-white dark:bg-slate-800 text-sky-500 dark:text-sky-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" />
            <span>Humidity</span>
          </button>

          <button
            onClick={() => setActiveChart('wind')}
            className={`flex items-center gap-1.5 py-2 px-3 rounded-lg transition-all ${
              activeChart === 'wind'
                ? 'bg-white dark:bg-slate-800 text-sky-500 dark:text-sky-400 shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Wind Speed</span>
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          {activeChart === 'temp' ? (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="100%">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartThemes.grid} vertical={false} />
              <XAxis 
                dataKey="time" 
                tickFormatter={formatXAxis} 
                stroke={chartThemes.text} 
                fontSize={10} 
                fontWeight={600}
                dy={10} 
                tickLine={false}
              />
              <YAxis 
                stroke={chartThemes.text} 
                fontSize={10} 
                fontWeight={600}
                dx={-5} 
                tickLine={false} 
                axisLine={false} 
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              <Tooltip content={<CustomTooltip unit="°C" />} />
              <Area
                type="monotone"
                dataKey="temp_c"
                name="Temperature"
                stroke="#0284c7"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#tempGradient)"
              />
            </AreaChart>
          ) : activeChart === 'humidity' ? (
            <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartThemes.grid} vertical={false} />
              <XAxis 
                dataKey="time" 
                tickFormatter={formatXAxis} 
                stroke={chartThemes.text} 
                fontSize={10} 
                fontWeight={600}
                dy={10} 
                tickLine={false}
              />
              <YAxis 
                stroke={chartThemes.text} 
                fontSize={10} 
                fontWeight={600}
                dx={-5} 
                tickLine={false} 
                axisLine={false}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip unit="%" />} />
              <Line
                type="monotone"
                dataKey="humidity"
                name="Humidity"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
              />
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartThemes.grid} vertical={false} />
              <XAxis 
                dataKey="time" 
                tickFormatter={formatXAxis} 
                stroke={chartThemes.text} 
                fontSize={10} 
                fontWeight={600}
                dy={10} 
                tickLine={false}
              />
              <YAxis 
                stroke={chartThemes.text} 
                fontSize={10} 
                fontWeight={600}
                dx={-5} 
                tickLine={false} 
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip unit=" km/h" />} />
              <Bar 
                dataKey="wind_kph" 
                name="Wind Speed" 
                fill="#0d9488" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={20}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
