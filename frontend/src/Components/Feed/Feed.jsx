import { useEffect, useState } from "react";
import "./Feed.scss";
import {
    Heart,
    MessageCircle,
    Star,
    User,
    Send,
    X,
    Search,
} from "lucide-react";
import { QuickChatButton } from "../QuickChatButton";
import API_URL from "../../service/api";

function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openComments, setOpenComments] = useState(null);
    const [comments, setComments] = useState({});
    const [commentInput, setCommentInput] = useState("");
    const [loadingComments, setLoadingComments] = useState(false);
    const [sendingComment, setSendingComment] = useState(false);
    const [commentError, setCommentError] = useState({});

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const formatRelativeDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);

        if (diff < 60) return "agora";
        if (diff < 3600) return `${Math.floor(diff / 60)} min`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} h`;
        if (diff < 2592000) return `${Math.floor(diff / 86400)} d`;
        return date.toLocaleDateString("pt-BR");
    };

    useEffect(() => {
        async function loadFeed() {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Token ausente ao carregar feed.");
                }
                const response = await fetch(`${API_URL}/publicacoes`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) {
                    const body = await response.text();
                    throw new Error(body || "Erro ao carregar feed");
                }
                const data = await response.json();
                if (!Array.isArray(data)) {
                    console.error("Feed inválido:", data);
                    setPosts([]);
                    return;
                }
                setPosts(data.map((p) => ({
                    ...p,
                    liked: p.liked ?? false,
                    likesCount: p.likesCount ?? 0,
                    commentsCount: p.commentsCount ?? 0,
                })));
            } catch (error) {
                console.error("Erro ao carregar feed:", error);
            } finally {
                setLoading(false);
            }
        }
        loadFeed();
    }, []);

    useEffect(() => {
        if (searchTerm.length < 2) {
            setSearchResults(null);
            return;
        }

        async function searchProfiles() {
            setSearchLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(
                    `${API_URL}/user/search?q=${encodeURIComponent(searchTerm)}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (!response.ok) throw new Error("Erro ao buscar perfis");
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error("Erro ao buscar perfis:", error);
                setSearchResults({ students: [], companies: [] });
            } finally {
                setSearchLoading(false);
            }
        }

        const timer = setTimeout(searchProfiles, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    async function handleLike(postId) {
        const token = localStorage.getItem("token");
        const post = posts.find((p) => p.id === postId);
        const isLiked = post.liked;

        setPosts((prev) =>
            prev.map((p) =>
                p.id === postId
                    ? { ...p, liked: !isLiked, likesCount: isLiked ? p.likesCount - 1 : p.likesCount + 1 }
                    : p
            )
        );

        try {
            await fetch(`${API_URL}/publicacoes/${postId}/curtir`, {
                method: isLiked ? "DELETE" : "POST",
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            setPosts((prev) =>
                prev.map((p) =>
                    p.id === postId
                        ? { ...p, liked: isLiked, likesCount: post.likesCount }
                        : p
                )
            );
            console.error("Erro ao curtir:", error);
        }
    }

    async function toggleComments(postId) {
        if (openComments === postId) {
            setOpenComments(null);
            return;
        }

        setOpenComments(postId);
        setCommentInput("");
        setCommentError((prev) => ({ ...prev, [postId]: null }));

        setLoadingComments(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/publicacoes/${postId}/comentarios`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setComments((prev) => ({ ...prev, [postId]: data }));
        } catch (error) {
            console.error("Erro ao carregar comentários:", error);
            setComments((prev) => ({ ...prev, [postId]: [] }));
        } finally {
            setLoadingComments(false);
        }
    }

    async function handleSendComment(postId) {
        const text = commentInput.trim();
        if (!text || sendingComment) return;

        setSendingComment(true);
        setCommentError((prev) => ({ ...prev, [postId]: null }));
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${API_URL}/publicacoes/${postId}/comentarios`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: text }),
            });

            if (!res.ok) {
                const err = await res.json();
                setCommentError((prev) => ({
                    ...prev,
                    [postId]: err.message ?? "Não foi possível comentar nesta publicação.",
                }));
                return;
            }

            const newComment = await res.json();

            setComments((prev) => ({
                ...prev,
                [postId]: [...(prev[postId] ?? []), newComment],
            }));
            setPosts((prev) =>
                prev.map((p) =>
                    p.id === postId ? { ...p, commentsCount: p.commentsCount + 1 } : p
                )
            );
            setCommentInput("");
        } catch (error) {
            console.error("Erro ao enviar comentário:", error);
            setCommentError((prev) => ({
                ...prev,
                [postId]: "Erro ao enviar comentário. Tente novamente.",
            }));
        } finally {
            setSendingComment(false);
        }
    }

    if (loading) return <p>Carregando feed...</p>;

    return (
 <div className="feed-container">

    <div className="feed-header">
        <span>STUDENT FEED</span>
        <h1>Atividades da comunidade</h1>
    </div>

    <div className="feed-search-bar">
        <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
                type="text"
                placeholder="Buscar perfis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowSearch(true)}
            />
        </div>


        {showSearch && searchTerm.length >= 2 && (
            <div className="search-dropdown">
                {searchLoading ? (
                    <p className="search-loading">Buscando...</p>
                ) : (
                            <>
                                {searchResults?.students?.length > 0 &&
                                    searchResults.students.map((student) => (
                                        <div key={student.id} className="search-item">
                                            <div className="search-item-avatar">
                                                {student.avatarUrl ? (
                                                    <img src={student.avatarUrl} alt={student.name} />
                                                ) : (
                                                    <User size={14} />
                                                )}
                                            </div>
                                            <div className="search-item-content">
                                                <p className="search-item-name">{student.name}</p>
                                                <span className="search-item-role">{student.role}</span>
                                            </div>
                                            <QuickChatButton
                                                userId={student.id}
                                                userName={student.name}
                                                avatarUrl={student.avatarUrl}
                                            />
                                        </div>
                                    ))}

                                {searchResults?.companies?.length > 0 &&
                                    searchResults.companies.map((company) => (
                                        <div key={company.id} className="search-item">
                                            <div className="search-item-avatar">
                                                {company.avatarUrl ? (
                                                    <img src={company.avatarUrl} alt={company.name} />
                                                ) : (
                                                    <User size={14} />
                                                )}
                                            </div>
                                            <div className="search-item-content">
                                                <p className="search-item-name">{company.name}</p>
                                                <span className="search-item-role">{company.role}</span>
                                            </div>
                                            <QuickChatButton
                                                userId={company.id}
                                                userName={company.name}
                                                avatarUrl={company.avatarUrl}
                                            />
                                        </div>
                                    ))}

                                {(!searchResults?.students?.length && !searchResults?.companies?.length) && (
                                    <p className="search-empty">Nenhum perfil encontrado</p>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>

            <div className="feed-list">
                {posts.map((post) => (
                    <div className="feed-card" key={post.id}>

                        <div className="feed-user">
                            <div className="user-info">
                                {post.userAvatar ? (
                                    <img src={post.userAvatar} alt="avatar" />
                                ) : (
                                    <div className="default-avatar">
                                        <User size={20} />
                                    </div>
                                )}
                                <div className="user-details">
                                    <strong>{post.userName}</strong>
                                    <span className="activity-type">{post.activityType}</span>
                                    <span className="post-date">{formatRelativeDate(post.createdAt)}</span>
                                </div>
                            </div>
                            <QuickChatButton
                                userId={post.userId}
                                userName={post.userName}
                                avatarUrl={post.userAvatar}
                            />
                        </div>

                        {post.mediaUrl && (
                            <div className="feed-image">
                                <img src={post.mediaUrl} alt="post" />
                            </div>
                        )}

                        <div className="feed-footer">
                            <div className="engagement">
                                <button
                                    className={`engagement-btn${post.liked ? " liked" : ""}`}
                                    onClick={() => handleLike(post.id)}
                                    aria-label="Curtir publicação"
                                >
                                    <Heart size={18} fill={post.liked ? "currentColor" : "none"} />
                                    <span>{post.likesCount}</span>
                                </button>

                                <button
                                    className={`engagement-btn${openComments === post.id ? " active" : ""}`}
                                    onClick={() => toggleComments(post.id)}
                                    aria-label="Ver comentários"
                                >
                                    <MessageCircle size={18} />
                                    <span>{post.commentsCount}</span>
                                </button>
                            </div>
                        </div>

                        <div className="feed-content">
                            <h2>{post.title}</h2>
                            <span className="level">{post.level}</span>
                            <p>{post.description}</p>
                        </div>

                        {openComments === post.id && (
                            <div className="comments-panel">
                                <div className="comments-panel-header">
                                    <span>Comentários</span>
                                    <button className="close-comments" onClick={() => setOpenComments(null)}>
                                        <X size={16} />
                                    </button>
                                </div>

                                <div className="comments-list">
                                    {loadingComments && <p className="comments-loading">Carregando...</p>}

                                    {!loadingComments && comments[post.id]?.length === 0 && (
                                        <p className="comments-empty">Nenhum comentário ainda. Seja o primeiro!</p>
                                    )}

                                    {!loadingComments &&
                                        comments[post.id]?.map((c) => (
                                            <div className="comment-item" key={c.id}>
                                                <div className="comment-avatar">
                                                    {c.userAvatar ? (
                                                        <img src={c.userAvatar} alt={c.userName} />
                                                    ) : (
                                                        <div className="default-avatar small">
                                                            <User size={14} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="comment-body">
                                                    <strong>{c.userName}</strong>
                                                    <span className="comment-role">{c.userRole}</span>
                                                    <p>{c.content}</p>
                                                    <span className="comment-date">
                                                        {formatRelativeDate(c.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                </div>

                                {commentError[post.id] && (
                                    <p className="comment-permission-error">
                                        {commentError[post.id]}
                                    </p>
                                )}

                                <div className="comment-input-row">
                                    <input
                                        type="text"
                                        placeholder="Escreva um comentário..."
                                        value={commentInput}
                                        onChange={(e) => {
                                            setCommentInput(e.target.value);
                                            if (commentError[post.id])
                                                setCommentError((prev) => ({ ...prev, [post.id]: null }));
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleSendComment(post.id);
                                        }}
                                        maxLength={500}
                                    />
                                    <button
                                        className="send-btn"
                                        onClick={() => handleSendComment(post.id)}
                                        disabled={!commentInput.trim() || sendingComment}
                                        aria-label="Enviar comentário"
                                    >
                                        <Send size={16} />
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
}

export default Feed;