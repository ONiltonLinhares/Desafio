import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Conta {
  id: number;
  nome: string;
  saldo: number;
  tipo: string;
  ativo: boolean;
}

interface Transacao {
  id: number;
  contaOrigem: number | null;
  contaDestino: number | null;
  valor: number;
  tipoTransacao: string;
  observacao: string;
  dataTransacao: string;
}

interface ExtratoResponse {
  conta: Conta;
  transacoes: Transacao[];
}

const Extrato = ({ contas }: { contas: Conta[] }) => {
  const [contaSelecionada, setContaSelecionada] = useState<Conta | null>(null);
  const [extrato, setExtrato] = useState<ExtratoResponse | null>(null);

  // Função para buscar o extrato da conta selecionada
  const buscarExtrato = async (id: number) => {
    try {
      const response = await axios.get(`/transacoes/extrato/${id}`);
      setExtrato(response.data);
    } catch (error) {
      console.error('Erro ao buscar o extrato:', error);
    }
  };

  // Atualiza o extrato quando a conta selecionada mudar
  useEffect(() => {
    if (contaSelecionada) {
      buscarExtrato(contaSelecionada.id);
    }
  }, [contaSelecionada]);

  return (
    <div className="extrato">
      {/* Dropdown para selecionar a conta */}
      <select className='select-conta'
        value={contaSelecionada?.id || ''}
        onChange={(e) => {
          const conta = contas.find((c) => c.id === Number(e.target.value));
          setContaSelecionada(conta || null);
        }}
      >
        <option value="" disabled>
          Selecione uma conta
        </option>
        {contas.map((conta) => (
          <option key={conta.id} value={conta.id}>
            {conta.nome} - {conta.tipo}
          </option>
        ))}
      </select>

      {/* Exibe as informações da conta selecionada */}
      {contaSelecionada && (
        <div className="conta-info">
          <h3>Informações da Conta</h3>
          <p><strong>Nome:</strong> {contaSelecionada.nome}</p>
          <p><strong>Saldo:</strong> R$ {contaSelecionada.saldo}</p>
          <p><strong>Tipo:</strong> {contaSelecionada.tipo}</p>
        </div>
      )}

      {/* Exibe o extrato da conta */}
      {extrato && (
        <div className="extrato-info">
          <h3>Extrato da Conta</h3>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Origem</th>
                <th>Destino</th>
                <th>Observação</th>
              </tr>
            </thead>
            <tbody>
              {extrato.transacoes.map((transacao) => (
                <tr key={transacao.id}>
                  <td>{new Date(transacao.dataTransacao).toLocaleString()}</td>
                  <td>{transacao.tipoTransacao}</td>
                  <td>R$ {transacao.valor}</td>
                  <td>{transacao.contaOrigem || '-'}</td>
                  <td>{transacao.contaDestino || '-'}</td>
                  <td>{transacao.observacao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Extrato;
