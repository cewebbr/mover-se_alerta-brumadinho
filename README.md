<h1 align="center"><img src="https://user-images.githubusercontent.com/16292535/150152830-a0077ec7-d677-4e19-b282-04401bb5a060.png" alt="logos Ceweb.br NIC.br CGI.br " width="250" height="auto"></h1>

<h1 align="center">
    <img src="https://ceweb.br/media/imgs/Moverse_na_Web_banner-site.jpg" alt="Vamos transformar Brumadinho. Projeto Mover-se na WEB!" width="450" height="auto">
</h1>


<h1 align="center"> Alerta Brumadinho - Solução Tecnológica para Denúncia de Crimes Ambientais em Brumadinho, Minas Gerais </h1>

O projeto Alerta Brumadinho - Solução Tecnológica para Denúncia de Crimes Ambientais em Brumadinho, Minas Gerais faz parte da chamada pública [CGI.br/NIC.br/Ceweb.br nº 01/2019
Mover-Se na Web – Articulação Pró-Brumadinho](https://ceweb.br/projetos/chamada.html)

[![Software License](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/lucasvribeiro/mover-se_alerta-brumadinho)

#  Descrição do Projeto

O projeto Alerta Brumadinho é uma plataforma voltada para a população de Brumadinho registrar ocorrências que agridem de alguma forma o meio-ambiente do município. O objetivo da plataforma é servir como um portal onde a população pode expor problemas ambientais que estejam ocorrendo no município a fim de dar maior visibilidade a esses problemas. Também é possível, através da plataforma, que o órgão ambiental responsável pelo município interaja com aquilo que está sendo publicado pelos usuários, de modo a proporcionar, quando necessário, uma interação entre o setor público do município e a população.

Vale ressaltar que a plataforma disponibiliza uma funcionalidade para que as publicações feitas pelos usuários sejam aferidas antes de se tornarem públicas, com intuito de não permitir a publicação de conteúdos como nudez e pornografia, incitação à violência, discurso de ódio, etc. 

### Funcionalidades ativas
- [x] Cadastro de usuário
- [x] Recuperação de senha do usuário
- [x] Acessar sem cadastro
- [x] Fazer login de usuário e órgão ambiental
- [x] Solicitação de cadastro de órgão ambiental
- [x] Linha do tempo das publicações
- [x] Busca de publicação por código identificador
- [x] Ordenação das publicações por "Mais recentes" ou "Mais relevantes"
- [x] Cadastro de nova publicação
- [x] Interação nas publicações da linha do tempo: Curtir e Comentar
- [x] Interação nos comentários das publicações: Curtir
- [x] Validar publicação (disponível apenas para usuários com permissão de validação)
- [x] Envio de e-mails de notificação


### Funcionalidades em desenvolvimento
- [ ] Tela para visualização de uma publicação específica
- [ ] Compartilhamento de publicação em outros canais sociais (Whatsapp, Facebook, etc)
- [ ] Configuração do PWA da aplicação
- [ ] Notificações no browser
- [ ] Definição dos Termos de Uso e Política de Uso de Dados
- [ ] Envio de e-mails de notificação em mais alguns cenários específicos

### Papéis dentro da plataforma

-  Usuário: população de Brumadinho em geral, que pode acessar a plataforma, interagir e criar publicações.
-  Auditor: usuários específicos que possuem permissão de aferir publicações que estejam pendentes (Aprovar ou Descartar).
-  Órgão Público Ambiental: tipo de usuário destinado ao órgão do município que pode interagir nas publicações dos usuários.
-  Administrador: usuário que possui o maior nível de permissões dentro da plataforma.

Observação: Todos os usuários, publicações e interações existentes hoje na plataforma correpondem aos testes que estão sendo feitos. A aplicação ainda não está disponível em ambiente de produção para o público em geral.

#  Instalação

Este repositório está subdividido em dois projetos: frontend e backend. O primeiro foi desenvolvido em React e é responsável por toda a interface de usuário do projeto, enquanto o segundo foi desenvolvido em Node, Express e Mongo, e é responsável pelo gerenciamento de toda a API do sistema.

Dessa forma, os processos de instalação e execução de cada um dos projetos (frontend e backend) estão descritos nos seus respectivos diretórios:
- [Documentação do Front-end](frontend/README.md)
- [Documentação do Back-end](backend/README.md)

<br/>

### Equipe responsável pelo projeto 

- Lucas Vinicius Ribeiro    - UTFPR - Desenvolvedor - lucasvribeiro14@gmail.com
- Lucas Souza Santos        - UTFPR - Desenvolvedor - lsouza.santos98@gmail.com
- Igor Scaliante Wiese      - UTFPR - Coordenador   - igor.wiese@gmail.com

</br>

# Sobre o [Ceweb.br](https://ceweb.br/sobre-o-ceweb-br/), [NIC.br](https://www.nic.br/sobre/) e [CGI.br](https://cgi.br/sobre/)

### Ceweb.br - Centro de Estudos sobre Tecnologias Web
O Centro de Estudos sobre Tecnologias Web (Ceweb.br) foi criado como um departamento do Núcleo de Informação e Coordenação do Ponto BR (NIC.br) para viabilizar a participação da comunidade brasileira no desenvolvimento global da Web e subsidiar a formulação de políticas públicas. O Ceweb.br nasce inspirado pelos princípios e projetos já desenvolvidos pelo Escritório Brasileiro do W3C (World Wide Web Consortium), hospedado e apoiado pelo NIC.br no Brasil desde 2008, com a missão de promover atividades que estimulem o uso de tecnologias abertas e padronizadas na Web.


### NIC.br - Núcleo de Informação e Comunicação do Ponto BR
O Núcleo de Informação e Coordenação do Ponto BR - NIC.br foi criado para implementar as decisões e os projetos do Comitê Gestor da Internet no Brasil - CGI.br, que é o responsável por coordenar e integrar as iniciativas e serviços da Internet no País.


### CGI.br - Comitê Gestor da Internet no Brasil
O Comitê Gestor da Internet no Brasil tem a atribuição de estabelecer diretrizes estratégicas relacionadas ao uso e desenvolvimento da Internet no Brasil e diretrizes para a execução do registro de Nomes de Domínio, alocação de Endereço IP (Internet Protocol) e administração pertinente ao Domínio de Primeiro Nível ".br". Também promove estudos e recomenda procedimentos para a segurança da Internet e propõe programas de pesquisa e desenvolvimento que permitam a manutenção do nível de qualidade técnica e inovação no uso da Internet

### Equipe Ceweb.br

<ul>
    <li>Amanda Marques</li> 
    <li>Ana Eliza</li>
    <li>Beatriz Rocha</li>
    <li>Caroline Burle</li>
    <li>Diego Cerqueira</li>
    <li>Diogo Cortiz</li>
    <li>Juliana Ribeiro</li>
    <li>Reinaldo Ferraz</li>
    <li>Selma de Morais</li>
    <li>Vagner Diniz</li>
</ul>
