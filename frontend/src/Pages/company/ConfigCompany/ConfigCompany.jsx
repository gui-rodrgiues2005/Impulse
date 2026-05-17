import "./ConfigCompany.scss";
import {
  Building2,
  Mail,
  Globe,
  ShieldCheck,
  Download,
  CreditCard,
} from "lucide-react";

const ConfigCompany = () => {
  return (
    <div className="config-company">

      <div className="config-company__header">
        <span className="config-company__label">
          ADMINISTRAÇÃO
        </span>

        <h1>Configurações</h1>
      </div>

      <div className="config-company__grid">

        {/* Conta corporativa */}
        <div className="config-company__card">
          <h2>Conta corporativa</h2>

          <div className="config-company__info">

            <div className="config-company__item">
              <div className="config-company__icon">
                <Mail size={18} />
              </div>

              <div>
                <span>E-mail principal</span>
                <strong>contato@empresaabc.com</strong>
              </div>
            </div>

            <div className="config-company__item">
              <div className="config-company__icon">
                <Globe size={18} />
              </div>

              <div>
                <span>Domínio verificado</span>
                <strong>empresaabc.com</strong>
              </div>
            </div>

          </div>
        </div>

        {/* Permissões */}
        <div className="config-company__card">
          <h2>Permissões da equipe</h2>

          <div className="config-company__permissions">

            <label className="config-company__switch">
              <input type="checkbox" defaultChecked />
              <span></span>

              <p>Recrutadores podem criar vagas</p>
            </label>

            <label className="config-company__switch">
              <input type="checkbox" defaultChecked />
              <span></span>

              <p>Recrutadores podem responder candidatos</p>
            </label>

            <label className="config-company__switch">
              <input type="checkbox" defaultChecked />
              <span></span>

              <p>Exibir empresa no perfil dos recrutadores</p>
            </label>

            <label className="config-company__switch">
              <input type="checkbox" />
              <span></span>

              <p>Permitir exportação de dados</p>
            </label>

          </div>
        </div>

        {/* Plano */}
        <div className="config-company__card config-company__plan">
          <div className="config-company__plan-header">

            <div>
              <h2>Plano</h2>

              <p>
                Plano atual: Corporate · 10 recrutadores · vagas ilimitadas
              </p>
            </div>

            <div className="config-company__badge">
              <ShieldCheck size={16} />
              Premium
            </div>
          </div>

          <button className="config-company__button">
            <CreditCard size={18} />
            Gerenciar plano
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfigCompany;