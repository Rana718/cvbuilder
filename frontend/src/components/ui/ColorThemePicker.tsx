"use client";

import { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ColorTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  } | null;
}

export const COLOR_THEMES: ColorTheme[] = [
  {
    name: 'Default',
    colors: null
  },
  {
    name: 'Blue Professional',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#06b6d4',
      text: '#334155',
      background: '#ffffff'
    }
  },
  {
    name: 'Purple Creative',
    colors: {
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#ec4899',
      text: '#374151',
      background: '#ffffff'
    }
  },
  {
    name: 'Green Nature',
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981',
      text: '#1f2937',
      background: '#ffffff'
    }
  },
  {
    name: 'Red Bold',
    colors: {
      primary: '#dc2626',
      secondary: '#991b1b',
      accent: '#f87171',
      text: '#374151',
      background: '#ffffff'
    }
  },
  {
    name: 'Orange Warm',
    colors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#fbbf24',
      text: '#374151',
      background: '#ffffff'
    }
  },
  {
    name: 'Slate Modern',
    colors: {
      primary: '#1a365d',
      secondary: '#2d3748',
      accent: '#3182ce',
      text: '#2d3748',
      background: '#ffffff'
    }
  },
  {
    name: 'Teal Fresh',
    colors: {
      primary: '#0d9488',
      secondary: '#0f766e',
      accent: '#14b8a6',
      text: '#1f2937',
      background: '#ffffff'
    }
  },
  {
    name: 'Indigo Deep',
    colors: {
      primary: '#4f46e5',
      secondary: '#4338ca',
      accent: '#6366f1',
      text: '#374151',
      background: '#ffffff'
    }
  }
];

interface ColorThemePickerProps {
  selectedTheme: ColorTheme;
  onThemeChange: (theme: ColorTheme) => void;
  className?: string;
}

export default function ColorThemePicker({ selectedTheme, onThemeChange, className = '' }: ColorThemePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Palette className="w-4 h-4" />
        <span className="text-sm font-medium">Theme</span>
        <div className="flex space-x-1">
          <div 
            className="w-3 h-3 rounded-full border border-gray-300" 
            style={{ 
              backgroundColor: selectedTheme.colors?.primary || '#ffffff',
              backgroundImage: selectedTheme.colors ? undefined : 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)',
              backgroundSize: selectedTheme.colors ? undefined : '3px 3px',
              backgroundPosition: selectedTheme.colors ? undefined : '0 0, 0 1.5px, 1.5px -1.5px, -1.5px 0px'
            }}
          />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-80"
            >
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Choose Color Theme</h3>
              <div className="grid grid-cols-2 gap-3">
                {COLOR_THEMES.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => {
                      onThemeChange(theme);
                      setIsOpen(false);
                    }}
                    className={`relative p-3 rounded-lg border-2 transition-all hover:shadow-md ${
                      selectedTheme.name === theme.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-gray-700">{theme.name}</span>
                      {selectedTheme.name === theme.name && (
                        <Check className="w-3 h-3 text-blue-600" />
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <div 
                        className="w-4 h-4 rounded border border-gray-300" 
                        style={{ 
                          backgroundColor: theme.colors?.primary || '#ffffff',
                          backgroundImage: theme.colors ? undefined : 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)',
                          backgroundSize: theme.colors ? undefined : '4px 4px',
                          backgroundPosition: theme.colors ? undefined : '0 0, 0 2px, 2px -2px, -2px 0px'
                        }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
