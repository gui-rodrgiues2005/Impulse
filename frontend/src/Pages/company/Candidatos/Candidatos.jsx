import "./Candidatos.scss";

import {
  Search,
  MessageSquare,
  Star,
} from "lucide-react";

const candidatos = [
  {
    nome: "Ana Silva",
    avatar: "👩‍🎓",
    area: "Marketing",
    vaga: "Analista de Marketing Jr.",
    etapa: "Entrevista",
    score: 92,
  },
  {
    nome: "Carlos Mendes",
    avatar: "🧑‍🔬",
    area: "Pesquisa",
    vaga: "Pesquisador em Saúde Pública",
    etapa: "Triagem",
    score: 88,
  },
  {
    nome: "Juliana Costa",
    avatar: "👩‍💼",
    area: "RH",
    vaga: "Trainee de Recursos Humanos",
    etapa: "Proposta",
    score: 95,
  },
  {
    nome: "Pedro Lima",
    avatar: "🧑‍💻",
    area: "Administração",
    vaga: "Trainee de Recursos Humanos",
    etapa: "Teste",
    score: 84,
  },
  {
    nome: "Mariana Rocha",
    avatar: "👩",
    area: "Educação",
    vaga: "Estagiário em Engenharia Civil",
    etapa: "Entrevista",
    score: 79,
  },
];

export default function Candidatos() {
  return (
    <div className="company-candidates">

      <div className="company-candidates__header">

        <div>
          <span className="company-candidates__subtitle">
            Banco de talentos
          </span>

          <h1 className="company-candidates__title">
            Candidatos
          </h1>
        </div>

      </div>

      <div className="company-candidates__search">

        <Search
          size={20}
          className="company-candidates__search-icon"
        />

        <input
          type="text"
          placeholder="Buscar candidatos por nome, área ou vaga..."
        />

      </div>

      <div className="company-candidates__table-wrapper">

        <table className="company-candidates__table">

          <thead>

            <tr>
              <th>CANDIDATO</th>
              <th>ÁREA</th>
              <th>VAGA APLICADA</th>
              <th>ETAPA</th>
              <th>SCORE</th>
              <th></th>
            </tr>

          </thead>

          <tbody>

            {candidatos.map((candidato, index) => (
              <tr key={index}>

                <td>

                  <div className="company-candidates__user">

                    <div className="company-candidates__avatar">
                      {candidato.avatar}
                    </div>

                    <span>{candidato.nome}</span>

                  </div>

                </td>

                <td>{candidato.area}</td>

                <td>{candidato.vaga}</td>

                <td>

                  <span
                    className={`candidate-stage candidate-stage--${candidato.etapa.toLowerCase()}`}
                  >
                    {candidato.etapa}
                  </span>

                </td>

                <td>

                  <div className="company-candidates__score">

                    <Star size={15} fill="currentColor" />

                    <span>{candidato.score}</span>

                  </div>

                </td>

                <td>

                  <button className="company-candidates__message">

                    <MessageSquare size={17} />

                    Mensagem

                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}