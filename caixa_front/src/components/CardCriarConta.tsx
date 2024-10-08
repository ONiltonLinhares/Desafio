import React, { useState } from 'react';

interface CardCriarContaProps {
  fetchContas: () => Promise<void>; // Função para atualizar a lista de contas
}

const CardCriarConta: React.FC<CardCriarContaProps> = ({ fetchContas }) => {
  const [nome, setNome] = useState<string>('');
  const [saldo, setSaldo] = useState<number>(0);
  const [tipo, setTipo] = useState<string>('');

  const criarConta = async () => {
    if (tipo !== "poupança" && tipo !== "corrente") {
      alert('Tipo de conta inválido! Por favor, escolha "poupança" ou "corrente".');
      return;
    }

    try {
      const response = await fetch('/contas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, saldo, tipo }),
      });
      if (response.ok) {
        await fetchContas(); // Atualiza a lista de contas
        setNome("");
        setSaldo(0);
        setTipo("");
      } else {
        console.error('Erro ao criar conta:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao criar conta:', error);
    }
  };

  return (
    <div className="acao-card">
      <h3>Criar Conta</h3>
      <label>
        <strong>Nome:</strong>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
      </label>
      <label>
        <strong>Saldo Inicial:</strong>
        <input
          type="number"
          value={saldo}
          onChange={(e) => setSaldo(Number(e.target.value))}
        />
      </label>
      <label>
        <strong>Tipo de Conta:</strong>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="">Selecione o tipo de conta</option>
          <option value="corrente">Corrente</option>
          <option value="poupança">Poupança</option>
        </select>
      </label>
      <button onClick={criarConta}>
        <strong>Criar Conta</strong>
      </button>
    </div>
  );
};

export default CardCriarConta;
