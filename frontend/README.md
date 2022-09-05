<h1 align="center"><img src="https://i.ibb.co/JzDvNwN/AB-Capa.png" alt="Alerta Brumadinho" width="100%" height="auto"></h1>

# Alerta Brumadinho - Solução Tecnológica para Denúncia de Crimes Ambientais em Brumadinho, Minas Gerais

## Informações Gerais
Este repositório contém o código-fonte do **front-end** do Alerta Brumadinho, uma plataforma aberta para registrar ocorrências ambientais em Brumadinho - MG. Para mais informações sobre o projeto, veja: https://github.com/cewebbr/mover-se_alerta-brumadinho.

[![Software License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/cewebbr/mover-se_alerta-brumadinho)

## Instalação e Execução

### Tecnologias utilizadas

- [React](https://pt-br.reactjs.org/)

### Pré-requisitos

- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com)

### Etapas para executar o projeto:

#### 1. No terminal

```bash
# Clone este repositório
$ git clone https://github.com/cewebbr/mover-se_alerta-brumadinho.git

# Acesse a pasta do front-end do projeto no terminal
$ cd mover-se_alerta-brumadinho/frontend

# Crie um arquivo `.env` na raiz do diretório /frontend

# Instale as dependências
$ npm install

```

####  2. Configuração das variáveis de ambientes

Abra o arquivo `.env` na raiz do diretório /frontend e configure as variáveis de ambiente

```bash
# Endereço do back-end da aplicação (ex: <http://localhost:3001> ou a url do serviço onde o back-end está executando)
REACT_APP_BACKEND_URL=''

# Url da API do Cloudinary onde serão hospedadas as imagens da aplicação (foto de perfil de usuário e imagens das denúncias)
REACT_APP_CLOUDINARY_URL=''

# API Key do Cloudinary
REACT_APP_CLOUDINARY_API_KEY=''

# Valor do upload preset do Cloudinary
REACT_APP_CLOUDINARY_UPLOAD_PRESET=''
```

####  3. Executando a aplicação
```bash
# Execute a aplicação com o seguinte comando
$ npm start

# O servidor inciará na porta:3000 - acesse <http://localhost:3000>
```

### Autores: [Lucas Vinicius Ribeiro](https://github.com/lucasvribeiro) e [Lucas Souza Santos](https://github.com/souzalucas).
