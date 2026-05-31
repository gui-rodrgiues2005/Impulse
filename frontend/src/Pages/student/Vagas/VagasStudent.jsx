import React, { useState, useEffect } from 'react';
import "./VagasStudent.scss";
import {
  MapPin,
  Briefcase,
  Building2,
  Calendar,
  Users,
} from 'lucide-react';
import API_URL from '../../../service/api';

const VagasStudent = () => {
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filtroArea, setFiltroArea] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroLocalizacao, setFiltroLocalizacao] = useState('');

  useEffect(() => {
    fetchVagas();
  }, []);

  const fetchVagas = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/jobs`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar vagas');
      }

      const data = await response.json();
      setVagas(data);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar vagas:', err);
      setError('Erro ao carregar vagas');
    } finally {
      setLoading(false);
    }
  };

  const vagasFiltradas = vagas.filter((vaga) => {
    return (
      (!filtroArea || vaga.area.toLowerCase().includes(filtroArea.toLowerCase())) &&
      (!filtroTipo || vaga.type.toLowerCase().includes(filtroTipo.toLowerCase())) &&
      (!filtroLocalizacao || vaga.location.toLowerCase().includes(filtroLocalizacao.toLowerCase()))
    );
  });

  const formatarData = (data) => {
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <div className="vagas-container"><p>Carregando vagas...</p></div>;
  }

  return (
    <div className="vagas-container">
      <div className="vagas-header">
        <span>OPORTUNIDADES</span>
        <h1>Vagas Disponíveis</h1>
        <p>Explore as melhores oportunidades de estágio e primeiro emprego</p>
      </div>

      <div className="vagas-filtros">
        <div className="filtro-item">
          <label>Área</label>
          <input
            type="text"
            placeholder="Ex: Tecnologia, Design..."
            value={filtroArea}
            onChange={(e) => setFiltroArea(e.target.value)}
          />
        </div>

        <div className="filtro-item">
          <label>Tipo</label>
          <input
            type="text"
            placeholder="Ex: Estágio, CLT..."
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
          />
        </div>

        <div className="filtro-item">
          <label>Localização</label>
          <input
            type="text"
            placeholder="Ex: São Paulo, SP..."
            value={filtroLocalizacao}
            onChange={(e) => setFiltroLocalizacao(e.target.value)}
          />
        </div>

        <button className="btn-limpar" onClick={() => {
          setFiltroArea('');
          setFiltroTipo('');
          setFiltroLocalizacao('');
        }}>
          Limpar Filtros
        </button>
      </div>

      {error && <div className="erro-mensagem">{error}</div>}

      {vagasFiltradas.length === 0 && !loading && (
        <div className="sem-vagas">
          <p>Nenhuma vaga encontrada com os filtros aplicados</p>
        </div>
      )}

      <div className="vagas-lista">
        {vagasFiltradas.map((vaga) => (
          <div className="vaga-card" key={vaga.id}>
            <div className="vaga-header">
              <div className="vaga-logo">
                <img
                  src={vaga.company.logoUrl || 'https://via.placeholder.com/60'}
                  alt={vaga.company.name}
                />
              </div>

              <div className="vaga-info-principal">
                <h2>{vaga.title}</h2>
                <div className="vaga-empresa">
                  <Building2 size={16} />
                  <span>{vaga.company.name}</span>
                </div>
              </div>

              <span className={`status-badge ${vaga.status.toLowerCase()}`}>
                {vaga.status}
              </span>
            </div>

            <div className="vaga-detalhes">
              <div className="detalhe">
                <Briefcase size={18} />
                <span>{vaga.area}</span>
              </div>

              <div className="detalhe">
                <MapPin size={18} />
                <span>{vaga.location}</span>
              </div>

              <div className="detalhe">
                <Briefcase size={18} />
                <span>{vaga.type}</span>
              </div>

              <div className="detalhe">
                <Calendar size={18} />
                <span>{formatarData(vaga.createdAt)}</span>
              </div>
            </div>

            <div className="vaga-stats">
              <div className="stat">
                <Users size={18} />
                <span>{vaga.candidates} candidatos</span>
              </div>
            </div>

            <button className="btn-candidatar">Candidatar-se</button>
          </div>
        ))}
      </div>

      {vagasFiltradas.length > 0 && (
        <div className="vagas-resultado">
          <p>Mostrando {vagasFiltradas.length} de {vagas.length} vagas</p>
        </div>
      )}
    </div>
  );
};

export default VagasStudent;
