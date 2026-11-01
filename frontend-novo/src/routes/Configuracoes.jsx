import { useState } from "react";

import {
  Settings,
  Building2,
  Palette,
  Bell,
  Save,
  RotateCcw,
} from "lucide-react";

import "./Configuracoes.css";

export default function Configuracoes() {
  const [instituicao, setInstituicao] = useState({
    nome: "CELC",
    email: "",
    telefone: ""
  });

  const [aparencia, setAparencia] = useState("claro");
  const [notificacoes, setNotificacoes] = useState(true);
  const [mensagem, setMensagem] = useState("");

  function atualizarInstituicao(event) {
    const { name, value } = event.target;

    setInstituicao((dadosAtuais) => ({
      ...dadosAtuais,
      [name]: value
    }));
  }

  function salvarConfiguracoes(event) {
    event.preventDefault();

    setMensagem(
      "Alterações realizadas nesta tela. O salvamento permanente será conectado posteriormente."
    );
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
              <Building2 size={22} />
            </div>

            <div>
              <h2>Dados da instituição</h2>
              <p>Informações gerais para identificação do sistema.</p>
            </div>

          </div>

          <div className="configuracoes-campos">

            <label className="configuracoes-campo">
              <span>Nome da instituição</span>

              <input
                type="text"
                name="nome"
                value={instituicao.nome}
                onChange={atualizarInstituicao}
                placeholder="Digite o nome da instituição"
              />
            </label>

            <label className="configuracoes-campo">
              <span>E-mail de contato</span>

              <input
                type="email"
                name="email"
                value={instituicao.email}
                onChange={atualizarInstituicao}
                placeholder="contato@instituicao.com"
              />
            </label>

            <label className="configuracoes-campo">
              <span>Telefone</span>

              <input
                type="tel"
                name="telefone"
                value={instituicao.telefone}
                onChange={atualizarInstituicao}
                placeholder="(00) 00000-0000"
              />
            </label>

          </div>
        </section>

        <section className="configuracoes-card">

          <div className="configuracoes-card-header">

            <div className="configuracoes-card-icone">
              <Palette size={22} />
            </div>

            <div>
              <h2>Aparência</h2>
              <p>Escolha a aparência desejada para o sistema.</p>
            </div>

          </div>

          <div className="configuracoes-opcoes">

            <label className="configuracoes-opcao">
              <div>
                <strong>Tema claro</strong>
                <p>Fundo claro e conteúdo com alto contraste.</p>
              </div>

              <input
                type="radio"
                name="aparencia"
                value="claro"
                checked={aparencia === "claro"}
                onChange={(event) => setAparencia(event.target.value)}
              />
            </label>

            <label className="configuracoes-opcao">
              <div>
                <strong>Tema escuro</strong>
                <p>Aparência escura para reduzir o brilho da tela.</p>
              </div>

              <input
                type="radio"
                name="aparencia"
                value="escuro"
                checked={aparencia === "escuro"}
                onChange={(event) => setAparencia(event.target.value)}
              />
            </label>

          </div>
        </section>

        <section className="configuracoes-card">

          <div className="configuracoes-card-header">

            <div className="configuracoes-card-icone">
              <Bell size={22} />
            </div>

            <div>
              <h2>Notificações</h2>
              <p>Controle suas preferências de comunicação.</p>
            </div>

          </div>

          <label className="configuracoes-opcao">

            <div>
              <strong>Ativar notificações</strong>
              <p>Permite habilitar ou desabilitar notificações do sistema.</p>
            </div>

            <input
              className="configuracoes-switch"
              type="checkbox"
              checked={notificacoes}
              onChange={(event) => setNotificacoes(event.target.checked)}
            />

          </label>
        </section>

        {mensagem && (
          <div className="configuracoes-mensagem" role="status">
            {mensagem}
          </div>
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
          >
            <Save size={18} />
            Salvar configurações
          </button>

        </div>
      </form>
    </main>
  );
}