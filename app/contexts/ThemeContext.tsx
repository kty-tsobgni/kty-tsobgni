import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  // Charger le thème sauvegardé au démarrage
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        setTheme(savedTheme);
      }
    };
    loadTheme();
  }, []);

  // Basculer et sauvegarder le thème
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
