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

const monthlyData = [
  { mes: "Set", candidatos: 130 },
  { mes: "Out", candidatos: 180 },
  { mes: "Nov", candidatos: 220 },
  { mes: "Dez", candidatos: 185 },
  { mes: "Jan", candidatos: 210 },
  { mes: "Fev", candidatos: 270 },
  { mes: "Mar", candidatos: 360 },
];

const origemData = [
  { name: "Plataforma", value: 55, color: "#1e3a5f" },
  { name: "Indicação",  value: 20, color: "#2bb5a0" },
  { name: "LinkedIn",   value: 18, color: "#2f5496" },
  { name: "Outros",     value: 7,  color: "#8f8f8f" },
];

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
  const [hov, setHov] = useState(null);

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

  useEffect(() => {
    loadJobs();
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

      {/* KPIs */}
      <div className="company-dashboard__kpis">
        <KpiCard
          icon="💼"
          value={vagasAbertas}
          label="Vagas ativas"
          trend="+3"
          trendSub="esta semana"
        />
        <KpiCard
          icon="👥"
          value={totalCandidatos}
          label="Candidatos"
          trend="+128"
          trendSub="este mês"
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
                  <stop offset="5%"  stopColor="#1e3a5f" stopOpacity={0.14} />
                  <stop offset="95%" stopColor="#1e3a5f" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="mes" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="candidatos" stroke="#1e3a5f" fill="url(#gcand)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="dashboard-card">
          <h3>Origem dos candidatos</h3>
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