import React, { useState, useEffect } from 'react';
import "./VagasStudent.scss";
import {
  MapPin,
  Briefcase,
  Building2,
  Calendar,
  Users,
  X,
} from 'lucide-react';
import API_URL from '../../../service/api';

const VagasStudent = () => {

  // =========================================
  // ESTADOS
  // =========================================

  // Lista de vagas disponíveis
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros de busca
  const [filtroArea, setFiltroArea] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroLocalizacao, setFiltroLocalizacao] = useState('');

  // Status de cada candidatura { [jobId]: 'idle' | 'loading' | 'done' | 'error' }
  const [candidaturas, setCandidaturas] = useState({});

  // Controla se o modal de origem está aberto
  const [sourceModal, setSourceModal] = useState(false);

  // Vaga selecionada para candidatura
  const [vagaSelecionada, setVagaSelecionada] = useState(null);

  // Opções de origem da candidatura
  const sourceOptions = [
    { value: "Plataforma", label: "🖥️ Plataforma" },
    { value: "LinkedIn", label: "💼 LinkedIn" },
    { value: "Indicação", label: "🤝 Indicação" },
    { value: "Outros", label: "🔍 Outros" },
  ];

  // =========================================
  // FUNÇÕES
  // =========================================

  // Busca todas as vagas disponíveis e as candidaturas ao montar o componente
  useEffect(() => {
    fetchVagas();
    fetchMinhasCandidaturas();
  }, []);

  // Recarrega candidaturas quando volta à aba
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchMinhasCandidaturas();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

const fetchVagas = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Monta os parâmetros de query
      const params = new URLSearchParams();
      if (filtroTipo) params.append('type', filtroTipo);
      if (filtroArea) params.append('specialty', filtroArea);
      
      const url = params.toString() ? `${API_URL}/jobs?${params}` : `${API_URL}/jobs`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Erro ao buscar vagas');
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

  // Busca as candidaturas já feitas pelo usuário
  const fetchMinhasCandidaturas = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token ausente ao buscar candidaturas.');
        return;
      }
      const response = await fetch(`${API_URL}/jobs/my-applications`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const body = await response.text();
        console.error('Erro ao buscar candidaturas:', response.status, body);
        return;
      }

      const aplicacoes = await response.json();
      if (!Array.isArray(aplicacoes)) {
        console.error('Resposta de candidaturas inválida:', aplicacoes);
        return;
      }

      const novasCandidaturas = {};
      aplicacoes.forEach((app) => {
        novasCandidaturas[app.jobId] = 'done';
      });

      setCandidaturas(novasCandidaturas);
    } catch (err) {
      console.error('Erro ao buscar candidaturas:', err);
    }
  };

  // Abre o modal de origem ao clicar em "Candidatar-se"
  const handleAbrirModal = (vaga) => {
    setVagaSelecionada(vaga);
    setSourceModal(true);
  };

  // Envia a candidatura com a origem selecionada
  const handleCandidatar = async (source) => {
    if (!vagaSelecionada) return;

    const vagaId = vagaSelecionada.id;

    // Fecha o modal e marca como loading
    setSourceModal(false);
    setCandidaturas((prev) => ({ ...prev, [vagaId]: 'loading' }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/jobs/${vagaId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ source }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          setCandidaturas((prev) => ({ ...prev, [vagaId]: 'done' }));
          return;
        }
        throw new Error(data.message || 'Erro ao se candidatar');
      }

      setCandidaturas((prev) => ({ ...prev, [vagaId]: 'done' }));
      setVagas((prev) =>
        prev.map((v) =>
          v.id === vagaId ? { ...v, candidates: v.candidates + 1 } : v
        )
      );
    } catch (err) {
      console.error('Erro ao se candidatar:', err);
      setCandidaturas((prev) => ({ ...prev, [vagaSelecionada.id]: 'error' }));
    }
  };

  // Filtra vagas por área, tipo e localização
  const vagasFiltradas = vagas.filter((vaga) => {
    return (
      (!filtroArea || vaga.area.toLowerCase().includes(filtroArea.toLowerCase())) &&
      (!filtroTipo || vaga.type.toLowerCase().includes(filtroTipo.toLowerCase())) &&
      (!filtroLocalizacao || vaga.location.toLowerCase().includes(filtroLocalizacao.toLowerCase()))
    );
  });

  // Formata a data para o padrão brasileiro
  const formatarData = (data) => new Date(data).toLocaleDateString('pt-BR');

  // Retorna o label do botão de candidatura baseado no status
  const getBtnLabel = (vagaId) => {
    const status = candidaturas[vagaId];
    if (status === 'loading') return 'Enviando...';
    if (status === 'done') return '✓ Candidatura enviada';
    if (status === 'error') return 'Erro, tentar novamente';
    return 'Candidatar-se';
  };

  // Desabilita o botão se estiver carregando ou já candidatado
  const getBtnDisabled = (vagaId) => {
    const status = candidaturas[vagaId];
    return status === 'loading' || status === 'done';
  };

  if (loading) {
    return <div className="vagas-container"><p>Carregando vagas...</p></div>;
  }
 
  console.log(vagasFiltradas)

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="vagas-container">

      {/* CABEÇALHO */}
      <div className="vagas-header">
        <span>OPORTUNIDADES</span>
        <h1>Vagas Disponíveis</h1>
        <p>Explore as melhores oportunidades de estágio e primeiro emprego</p>
      </div>

      {/* FILTROS */}
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

      {/* LISTA DE VAGAS */}
      <div className="vagas-lista">
        {vagasFiltradas.map((vaga) => (
          <div className="vaga-card" key={vaga.id}>
            <div className="vaga-header">
              <div className="vaga-logo">
                <img
                  src={vaga.company.profileImage}
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

            {/* Botão que abre o modal de origem */}
            <button
              className={`btn-candidatar ${candidaturas[vaga.id] === 'done' ? 'btn-candidatar--done' : ''} ${candidaturas[vaga.id] === 'error' ? 'btn-candidatar--error' : ''}`}
              onClick={() => handleAbrirModal(vaga)}
              disabled={getBtnDisabled(vaga.id)}
            >
              {getBtnLabel(vaga.id)}
            </button>
          </div>
        ))}
      </div>

      {vagasFiltradas.length > 0 && (
        <div className="vagas-resultado">
          <p>Mostrando {vagasFiltradas.length} de {vagas.length} vagas</p>
        </div>
      )}

      {/* MODAL DE ORIGEM DA CANDIDATURA */}
      {sourceModal && (
        <div className="source-modal-overlay">
          <div className="source-modal">
            <div className="source-modal__header">
              <h3>Como você ficou sabendo desta vaga?</h3>
              <button onClick={() => setSourceModal(false)}>
                <X size={20} />
              </button>
            </div>

            <p className="source-modal__subtitle">
              Candidatando-se para <strong>{vagaSelecionada?.title}</strong>
            </p>

            <div className="source-modal__options">
              {sourceOptions.map((option) => (
                <button
                  key={option.value}
                  className="source-modal__option"
                  onClick={() => handleCandidatar(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default VagasStudent;