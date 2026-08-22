import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState('light');

  const applyTheme = useCallback(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
  }, []);

  const setTheme = (newMode) => {
    setThemeState('light');
    localStorage.setItem('dayflow_theme', 'light');
    applyTheme();
  };

  const toggleTheme = () => {
    setTheme('light');
  };

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme: 'light', setTheme, toggleTheme, isDark: false }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
