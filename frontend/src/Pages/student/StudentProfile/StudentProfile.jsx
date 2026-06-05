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
  const user = JSON.parse(localStorage.getItem("user"));

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
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
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
      const response = await fetch(`${API_URL}/Student/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Erro ao carregar perfil");
      const data = await response.json();
      setStudentProfile(data);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    }
  };

  const loadUserPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/publicacoes/my-posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) setUserPosts(await response.json());
    } catch (error) {
      console.error("Erro ao carregar publicações:", error);
    } finally {
      setLoadingPosts(false);
    }
  };

  const loadTrajectories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/trajectory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setTrajectories(await res.json());
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
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      let profileImageUrl = editForm.profileImage;

      if (selectedImage) {
        setUploadingImage(true);
        profileImageUrl = await uploadProfileImage();
        setUploadingImage(false);
      }

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

  return (
    <div className="student-profile">
      {/* HEADER */}
      <div className="student-profile__header">
        <div className="student-profile__cover" />
        <div className="student-profile__top">
          <div className="student-profile__avatar">
            <img src={studentProfile.profileImage} alt={user?.name} />
          </div>
          <span className="student-profile__badge">
            <GraduationCap size={14} />
            Conta de Estudante
          </span>
        </div>

        <div className="student-profile__info">
          <div>
            <h1>{user?.name}</h1>
            <p className="student-profile__course">
              {studentProfile.course || "Curso não informado"}
            </p>
            <p className="student-profile__bio">
              {studentProfile.bio || "Adicione uma descrição para que recrutadores conheçam melhor seu perfil."}
            </p>
            <div className="student-profile__education">
              <GraduationCap size={18} />
              <div>
                <strong>{studentProfile.university || "Universidade não informada"}</strong>
                <span>Formação Acadêmica</span>
              </div>
            </div>
            <div className="student-profile__meta">
              <span><MapPin size={16} />{studentProfile.location || "Localização não informada"}</span>
              <span>
                <CalendarDays size={16} />
                Membro desde{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
                  : "-"}
              </span>
            </div>
            <div className="student-profile__links-inline">
              {studentProfile.linkedin && (
                <a href={studentProfile.linkedin} target="_blank" rel="noreferrer">
                  <ExternalLink size={16} />LinkedIn
                </a>
              )}
              {studentProfile.github && (
                <a href={studentProfile.github} target="_blank" rel="noreferrer">
                  <ExternalLink size={16} />GitHub
                </a>
              )}
            </div>
          </div>
          <button className="student-profile__edit" onClick={handleOpenEdit}>
            <Pencil size={18} />Editar Perfil
          </button>
        </div>

        <div className="student-profile__stats">
          <div><strong>{userPosts.length}</strong><span>Publicações</span></div>
          <div><strong>{studentProfile.skills?.length || 0}</strong><span>Habilidades</span></div>
          <div>
            <strong className="highlight">
              {studentProfile.university && studentProfile.course && studentProfile.location ? "100%" : "70%"}
            </strong>
            <span>Perfil Completo</span>
          </div>
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
        <div className="student-profile__card">
          <div className="student-profile__card-header">
            <h3>Perfil completo</h3>
            <span>78%</span>
          </div>
          <div className="student-profile__progress">
            <div className="student-profile__progress-fill" style={{ width: "78%" }} />
          </div>
          <p>Adicione seu currículo para completar o perfil.</p>
        </div>
        <div className="student-profile__card">
          <div className="student-profile__cv">
            <div>
              <FileText size={22} />
              <div>
                <h3>Currículo</h3>
                <p>Envie seu CV em PDF para recrutadores.</p>
              </div>
            </div>
            <button>Upload de Currículo</button>
          </div>
        </div>
      </div>

      {/* HABILIDADES */}
      <div className="student-profile__section">
        <div className="student-profile__section-header">
          <h2>Habilidades</h2>
          <button><Plus size={18} />Adicionar</button>
        </div>
        <div className="student-profile__skills">
          {studentProfile.skills?.map((skill) => (
            <span key={typeof skill === "string" ? skill : skill.id}>
              {typeof skill === "string" ? skill : skill.name}
            </span>
          ))}
        </div>
      </div>

      {/* LINKS */}
      <div className="student-profile__section">
        <h2>Links</h2>
        <div className="student-profile__links">
          <a href="/"><ExternalLink size={18} />Portfólio</a>
          <a href="/"><ExternalLink size={18} />LinkedIn</a>
        </div>
      </div>

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
                  <span className="post-type">{post.activityType}</span>
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                  <span className="post-level">{post.level}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
                  src={selectedImage ? URL.createObjectURL(selectedImage) : studentProfile.profileImage}
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
                <label>GitHub</label>
                <input type="text" value={editForm.github}
                  onChange={(e) => setEditForm({ ...editForm, github: e.target.value })} />
              </div>
              <div className="student-profile__form-group">
                <label>Habilidades</label>
                <input type="text" placeholder="React, C#, SQL..."
                  value={editForm.skills.join(", ")}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
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