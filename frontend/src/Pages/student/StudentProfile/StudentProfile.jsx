import { useEffect, useState } from "react";

import {
  Bell,
  Building2,
  Check,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import API_URL from "../../../service/api";

import "./StudentProfile.scss";

export default function StudentProfile() {

  const navigate = useNavigate();

  const [openNotifications, setOpenNotifications] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [recruiterInvites, setRecruiterInvites] =
    useState([]);

  const [isTransitioning, setIsTransitioning] =
    useState(false);

  const [transitionUser, setTransitionUser] =
    useState("");

  // =========================
  // BUSCAR CONVITES
  // =========================

  useEffect(() => {
    fetchInvites();
  }, []);

  const fetchInvites = async () => {
    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/User/invites`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Erro ao buscar convites"
        );
      }

      setRecruiterInvites(data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ACEITAR CONVITE
  // =========================

  const handleAcceptInvite = async (
    inviteId
  ) => {
    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/User/accept-invite/${inviteId}`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Erro ao aceitar convite"
        );
      }

      // USER LOCAL
      const currentUser =
        JSON.parse(
          localStorage.getItem("user")
        );

      // MOSTRA TELA DE TRANSIÇÃO
      setTransitionUser(currentUser.name);
      setIsTransitioning(true);

      // ALTERA ROLE
      const updatedUser = {
        ...currentUser,
        role: "recruiter",
      };

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      // AGUARDA 3 SEGUNDOS E REDIRECIONA
      setTimeout(() => {
        navigate("/recruiter/profile");
      }, 3000);

    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // RECUSAR CONVITE
  // =========================

  const handleRejectInvite = async (
    inviteId
  ) => {
    try {

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/User/reject-invite/${inviteId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Erro ao recusar convite"
        );
      }

      // REMOVE LOCALMENTE
      setRecruiterInvites((prev) =>
        prev.filter(
          (invite) =>
            invite.id !== inviteId
        )
      );

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="student-profile">

      {/* TELA DE TRANSIÇÃO */}
      {isTransitioning && (
        <div className="student-profile__transition">
          <div className="student-profile__transition-content">
            <div className="student-profile__transition-header">
              <h2>Parabéns, {transitionUser}! 🎉</h2>
              <p>
                Você acaba de iniciar uma nova jornada na nossa plataforma...
              </p>
            </div>

            <div className="student-profile__transition-loader">
              <div className="spinner"></div>
              <p>Carregando novo visual...</p>
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="student-profile__header">

        <div>

          <span className="student-profile__subtitle">
            Área do estudante
          </span>

          <h1 className="student-profile__title">
            Meu Perfil
          </h1>

        </div>

        {/* NOTIFICAÇÕES */}
        <div className="student-profile__notifications">

          <button
            className="student-profile__notification-button"
            onClick={() =>
              setOpenNotifications(
                !openNotifications
              )
            }
          >

            <Bell size={20} />

            {recruiterInvites.length > 0 && (
              <span className="student-profile__badge">
                {recruiterInvites.length}
              </span>
            )}

          </button>

          {/* MODAL */}
          {openNotifications && (
            <div className="student-profile__notification-modal">

              <div className="student-profile__notification-header">

                <h3>Notificações</h3>

                <span>
                  {recruiterInvites.length}
                  {" "}convite(s)
                </span>

              </div>

              {loading ? (
                <div className="student-profile__empty">
                  Carregando...
                </div>
              ) : recruiterInvites.length === 0 ? (
                <div className="student-profile__empty">
                  Nenhuma notificação encontrada
                </div>
              ) : (
                recruiterInvites.map((invite) => (
                  <div
                    key={invite.id}
                    className="student-profile__invite"
                  >

                    <div className="student-profile__invite-icon">
                      <Building2 size={20} />
                    </div>

                    <div className="student-profile__invite-content">

                      <h4>
                        Convite para recrutador
                      </h4>

                      <p>
                        A empresa{" "}
                        <strong>
                          {invite.company.name}
                        </strong>
                        {" "}
                        convidou você para se tornar recrutador.
                      </p>

                      <span>
                        Cargo: {invite.position}
                      </span>

                      <div className="student-profile__invite-actions">

                        <button
                          className="accept"
                          onClick={() =>
                            handleAcceptInvite(
                              invite.id
                            )
                          }
                        >

                          <Check size={16} />

                          Aceitar

                        </button>

                        <button
                          className="reject"
                          onClick={() =>
                            handleRejectInvite(
                              invite.id
                            )
                          }
                        >

                          <X size={16} />

                          Recusar

                        </button>

                      </div>

                    </div>

                  </div>
                ))
              )}

            </div>
          )}

        </div>

      </div>

      {/* CONTEÚDO */}
      <div className="student-profile__content">

        <div className="student-profile__card">

          <h2>Bem-vindo 👋</h2>

          <p>
            Aqui ficará o perfil completo do estudante,
            projetos, currículo, experiências e muito mais.
          </p>

        </div>

      </div>

    </div>
  );
}