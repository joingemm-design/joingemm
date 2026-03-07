"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Upgraded Type Definition
type Theme = {
  name: string;
  bg: string;
  text: string;
  primary: string;
  subtle: string;
  border: string;
};

// The Complete 12-Theme Arsenal
export const themes: Theme[] = [
  { name: 'Clean', bg: '#ffffff', text: '#0a0a0a', primary: '#10b981', subtle: '#f5f5f5', border: '#e5e5e5' },
  { name: 'Midnight', bg: '#0a0a0a', text: '#ffffff', primary: '#34d399', subtle: '#18181b', border: '#27272a' },
  { name: 'Forest', bg: '#064e3b', text: '#ecfdf5', primary: '#34d399', subtle: '#022c22', border: '#047857' },
  { name: 'Cotton', bg: '#fdf2f8', text: '#4a044e', primary: '#ff9a9e', subtle: '#fff1eb', border: '#fbcfe8' },
  { name: 'Cyber', bg: '#2e0249', text: '#00f0ff', primary: '#ff0099', subtle: '#09090b', border: '#00f0ff' },
  { name: 'Ocean', bg: '#0c4a6e', text: '#f0f9ff', primary: '#38bdf8', subtle: '#082f49', border: '#0369a1' },
  { name: 'Sunset', bg: '#ffe4e6', text: '#881337', primary: '#fb7185', subtle: '#fff1f2', border: '#fecdd3' },
  { name: 'Sand', bg: '#fef3c7', text: '#451a03', primary: '#d97706', subtle: '#fdfbf7', border: '#fde68a' },
  { name: 'Royal', bg: '#312e81', text: '#e0e7ff', primary: '#818cf8', subtle: '#1e1b4b', border: '#4338ca' },
  { name: 'Dracula', bg: '#282a36', text: '#f8f8f2', primary: '#bd93f9', subtle: '#191a21', border: '#6272a4' },
  { name: 'Matcha', bg: '#dcfce7', text: '#14532d', primary: '#22c55e', subtle: '#f0fdf4', border: '#bbf7d0' },
  { name: 'Velvet', bg: '#701a75', text: '#fae8ff', primary: '#e879f9', subtle: '#4a044e', border: '#a21caf' }
];

// Strict Context Typing
type ThemeContextType = {
  currentTheme: Theme;
  setCurrentTheme: (theme: Theme) => void;
  themes: Theme[];
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]); // Defaults to 'Clean'

  useEffect(() => {
    // Injecting the variables directly into the document root for Tailwind to consume
    const root = document.documentElement;
    root.style.setProperty('--bg-primary', currentTheme.bg);
    root.style.setProperty('--text-primary', currentTheme.text);
    root.style.setProperty('--color-primary', currentTheme.primary);
    root.style.setProperty('--bg-subtle', currentTheme.subtle);
    root.style.setProperty('--border-subtle', currentTheme.border);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook with built-in safety check
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};