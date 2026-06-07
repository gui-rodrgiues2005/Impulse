import { useEffect, useState } from "react";
import "./CompanyProfile.scss";
import API_URL from "../../../service/api";
import {
  Building2,
  MapPin,
  Globe,
  PencilLine,
  X,
  Save,
  Plus,
  ExternalLink,
  BadgeCheck,
  Briefcase,
  FileText,
  Users,
  ChevronRight,
} from "lucide-react";

const CompanyProfile = () => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    profileImage: "",
    legalName: "",
    cnpj: "",
    sector: "",
    areas: "",
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const formatUrl = (url) => {
    if (!url) return "#";
    return url.startsWith("http") ? url : `https://${url}`;
  };

  const loadCompany = async () => {
    try {
      if (!user.companyId) return;
      const response = await fetch(`${API_URL}/Company/${user.companyId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setCompany(data);
      setFormData({
        name: data.name || "",
        description: data.description || "",
        website: data.website || "",
        location: data.location || "",
        profileImage: data.profileImage || "",
        legalName: data.legalName || "",
        cnpj: data.cnpj || "",
        sector: data.sector || "",
        areas: data.areas || "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/publicacoes/my-posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) setPosts(await response.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPosts(false);
    }
  };

  const loadJobs = async () => {
    try {
      if (!user.companyId) return;
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/Company/${user.companyId}/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) setJobs(await response.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    loadCompany();
    loadPosts();
    loadJobs();
  }, []);

  const uploadLogo = async () => {
    if (!selectedLogo) return null;
    const formDataUpload = new FormData();
    formDataUpload.append("file", selectedLogo);
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/Update/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formDataUpload,
    });
    if (!response.ok) throw new Error("Erro ao enviar logo");
    const data = await response.json();
    return data.url;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateCompany = async () => {
    try {
      setUploadingLogo(true);
      let profileImageUrl = formData.profileImage;
      if (selectedLogo) {
        profileImageUrl = await uploadLogo();
        if (!profileImageUrl) throw new Error("Falha no upload da logo");
      }
      const response = await fetch(`${API_URL}/Company/${user.companyId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, profileImage: profileImageUrl }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setSelectedLogo(null);
      setOpenModal(false);
      loadCompany();
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingLogo(false);
    }
  };

  if (loading) return <p className="company-profile__loading">Carregando...</p>;

  const areas = company?.areas
    ? company.areas.split(",").map((a) => a.trim()).filter(Boolean)
    : [];

  return (
    <div className="company-profile">

      {/* HEADER */}
      <div className="company-profile__header">
        <div className="company-profile__cover">
          <div className="company-profile__cover-pattern" />
        </div>

        <div className="company-profile__top">
          <div className="company-profile__logo">
            <img
              src={company?.profileImage || ""}
              alt={company?.name}
            />
          </div>
          <span className="company-profile__badge">
            <BadgeCheck size={13} />
            Empresa Verificada
          </span>
        </div>

        <div className="company-profile__info">
          <div className="company-profile__info-main">
            <h1>{company?.name || "Nome da empresa"}</h1>
            <p className="company-profile__sector">
              {company?.sector || "Setor não informado"}
              {company?.location && (
                <span className="company-profile__location-inline">
                  &nbsp;·&nbsp;{company.location}
                </span>
              )}
            </p>
            <p className="company-profile__bio">
              {company?.description || "Adicione uma descrição para apresentar sua empresa aos candidatos."}
            </p>

            <div className="company-profile__meta">
              {company?.location && (
                <span><MapPin size={14} />{company.location}</span>
              )}
              {company?.website && (
                <span><Globe size={14} />{company.website}</span>
              )}
              <span><Users size={14} />{jobs.length} vaga{jobs.length !== 1 ? "s" : ""} ativa{jobs.length !== 1 ? "s" : ""}</span>
            </div>

            <div className="company-profile__links-inline">
              {company?.website && (
                <a href={formatUrl(company.website)} target="_blank" rel="noreferrer" className="link-pill link-pill--website">
                  <ExternalLink size={13} />Website
                </a>
              )}
            </div>
          </div>

          <button className="company-profile__edit-btn" onClick={() => setOpenModal(true)}>
            <PencilLine size={15} />Editar Perfil
          </button>
        </div>

        {/* STATS */}
        <div className="company-profile__stats">
          <div>
            <strong>{posts.length}</strong>
            <span>Publicações</span>
          </div>
          <div>
            <strong>{jobs.filter(j => j.status === "Aberta").length}</strong>
            <span>Vagas abertas</span>
          </div>
          <div>
            <strong>{areas.length || "—"}</strong>
            <span>Áreas de atuação</span>
          </div>
        </div>
      </div>

      {/* SOBRE */}
      <div className="company-profile__section">
        <h2>Sobre a empresa</h2>
        <p className="company-profile__about">
          {company?.description || "Nenhuma descrição adicionada."}
        </p>
      </div>

      {/* INFORMAÇÕES + ÁREAS */}
      <div className="company-profile__two-col">
        <div className="company-profile__section">
          <h2>Informações institucionais</h2>
          <div className="company-profile__info-grid">
            <div className="company-profile__info-item">
              <span>Nome fantasia</span>
              <strong>{company?.name || "—"}</strong>
            </div>
            <div className="company-profile__info-item">
              <span>Razão social</span>
              <strong>{company?.legalName || "—"}</strong>
            </div>
            <div className="company-profile__info-item">
              <span>CNPJ</span>
              <strong>{company?.cnpj || "—"}</strong>
            </div>
            <div className="company-profile__info-item">
              <span>Setor</span>
              <strong>{company?.sector || "—"}</strong>
            </div>
            <div className="company-profile__info-item">
              <span>Localização</span>
              <strong>{company?.location || "—"}</strong>
            </div>
            <div className="company-profile__info-item">
              <span>Website</span>
              <strong>
                {company?.website
                  ? <a href={formatUrl(company.website)} target="_blank" rel="noreferrer">{company.website}</a>
                  : "—"}
              </strong>
            </div>
          </div>
        </div>

        <div className="company-profile__section">
          <h2>Áreas de atuação</h2>
          {areas.length > 0 ? (
            <div className="company-profile__areas">
              {areas.map((area) => (
                <span key={area}>{area}</span>
              ))}
            </div>
          ) : (
            <p className="company-profile__empty-text">Nenhuma área informada.</p>
          )}
        </div>
      </div>

      {/* VAGAS */}
      <div className="company-profile__section">
        <div className="company-profile__section-header">
          <h2>Vagas</h2>
        </div>
        {loadingJobs ? (
          <p className="company-profile__empty-text">Carregando vagas...</p>
        ) : jobs.length === 0 ? (
          <div className="company-profile__empty">
            <Briefcase size={40} />
            <p>Nenhuma vaga cadastrada ainda.</p>
          </div>
        ) : (
          <div className="company-profile__jobs">
            {jobs.map((job) => (
              <div className="company-profile__job-card" key={job.id}>
                <div className="job-card__left">
                  <div className="job-card__icon">
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <h4>{job.title}</h4>
                    <p>{job.area} · {job.type} · {job.location}</p>
                  </div>
                </div>
                <div className="job-card__right">
                  <span className={`job-card__status job-card__status--${job.status === "Aberta" ? "open" : "closed"}`}>
                    {job.status}
                  </span>
                  <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PUBLICAÇÕES */}
      <div className="company-profile__section">
        <div className="company-profile__section-header">
          <h2>Publicações</h2>
        </div>
        {loadingPosts ? (
          <p className="company-profile__empty-text">Carregando publicações...</p>
        ) : posts.length === 0 ? (
          <div className="company-profile__empty">
            <FileText size={40} />
            <p>Nenhuma publicação ainda.</p>
          </div>
        ) : (
          <div className="company-profile__posts-scroll">
            {posts.map((post) => (
              <div className="company-profile__post-card" key={post.id}>
                {post.mediaUrl && (
                  <div className="post-image">
                    <img src={post.mediaUrl} alt={post.title} />
                  </div>
                )}
                <div className="post-content">
                  <span className="post-type">{post.activityType}</span>
                  <h3>{post.title}</h3>
                  <p>{post.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL EDITAR */}
      {openModal && (
        <div className="company-profile__modal-overlay">
          <div className="company-profile__modal">
            <div className="company-profile__modal-header">
              <h2>Editar empresa</h2>
              <button onClick={() => setOpenModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div className="company-profile__modal-body">
              <div className="company-profile__form-group">
                <label>Logo da empresa</label>
                <input type="file" accept="image/*" onChange={(e) => setSelectedLogo(e.target.files[0])} />
                <img
                  src={selectedLogo ? URL.createObjectURL(selectedLogo) : formData.profileImage}
                  alt="Preview"
                  className="company-profile__logo-preview"
                />
              </div>

              {[
                { label: "Nome da empresa", name: "name" },
                { label: "Razão social", name: "legalName" },
                { label: "CNPJ", name: "cnpj" },
                { label: "Setor", name: "sector" },
                { label: "Áreas de atuação", name: "areas", hint: "Separe por vírgulas" },
                { label: "Website", name: "website" },
                { label: "Localização", name: "location" },
              ].map(({ label, name, hint }) => (
                <div className="company-profile__form-group" key={name}>
                  <label>{label}{hint && <span className="form-hint">{hint}</span>}</label>
                  <input type="text" name={name} value={formData[name]} onChange={handleChange} />
                </div>
              ))}

              <div className="company-profile__form-group">
                <label>Descrição</label>
                <textarea name="description" rows={4} value={formData.description} onChange={handleChange} />
              </div>
            </div>

            <div className="company-profile__modal-footer">
              <button className="cancel" onClick={() => setOpenModal(false)}>Cancelar</button>
              <button className="save" onClick={handleUpdateCompany} disabled={uploadingLogo}>
                <Save size={16} />
                {uploadingLogo ? "Enviando logo..." : "Salvar alterações"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyProfile;