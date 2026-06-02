import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import API_URL from "../../../service/api";
import "./NotificationBell.scss";

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await window.fetch(`${API_URL}/Notifications/read-all`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Erro ao marcar como lidas:", err);
    }
  };

  // Fecha ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Busca ao montar e a cada 30 segundos
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await window.fetch(`${API_URL}/Notifications`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (err) {
        console.error("Erro ao buscar notificações:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleOpen = () => {
    setOpen((prev) => !prev);
    if (!open && unreadCount > 0) markAllAsRead();
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="notif-bell" ref={ref}>
      <button className="notif-bell__btn" onClick={handleOpen} title="Notificações">
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="notif-bell__badge">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notif-bell__dropdown">
          <div className="notif-bell__header">
            <span>Notificações</span>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead}>Marcar todas como lidas</button>
            )}
          </div>

          <ul className="notif-bell__list">
            {notifications.length === 0 ? (
              <li className="notif-bell__empty">Nenhuma notificação ainda.</li>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  className={`notif-bell__item ${!n.isRead ? "notif-bell__item--unread" : ""}`}
                >
                  <div className="notif-bell__avatar">
                    {n.student?.avatarUrl ? (
                      <img src={n.student.avatarUrl} alt={n.student.name} />
                    ) : (
                      <span>{n.student?.name?.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="notif-bell__content">
                    <p>{n.message}</p>
                    <small>{formatDate(n.createdAt)}</small>
                  </div>
                  {!n.isRead && <div className="notif-bell__dot" />}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;