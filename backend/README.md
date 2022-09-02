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

# Template ID para email automático "Um órgão público comentou em sua denúncia"
SENDGRID_TID_AGENCY_COMMENTED=

# Template ID para email automático "Um novo órgão público foi registrado no Alerta Brumadinho (Para usuários admins)"
SENDGRID_TID_AGENCY_CREATED=
 
# Template ID para email automático "Sua conta do Alerta Brumadinho foi aceita (Órgão Público)"
SENDGRID_TID_AGENCY_ACCEPTED=

# Template ID para email automático "Sua conta do Alerta Brumadinho foi rejeitada (Órgão Público)"
SENDGRID_TID_AGENCY_REJECTED=

# Template ID para email automático "Uma nova denúncia foi registrada no Alerta Brumadinho (Para usuários auditores)"
SENDGRID_TID_DENUNCIATION_CREATED=

# Template ID para email automático "Sua denúncia foi aprovada"
SENDGRID_TID_DENUNCIATION_ACCEPTED=

# Template ID para email automático "Sua denúncia foi rejeitada"
SENDGRID_TID_DENUNCIATION_REJECTED=

# Template ID para email automático "Você foi selecionado como auditor no Alerta Brumadinho"
SENDGRID_TID_YOU_ARE_AUDITOR=

# Template ID para email automático "Ative sua conta do Alerta Brumadinho (Confirmar e-mail)"
SENDGRID_TID_CONFIRM_EMAIL=

# Template ID para email automático "Você registrou uma denúncia no Alerta Brumadinho"
SENDGRID_TID_YOU_CREATED_DENUNCIATION=

# Template ID para email automático "Redefina sua senha"
SENDGRID_TID_REDEFINE_PASSWORD=

# URL do front-end da aplicação
URL_FRONT=

# URL da aplicação para págia de redefinir senha
URL_FRONT_REDEFINE_PASSWORD=

# URL da aplicação para págia de "esqueci minha senha"
URL_FRONT_FORGOT_MY_PASSWORD=

# URL da aplicação para págia de validar órgãos públicos
URL_FRONT_VALIDATE_AGENCIES=

# URL da aplicação para págia de validar denúncias
URL_FRONT_VALIDATE_DENUNCIATIONS=

# URL da aplicação para págia de código de conduta
URL_FRONT_CODE_OF_CONDUCT=

# String de conexão com o banco de dados principal da aplicação
URI_MONGO_DB_ALERTA_BRUMADINHO=

# String de conexão com o banco de dados de sessões da aplicação
URI_MONGO_DB_SESSIONS=

# Tempo de expiração do token de autenticação do usuário
JWT_EXPIRES_IN=

# Senha para codificação e decodificação do token de autenticação do usuário
JWT_PASS=

# Número limite de objetos retornados nas requisições de busca com paginação
LIMIT_PER_PAGE=

# Porta do aplicativo
PORT=

# Número limite de requisições por ip (Para criação de denúncias)
RATE_LIMITER_CREATE_POINTS=

# Tempo em segundos (Para criação de denúncias)
RATE_LIMITER_CREATE_DURATION=

# Tempo limite de requisições por ip (Para o restante da api)
RATE_LIMITER_ALL_DURATION=

# Tempo em segundos (Para o restante da api)
RATE_LIMITER_ALL_POINTS=

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
