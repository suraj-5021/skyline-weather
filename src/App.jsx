import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import WeatherEffects from './components/Layout/WeatherEffects';
import SearchBar from './components/Search/SearchBar';
import ThemeToggle from './components/UI/ThemeToggle';
import SettingsModal from './components/UI/SettingsModal';
import CurrentWeather from './components/Weather/CurrentWeather';
import WeatherMetrics from './components/Weather/WeatherMetrics';
import HourlyForecast from './components/Weather/HourlyForecast';
import DailyForecast from './components/Weather/DailyForecast';
import WeatherCharts from './components/Analytics/WeatherCharts';
import LoadingSkeleton from './components/UI/LoadingSkeleton';
import AboutProject from './components/About/AboutProject';
import { CloudSun, AlertCircle, Sun, CloudRain, Snowflake, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function AppContent() {
  const { weatherData, loading, error, executeSearch, refetchWeather } = useWeather();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleQuickCityClick = (city) => {
    executeSearch(city);
  };

  const quickCities = [
    { name: 'London', icon: <CloudRain className="w-4 h-4 text-blue-500" /> },
    { name: 'New York', icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { name: 'Tokyo', icon: <Sun className="w-4 h-4 text-amber-500" /> },
    { name: 'Sydney', icon: <CloudRain className="w-4 h-4 text-blue-500" /> },
    { name: 'Reykjavik', icon: <Snowflake className="w-4 h-4 text-sky-400" /> }
  ];

  return (
    <div className="relative min-h-screen pb-12 transition-colors duration-500 select-none">
      {/* Backdrop overlay for search focus */}
      <AnimatePresence>
        {isSearchFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSearchFocused(false)}
            className="fixed inset-0 bg-slate-950/25 backdrop-blur-[4px] z-[9990] pointer-events-auto"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Dynamic weather-based background & particle overlay */}
      <WeatherEffects />

      {/* Global Application Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Navigation & Header */}
        <header className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-glass border border-white/20 dark:border-white/10 shadow-lg overflow-visible transition-all duration-300 ${
          isSearchFocused ? 'relative z-[9995] ring-1 ring-sky-500/20 shadow-2xl' : 'relative z-[10]'
        }`}>
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleQuickCityClick('New York')}>
            <div className="p-2 bg-sky-500 text-white rounded-2xl shadow-md">
              <CloudSun className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-slate-800 dark:text-white leading-none">
                SKYLINE
              </h1>
              <span className="text-[10px] font-extrabold text-sky-500 uppercase tracking-widest pl-0.5">
                Weather
              </span>
            </div>
          </div>

          {/* Search bar component */}
          <div className="w-full sm:max-w-md">
            <SearchBar onFocusChange={setIsSearchFocused} isSearchFocused={isSearchFocused} />
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 rounded-xl bg-glass bg-glass-hover text-slate-800 dark:text-slate-100 transition-all duration-300 shadow-sm outline-none border border-white/10"
              aria-label="Open API settings"
              title="API Configuration"
            >
              <Settings className="w-5 h-5 hover:rotate-45 transition-transform duration-300" />
            </button>
            <ThemeToggle />
          </div>
        </header>

        {/* Quick Suggestion Chips */}
        <AnimatePresence>
          {!isSearchFocused && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto py-1 overflow-hidden"
            >
              {quickCities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => handleQuickCityClick(city.name)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-glass bg-glass-hover text-slate-700 dark:text-slate-200 border border-white/10 rounded-full shadow-sm hover:-translate-y-0.5 transition-all outline-none"
                >
                  {city.icon}
                  <span>{city.name}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notifications / Errors */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-xl mx-auto p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 font-bold text-xs sm:text-sm shadow-md"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dashboard Panels */}
        <main className={`min-h-[500px] transition-all duration-500 ${
          isSearchFocused ? 'opacity-20 blur-[1px] pointer-events-none scale-[0.99] translate-y-1' : 'opacity-100 blur-0'
        }`}>
          {loading && !weatherData ? (
            <LoadingSkeleton />
          ) : weatherData ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Left Column - Current Weather Summary */}
              <div className="lg:col-span-1 space-y-6">
                <CurrentWeather />
                <DailyForecast />
              </div>

              {/* Right Column - Secondary parameters, hour breakdown, charts */}
              <div className="lg:col-span-2 space-y-6">
                <WeatherMetrics />
                <HourlyForecast />
                <WeatherCharts />
              </div>

            </div>
          ) : (
            // Landing state if no data available
            <div className="text-center py-20 bg-glass border border-white/15 rounded-3xl space-y-4 max-w-xl mx-auto">
              <CloudSun className="w-16 h-16 text-sky-500 mx-auto animate-bounce" />
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">Welcome to Skyline Weather</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 px-8">
                Search for a city above or use your current location to display detailed SaaS weather analytics and forecasts.
              </p>
            </div>
          )}
        </main>

        {/* Portfolio Enhancement Info */}
        <div className={`transition-all duration-500 ${
          isSearchFocused ? 'opacity-20 blur-[1px] pointer-events-none' : 'opacity-100 blur-0'
        }`}>
          <AboutProject />
        </div>

        {/* Settings Configuration Modal */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onKeyChange={refetchWeather}
        />

      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <WeatherProvider>
        <AppContent />
      </WeatherProvider>
    </ThemeProvider>
  );
}
