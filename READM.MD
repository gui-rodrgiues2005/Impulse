Impulse - Hackathon Unifenas

Plataforma web para conexão entre estudantes, empresas e egressos, permitindo a divulgação da trajetória acadêmica e profissional através de um feed de atividades.

Objetivo

O Impulse tem como objetivo permitir que estudantes registrem suas atividades acadêmicas, como projetos, pesquisas, estágios e eventos, tornando visível sua evolução e facilitando a conexão com o mercado de trabalho.

Funcionalidades

Feed de atividades acadêmicas

Publicação de atividades (projetos, estágio, pesquisa, eventos)

Perfil de estudante com informações pessoais, bio e links externos (ex: GitHub)

Upload de imagens de atividades usando Cloudinary

Interação com publicações (curtir, comentar, salvar)

Filtro por tecnologia, tipo de atividade e nível

Controle de acesso baseado em roles (User, Admin)

Tecnologias
Frontend

React + Vite

Sass

Bibliotecas para formulários, autenticação e upload de imagens

Backend

.NET 8 Web API

Entity Framework Core

JWT para autenticação

Cloudinary para armazenamento de imagens

Banco de Dados

PostgreSQL

Estrutura do Projeto

/backend → API em .NET

/frontend → Aplicação React

/docs → Documentação, diagramas e modelagem

-Lógica e Estrutura de Implementação

Upload de Imagens → Toda imagem de atividade será enviada para o Cloudinary, e a URL será armazenada em Activity.ImageUrl.

Relacionamento entre entidades → User e Activity possuem relacionamento 1:N (um usuário pode ter várias atividades).

Controle de acesso → A role Admin poderá gerenciar todas as atividades; User só poderá gerenciar suas próprias.

Filtros → Backend irá expor endpoints para filtrar por tecnologia, tipo de atividade e nível, retornando listas paginadas.

Extensibilidade → As classes base estão definidas; novas propriedades ou entidades podem ser adicionadas conforme necessidade durante o desenvolvimento.