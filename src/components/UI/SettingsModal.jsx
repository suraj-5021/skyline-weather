import React, { useState, useEffect, useRef } from 'react';
import { X, Key, HelpCircle, Save, Trash2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsModal({ isOpen, onClose, onKeyChange }) {
  const [apiKey, setApiKey] = useState('');
  const [savedStatus, setSavedStatus] = useState(false);
  const modalRef = useRef(null);

  // Load key on open
  useEffect(() => {
    if (isOpen) {
      const savedKey = localStorage.getItem('skyline_user_api_key') || '';
      setApiKey(savedKey);
      setSavedStatus(false);
      
      // Accessibility: Focus modal container
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('skyline_user_api_key', apiKey.trim());
    setSavedStatus(true);
    onKeyChange(apiKey.trim());
    setTimeout(() => {
      setSavedStatus(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    localStorage.removeItem('skyline_user_api_key');
    setApiKey('');
    onKeyChange('');
    setSavedStatus(true);
    setTimeout(() => {
      setSavedStatus(false);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop click close */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div
            ref={modalRef}
            tabIndex="-1"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-md p-6 bg-white/90 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl focus:outline-none z-10 space-y-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-white/5 pb-4">
              <div className="flex items-center gap-2 text-slate-800 dark:text-white">
                <Key className="w-5 h-5 text-sky-500" />
                <h3 id="modal-title" className="text-lg font-extrabold tracking-tight">
                  API Configuration
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                aria-label="Close Settings"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              Skyline Weather uses live meteorological data. You can paste your own personal <strong className="text-slate-700 dark:text-slate-350">WeatherAPI.com</strong> key below to connect directly. If empty, the app queries realistic cached profiles.
            </p>

            {/* Guide Link */}
            <div className="p-3 bg-sky-500/10 dark:bg-sky-400/10 border border-sky-500/20 dark:border-sky-400/15 rounded-2xl flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
              <div className="text-xs font-semibold text-slate-650 dark:text-sky-300">
                <p className="font-bold">How to get a free key:</p>
                <ol className="list-decimal list-inside mt-1 space-y-0.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  <li>Visit <a href="https://www.weatherapi.com/" target="_blank" rel="noopener noreferrer" className="text-sky-500 underline hover:text-sky-600 font-semibold">WeatherAPI.com</a></li>
                  <li>Sign up for a free developer account</li>
                  <li>Copy your API key from your Dashboard settings</li>
                </ol>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="apiKeyInput" className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider pl-1">
                  WeatherAPI Key
                </label>
                <input
                  id="apiKeyInput"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Paste your API key here..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-slate-950 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all font-medium text-sm"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                {apiKey && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl transition-colors border border-red-500/20 text-sm font-bold flex-1"
                    title="Clear API Key"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear</span>
                  </button>
                )}
                
                <button
                  type="submit"
                  disabled={savedStatus}
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-emerald-500 text-white rounded-2xl shadow-lg transition-all text-sm font-extrabold flex-[2]"
                >
                  {savedStatus ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 animate-bounce" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Config</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
