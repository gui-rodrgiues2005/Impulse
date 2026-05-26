import "./MensagensRecruiter.scss";

import { Search } from "lucide-react";

const conversas = [
  {
    nome: "Ana Silva",
    mensagem:
      "Olá! Tenho interesse na oportunidade de estágio.",
    tempo: "2h",
    avatar: "👩‍🎓",
    color: "#f3f4f6",
    online: true,
  },
  {
    nome: "Carlos Mendes",
    mensagem:
      "Posso compartilhar meu portfólio atualizado.",
    tempo: "5h",
    avatar: "👨‍🎓",
    color: "#f3f4f6",
    online: true,
  },
  {
    nome: "Juliana Costa",
    mensagem:
      "Obrigado pelo retorno sobre minha candidatura!",
    tempo: "1d",
    avatar: "👩",
    color: "#f3f4f6",
    online: false,
  },
];

export default function MensagensRecruiter() {
  return (
    <div className="recruiter-messages">
      <div className="recruiter-messages__header">
        <h1 className="recruiter-messages__title">
          Mensagens
        </h1>

        <p className="recruiter-messages__description">
          Conversas com estudantes e talentos
        </p>
      </div>

      <div className="recruiter-messages__search">
        <Search
          size={20}
          className="recruiter-messages__search-icon"
        />

        <input
          type="text"
          placeholder="Buscar conversas..."
        />
      </div>

      <div className="recruiter-messages__list">
        {conversas.map((conversa, index) => (
          <div
            key={index}
            className="recruiter-messages__card"
          >
            <div className="recruiter-messages__left">
              <div
                className="recruiter-messages__avatar"
                style={{
                  background: conversa.color,
                }}
              >
                {conversa.avatar}

                {conversa.online && (
                  <span className="recruiter-messages__online" />
                )}
              </div>

              <div className="recruiter-messages__content">
                <h3>{conversa.nome}</h3>

                <p>{conversa.mensagem}</p>
              </div>
            </div>

            <span className="recruiter-messages__time">
              {conversa.tempo}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}