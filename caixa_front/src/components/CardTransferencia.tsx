import React, { useState } from 'react';

interface Conta {
  id: number;
  nome: string;
  saldo: number;
  tipo: string;
  ativo: boolean;
}

interface CardTransferenciaProps {
  contas: Conta[];
  registrarTransacao: (
    tipoTransacao: string,
    contaOrigem: number | null,
    contaDestino: number | null,
    valor: number,
    observacao: string
  ) => void;
}

const CardTransferencia: React.FC<CardTransferenciaProps> = ({ contas, registrarTransacao }) => {
  const [contaOrigemTransferencia, setContaOrigemTransferencia] = useState<number | null>(null);
  const [contaDestinoTransferencia, setContaDestinoTransferencia] = useState<number | null>(null);
  const [valorTransferencia, setValorTransferencia] = useState<number>(0);
  const [observacaoTransferencia, setObservacaoTransferencia] = useState<string>("");

  return (
    <div className="acao-card">
      <h3>Transferir entre Contas</h3>
      <label>
        <strong>Conta de Origem:</strong>
        <select
          value={contaOrigemTransferencia || ""}
          onChange={(e) => setContaOrigemTransferencia(Number(e.target.value))}
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
        <strong>Conta de Destino:</strong>
        <select
          value={contaDestinoTransferencia || ""}
          onChange={(e) => setContaDestinoTransferencia(Number(e.target.value))}
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
          value={valorTransferencia}
          onChange={(e) => setValorTransferencia(Number(e.target.value))}
        />
      </label>
      <label>
        <strong>Observação:</strong>
        <input
          type="text"
          value={observacaoTransferencia}
          onChange={(e) => setObservacaoTransferencia(e.target.value)}
        />
      </label>
      <button
        onClick={() => registrarTransacao('transferencia', contaOrigemTransferencia, contaDestinoTransferencia, valorTransferencia, observacaoTransferencia)}
      >
        <strong>Transferir</strong>
      </button>
    </div>
  );
};

export default CardTransferencia;
