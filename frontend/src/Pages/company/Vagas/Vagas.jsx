import { useEffect, useState } from "react";

import "./Vagas.scss";

import API_URL from "../../../service/api";

import {
  Search,
  Plus,
  BriefcaseBusiness,
  Ellipsis,
  X,
} from "lucide-react";

export default function Vagas() {

  const userStr = localStorage.getItem("user");

  if (!userStr) {
    throw new Error("Usuário não encontrado");
  }

  const user = JSON.parse(userStr);

  if (!user.companyId) {
    throw new Error("CompanyId não encontrado");
  }

  const companyId = user.companyId;

  const [vagas, setVagas] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  
  const [editModalOpen, setEditModalOpen] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null);

  const [editFormData, setEditFormData] = useState({
    title: "",
    area: "",
    type: "",
    location: "",
  });
  async function loadJobs() {
    try {

      const response = await fetch(
        `${API_URL}/Company/${companyId}/jobs`
      );

      const data = await response.json();

      setVagas(data);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  function handleChange(e) {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleOpenEditModal(vaga) {

    setSelectedJob(vaga);

    setEditFormData({
      title: vaga.title,
      area: vaga.area,
      type: vaga.type,
      location: vaga.location,
    });

    setEditModalOpen(true);
  }

  function handleEditChange(e) {

    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleUpdateJob(e) {

    e.preventDefault();

    try {

      const response = await fetch(
        `${API_URL}/Company/${companyId}/jobs/${selectedJob.id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(editFormData),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar vaga");
      }

      setEditModalOpen(false);

      setSelectedJob(null);

      loadJobs();

    } catch (error) {
      console.log(error);
    }
  }

  async function handleCreateJob(e) {

    e.preventDefault();

    try {

      const response = await fetch(
        `${API_URL}/Company/${companyId}/jobs`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao criar vaga");
      }

      setModalOpen(false);

      setFormData({
        title: "",
        area: "",
        type: "",
        location: "",
      });

      loadJobs();

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="company-jobs">

      <div className="company-jobs__header">

        <div>

          <span className="company-jobs__subtitle">
            Gestão de vagas
          </span>

          <h1 className="company-jobs__title">
            Vagas da empresa
          </h1>

        </div>

        <button
          className="company-jobs__button"
          onClick={() => setModalOpen(true)}
        >
          <Plus size={18} />
          Nova vaga
        </button>

      </div>

      <div className="company-jobs__search">

        <Search
          size={20}
          className="company-jobs__search-icon"
        />

        <input
          type="text"
          placeholder="Buscar vagas..."
        />

      </div>

      <div className="company-jobs__table-wrapper">

        <table className="company-jobs__table">

          <thead>

            <tr>
              <th>VAGA</th>
              <th>ÁREA</th>
              <th>TIPO</th>
              <th>LOCAL</th>
              <th>CANDIDATOS</th>
              <th>STATUS</th>
              <th></th>
            </tr>

          </thead>

          <tbody>
            {vagas.map((vaga) => (

              <tr key={vaga.id}>

                <td>

                  <div className="company-jobs__vaga">

                    <div className="company-jobs__vaga-icon">
                      <BriefcaseBusiness size={18} />
                    </div>

                    <span>{vaga.title}</span>

                  </div>

                </td>

                <td>{vaga.area}</td>

                <td>{vaga.type}</td>

                <td>{vaga.location}</td>

                <td className="company-jobs__candidates">
                  {vaga.candidates}
                </td>

                <td>

                  <span className="status-badge">
                    {vaga.status}
                  </span>

                </td>

                <td>

                  <button
                    className="company-jobs__menu"
                    onClick={() => handleOpenEditModal(vaga)}
                  >
                    <Ellipsis size={18} />
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {modalOpen && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h2>Nova vaga</h2>

              <button onClick={() => setModalOpen(false)}>
                <X size={20} />
              </button>

            </div>

            <form onSubmit={handleCreateJob}>

              <input
                type="text"
                name="title"
                placeholder="Título da vaga"
                value={formData.title}
                onChange={handleChange}
              />

              <input
                type="text"
                name="area"
                placeholder="Área"
                value={formData.area}
                onChange={handleChange}
              />

              <input
                type="text"
                name="type"
                placeholder="Tipo"
                value={formData.type}
                onChange={handleChange}
              />

              <input
                type="text"
                name="location"
                placeholder="Localização"
                value={formData.location}
                onChange={handleChange}
              />

              <button type="submit">
                Criar vaga
              </button>

            </form>

          </div>

        </div>

      )}

      {editModalOpen && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h2>Editar vaga</h2>

              <button onClick={() => setEditModalOpen(false)}>
                <X size={20} />
              </button>

            </div>

            <form onSubmit={handleUpdateJob}>

              <input
                type="text"
                name="title"
                placeholder="Título da vaga"
                value={editFormData.title}
                onChange={handleEditChange}
              />

              <input
                type="text"
                name="area"
                placeholder="Área"
                value={editFormData.area}
                onChange={handleEditChange}
              />

              <input
                type="text"
                name="type"
                placeholder="Tipo"
                value={editFormData.type}
                onChange={handleEditChange}
              />

              <input
                type="text"
                name="location"
                placeholder="Localização"
                value={editFormData.location}
                onChange={handleEditChange}
              />

              <button type="submit">
                Salvar alterações
              </button>

            </form>

          </div>

        </div>

      )}
    </div>
  );
}