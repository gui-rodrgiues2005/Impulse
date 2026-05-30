import { useState } from "react";
import "./Publicacoes.scss";
import { ImagePlus, ChevronDown } from "lucide-react";
import API_URL from "../../service/api";

function PublicarAtividade() {
    const [habilidadesSelecionadas, setHabilidadesSelecionadas] = useState([]);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [level, setLevel] = useState("");
    const [link, setLink] = useState("");
    const [visibility, setVisibility] = useState("Publico");
    const [loading, setLoading] = useState(false);

    const habilidades = [
        "Comunicação",
        "Liderança",
        "Trabalho em equipe",
        "Organização",
        "Análise de dados",
        "Criatividade",
        "Resolução de problemas",
        "Gestão de projetos",
        "Empatia",
        "Pesquisa",
        "Escrita acadêmica",
        "Marketing",
    ];

    function toggleHabilidade(skill) {
        setHabilidadesSelecionadas((prev) =>
            prev.includes(skill)
                ? prev.filter((s) => s !== skill)
                : [...prev, skill]
        );
    }

    async function handlePublish() {
        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            if (!token) {
                alert("Você precisa estar logado.");
                return;
            }

            const payload = {
                title,
                description,
                activityType: type,
                level,
                link,
                visibility,
                mediaUrl: null,


                skillIds: [],
            };

            const response = await fetch(`${API_URL}/feed/publish`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error);
            }

            alert("Atividade publicada com sucesso!");

            // reset form
            setTitle("");
            setDescription("");
            setType("");
            setLevel("");
            setLink("");
            setHabilidadesSelecionadas([]);
            setVisibility("Publico");
        } catch (error) {
            console.error(error);
            alert("Erro ao publicar atividade");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="publicar-atividade">
            <div className="atividade-header">
                <h1>Publicar Atividade</h1>
                <p>
                    Compartilhe uma experiência da sua trajetória acadêmica ou profissional
                </p>
            </div>

            <div className="atividade-card">

                {/* UPLOAD */}
                <label className="upload-box">
                    <input type="file" hidden />
                    <div className="upload-content">
                        <ImagePlus size={54} />
                        <h3>Clique para adicionar uma imagem ou anexo</h3>
                        <span>PNG, JPG ou PDF</span>
                    </div>
                </label>

                {/* TYPE */}
                <div className="form-group">
                    <label>Tipo de Atividade</label>
                    <div className="select-wrapper">
                        <select value={type} onChange={(e) => setType(e.target.value)}>
                            <option value="">Selecione o tipo</option>
                            <option value="Projeto Acadêmico">Projeto Acadêmico</option>
                            <option value="Estágio">Estágio</option>
                            <option value="Trabalho voluntário">Trabalho voluntário</option>
                            <option value="Pesquisa">Pesquisa</option>
                            <option value="Certificação">Certificação</option>
                            <option value="Oportunidade">Oportunidade</option>
                            <option value="Dica Profissional">Dica Profissional</option>
                        </select>
                        <ChevronDown size={18} />
                    </div>
                </div>

                {/* TITLE */}
                <div className="form-group">
                    <label>Título</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Estágio em Recursos Humanos"
                    />
                </div>

                {/* DESCRIPTION */}
                <div className="form-group">
                    <label>Descrição</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Descreva a atividade..."
                    />
                </div>

                {/* SKILLS */}
                <div className="form-group">
                    <label>Habilidades (opcional)</label>
                    <div className="skills-list">
                        {habilidades.map((skill) => (
                            <button
                                type="button"
                                key={skill}
                                className={
                                    habilidadesSelecionadas.includes(skill)
                                        ? "skill active"
                                        : "skill"
                                }
                                onClick={() => toggleHabilidade(skill)}
                            >
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>

                {/* LEVEL */}
                <div className="form-group">
                    <label>Nível</label>
                    <div className="select-wrapper">
                        <select value={level} onChange={(e) => setLevel(e.target.value)}>
                            <option value="">Selecione o nível</option>
                            <option value="Iniciante">Iniciante</option>
                            <option value="Intermediário">Intermediário</option>
                            <option value="Avançado">Avançado</option>
                        </select>
                        <ChevronDown size={18} />
                    </div>
                </div>

                {/* LINK */}
                <div className="form-group">
                    <label>Link</label>
                    <input
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        placeholder="https://exemplo.com"
                    />
                </div>

                {/* VISIBILITY */}
                <div className="form-group">
                    <label>Visibilidade</label>

                    <div className="visibility-options">
                        <label className="visibility-card">
                            <input
                                type="radio"
                                value="Publico"
                                checked={visibility === "Publico"}
                                onChange={(e) => setVisibility(e.target.value)}
                            />
                            <div>
                                <h4>Público</h4>
                                <p>Visível no feed para todos</p>
                            </div>
                        </label>

                        <label className="visibility-card">
                            <input
                                type="radio"
                                value="Privado"
                                checked={visibility === "Privado"}
                                onChange={(e) => setVisibility(e.target.value)}
                            />
                            <div>
                                <h4>Privado</h4>
                                <p>Apenas você e recrutadores</p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* BUTTON */}
                <button
                    className="publish-button"
                    onClick={handlePublish}
                    disabled={loading}
                >
                    {loading ? "Publicando..." : "Publicar Atividade"}
                </button>

            </div>
        </div>
    );
}

export default PublicarAtividade;