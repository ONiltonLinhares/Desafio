import React, { useState } from 'react';

interface Conta {
  id: number;
  nome: string;
  ativo: boolean;
}

interface CardDesativarContaProps {
  contas: Conta[];
  fetchContas: () => Promise<void>;
}

const CardDesativarConta: React.FC<CardDesativarContaProps> = ({ contas, fetchContas }) => {
  const [contaDesativar, setContaDesativar] = useState<number | null>(null);

  const desativarConta = async () => {
    if (!contaDesativar) {
      alert('Por favor, selecione uma conta para desativar.');
      return;
    }

    const contaParaDesativar = {
      id: contaDesativar,
      ativo: false,
    };

    try {
      const response = await fetch('/contas/alterar-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contaParaDesativar),
      });

      if (response.ok) {
        alert('Conta desativada com sucesso!');
        setContaDesativar(null); // Limpa a seleção
        await fetchContas(); // Atualiza a lista de contas após desativar
      } else {
        console.error('Erro ao desativar conta:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao desativar conta:', error);
    }
  };

  return (
    <div className="acao-card">
      <h3>Desativar Conta</h3>
      <label>
        <strong>Conta:</strong>
        <select
          value={contaDesativar || ""}
          onChange={(e) => setContaDesativar(Number(e.target.value))}
        >
          <option value="">Selecione uma conta ativa</option>
          {contas
            .filter(conta => conta.ativo) // Filtra contas ativas
            .map(conta => (
              <option key={conta.id} value={conta.id}>
                {conta.nome}
              </option>
            ))}
        </select>
      </label>
      <button onClick={desativarConta}>
        <strong>Desativar Conta</strong>
      </button>
    </div>
  );
};

export default CardDesativarConta;
