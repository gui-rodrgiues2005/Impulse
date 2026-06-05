import "./CompanySidebar.scss";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  UserRoundSearch,
  BarChart3,
  MessageCircle,
  Building2,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import API_URL from "../../../service/api";
import NotificationBell from "./NotificationBell";

const CompanySidebar = () => {
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
    <aside className="company-sidebar">

      <div className="company-sidebar__top">

        <div className="company-sidebar__logo">
          <div className="company-sidebar__logo-icon">
            <Building2 size={22} />
          </div>

          <div className="company-sidebar__logo-text">
            <h2>IMPULSE</h2>
            <span>COMPANY CONSOLE</span>
          </div>
        </div>

        <nav className="company-sidebar__nav">

          <NavLink to="/company/feed" className="company-sidebar__item">
            <LayoutDashboard size={20} />
            <span>Feed</span>
          </NavLink>

          <NavLink to="/company/publicar" className="company-sidebar__item">
            <LayoutDashboard size={20} />
            <span>Nova Publicação</span>
          </NavLink>

          <NavLink to="/company/dashboard" className="company-sidebar__item">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/company/vagas" className="company-sidebar__item">
            <BriefcaseBusiness size={20} />
            <span>Vagas</span>
          </NavLink>

          <NavLink to="/company/analytics" className="company-sidebar__item">
            <BarChart3 size={20} />
            <span>Analytics</span>
          </NavLink>

          <NavLink to="/company/chats" className="company-sidebar__item">
            <MessageCircle size={20} />
            <span>Mensagens</span>
          </NavLink>

          <NavLink to="/company/profile" className="company-sidebar__item">
            <Building2 size={20} />
            <span>Perfil da Empresa</span>
          </NavLink>

          <NavLink to="/company/config" className="company-sidebar__item">
            <Settings size={20} />
            <span>Configurações</span>
          </NavLink>

        </nav>
      </div>

      <div className="company-sidebar__footer">

        <div className="company-sidebar__company">
          <div className="company-sidebar__company-avatar">
            <Building2 size={32} />
          </div>
          <div className="company-sidebar__company-info">
            <h4>{userInfo?.name || "Empresa"}</h4>
            <span>
              {userInfo?.role
                ? userInfo.role.charAt(0).toUpperCase() + userInfo.role.slice(1)
                : "Empresa"}
            </span>
          </div>
        </div>

        <div className="company-sidebar__actions">
          <NotificationBell />
          <button
            className="company-sidebar__logout"
            onClick={handleLogout}
            title="Sair da conta"
          >
            <LogOut size={20} />
          </button>
        </div>

      </div>

    </aside>
  );
};

export default CompanySidebar;