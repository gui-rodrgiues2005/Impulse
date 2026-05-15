import "./Dashboard.scss";

import { useState } from "react";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const monthlyData = [
  { mes: "Set", candidatos: 130, contratacoes: 5 },
  { mes: "Out", candidatos: 180, contratacoes: 7 },
  { mes: "Nov", candidatos: 220, contratacoes: 10 },
  { mes: "Dez", candidatos: 185, contratacoes: 8 },
  { mes: "Jan", candidatos: 210, contratacoes: 9 },
  { mes: "Fev", candidatos: 270, contratacoes: 12 },
  { mes: "Mar", candidatos: 360, contratacoes: 15 },
];

const funnelData = [
  { etapa: "Triagem", valor: 440 },
  { etapa: "Entrevista", valor: 320 },
  { etapa: "Teste", valor: 210 },
  { etapa: "Proposta", valor: 90 },
  { etapa: "Contratado", valor: 55 },
];

const origemData = [
  { name: "Plataforma", value: 55, color: "#1e3a5f" },
  { name: "Indicação", value: 20, color: "#2bb5a0" },
  { name: "LinkedIn", value: 18, color: "#2f5496" },
  { name: "Outros", value: 7, color: "#8f8f8f" },
];

const vagas = [
  {
    titulo: "Analista de Marketing Jr.",
    area: "Marketing",
    candidatos: 86,
    status: "Aberta",
    abertoHa: "4d",
  },
  {
    titulo: "Estagiário em Engenharia Civil",
    area: "Engenharia",
    candidatos: 142,
    status: "Aberta",
    abertoHa: "9d",
  },
];

const indicadores = [
  {
    label: "Taxa de contratação",
    value: "6.3%",
    badge: "+0.8 pts",
    positive: true,
  },
  {
    label: "Tempo médio de contratação",
    value: "21 dias",
    badge: "-3 dias",
    positive: true,
  },
];

const statusStyle = {
  Aberta: {
    background: "#eaf6f1",
    color: "#1a7a56",
    border: "1px solid #b3dece",
  },
};

function badgeCss(positive) {
  if (positive === true)
    return {
      background: "#eaf6f1",
      color: "#1a7a56",
    };

  return {
    background: "#f4f4f2",
    color: "#5f5f5f",
  };
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>

      {payload.map((p, i) => (
        <p
          key={i}
          className="chart-tooltip__item"
          style={{ color: p.color }}
        >
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

function KpiCard({ icon, value, label, trend, trendSub }) {
  return (
    <div className="kpi-card">

      <span className="kpi-card__icon-link">
        ↗
      </span>

      <div className="kpi-card__icon">
        {icon}
      </div>

      <div className="kpi-card__value">
        {value}
      </div>

      <div className="kpi-card__label">
        {label}
      </div>

      {trend && (
        <div className="kpi-card__trend">
          {trend} {trendSub}
        </div>
      )}

    </div>
  );
}

export default function Dashboard() {

  const [hov, setHov] = useState(null);

  return (
    <div className="company-dashboard">

      <div className="company-dashboard__header">

        <div>

          <p className="company-dashboard__subtitle">
            Console Corporativo
          </p>

          <h1 className="company-dashboard__title">
            Empresa ABC · Visão geral
          </h1>

        </div>

        <div className="company-dashboard__actions">

          <button className="secondary-btn">
            Exportar
          </button>

          <button className="primary-btn">
            Nova vaga
          </button>

        </div>

      </div>

      <div className="company-dashboard__kpis">

        <KpiCard
          icon="💼"
          value="24"
          label="Vagas ativas"
          trend="+3"
          trendSub="esta semana"
        />

        <KpiCard
          icon="👥"
          value="1.482"
          label="Candidatos totais"
          trend="+128"
          trendSub="este mês"
        />

      </div>

      <div className="company-dashboard__charts">

        <div className="dashboard-card dashboard-card--large">

          <div className="dashboard-card__header">

            <div>

              <h3>Crescimento mensal</h3>

              <p>
                Candidatos x contratações
              </p>

            </div>

          </div>

          <ResponsiveContainer
            width="100%"
            height={240}
          >
            <AreaChart data={monthlyData}>

              <defs>

                <linearGradient
                  id="gcand"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="#1e3a5f"
                    stopOpacity={0.14}
                  />

                  <stop
                    offset="95%"
                    stopColor="#1e3a5f"
                    stopOpacity={0}
                  />

                </linearGradient>

              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />

              <XAxis
                dataKey="mes"
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<ChartTooltip />} />

              <Area
                type="monotone"
                dataKey="candidatos"
                stroke="#1e3a5f"
                fill="url(#gcand)"
              />

            </AreaChart>
          </ResponsiveContainer>

        </div>

        <div className="dashboard-card">

          <h3>Origem dos candidatos</h3>

          <ResponsiveContainer
            width="100%"
            height={240}
          >
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
                    opacity={
                      hov === null || hov === i
                        ? 1
                        : 0.4
                    }
                  />
                ))}

              </Pie>

              <Legend />

            </PieChart>
          </ResponsiveContainer>

        </div>

      </div>

      <div className="company-dashboard__bottom">

        <div className="dashboard-card dashboard-card--large">

          <h3>Funil de contratação</h3>

          <ResponsiveContainer
            width="100%"
            height={240}
          >
            <BarChart
              data={funnelData}
              layout="vertical"
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
              />

              <XAxis
                type="number"
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                type="category"
                dataKey="etapa"
                axisLine={false}
                tickLine={false}
              />

              <Tooltip content={<ChartTooltip />} />

              <Bar
                dataKey="valor"
                fill="#1e2d45"
                radius={[0, 5, 5, 0]}
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

        <div className="dashboard-card">

          <h3>Indicadores</h3>

          <div className="indicator-list">

            {indicadores.map((ind, i) => (

              <div
                key={i}
                className="indicator-item"
              >

                <div>

                  <p>{ind.label}</p>

                  <h2>{ind.value}</h2>

                </div>

                <span
                  style={badgeCss(ind.positive)}
                >
                  {ind.badge}
                </span>

              </div>

            ))}

          </div>

        </div>

      </div>

      <div className="dashboard-card">

        <div className="dashboard-card__header">

          <div>

            <h3>Vagas recentes</h3>

            <p>
              Pipeline de candidatos
            </p>

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

            {vagas.map((v, i) => {

              const s =
                statusStyle[v.status];

              return (

                <tr key={i}>

                  <td>{v.titulo}</td>

                  <td>{v.area}</td>

                  <td>{v.candidatos}</td>

                  <td>
                    <span
                      className="status-badge"
                      style={s}
                    >
                      {v.status}
                    </span>
                  </td>

                </tr>

              );
            })}

          </tbody>

        </table>

      </div>

    </div>
  );
}