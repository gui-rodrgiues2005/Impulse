import "./CompanyProfile.scss";
import {
  Building2,
  MapPin,
  Users,
  Globe,
  PencilLine,
} from "lucide-react";

const CompanyProfile = () => {
  return (
    <div className="company-profile">

      <div className="company-profile__header">
        <div>
          <span className="company-profile__label">
            BRANDING INSTITUCIONAL
          </span>

          <h1>Perfil da empresa</h1>
        </div>

        <button className="company-profile__edit">
          <PencilLine size={18} />
          Editar
        </button>
      </div>

      <div className="company-profile__hero">

        <div className="company-profile__hero-left">

          <div className="company-profile__logo">
            <Building2 size={52} />
          </div>

          <div className="company-profile__hero-info">
            <h2>Empresa ABC</h2>

            <p>Consultoria em gestão e tecnologia</p>

            <div className="company-profile__meta">

              <span>
                <MapPin size={15} />
                São Paulo, SP
              </span>

              <span>
                <Users size={15} />
                250-500 colaboradores
              </span>

              <span>
                <Globe size={15} />
                empresaabc.com
              </span>

            </div>
          </div>
        </div>

        <span className="company-profile__verified">
          Verificada
        </span>
      </div>

      <div className="company-profile__content">

        <div className="company-profile__card">
          <h3>Informações institucionais</h3>

          <div className="company-profile__field">
            <label>Nome fantasia</label>
            <input type="text" value="Empresa ABC" readOnly />
          </div>

          <div className="company-profile__field">
            <label>Razão social</label>
            <input
              type="text"
              value="Empresa ABC Consultoria Ltda."
              readOnly
            />
          </div>

          <div className="company-profile__field">
            <label>CNPJ</label>
            <input
              type="text"
              value="00.000.000/0001-00"
              readOnly
            />
          </div>

          <div className="company-profile__field">
            <label>Setor</label>
            <input
              type="text"
              value="Consultoria · Tecnologia"
              readOnly
            />
          </div>
        </div>

        <div className="company-profile__card">
          <h3>Apresentação pública</h3>

          <div className="company-profile__field">
            <label>Sobre a empresa</label>

            <textarea
              readOnly
              value="A Empresa ABC conecta talentos acadêmicos com projetos reais em consultoria, tecnologia e gestão. Atuamos com programas de estágio, trainee e contratação efetiva em diversas áreas."
            />
          </div>

          <div className="company-profile__field">
            <label>Áreas de atuação</label>

            <input
              type="text"
              value="Tecnologia, Administração, Marketing, Direito, Saúde"
              readOnly
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default CompanyProfile;