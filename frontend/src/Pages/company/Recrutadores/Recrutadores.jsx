import "./Recrutadores.scss";

import {
  UserPlus,
  Mail,
  Ellipsis,
} from "lucide-react";

const recrutadores = [
  {
    nome: "Fernanda Lopes",
    avatar: "🧔🏾",
    email: "fernanda@empresaabc.com",
    vagas: 7,
    contratacoes: 4,
    status: "Ativo",
  },
  {
    nome: "Roberto Almeida",
    avatar: "👩🏽",
    email: "roberto@empresaabc.com",
    vagas: 5,
    contratacoes: 2,
    status: "Ativo",
  },
  {
    nome: "Camila Souza",
    avatar: "👩🏻",
    email: "camila@empresaabc.com",
    vagas: 3,
    contratacoes: 6,
    status: "Ativo",
  },
  {
    nome: "Diego Pereira",
    avatar: "🧑🏾",
    email: "diego@empresaabc.com",
    vagas: 0,
    contratacoes: 0,
    status: "Convidado",
  },
];

export default function Recrutadores() {
  return (
    <div className="company-recruiters">

      <div className="company-recruiters__header">

        <div>

          <span className="company-recruiters__subtitle">
            Equipe de recrutamento
          </span>

          <h1 className="company-recruiters__title">
            Recrutadores
          </h1>

        </div>

        <button className="company-recruiters__button">

          <UserPlus size={18} />

          Convidar recrutador

        </button>

      </div>

      <div className="company-recruiters__table-wrapper">

        <table className="company-recruiters__table">

          <thead>

            <tr>
              <th>RECRUTADOR</th>
              <th>E-MAIL</th>
              <th>VAGAS ATIVAS</th>
              <th>CONTRATAÇÕES</th>
              <th>STATUS</th>
              <th></th>
            </tr>

          </thead>

          <tbody>

            {recrutadores.map((recrutador, index) => (
              <tr key={index}>

                <td>

                  <div className="company-recruiters__user">

                    <div className="company-recruiters__avatar">
                      {recrutador.avatar}
                    </div>

                    <span>{recrutador.nome}</span>

                  </div>

                </td>

                <td>

                  <div className="company-recruiters__email">

                    <Mail size={16} />

                    <span>{recrutador.email}</span>

                  </div>

                </td>

                <td className="company-recruiters__number">
                  {recrutador.vagas}
                </td>

                <td className="company-recruiters__number company-recruiters__number--green">
                  {recrutador.contratacoes}
                </td>

                <td>

                  <span
                    className={`recruiter-status recruiter-status--${recrutador.status.toLowerCase()}`}
                  >
                    {recrutador.status}
                  </span>

                </td>

                <td>

                  <button className="company-recruiters__menu">

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