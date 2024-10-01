# Rocket Forum

Rocket Forum é um projeto desenvolvido como parte do curso da Rocketseat. O projeto será uma aplicação de fórum utilizando o framework [NestJS](https://nestjs.com/), focando em boas práticas de Clean Code e SOLID.

## Descrição

O objetivo do projeto é construir uma API backend para um fórum, onde os usuários poderão criar tópicos, responder a discussões e interagir. A aplicação será integrada com o banco de dados usando [Prisma](https://www.prisma.io/), com foco em escalabilidade e manutenibilidade, seguindo os princípios ensinados no curso da Rocketseat.

## Tecnologias

- **NestJS** (v10.0.0): Framework Node.js para construção de aplicações server-side escaláveis.
- **Prisma** (v5.20.0): ORM moderno para facilitar a manipulação de banco de dados.
- **TypeScript** (v5.1.3): Linguagem que melhora a qualidade do código com tipagem estática.
- **RxJS** (v7.8.1): Biblioteca para programação reativa com foco em eventos assíncronos.

## Estrutura do Projeto

A estrutura do projeto seguirá a arquitetura modular do NestJS, facilitando a escalabilidade e a manutenção.

```shell
src/ │ 
     ├── app.module.ts # Módulo principal da aplicação 
     └── main.ts # Arquivo de inicialização do projeto 
```

## Como Executar

### Pré-requisitos

- Node.js v16 ou superior
- npm ou yarn
- Prisma CLI

### Passos para rodar o projeto

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/rocket-forum.git
   cd rocket-forum
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure o banco de dados no arquivo .env:
   ```bash
    DATABASE_URL: "url do banco de dados"
   ```
4. Execute as migrações do Prisma:
   ```bash
   npx prisma migrate dev
   ```
5. Execute a aplicação em modo de desenvolvimento:
   ```bash
   npm run start:dev
   ```
6. Para fazer o build da aplicação:
   ```bash
   npm run build
   ```
7. Para rodar a aplicação em produção:
   ```bash
   npm run start:prod
   ```

## Scripts Disponíveis
* start: Inicia a aplicação.
* start:dev: Inicia a aplicação em modo de desenvolvimento com hot-reload.
* start:debug: Inicia a aplicação em modo debug com hot-reload.
* build: Realiza o build da aplicação.

#### Esse README será atualizado conforme o desenvolvimento do projeto avance.

Esse template está pronto para evoluir conforme o projeto "Rocket Forum" se desenvolve, sendo atualizado conforme novas funcionalidades forem implementadas.