import "./StudentSidebar.scss";

import { useState, useEffect } from "react";
import {
  Home,
  SquarePen,
  Compass,
  MessageCircle,
  BriefcaseBusiness,
  User,
  Settings,
  GraduationCap,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import API_URL from "../../../service/api";

const StudentSidebar = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          return;
        }

        const response = await fetch(`${API_URL}/User/me`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Falha ao buscar dados do usuário");
        }

        const data = await response.json();
        setUserInfo(data);
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
      }
    };

    fetchUserInfo();
  }, []);
  return (
    <aside className="student-sidebar">

      <div className="student-sidebar__top">

        <div className="student-sidebar__logo">

          <div className="student-sidebar__logo-icon">
            <GraduationCap size={22} />
          </div>

          <div className="student-sidebar__logo-text">
            <h2>IMPULSE</h2>
            <span>STUDENT NETWORK</span>
          </div>

        </div>
        <nav className="student-sidebar__nav">

          <NavLink
            to="/student/feed"
            className="student-sidebar__item"
          >
            <Home size={20} />
            <span>Feed</span>
          </NavLink>

          <NavLink
            to="/student/publicar"
            className="student-sidebar__item"
          >
            <SquarePen size={20} />
            <span>Publicar</span>
          </NavLink>

          <NavLink
            to="/student/explore"
            className="student-sidebar__item"
          >
            <Compass size={20} />
            <span>Explorar</span>
          </NavLink>

          <NavLink
            to="/student/chats"
            className="student-sidebar__item"
          >
            <MessageCircle size={20} />
            <span>Mensagens</span>
          </NavLink>

          <NavLink
            to="/student/vagas"
            className="student-sidebar__item"
          >
            <BriefcaseBusiness size={20} />
            <span>Vagas</span>
          </NavLink>

          <NavLink
            to="/student/profile"
            className="student-sidebar__item"
          >
            <User size={20} />
            <span>Perfil</span>
          </NavLink>

          <NavLink
            to="/student/settings"
            className="student-sidebar__item"
          >
            <Settings size={20} />
            <span>Configurações</span>
          </NavLink>

        </nav>

      </div>

      <div className="student-sidebar__footer">

        <div className="student-sidebar__profile">

          <div className="student-sidebar__profile-avatar">
            <User size={32} />
          </div>

          <div className="student-sidebar__profile-info">
            <h4>{userInfo?.name || "Usuário"}</h4>
            <span>{userInfo?.role ? userInfo.role.charAt(0).toUpperCase() + userInfo.role.slice(1) : "Estudante"}</span>
          </div>

        </div>

        <button 
          className="student-sidebar__logout"
          onClick={handleLogout}
          title="Sair da conta"
        >
          <LogOut size={20} />
        </button>

      </div>

    </aside>
  );
};

export default StudentSidebar;