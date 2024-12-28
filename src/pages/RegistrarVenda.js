import React, { useState } from 'react';
import { TextField, Button, Typography } from '@mui/material';
import { registrarVenda } from '../firebase/firebaseService'; // Alterado para registrarVenda

const RegistrarVenda = () => {
  const [clienteId, setClienteId] = useState('');
  const [produto, setProduto] = useState('');
  const [valor, setValor] = useState('');
  const [dataCompra, setDataCompra] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar se os campos estão preenchidos corretamente
    if (!clienteId || !produto || !valor || !dataCompra) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    // Garantir que o valor é um número válido
    if (isNaN(valor) || parseFloat(valor) <= 0) {
      setError('O valor deve ser um número positivo.');
      return;
    }

    // Construir o objeto de venda
    const venda = {
      clienteId,
      produto,
      valor: parseFloat(valor),
      dataCompra,
    };

    try {
      // Registrar a venda
      await registrarVenda(venda); // Alterado para registrarVenda
      alert('Venda registrada com sucesso!');
      setError(''); // Limpar mensagens de erro após o sucesso
    } catch (err) {
      console.error('Erro ao registrar venda:', err);
      setError('Ocorreu um erro ao registrar a venda. Tente novamente.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>Registrar Venda</Typography>
      <form onSubmit={handleSubmit}>
        {error && (
          <Typography variant="body1" color="error" style={{ marginBottom: 20 }}>
            {error}
          </Typography>
        )}
        <TextField
          label="ID do Cliente"
          fullWidth
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          style={{ marginBottom: 20 }}
        />
        <TextField
          label="Produto"
          fullWidth
          value={produto}
          onChange={(e) => setProduto(e.target.value)}
          style={{ marginBottom: 20 }}
        />
        <TextField
          label="Valor"
          type="number"
          fullWidth
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          style={{ marginBottom: 20 }}
        />
        <TextField
          label="Data da Compra"
          type="date"
          fullWidth
          value={dataCompra}
          onChange={(e) => setDataCompra(e.target.value)}
          InputLabelProps={{ shrink: true }}
          style={{ marginBottom: 20 }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Registrar Venda
        </Button>
      </form>
    </div>
  );
};

export default RegistrarVenda;
