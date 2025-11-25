import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import Input from "../components/Input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    setLoading(false);

    if (error) {
      setErro(error.message || "Erro ao entrar.");
      return;
    }

    if (data.session) {
      localStorage.setItem("sb_session", JSON.stringify(data.session));
      navigate(from, { replace: true });
    }
  }

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Roteirizador Insights</h1>
        <p className="subtitle">Acesse para visualizar suas simulações.</p>

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
            placeholder="Sua senha"
            required
          />

          {erro && <div className="error">{erro}</div>}

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="helper">
          Não tem conta?{" "}
          <Link to="/cadastro" className="link">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
