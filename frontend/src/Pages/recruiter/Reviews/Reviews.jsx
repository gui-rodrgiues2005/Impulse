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
    <div className="avaliacoes-container">
      <span className="avaliacoes-label">⭐ AVALIAÇÕES</span>
      <h1 className="avaliacoes-titulo">Suas avaliações de candidatos</h1>
      <p className="avaliacoes-subtitulo">
        Histórico das avaliações que você registrou.
      </p>

      {avaliacoes.map((item) => (
        <div key={item.id} className="card">
          <div className="card-header">
            <div>
              <p className="card-nome">{item.nome}</p>
              <p className="card-meta">
                {item.cargo} · {item.categoria} · {item.tempo}
              </p>
            </div>
            <div className="card-acoes">
              <span className="card-nota">⭐ {item.nota}</span>
              <button className="btn-mensagem">💬 Mensagem</button>
            </div>
          </div>

          <p className="card-comentario">"{item.comentario}"</p>

          <div>
            <span className="card-tag">{item.tag}</span>
          </div>
        </div>
      ))}
    </div>
  );
}