import React, { useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Box, Grid } from '@mui/material';
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
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              html: {
                width: '100%',
                height: '100%',
                overflowX: 'hidden', // Impede o overflow horizontal
              },
              body: {
                margin: 0,
                padding: 0,
                width: '100%',
                height: '100%',
              },
            },
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
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={10} md={8} lg={6}>
              <Routes>
                {/* A rota "/" leva à tela Home */}
                <Route path="/" element={<Home />} />

                {/* Outras rotas do sistema */}
                <Route path="/registrar-venda" element={<RegistrarVenda />} />
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
