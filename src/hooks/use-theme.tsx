
import { useState, useEffect, createContext, useContext } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  setCustomPrimaryColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  setTheme: () => null,
  setCustomPrimaryColor: () => null,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    // Check system preference if no saved preference
    if (!savedTheme) {
      const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      return systemPreference as Theme;
    }
    return (savedTheme === 'dark' ? 'dark' : 'light');
  });

  // Apply the theme to the document
  useEffect(() => {
    const root = window.document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Apply custom primary color
  const setCustomPrimaryColor = (color: string) => {
    const root = document.documentElement;
    
    // Convert hex to HSL for primary color
    const hexToHSL = (hex: string) => {
      // Convert hex to RGB first
      let r = 0, g = 0, b = 0;
      if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
      } else if (hex.length === 7) {
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
      }
      
      // Then to HSL
      r /= 255;
      g /= 255;
      b /= 255;
      
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        
        h *= 60;
      }
      
      return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
    };
    
    const hsl = hexToHSL(color);
    root.style.setProperty('--primary', hsl);
    
    // Also set sidebar colors
    root.style.setProperty('--sidebar-primary', hsl);
    
    // Generate a slightly darker variant for accent/hover states
    const darkenHSL = (hsl: string) => {
      const [h, s, l] = hsl.split(' ');
      const lightness = parseInt(l.replace('%', '')) - 10;
      return `${h} ${s} ${Math.max(lightness, 10)}%`;
    };
    
    const darkHSL = darkenHSL(hsl);
    root.style.setProperty('--sidebar-accent', darkHSL);
    
    // Save to localStorage
    localStorage.setItem('primaryColor', color);
  };

  // Apply saved custom primary color on initial load
  useEffect(() => {
    const savedColor = localStorage.getItem('primaryColor');
    if (savedColor) {
      setCustomPrimaryColor(savedColor);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, setCustomPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
