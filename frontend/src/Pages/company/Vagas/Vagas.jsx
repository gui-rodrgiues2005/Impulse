import { useEffect, useState } from "react";
import "./Vagas.scss";
import API_URL from "../../../service/api";
import {
  Search, Plus, BriefcaseBusiness, Ellipsis, X,
  Users, MapPin, GraduationCap, ExternalLink, ArrowLeft
} from "lucide-react";

export default function Vagas() {

  // =========================================
  // ESTADOS
  // =========================================

  // Lista de vagas da empresa
  const [vagas, setVagas] = useState([]);

  // Controla se o modal de criar vaga está aberto
  const [modalOpen, setModalOpen] = useState(false);

  // Controla se o modal de editar vaga está aberto
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Controla se o modal de candidatos está aberto
  const [candidatesModalOpen, setCandidatesModalOpen] = useState(false);

  // Vaga selecionada (para editar ou ver candidatos)
  const [selectedJob, setSelectedJob] = useState(null);

  // Candidato selecionado para ver o mini perfil
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Lista de candidatos da vaga selecionada
  const [candidates, setCandidates] = useState([]);

  // Controla o loading dos candidatos
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  // Dados do formulário de criar vaga
  const [formData, setFormData] = useState({
    title: "", area: "", type: "", location: ""
  });

  // Dados do formulário de editar vaga
  const [editFormData, setEditFormData] = useState({
    title: "", area: "", type: "", location: ""
  });

  // =========================================
  // FUNÇÕES
  // =========================================

  // Busca todas as vagas da empresa no backend
  async function loadJobs() {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/jobs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setVagas(data);
    } catch (error) {
      console.log(error);
    }
  }

  // Abre o modal de candidatos e busca a lista de quem se candidatou à vaga
  async function handleOpenCandidates(vaga) {
    setSelectedJob(vaga);
    setSelectedCandidate(null); // Garante que nenhum candidato está selecionado ao abrir
    setCandidatesModalOpen(true);
    setLoadingCandidates(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/jobs/${vaga.id}/candidates`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      setCandidates(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingCandidates(false);
    }
  }

  // Fecha o modal de candidatos e limpa os estados relacionados
  function handleCloseCandidates() {
    setCandidatesModalOpen(false);
    setCandidates([]);
    setSelectedCandidate(null);
  }

  // Carrega as vagas assim que o componente é montado
  useEffect(() => { loadJobs(); }, []);

  // Atualiza os dados do formulário de criar vaga conforme o usuário digita
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // Abre o modal de edição preenchendo os campos com os dados da vaga selecionada
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

  // Atualiza os dados do formulário de editar vaga conforme o usuário digita
  function handleEditChange(e) {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  }

  // Envia a requisição de atualização da vaga para o backend
  async function handleUpdateJob(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/jobs/${selectedJob.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editFormData),
      });
      if (!response.ok) throw new Error("Erro ao atualizar vaga");
      setEditModalOpen(false);
      setSelectedJob(null);
      loadJobs(); // Recarrega a lista após atualizar
    } catch (error) {
      console.log(error);
    }
  }

  // Envia a requisição de criação de nova vaga para o backend
  async function handleCreateJob(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Erro ao criar vaga");
      setModalOpen(false);
      setFormData({ title: "", area: "", type: "", location: "" }); // Limpa o formulário
      loadJobs(); // Recarrega a lista após criar
    } catch (error) {
      console.log(error);
    }
  }

  // Formata a data para o padrão brasileiro (dd/mm/aaaa)
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString("pt-BR");

  // Retorna a especialidade principal do candidato
  // Prioridade: 1ª skill > curso > mensagem padrão
  const getSpecialty = (c) => {
    if (c.student.skills?.length > 0) return c.student.skills[0];
    if (c.student.profile?.course) return c.student.profile.course;
    return "Especialidade não informada";
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="company-jobs">

      {/* CABEÇALHO DA PÁGINA */}
      <div className="company-jobs__header">
        <div>
          <span className="company-jobs__subtitle">Gestão de vagas</span>
          <h1 className="company-jobs__title">Vagas da empresa</h1>
        </div>
        <button className="company-jobs__button" onClick={() => setModalOpen(true)}>
          <Plus size={18} /> Nova vaga
        </button>
      </div>

      {/* BARRA DE BUSCA */}
      <div className="company-jobs__search">
        <Search size={20} className="company-jobs__search-icon" />
        <input type="text" placeholder="Buscar vagas..." />
      </div>

      {/* TABELA DE VAGAS */}
      <div className="company-jobs__table-wrapper">
        <table className="company-jobs__table">
          <thead>
            <tr>
              <th>VAGA</th><th>ÁREA</th><th>TIPO</th><th>LOCAL</th>
              <th>CANDIDATOS</th><th>STATUS</th><th></th>
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

                {/* Botão clicável que mostra o número de candidatos e abre o modal */}
                <td>
                  <button
                    className="company-jobs__candidates-btn"
                    onClick={() => handleOpenCandidates(vaga)}
                    title="Ver candidatos"
                  >
                    <Users size={15} />
                    {vaga.candidates}
                  </button>
                </td>

                <td><span className="status-badge">{vaga.status}</span></td>

                {/* Botão de abrir modal de edição */}
                <td>
                  <button className="company-jobs__menu" onClick={() => handleOpenEditModal(vaga)}>
                    <Ellipsis size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================================
          MODAL DE CANDIDATOS
          - Mostra lista de candidatos da vaga
          - Ao clicar em um candidato, mostra o mini perfil
      ========================================= */}
      {candidatesModalOpen && (
        <div className="modal-overlay">
          <div className="modal modal--wide">
            <div className="modal-header">

              {/* Header muda conforme está na lista ou no perfil */}
              {selectedCandidate ? (
                <button className="modal-back" onClick={() => setSelectedCandidate(null)}>
                  <ArrowLeft size={18} /> Voltar
                </button>
              ) : (
                <h2><Users size={18} /> Candidatos — {selectedJob?.title}</h2>
              )}

              <button onClick={handleCloseCandidates}><X size={20} /></button>
            </div>

            {/* LISTA DE CANDIDATOS — aparece quando nenhum candidato está selecionado */}
            {!selectedCandidate && (
              <>
                {loadingCandidates ? (
                  <p className="modal-info">Carregando candidatos...</p>
                ) : candidates.length === 0 ? (
                  <p className="modal-info">Nenhum candidato ainda.</p>
                ) : (
                  <ul className="candidates-list">
                    {candidates.map((c) => (
                      <li
                        key={c.id}
                        className="candidates-list__item"
                        onClick={() => setSelectedCandidate(c)} // Seleciona o candidato para ver o perfil
                      >
                        {/* Foto do candidato ou inicial do nome */}
                        <div className="candidates-list__avatar">
                          {c.student.profile?.profileImage || c.student.avatarUrl
                            ? <img src={c.student.profile?.profileImage || c.student.avatarUrl} alt={c.student.name} />
                            : <span>{c.student.name?.charAt(0).toUpperCase()}</span>
                          }
                        </div>

                        {/* Nome e especialidade principal */}
                        <div className="candidates-list__info">
                          <h4>{c.student.name}</h4>
                          <span className="candidates-list__specialty">
                            {getSpecialty(c)}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}

            {/* MINI PERFIL DO CANDIDATO — aparece ao clicar em um candidato da lista */}
            {selectedCandidate && (
              <div className="candidate-profile">

                {/* Cabeçalho com foto, nome, curso, universidade e localização */}
                <div className="candidate-profile__header">
                  <div className="candidate-profile__avatar">
                    {selectedCandidate.student.profile?.profileImage || selectedCandidate.student.avatarUrl
                      ? <img src={selectedCandidate.student.profile?.profileImage || selectedCandidate.student.avatarUrl} alt={selectedCandidate.student.name} />
                      : <span>{selectedCandidate.student.name?.charAt(0).toUpperCase()}</span>
                    }
                  </div>
                  <div className="candidate-profile__info">
                    <h3>{selectedCandidate.student.name}</h3>
                    <span>{selectedCandidate.student.profile?.course || "Curso não informado"}</span>
                    {selectedCandidate.student.profile?.university && (
                      <span className="candidate-profile__university">
                        <GraduationCap size={14} />
                        {selectedCandidate.student.profile.university}
                      </span>
                    )}
                    {selectedCandidate.student.profile?.location && (
                      <span className="candidate-profile__location">
                        <MapPin size={14} />
                        {selectedCandidate.student.profile.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bio do candidato */}
                {selectedCandidate.student.profile?.bio && (
                  <div className="candidate-profile__section">
                    <h4>Sobre</h4>
                    <p>{selectedCandidate.student.profile.bio}</p>
                  </div>
                )}

                {/* Lista de habilidades */}
                {selectedCandidate.student.skills?.length > 0 && (
                  <div className="candidate-profile__section">
                    <h4>Habilidades</h4>
                    <div className="candidate-profile__skills">
                      {selectedCandidate.student.skills.map((s, i) => (
                        <span key={i} className="skill-tag">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Email de contato */}
                <div className="candidate-profile__section">
                  <h4>Contato</h4>
                  <span className="candidate-profile__email">{selectedCandidate.student.email}</span>
                </div>

                {/* Links externos: LinkedIn e GitHub */}
                {(selectedCandidate.student.profile?.linkedin || selectedCandidate.student.profile?.github) && (
                  <div className="candidate-profile__links">
                    {selectedCandidate.student.profile.linkedin && (
                      <a href={selectedCandidate.student.profile.linkedin} target="_blank" rel="noreferrer">
                        <ExternalLink size={14} /> LinkedIn
                      </a>
                    )}
                    {selectedCandidate.student.profile.github && (
                      <a href={selectedCandidate.student.profile.github} target="_blank" rel="noreferrer">
                        <ExternalLink size={14} /> GitHub
                      </a>
                    )}
                  </div>
                )}

                {/* Data de candidatura */}
                <div className="candidate-profile__applied">
                  Candidatou-se em {formatDate(selectedCandidate.appliedAt)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================
          MODAL DE CRIAR NOVA VAGA
      ========================================= */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Nova vaga</h2>
              <button onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateJob}>
              <input type="text" name="title" placeholder="Título da vaga" value={formData.title} onChange={handleChange} />
              <input type="text" name="area" placeholder="Área" value={formData.area} onChange={handleChange} />
              <input type="text" name="type" placeholder="Tipo" value={formData.type} onChange={handleChange} />
              <input type="text" name="location" placeholder="Localização" value={formData.location} onChange={handleChange} />
              <button type="submit">Criar vaga</button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL DE EDITAR VAGA
      ========================================= */}
      {editModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Editar vaga</h2>
              <button onClick={() => setEditModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleUpdateJob}>
              <input type="text" name="title" placeholder="Título da vaga" value={editFormData.title} onChange={handleEditChange} />
              <input type="text" name="area" placeholder="Área" value={editFormData.area} onChange={handleEditChange} />
              <input type="text" name="type" placeholder="Tipo" value={editFormData.type} onChange={handleEditChange} />
              <input type="text" name="location" placeholder="Localização" value={editFormData.location} onChange={handleEditChange} />
              <button type="submit">Salvar alterações</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}