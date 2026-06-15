import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Default to dark mode for the premium dashboard aesthetic
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('dark_mode');
      return saved ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [weatherTheme, setWeatherTheme] = useState('sunny'); // sunny, rainy, cloudy, snowy, stormy, night

  useEffect(() => {
    try {
      localStorage.setItem('dark_mode', JSON.stringify(darkMode));
    } catch (e) {
      console.warn("Could not save dark mode preference", e);
    }
    
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Return the CSS gradient class for the background based on theme state
  const getThemeGradient = () => {
    if (darkMode) {
      switch (weatherTheme) {
        case 'sunny':
          return 'from-slate-950 via-amber-950/20 to-slate-950';
        case 'rainy':
          return 'from-slate-950 via-blue-950/30 to-indigo-950/20';
        case 'cloudy':
          return 'from-slate-950 via-slate-800/20 to-slate-950';
        case 'snowy':
          return 'from-slate-950 via-sky-900/20 to-indigo-950/30';
        case 'stormy':
          return 'from-slate-950 via-zinc-900/40 to-slate-950';
        case 'night':
          return 'from-slate-950 via-indigo-950/40 to-black';
        default:
          return 'from-slate-950 via-slate-900 to-slate-950';
      }
    } else {
      // Light Mode Gradients
      switch (weatherTheme) {
        case 'sunny':
          return 'from-amber-100 via-orange-100/60 to-amber-200/50';
        case 'rainy':
          return 'from-sky-100 via-slate-200/80 to-blue-200/50';
        case 'cloudy':
          return 'from-slate-100 via-zinc-100 to-slate-200/70';
        case 'snowy':
          return 'from-sky-50/70 via-blue-100/50 to-indigo-100/40';
        case 'stormy':
          return 'from-slate-200 via-zinc-200 to-slate-300/60';
        case 'night':
          return 'from-indigo-100 via-slate-200 to-indigo-200/50';
        default:
          return 'from-blue-50 via-slate-50 to-blue-100/50';
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ 
      darkMode, 
      toggleDarkMode, 
      weatherTheme, 
      setWeatherTheme,
      getThemeGradient
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
