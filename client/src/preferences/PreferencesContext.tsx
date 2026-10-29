import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type AppLanguage = 'en' | 'kn' | 'hi';
export type AppTheme = 'dark' | 'light';

interface PreferencesValue {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
}

const PreferencesContext = createContext<PreferencesValue | null>(null);

function storedValue<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const value = window.localStorage.getItem(key);
    return value && allowed.includes(value as T) ? value as T : fallback;
  } catch {
    return fallback;
  }
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<AppLanguage>(() => storedValue('voxigen-language', ['en', 'kn', 'hi'], 'en'));
  const [theme, setTheme] = useState<AppTheme>(() => storedValue('voxigen-theme', ['dark', 'light'], 'light'));

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem('voxigen-language', language);
      window.localStorage.setItem('voxigen-theme', theme);
    } catch {
      // Preferences still work for the current session when storage is unavailable.
    }
  }, [language, theme]);

  const value = useMemo(() => ({ language, setLanguage, theme, setTheme }), [language, theme]);
  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const value = useContext(PreferencesContext);
  if (!value) throw new Error('usePreferences must be used within PreferencesProvider');
  return value;
}
