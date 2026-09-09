import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

const applyThemeClass = (theme) => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('scholaros_theme');
    const resolved = savedTheme === 'dark' ? 'dark' : 'light';
    applyThemeClass(resolved);
    return resolved;
  });

  useEffect(() => {
    applyThemeClass(theme);
    localStorage.setItem('scholaros_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
