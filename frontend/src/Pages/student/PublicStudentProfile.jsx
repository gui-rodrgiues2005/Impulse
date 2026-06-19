import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    MapPin, ExternalLink, FileText, GraduationCap,
    BriefcaseBusiness, BadgeCheck, FlaskConical, User, ArrowLeft, Eye
} from "lucide-react";
import API_URL from "../../service/api";
import { QuickChatButton } from "../../Components/QuickChatButton";
import "../student/StudentProfile/StudentProfile.scss";

export default function PublicStudentProfile() {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [studentProfile, setStudentProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [trajectories, setTrajectories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pdfBlobUrl, setPdfBlobUrl] = useState(null);


    useEffect(() => {
        loadProfile();
        loadPosts();
        loadTrajectories();
    }, [userId]);

    const loadProfile = async () => {
        try {
            const response = await fetch(`${API_URL}/Student/${userId}`);
            if (!response.ok) throw new Error("Perfil não encontrado");
            setStudentProfile(await response.json());
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
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

    const loadTrajectories = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/trajectory/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.ok) setTrajectories(await response.json());
        } catch (err) {
            console.error(err);
        }
    };

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
        const start = new Date(item.startDate).toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
        if (item.isOngoing) return `${start} — atualmente`;
        if (!item.endDate) return start;
        const end = new Date(item.endDate).toLocaleDateString("pt-BR", { month: "short", year: "numeric" });
        return `${start} — ${end}`;
    };

    const formatUrl = (url) => (url?.startsWith("http") ? url : `https://${url}`);

    const handleVerCurriculo = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/Update/${studentProfile.userId}/resume`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Erro ao carregar currículo");
            }

            const blob = await response.blob();

            console.log("Blob:", blob);

            const blobUrl = URL.createObjectURL(blob);

            setPdfBlobUrl(blobUrl);
            setIsModalOpen(true);

        } catch (error) {
            console.error(error);
        }
    };

    const handleFecharModal = () => {
        if (pdfBlobUrl) {
            URL.revokeObjectURL(pdfBlobUrl);
        }

        setPdfBlobUrl(null);
        setIsModalOpen(false);
    };

    if (loading) return <p className="student-profile__loading">Carregando perfil...</p>;
    if (!studentProfile) return <p className="student-profile__loading">Perfil não encontrado.</p>;

    return (
        <div className="student-profile">
            <button className="student-profile__back" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} />Voltar
            </button>

            <div className="student-profile__header">
                <div className="student-profile__cover">
                    <div className="student-profile__cover-pattern" />
                </div>

                <div className="student-profile__top">
                    <div className="student-profile__avatar">
                        {studentProfile.profileImage ? (
                            <img src={studentProfile.profileImage} alt={studentProfile.name} />
                        ) : (
                            <div className="student-profile__avatar-placeholder" />
                        )}
                    </div>
                </div>

                <div className="student-profile__info">
                    <div className="student-profile__info-main">
                        <div className="student-profile__name-row">
                            <h1>{studentProfile.name}</h1>
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
                            {studentProfile.bio || "Nenhuma descrição adicionada."}
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

                    <QuickChatButton
                        userId={studentProfile.userId}
                        userName={studentProfile.name}
                        avatarUrl={studentProfile.profileImage}
                    />
                </div>
            </div>

            {studentProfile.resumoUrl && (
                <div className="student-profile__cards">
                    <div className="student-profile__card student-profile__card--cv">
                        <div className="student-profile__cv">
                            <div className="cv-icon">
                                <FileText size={18} />
                            </div>

                            <div className="cv-info">
                                <h3>Currículo</h3>
                                <p>Disponível para visualização.</p>
                            </div>

                            <button
                                type="button"
                                className="cv-view-btn"
                                onClick={handleVerCurriculo}
                            >
                                <Eye size={14} />
                                Ver
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isModalOpen && pdfBlobUrl && (
                <div className="cv-modal-overlay" onClick={handleFecharModal}>
                    <div
                        className="cv-modal-container"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="cv-modal-header">
                            <span>Visualizando Currículo</span>

                            <button
                                className="cv-modal-close-btn"
                                onClick={handleFecharModal}
                            >
                                Fechar
                            </button>
                        </div>
                        <iframe
                            src={pdfBlobUrl}
                            title="Currículo"
                            className="cv-modal-iframe"
                        />
                    </div>
                </div>
            )}
            <div className="student-profile__section">
                <h2>Habilidades</h2>
                <div className="student-profile__skills">
                    {studentProfile.skills?.length > 0 ? (
                        studentProfile.skills.map((skill) => <span key={skill}>{skill}</span>)
                    ) : (
                        <p className="student-profile__empty-text">Nenhuma habilidade adicionada.</p>
                    )}
                </div>
            </div>

            <div className="student-profile__section">
                <h2>Publicações</h2>
                {posts.length === 0 ? (
                    <div className="student-profile__empty">
                        <User size={48} />
                        <p>Nenhuma publicação ainda.</p>
                    </div>
                ) : (
                    <div className="student-profile__posts-scroll">
                        {posts.map((post) => (
                            <div className="student-profile__post-card" key={post.id}>
                                {post.mediaUrl && (
                                    <div className="post-image"><img src={post.mediaUrl} alt={post.title} /></div>
                                )}
                                <div className="post-content">
                                    <div className="post-content__badges">
                                        {post.activityType && <span className="post-badge post-badge--type">{post.activityType}</span>}
                                        {post.level && <span className="post-badge post-badge--level">{post.level}</span>}
                                    </div>
                                    <h3>{post.title}</h3>
                                    <p className="post-description">{post.description}</p>
                                    {post.link && (
                                        <a href={post.link} target="_blank" rel="noreferrer" className="post-link">
                                            <ExternalLink size={12} />Ver referência
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="student-profile__section">
                <h2>Trajetória</h2>
                {trajectories.length === 0 ? (
                    <p className="student-profile__empty-text">Nenhuma trajetória adicionada ainda.</p>
                ) : (
                    <div className="student-profile__timeline">
                        {trajectories.map((item) => (
                            <div className="student-profile__timeline-item" key={item.id}>
                                <div className="student-profile__timeline-dot" />
                                <div className="student-profile__timeline-content">
                                    <div className="student-profile__timeline-top">
                                        <span className="date">{formatPeriod(item)}</span>
                                        <span className="tag">{trajectoryIcon(item.type)}{item.type}</span>
                                    </div>
                                    <p><strong>{item.title}</strong></p>
                                    {item.description && <p className="trajectory-desc">{item.description}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}