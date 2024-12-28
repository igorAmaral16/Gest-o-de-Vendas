import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, updateDoc, doc, getDoc, query, where } from 'firebase/firestore';

// Função para registrar venda
export const registrarVenda = async (venda) => {
  try {
    // Verificando se o campo produto está definido
    if (!venda.produto) {
      throw new Error('Produto não definido');
    }

    // Adicionando o status "pendente" à venda
    const vendaComStatus = {
      ...venda,
      status: 'pendente', // Define o status como "pendente" por padrão
    };

    // Adicionando a venda ao Firestore
    const docRef = await addDoc(collection(db, 'vendas'), vendaComStatus);
    console.log('Documento registrado com ID: ', docRef.id);
  } catch (error) {
    console.error('Erro ao registrar venda: ', error.message);
  }
};

// Função para obter vendas com status 'pendente'
export const obterVendasPendentes = async () => {
  const vendasRef = collection(db, 'vendas');
  const q = query(vendasRef, where('status', '==', 'pendente'));
  const vendasSnapshot = await getDocs(q);
  const vendas = vendasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return vendas;
};

// Função para abater valor da venda e atualizar status se necessário
export const abaterVenda = async (vendaId, valorAbatido) => {
  const vendaRef = doc(db, 'vendas', vendaId);
  const vendaSnapshot = await getDoc(vendaRef);
  const vendaData = vendaSnapshot.data();

  const novoSaldo = vendaData.valor - valorAbatido;

  if (novoSaldo <= 0) {
    await updateDoc(vendaRef, {
      valor: 0,
      status: 'efetuado' // Atualiza o status para 'efetuado' se o saldo for 0
    });
  } else {
    await updateDoc(vendaRef, {
      valor: novoSaldo
    });
  }
};

// Função para obter vendas com status 'efetuado'
export const obterVendasEfetuadas = async () => {
    try {
      // Referência para a coleção de vendas
      const vendasRef = collection(db, 'vendas'); // Supondo que o nome da coleção seja 'vendas'
  
      // Consulta para pegar as vendas com status 'Efetuado'
      const q = query(vendasRef, where('status', '==', 'Efetuado'));
  
      // Executa a consulta
      const querySnapshot = await getDocs(q);
      
      const vendasEfetuadas = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      return vendasEfetuadas;
    } catch (error) {
      console.error('Erro ao obter vendas efetuadas:', error);
      throw error; // Lança o erro para ser tratado no componente
    }
  };

// Função para atualizar a venda no Firestore
export const atualizarVendaNoFirebase = async (vendaAtualizada) => {
  try {
    const vendaRef = doc(db, 'vendas', vendaAtualizada.id);
    await updateDoc(vendaRef, vendaAtualizada); // Atualiza a venda no Firestore
  } catch (error) {
    console.error('Erro ao atualizar a venda:', error);
  }
};
