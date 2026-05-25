import React from "react";
import "./RecruiterProfile.scss";

import {
  MapPin,
  Calendar,
  Pencil,
  Target,
} from "lucide-react";

const RecruiterProfile = () => {
  return (
    <div className="recruiter-profile">
      <div className="profile-card">
        <div className="profile-banner">
          <span className="profile-badge">
            Recruiter Account
          </span>
        </div>

        <div className="profile-content">
          <div className="profile-header">
            <div className="profile-avatar">
              <img
                src="https://i.pravatar.cc/150?img=32"
                alt="Avatar"
              />
            </div>

            <button className="edit-button">
              <Pencil size={18} />
              Editar
            </button>
          </div>

          <div className="profile-info">
            <h1>João da Silva</h1>

            <p>
              Recrutador focado em identificar talentos
              acadêmicos com trajetória comprovada.
            </p>

            <div className="profile-details">
              <span>
                <MapPin size={16} />
                São Paulo, BR
              </span>

              <span>
                <Calendar size={16} />
                Membro desde Mar 2026
              </span>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <h2>7</h2>
              <span>Atividades</span>
            </div>

            <div className="stat-item">
              <h2>89</h2>
              <span>Curtidas</span>
            </div>

            <div className="stat-item">
              <h2>742</h2>
              <span>Pontuação</span>
            </div>
          </div>
        </div>
      </div>

      <div className="corporate-card">
        <div className="target-icon">
          <Target size={42} />
        </div>

        <h2>Perfil de Recrutador</h2>

        <p>
          Gerencie sua empresa, filtros salvos e
          histórico de contatos com estudantes.
        </p>

        <button className="corporate-button">
          Editar perfil corporativo
        </button>
      </div>
    </div>
  );
};

export default RecruiterProfile;