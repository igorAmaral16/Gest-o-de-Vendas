import React, { useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Grid } from '@mui/material';  // Importando Box e Grid para layout responsivo
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RegistrarVenda from './pages/RegistrarVenda';
import Navbar from './Navbar';
import AbaterVenda from './pages/AbaterVenda';
import MostrarVendas from './pages/MostrarVendas'; 

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
        },
        breakpoints: {
          values: {
            xs: 0, // Para smartphones
            sm: 600, // Para tablets
            md: 960, // Para desktops pequenos
            lg: 1280, // Para desktops médios
            xl: 1920, // Para desktops grandes
          },
        },
      }),
    [isDarkMode]
  );

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        
        <Box sx={{ width: '100%', padding: 2 }}>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={8} md={6} lg={4}>
              <Routes>
                {/* Rota da Home */}
                <Route path="/" element={<Home />} />

                {/* Rota de Registrar Venda */}
                <Route path="/registrar-venda" element={<RegistrarVenda />} />

                {/* Rota para Abater Venda */}
                <Route path="/abater-venda" element={<AbaterVenda />} />

                <Route path="/mostrar-vendas" element={<MostrarVendas />} />
              </Routes>
            </Grid>
          </Grid>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App;
