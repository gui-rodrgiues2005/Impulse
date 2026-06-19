import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin, Globe, ExternalLink, BadgeCheck, Briefcase, FileText, Users, ChevronRight, ArrowLeft,
} from "lucide-react";
import API_URL from "../../service/api";
import { QuickChatButton } from "../../Components/QuickChatButton";
import "../company/CompanyProfile/CompanyProfile.scss";

export default function PublicCompanyProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompany();
  }, [userId]);

  const loadCompany = async () => {
    try {
      const response = await fetch(`${API_URL}/Company/by-user/${userId}`);
      if (!response.ok) throw new Error("Empresa não encontrada");
      const data = await response.json();
      setCompany(data);
      loadJobs(data.id);
      loadPosts();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadJobs = async (companyId) => {
    try {
      const response = await fetch(`${API_URL}/Company/${companyId}/jobs`);
      if (response.ok) setJobs(await response.json());
    } catch (err) {
      console.error(err);
    }
  };

  const loadPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/publicacoes/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) setPosts(await response.json());
    } catch (err) {
      console.error(err);
    }
  };

  const formatUrl = (url) => (url?.startsWith("http") ? url : `https://${url}`);

  if (loading) return <p className="company-profile__loading">Carregando...</p>;
  if (!company) return <p className="company-profile__loading">Empresa não encontrada.</p>;

  const areas = company.areas ? company.areas.split(",").map((a) => a.trim()).filter(Boolean) : [];

  return (
    <div className="company-profile">
      <button className="company-profile__back" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} />Voltar
      </button>

      <div className="company-profile__header">
        <div className="company-profile__cover"><div className="company-profile__cover-pattern" /></div>

        <div className="company-profile__top">
          <div className="company-profile__logo">
            <img src={company.profileImage || ""} alt={company.name} />
          </div>
          <span className="company-profile__badge"><BadgeCheck size={13} />Empresa Verificada</span>
        </div>

        <div className="company-profile__info">
          <div className="company-profile__info-main">
            <h1>{company.name}</h1>
            <p className="company-profile__sector">
              {company.sector || "Setor não informado"}
              {company.location && <span className="company-profile__location-inline">&nbsp;·&nbsp;{company.location}</span>}
            </p>
            <p className="company-profile__bio">{company.description || "Nenhuma descrição adicionada."}</p>

            <div className="company-profile__meta">
              {company.location && <span><MapPin size={14} />{company.location}</span>}
              {company.website && <span><Globe size={14} />{company.website}</span>}
              <span><Users size={14} />{jobs.length} vaga{jobs.length !== 1 ? "s" : ""} ativa{jobs.length !== 1 ? "s" : ""}</span>
            </div>

            <div className="company-profile__links-inline">
              {company.website && (
                <a href={formatUrl(company.website)} target="_blank" rel="noreferrer" className="link-pill link-pill--website">
                  <ExternalLink size={13} />Website
                </a>
              )}
            </div>
          </div>

          <QuickChatButton userId={company.userId} userName={company.name} avatarUrl={company.profileImage} />
        </div>
      </div>

      <div className="company-profile__section">
        <h2>Sobre a empresa</h2>
        <p className="company-profile__about">{company.description || "Nenhuma descrição adicionada."}</p>
      </div>

      <div className="company-profile__two-col">
        <div className="company-profile__section">
          <h2>Informações institucionais</h2>
          <div className="company-profile__info-grid">
            <div className="company-profile__info-item"><span>Setor</span><strong>{company.sector || "—"}</strong></div>
            <div className="company-profile__info-item"><span>Localização</span><strong>{company.location || "—"}</strong></div>
            <div className="company-profile__info-item">
              <span>Website</span>
              <strong>{company.website ? <a href={formatUrl(company.website)} target="_blank" rel="noreferrer">{company.website}</a> : "—"}</strong>
            </div>
          </div>
        </div>

        <div className="company-profile__section">
          <h2>Áreas de atuação</h2>
          {areas.length > 0 ? (
            <div className="company-profile__areas">{areas.map((area) => <span key={area}>{area}</span>)}</div>
          ) : (
            <p className="company-profile__empty-text">Nenhuma área informada.</p>
          )}
        </div>
      </div>

      <div className="company-profile__section">
        <h2>Vagas</h2>
        {jobs.length === 0 ? (
          <div className="company-profile__empty"><Briefcase size={40} /><p>Nenhuma vaga cadastrada ainda.</p></div>
        ) : (
          <div className="company-profile__jobs">
            {jobs.filter((j) => j.status === "Aberta").map((job) => (
              <div className="company-profile__job-card" key={job.id}>
                <div className="job-card__left">
                  <div className="job-card__icon"><Briefcase size={16} /></div>
                  <div><h4>{job.title}</h4><p>{job.area} · {job.type} · {job.location}</p></div>
                </div>
                <div className="job-card__right">
                  <span className="job-card__status job-card__status--open">{job.status}</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="company-profile__section">
        <h2>Publicações</h2>
        {posts.length === 0 ? (
          <div className="company-profile__empty"><FileText size={40} /><p>Nenhuma publicação ainda.</p></div>
        ) : (
          <div className="company-profile__posts-scroll">
            {posts.map((post) => (
              <div className="company-profile__post-card" key={post.id}>
                {post.mediaUrl && <div className="post-image"><img src={post.mediaUrl} alt={post.title} /></div>}
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
    </div>
  );
}