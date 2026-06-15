import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function WeatherEffects() {
  const { weatherTheme, getThemeGradient } = useTheme();

  return (
    <div className={`fixed inset-0 -z-50 transition-all duration-1000 ease-in-out bg-gradient-to-br ${getThemeGradient()} overflow-hidden`}>
      {/* Radial atmospheric overlay for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent pointer-events-none" />

      {/* Dynamic weather overlays */}
      <AnimatePresence mode="wait">
        {weatherTheme === 'rainy' && (
          <motion.div
            key="rain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="rain-overlay"
          />
        )}
        {weatherTheme === 'snowy' && (
          <motion.div
            key="snow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="snow-overlay"
          />
        )}
        {(weatherTheme === 'cloudy' || weatherTheme === 'stormy') && (
          <motion.div
            key="clouds"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="clouds-overlay"
          />
        )}
        {weatherTheme === 'night' && (
          <motion.div
            key="stars"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="stars-overlay"
          />
        )}
      </AnimatePresence>

      {/* Lightning simulation during thunderstorms */}
      {weatherTheme === 'stormy' && (
        <motion.div
          animate={{
            opacity: [0, 0, 0.05, 0, 0.4, 0, 0, 0.1, 0, 0]
          }}
          transition={{
            repeat: Infinity,
            duration: 9,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-white pointer-events-none z-10"
        />
      )}
    </div>
  );
}
