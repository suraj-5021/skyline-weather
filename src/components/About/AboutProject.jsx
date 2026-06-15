import React from 'react';
import { Cpu, Layout, Layers, Zap, Info, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const GithubIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function AboutProject() {
  const features = [
    { title: "Real-Time Weather Data", desc: "Instantly retrieves actual metrics from live weather networks, parsing conditions, temperatures, and astronomical times." },
    { title: "24-Hour Forecast", desc: "Lists hourly forecasts for temperatures and rain probabilities with dynamic weather icon conditions." },
    { title: "7-Day Forecast", desc: "Detailed weekly layout containing min/max bounds and custom range bars." },
    { title: "Weather Analytics Charts", desc: "Visualizes trends in temperature curves, wind speeds, and relative humidity using Recharts." },
    { title: "UV Index Monitoring", desc: "Tracks solar radiation levels with automated safety alerts and descriptions." },
    { title: "Air Pressure Tracking", desc: "Measures atmospheric force in millibars (hPa) relative to normal sea-level pressures." },
    { title: "Visibility Monitoring", desc: "Provides visibility distance scales in kilometers for outdoor activity planning." },
    { title: "Geolocation Support", desc: "Queries geolocation APIs to load current local parameters automatically." },
    { title: "Favorite Cities", desc: "Enables saving bookmarks for fast navigation, syncing automatically to local storage." },
    { title: "Responsive Design", desc: "Dashboard layout scales across desktop, tablet, and mobile displays." }
  ];

  const techStack = [
    { name: "React.js", color: "bg-sky-500/10 text-sky-500 border-sky-500/20" },
    { name: "Vite", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
    { name: "Tailwind CSS", color: "bg-teal-500/10 text-teal-500 border-teal-500/20" },
    { name: "Framer Motion", color: "bg-pink-500/10 text-pink-500 border-pink-500/20" },
    { name: "Recharts", color: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
    { name: "Weather API", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 150, damping: 15 } }
  };

  return (
    <div className="space-y-12 mt-12 pt-12 border-t border-slate-200/50 dark:border-white/5">
      
      {/* Overview */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto text-center space-y-4"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-sky-500 dark:text-sky-400 bg-sky-500/10 px-3.5 py-1.5 rounded-xl border border-sky-500/15">
          About The Project
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          Modern Weather Analytics Dashboard
        </h2>
        <p className="text-sm sm:text-base font-semibold leading-relaxed text-slate-550 dark:text-slate-400">
          Skyline Weather is a modern weather analytics platform built with React, Tailwind CSS, and real-time weather APIs. The application provides current conditions, hourly forecasts, 7-day predictions, weather analytics, and environmental insights through an intuitive dashboard interface designed for both desktop and mobile users.
        </p>
      </motion.div>

      {/* Tech Stack Badges */}
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex flex-wrap justify-center gap-3.5 max-w-xl mx-auto"
      >
        {techStack.map((tech) => (
          <span
            key={tech.name}
            className={`text-xs font-extrabold px-3.5 py-1.5 rounded-xl border ${tech.color} shadow-sm`}
          >
            {tech.name}
          </span>
        ))}
      </motion.div>

      {/* Features Grid */}
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-2.5 px-2">
          <Info className="w-5 h-5 text-sky-500" />
          <h3 className="text-lg font-extrabold text-slate-800 dark:text-white tracking-tight">
            Key Dashboard Features
          </h3>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {features.map((feat) => (
            <motion.div
              key={feat.title}
              variants={itemVariants}
              className="p-5 rounded-2xl bg-glass border border-white/20 dark:border-white/10 flex items-start gap-4 shadow-sm hover:border-sky-500/20 transition-all duration-300 group hover:-translate-y-0.5"
            >
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 shrink-0 border border-slate-200/50 dark:border-white/5 group-hover:bg-sky-500/10 transition-colors">
                <ShieldCheck className="w-4 h-4 text-sky-500" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white group-hover:text-sky-500 transition-colors">
                  {feat.title}
                </h4>
                <p className="text-xs sm:text-sm font-semibold leading-normal text-slate-500 dark:text-slate-450">
                  {feat.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Profile Footer */}
      <div className="border-t border-slate-200/50 dark:border-white/5 pt-8 text-center space-y-4">
        <div className="flex justify-center gap-4">
          <motion.a
            whileHover={{ scale: 1.1, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            href="https://github.com/suraj-5021"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-glass border border-white/10 rounded-xl text-xs font-bold text-slate-650 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white shadow-sm transition-colors"
          >
            <GithubIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span>GitHub</span>
          </motion.a>
          
          <motion.a
            whileHover={{ scale: 1.1, y: -2 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            href="https://www.linkedin.com/in/suraj-soni-1773a5320?utm_source=share_via&utm_content=profile&utm_medium=member_android"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-glass border border-white/10 rounded-xl text-xs font-bold text-slate-650 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white shadow-sm transition-colors"
          >
            <LinkedinIcon className="w-4 h-4 text-sky-500 fill-sky-500/10" />
            <span>LinkedIn</span>
          </motion.a>
        </div>
        
        <p className="text-xs text-slate-400 dark:text-slate-600 font-semibold">
          © {new Date().getFullYear()} Skyline Weather. Built for engineering portfolios.
        </p>
      </div>
    </div>
  );
}
