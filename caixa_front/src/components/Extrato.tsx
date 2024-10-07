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

const obterNomeConta = (id: number | null, contas: Conta[]): string => {
  const conta = contas.find((c) => c.id === id);
  return conta ? conta.nome : '-';
};

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
    <div className="extrato-container-wrapper">
      
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

      {/* Exibe o extrato da conta */}
      {extrato && (
        <div className="extrato-info">
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
                  <td>{obterNomeConta(transacao.contaOrigem, contas) || '-'}</td>
                  <td>{obterNomeConta(transacao.contaDestino, contas) || '-'}</td>
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
