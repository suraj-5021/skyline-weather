import React, { useState, useEffect, useRef } from 'react';
import { useWeather } from '../../context/WeatherContext';
import { fetchSuggestions } from '../../services/weatherService';
import { Search, MapPin, X, Star, History, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchBar({ onFocusChange, isSearchFocused }) {
  const { 
    executeSearch, 
    fetchCurrentLocationWeather, 
    loading,
    favorites,
    recentSearches,
    deleteRecentSearch,
    clearRecentSearches
  } = useWeather();

  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [activeTab, setActiveTab] = useState('suggestions'); // 'suggestions' | 'recent' | 'favorites'
  const dropdownRef = useRef(null);

  // Debounced suggestion fetching
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (input.trim().length >= 2) {
        setLoadingSuggestions(true);
        try {
          const list = await fetchSuggestions(input);
          setSuggestions(list);
          setActiveTab('suggestions');
        } catch (e) {
          console.error("Error fetching suggestions", e);
        } finally {
          setLoadingSuggestions(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [input]);

  // Click outside detection
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        if (onFocusChange) onFocusChange(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onFocusChange]);

  // Sync dropdown visibility with parent focus state
  useEffect(() => {
    if (!isSearchFocused) {
      setShowDropdown(false);
    }
  }, [isSearchFocused]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      executeSearch(input.trim());
      setShowDropdown(false);
      if (onFocusChange) onFocusChange(false);
    }
  };

  const handleSuggestionClick = (name, country) => {
    const query = `${name}, ${country}`;
    executeSearch(query);
    setInput(name);
    setShowDropdown(false);
    if (onFocusChange) onFocusChange(false);
  };

  const handleClear = () => {
    setInput('');
    setSuggestions([]);
  };

  // Highlights matched letters in suggestions
  const highlightMatch = (text, match) => {
    if (!match) return <span>{text}</span>;
    
    // Split on match query case-insensitively, keeping the matches
    const parts = text.split(new RegExp(`(${match.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === match.toLowerCase() ? (
            <span key={i} className="text-sky-500 dark:text-sky-400 font-extrabold">{part}</span>
          ) : (
            <span key={i} className="text-slate-800 dark:text-slate-200 font-medium">{part}</span>
          )
        )}
      </span>
    );
  };

  return (
    <div className="relative w-full max-w-xl mx-auto" ref={dropdownRef}>
      <form onSubmit={handleSearchSubmit} className="relative flex items-center">
        <div className="absolute left-4 text-slate-400 dark:text-slate-400">
          <Search className="w-5 h-5" />
        </div>
        
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowDropdown(true);
            if (onFocusChange) onFocusChange(true);
          }}
          onFocus={() => {
            setShowDropdown(true);
            if (onFocusChange) onFocusChange(true);
          }}
          placeholder="Search city (e.g. Paris, Tokyo, London)..."
          className="w-full pl-12 pr-24 py-3.5 bg-glass dark:bg-slate-900/50 border border-white/20 dark:border-white/10 rounded-2xl text-slate-805 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all duration-300 shadow-lg text-sm sm:text-base font-semibold"
          aria-label="Search city name"
        />

        <div className="absolute right-3 flex items-center gap-1">
          {input && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 transition-colors"
              aria-label="Clear search text"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          <button
            type="button"
            onClick={fetchCurrentLocationWeather}
            disabled={loading}
            className="p-2 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-500/50 text-white rounded-xl shadow-md transition-colors outline-none"
            title="Use current location"
            aria-label="Find my current location weather"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>

      {/* Auto-suggestions & Searches Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            className="absolute left-0 right-0 z-[99999] w-full mt-2 bg-white/95 dark:bg-slate-900/98 backdrop-blur-3xl border border-slate-200 dark:border-white/15 rounded-2xl shadow-2xl overflow-hidden text-sm max-h-[380px] flex flex-col"
          >
            {/* Tab Header for searches history, suggestions, and favorites */}
            <div className="flex border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-950/20 text-slate-500 dark:text-slate-400 font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('suggestions')}
                className={`flex-1 py-3 px-4 text-center border-b-2 transition-all ${
                  activeTab === 'suggestions' 
                    ? 'border-sky-500 text-sky-500 dark:text-sky-400 bg-white/50 dark:bg-white/5' 
                    : 'border-transparent hover:text-slate-700 dark:hover:text-slate-205'
                }`}
              >
                Suggestions
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('favorites')}
                className={`flex-1 py-3 px-4 text-center border-b-2 transition-all ${
                  activeTab === 'favorites' 
                    ? 'border-sky-500 text-sky-500 dark:text-sky-400 bg-white/50 dark:bg-white/5' 
                    : 'border-transparent hover:text-slate-700 dark:hover:text-slate-205'
                }`}
              >
                Favorites ({favorites.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('recent')}
                className={`flex-1 py-3 px-4 text-center border-b-2 transition-all ${
                  activeTab === 'recent' 
                    ? 'border-sky-500 text-sky-500 dark:text-sky-400 bg-white/50 dark:bg-white/5' 
                    : 'border-transparent hover:text-slate-700 dark:hover:text-slate-205'
                }`}
              >
                Recent
              </button>
            </div>

            {/* Tab Content */}
            <div className="overflow-y-auto p-2 flex-1 scrollbar-thin">
              {activeTab === 'suggestions' && (
                <div>
                  {loadingSuggestions ? (
                    <div className="py-8 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-500">
                      <Loader2 className="w-5 h-5 animate-spin text-sky-500" />
                      <span className="font-semibold text-xs">Searching locations...</span>
                    </div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((item, idx) => (
                      <button
                        key={`${item.name}-${idx}`}
                        type="button"
                        onClick={() => handleSuggestionClick(item.name, item.country)}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-left text-slate-700 dark:text-slate-300 transition-colors font-medium outline-none"
                      >
                        <Search className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="truncate text-xs sm:text-sm">
                          {highlightMatch(item.name, input)}, <span className="text-slate-450 dark:text-slate-500">{item.country}</span>
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="py-8 text-center text-slate-400 dark:text-slate-550 font-semibold">
                      {input.length < 2 ? 'Type at least 2 characters...' : 'No locations found.'}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'favorites' && (
                <div>
                  {favorites.length > 0 ? (
                    favorites.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          executeSearch(city);
                          setInput(city);
                          setShowDropdown(false);
                          if (onFocusChange) onFocusChange(false);
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-left text-slate-800 dark:text-slate-200 transition-colors font-medium outline-none"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                          <span className="font-semibold truncate">{city}</span>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="py-8 text-center text-slate-400 dark:text-slate-550 font-semibold">
                      No saved favorite cities.
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'recent' && (
                <div>
                  {recentSearches.length > 0 ? (
                    <div>
                      <div className="flex justify-between items-center px-4 py-1.5 text-xs font-bold text-slate-405 dark:text-slate-500 uppercase tracking-wider">
                        <span>Searches</span>
                        <button 
                          type="button" 
                          onClick={clearRecentSearches}
                          className="hover:text-red-500 transition-colors font-bold normal-case text-[11px]"
                        >
                          Clear all
                        </button>
                      </div>
                      {recentSearches.map((city) => (
                        <div
                          key={city}
                          className="group w-full flex items-center justify-between px-4 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 transition-colors font-medium"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              executeSearch(city);
                              setInput(city);
                              setShowDropdown(false);
                              if (onFocusChange) onFocusChange(false);
                            }}
                            className="flex-1 flex items-center gap-3 text-left truncate outline-none"
                          >
                            <History className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="text-slate-800 dark:text-slate-200 font-semibold truncate">{city}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteRecentSearch(city)}
                            className="p-1 hover:bg-red-500/10 hover:text-red-500 rounded-lg text-slate-400 opacity-80 group-hover:opacity-100 transition-all outline-none"
                            title="Delete item"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-slate-400 dark:text-slate-550 font-semibold">
                      No recent searches.
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
