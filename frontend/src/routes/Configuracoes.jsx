import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import api from "../services/api";

import {
  Settings,
  Building2,
  Palette,
  Bell,
  Save,
  RotateCcw,
  Wallet,
} from "lucide-react";

import "./Configuracoes.css";

export default function Configuracoes() {
  const { recarregarSaldos } = useOutletContext() || {};

  const [instituicao, setInstituicao] = useState({
    nome: "CELC",
    email: "",
    telefone: ""
  });

  // Saldos iniciais (guardados no banco, na tabela configuracoes)
  const [saldoBancario, setSaldoBancario] = useState("");
  const [saldoDinheiro, setSaldoDinheiro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const [aparencia, setAparencia] = useState("claro");
  const [notificacoes, setNotificacoes] = useState(true);
  const [mensagem, setMensagem] = useState("");

  // Carrega os saldos iniciais do banco ao abrir a tela
  useEffect(() => {
    async function carregarConfiguracoes() {
      try {
        const { data } = await api.get("contas/configuracoes");
        setSaldoBancario(Number(data.dados.saldo_inicial_banco));
        setSaldoDinheiro(Number(data.dados.saldo_inicial_dinheiro));
      } catch (erro) {
        console.error("Erro ao carregar configurações:", erro);
        setMensagem("Não foi possível carregar os saldos iniciais.");
      }
    }
    carregarConfiguracoes();
  }, []);

  function atualizarInstituicao(event) {
    const { name, value } = event.target;

    setInstituicao((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value
    }));
  }

  async function salvarConfiguracoes(event) {
    event.preventDefault();
    setMensagem("");
    setSalvando(true);

    try {
      await api.put("contas/configuracoes", {
        saldo_inicial_banco: Number(saldoBancario) || 0,
        saldo_inicial_dinheiro: Number(saldoDinheiro) || 0,
      });

      // Atualiza o cabeçalho com os novos saldos
      if (recarregarSaldos) {
        await recarregarSaldos();
      }

      setMensagem("Configurações e saldos iniciais salvos com sucesso!");
    } catch (erro) {
      console.error("Erro ao salvar configurações:", erro);
      setMensagem("Erro ao salvar as configurações. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="configuracoes-page">

      <header className="configuracoes-header">
        <div className="configuracoes-titulo">

          <div className="configuracoes-icone">
            <Settings size={28} />
          </div>

          <div>
            <h1>Configurações</h1>
            <p>Gerencie as preferências do CELC Finanças.</p>
          </div>

        </div>
      </header>

      <form
        className="configuracoes-form"
        onSubmit={salvarConfiguracoes}
      >

        <section className="configuracoes-card">

          <div className="configuracoes-card-header">

            <div className="configuracoes-card-icone">
              <Wallet size={22} />
            </div>

            <div>
              <h2>Conta bancária e saldo inicial</h2>
              <p>Defina o saldo base da conta bancária e do dinheiro em caixa.</p>
            </div>

          </div>

          <div className="configuracoes-campos">

            <label className="configuracoes-campo">
              <span>Saldo inicial em conta (R$)</span>

              <input
                type="number"
                step="0.01"
                min="0"
                value={saldoBancario}
                onChange={(event) => setSaldoBancario(event.target.value)}
                placeholder="Ex.: 10000.00"
              />
            </label>

            <label className="configuracoes-campo">
              <span>Saldo inicial em dinheiro (R$)</span>

              <input
                type="number"
                step="0.01"
                min="0"
                value={saldoDinheiro}
                onChange={(event) => setSaldoDinheiro(event.target.value)}
                placeholder="Ex.: 10000.00"
              />
            </label>

          </div>
        </section>

        {mensagem && (
          <div className="configuracoes-mensagem">{mensagem}</div>
        )}

        <div className="configuracoes-acoes">

          <button
            type="button"
            className="configuracoes-botao secundario"
            onClick={() => {
              setInstituicao({
                nome: "CELC",
                email: "",
                telefone: ""
              });
              setSaldoBancario(0);
              setSaldoDinheiro(0);
              setAparencia("claro");
              setNotificacoes(true);
              setMensagem("");
            }}
          >
            <RotateCcw size={17} />
            Restaurar padrões
          </button>

          <button
            type="submit"
            className="configuracoes-botao principal"
            disabled={salvando}
          >
            <Save size={18} />
            {salvando ? "Salvando..." : "Salvar configurações"}
          </button>

        </div>
      </form>
    </main>
  );
}