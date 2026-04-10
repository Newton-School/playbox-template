"use client";
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { useTheme, Theme } from "../../hooks/useTheme";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme, toggleTheme, setTheme, mounted } = useTheme();

  useEffect(() => {
    if (mounted) {
      document.body.className = `grauity-theme-${theme}`;
    }
  }, [theme, mounted]);

  const value = useMemo<ThemeContextType>(
    () => ({ theme, toggleTheme, setTheme, mounted }),
    [theme, toggleTheme, setTheme, mounted],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
