// Sidebar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  PlusSquare,
  Search,
  MessageCircle,
  User,
  LogOut
} from "lucide-react";

import Logo from "../../assets/logonavbar.png";
import "./Sidebar.scss";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__top">

        <div className="sidebar__logo">
          <img src={Logo} alt="Impulse" />
        </div>

        <nav className="sidebar__menu">

          <NavLink
            to="/feed"
            className={({ isActive }) =>
              `sidebar__item ${isActive ? "active" : ""}`
            }
          >
            <Home size={18} />
            Feed
          </NavLink>

          <NavLink
            to="/publicar"
            className={({ isActive }) =>
              `sidebar__item ${isActive ? "active" : ""}`
            }
          >
            <PlusSquare size={18} />
            Publicar
          </NavLink>

          <NavLink
            to="/buscar"
            className={({ isActive }) =>
              `sidebar__item ${isActive ? "active" : ""}`
            }
          >
            <Search size={18} />
            Buscar
          </NavLink>

          <NavLink
            to="/mensagens"
            className={({ isActive }) =>
              `sidebar__item ${isActive ? "active" : ""}`
            }
          >
            <MessageCircle size={18} />
            Mensagens
          </NavLink>

          <NavLink
            to="/perfil"
            className={({ isActive }) =>
              `sidebar__item ${isActive ? "active" : ""}`
            }
          >
            <User size={18} />
            Perfil
          </NavLink>

        </nav>
      </div>

      <div className="sidebar__footer">
        <div className="sidebar__logout" onClick={handleLogout}>
          <LogOut size={18} />
          Sair da conta
        </div>
      </div>
    </aside>
  );
}