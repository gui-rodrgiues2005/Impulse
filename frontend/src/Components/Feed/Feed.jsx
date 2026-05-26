import { useEffect, useState } from "react";
import "./Feed.scss";

import API_URL from "../../service/api";

function Feed() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadFeed() {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(`${API_URL}/feed`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await response.json();
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
                                <img
                                    src={post.userAvatar || "https://i.pravatar.cc/40"}
                                    alt="avatar"
                                />

                                <div>
                                    <strong>{post.userName}</strong>
                                    <span>{post.createdAt}</span>
                                </div>
                            </div>

                            <div className="tag">
                                {post.activityType}
                            </div>
                        </div>

                        {/* IMAGE */}
                        {post.mediaUrl && (
                            <div className="feed-image">
                                <img src={post.mediaUrl} alt="post" />
                            </div>
                        )}

                        {/* CONTENT */}
                        <div className="feed-content">
                            <h2>{post.title}</h2>

                            <span className="level">
                                {post.level}
                            </span>

                            <p>{post.description}</p>
                        </div>

                        {/* FOOTER */}
                        <div className="feed-footer">

                            <div className="engagement">
                                <span>❤️ {post.likes}</span>
                                <span>💬 {post.comments}</span>
                            </div>

                            <div className="rating">
                                ⭐ {post.rating}
                            </div>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}

export default Feed;