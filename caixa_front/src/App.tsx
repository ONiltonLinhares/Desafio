import React, { useEffect, useState } from 'react';
import './App.css'; // Importando o arquivo CSS
import Extrato from './components/Extrato';
import CardCriarConta from './components/CardCriarConta';
import CardDeposito from './components/CardDeposito';
import CardSaque from './components/CardSaque';
import CardTransferencia from './components/CardTransferencia';
import CardDesativarConta from './components/CardDesativarConta';

interface Conta {
  id: number;
  nome: string;
  saldo: number;
  tipo: string;
  ativo: boolean;
}

const App: React.FC = () => {
  const [contas, setContas] = useState<Conta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [nome, setNome] = useState<string>("");
  const [saldo, setSaldo] = useState<number>(0);
  const [tipo, setTipo] = useState<string>("");

  // Estados para depósito
  const [valorDeposito, setValorDeposito] = useState<number>(0);
  const [observacaoDeposito, setObservacaoDeposito] = useState<string>("");

  // Estados para saque
  const [valorSaque, setValorSaque] = useState<number>(0);
  const [observacaoSaque, setObservacaoSaque] = useState<string>("");

  // Estados para transferência
  const [valorTransferencia, setValorTransferencia] = useState<number>(0);
  const [observacaoTransferencia, setObservacaoTransferencia] = useState<string>("");

  // Estado para desativar conta
  const [contaDesativar, setContaDesativar] = useState<number | null>(null);

  useEffect(() => {
    fetchContas();
  }, []);

  const fetchContas = async () => {
    try {
      const response = await fetch('/contas');
      const data: Conta[] = await response.json();
      setContas(data);
    } catch (error) {
      console.error('Erro ao buscar contas:', error);
    } finally {
      setLoading(false);
    }
  };

  const registrarTransacao = async (tipoTransacao: string, contaOrigem: number | null, contaDestino: number | null, valor: number, observacao: string) => {
    if (valor <= 0 || !observacao) {
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    const transacao: any = {
      valor,
      tipoTransacao,
      observacao,
      contaOrigem,
      contaDestino,
    };

    try {
      const response = await fetch('/transacoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transacao),
      });

      if (response.ok) {
        alert(`${tipoTransacao.charAt(0).toUpperCase() + tipoTransacao.slice(1)} registrado com sucesso!`);
        setValorDeposito(0);
        setObservacaoDeposito("");
        setValorSaque(0);
        setObservacaoSaque("");
        setValorTransferencia(0);
        setObservacaoTransferencia("");
        await fetchContas(); 
      } else {
        const errorMessage = await response.text();
        alert(`Erro ao registrar ${tipoTransacao}: ${errorMessage}`);
      }
    } catch (error) {
      console.error(`Erro ao registrar ${tipoTransacao}: `, error);
      alert(`Erro ao registrar ${tipoTransacao}. Verifique o console para mais detalhes.`);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="app-container">
      <header>
        Sistema de Caixa
      </header>

      <h2>Contas</h2>
      <div className="contas-container-wrapper">
        <div className="contas-container">
          {contas.length > 0 ? (
            contas.map((conta) => (
              <div className="conta-card" key={conta.id}>
                <strong>Nome:</strong> {conta.nome} <br />
                <strong>Saldo:</strong> R${conta.saldo.toFixed(2)} <br />
                <strong>Tipo:</strong> {conta.tipo} <br />
              </div>
            ))
          ) : (
            <div>Nenhuma conta encontrada.</div>
          )}
        </div>
      </div>

      <h2>Ações</h2>
      <div className="acoes-container-wrapper">
        {/* Card de Criar Conta */}
        <CardCriarConta fetchContas={fetchContas} />

        {/* Card de Registrar Depósito */}
        <CardDeposito contas={contas} registrarTransacao={registrarTransacao} />

        {/* Card de Registrar Saque */}
        <CardSaque contas={contas} registrarTransacao={registrarTransacao} />

        {/* Card de Transferência */}
        <CardTransferencia contas={contas} registrarTransacao={registrarTransacao} />

        {/* Card de Desativar Conta */}
        <CardDesativarConta contas={contas} fetchContas={fetchContas} />
      </div>

      <h2>Extrato</h2>
      <Extrato contas={contas} />
    </div>
  );
};

export default App;
