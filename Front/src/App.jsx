import './App.css';

import { LocationProvider } from './contexts/LocationContext';

import Dashboard from './components/Dashboard';

import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import { theme, cacheRtl } from "./theme";

function App() {

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <LocationProvider>
          <div dir="rtl">
            <Dashboard />
          </div>
        </LocationProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}

export default App
