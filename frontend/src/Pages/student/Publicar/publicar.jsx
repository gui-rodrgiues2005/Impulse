// Importa o arquivo de estilos SCSS
import './publicar.scss';

// Importa o React e o hook useState
import React, { useState } from 'react';

// Componente principal
const ActivityPublisher = () => {

    // Estado para armazenar o tipo da atividade
    const [activityType, setActivityType] = useState('');

    // Estado para armazenar o nível da atividade
    const [level, setLevel] = useState('');

    // Estado para controlar a visibilidade da publicação
    const [visibility, setVisibility] = useState('public');

    // Estado para armazenar a imagem/anexo selecionado
    const [selectedImage, setSelectedImage] = useState(null);

    // Estado para armazenar o título
    const [title, setTitle] = useState('');

    // Estado para armazenar a descrição
    const [description, setDescription] = useState('');

    // Estado para armazenar o link
    const [link, setLink] = useState('');

    // Estado para armazenar as habilidades selecionadas
    const [selectedSkills, setSelectedSkills] = useState([]);

    // Lista de habilidades disponíveis
    const skillsOptions = [
        'Comunicação',
        'Liderança',
        'Trabalho em equipe',
        'Organização',
        'Análise de dados',
        'Criatividade',
        'Resolução de problemas',
        'Gestão de projetos',
        'Empatia',
        'Pesquisa',
        'Escrita acadêmica',
        'Marketing'
    ];

    // Função responsável por adicionar/remover habilidades
    const handleSkillToggle = (skill) => {

        // Verifica se a habilidade já foi selecionada
        setSelectedSkills(prev =>

            // Se já existir, remove
            prev.includes(skill)

                ? prev.filter(s => s !== skill)

                // Se não existir, adiciona
                : [...prev, skill]
        );
    };

    // Função responsável pelo upload da imagem/anexo
    const handleImageUpload = (event) => {

        // Verifica se existe arquivo selecionado
        if (event.target.files && event.target.files[0]) {

            // Armazena o arquivo no estado
            setSelectedImage(event.target.files[0]);
        }
    };

    // Função chamada ao enviar o formulário
    const handleSubmit = (event) => {

        // Impede o recarregamento da página
        event.preventDefault();

        // Exibe os dados no console
        console.log({
            activityType,
            level,
            visibility,
            selectedImage,
            title,
            description,
            link,
            selectedSkills
        });

        // Exibe alerta de sucesso
        alert('Atividade publicada! (Verifique o console para os dados)');
    };

    // Estrutura visual do componente
    return (

        <main className="content">

            {/* Título da página */}
            <h1 className="page-title">
                Publicar Atividade
            </h1>

            {/* Subtítulo da página */}
            <p className="page-subtitle">
                Compartilhe uma experiência da sua trajetória acadêmica ou profissional
            </p>

            {/* Formulário principal */}
            <form className="publish-form" onSubmit={handleSubmit}>

                {/* Área de upload */}
                <div className="upload-area">

                    {/* Input de upload escondido */}
                    <input
                        type="file"
                        id="imageUpload"
                        accept=".png,.jpg,.jpeg,.pdf"
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                    />

                    {/* Label clicável do upload */}
                    <label htmlFor="imageUpload" className="upload-label">

                        <div className="upload-icon-placeholder"></div>

                        Clique para adicionar uma imagem ou anexo

                        <span className="allowed-formats">
                            PNG, JPG ou PDF
                        </span>

                    </label>

                    {/* Exibe nome do arquivo selecionado */}
                    {selectedImage && (
                        <p className="selected-file-name">
                            {selectedImage.name}
                        </p>
                    )}

                </div>

                {/* Campo Tipo de Atividade */}
                <div className="form-group">

                    <label htmlFor="activityType" className="label">
                        Tipo de Atividade
                    </label>

                    <select
                        id="activityType"
                        className="select-input"
                        value={activityType}
                        onChange={(e) => setActivityType(e.target.value)}
                    >

                        <option value="" disabled>
                            Selecione o tipo
                        </option>

                        <option value="estagio">
                            Estágio
                        </option>

                        <option value="projeto">
                            Projeto
                        </option>

                        <option value="curso">
                            Curso
                        </option>

                        <option value="voluntariado">
                            Voluntariado
                        </option>

                        <option value="Pesquisa">
                            Pesquisa
                        </option>

                        <option value="Evento">
                            Evento
                        </option>

                        <option value="Projeto Acadêmico">
                            Projeto Acadêmico
                        </option>

                    </select>

                </div>

                {/* Campo Título */}
                <div className="form-group">

                    <label htmlFor="title" className="label">
                        Título
                    </label>

                    <input
                        type="text"
                        id="title"
                        className="text-input"
                        placeholder="Ex: Estágio em Recursos Humanos"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                </div>

                {/* Campo Descrição */}
                <div className="form-group">

                    <label htmlFor="description" className="label">
                        Descrição
                    </label>

                    <textarea
                        id="description"
                        className="textarea-input"
                        placeholder="Descreva a atividade"
                        rows="5"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>

                </div>

                {/* Campo Habilidades */}
                <div className="form-group">

                    <label className="label">
                        Habilidades (opcional)
                    </label>

                    <div className="skills-tags">

                        {/* Percorre todas as habilidades */}
                        {skillsOptions.map(skill => (

                            <button
                                key={skill}
                                type="button"
                                className={`skill-tag ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                                onClick={() => handleSkillToggle(skill)}
                            >

                                {skill}

                            </button>

                        ))}

                    </div>

                </div>

                {/* Campo Nível */}
                <div className="form-group">

                    <label htmlFor="level" className="label">
                        Nível
                    </label>

                    <select
                        id="level"
                        className="select-input"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                    >

                        <option value="" disabled>
                            Selecione o nível
                        </option>

                        <option value="iniciante">
                            Iniciante
                        </option>

                        <option value="intermediario">
                            Intermediário
                        </option>

                        <option value="avancado">
                            Avançado
                        </option>

                    </select>

                </div>

                {/* Campo Link */}
                <div className="form-group">

                    <label htmlFor="link" className="label">
                        Link
                    </label>

                    <input
                        type="url"
                        id="link"
                        className="text-input"
                        placeholder="https://exemplo.com"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />

                </div>

                {/* Campo Visibilidade */}
                <div className="form-group">

                    <label className="label">
                        Visibilidade
                    </label>

                    <div className="visibility-options">

                        {/* Botão Público */}
                        <button
                            type="button"
                            className={`visibility-option ${visibility === 'public' ? 'selected' : ''}`}
                            onClick={() => setVisibility('public')}
                        >

                            Público

                            <span className="description">
                                Visível para todos
                            </span>

                        </button>

                        {/* Botão Privado */}
                        <button
                            type="button"
                            className={`visibility-option ${visibility === 'private' ? 'selected' : ''}`}
                            onClick={() => setVisibility('private')}
                        >

                            Privado

                            <span className="description">
                                Apenas você pode visualizar
                            </span>

                        </button>

                    </div>

                </div>

                {/* Botão de publicação */}
                <button type="submit" className="publish-button">

                    Publicar Atividade

                </button>

            </form>

        </main>
    );
};

// Exporta o componente
export default ActivityPublisher;