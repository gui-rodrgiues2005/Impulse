import "./TalentDiscovery.scss";
import { useEffect, useState } from "react";
import API_URL from "../../../service/api";

import {
  Search,
  Filter,
  Bookmark,
  Send,
} from "lucide-react";

function TalentDiscovery() {
  const [talentos, setTalentos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {
    buscarTalentos();
  }, []);

  async function buscarTalentos() {
    try {
      const response = await fetch(
        `${API_URL}/recruiter/talents`
      );

      if (!response.ok) {
        throw new Error(
          "Erro ao buscar talentos"
        );
      }

      const data = await response.json();

      setTalentos(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function salvarTalento(studentId) {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        alert("Token não encontrado. Faça login novamente.");
        return;
      }

      const response = await fetch(
        `${API_URL}/recruiter/save-talent/${studentId}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      alert("Talento salvo!");
    } catch (error) {
      console.error("Erro ao salvar talento:", error);
      alert("Erro ao salvar talento: " + error.message);
    }
  }

  const talentosFiltrados = talentos.filter(
    (talento) =>
      talento.name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      talento.course
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <div className="talent-discovery">

      <div className="content">

        <aside className="filters">

          <div className="filters-title">

            <Filter size={20} />

            <h3>Filtros</h3>

          </div>

          <div className="search-box">

            <Search size={20} />

            <input
              type="text"
              placeholder="Buscar talentos..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <div className="filter-group">

            <span className="group-title">
              NÍVEL
            </span>

            <div className="tags">
              <button>Iniciante</button>
              <button>Intermediário</button>
              <button>Avançado</button>
            </div>

          </div>

          <div className="filter-group">

            <span className="group-title">
              HABILIDADES
            </span>

            <div className="tags">
              <button>Comunicação</button>
              <button>Liderança</button>
              <button>Trabalho em equipe</button>
              <button>Organização</button>
              <button>Análise de dados</button>
              <button>Criatividade</button>
              <button>Gestão de projetos</button>
              <button>Empatia</button>
            </div>

          </div>

        </aside>

        <main className="talents-section">

          <h2>
            {talentosFiltrados.length} talento(s)
            encontrado(s)
          </h2>

          {loading ? (
            <p>Carregando talentos...</p>
          ) : (
            <div className="talents-grid">

              {talentosFiltrados.map((talento) => (
                <div
                  className="talent-card"
                  key={talento.id}
                >

                  <div className="card-border"></div>

                  <div className="card-content">

                    <div className="card-top">

                      <div className="profile">

                        <img
                          src={
                            talento.avatarUrl ||
                            "https://api.dicebear.com/7.x/adventurer/svg?seed=User"
                          }
                          alt={talento.name}
                        />

                        <div className="info">

                          <div className="name-row">

                            <h3>
                              {talento.name}
                            </h3>

                            <span className="level">
                              {talento.level ||
                                "Iniciante"}
                            </span>

                          </div>

                          <p>
                            {talento.course ||
                              "Curso não informado"}
                          </p>

                        </div>

                      </div>

                      <Bookmark
                        size={20}
                        className="bookmark"
                        onClick={() =>
                          salvarTalento(talento.id)
                        }
                      />

                    </div>

                    <p className="description">
                      {talento.description ||
                        "Nenhuma descrição cadastrada."}
                    </p>

                    <div className="skills">

                      {talento.skills?.length >
                        0 ? (
                        talento.skills.map(
                          (skill, index) => (
                            <span key={index}>
                              {skill}
                            </span>
                          )
                        )
                      ) : (
                        <span>
                          Sem habilidades cadastradas
                        </span>
                      )}

                    </div>

                    <div className="footer">

                      <div className="actions">

                        <button className="secondary">
                          Ver Perfil
                        </button>

                        <button className="primary">

                          <Send size={18} />

                          Contatar

                        </button>

                      </div>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </main>

      </div>

    </div>
  );
}

export default TalentDiscovery;