import React, { useState, useEffect } from 'react';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem, FormControl, InputLabel, Grid, Box } from '@mui/material';
import { obterVendasEfetuadas } from '../firebase/firebaseService'; // Certifique-se de que a função está importada corretamente

const MostrarVendas = () => {
  const [vendas, setVendas] = useState([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('efetuado'); // Inicialmente configurado para exibir vendas efetuadas
  const [orderBy, setOrderBy] = useState('data'); // Filtro de ordenação (data ou valor)
  const [orderDirection, setOrderDirection] = useState('desc'); // Direção de ordenação (crescente ou decrescente)

  const fetchVendas = async () => {
    try {
      // Obtém as vendas com status "efetuado"
      const vendasEfetuadas = await obterVendasEfetuadas();

      // Ordena as vendas com base no critério selecionado
      const sortedVendas = vendasEfetuadas.sort((a, b) => {
        if (orderBy === 'data') {
          // Comparando as datas (de mais recente para mais antiga ou vice-versa)
          const dateA = new Date(a.data); // Supondo que cada venda tenha uma propriedade `data`
          const dateB = new Date(b.data);
          return orderDirection === 'desc' ? dateB - dateA : dateA - dateB;
        } else if (orderBy === 'valor') {
          // Comparando os valores das vendas
          return orderDirection === 'desc' ? b.valor - a.valor : a.valor - b.valor;
        }
        return 0;
      });

      setVendas(sortedVendas);
    } catch (err) {
      console.error('Erro ao obter vendas:', err);
      setError('Não foi possível carregar as vendas.');
    }
  };

  useEffect(() => {
    fetchVendas();
  }, [status, orderBy, orderDirection]); // Recarrega as vendas sempre que o status, orderBy ou orderDirection forem alterados

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>Mostrar Vendas</Typography>
      {error && <Typography variant="body1" color="error">{error}</Typography>}

      <Grid container spacing={2} alignItems="center">
        {/* Filtros para alternar entre pendentes e efetuadas */}
        <Grid item xs={12} sm={4}>
          <Button
            variant={status === 'efetuado' ? 'contained' : 'outlined'}
            color="secondary"
            onClick={() => setStatus('efetuado')}
            fullWidth
          >
            Vendas Efetuadas
          </Button>
        </Grid>

        {/* Filtros para ordenação */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
              label="Ordenar por"
            >
              <MenuItem value="data">Data</MenuItem>
              <MenuItem value="valor">Valor</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Direção</InputLabel>
            <Select
              value={orderDirection}
              onChange={(e) => setOrderDirection(e.target.value)}
              label="Direção"
            >
              <MenuItem value="desc">Decrescente</MenuItem>
              <MenuItem value="asc">Crescente</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <TableContainer sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Produto</TableCell>
              <TableCell>Valor Total</TableCell>
              <TableCell>Valor Abatido</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vendas.length > 0 ? (
              vendas.map((venda) => (
                <TableRow key={venda.id}>
                  <TableCell>{venda.clienteId}</TableCell>
                  <TableCell>{venda.produto}</TableCell>
                  <TableCell>R$ {venda.valor.toFixed(2)}</TableCell> {/* Valor total da venda */}
                  <TableCell>R$ {venda.valorAbatido ? venda.valorAbatido.toFixed(2) : '0.00'}</TableCell> {/* Exibe valor abatido */}
                  <TableCell>{venda.status}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>Não há vendas {status === 'efetuado' ? 'efetuadas' : 'pendentes'}.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MostrarVendas;
