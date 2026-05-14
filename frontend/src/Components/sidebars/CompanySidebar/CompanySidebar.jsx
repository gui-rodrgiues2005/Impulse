import "./CompanySidebar.scss";

import {
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  UserRoundSearch,
  BarChart3,
  MessageCircle,
  Building2,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const CompanySidebar = () => {
  return (
    <aside className="company-sidebar">
      
      <div className="company-sidebar__top">

        <div className="company-sidebar__logo">
          <div className="company-sidebar__logo-icon">
            <Building2 size={22} />
          </div>

          <div className="company-sidebar__logo-text">
            <h2>DevBridge</h2>
            <span>COMPANY CONSOLE</span>
          </div>
        </div>

        <div className="company-sidebar__account">
          <span className="status-dot"></span>
          <p>Company Account</p>
        </div>

        <nav className="company-sidebar__nav">

          <NavLink
            to="/company/dashboard"
            className="company-sidebar__item"
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/company/jobs"
            className="company-sidebar__item"
          >
            <BriefcaseBusiness size={20} />
            <span>Vagas</span>
          </NavLink>

          <NavLink
            to="/company/candidates"
            className="company-sidebar__item"
          >
            <Users size={20} />
            <span>Candidatos</span>
          </NavLink>

          <NavLink
            to="/company/recruiters"
            className="company-sidebar__item"
          >
            <UserRoundSearch size={20} />
            <span>Recrutadores</span>
          </NavLink>

          <NavLink
            to="/company/analytics"
            className="company-sidebar__item"
          >
            <BarChart3 size={20} />
            <span>Analytics</span>
          </NavLink>

          <NavLink
            to="/company/messages"
            className="company-sidebar__item"
          >
            <MessageCircle size={20} />
            <span>Mensagens</span>
          </NavLink>

          <NavLink
            to="/company/profile"
            className="company-sidebar__item active"
          >
            <Building2 size={20} />
            <span>Perfil da Empresa</span>
          </NavLink>

          <NavLink
            to="/company/settings"
            className="company-sidebar__item"
          >
            <Settings size={20} />
            <span>Configurações</span>
          </NavLink>

        </nav>
      </div>

      <div className="company-sidebar__footer">

        <div className="company-sidebar__company">

          <img
            src="https://i.pravatar.cc/100"
            alt="Empresa"
          />

          <div className="company-sidebar__company-info">
            <h4>Empresa ABC</h4>
            <span>Empresa</span>
          </div>

        </div>

      </div>

    </aside>
  );
};

export default CompanySidebar;