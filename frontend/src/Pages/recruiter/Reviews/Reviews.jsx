import { useEffect, useState } from "react";
import "./Reviews.scss";

export default function Avaliacoes() {

  const [avaliacoes, setAvaliacoes] = useState([]);

  useEffect(() => {
    const carregarAvaliacoes = async () => {
      // MOCK TEMPORÁRIO
      // depois vocês podem substituir pela API

      const dados = [
        {
          id: 1,
          nome: "Ana Silva",
          tipoUsuario: "Empresa",
          tempo: "há 2 dias",
          nota: 4.8,
          comentario:
            "Excelente capacidade de liderança e organização durante os processos seletivos.",
          categoria: "Liderança",
        },

        {
          id: 2,
          nome: "Carlos Mendes",
          tipoUsuario: "Aluno",
          tempo: "há 4 dias",
          nota: 4.9,
          comentario:
            "Muito atencioso durante todo o processo de recrutamento.",
          categoria: "Comunicação",
        },

        {
          id: 3,
          nome: "Juliana Costa",
          tipoUsuario: "Empresa",
          tempo: "há 1 semana",
          nota: 4.7,
          comentario:
            "Ótima condução nas entrevistas e excelente retorno aos candidatos.",
          categoria: "Processos",
        },
      ];

      setAvaliacoes(dados);
    };

    carregarAvaliacoes();
  }, []);

  return (
    <div className="reviews">

      <div className="reviews__container">

        <div className="reviews__header">

          <div>

            <span className="reviews__subtitle">
              ⭐ FEEDBACKS
            </span>

            <h1 className="reviews__title">
              Avaliações recebidas
            </h1>

            <p className="reviews__description">
              Feedbacks enviados por alunos e empresas.
            </p>

          </div>

        </div>

        <div className="reviews__content">

          {avaliacoes.length === 0 ? (

            <div className="reviews__empty">
              Nenhuma avaliação encontrada.
            </div>

          ) : (

            avaliacoes.map((item) => (

              <div
                key={item.id}
                className="reviews__card"
              >

                <div className="reviews__card-header">

                  <div className="reviews__card-info">

                    <div className="reviews__avatar">
                      {item.nome.charAt(0)}
                    </div>

                    <div>

                      <p className="reviews__card-name">
                        {item.nome}
                      </p>

                      <p className="reviews__card-meta">
                        {item.tipoUsuario} • {item.tempo}
                      </p>

                    </div>

                  </div>

                  <div className="reviews__card-actions">

                    <span className="reviews__rating">
                      ⭐ {item.nota}
                    </span>

                    <button className="reviews__message-btn">

                      <span>💬</span>

                      Mensagem

                    </button>

                  </div>

                </div>

                <blockquote className="reviews__card-comment">

                  “{item.comentario}”

                </blockquote>

                <div className="reviews__footer">

                  <span className="reviews__tag">
                    {item.categoria}
                  </span>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}