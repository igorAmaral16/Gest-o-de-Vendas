import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Sistema de Vendas
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/registrar-venda')}
        >
          Registrar Venda
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={() => navigate('/abater-venda')}
        >
          Abater Venda
        </Button>

        <Button
          variant="contained"
          color="success"
          onClick={() => navigate('/mostrar-vendas')}
        >
          Mostrar Vendas
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
