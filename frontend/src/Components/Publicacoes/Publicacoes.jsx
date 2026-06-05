import { useState, useEffect } from "react";
import "./Publicacoes.scss";
import { ImagePlus, ChevronDown, X } from "lucide-react";
import API_URL from "../../service/api";

const ACTIVITY_TYPES = [
  "Projeto Acadêmico",
  "Estágio",
  "Trabalho voluntário",
  "Pesquisa",
  "Certificação",
  "Oportunidade",
  "Dica Profissional",
];

function PublicarAtividade() {
  const [habilidadesSelecionadas, setHabilidadesSelecionadas] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [level, setLevel] = useState("");
  const [link, setLink] = useState("");
  const [visibility, setVisibility] = useState("Publico");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);

  // ── Trajetória ──────────────────────────────────────────
  const [addToTrajectory, setAddToTrajectory] = useState(false);
  const [trajectoryTitle, setTrajectoryTitle] = useState("");
  const [trajectoryType, setTrajectoryType] = useState("");
  const [trajectoryStart, setTrajectoryStart] = useState("");
  const [trajectoryEnd, setTrajectoryEnd] = useState("");
  const [trajectoryOngoing, setTrajectoryOngoing] = useState(false);
  // ────────────────────────────────────────────────────────

  const habilidades = [
    "Comunicação", "Liderança", "Trabalho em equipe", "Organização",
    "Análise de dados", "Criatividade", "Resolução de problemas",
    "Gestão de projetos", "Empatia", "Pesquisa", "Escrita acadêmica", "Marketing",
  ];

  useEffect(() => {
    if (!selectedFile) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  // Quando o checkbox de trajetória é marcado, preenche o título e tipo automaticamente
  useEffect(() => {
    if (addToTrajectory) {
      if (title && !trajectoryTitle) setTrajectoryTitle(title);
      if (type && !trajectoryType) setTrajectoryType(type);
    }
  }, [addToTrajectory]);

  function toggleHabilidade(skill) {
    setHabilidadesSelecionadas((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }

  function handleRemoveFile(e) {
    e.preventDefault();
    e.stopPropagation();
    setSelectedFile(null);
  }

  async function uploadImage() {
    if (!selectedFile) return null;
    const formData = new FormData();
    formData.append("file", selectedFile);
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/Update/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) throw new Error("Erro ao enviar imagem");
    const data = await response.json();
    return data.url;
  }

  async function handlePublish() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) { alert("Você precisa estar logado."); return; }

      let mediaUrl = null;
      if (selectedFile) {
        setUploadingFile(true);
        mediaUrl = await uploadImage();
        setUploadingFile(false);
      }

      const payload = {
        title,
        description,
        activityType: type,
        level,
        link,
        visibility,
        mediaUrl,
        skillIds: [],
      };

      const response = await fetch(`${API_URL}/publicacoes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(await response.text());

      const post = await response.json();

      // ── Criar trajetória vinculada se marcado ──────────
      if (addToTrajectory && trajectoryTitle && trajectoryType && trajectoryStart) {
        await fetch(`${API_URL}/trajectory`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: trajectoryTitle,
            type: trajectoryType,
            startDate: trajectoryStart,
            endDate: trajectoryOngoing ? null : trajectoryEnd || null,
            isOngoing: trajectoryOngoing,
            description: description,
            feedPostId: post.id,
          }),
        });
      }
      // ──────────────────────────────────────────────────

      alert("Atividade publicada com sucesso!");

      // Reset
      setTitle(""); setDescription(""); setType(""); setLevel("");
      setLink(""); setHabilidadesSelecionadas([]); setVisibility("Publico");
      setSelectedFile(null); setAddToTrajectory(false);
      setTrajectoryTitle(""); setTrajectoryType("");
      setTrajectoryStart(""); setTrajectoryEnd(""); setTrajectoryOngoing(false);

    } catch (error) {
      console.error(error);
      alert("Erro ao publicar atividade");
    } finally {
      setLoading(false);
      setUploadingFile(false);
    }
  }

  return (
    <div className="publicar-atividade">
      <div className="container-wrapper">
        <div className="atividade-header">
          <h1>Publicar Atividade</h1>
          <p>Compartilhe uma experiência da sua trajetória acadêmica ou profissional</p>
        </div>

        <div className="atividade-card">
          {/* UPLOAD */}
          <label className={`upload-box ${previewUrl ? "has-preview" : ""}`}>
            <input type="file" hidden accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
            {previewUrl ? (
              <div className="preview-container">
                <img src={previewUrl} alt="Preview" />
                <button className="remove-btn" onClick={handleRemoveFile}><X size={18} /></button>
              </div>
            ) : (
              <div className="upload-content">
                <ImagePlus size={40} className="upload-icon" />
                <h3>Clique para adicionar uma imagem ou anexo</h3>
                <span>PNG, JPG ou PDF</span>
              </div>
            )}
          </label>

          <div className="form-row">
            <div className="form-group">
              <label>Tipo de Atividade</label>
              <div className="select-wrapper">
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="">Selecione o tipo</option>
                  {ACTIVITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronDown size={18} />
              </div>
            </div>
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
          </div>

          <div className="form-group">
            <label>Título</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Estágio em Recursos Humanos" />
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva detalhadamente a sua atividade..." />
          </div>

          <div className="form-group">
            <label>Link de Referência</label>
            <input type="url" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://exemplo.com/seu-projeto" />
          </div>

          <div className="form-group">
            <label>Habilidades Desenvolvidas <span className="optional">(opcional)</span></label>
            <div className="skills-list">
              {habilidades.map((skill) => (
                <button type="button" key={skill}
                  className={`skill ${habilidadesSelecionadas.includes(skill) ? "active" : ""}`}
                  onClick={() => toggleHabilidade(skill)}>
                  {skill}
                </button>
              ))}
            </div>
          </div>

          {/* ── CHECKBOX TRAJETÓRIA ─────────────────────────────── */}
          <div className="form-group trajectory-toggle">
            <label className="trajectory-checkbox-label">
              <input
                type="checkbox"
                checked={addToTrajectory}
                onChange={(e) => setAddToTrajectory(e.target.checked)}
              />
              <span>Adicionar esta publicação à minha trajetória</span>
            </label>
          </div>

          {addToTrajectory && (
            <div className="trajectory-fields">
              <h4>Detalhes da Trajetória</h4>

              <div className="form-row">
                <div className="form-group">
                  <label>Título na trajetória</label>
                  <input
                    type="text"
                    value={trajectoryTitle}
                    onChange={(e) => setTrajectoryTitle(e.target.value)}
                    placeholder="Ex: Estágio em RH"
                  />
                </div>

                <div className="form-group">
                  <label>Tipo</label>
                  <div className="select-wrapper">
                    <select value={trajectoryType} onChange={(e) => setTrajectoryType(e.target.value)}>
                      <option value="">Selecione</option>
                      {ACTIVITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Data de início</label>
                  <input
                    type="month"
                    value={trajectoryStart}
                    onChange={(e) => setTrajectoryStart(e.target.value)}
                  />
                </div>

                {!trajectoryOngoing && (
                  <div className="form-group">
                    <label>Data de fim</label>
                    <input
                      type="month"
                      value={trajectoryEnd}
                      onChange={(e) => setTrajectoryEnd(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="trajectory-checkbox-label">
                  <input
                    type="checkbox"
                    checked={trajectoryOngoing}
                    onChange={(e) => setTrajectoryOngoing(e.target.checked)}
                  />
                  <span>Acontecendo agora</span>
                </label>
              </div>
            </div>
          )}
          {/* ────────────────────────────────────────────────────── */}

          <div className="form-group">
            <label>Visibilidade da Publicação</label>
            <div className="visibility-options">
              <label className={`visibility-card ${visibility === "Publico" ? "selected" : ""}`}>
                <input type="radio" name="visibility" value="Publico" checked={visibility === "Publico"} onChange={(e) => setVisibility(e.target.value)} />
                <div className="visibility-text"><h4>Público</h4><p>Visível para toda a comunidade no feed</p></div>
              </label>
              <label className={`visibility-card ${visibility === "Privado" ? "selected" : ""}`}>
                <input type="radio" name="visibility" value="Privado" checked={visibility === "Privado"} onChange={(e) => setVisibility(e.target.value)} />
                <div className="visibility-text"><h4>Privado</h4><p>Apenas você e recrutadores autorizados</p></div>
              </label>
            </div>
          </div>

          <button className="publish-button" onClick={handlePublish} disabled={loading || uploadingFile}>
            {uploadingFile ? "Enviando imagem..." : loading ? "Publicando..." : "Publicar Atividade"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PublicarAtividade;