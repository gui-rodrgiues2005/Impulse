import { useEffect, useState } from "react";

import "./CompanyProfile.scss";

import API_URL from "../../../service/api";

import {
  Building2,
  MapPin,
  Users,
  Globe,
  PencilLine,
  X,
} from "lucide-react";

const CompanyProfile = () => {

  const [company, setCompany] = useState(null);

  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    logoUrl: "",

    legalName: "",
    cnpj: "",
    sector: "",
    areas: "",
  });

  const loadCompany = async () => {

    try {

      const userStr = localStorage.getItem("user");

      if (!userStr) return;

      const user = JSON.parse(userStr);

      if (!user.companyId) return;

      const response = await fetch(
        `${API_URL}/Company/${user.companyId}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setCompany(data);

      setFormData({
        name: data.name || "",
        description: data.description || "",
        website: data.website || "",
        location: data.location || "",
        logoUrl: data.logoUrl || "",

        legalName: data.legalName || "",
        cnpj: data.cnpj || "",
        sector: data.sector || "",
        areas: data.areas || "",
      });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCompany();
  }, []);

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateCompany = async () => {

    try {

      const userStr = localStorage.getItem("user");

      if (!userStr) return;

      const user = JSON.parse(userStr);

      const response = await fetch(
        `${API_URL}/Company/${user.companyId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setOpenModal(false);

      loadCompany();

    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div className="company-profile">

      <div className="company-profile__header">

        <div>

          <span className="company-profile__label">
            BRANDING INSTITUCIONAL
          </span>

          <h1>Perfil da empresa</h1>

        </div>

        <button
          className="company-profile__edit"
          onClick={() => setOpenModal(true)}
        >
          <PencilLine size={18} />
          Editar
        </button>

      </div>

      <div className="company-profile__hero">

        <div className="company-profile__hero-left">

          <div className="company-profile__logo">

            {company?.logoUrl ? (
              <img
                src={company.logoUrl}
                alt="Logo da empresa"
              />
            ) : (
              <Building2 size={52} />
            )}

          </div>

          <div className="company-profile__hero-info">

            <h2>{company?.name}</h2>

            <p>{company?.description}</p>

            <div className="company-profile__meta">

              <span>
                <MapPin size={15} />
                {company?.location}
              </span>

              <span>
                <Users size={15} />
                Empresa parceira
              </span>

              <span>
                <Globe size={15} />
                {company?.website}
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

            <input
              type="text"
              value={company?.name || ""}
              readOnly
            />

          </div>

          <div className="company-profile__field">

            <label>Razão social</label>

            <input
              type="text"
              value={company?.legalName || ""}
              readOnly
            />

          </div>

          <div className="company-profile__field">

            <label>CNPJ</label>

            <input
              type="text"
              value={company?.cnpj || ""}
              readOnly
            />

          </div>

          <div className="company-profile__field">

            <label>Setor</label>

            <input
              type="text"
              value={company?.sector || ""}
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
              value={company?.description || ""}
            />

          </div>

          <div className="company-profile__field">

            <label>Áreas de atuação</label>

            <input
              type="text"
              value={company?.areas || ""}
              readOnly
            />

          </div>

        </div>

      </div>

      {openModal && (

        <div className="company-modal__overlay">

          <div className="company-modal">

            <div className="company-modal__header">

              <div>

                <h2>Editar empresa</h2>

                <p>
                  Atualize as informações públicas da empresa.
                </p>

              </div>

              <button onClick={() => setOpenModal(false)}>
                <X size={20} />
              </button>

            </div>

            <div className="company-modal__content">

              <div className="company-modal__field">

                <label>Nome da empresa</label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />

              </div>

              <div className="company-modal__field">

                <label>Razão social</label>

                <input
                  type="text"
                  name="legalName"
                  value={formData.legalName}
                  onChange={handleChange}
                />

              </div>

              <div className="company-modal__field">

                <label>CNPJ</label>

                <input
                  type="text"
                  name="cnpj"
                  value={formData.cnpj}
                  onChange={handleChange}
                />

              </div>

              <div className="company-modal__field">

                <label>Setor</label>

                <input
                  type="text"
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                />

              </div>

              <div className="company-modal__field">

                <label>Áreas de atuação</label>

                <input
                  type="text"
                  name="areas"
                  value={formData.areas}
                  onChange={handleChange}
                />

              </div>

              <div className="company-modal__field">

                <label>Website</label>

                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                />

              </div>

              <div className="company-modal__field">

                <label>Localização</label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />

              </div>

              <div className="company-modal__field">

                <label>Logo URL</label>

                <input
                  type="text"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                />

              </div>

              <div className="company-modal__field">

                <label>Descrição</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />

              </div>

            </div>

            <div className="company-modal__footer">

              <button
                className="secondary"
                onClick={() => setOpenModal(false)}
              >
                Cancelar
              </button>

              <button
                className="primary"
                onClick={handleUpdateCompany}
              >
                Salvar alterações
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default CompanyProfile;