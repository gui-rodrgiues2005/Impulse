import { useState, useEffect } from "react";

import "./Salvos.scss";

import API_URL from "../../../service/api";

import {
    Bookmark,
    Download,
    Send,
} from "lucide-react";

function TalentosSalvos() {
    const [talentos, setTalentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState(null);
    useEffect(() => {
        buscarSalvos();
    }, []);

    async function buscarSalvos() {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert(
                    "Token não encontrado. Faça login novamente."
                );

                return;
            }

            const response = await fetch(
                `${API_URL}/recruiter/saved-talents`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    `Erro ${response.status}: ${response.statusText}`
                );
            }

            const data = await response.json();

            setTalentos(data);
        } catch (error) {
            console.error(
                "Erro ao buscar talentos salvos:",
                error
            );

            alert(
                "Erro ao carregar talentos salvos: " +
                error.message
            );
        } finally {
            setLoading(false);
        }
    }

    async function removerTalento(studentId) {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/recruiter/remove-saved-talent/${studentId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Erro ao remover talento."
                );
            }

            setTalentos((prev) =>
                prev.filter(
                    (talento) => talento.id !== studentId
                )
            );
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <div className="talentos-salvos">
            <div className="header">
                <div>
                    <h1>Perfis Salvos</h1>

                    <p>
                        Sua lista de favoritos
                        <br />
                        Acompanhe os perfis que você marcou
                        para revisitar.
                    </p>
                </div>

                <button className="exportar-btn">
                    <Download size={18} />
                    Exportar lista
                </button>
            </div>

            {loading ? (
                <p>Carregando talentos salvos...</p>
            ) : talentos.length === 0 ? (
                <p>Nenhum talento salvo ainda.</p>
            ) : (
                <div className="cards">
                    {talentos.map((talento) => (
                        <div
                            className="card"
                            key={talento.id}
                        >
                            <div className="top">
                                <div className="profile">
                                    <img
                                        src={
                                            talento.avatarUrl ||
                                            "/default-avatar.png"
                                        }
                                        alt={talento.name}
                                    />

                                    <div className="info">
                                        <div className="name-row">
                                            <h2>
                                                {talento.name ||
                                                    "Usuário"}
                                            </h2>

                                            {talento.level && (
                                                <span className="nivel">
                                                    {talento.level}
                                                </span>
                                            )}
                                        </div>

                                        {(talento.course ||
                                            talento.semester) && (
                                                <p>
                                                    {talento.course}

                                                    {talento.course &&
                                                        talento.semester &&
                                                        " • "}

                                                    {talento.semester}
                                                </p>
                                            )}
                                    </div>
                                </div>

                                <Bookmark
                                    size={19}
                                    className="bookmark"
                                    onClick={() =>
                                        removerTalento(talento.id)
                                    }
                                />
                            </div>

                            {talento.description && (
                                <p className="descricao">
                                    {talento.description}
                                </p>
                            )}

                            {talento.skills?.length > 0 && (
                                <div className="habilidades">
                                    {talento.skills.map(
                                        (item, index) => (
                                            <span key={index}>
                                                {item}
                                            </span>
                                        )
                                    )}
                                </div>
                            )}

                            {(talento.activities ||
                                talento.points) && (
                                    <div className="stats">
                                        {talento.activities && (
                                            <span>
                                                <strong>
                                                    {talento.activities}
                                                </strong>{" "}
                                                atividades
                                            </span>
                                        )}

                                        {talento.points && (
                                            <span>
                                                <strong>
                                                    {talento.points}
                                                </strong>{" "}
                                                pts
                                            </span>
                                        )}
                                    </div>
                                )}

                            <div className="footer">
                                <div className="actions">
                                    <button className="secondary">
                                        Ver Perfil
                                    </button>

                                    <button className="primary">
                                        <Send size={16} />
                                        Contatar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TalentosSalvos;