# Desafio Técnico - Pokémon App Full Stack

Este projeto é uma aplicação full stack desenvolvida com **TypeScript** para o desafio técnico, onde o usuário pode realizar login e, após autenticado, acessar uma listagem de dados de Pokémons obtidos de uma API pública.

---

## 🎯 Objetivo do Desafio

Construir uma aplicação que demonstre habilidades em:
* Desenvolvimento Backend com Node.js e TypeScript.
* Desenvolvimento Frontend com React e TypeScript.
* Autenticação de usuários (login, registro e proteção de rotas).
* Comunicação entre Frontend e Backend.
* Integração com uma API pública externa (PokeAPI).
* Uso de Banco de Dados (PostgreSQL).
* Testes automatizados.
* Boas práticas de código, organização e criatividade.

---

## 🚀 Funcionalidades

1.  **Autenticação:**
    * **Login de Usuário:** Tela para que usuários existentes possam entrar na aplicação.
    * **Cadastro de Usuário:** Tela para que novos usuários possam se registrar.
    * **Proteção de Rotas:** Acesso à lista de Pokémons apenas para usuários autenticados via JWT (JSON Web Token).

2.  **Listagem de Pokémons:**
    * Após o login, o usuário é redirecionado para uma tela que exibe uma lista de Pokémons.
    * A consulta à [PokeAPI](https://pokeapi.co/) é realizada através do backend (o frontend não chama a API externa diretamente).

3.  **Tecnologias Utilizadas:**
    * **Backend:** Node.js, Express.js, TypeScript, TypeORM, PostgreSQL, bcryptjs (para hash de senhas), jsonwebtoken (para JWT), axios.
    * **Frontend:** React.js, TypeScript, Vite, React Router DOM, Axios.
    * **Banco de Dados:** PostgreSQL (via Docker).
    * **Testes:** Jest, Supertest.

---

## 🏗️ Estrutura do Projeto

O projeto é organizado em duas pastas principais:
* `backend/`: Contém todo o código do servidor Node.js.
* `frontend/`: Contém todo o código da aplicação React.

---

## 💻 Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e rodar a aplicação em sua máquina.

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

* [**Node.js**](https://nodejs.org/en/download/) (versão LTS recomendada - v20.x ou mais recente)
* [**npm**](https://www.npmjs.com/get-npm) (gerenciador de pacotes do Node.js)
* [**Docker Desktop**](https://www.docker.com/products/docker-desktop/) (necessário para rodar o PostgreSQL)
* **Git** (para clonar o repositório)

### 1. Clonar o Repositório

Abra seu terminal e clone o repositório do GitHub:

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd desafio-fullstack-pokemon