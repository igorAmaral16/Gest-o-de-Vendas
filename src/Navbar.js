import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Switch, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';  // Ícone de menu para telas pequenas

const Navbar = ({ toggleTheme, isDarkMode }) => {
  const navigate = useNavigate();
  const [openDrawer, setOpenDrawer] = useState(false);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Sistema de Vendas
          </Typography>

          {/* Ícone de menu para telas pequenas */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
            <IconButton color="inherit" aria-label="menu" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Links de navegação, visíveis em telas grandes */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center' }}>
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
          </Box>
        </Box>
      </Toolbar>

      {/* Drawer para telas pequenas */}
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={toggleDrawer}
      >
        <List>
          <ListItem button onClick={() => { navigate('/'); toggleDrawer(); }}>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={() => { navigate('/registrar-venda'); toggleDrawer(); }}>
            <ListItemText primary="Registrar Venda" />
          </ListItem>
          <ListItem button onClick={() => { navigate('/abater-venda'); toggleDrawer(); }}>
            <ListItemText primary="Abater Venda" />
          </ListItem>
          <ListItem button onClick={() => { navigate('/mostrar-vendas'); toggleDrawer(); }}>
            <ListItemText primary="Mostrar Vendas" />
          </ListItem>
          <ListItem>
            <Switch
              checked={isDarkMode}
              onChange={toggleTheme}
              color="default"
            />
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
