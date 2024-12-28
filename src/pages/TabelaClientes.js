import React, { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TabelaClientes = ({ clientes }) => {
  const navigate = useNavigate();

  const calcularValorDevido = (vendas) => {
    return vendas.reduce((total, venda) => total + venda.valor, 0);
  };

  const handleAbaterClick = (cliente) => {
    navigate(`/abater/${cliente.id}`, { state: { cliente } });  // Passando o cliente para a próxima tela
  };

  return (
    <TableContainer>
      <Typography variant="h4" gutterBottom>
        Clientes Devedores
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nome</TableCell>
            <TableCell>Valor Devido</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {clientes.map((cliente) => {
            const valorDevido = calcularValorDevido(cliente.vendas);
            return (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.nome}</TableCell>
                <TableCell style={{ color: 'red' }}>R$ {valorDevido.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAbaterClick(cliente)}
                  >
                    Abater
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TabelaClientes;
