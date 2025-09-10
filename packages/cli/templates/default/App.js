import React from 'react';
import { ThemeProvider } from '@visual-rn/core';
import HomeScreen from './src/screens/Home';

function App() {
  return (
    <ThemeProvider>
      <HomeScreen />
    </ThemeProvider>
  );
}

export default App;