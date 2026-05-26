import "./RecruiterSidebar.scss";

import {
  Home,
  Compass,
  Search,
  Bookmark,
  MessageCircle,
  Star,
  User,
  Target,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const RecruiterSidebar = () => {
  return (
    <aside className="recruiter-sidebar">

      <div className="recruiter-sidebar__top">

        <div className="recruiter-sidebar__logo">

          <div className="recruiter-sidebar__logo-icon">
            <Target size={22} />
          </div>

          <div className="recruiter-sidebar__logo-text">
            <h2>DevBridge</h2>
            <span>RECRUITER WORKSPACE</span>
          </div>

        </div>

        <div className="recruiter-sidebar__account">
          <span className="status-dot"></span>
          <p>Recruiter Account</p>
        </div>

        <nav className="recruiter-sidebar__nav">

          <NavLink
            to="/recruiter/feed"
            className="recruiter-sidebar__item"
          >
            <Home size={20} />
            <span>Feed</span>
          </NavLink>


          <NavLink
            to="/recruiter/publicar"
            className="recruiter-sidebar__item"
          >
            <Home size={20} />
            <span>Nova Publicação</span>
          </NavLink>

          <NavLink
            to="/recruiter/buscar"
            className="recruiter-sidebar__item"
          >
            <Compass size={20} />
            <span>Buscar Profissionais</span>
          </NavLink>

          <NavLink
            to="/recruiter/salvos"
            className="recruiter-sidebar__item"
          >
            <Bookmark size={20} />
            <span>Salvos</span>
          </NavLink>

          <NavLink
            to="/recruiter/mensagens"
            className="recruiter-sidebar__item"
          >
            <MessageCircle size={20} />
            <span>Mensagens</span>
          </NavLink>

          <NavLink
            to="/recruiter/reviews"
            className="recruiter-sidebar__item"
          >
            <Star size={20} />
            <span>Avaliações</span>
          </NavLink>

          <NavLink
            to="/recruiter/profile"
            className="recruiter-sidebar__item"
          >
            <User size={20} />
            <span>Perfil</span>
          </NavLink>

        </nav>

      </div>

      <div className="recruiter-sidebar__footer">

        <div className="recruiter-sidebar__profile">

          <img
            src="https://i.pravatar.cc/100"
            alt="Recruiter"
          />

          <div className="recruiter-sidebar__profile-info">
            <h4>João da Silva</h4>
            <span>Recrutador</span>
          </div>

        </div>

      </div>

    </aside>
  );
};

export default RecruiterSidebar;