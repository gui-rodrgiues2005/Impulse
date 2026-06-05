import { useEffect, useState } from "react";
import "./Feed.scss";
import {
    Heart,
    MessageCircle,
    Star,
    User,
} from "lucide-react";
import { QuickChatButton } from "../QuickChatButton";
import API_URL from "../../service/api";

function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const formatRelativeDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();

        const diff =
            Math.floor(
                (now - date) / 1000
            );

        if (diff < 60)
            return "agora";

        if (diff < 3600)
            return `${Math.floor(diff / 60)} min`;

        if (diff < 86400)
            return `${Math.floor(diff / 3600)} h`;

        if (diff < 2592000)
            return `${Math.floor(diff / 86400)} d`;

        return date.toLocaleDateString(
            "pt-BR"
        );
    };

    useEffect(() => {
        async function loadFeed() {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(`${API_URL}/publicacoes`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
                console.log("Feed data:", data);
                setPosts(data);
            } catch (error) {
                console.error("Erro ao carregar feed:", error);
            } finally {
                setLoading(false);
            }
        }

        loadFeed();
    }, []);

    if (loading) return <p>Carregando feed...</p>;

    return (
        <div className="feed-container">
            <div className="feed-header">
                <span>STUDENT FEED</span>
                <h1>Atividades da comunidade</h1>
                <p>
                    Inspire-se com projetos, cursos e experiências de outros estudantes
                </p>
            </div>

            <div className="feed-list">
                {posts.map((post) => (
                    <div className="feed-card" key={post.id}>

                        {/* HEADER USER */}
                        <div className="feed-user">
                            <div className="user-info">
                                {post.userAvatar ? (
                                    <img
                                        src={post.userAvatar}
                                        alt="avatar"
                                    />
                                ) : (
                                    <div className="default-avatar">
                                        <User size={20} />
                                    </div>
                                )}

                                <div className="user-details">

                                    <strong>
                                        {post.userName}
                                    </strong>

                                    <span className="activity-type">
                                        {post.activityType}
                                    </span>

                                    <span className="post-date">
                                        {formatRelativeDate(post.createdAt)}
                                    </span>

                                </div>
                            </div>

                            <QuickChatButton
                                userId={post.userId}
                                userName={post.userName}
                                avatarUrl={post.userAvatar}
                            />
                        </div>

                        {/* IMAGE */}
                        {post.mediaUrl && (
                            <div className="feed-image">
                                <img src={post.mediaUrl} alt="post" />
                            </div>
                        )}

                        {/* FOOTER */}
                        <div className="feed-footer">

                            <div className="engagement">
                                <span>
                                    <Heart size={18} /> {post.likes}
                                </span>
                                <span>
                                    <MessageCircle size={18} /> {post.comments}
                                </span>
                            </div>

                            <div className="rating">
                                <Star size={18} /> {post.rating}
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="feed-content">
                            <h2>{post.title}</h2>

                            <span className="level">
                                {post.level}
                            </span>

                            <p>{post.description}</p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default Feed;