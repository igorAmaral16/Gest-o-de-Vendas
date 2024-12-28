import React from 'react';
import { AppBar, Toolbar, Typography, Button, Switch } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleTheme, isDarkMode }) => {
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Sistema de Vendas
        </Typography>

        <Button color="inherit" onClick={() => navigate('/')}>
          Home
        </Button>

        <Button color="inherit" onClick={() => navigate('/registrar-venda')}>
          Registrar Venda
        </Button>

        <Button color="inherit" onClick={() => navigate('/abater-venda')}>
          Abater Venda
        </Button>

        <Button color="inherit" onClick={() => navigate('/mostrar-vendas')}>
          Mostrar Vendas
        </Button>

        <Switch
          checked={isDarkMode}
          onChange={toggleTheme}
          color="default"
        />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
