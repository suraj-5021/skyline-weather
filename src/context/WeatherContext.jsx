import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchWeatherData } from '../services/weatherService';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useTheme } from './ThemeContext';

const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const { setWeatherTheme } = useTheme();
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Default favorite cities to populate initially
  const [favorites, setFavorites] = useLocalStorage('skyline_favorites', ['London', 'New York', 'Tokyo']);
  const [recentSearches, setRecentSearches] = useLocalStorage('skyline_history', []);

  // Set the theme based on current weather conditions
  const updateThemeFromWeather = (data) => {
    if (!data) return;
    
    let theme = data.current.conditionType;
    
    // Determine if it is night at the location
    // We check localtime (format: "21:30" or "09:15") or parse current hour
    try {
      const localtime = data.location.localtime;
      let hour = 12; // fallback mid-day
      
      if (localtime) {
        // Handle "21:30" or "9:30 PM"
        const parts = localtime.split(':');
        hour = parseInt(parts[0], 10);
        
        if (localtime.toLowerCase().includes('pm') && hour < 12) {
          hour += 12;
        } else if (localtime.toLowerCase().includes('am') && hour === 12) {
          hour = 0;
        }
      }
      
      const isNight = hour < 6 || hour >= 19;
      
      if (isNight) {
        // If it's clear or just slightly cloudy, use the night theme.
        // For heavy rain/snow/storms, keep those themes since they have dark mode styling
        if (theme === 'sunny' || theme === 'cloudy') {
          theme = 'night';
        }
      }
    } catch (e) {
      console.warn("Could not parse localtime for theme adjustment, using default weather condition", e);
    }
    
    setWeatherTheme(theme);
  };

  const executeSearch = async (query) => {
    if (!query || query.trim() === '') return;
    
    setLoading(true);
    setError(null);
    setSearchQuery(query);
    
    try {
      const data = await fetchWeatherData(query);
      setWeatherData(data);
      updateThemeFromWeather(data);

      // Add to search history
      setRecentSearches(prev => {
        const cleanName = data.location.name;
        const filtered = prev.filter(item => item.toLowerCase() !== cleanName.toLowerCase());
        return [cleanName, ...filtered].slice(0, 5); // keep last 5 searches
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data. Please try another location.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (cityName) => {
    if (!cityName) return;
    
    setFavorites(prev => {
      const isFav = prev.some(name => name.toLowerCase() === cityName.toLowerCase());
      if (isFav) {
        return prev.filter(name => name.toLowerCase() !== cityName.toLowerCase());
      } else {
        // Capitalize first letter for consistency
        const formatted = cityName.charAt(0).toUpperCase() + cityName.slice(1);
        return [...prev, formatted];
      }
    });
  };

  const deleteRecentSearch = (cityName) => {
    setRecentSearches(prev => prev.filter(name => name.toLowerCase() !== cityName.toLowerCase()));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Attempt to load user's current location on startup
  const fetchCurrentLocationWeather = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        executeSearch(`${latitude},${longitude}`);
      },
      (err) => {
        let msg = 'Geolocation permission denied.';
        if (err.code === 2) msg = 'Location unavailable.';
        if (err.code === 3) msg = 'Location request timed out.';
        
        setError(`${msg} Loading default city...`);
        // Fallback to first favorite or New York
        const fallbackCity = favorites.length > 0 ? favorites[0] : 'New York';
        executeSearch(fallbackCity);
      },
      { timeout: 10000 }
    );
  };

  const refetchWeather = () => {
    const activeCity = weatherData?.location?.name || searchQuery;
    if (activeCity) {
      executeSearch(activeCity);
    }
  };

  // Run on mount to load initial city
  useEffect(() => {
    const defaultCity = favorites.length > 0 ? favorites[0] : 'New York';
    executeSearch(defaultCity);
  }, []);

  return (
    <WeatherContext.Provider value={{
      weatherData,
      loading,
      error,
      searchQuery,
      favorites,
      recentSearches,
      executeSearch,
      refetchWeather,
      toggleFavorite,
      deleteRecentSearch,
      clearRecentSearches,
      fetchCurrentLocationWeather
    }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}
