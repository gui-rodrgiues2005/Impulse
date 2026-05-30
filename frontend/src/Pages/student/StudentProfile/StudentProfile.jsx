import { useState, useEffect } from "react";

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
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import API_URL from "../../../service/api";

import "./StudentProfile.scss";

export default function StudentProfile() {
  const navigate = useNavigate();
  const user = JSON.parse(
    localStorage.getItem("user")
  );

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

  const [editForm, setEditForm] =
    useState({
      bio: "",
      course: "",
      profileImage: "",
      linkedin: "",
      github: "",
      university: "",
      location: "",
      skills: [],
    });
  useEffect(() => {
    profileUser();
    loadUserPosts();
  }, []);


  const profileUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const response = await fetch(
        `${API_URL}/Student/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Erro ao carregar perfil"
        );
      }

      const data = await response.json();

      setStudentProfile(data);

    } catch (error) {
      console.error(
        "Erro ao carregar perfil:",
        error
      );
    }
  };

  const loadUserPosts = async () => {
    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/publicacoes/my-posts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {

        const data =
          await response.json();

        setUserPosts(data);
      }

    } catch (error) {

      console.error(
        "Erro ao carregar publicações:",
        error
      );

    } finally {
      setLoadingPosts(false);
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
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/Student/profile`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            ...editForm,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();

        console.log(errorData);

        throw new Error(errorData);
      }

      await profileUser();

      setShowEditModal(false);

    } catch (error) {
      console.error(error);
    }
  };

  const timeline = [
    {
      id: 1,
      date: "2026-03",
      type: "Projeto Acadêmico",
      icon: <GraduationCap size={14} />,
      description:
        "Publicou plano de marketing para ONG local",
    },

    {
      id: 2,
      date: "2026-02",
      type: "Experiência Profissional",
      icon: <BriefcaseBusiness size={14} />,
      description:
        "Concluiu estágio em Recursos Humanos",
    },

    {
      id: 3,
      date: "2026-01",
      type: "Certificação",
      icon: <BadgeCheck size={14} />,
      description:
        "Obteve certificação em Gestão de Projetos (FGV)",
    },

    {
      id: 4,
      date: "2025-11",
      type: "Pesquisa",
      icon: <FlaskConical size={14} />,
      description:
        "Participou de pesquisa acadêmica sobre liderança",
    },
  ];

  const handleNavPublicar = () => {
    navigate("/student/publicar");
  }


  return (
    <div className="student-profile">
      {/* HEADER */}
      <div className="student-profile__header">

        <div className="student-profile__cover" />

        <div className="student-profile__top">

          <div className="student-profile__avatar">

            <img
              src={
                studentProfile.profileImage ||
                "https://api.dicebear.com/7.x/adventurer/svg?seed=User"
              }
              alt={user?.name}
            />

          </div>

          <span className="student-profile__badge">

            <GraduationCap size={14} />

            Conta de Estudante

          </span>

        </div>

        <div className="student-profile__info">

          <div>

            <h1>
              {user?.name}
            </h1>

            <p className="student-profile__course">

              {studentProfile.course ||
                "Curso não informado"}

            </p>

            <p className="student-profile__bio">

              {studentProfile.bio ||
                "Adicione uma descrição para que recrutadores conheçam melhor seu perfil."}

            </p>

            <div className="student-profile__education">

              <GraduationCap size={18} />

              <div>

                <strong>
                  {studentProfile.university ||
                    "Universidade não informada"}
                </strong>

                <span>
                  Formação Acadêmica
                </span>

              </div>

            </div>

            <div className="student-profile__meta">

              <span>

                <MapPin size={16} />

                {studentProfile.location ||
                  "Localização não informada"}

              </span>

              <span>

                <CalendarDays size={16} />

                Membro desde{" "}

                {user?.createdAt
                  ? new Date(
                    user.createdAt
                  ).toLocaleDateString(
                    "pt-BR",
                    {
                      month: "long",
                      year: "numeric",
                    }
                  )
                  : "-"}

              </span>

            </div>

            <div className="student-profile__links-inline">

              {studentProfile.linkedin && (

                <a
                  href={studentProfile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >

                  <ExternalLink size={16} />

                  LinkedIn

                </a>

              )}

              {studentProfile.github && (

                <a
                  href={studentProfile.github}
                  target="_blank"
                  rel="noreferrer"
                >

                  <ExternalLink size={16} />

                  GitHub

                </a>

              )}

            </div>

          </div>

          <button
            className="student-profile__edit"
            onClick={handleOpenEdit}
          >

            <Pencil size={18} />

            Editar Perfil

          </button>

        </div>

        <div className="student-profile__stats">

          <div>

            <strong>
              {userPosts.length}
            </strong>

            <span>
              Publicações
            </span>

          </div>

          <div>

            <strong>
              {studentProfile.skills?.length || 0}
            </strong>

            <span>
              Habilidades
            </span>

          </div>

          <div>

            <strong className="highlight">

              {studentProfile.university &&
                studentProfile.course &&
                studentProfile.location
                ? "100%"
                : "70%"}

            </strong>

            <span>
              Perfil Completo
            </span>

          </div>

        </div>

      </div>

      <div className="student-profile__section">

        <h2>Sobre</h2>

        <p className="student-profile__about">

          {studentProfile.bio ||
            "Nenhuma descrição adicionada."}

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

            <div
              className="student-profile__progress-fill"
              style={{ width: "78%" }}
            />

          </div>

          <p>
            Adicione seu currículo para completar o
            perfil.
          </p>

        </div>

        <div className="student-profile__card">

          <div className="student-profile__cv">

            <div>

              <FileText size={22} />

              <div>

                <h3>Currículo</h3>

                <p>
                  Envie seu CV em PDF para
                  recrutadores.
                </p>

              </div>

            </div>

            <button>
              Upload de Currículo
            </button>

          </div>

        </div>

      </div>

      {/* HABILIDADES */}
      <div className="student-profile__section">
        <div className="student-profile__section-header">
          <h2>Habilidades</h2>
          <button>
            <Plus size={18} />
            Adicionar
          </button>
        </div>
        
        <div className="student-profile__skills">
          {studentProfile.skills?.map((skill) => (
            <span
              key={
                typeof skill === "string"
                  ? skill
                  : skill.id
              }
            >
              {typeof skill === "string"
                ? skill
                : skill.name}
            </span>
          ))}
        </div>
      </div>

      {/* LINKS */}
      <div className="student-profile__section">

        <h2>Links</h2>

        <div className="student-profile__links">

          <a href="/">
            <ExternalLink size={18} />
            Portfólio
          </a>

          <a href="/">
            <ExternalLink size={18} />
            LinkedIn
          </a>

        </div>

      </div>

      {/* PUBLICAÇÕES */}
      <div className="student-profile__section">

        <div className="student-profile__section-header">

          <h2>Minhas Publicações</h2>

          <button onClick={handleNavPublicar}>
            <Plus size={18} />
            Nova
          </button>

        </div>

        {loadingPosts ? (

          <p>
            Carregando publicações...
          </p>

        ) : userPosts.length === 0 ? (

          <div className="student-profile__empty">

            <User size={48} />

            <p>
              Nenhuma publicação ainda.
            </p>

          </div>

        ) : (

          <div className="student-profile__posts-scroll">

            {userPosts.map((post) => (

              <div
                className="student-profile__post-card"
                key={post.id}
              >

                {post.mediaUrl && (

                  <div className="post-image">

                    <img
                      src={post.mediaUrl}
                      alt={post.title}
                    />

                  </div>

                )}

                <div className="post-content">

                  <span className="post-type">
                    {post.activityType}
                  </span>

                  <h3>
                    {post.title}
                  </h3>

                  <p>
                    {post.description}
                  </p>

                  <span className="post-level">
                    {post.level}
                  </span>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

      {/* TRAJETÓRIA */}
      <div className="student-profile__section">

        <h2>Trajetória</h2>

        <div className="student-profile__timeline">

          {timeline.map((item) => (

            <div
              className="student-profile__timeline-item"
              key={item.id}
            >

              <div className="student-profile__timeline-dot" />

              <div className="student-profile__timeline-content">

                <div className="student-profile__timeline-top">

                  <span className="date">
                    {item.date}
                  </span>

                  <span className="tag">

                    {item.icon}

                    {item.type}

                  </span>

                </div>

                <p>
                  {item.description}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>
      {/* MODAL EDITAR PERFIL */}
      {showEditModal && (

        <div className="student-profile__modal-overlay">

          <div className="student-profile__modal">

            <div className="student-profile__modal-header">

              <h2>Editar Perfil</h2>

              <button
                onClick={() =>
                  setShowEditModal(false)
                }
              >
                <X size={20} />
              </button>

            </div>

            <div className="student-profile__modal-body">

              <div className="student-profile__form-group">

                <label>Foto do Perfil</label>

                <input
                  type="text"
                  value={editForm.profileImage}
                  placeholder="https://..."
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      profileImage:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="student-profile__form-group">

                <label>Curso</label>

                <input
                  type="text"
                  value={editForm.course}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      course:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="student-profile__form-group">

                <label>Universidade</label>

                <input
                  type="text"
                  value={editForm.university}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      university:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="student-profile__form-group">

                <label>Localização</label>

                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      location:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="student-profile__form-group">

                <label>LinkedIn</label>

                <input
                  type="text"
                  value={editForm.linkedin}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      linkedin:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="student-profile__form-group">

                <label>GitHub</label>

                <input
                  type="text"
                  value={editForm.github}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      github:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="student-profile__form-group">

                <label>Habilidades</label>

                <input
                  type="text"
                  placeholder="React, C#, SQL..."
                  value={
                    editForm.skills.join(", ")
                  }
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      skills:
                        e.target.value
                          .split(",")
                          .map((skill) =>
                            skill.trim()
                          )
                          .filter(Boolean),
                    })
                  }
                />

              </div>

              <div className="student-profile__form-group">

                <label>Sobre você</label>

                <textarea
                  rows={5}
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      bio:
                        e.target.value,
                    })
                  }
                />

              </div>

            </div>

            <div className="student-profile__modal-footer">

              <button
                className="cancel"
                onClick={() =>
                  setShowEditModal(false)
                }
              >
                Cancelar
              </button>

              <button
                className="save"
                onClick={handleSaveProfile}
              >
                <Save size={18} />
                Salvar Alterações
              </button>

            </div>

          </div>

        </div>

      )}
    </div>
  );
}