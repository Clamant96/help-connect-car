# Help Connect Car 🚗

Sistema de API RESTful para gerenciamento de reserva de veículos, desenvolvido com **Node.js**, **TypeScript** e **MongoDB**.

## 📋 Descrição

Help Connect Car é uma aplicação backend que permite gerenciar reservas de carros por usuario.

## 🎯 Funcionalidades

- ✅ **Autenticação**: Registro e login de usuários com JWT
- ✅ **Gerenciamento de Usuários**: CRUD completo de usuários
- ✅ **Gerenciamento de Veículos**: Cadastro e listagem de veículos
- ✅ **Gerenciamento de Reservas**: Criar e gerenciar reservas de veículos
- ✅ **Segurança**: Senhas criptografadas com bcryptjs

## 🛠️ Tecnologias

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **Node.js** | - | Runtime JavaScript |
| **TypeScript** | ^5.9.3 | Tipagem estática para JavaScript |
| **Express** | ^5.2.1 | Framework web |
| **MongoDB** | - | Banco de dados NoSQL |
| **Mongoose** | ^9.1.5 | ODM para MongoDB |
| **JWT** | ^9.0.3 | Autenticação com tokens |
| **bcryptjs** | ^3.0.3 | Hash de senhas |
| **CORS** | ^2.8.6 | Controle de acesso |
| **Nodemon** | ^3.1.11 | Desenvolvimento com reload automático |

## 📁 Estrutura do Projeto

```
src/
├── app.ts                          # Configuração da aplicação Express
├── server.ts                       # Inicialização do servidor
├── assets/                         # Arquivos estáticos
├── config/
│   └── database.ts                # Configuração do MongoDB
├── controllers/
│   ├── AuthController.ts          # Autenticação (register/login)
│   ├── UsuarioController.ts       # Operações de usuários
│   ├── VeiculoController.ts       # Operações de veículos
│   └── ReservaController.ts       # Operações de reservas
├── middlewares/
│   ├── auth.ts                    # Autenticação JWT
│   ├── errorHandler.ts            # Tratamento de erros
│   └── notFound.ts                # Rota não encontrada
├── models/
│   ├── User.ts                    # Schema de usuário
│   ├── Veiculo.ts                 # Schema de veículo
│   └── Reserva.ts                 # Schema de reserva
├── routes/
│   ├── authRoutes.ts              # Rotas de autenticação
│   ├── usuarioRoutes.ts           # Rotas de usuários
│   ├── veiculoRoutes.ts           # Rotas de veículos
│   └── reservaRoutes.ts           # Rotas de reservas
├── seed/
│   ├── carros.json                # Dados de exemplo (veículos)
│   └── seed.ts                    # Script para popular banco
└── util/
    └── JWTUtil.ts                 # Utilitários de JWT
```

## 🚀 Configuração e Instalação

### Pré-requisitos

- Node.js (v16+)
- npm ou yarn
- MongoDB (local ou cloud)

## Instale as dependências**
```bash
npm install
```

## 📦 Scripts Disponíveis

```bash
# Rodar a aplicacao
npm run dev
```

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. Para acessar endpoints protegidos:

1. **Registre** um novo usuário em `POST /api/auth/register`
2. **Faça login** em `POST /api/auth/login` para obter o token
3. **Inclua** o token no header das requisições protegidas:

## 💾 Banco de Dados

O projeto utiliza **MongoDB** com **Mongoose** para ODM. As coleções principais são:

- **users**: Armazena dados de usuários
- **veiculos**: Armazena dados de veículos
- **reservas**: Armazena dados de reservas