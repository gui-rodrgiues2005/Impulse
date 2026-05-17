import "./Vagas.scss";

import {
  Search,
  Plus,
  BriefcaseBusiness,
  Ellipsis,
} from "lucide-react";

const vagas = [
  {
    titulo: "Analista de Marketing Jr.",
    area: "Marketing",
    tipo: "CLT",
    local: "São Paulo · Híbrido",
    candidatos: 86,
    status: "Aberta",
  },
  {
    titulo: "Estagiário em Engenharia Civil",
    area: "Engenharia",
    tipo: "Estágio",
    local: "Belo Horizonte · Presencial",
    candidatos: 142,
    status: "Aberta",
  },
  {
    titulo: "Trainee de Recursos Humanos",
    area: "Administração",
    tipo: "Trainee",
    local: "Remoto",
    candidatos: 211,
    status: "Triagem",
  },
  {
    titulo: "Assistente Jurídico",
    area: "Direito",
    tipo: "CLT",
    local: "Rio de Janeiro · Presencial",
    candidatos: 64,
    status: "Aberta",
  },
  {
    titulo: "Pesquisador em Saúde Pública",
    area: "Saúde",
    tipo: "PJ",
    local: "Remoto",
    candidatos: 38,
    status: "Pausada",
  },
  {
    titulo: "Desenvolvedor Full-Stack Jr.",
    area: "Tecnologia",
    tipo: "CLT",
    local: "Curitiba · Híbrido",
    candidatos: 312,
    status: "Aberta",
  },
];

export default function Vagas() {
  return (
    <div className="company-jobs">

      <div className="company-jobs__header">

        <div>
          <span className="company-jobs__subtitle">
            Gestão de vagas
          </span>

          <h1 className="company-jobs__title">
            Vagas da empresa
          </h1>
        </div>

        <button className="company-jobs__button">
          <Plus size={18} />
          Nova vaga
        </button>

      </div>

      <div className="company-jobs__search">

        <Search
          size={20}
          className="company-jobs__search-icon"
        />

        <input
          type="text"
          placeholder="Buscar vagas por título, área ou local..."
        />

      </div>

      <div className="company-jobs__table-wrapper">

        <table className="company-jobs__table">

          <thead>

            <tr>
              <th>VAGA</th>
              <th>ÁREA</th>
              <th>TIPO</th>
              <th>LOCAL</th>
              <th>CANDIDATOS</th>
              <th>STATUS</th>
              <th></th>
            </tr>

          </thead>

          <tbody>

            {vagas.map((vaga, index) => (
              <tr key={index}>

                <td>

                  <div className="company-jobs__vaga">

                    <div className="company-jobs__vaga-icon">
                      <BriefcaseBusiness size={18} />
                    </div>

                    <span>{vaga.titulo}</span>

                  </div>

                </td>

                <td>{vaga.area}</td>

                <td>{vaga.tipo}</td>

                <td>{vaga.local}</td>

                <td className="company-jobs__candidates">
                  {vaga.candidatos}
                </td>

                <td>

                  <span
                    className={`status-badge status-badge--${vaga.status.toLowerCase()}`}
                  >
                    {vaga.status}
                  </span>

                </td>

                <td>

                  <button className="company-jobs__menu">
                    <Ellipsis size={18} />
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