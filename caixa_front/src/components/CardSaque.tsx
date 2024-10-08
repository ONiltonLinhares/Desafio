import React, { useState } from 'react';

interface Conta {
  id: number;
  nome: string;
  saldo: number;
  tipo: string;
  ativo: boolean;
}

interface CardSaqueProps {
  contas: Conta[];
  registrarTransacao: (
    tipoTransacao: string,
    contaOrigem: number | null,
    contaDestino: number | null,
    valor: number,
    observacao: string
  ) => void;
}

const CardSaque: React.FC<CardSaqueProps> = ({ contas, registrarTransacao }) => {
  const [contaSaque, setContaSaque] = useState<number | null>(null);
  const [valorSaque, setValorSaque] = useState<number>(0);
  const [observacaoSaque, setObservacaoSaque] = useState<string>("");

  return (
    <div className="acao-card">
      <h3>Registrar Saque</h3>
      <label>
        <strong>Conta:</strong>
        <select
          value={contaSaque || ""}
          onChange={(e) => setContaSaque(Number(e.target.value))}
        >
          <option value="">Selecione uma conta ativa</option>
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
          value={valorSaque}
          onChange={(e) => setValorSaque(Number(e.target.value))}
        />
      </label>
      <label>
        <strong>Observação:</strong>
        <input
          type="text"
          value={observacaoSaque}
          onChange={(e) => setObservacaoSaque(e.target.value)}
        />
      </label>
      <button onClick={() => registrarTransacao('saque', contaSaque, null, valorSaque, observacaoSaque)}>
        <strong>Registrar Saque</strong>
      </button>
    </div>
  );
};

export default CardSaque;
