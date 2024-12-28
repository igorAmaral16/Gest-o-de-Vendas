import React, { useState, useEffect } from 'react';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert, TextField, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { obterVendasPendentes, atualizarVendaNoFirebase } from '../firebase/firebaseService';

const AbaterVenda = () => {
  const [vendasPendentes, setVendasPendentes] = useState([]);
  const [selectedVenda, setSelectedVenda] = useState(null);
  const [valorAbatido, setValorAbatido] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState(''); // Novo estado para a opção de ordenação

  useEffect(() => {
    const fetchVendasPendentes = async () => {
      try {
        const vendas = await obterVendasPendentes();
        setVendasPendentes(vendas);
      } catch (err) {
        console.error('Erro ao obter vendas pendentes:', err);
        setError('Não foi possível carregar as vendas pendentes.');
      }
    };

    fetchVendasPendentes();
  }, []);

  const handleAbaterVenda = async (vendaId, valorAbate) => {
    const venda = vendasPendentes.find((venda) => venda.id === vendaId);
    if (!venda) {
      console.error('Venda não encontrada');
      return;
    }

    if (valorAbate <= 0 || valorAbate > venda.valor - (venda.valorAbatido || 0)) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Valor de abate inválido');
      setOpenSnackbar(true);
      return;
    }

    const vendaAtualizada = {
      ...venda,
      valorAbatido: (venda.valorAbatido || 0) + valorAbate,
      status: (venda.valorAbatido || 0) + valorAbate >= venda.valor ? 'Efetuado' : 'Pendente',
    };

    try {
      await atualizarVendaNoFirebase(vendaAtualizada);

      setSnackbarSeverity('success');
      setSnackbarMessage('Abate realizado com sucesso!');
      setOpenSnackbar(true);

      setVendasPendentes((prevVendas) =>
        prevVendas.map((v) => (v.id === vendaId ? vendaAtualizada : v))
      );

      setSelectedVenda(null);
    } catch (error) {
      console.error('Erro ao realizar abate:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Erro ao realizar o abate');
      setOpenSnackbar(true);
    }
  };

  const handleOpenDialog = (venda) => {
    setSelectedVenda(venda);
    setValorAbatido('');
    setError('');
  };

  const handleCloseDialog = () => {
    setSelectedVenda(null);
    setValorAbatido('');
    setError('');
  };

  const handleValorAbatidoChange = (e) => {
    const value = parseFloat(e.target.value);
    const valorRestante = selectedVenda?.valor - (selectedVenda?.valorAbatido || 0);

    if (value < 0 || value > valorRestante) {
      setError('Valor de abate inválido');
      setValorAbatido('');
    } else {
      setError('');
      setValorAbatido(value);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Função de filtragem e ordenação
  const filteredAndSortedVendas = vendasPendentes
    .filter((venda) =>
      venda.clienteId.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === 'maiorValor') {
        return b.valor - a.valor;
      } else if (sortOption === 'menorValor') {
        return a.valor - b.valor;
      } else if (sortOption === 'alfabetico') {
        return a.clienteId.localeCompare(b.clienteId);
      }
      return 0; // Sem ordenação
    });

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>ABATER VENDA</Typography>
      {error && <Typography variant="body1" color="error">{error}</Typography>}

      {/* Caixa de busca */}
      <TextField
        label="Buscar Cliente"
        variant="outlined"
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        sx={{ mb: 2 }}
      />

      {/* Filtro de ordenação */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Ordenar por</InputLabel>
        <Select
          value={sortOption}
          onChange={handleSortChange}
          label="Ordenar por"
        >
          <MenuItem value="">Nenhuma Ordenação</MenuItem>
          <MenuItem value="maiorValor">Maior Valor</MenuItem>
          <MenuItem value="menorValor">Menor Valor</MenuItem>
          <MenuItem value="alfabetico">Ordem Alfabética</MenuItem>
        </Select>
      </FormControl>

      {/* Tabela de vendas pendentes */}
      <TableContainer sx={{ maxWidth: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>CLIENTE</TableCell>
              <TableCell>PRODUTO</TableCell>
              <TableCell>VALOR</TableCell>
              <TableCell>VALOR ABATIDO</TableCell>
              <TableCell>STATUS</TableCell>
              <TableCell>AÇÕES</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedVendas.length > 0 ? (
              filteredAndSortedVendas.map((venda) => (
                <TableRow key={venda.id}>
                  <TableCell>{venda.clienteId}</TableCell>
                  <TableCell>{venda.produto}</TableCell>
                  <TableCell>R$ {venda.valor}</TableCell>
                  <TableCell>R$ {venda.valorAbatido || 0}</TableCell>
                  <TableCell>{venda.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleOpenDialog(venda)}
                      disabled={venda.status === 'Efetuado'}
                    >
                      ABATER
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>NÃO HÁ VENDAS PENDENTES.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para abater venda */}
      <Dialog open={Boolean(selectedVenda)} onClose={handleCloseDialog}>
        <DialogTitle>ABATER VENDA</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {`CLIENTE: ${selectedVenda?.clienteId}, PRODUTO: ${selectedVenda?.produto}`}
          </Typography>
          <Typography variant="body2" style={{ marginTop: 10 }}>
            {`VALOR TOTAL: R$ ${selectedVenda?.valor}`}
          </Typography>
          <Typography variant="body2" style={{ marginTop: 10 }}>
            {`VALOR JÁ ABATIDO: R$ ${selectedVenda?.valorAbatido || 0}`}
          </Typography>
          <Typography variant="body2" style={{ marginTop: 10 }}>
            {`VALOR RESTANTE PARA ABATER: R$ ${(selectedVenda?.valor - (selectedVenda?.valorAbatido || 0)).toFixed(2)}`}
          </Typography>
          <TextField
            label="Valor do Abate"
            type="number"
            value={valorAbatido}
            onChange={handleValorAbatidoChange}
            error={!!error}
            helperText={error || 'Digite um valor positivo até o valor restante'}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            CANCELAR
          </Button>
          <Button
            onClick={() => handleAbaterVenda(selectedVenda.id, parseFloat(valorAbatido))}
            color="secondary"
            disabled={!valorAbatido || valorAbatido <= 0}
          >
            CONFIRMAR ABATE
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de sucesso ou erro */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AbaterVenda;
