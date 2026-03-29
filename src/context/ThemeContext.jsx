import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};

const STORAGE_KEY = 'portfolio-theme';
const FONT_KEY = 'portfolio-font-size';

const readFontSize = () => {
  try {
    const v = localStorage.getItem(FONT_KEY);
    if (v === 'Small' || v === 'Medium' || v === 'Large') return v;
  } catch {
    /* localStorage unavailable */
  }
  return 'Medium';
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'dark';
    } catch {
      return false;
    }
  });

  const [fontSize, setFontSizeState] = useState(readFontSize);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch {
      /* localStorage unavailable */
    }
  }, [isDark]);

  useLayoutEffect(() => {
    const key = fontSize === 'Small' ? 'small' : fontSize === 'Large' ? 'large' : 'medium';
    document.documentElement.dataset.fontSize = key;
    try {
      localStorage.setItem(FONT_KEY, fontSize);
    } catch {
      /* localStorage unavailable */
    }
  }, [fontSize]);

  const toggleTheme = () => setIsDark((prev) => !prev);
  const setFontSize = (size) => setFontSizeState(size);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
};
