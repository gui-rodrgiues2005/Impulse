import { useState, useEffect, useRef } from "react";

import {
  MapPin,
  CalendarDays,
  Pencil,
  GraduationCap,
  FileText,
  Plus,
  ExternalLink,
  BriefcaseBusiness,
  BadgeCheck,
  FlaskConical,
  User,
  X,
  Save,
  MoreVertical,
  Eye
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import API_URL from "../../../service/api";

import "./StudentProfile.scss";

const ACTIVITY_TYPES = [
  "Projeto Acadêmico",
  "Estágio",
  "Trabalho voluntário",
  "Pesquisa",
  "Certificação",
  "Oportunidade",
  "Dica Profissional",
];

export default function StudentProfile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [userPosts, setUserPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [studentProfile, setStudentProfile] = useState({
    bio: "",
    skills: [],
    profileImage: "",
    course: "",
    linkedin: "",
    github: "",
    university: "",
    location: "",
    resumoUrl: "",
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [skillsInput, setSkillsInput] = useState("");
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [newSkillsInput, setNewSkillsInput] = useState("");
  const [editForm, setEditForm] = useState({
    bio: "",
    course: "",
    profileImage: "",
    linkedin: "",
    github: "",
    university: "",
    location: "",
    skills: [],
  });

  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false)
  // ── Trajetória ───────────────────────────────────────────
  const [trajectories, setTrajectories] = useState([]);
  const [loadingTrajectories, setLoadingTrajectories] = useState(true);
  const [showTrajectoryModal, setShowTrajectoryModal] = useState(false);
  const [editingTrajectory, setEditingTrajectory] = useState(null);
  const [trajectoryForm, setTrajectoryForm] = useState({
    title: "",
    type: "",
    startDate: "",
    endDate: "",
    isOngoing: false,
    description: "",
  });
  const [trajectoryMenuOpen, setTrajectoryMenuOpen] = useState(null);
  const menuRef = useRef(null);
  // ────────────────────────────────────────────────────────
  const [resumeUrl, setResumeUrl] = useState(null);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [postMenuOpen, setPostMenuOpen] = useState(null);
  const [editPostForm, setEditPostForm] = useState({
    title: "", description: "", activityType: "",
    level: "", link: "", visibility: "Publico",
    commentPermission: "Todos", mediaUrl: "",
    skillIds: [],
  });
  useEffect(() => {
    profileUser();
    loadUserPosts();
    loadTrajectories();
  }, []);

  // Fecha menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setTrajectoryMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const profileUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token ausente ao carregar perfil do estudante.");
        return;
      }
      const response = await fetch(`${API_URL}/Student/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const body = await response.text();
        throw new Error(body || "Erro ao carregar perfil");
      }
      const data = await response.json();
      setStudentProfile(data);
      setResumeUrl(data.resumoUrl || null);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    }
  };

  const loadUserPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token ausente ao carregar publicações do usuário.");
        return;
      }
      const response = await fetch(`${API_URL}/publicacoes/my-posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const body = await response.text();
        throw new Error(body || "Erro ao carregar publicações");
      }
      setUserPosts(await response.json());
    } catch (error) {
      console.error("Erro ao carregar publicações:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const loadTrajectories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("Token ausente ao carregar trajetórias.");
        return;
      }
      const res = await fetch(`${API_URL}/trajectory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(body || "Erro ao carregar trajetórias");
      }
      setTrajectories(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingTrajectories(false);
    }
  };

  const handleOpenEdit = () => {
    setEditForm({
      bio: studentProfile.bio || "",
      course: studentProfile.course || "",
      profileImage: studentProfile.profileImage || "",
      linkedin: studentProfile.linkedin || "",
      github: studentProfile.github || "",
      university: studentProfile.university || "",
      location: studentProfile.location || "",
      skills: studentProfile.skills || [],
    });
    setSkillsInput((studentProfile.skills || []).join(", ")); // <- só essa linha
    setShowEditModal(true);
  };

  console.log(studentProfile)

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      let profileImageUrl = editForm.profileImage;

      if (selectedImage) {
        setUploadingImage(true);
        profileImageUrl = await uploadProfileImage();
        setUploadingImage(false);
      }

      console.log("Enviando:", { ...editForm, profileImage: profileImageUrl }); // <- aqui

      const response = await fetch(`${API_URL}/Student/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...editForm, profileImage: profileImageUrl }),
      });

      if (!response.ok) throw new Error(await response.text());

      await profileUser();
      setSelectedImage(null);
      setShowEditModal(false);
    } catch (error) {
      setUploadingImage(false);
      console.error("Erro ao salvar perfil:", error);
    }
  };

  const handleUploadResume = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/Update/resume`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (response.ok) {
      alert("Currículo enviado com sucesso!");
    }
  };

  const handleVerCurriculo = async () => {
    try {
      // Substitua pela URL da sua API. Passando o ID do estudante correto.
      const response = await fetch(`${API_URL}/Update/${studentProfile.userId}/resume`, {
        method: "GET",
        headers: {
          // Se seu sistema usa autenticação por Token, passe ele aqui:
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) {
        alert("Erro ao buscar o currículo do banco de dados.");
        return;
      }

      // Transforma a resposta binária do C# em um objeto interpretável pelo navegador
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      setPdfBlobUrl(blobUrl);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Erro ao carregar PDF:", error);
    }
  };

  // Se certifique de limpar a URL da memória quando o modal fechar para não dar memory leak
  const handleFecharModal = () => {
    setIsModalOpen(false);
    if (pdfBlobUrl) {
      URL.revokeObjectURL(pdfBlobUrl);
      setPdfBlobUrl(null);
    }
  };

  const handleSaveSkills = async () => {
    try {
      const token = localStorage.getItem("token");
      const newSkills = newSkillsInput.split(",").map((s) => s.trim()).filter(Boolean);
      const mergedSkills = [...new Set([...(studentProfile.skills || []), ...newSkills])];

      const response = await fetch(`${API_URL}/Student/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...studentProfile, skills: mergedSkills }),
      });

      if (!response.ok) throw new Error(await response.text());

      await profileUser();
      setNewSkillsInput("");
      setShowSkillsModal(false);
    } catch (error) {
      console.error("Erro ao salvar habilidades:", error);
    }
  };

  const uploadProfileImage = async () => {
    if (!selectedImage) return null;
    const formData = new FormData();
    formData.append("file", selectedImage);
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/Update/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (!response.ok) throw new Error("Erro ao enviar imagem");
    const data = await response.json();
    return data.url;
  };

  // ── Trajetória helpers ───────────────────────────────────
  const trajectoryIcon = (type) => {
    switch (type) {
      case "Projeto Acadêmico": return <GraduationCap size={14} />;
      case "Estágio":
      case "Oportunidade": return <BriefcaseBusiness size={14} />;
      case "Certificação": return <BadgeCheck size={14} />;
      case "Pesquisa": return <FlaskConical size={14} />;
      default: return <GraduationCap size={14} />;
    }
  };

  const formatPeriod = (item) => {
    const start = new Date(item.startDate).toLocaleDateString("pt-BR", {
      month: "short", year: "numeric",
    });
    if (item.isOngoing) return `${start} — atualmente`;
    if (!item.endDate) return start;
    const end = new Date(item.endDate).toLocaleDateString("pt-BR", {
      month: "short", year: "numeric",
    });
    return `${start} — ${end}`;
  };

  const openNewTrajectory = () => {
    setEditingTrajectory(null);
    setTrajectoryForm({
      title: "", type: "", startDate: "", endDate: "", isOngoing: false, description: "",
    });
    setShowTrajectoryModal(true);
  };

  const openEditTrajectory = (item) => {
    setEditingTrajectory(item);
    setTrajectoryForm({
      title: item.title,
      type: item.type,
      startDate: item.startDate?.slice(0, 7) ?? "",
      endDate: item.endDate?.slice(0, 7) ?? "",
      isOngoing: item.isOngoing,
      description: item.description ?? "",
    });
    setTrajectoryMenuOpen(null);
    setShowTrajectoryModal(true);
  };

  const handleSaveTrajectory = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        ...trajectoryForm,
        startDate: trajectoryForm.startDate ? `${trajectoryForm.startDate}-01` : null,
        endDate: trajectoryForm.isOngoing || !trajectoryForm.endDate
          ? null
          : `${trajectoryForm.endDate}-01`,
      };

      const url = editingTrajectory
        ? `${API_URL}/trajectory/${editingTrajectory.id}`
        : `${API_URL}/trajectory`;

      const res = await fetch(url, {
        method: editingTrajectory ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await loadTrajectories();
        setShowTrajectoryModal(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTrajectory = async (id) => {
    if (!window.confirm("Remover esta trajetória?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/trajectory/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrajectories((prev) => prev.filter((t) => t.id !== id));
      setTrajectoryMenuOpen(null);
    } catch (err) {
      console.error(err);
    }
  };
  // ────────────────────────────────────────────────────────

  const handleNavPublicar = () => navigate("/student/publicar");

  const openEditPost = (post) => {
    setEditingPost(post);
    setEditPostForm({
      title: post.title,
      description: post.description,
      activityType: post.activityType,
      level: post.level,
      link: post.link || "",
      visibility: post.visibility,
      commentPermission: post.commentPermission,
      mediaUrl: post.mediaUrl || "",
      skillIds: [],
    });
    setPostMenuOpen(null);
    setShowEditPostModal(true);
  };

  const handleSavePost = async () => {
    try {
      const token = localStorage.getItem("token");
      let mediaUrl = editPostForm.mediaUrl;

      // Faz upload da nova imagem se selecionada
      if (editPostForm._imageFile) {
        const formData = new FormData();
        formData.append("file", editPostForm._imageFile);
        const uploadRes = await fetch(`${API_URL}/Update/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!uploadRes.ok) throw new Error("Erro ao enviar imagem");
        const uploadData = await uploadRes.json();
        mediaUrl = uploadData.url;
      }

      const response = await fetch(`${API_URL}/publicacoes/${editingPost.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...editPostForm, mediaUrl, _imageFile: undefined }),
      });

      if (!response.ok) throw new Error(await response.text());

      await loadUserPosts(); // ou loadPosts() no CompanyProfile
      setShowEditPostModal(false);
      setEditingPost(null);
    } catch (err) {
      console.error("Erro ao editar publicação:", err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Tem certeza que deseja excluir esta publicação?")) return;
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/publicacoes/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(await response.text());
      await loadUserPosts();
      setPostMenuOpen(null);
    } catch (err) {
      console.error("Erro ao excluir publicação:", err);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(resumeUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      // Define o nome do arquivo pegando a última parte da URL original
      link.download = resumeUrl.split('/').pop() || 'curriculo.pdf';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Erro ao baixar o arquivo:", error);
      // Caso falhe o fetch por CORS, abre o link original em última instância
      window.open(resumeUrl, '_blank');
    }
  };

  const formatUrl = (url) => {
    if (!url) return "";
    return url.startsWith("http") ? url : `https://${url}`;
  };

  return (
    <div className="student-profile">
      {/* HEADER */}
      <div className="student-profile__header">
        <div className="student-profile__cover">
          <div className="student-profile__cover-pattern" />
        </div>

        <div className="student-profile__top">
          <div className="student-profile__avatar">
            {studentProfile.profileImage ? (
              <img src={studentProfile.profileImage} alt={user?.name} />
            ) : (
              <div className="student-profile__avatar-placeholder" />
            )}
          </div>
        </div>

        <div className="student-profile__info">
          <div className="student-profile__info-main">
            <div className="student-profile__name-row">
              <h1>{user?.name}</h1>
            </div>
            <p className="student-profile__course">
              {studentProfile.course || "Curso não informado"}
              {studentProfile.university && (
                <span className="student-profile__university-inline">
                  &nbsp;·&nbsp;{studentProfile.university}
                </span>
              )}
            </p>
            <p className="student-profile__bio">
              {studentProfile.bio || "Adicione uma descrição para que recrutadores conheçam melhor seu perfil."}
            </p>

            <div className="student-profile__meta">
              <span><MapPin size={14} />{studentProfile.location || "Localização não informada"}</span>
            </div>

            <div className="student-profile__links-inline">
              {studentProfile.linkedin && (
                <a href={formatUrl(studentProfile.linkedin)} target="_blank" rel="noreferrer" className="link-pill link-pill--linkedin">
                  <ExternalLink size={13} />LinkedIn
                </a>
              )}
              {studentProfile.github && (
                <a href={formatUrl(studentProfile.github)} target="_blank" rel="noreferrer" className="link-pill link-pill--github">
                  <ExternalLink size={13} />GitHub
                </a>
              )}
            </div>
          </div>

          <button className="student-profile__edit" onClick={handleOpenEdit}>
            <Pencil size={15} />Editar Perfil
          </button>
        </div>
      </div>

      <div className="student-profile__section">
        <h2>Sobre</h2>
        <p className="student-profile__about">
          {studentProfile.bio || "Nenhuma descrição adicionada."}
        </p>
      </div>
      {/* CARDS */}

      <div className="student-profile__cards">
        <div className="student-profile__card--cv">
          <div className="student-profile__cv">
            <div className="cv-icon">
              <FileText size={18} />
            </div>
            <div className="cv-info">
              <h3>Currículo</h3>
              <p>
                {studentProfile.resumoUrl
                  ? "Currículo enviado e visível para recrutadores."
                  : "Envie seu CV em PDF para recrutadores visualizarem seu perfil."}
              </p>
            </div>

            {/* Botões de Ação alinhados com o seu layout */}
            {studentProfile.resumoUrl && (
              <button type="button" className="cv-view-btn" onClick={handleVerCurriculo}>
                <Eye size={14} />
                Ver
              </button>
            )}

            <button type="button" onClick={() => document.getElementById("resume-input").click()}>
              <Plus size={14} />
              {studentProfile.resumoUrl ? "Atualizar" : "Upload"}
            </button>
          </div>

          <input
            id="resume-input"
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={handleUploadResume}
          />

          {/* MODAL EXPANDIDO EM TELA CHEIA */}
          {isModalOpen && pdfBlobUrl && (
            <div className="cv-modal-overlay" onClick={handleFecharModal}>
              <div className="cv-modal-container" onClick={(e) => e.stopPropagation()}>

                {/* Header do Modal */}
                <div className="cv-modal-header">
                  <span>Visualizando Currículo</span>
                  <button className="cv-modal-close-btn" onClick={handleFecharModal}>
                    Fechar
                  </button>
                </div>

                {/* Visualizador do PDF */}
                <iframe
                  src={`${pdfBlobUrl}#toolbar=1`}
                  title="Visualizador de Currículo"
                  className="cv-modal-iframe"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* HABILIDADES */}
      <div className="student-profile__section">
        <div className="student-profile__section-header">
          <h2>Habilidades</h2>
          <button onClick={() => { setNewSkillsInput(""); setShowSkillsModal(true); }}>
            <Plus size={18} />Adicionar
          </button>
        </div>
        <div className="student-profile__skills">
          {studentProfile.skills?.map((skill) => (
            <span key={typeof skill === "string" ? skill : skill.id}>
              {typeof skill === "string" ? skill : skill.name}
            </span>
          ))}
        </div>
      </div>

      {/* MODAL HABILIDADES */}
      {showSkillsModal && (
        <div className="student-profile__modal-overlay">
          <div className="student-profile__modal">
            <div className="student-profile__modal-header">
              <h2>Adicionar Habilidades</h2>
              <button onClick={() => setShowSkillsModal(false)}><X size={20} /></button>
            </div>
            <div className="student-profile__modal-body">
              <div className="student-profile__form-group">
                <label>Habilidades (separadas por vírgula)</label>
                <input
                  type="text"
                  placeholder="Ex: React, Node.js, SQL..."
                  value={newSkillsInput}
                  onChange={(e) => setNewSkillsInput(e.target.value)}
                />
                {/* Preview das skills que serão adicionadas */}
                {newSkillsInput && (
                  <div className="student-profile__skills" style={{ marginTop: "12px" }}>
                    {newSkillsInput.split(",").map((s) => s.trim()).filter(Boolean).map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="student-profile__modal-footer">
              <button className="cancel" onClick={() => setShowSkillsModal(false)}>Cancelar</button>
              <button className="save" onClick={handleSaveSkills}>
                <Save size={18} />Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PUBLICAÇÕES */}
      <div className="student-profile__section">
        <div className="student-profile__section-header">
          <h2>Minhas Publicações</h2>
          <button onClick={handleNavPublicar}><Plus size={18} />Nova</button>
        </div>
        {loadingPosts ? (
          <p>Carregando publicações...</p>
        ) : userPosts.length === 0 ? (
          <div className="student-profile__empty">
            <User size={48} />
            <p>Nenhuma publicação ainda.</p>
          </div>
        ) : (
          <div className="student-profile__posts-scroll">
            {userPosts.map((post) => (
              <div className="student-profile__post-card" key={post.id}>
                {post.mediaUrl && (
                  <div className="post-image">
                    <img src={post.mediaUrl} alt={post.title} />
                  </div>
                )}

                <div className="post-content">
                  <div className="post-content__top">
                    <div className="post-content__badges">
                      {post.activityType && (
                        <span className="post-badge post-badge--type">{post.activityType}</span>
                      )}
                      {post.level && (
                        <span className="post-badge post-badge--level">{post.level}</span>
                      )}
                      <span className={`post-badge post-badge--visibility post-badge--${post.visibility === "Publico" ? "public" : "private"}`}>
                        {post.visibility === "Publico" ? "Público" : "Privado"}
                      </span>
                    </div>

                    <div className="trajectory-menu">
                      <button
                        className="trajectory-menu__trigger"
                        onClick={() => setPostMenuOpen(postMenuOpen === post.id ? null : post.id)}
                      >
                        <MoreVertical size={16} />
                      </button>
                      {postMenuOpen === post.id && (
                        <div className="trajectory-menu__dropdown">
                          <button onClick={() => openEditPost(post)}>Editar</button>
                          <button className="danger" onClick={() => handleDeletePost(post.id)}>Excluir</button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3>{post.title}</h3>
                  <p className="post-description">{post.description}</p>

                  <div className="post-content__footer">
                    {post.link && (
                      <a href={post.link} target="_blank" rel="noreferrer" className="post-link">
                        <ExternalLink size={12} />Ver referência
                      </a>
                    )}
                    <span className="post-comments-info">
                      💬 {post.commentPermission === "Todos"
                        ? "Todos podem comentar"
                        : post.commentPermission === "ApenasEmpresas"
                          ? "Apenas empresas"
                          : "Comentários desativados"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showEditPostModal && (
        <div className="student-profile__modal-overlay">
          <div className="student-profile__modal">
            <div className="student-profile__modal-header">
              <h2>Editar Publicação</h2>
              <button onClick={() => setShowEditPostModal(false)}><X size={20} /></button>
            </div>

            <div className="student-profile__modal-body">
              <div className="student-profile__form-group">
                <label>Imagem da publicação</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setEditPostForm({ ...editPostForm, _imageFile: file });
                  }}
                />
                {(editPostForm._imageFile || editPostForm.mediaUrl) && (
                  <img
                    src={editPostForm._imageFile
                      ? URL.createObjectURL(editPostForm._imageFile)
                      : editPostForm.mediaUrl}
                    alt="Preview"
                    style={{
                      width: "100%", height: "160px", objectFit: "cover",
                      borderRadius: "10px", marginTop: "8px"
                    }}
                  />
                )}
              </div>
              <div className="student-profile__form-group">
                <label>Tipo de Atividade</label>
                <select
                  value={editPostForm.activityType}
                  onChange={(e) => setEditPostForm({ ...editPostForm, activityType: e.target.value })}
                >
                  <option value="">Selecione</option>
                  {ACTIVITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="student-profile__form-group">
                <label>Nível</label>
                <select
                  value={editPostForm.level}
                  onChange={(e) => setEditPostForm({ ...editPostForm, level: e.target.value })}
                >
                  <option value="">Selecione</option>
                  <option value="Iniciante">Iniciante</option>
                  <option value="Intermediário">Intermediário</option>
                  <option value="Avançado">Avançado</option>
                </select>
              </div>

              <div className="student-profile__form-group">
                <label>Título</label>
                <input
                  type="text"
                  value={editPostForm.title}
                  onChange={(e) => setEditPostForm({ ...editPostForm, title: e.target.value })}
                />
              </div>

              <div className="student-profile__form-group">
                <label>Descrição</label>
                <textarea
                  rows={4}
                  value={editPostForm.description}
                  onChange={(e) => setEditPostForm({ ...editPostForm, description: e.target.value })}
                />
              </div>

              <div className="student-profile__form-group">
                <label>Link de referência</label>
                <input
                  type="url"
                  value={editPostForm.link}
                  onChange={(e) => setEditPostForm({ ...editPostForm, link: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="student-profile__form-group">
                <label>Visibilidade</label>
                <div className="post-edit__radio-group">
                  {[
                    { value: "Publico", label: "Público", desc: "Visível para toda a comunidade" },
                    { value: "Privado", label: "Privado", desc: "Apenas você e recrutadores" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`post-edit__radio-card ${editPostForm.visibility === opt.value ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="edit-visibility"
                        value={opt.value}
                        checked={editPostForm.visibility === opt.value}
                        onChange={(e) => setEditPostForm({ ...editPostForm, visibility: e.target.value })}
                      />
                      <div><h4>{opt.label}</h4><p>{opt.desc}</p></div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="student-profile__form-group">
                <label>Quem pode comentar?</label>
                <div className="post-edit__radio-group">
                  {[
                    { value: "Todos", label: "Todos", desc: "Qualquer usuário" },
                    { value: "ApenasEmpresas", label: "Apenas Empresas", desc: "Somente contas empresa" },
                    { value: "Ninguem", label: "Ninguém", desc: "Comentários desativados" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`post-edit__radio-card ${editPostForm.commentPermission === opt.value ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="edit-comment"
                        value={opt.value}
                        checked={editPostForm.commentPermission === opt.value}
                        onChange={(e) => setEditPostForm({ ...editPostForm, commentPermission: e.target.value })}
                      />
                      <div><h4>{opt.label}</h4><p>{opt.desc}</p></div>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            <div className="student-profile__modal-footer">
              <button className="cancel" onClick={() => setShowEditPostModal(false)}>Cancelar</button>
              <button className="save" onClick={handleSavePost}>
                <Save size={18} />Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TRAJETÓRIA */}
      <div className="student-profile__section">
        <div className="student-profile__section-header">
          <h2>Trajetória</h2>
          <button onClick={openNewTrajectory}>
            <Plus size={18} />Adicionar
          </button>
        </div>

        {loadingTrajectories ? (
          <p>Carregando...</p>
        ) : trajectories.length === 0 ? (
          <p className="student-profile__empty-text">
            Nenhuma trajetória adicionada ainda.
          </p>
        ) : (
          <div className="student-profile__timeline" ref={menuRef}>
            {trajectories.map((item) => (
              <div className="student-profile__timeline-item" key={item.id}>
                <div className="student-profile__timeline-dot" />
                <div className="student-profile__timeline-content">
                  <div className="student-profile__timeline-top">
                    <span className="date">{formatPeriod(item)}</span>
                    <span className="tag">
                      {trajectoryIcon(item.type)}
                      {item.type}
                    </span>
                    <div className="trajectory-menu">
                      <button
                        className="trajectory-menu__trigger"
                        onClick={() =>
                          setTrajectoryMenuOpen(
                            trajectoryMenuOpen === item.id ? null : item.id
                          )
                        }
                      >
                        <MoreVertical size={16} />
                      </button>
                      {trajectoryMenuOpen === item.id && (
                        <div className="trajectory-menu__dropdown">
                          <button onClick={() => openEditTrajectory(item)}>
                            Editar
                          </button>
                          <button
                            className="danger"
                            onClick={() => handleDeleteTrajectory(item.id)}
                          >
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p><strong>{item.title}</strong></p>
                  {item.description && (
                    <p className="trajectory-desc">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL EDITAR PERFIL */}
      {showEditModal && (
        <div className="student-profile__modal-overlay">
          <div className="student-profile__modal">
            <div className="student-profile__modal-header">
              <h2>Editar Perfil</h2>
              <button onClick={() => setShowEditModal(false)}><X size={20} /></button>
            </div>
            <div className="student-profile__modal-body">
              <div className="student-profile__form-group">
                <label>Foto do Perfil</label>
                <input type="file" accept="image/*" onChange={(e) => setSelectedImage(e.target.files[0])} />
                <img
                  src={selectedImage ? URL.createObjectURL(selectedImage) : (studentProfile.profileImage || undefined)}
                  alt="Preview"
                  style={{ width: "120px", height: "120px", borderRadius: "50%", objectFit: "cover", marginTop: "10px" }}
                />
              </div>
              <div className="student-profile__form-group">
                <label>Curso</label>
                <input type="text" value={editForm.course}
                  onChange={(e) => setEditForm({ ...editForm, course: e.target.value })} />
              </div>
              <div className="student-profile__form-group">
                <label>Universidade</label>
                <input type="text" value={editForm.university}
                  onChange={(e) => setEditForm({ ...editForm, university: e.target.value })} />
              </div>
              <div className="student-profile__form-group">
                <label>Localização</label>
                <input type="text" value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} />
              </div>
              <div className="student-profile__form-group">
                <label>LinkedIn</label>
                <input type="text" value={editForm.linkedin}
                  onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })} />
              </div>
              <div className="student-profile__form-group">
                <label>Portifólio</label>
                <input type="text" value={editForm.github}
                  onChange={(e) => setEditForm({ ...editForm, github: e.target.value })} />
              </div>
              <div className="student-profile__form-group">
                <label>Principais Competências</label>
                <input type="text" placeholder="Ex: Trabalho em equipo, Resolução de Problemas, Comunicação"
                  value={skillsInput}
                  onChange={(e) => {
                    const raw = e.target.value;
                    setSkillsInput(raw);
                    setEditForm({
                      ...editForm,
                      skills: raw.split(",").map((s) => s.trim()).filter(Boolean),
                    });
                  }}
                />
              </div>
              <div className="student-profile__form-group">
                <label>Sobre você</label>
                <textarea rows={5} value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })} />
              </div>
            </div>
            <div className="student-profile__modal-footer">
              <button className="cancel" onClick={() => setShowEditModal(false)}>Cancelar</button>
              <button className="save" onClick={handleSaveProfile} disabled={uploadingImage}>
                <Save size={18} />
                {uploadingImage ? "Enviando foto..." : "Salvar Alterações"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TRAJETÓRIA */}
      {showTrajectoryModal && (
        <div className="student-profile__modal-overlay">
          <div className="student-profile__modal">
            <div className="student-profile__modal-header">
              <h2>{editingTrajectory ? "Editar Trajetória" : "Nova Trajetória"}</h2>
              <button onClick={() => setShowTrajectoryModal(false)}><X size={20} /></button>
            </div>
            <div className="student-profile__modal-body">
              <div className="student-profile__form-group">
                <label>Título</label>
                <input type="text" value={trajectoryForm.title}
                  onChange={(e) => setTrajectoryForm({ ...trajectoryForm, title: e.target.value })}
                  placeholder="Ex: Estágio em RH" />
              </div>
              <div className="student-profile__form-group">
                <label>Tipo</label>
                <select value={trajectoryForm.type}
                  onChange={(e) => setTrajectoryForm({ ...trajectoryForm, type: e.target.value })}>
                  <option value="">Selecione</option>
                  {ACTIVITY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="form-row">
                <div className="student-profile__form-group">
                  <label>Data de início</label>
                  <input type="month" value={trajectoryForm.startDate}
                    onChange={(e) => setTrajectoryForm({ ...trajectoryForm, startDate: e.target.value })} />
                </div>
                {!trajectoryForm.isOngoing && (
                  <div className="student-profile__form-group">
                    <label>Data de fim</label>
                    <input type="month" value={trajectoryForm.endDate}
                      onChange={(e) => setTrajectoryForm({ ...trajectoryForm, endDate: e.target.value })} />
                  </div>
                )}
              </div>
              <div className="student-profile__form-group">
                <label className="trajectory-checkbox-label">
                  <input type="checkbox" checked={trajectoryForm.isOngoing}
                    onChange={(e) => setTrajectoryForm({ ...trajectoryForm, isOngoing: e.target.checked })} />
                  <span>Acontecendo agora</span>
                </label>
              </div>
              <div className="student-profile__form-group">
                <label>Descrição (opcional)</label>
                <textarea rows={3} value={trajectoryForm.description}
                  onChange={(e) => setTrajectoryForm({ ...trajectoryForm, description: e.target.value })} />
              </div>
            </div>
            <div className="student-profile__modal-footer">
              <button className="cancel" onClick={() => setShowTrajectoryModal(false)}>Cancelar</button>
              <button className="save" onClick={handleSaveTrajectory}>
                <Save size={18} />Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}