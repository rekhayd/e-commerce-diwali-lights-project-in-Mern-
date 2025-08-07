/* eslint-disable react-refresh/only-export-components */
// import { createContext } from 'react';

// const ThemeContext = createContext();

// export default ThemeContext;

// import React, { createContext, useState } from 'react';

// export const ThemeContext = createContext();

// export const ThemeProvider = ({ children }) => {
//   const [darkMode, setDarkMode] = useState(false);

//   const toggleTheme = () => setDarkMode(prev => !prev);

//   return (
//     <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };




// src/ThemeContext.js
import React, { createContext, useState } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const toggleTheme = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ThemeProvider;
