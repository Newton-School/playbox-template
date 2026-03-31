"use client";
import React from 'react';
import { NSIconButton } from '@newtonschool/grauity';
import { useThemeContext } from '../ThemeProvider/ThemeProvider';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useThemeContext();

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div className={styles.placeholder} />;
  }

  const handleToggle = () => {
    // Send event tracking message
    window.parent.postMessage({
      type: "CLICK",
      eventName: "theme-toggle-clicked",
      eventData: {
        currentTheme: theme,
        newTheme: theme === 'light' ? 'dark' : 'light'
      },
      url: window.location.href
    }, "*");

    toggleTheme();
  };

  return (
    <div className={styles.themeToggle}>
      <NSIconButton
        icon={theme === 'light' ? 'moon' : 'sun'}
        variant="tertiary"
        size="medium"
        onClick={handleToggle}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        className={styles.toggleButton}
      />
    </div>
  );
}
