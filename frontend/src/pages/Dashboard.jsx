import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { buscarSimulacoes } from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

export default function Dashboard() {
  const [base, setBase] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [data, setData] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [resumo, setResumo] = useState(null);
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("sb_session");
    navigate("/");
  }

  async function handleBuscar(e) {
    e.preventDefault();
    setErro("");
    setResumo(null);
    setLoading(true);

    try {
      const dados = await buscarSimulacoes({ base, usuario, senha, data });
      console.log("Resposta backend:", dados);
      setResumo(dados);
    } catch (err) {
      console.error(err);
      setErro("Erro ao buscar simulações. Verifique os dados informados.");
    } finally {
      setLoading(false);
    }
  }

  // ===== Dados derivados para gráficos =====
  const rotasResumo = resumo?.rotasResumo ?? [];
  const porTipoVeiculo = resumo?.porTipoVeiculo ?? [];

  // limitar número de rotas mostradas para não poluir
  const topRotasPorKm = [...rotasResumo]
    .sort((a, b) => (b.quantidadeKM || 0) - (a.quantidadeKM || 0))
    .slice(0, 10);

  const topRotasPorPedidos = [...rotasResumo]
    .sort((a, b) => (b.quantidadePedidos || 0) - (a.quantidadePedidos || 0))
    .slice(0, 10);

  const utilizacaoData = resumo
    ? [
        { nome: "Capacidade", valor: Number(resumo.utilizacaoMedia || 0) },
        { nome: "Volume", valor: Number(resumo.utilizacaoVolumeMedia || 0) },
        {
          nome: "Cubagem",
          valor: Number(resumo.utilizacaoCubagemMedia || 0),
        },
      ]
    : [];

  const pieColors = ["#0ea5e9", "#38bdf8", "#6366f1", "#22c55e", "#14b8a6"];

  return (
    <div className="page">
      <div className="card card-wide">
        {/* Cabeçalho */}
        <div className="top-row">
          <div>
            <h1 className="title">Painel de Simulações</h1>
            <p className="subtitle">
              Informe as credenciais do sistema e a data desejada.
            </p>
          </div>
          <button className="button-outlined" onClick={handleLogout}>
            Sair
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleBuscar} className="form form-inline">
          <Input
            label="Base"
            value={base}
            onChange={(e) => setBase(e.target.value)}
            placeholder="pathfind_triunfante_cg_imp"
            required
          />

          <Input
            label="Usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Usuário do sistema"
            required
          />

          <Input
            label="Senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha do sistema"
            required
          />

          <Input
            label="Data"
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            required
          />

          <button className="button" type="submit" disabled={loading}>
            {loading ? "Processando..." : "Buscar simulações"}
          </button>
        </form>

        {erro && <div className="error mt">{erro}</div>}

        {/* Totalizadores */}
        {resumo && (
          <>
            <div className="grid mt">
              <div className="metric">
                <span className="metric-label">Simulações</span>
                <span className="metric-value">
                  {resumo.totalSimulacoes ?? "-"}
                </span>
              </div>
              <div className="metric">
                <span className="metric-label">Rotas</span>
                <span className="metric-value">{resumo.totalRotas ?? "-"}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Pedidos</span>
                <span className="metric-value">
                  {resumo.totalPedidos ?? "-"}
                </span>
              </div>
              <div className="metric">
                <span className="metric-label">Visitas</span>
                <span className="metric-value">
                  {resumo.totalVisitas ?? "-"}
                </span>
              </div>
            </div>

            <div className="grid mt">
              <div className="metric">
                <span className="metric-label">Veículos</span>
                <span className="metric-value">
                  {resumo.totalVeiculos ?? "-"}
                </span>
              </div>
              <div className="metric">
                <span className="metric-label">Itens</span>
                <span className="metric-value">{resumo.totalItens ?? "-"}</span>
              </div>
              <div className="metric">
                <span className="metric-label">Km total</span>
                <span className="metric-value">
                  {resumo.kmTotal != null
                    ? Number(resumo.kmTotal).toFixed(1)
                    : "-"}
                </span>
              </div>
              <div className="metric">
                <span className="metric-label">Peso total (kg)</span>
                <span className="metric-value">
                  {resumo.pesoTotal != null
                    ? Number(resumo.pesoTotal).toFixed(0)
                    : "-"}
                </span>
              </div>
            </div>

            {/* Utilização média */}
            <div className="mt">
              <h2 className="subtitle" style={{ marginBottom: 8 }}>
                Utilização média
              </h2>
              <div
                className="card"
                style={{
                  padding: 16,
                  background: "rgba(15,23,42,0.85)",
                  borderRadius: 20,
                }}
              >
                <div style={{ width: "100%", height: 220 }}>
                  <ResponsiveContainer>
                    <BarChart data={utilizacaoData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis
                        dataKey="nome"
                        tick={{ fill: "#e5e7eb", fontSize: 11 }}
                      />
                      <YAxis
                        unit="%"
                        tick={{ fill: "#e5e7eb", fontSize: 11 }}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="valor"
                        name="Utilização (%)"
                        fill="#0ea5e9"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Km por rota / Pedidos por rota (gráficos horizontais) */}
            <div className="charts-row mt">
              <div className="chart-card">
                <h2 className="chart-title">Km por rota (top 10)</h2>
                <div className="chart-inner">
                  <ResponsiveContainer>
                    <BarChart
                      data={topRotasPorKm}
                      layout="vertical"
                      margin={{
                        top: 10,
                        right: 20,
                        bottom: 10,
                        left: 80,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis
                        type="number"
                        tick={{ fill: "#e5e7eb", fontSize: 11 }}
                      />
                      <YAxis
                        type="category"
                        dataKey="nomeRota"
                        tick={{ fill: "#e5e7eb", fontSize: 10 }}
                        width={80}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="quantidadeKM" name="Km" fill="#38bdf8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card">
                <h2 className="chart-title">Pedidos por rota (top 10)</h2>
                <div className="chart-inner">
                  <ResponsiveContainer>
                    <BarChart
                      data={topRotasPorPedidos}
                      layout="vertical"
                      margin={{
                        top: 10,
                        right: 20,
                        bottom: 10,
                        left: 80,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis
                        type="number"
                        tick={{ fill: "#e5e7eb", fontSize: 11 }}
                      />
                      <YAxis
                        type="category"
                        dataKey="nomeRota"
                        tick={{ fill: "#e5e7eb", fontSize: 10 }}
                        width={80}
                      />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="quantidadePedidos"
                        name="Pedidos"
                        fill="#6366f1"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Km / Peso por tipo de veículo */}
            <div className="charts-row mt">
              <div className="chart-card">
                <h2 className="chart-title">Km por tipo de veículo</h2>
                <div className="chart-inner">
                  <ResponsiveContainer>
                    <PieChart>
                      <Tooltip />
                      <Legend />
                      <Pie
                        data={porTipoVeiculo}
                        dataKey="kmTotal"
                        nameKey="tipoVeiculo"
                        outerRadius="80%"
                        label
                      >
                        {porTipoVeiculo.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={pieColors[index % pieColors.length]}
                          />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-card">
                <h2 className="chart-title">Peso por tipo de veículo</h2>
                <div className="chart-inner">
                  <ResponsiveContainer>
                    <BarChart data={porTipoVeiculo}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis
                        dataKey="tipoVeiculo"
                        tick={{ fill: "#e5e7eb", fontSize: 11 }}
                      />
                      <YAxis tick={{ fill: "#e5e7eb", fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="pesoTotal"
                        name="Peso (kg)"
                        fill="#22c55e"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
