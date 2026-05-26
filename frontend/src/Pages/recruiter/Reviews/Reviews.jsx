import "./Reviews.scss";

const avaliacoes = [
  {
    id: 1,
    nome: "Ana Silva",
    cargo: "Analista de Marketing",
    categoria: "Liderança",
    tempo: "há 2 dias",
    nota: 4.8,
    comentario: "Excelente coordenação de equipe e visão estratégica.",
    tag: "Liderança",
  },
  {
    id: 2,
    nome: "Carlos Mendes",
    cargo: "Pesquisador",
    categoria: "Metodologia",
    tempo: "há 4 dias",
    nota: 4.9,
    comentario: "Pesquisa muito bem estruturada e original.",
    tag: "Metodologia",
  },
  {
    id: 3,
    nome: "Juliana Costa",
    cargo: "Trainee RH",
    categoria: "Comunicação",
    tempo: "há 1 semana",
    nota: 4.6,
    comentario: "Comunicação clara e ótimo relacionamento interpessoal.",
    tag: "Comunicação",
  },
];

export default function Avaliacoes() {
  return (
    <div className="reviews">
      <div className="reviews__header">
        <div>
          <span className="reviews__subtitle">⭐ AVALIAÇÕES</span>
          <h1 className="reviews__title">Suas avaliações de candidatos</h1>
          <p className="reviews__description">
            Histórico das avaliações que você registrou.
          </p>
        </div>
      </div>

      <div className="reviews__content">
        {avaliacoes.length === 0 ? (
          <p className="reviews__empty">Nenhuma avaliação encontrada.</p>
        ) : (
          avaliacoes.map((item) => (
            <div key={item.id} className="reviews__card">
              <div className="reviews__card-header">
                <div className="reviews__card-info">
                  <p className="reviews__card-name">{item.nome}</p>
                  <p className="reviews__card-meta">
                    {item.cargo} · {item.categoria} · {item.tempo}
                  </p>
                </div>
                <div className="reviews__card-actions">
                  <span className="reviews__rating">⭐ {item.nota}</span>
                  <button className="reviews__message-btn">💬 Mensagem</button>
                </div>
              </div>

              <p className="reviews__card-comment">"{item.comentario}"</p>

              <div>
                <span className="reviews__tag">{item.tag}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}