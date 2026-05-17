import "./MensagensCompany.scss";

import { Search } from "lucide-react";

const conversas = [
  {
    nome: "TechCorp Brasil",
    mensagem: "Gostamos muito do seu projeto de e-commerce!",
    tempo: "2h",
    avatar: "TC",
    color: "#0f9d8a",
    online: true,
  },
  {
    nome: "StartupXYZ",
    mensagem: "Você teria interesse em uma vaga de estágio?",
    tempo: "5h",
    avatar: "SX",
    color: "#ef4444",
    online: true,
  },
  {
    nome: "Ana Silva",
    mensagem: "Obrigado pelo feedback no meu projeto!",
    tempo: "1d",
    avatar: "👩‍🎓",
    color: "#f3f4f6",
    online: false,
  },
];

export default function MensagensCompany() {
  return (
    <div className="company-messages">

      <div className="company-messages__header">

        <h1 className="company-messages__title">
          Mensagens
        </h1>

        <p className="company-messages__description">
          Suas conversas com empresas e estudantes
        </p>

      </div>

      <div className="company-messages__search">

        <Search
          size={20}
          className="company-messages__search-icon"
        />

        <input
          type="text"
          placeholder="Buscar conversas..."
        />

      </div>

      <div className="company-messages__list">

        {conversas.map((conversa, index) => (
          <div
            key={index}
            className="company-messages__card"
          >

            <div className="company-messages__left">

              <div
                className="company-messages__avatar"
                style={{
                  background: conversa.color,
                }}
              >

                {conversa.avatar}

                {conversa.online && (
                  <span className="company-messages__online" />
                )}

              </div>

              <div className="company-messages__content">

                <h3>{conversa.nome}</h3>

                <p>{conversa.mensagem}</p>

              </div>

            </div>

            <span className="company-messages__time">
              {conversa.tempo}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}