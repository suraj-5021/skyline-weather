import React from 'react';
import { motion } from 'framer-motion';

export default function WeatherIcon({ type, className = "w-16 h-16" }) {
  const normalizedType = type?.toLowerCase() || 'cloudy';

  switch (normalizedType) {
    case 'sunny':
      return (
        <div className={`relative ${className}`}>
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          >
            {/* Sun Rays */}
            <defs>
              <linearGradient id="sunGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F7971E" />
                <stop offset="100%" stopColor="#FFD200" />
              </linearGradient>
            </defs>
            {[...Array(8)].map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="10"
                x2="50"
                y2="20"
                stroke="url(#sunGlow)"
                strokeWidth="5"
                strokeLinecap="round"
                transform={`rotate(${i * 45} 50 50)`}
              />
            ))}
            {/* Sun Center */}
            <circle cx="50" cy="50" r="22" fill="url(#sunGlow)" />
          </motion.svg>
        </div>
      );

    case 'night':
      return (
        <div className={`relative ${className}`}>
          {/* Moon */}
          <motion.svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            animate={{ y: [0, -3, 0], rotate: [0, 2, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          >
            <defs>
              <linearGradient id="moonGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8A2387" />
                <stop offset="50%" stopColor="#E94057" />
                <stop offset="100%" stopColor="#F27121" />
              </linearGradient>
            </defs>
            <path
              d="M30 65 A30 30 0 1 0 70 25 A24 24 0 1 1 30 65 Z"
              fill="url(#moonGlow)"
            />
          </motion.svg>

          {/* Twinkling Stars */}
          <motion.div
            className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_#fff]"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
            transition={{ repeat: Infinity, duration: 2, delay: 0.2 }}
          />
          <motion.div
            className="absolute bottom-4 left-2 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_6px_#fff]"
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.7, 1.1, 0.7] }}
            transition={{ repeat: Infinity, duration: 1.5, delay: 0.8 }}
          />
        </div>
      );

    case 'rainy':
      return (
        <div className={`relative ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#757F9A" />
                <stop offset="100%" stopColor="#D7DDE8" />
              </linearGradient>
              <linearGradient id="rainGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00c6ff" />
                <stop offset="100%" stopColor="#0072ff" />
              </linearGradient>
            </defs>
            
            {/* Cloud Shape */}
            <motion.path
              d="M20 65 A15 15 0 0 1 30 38 A22 22 0 0 1 70 34 A18 18 0 0 1 80 65 Z"
              fill="url(#cloudGrad)"
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />

            {/* Falling Drops */}
            {[...Array(3)].map((_, i) => (
              <motion.line
                key={i}
                x1={35 + i * 15}
                y1="68"
                x2={31 + i * 15}
                y2="78"
                stroke="url(#rainGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: [0, 15, 0], opacity: [0, 1, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.2,
                  delay: i * 0.3,
                  ease: "linear",
                }}
              />
            ))}
          </svg>
        </div>
      );

    case 'stormy':
      return (
        <div className={`relative ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="darkCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2c3e50" />
                <stop offset="100%" stopColor="#3498db" />
              </linearGradient>
              <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFDE00" />
                <stop offset="100%" stopColor="#FFA200" />
              </linearGradient>
            </defs>

            {/* Dark Cloud */}
            <motion.path
              d="M20 65 A15 15 0 0 1 30 38 A22 22 0 0 1 70 34 A18 18 0 0 1 80 65 Z"
              fill="url(#darkCloudGrad)"
              animate={{ y: [0, -1, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            />

            {/* Lightning Bolt */}
            <motion.path
              d="M50 58 L40 72 L49 72 L42 88 L58 70 L49 70 Z"
              fill="url(#lightningGrad)"
              animate={{
                opacity: [0, 1, 0, 1, 0, 0, 1, 0],
                scale: [0.95, 1.05, 0.95, 1.05, 0.95, 0.95, 1.05, 0.95]
              }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "linear",
                repeatDelay: 1
              }}
            />
          </svg>
        </div>
      );

    case 'snowy':
      return (
        <div className={`relative ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="snowCloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#859398" />
                <stop offset="100%" stopColor="#CAD5E2" />
              </linearGradient>
            </defs>

            {/* Cloud */}
            <motion.path
              d="M20 65 A15 15 0 0 1 30 38 A22 22 0 0 1 70 34 A18 18 0 0 1 80 65 Z"
              fill="url(#snowCloudGrad)"
              animate={{ y: [0, -2, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            />

            {/* Falling/Spinning Snowflakes */}
            {[...Array(3)].map((_, i) => (
              <motion.g
                key={i}
                transform={`translate(${35 + i * 15}, 72)`}
                initial={{ y: -5, opacity: 0 }}
                animate={{
                  y: [0, 12, 0],
                  opacity: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  delay: i * 0.6,
                  ease: "easeInOut"
                }}
              >
                {/* Snowflake simple representation */}
                <circle cx="0" cy="0" r="2.2" fill="#E2E8F0" />
                <line x1="-3" y1="0" x2="3" y2="0" stroke="#E2E8F0" strokeWidth="0.8" />
                <line x1="0" y1="-3" x2="0" y2="3" stroke="#E2E8F0" strokeWidth="0.8" />
              </motion.g>
            ))}
          </svg>
        </div>
      );

    case 'cloudy':
    default:
      return (
        <div className={`relative ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <linearGradient id="cloudGradBase" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#B0C4DE" />
                <stop offset="100%" stopColor="#F0F8FF" />
              </linearGradient>
              <linearGradient id="cloudGradFront" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#DCDCDC" />
              </linearGradient>
            </defs>

            {/* Back Cloud */}
            <motion.path
              d="M15 60 A12 12 0 0 1 25 38 A18 18 0 0 1 58 35 A15 15 0 0 1 65 60 Z"
              fill="url(#cloudGradBase)"
              animate={{ x: [0, 2, 0], y: [0, -1, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            />

            {/* Front Cloud */}
            <motion.path
              d="M30 70 A15 15 0 0 1 40 43 A22 22 0 0 1 80 39 A18 18 0 0 1 90 70 Z"
              fill="url(#cloudGradFront)"
              animate={{ x: [0, -2, 0], y: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            />
          </svg>
        </div>
      );
  }
}
