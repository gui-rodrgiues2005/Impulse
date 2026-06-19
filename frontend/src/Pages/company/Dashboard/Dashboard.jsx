import "./Dashboard.scss";

import { useEffect, useState } from "react";

import API_URL from "../../../service/api";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";


const SOURCE_COLORS = {
  Plataforma: "#1e3a5f",
  "Indicação": "#2bb5a0",
  LinkedIn: "#2f5496",
  Outros: "#8f8f8f",
};

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="chart-tooltip__item" style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

function KpiCard({ icon, value, label, trend, trendSub }) {
  return (
    <div className="kpi-card">
      <span className="kpi-card__icon-link">↗</span>
      <div className="kpi-card__icon">{icon}</div>
      <div className="kpi-card__value">{value}</div>
      <div className="kpi-card__label">{label}</div>
      <div className="kpi-card__trend">{trend} {trendSub}</div>
    </div>
  );
}

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [origemData, setOrigemData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [hov, setHov] = useState(null);

  const [stats, setStats] = useState({
    vagasAbertas: 0,
    novasVagasSemana: 0,
    totalCandidatos: 0,
    candidatosSemana: 0,
  });

  async function loadJobs() {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const response = await fetch(`${API_URL}/Company/${user.companyId}/jobs`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setJobs(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadApplicationSources() {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const response = await fetch(
        `${API_URL}/Jobs/${user.companyId}/applications/sources`
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      const formatted = data.map((item) => ({
        name: item.source,
        value: item.count,
        color: SOURCE_COLORS[item.source] || FALLBACK_SOURCE_COLOR,
      }));

      setOrigemData(formatted);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadMonthlyApplications() {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const response = await fetch(
        `${API_URL}/Jobs/${user.companyId}/applications/monthly`
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      // Converte chaves do C# (PascalCase) para o formato que o gráfico espera
      const formatted = data.map((item) => ({
        mes: item.mes,
        candidatos: parseInt(item.candidatos, 10), 
      }));

      setMonthlyData(formatted);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadStats() {
    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const response = await fetch(
        `${API_URL}/Jobs/${user.companyId}/dashboard/stats`
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      setStats({
        vagasAbertas: data.vagasAbertas,
        novasVagasSemana: data.novasVagasSemana,
        totalCandidatos: data.totalCandidatos,
        candidatosSemana: data.candidatosSemana,
      });
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    loadJobs();
    loadStats();
    loadApplicationSources();
    loadMonthlyApplications();
  }, []);

  const vagasAbertas = jobs.filter((j) => j.status === "Aberta").length;
  const totalCandidatos = jobs.reduce((acc, curr) => acc + (curr.candidates || 0), 0);

  return (
    <div className="company-dashboard">

      <div className="company-dashboard__header">
        <div>
          <p className="company-dashboard__subtitle">Console Corporativo</p>
          <h1 className="company-dashboard__title">Dashboard da empresa</h1>
        </div>
      </div>

      <div className="company-dashboard__kpis">
        <KpiCard
          icon="💼"
          value={stats.vagasAbertas}
          label="Vagas ativas"
          trend={`+${stats.novasVagasSemana}`}
          trendSub="esta semana"
        />
        <KpiCard
          icon="👥"
          value={stats.totalCandidatos}
          label="Candidatos"
          trend={`+${stats.candidatosSemana}`}
          trendSub="esta semana"
        />
      </div>

      {/* GRÁFICOS */}
      <div className="company-dashboard__charts">

        <div className="dashboard-card dashboard-card--large">
          <div className="dashboard-card__header">
            <div>
              <h3>Crescimento mensal</h3>
              <p>Fluxo de candidatos</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="gcand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e3a5f" stopOpacity={0.14} />
                  <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} allowDecimals={false}/>
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="candidatos" stroke="#1e3a5f" fill="url(#gcand)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card">
          <h3>Origem dos candidatos</h3>
          {origemData.length === 0 ? (
            <p className="dashboard-card__empty">Nenhuma candidatura registrada ainda.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={origemData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={90}
                  onMouseEnter={(_, i) => setHov(i)}
                  onMouseLeave={() => setHov(null)}
                >
                  {origemData.map((e, i) => (
                    <Cell
                      key={i}
                      fill={e.color}
                      opacity={hov === null || hov === i ? 1 : 0.4}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* TABELA DE VAGAS */}
      <div className="dashboard-card">
        <div className="dashboard-card__header">
          <div>
            <h3>Vagas recentes</h3>
            <p>Pipeline da empresa</p>
          </div>
        </div>
        <table className="jobs-table">
          <thead>
            <tr>
              <th>VAGA</th>
              <th>ÁREA</th>
              <th>CANDIDATOS</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.area}</td>
                <td>{job.candidates}</td>
                <td>
                  <span className="status-badge">{job.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}