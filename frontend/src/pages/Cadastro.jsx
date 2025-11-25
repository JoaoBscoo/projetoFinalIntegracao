import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import Input from "../components/Input";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setMensagem("");

    if (senha !== confirmacao) {
      setErro("As senhas não conferem.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password: senha,
    });
    setLoading(false);

    if (error) {
      setErro(error.message || "Erro ao cadastrar.");
      return;
    }

    setMensagem("Cadastro realizado! Agora você pode fazer login.");
    setTimeout(() => navigate("/"), 1500);
  }

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Criar conta</h1>
        <p className="subtitle">Use seu e-mail para acessar o painel.</p>

        <form onSubmit={handleSubmit} className="form">
          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@exemplo.com"
            required
          />

          <Input
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            required
          />

          <Input
            label="Confirmar senha"
            type="password"
            value={confirmacao}
            onChange={(e) => setConfirmacao(e.target.value)}
            placeholder="Repita a senha"
            required
          />

          {erro && <div className="error">{erro}</div>}
          {mensagem && <div className="success">{mensagem}</div>}

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Enviando..." : "Cadastrar"}
          </button>
        </form>

        <p className="helper">
          Já tem conta?{" "}
          <Link to="/" className="link">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
