// import React, { createContext, useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useColorScheme } from 'react-native';

// export const ThemeContext = createContext();

// export function ThemeProvider({ children }) {
//   const systemScheme = useColorScheme(); // 'light' | 'dark'
//   const [theme, setTheme] = useState(systemScheme); // 'light' | 'dark' | null

//   useEffect(() => {
//     (async () => {
//       const savedTheme = await AsyncStorage.getItem('APP_THEME');
//       if (savedTheme) setTheme(savedTheme);
//     })();
//   }, []);

//   const currentTheme = theme || systemScheme || 'light';

//   const toggleTheme = async () => {
//     const next = currentTheme === 'dark' ? 'light' : 'dark';
//     setTheme(next);
//     await AsyncStorage.setItem('APP_THEME', next);
//   };

//   return (
//     <ThemeContext.Provider
//       value={{
//         theme: currentTheme,
//         isDark: currentTheme === 'dark',
//         toggleTheme,
//       }}
//     >
//       {children}
//     </ThemeContext.Provider>
//   );
// }




//ts
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

/* ---------- Types ---------- */

type ThemeType = 'light' | 'dark';

type ThemeContextType = {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => Promise<void>;
};

type ThemeProviderProps = {
  children: ReactNode;
};

/* ---------- Context ---------- */

export const ThemeContext = createContext<ThemeContextType>(
  {} as ThemeContextType
);

/* ---------- Provider ---------- */

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null

  const [theme, setTheme] = useState<ThemeType | null>(
    systemScheme as ThemeType | null
  );

  /* ---------- Restore saved theme ---------- */

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('APP_THEME');

        if (savedTheme === 'light' || savedTheme === 'dark') {
          setTheme(savedTheme);
        }
      } catch (err) {
        console.log('Failed to load theme', err);
      }
    };

    loadTheme();
  }, []);

  const currentTheme: ThemeType =
    theme || (systemScheme as ThemeType) || 'light';

  /* ---------- Toggle Theme ---------- */

  const toggleTheme = async () => {
    const next: ThemeType = currentTheme === 'dark' ? 'light' : 'dark';

    setTheme(next);

    await AsyncStorage.setItem('APP_THEME', next);
  };

  /* ---------- Provider ---------- */

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        isDark: currentTheme === 'dark',
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}