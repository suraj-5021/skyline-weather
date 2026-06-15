import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2.5 rounded-xl bg-glass bg-glass-hover text-slate-800 dark:text-slate-100 transition-all duration-300 shadow-sm outline-none border border-white/10"
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={false}
        animate={{ rotate: darkMode ? 360 : 0, scale: [0.75, 1.15, 1] }}
        transition={{ type: "spring", stiffness: 220, damping: 12 }}
      >
        {darkMode ? (
          <Sun className="w-5 h-5 text-amber-400 fill-amber-400/20" />
        ) : (
          <Moon className="w-5 h-5 text-indigo-600 fill-indigo-600/10" />
        )}
      </motion.div>
    </button>
  );
}
