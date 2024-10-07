import React, { useEffect, useState } from 'react';
import './App.css'; // Importando o arquivo CSS
import Extrato from './components/extrato';

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
  const [contaDestinoDeposito, setContaDestinoDeposito] = useState<number | null>(null);
  const [valorDeposito, setValorDeposito] = useState<number>(0);
  const [observacaoDeposito, setObservacaoDeposito] = useState<string>("");

  // Estados para saque
  const [contaSaque, setContaSaque] = useState<number | null>(null);
  const [valorSaque, setValorSaque] = useState<number>(0);
  const [observacaoSaque, setObservacaoSaque] = useState<string>("");

  // Estados para transferência
  const [contaOrigemTransferencia, setContaOrigemTransferencia] = useState<number | null>(null);
  const [contaDestinoTransferencia, setContaDestinoTransferencia] = useState<number | null>(null);
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
        await fetchContas(); // Adicionando chamada para atualizar a lista
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
        await fetchContas(); // Atualiza a lista de contas após registrar a transação
      } else {
        const errorMessage = await response.text();
        alert(`Erro ao registrar ${tipoTransacao}: ${errorMessage}`);
      }
    } catch (error) {
      console.error(`Erro ao registrar ${tipoTransacao}: `, error);
      alert(`Erro ao registrar ${tipoTransacao}. Verifique o console para mais detalhes.`);
    }
  };

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
        setContaDesativar(null);
        await fetchContas(); // Atualiza a lista de contas após desativar
      } else {
        console.error('Erro ao desativar conta:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao desativar conta:', error);
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
      <div className="contas-container-wrapper">
        <div className="contas-container">
          {contas.length > 0 ? (
            contas.map((conta) => (
              <div className="conta-card" key={conta.id}>
                <strong>Nome:</strong> {conta.nome} <br />
                <strong>Saldo:</strong> R${conta.saldo.toFixed(2)} <br />
                <strong>Tipo:</strong> {conta.tipo} <br />
                <strong>Status:</strong> {conta.ativo ? "Ativa" : "Desativada"} <br />
              </div>
            ))
          ) : (
            <div>Nenhuma conta encontrada.</div>
          )}
        </div>
      </div>
      <div className="acoes-container-wrapper">
        {/* Card de Criar Conta */}
        <div className="acao-card">
          <h3>Criar Conta</h3>
          <label>
            Nome:
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </label>
          <label>
            Saldo:
            <input
              type="number"
              value={saldo}
              onChange={(e) => setSaldo(Number(e.target.value))}
            />
          </label>
          <label>
            Tipo:
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="">Selecione um tipo</option>
              <option value="poupança">Poupança</option>
              <option value="corrente">Corrente</option>
            </select>
          </label>
          <button onClick={criarConta}>Criar Conta</button>
        </div>

        {/* Card de Registrar Depósito */}
        <div className="acao-card">
          <h3>Registrar Depósito</h3>
          <label>
            Conta:
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
            Valor:
            <input
              type="number"
              value={valorDeposito}
              onChange={(e) => setValorDeposito(Number(e.target.value))}
            />
          </label>
          <label>
            Observação:
            <input
              type="text"
              value={observacaoDeposito}
              onChange={(e) => setObservacaoDeposito(e.target.value)}
            />
          </label>
          <button onClick={() => registrarTransacao('deposito', null, contaDestinoDeposito, valorDeposito, observacaoDeposito)}>
            Registrar Depósito
          </button>
        </div>

        {/* Card de Registrar Saque */}
        <div className="acao-card">
          <h3>Registrar Saque</h3>
          <label>
            Conta:
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
            Valor:
            <input
              type="number"
              value={valorSaque}
              onChange={(e) => setValorSaque(Number(e.target.value))}
            />
          </label>
          <label>
            Observação:
            <input
              type="text"
              value={observacaoSaque}
              onChange={(e) => setObservacaoSaque(e.target.value)}
            />
          </label>
          <button onClick={() => registrarTransacao('saque', contaSaque, null, valorSaque, observacaoSaque)}>
            Registrar Saque
          </button>
        </div>

        {/* Card de Transferência */}
        <div className="acao-card">
          <h3>Transferir entre Contas</h3>
          <label>
            Conta de Origem:
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
            Conta de Destino:
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
            Valor:
            <input
              type="number"
              value={valorTransferencia}
              onChange={(e) => setValorTransferencia(Number(e.target.value))}
            />
          </label>
          <label>
            Observação:
            <input
              type="text"
              value={observacaoTransferencia}
              onChange={(e) => setObservacaoTransferencia(e.target.value)}
            />
          </label>
          <button onClick={() => registrarTransacao('transferencia', contaOrigemTransferencia, contaDestinoTransferencia, valorTransferencia, observacaoTransferencia)}>
            Transferir
          </button>
        </div>

        {/* Card de Desativar Conta */}
        <div className="acao-card">
          <h3>Desativar Conta</h3>
          <label>
            Conta:
            <select
              value={contaDesativar || ""}
              onChange={(e) => setContaDesativar(Number(e.target.value))}
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
          <button onClick={desativarConta}>Desativar Conta</button>
        </div>
      </div>

      <div className='teste'>
       <Extrato contas={contas} />
      </div>
    </div>
  );
};

export default App;
