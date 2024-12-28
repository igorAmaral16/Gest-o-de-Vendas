import React, { useState, useEffect } from 'react';
import { Button, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Alert, TextField } from '@mui/material';
import { obterVendasPendentes, atualizarVendaNoFirebase } from '../firebase/firebaseService';

const AbaterVenda = () => {
  const [vendasPendentes, setVendasPendentes] = useState([]);
  const [selectedVenda, setSelectedVenda] = useState(null); // Venda selecionada para abater
  const [valorAbatido, setValorAbatido] = useState(''); // Valor a ser abatido
  const [error, setError] = useState(''); // Erro ao abater
  const [openSnackbar, setOpenSnackbar] = useState(false); // Controle do Snackbar de sucesso
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Mensagem do Snackbar
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Controle da cor do Snackbar

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
    const venda = vendasPendentes.find((venda) => venda.id === vendaId); // Buscando no estado correto
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

    // Adicionar o valor abatido sem alterar o valor original da venda
    const vendaAtualizada = {
      ...venda,
      valorAbatido: (venda.valorAbatido || 0) + valorAbate, // Atualiza o valor abatido
      status: (venda.valorAbatido || 0) + valorAbate >= venda.valor ? 'Efetuado' : 'Pendente',
    };

    try {
      // Atualize a venda no banco de dados com o novo valor abatido
      await atualizarVendaNoFirebase(vendaAtualizada);

      setSnackbarSeverity('success');
      setSnackbarMessage('Abate realizado com sucesso!');
      setOpenSnackbar(true);

      // Atualiza as vendas pendentes no estado sem remover a venda incorretamente
      setVendasPendentes((prevVendas) =>
        prevVendas.map((v) => (v.id === vendaId ? vendaAtualizada : v))
      );

      setSelectedVenda(null); // Fecha o modal após sucesso
    } catch (error) {
      console.error('Erro ao realizar abate:', error);
      setSnackbarSeverity('error');
      setSnackbarMessage('Erro ao realizar o abate');
      setOpenSnackbar(true);
    }
  };

  // Abrir o modal de abate
  const handleOpenDialog = (venda) => {
    setSelectedVenda(venda);
    setValorAbatido(''); // Limpa o campo de valor ao abrir o modal
    setError('');
  };

  // Fechar o modal de abate
  const handleCloseDialog = () => {
    setSelectedVenda(null);
    setValorAbatido('');
    setError('');
  };

  // Validação de entrada no campo de abate
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

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>ABATER VENDA</Typography>
      {error && <Typography variant="body1" color="error">{error}</Typography>}

      {/* Tabela de vendas pendentes */}
      <TableContainer>
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
            {vendasPendentes.length > 0 ? (
              vendasPendentes.map((venda) => (
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
                      onClick={() => handleOpenDialog(venda)} // Abre o modal para abater
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
            onChange={handleValorAbatidoChange} // Validação do valor
            error={!!error}
            helperText={error || 'Digite um valor positivo até o valor restante'}
            fullWidth
            style={{ marginTop: 20 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            CANCELAR
          </Button>
          <Button
            onClick={() => handleAbaterVenda(selectedVenda.id, parseFloat(valorAbatido))}
            color="secondary"
            disabled={!valorAbatido || valorAbatido <= 0} // Desabilita o botão se o valor for inválido
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
    </div>
  );
};

export default AbaterVenda;
