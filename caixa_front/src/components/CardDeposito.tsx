import React, { useState } from 'react';

interface Conta {
  id: number;
  nome: string;
  saldo: number;
  tipo: string;
  ativo: boolean;
}

interface CardDepositoProps {
  contas: Conta[];
  registrarTransacao: (
    tipoTransacao: string,
    contaOrigem: number | null,
    contaDestino: number | null,
    valor: number,
    observacao: string
  ) => void;
}

const CardDeposito: React.FC<CardDepositoProps> = ({ contas, registrarTransacao }) => {
  const [contaDestinoDeposito, setContaDestinoDeposito] = useState<number | null>(null);
  const [valorDeposito, setValorDeposito] = useState<number>(0);
  const [observacaoDeposito, setObservacaoDeposito] = useState<string>("");

  return (
    <div className="acao-card">
      <h3>Registrar Depósito</h3>
      <label>
        <strong>Conta:</strong>
        <select
          value={contaDestinoDeposito || ""}
          onChange={(e) => setContaDestinoDeposito(Number(e.target.value))}
        >
          <option value="">Selecione uma conta</option>
          {contas
            .filter(conta => conta.ativo)
            .map(conta => (
              <option key={conta.id} value={conta.id}>
                {conta.nome}
              </option>
            ))}
        </select>
      </label>
      <label>
        <strong>Valor:</strong>
        <input
          type="number"
          value={valorDeposito}
          onChange={(e) => setValorDeposito(Number(e.target.value))}
        />
      </label>
      <label>
        <strong>Observação:</strong>
        <input
          type="text"
          value={observacaoDeposito}
          onChange={(e) => setObservacaoDeposito(e.target.value)}
        />
      </label>
      <button onClick={() => registrarTransacao('deposito', null, contaDestinoDeposito, valorDeposito, observacaoDeposito)}>
        <strong>Registrar Depósito</strong>
      </button>
    </div>
  );
};

export default CardDeposito;
