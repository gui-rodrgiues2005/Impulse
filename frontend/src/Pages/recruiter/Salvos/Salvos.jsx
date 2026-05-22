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
    
    useEffect(() => {
        buscarSalvos();
    }, []);
    
    async function buscarSalvos() {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Token não encontrado. Faça login novamente.");
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
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            setTalentos(data);
        } catch (error) {
            console.error("Erro ao buscar talentos salvos:", error);
            alert("Erro ao carregar talentos salvos: " + error.message);
        } finally {
            setLoading(false);
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
                        <div className="card" key={talento.id}>
                            <div className="top">
                                <div className="profile">
                                    <img
                                        src={talento.avatarUrl}
                                        alt={talento.name}
                                    />

                                    <div className="info">
                                        <div className="name-row">
                                            <h2>{talento.name}</h2>

                                            <span className="nivel">
                                                {talento.level}
                                            </span>
                                        </div>

                                        <p>{talento.course}</p>
                                    </div>
                                </div>

                                <Bookmark
                                    size={19}
                                    className="bookmark"
                                />
                            </div>

                            <p className="descricao">
                                {talento.description}
                            </p>

                            <div className="habilidades">
                                {talento.skills?.map(
                                    (item, index) => (
                                        <span key={index}>{item}</span>
                                    )
                                )}
                            </div>

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