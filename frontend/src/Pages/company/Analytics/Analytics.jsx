import "./Analytics.scss";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

const performanceData = [
  { semana: "S1", aplicacoes: 120, entrevistas: 18, contratacoes: 2 },
  { semana: "S2", aplicacoes: 145, entrevistas: 22, contratacoes: 4 },
  { semana: "S3", aplicacoes: 160, entrevistas: 28, contratacoes: 5 },
  { semana: "S4", aplicacoes: 180, entrevistas: 31, contratacoes: 6 },
  { semana: "S5", aplicacoes: 210, entrevistas: 37, contratacoes: 7 },
  { semana: "S6", aplicacoes: 240, entrevistas: 42, contratacoes: 10 },
];

const areasData = [
  { area: "Tecnologia", candidatos: 310 },
  { area: "Marketing", candidatos: 185 },
  { area: "Saúde", candidatos: 95 },
  { area: "Direito", candidatos: 60 },
  { area: "Engenharia", candidatos: 140 },
  { area: "Administração", candidatos: 210 },
];

export default function Analytics() {
  return (
    <div className="company-analytics">

      <div className="company-analytics__header">

        <div>

          <span className="company-analytics__subtitle">
            Inteligência corporativa
          </span>

          <h1 className="company-analytics__title">
            Analytics
          </h1>

        </div>

      </div>

      <div className="company-analytics__card">

        <div className="company-analytics__card-header">

          <h2>Performance semanal</h2>

          <span className="company-analytics__badge">
            +22% conversão
          </span>

        </div>

        <div className="company-analytics__chart">

          <ResponsiveContainer width="100%" height={320}>

            <LineChart data={performanceData}>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e8edf3"
              />

              <XAxis
                dataKey="semana"
                tick={{ fill: "#6b7280", fontSize: 13 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: "#6b7280", fontSize: 13 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Line
                type="monotone"
                dataKey="aplicacoes"
                stroke="#16325b"
                strokeWidth={3}
                dot={{ r: 4 }}
              />

              <Line
                type="monotone"
                dataKey="entrevistas"
                stroke="#27b3a2"
                strokeWidth={3}
                dot={{ r: 4 }}
              />

              <Line
                type="monotone"
                dataKey="contratacoes"
                stroke="#4f6fae"
                strokeWidth={3}
                dot={{ r: 4 }}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      <div className="company-analytics__card">

        <div className="company-analytics__card-header">

          <h2>Candidatos por área</h2>

        </div>

        <div className="company-analytics__chart">

          <ResponsiveContainer width="100%" height={320}>

            <BarChart data={areasData}>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e8edf3"
              />

              <XAxis
                dataKey="area"
                tick={{ fill: "#6b7280", fontSize: 13 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{ fill: "#6b7280", fontSize: 13 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Bar
                dataKey="candidatos"
                fill="#16325b"
                radius={[8, 8, 0, 0]}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}