import { useEffect, useState } from "react";
import API_URL from "../../../service/api";

import "./Recrutadores.scss";

import {
  UserPlus,
  Mail,
  Ellipsis,
  X,
  Search,
} from "lucide-react";

export default function Recrutadores() {
  const [recrutadores, setRecrutadores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [search, setSearch] = useState("");

  const [inviteForm, setInviteForm] = useState({
    email: "",
    cargo: "",
  });

  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");

  const [openEditModal, setOpenEditModal] = useState(false);

  const [selectedRecruiter, setSelectedRecruiter] = useState(null);

  const [editForm, setEditForm] = useState({
    email: "",
    cargo: "",
  });


  // =========================
  // LOAD RECRUITERS FROM API
  // =========================
  const loadRecruiters = async () => {
    try {
      const userStr = localStorage.getItem("user");

      if (!userStr) return;

      const user = JSON.parse(userStr);

      if (!user.companyId) return;

      const response = await fetch(
        `${API_URL}/Company/${user.companyId}/recruiters`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao buscar recrutadores");
      }

      // normaliza pro formato da UI
      const mapped = data.map((r) => ({
        id: r.id,
        nome: r.user.name,
        email: r.user.email,
        cargo: r.position,
        vagas: 0,
        contratacoes: 0,
        status: "Ativo",
        avatar: "🧑‍💼",
      }));

      setRecrutadores(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecruiters();
  }, []);

  // =========================
  // INVITE RECRUITER
  // =========================
  const handleInviteRecruiter = async () => {
    setInviteError("");
    setInviteSuccess("");

    try {
      const userStr = localStorage.getItem("user");

      if (!userStr) throw new Error("Usuário não encontrado");

      const user = JSON.parse(userStr);

      if (!user.companyId) {
        throw new Error("CompanyId não encontrado");
      }

      const response = await fetch(
        `${API_URL}/Company/${user.companyId}/invite-recruiter`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: inviteForm.email,
            position: inviteForm.cargo,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erro ao convidar recrutador");
      }

      setInviteSuccess("Convite enviado com sucesso!");
      setInviteForm({ email: "", cargo: "" });

      // recarrega lista depois de convidar
      loadRecruiters();

      setTimeout(() => {
        setOpenInviteModal(false);
      }, 1200);

    } catch (err) {
      setInviteError(err.message);
    }
  };

  function handleOpenEditModal(recruiter) {

    setSelectedRecruiter(recruiter);

    setEditForm({
      email: recruiter.email,
      cargo: recruiter.cargo,
    });

    setOpenEditModal(true);
  }

  function handleEditChange(e) {

    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  }

  const handleUpdateRecruiter = async () => {

    try {

      const userStr = localStorage.getItem("user");

      if (!userStr) return;

      const user = JSON.parse(userStr);

      const response = await fetch(
        `${API_URL}/Company/${user.companyId}/recruiters/${selectedRecruiter.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: editForm.email,
            position: editForm.cargo,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setOpenEditModal(false);

      loadRecruiters();

    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // FILTER
  // =========================
  const recrutadoresFiltrados = recrutadores.filter((r) =>
    r.nome.toLowerCase().includes(search.toLowerCase()) ||
    r.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="company-recruiters">

      {/* HEADER */}
      <div className="company-recruiters__header">

        <div>
          <span className="company-recruiters__subtitle">
            Equipe de recrutamento
          </span>

          <h1 className="company-recruiters__title">
            Recrutadores
          </h1>
        </div>

        <button
          className="company-recruiters__button"
          onClick={() => setOpenInviteModal(true)}
        >
          <UserPlus size={18} />
          Convidar recrutador
        </button>
      </div>

      {/* SEARCH */}
      <div className="company-recruiters__search">
        <Search size={18} />

        <input
          type="text"
          placeholder="Buscar recrutador..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="company-recruiters__table-wrapper">

        <table className="company-recruiters__table">

          <thead>
            <tr>
              <th>RECRUTADOR</th>
              <th>E-MAIL</th>
              <th>VAGAS ATIVAS</th>
              <th>CONTRATAÇÕES</th>
              <th>STATUS</th>
              <th></th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td colSpan="6">Carregando...</td>
              </tr>
            ) : (
              recrutadoresFiltrados.map((r) => (
                <tr key={r.id}>

                  <td>
                    <div className="company-recruiters__user">
                      <div className="company-recruiters__avatar">
                        {r.avatar}
                      </div>
                      <span>{r.nome}</span>
                    </div>
                  </td>

                  <td>
                    <div className="company-recruiters__email">
                      <Mail size={16} />
                      <span>{r.email}</span>
                    </div>
                  </td>

                  <td className="company-recruiters__number">
                    {r.vagas}
                  </td>

                  <td className="company-recruiters__number company-recruiters__number--green">
                    {r.contratacoes}
                  </td>

                  <td>
                    <span className="recruiter-status recruiter-status--ativo">
                      {r.status}
                    </span>
                  </td>

                  <button
                    className="company-recruiters__menu"
                    onClick={() => handleOpenEditModal(r)}
                  >
                    <Ellipsis size={18} />
                  </button>

                </tr>
              ))
            )}

          </tbody>

        </table>

      </div>

      {/* MODAL */}
      {openInviteModal && (
        <div className="recruiter-modal__overlay">

          <div className="recruiter-modal">

            <div className="recruiter-modal__header">

              <div>
                <h2>Convidar recrutador</h2>
                <p>Adicione um novo membro para sua equipe.</p>
              </div>

              <button onClick={() => setOpenInviteModal(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="recruiter-modal__content">

              <div className="recruiter-modal__field">
                <label>E-mail do usuário</label>
                <input
                  type="email"
                  value={inviteForm.email}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, email: e.target.value })
                  }
                />
              </div>

              <div className="recruiter-modal__field">
                <label>Cargo</label>
                <input
                  type="text"
                  value={inviteForm.cargo}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, cargo: e.target.value })
                  }
                />
              </div>

              {inviteError && <p className="error">{inviteError}</p>}
              {inviteSuccess && <p className="success">{inviteSuccess}</p>}

            </div>

            <div className="recruiter-modal__footer">

              <button
                className="secondary"
                onClick={() => setOpenInviteModal(false)}
              >
                Cancelar
              </button>

              <button className="primary" onClick={handleInviteRecruiter}>
                Enviar convite
              </button>

            </div>

          </div>

        </div>
      )}

      {openEditModal && (

        <div className="recruiter-modal__overlay">

          <div className="recruiter-modal">

            <div className="recruiter-modal__header">

              <div>
                <h2>Editar recrutador</h2>
                <p>Atualize as informações do recrutador.</p>
              </div>

              <button onClick={() => setOpenEditModal(false)}>
                <X size={20} />
              </button>

            </div>

            <div className="recruiter-modal__content">

              <div className="recruiter-modal__field">

                <label>E-mail</label>

                <input
                  type="email"
                  name="email"
                  value={editForm.email}
                  onChange={handleEditChange}
                />

              </div>

              <div className="recruiter-modal__field">

                <label>Cargo</label>

                <input
                  type="text"
                  name="cargo"
                  value={editForm.cargo}
                  onChange={handleEditChange}
                />

              </div>

            </div>

            <div className="recruiter-modal__footer">

              <button
                className="secondary"
                onClick={() => setOpenEditModal(false)}
              >
                Cancelar
              </button>

              <button
                className="primary"
                onClick={handleUpdateRecruiter}
              >
                Salvar alterações
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}