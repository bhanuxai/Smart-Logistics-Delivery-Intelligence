import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedDark = localStorage.getItem('isDarkMode');
    if (savedDark !== null) {
      return savedDark === 'true';
    }
    const fleetSettings = localStorage.getItem('fleet_settings');
    if (fleetSettings) {
      try {
        const parsed = JSON.parse(fleetSettings);
        if (parsed.uiTheme === 'dark') return true;
      } catch (e) {}
    }
    return false;
  });

  const [uiTheme, setUiTheme] = useState(() => {
    const fleetSettings = localStorage.getItem('fleet_settings');
    if (fleetSettings) {
      try {
        const parsed = JSON.parse(fleetSettings);
        if (parsed.uiTheme) return parsed.uiTheme;
      } catch (e) {}
    }
    return isDarkMode ? 'dark' : 'default';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      root.setAttribute('data-theme', uiTheme === 'dark' ? 'dark' : uiTheme);
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', uiTheme);
    }

    localStorage.setItem('isDarkMode', isDarkMode ? 'true' : 'false');

    // Sync fleet_settings in localStorage
    const savedFleet = localStorage.getItem('fleet_settings');
    let fleetObj = {};
    if (savedFleet) {
      try {
        fleetObj = JSON.parse(savedFleet);
      } catch (e) {}
    }
    fleetObj.uiTheme = isDarkMode ? 'dark' : (uiTheme === 'dark' ? 'default' : uiTheme);
    localStorage.setItem('fleet_settings', JSON.stringify(fleetObj));
  }, [isDarkMode, uiTheme]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        setUiTheme('dark');
      } else {
        setUiTheme('default');
      }
      return next;
    });
  };

  const changeUiTheme = (themeId) => {
    setUiTheme(themeId);
    if (themeId === 'dark') {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode, uiTheme, changeUiTheme }}>
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
