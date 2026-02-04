# Help Connect Car 🚗

Sistema de API RESTful para gerenciamento de reserva de veículos, desenvolvido com **Node.js**, **TypeScript** e **MongoDB**.

## 📋 Descrição

Help Connect Car é uma aplicação backend que permite gerenciar usuários, veículos e reservas de forma segura e eficiente. O sistema implementa autenticação via JWT e utiliza MongoDB como banco de dados.

## 🎯 Funcionalidades

- ✅ **Autenticação**: Registro e login de usuários com JWT
- ✅ **Gerenciamento de Usuários**: CRUD completo de usuários
- ✅ **Gerenciamento de Veículos**: Cadastro e listagem de veículos
- ✅ **Gerenciamento de Reservas**: Criar e gerenciar reservas de veículos
- ✅ **Segurança**: Senhas criptografadas com bcryptjs
- ✅ **Middleware de Erro**: Tratamento centralizado de erros
- ✅ **Health Check**: Endpoint para verificar status da API

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

### Instalação

1. **Clone o repositório** (ou extraia os arquivos)
```bash
cd help_connect_car
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/help_connect_car
JWT_SECRET=sua_chave_secreta_aqui
JWT_EXPIRATION=7d
```

4. **Execute o seed (opcional)**

Para popular o banco com dados de exemplo:
```bash
npm run seed
```

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento com hot-reload
npm run dev

# Compilar TypeScript
npm run build

# Iniciar aplicação em produção
npm start

# Popular banco de dados com dados de exemplo
npm run seed

# Limpar diretório dist
npm run clean

# Compilar novamente (clean + build)
npm run rebuild

# Executar testes
npm test
```

## 🔌 Endpoints da API

### Health Check
```
GET /health
```

### Autenticação
```
POST   /api/auth/register          # Registrar novo usuário
POST   /api/auth/login             # Fazer login
```

### Usuários (Requer autenticação)
```
GET    /api/usuario                # Listar todos os usuários
GET    /api/usuario/:id            # Obter usuário por ID
PUT    /api/usuario/:id            # Atualizar usuário
DELETE /api/usuario/:id            # Deletar usuário
```

### Veículos
```
GET    /api/veiculo                # Listar todos os veículos (público)
GET    /api/veiculo/:id            # Obter veículo por ID (público)
POST   /api/veiculo                # Criar novo veículo (requer autenticação)
PUT    /api/veiculo/:id            # Atualizar veículo (requer autenticação)
DELETE /api/veiculo/:id            # Deletar veículo (requer autenticação)
```

### Reservas (Requer autenticação)
```
GET    /api/reserva                # Listar todas as reservas
GET    /api/reserva/:id            # Obter reserva por ID
POST   /api/reserva                # Criar nova reserva
PUT    /api/reserva/:id            # Atualizar reserva
DELETE /api/reserva/:id            # Deletar reserva
```

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. Para acessar endpoints protegidos:

1. **Registre** um novo usuário em `POST /api/auth/register`
2. **Faça login** em `POST /api/auth/login` para obter o token
3. **Inclua** o token no header das requisições protegidas:

```
Authorization: Bearer seu_token_jwt_aqui
```

## 🐳 Docker

### Build da imagem Docker
```bash
docker build -t help_connect_car .
```

### Executar com Docker Compose
```bash
docker-compose up
```

## 💾 Banco de Dados

O projeto utiliza **MongoDB** com **Mongoose** para ODM. As coleções principais são:

- **users**: Armazena dados de usuários
- **veiculos**: Armazena dados de veículos
- **reservas**: Armazena dados de reservas

## 🔒 Segurança

- ✅ Senhas criptografadas com bcryptjs
- ✅ Validação JWT em endpoints protegidos
- ✅ CORS configurado para controle de acesso
- ✅ Validação de entrada de dados
- ✅ Tratamento centralizado de erros

## 📝 Exemplo de Requisição

### Registrar um novo usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Fazer login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Listar usuários (com token)
```bash
curl -X GET http://localhost:3000/api/usuario \
  -H "Authorization: Bearer seu_token_aqui"
```

## 🚨 Tratamento de Erros

A API retorna erros estruturados em formato JSON:

```json
{
  "message": "Descrição do erro",
  "status": 400,
  "timestamp": "2025-02-02T10:30:00.000Z"
}
```

## 📚 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do servidor | 3000 |
| `NODE_ENV` | Ambiente (development/production) | development |
| `MONGODB_URI` | URI de conexão MongoDB | - |
| `JWT_SECRET` | Chave secreta para JWT | - |
| `JWT_EXPIRATION` | Expiração do token JWT | 7d |

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença ISC.

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

---

**Desenvolvido com ❤️ usando TypeScript e Express**
