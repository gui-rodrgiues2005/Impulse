import "./StudentSidebar.scss";

import {
  Home,
  SquarePen,
  Compass,
  MessageCircle,
  BriefcaseBusiness,
  User,
  Settings,
  GraduationCap,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const StudentSidebar = () => {
  return (
    <aside className="student-sidebar">

      <div className="student-sidebar__top">

        <div className="student-sidebar__logo">

          <div className="student-sidebar__logo-icon">
            <GraduationCap size={22} />
          </div>

          <div className="student-sidebar__logo-text">
            <h2>DevBridge</h2>
            <span>STUDENT NETWORK</span>
          </div>

        </div>

        <div className="student-sidebar__account">
          <span className="status-dot"></span>
          <p>Student Account</p>
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
            to="/student/messages"
            className="student-sidebar__item"
          >
            <MessageCircle size={20} />
            <span>Mensagens</span>
          </NavLink>

          <NavLink
            to="/student/jobs"
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

          <img
            src="https://i.pravatar.cc/100"
            alt="Student"
          />

          <div className="student-sidebar__profile-info">
            <h4>João da Silva</h4>
            <span>Estudante</span>
          </div>

        </div>

      </div>

    </aside>
  );
};

export default StudentSidebar;