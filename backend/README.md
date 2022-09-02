<h1  align="center"><img  src="https://i.ibb.co/JzDvNwN/AB-Capa.png"  alt="Alerta Brumadinho"  width="100%"  height="auto"></h1>

# Alerta Brumadinho - Solução Tecnológica para Denúncia de Crimes Ambientais em Brumadinho, Minas Gerais

## Informações Gerais
Este repositório contém o código-fonte do **back-end** do Alerta Brumadinho, uma plataforma aberta para registrar ocorrências ambientais em Brumadinho - MG. Para mais informações sobre o projeto, veja: https://github.com/cewebbr/mover-se_alerta-brumadinho.

[![Software License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/cewebbr/mover-se_alerta-brumadinho)

## Instalação e Execução

### Tecnologias utilizadas

- [Node.js](https://nodejs.org/en/)

### Pré-requisitos

- [npm](https://www.npmjs.com/)

- [Git](https://git-scm.com)
 

### Etapas para executar o projeto:

#### 1. No terminal 

```bash
# Clone este repositório
$ git clone https://github.com/cewebbr/mover-se_alerta-brumadinho.git	

# Acesse a pasta do back-end do projeto no terminal
$ cd mover-se_alerta-brumadinho/backend

# Crie um arquivo `.env` na raiz do diretório /backend

# Instale as dependências
$ npm install
```

#### 2. Configuração das variáveis de ambiente

Abra o arquivo `.env` na raiz do diretório /backend e configure as variáveis de ambiente

```bash
# Chave de acesso para a API de envio de e-mails automáticos (Sendgrid)
SENDGRID_API_KEY=

# E-mail remetente no Sendgrid
SENDGRID_EMAIL_SENDER=

# URL do front-end da aplicação
URL_FRONT=

# String de conexão com o banco de dados principal da aplicação
URI_MONGO_DB_ALERTA_BRUMADINHO=

# String de conexão com o banco de dados de sessões da aplicação
URI_MONGO_DB_SESSIONS=

# Senha para codificação e decodificação do token de autenticação do usuário
JWT_PASS=

# Porta para execução do aplicativo
PORT=

# Chave secreta de sessão do Express
SESSION_SECRET=
```
#### 3. Executando a aplicação

```bash
# Execute a aplicação com o seguinte comando
$ npm run dev

# O servidor inciará na porta especificada na variável de ambiente PORT - acesse <http://localhost:numero_da_porta>
```

### Autores: [Lucas Vinicius Ribeiro](https://github.com/lucasvribeiro) e [Lucas Souza Santos](https://github.com/souzalucas).
