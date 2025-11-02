# 🎩 CintosFashion

Sistema de gestão completo para fabricação de acessórios de moda em atacado. Plataforma que automatiza desde o orçamento até a entrega, incluindo controle de pedidos, rastreamento via QR Code e integração com pagamentos.

## 📋 Sobre o Projeto

O CintosFashion foi desenvolvido para resolver os problemas manuais do processo atual de fabricação:
- ❌ Orçamento manual via WhatsApp
- ❌ Confusão com tecidos de diferentes clientes
- ❌ Falta de controle tecnológico
- ❌ Comunicação desorganizada
- ❌ Perda de vendas

### ✅ Solução
- Orçamento automático no site
- QR Code único por tecido
- Rastreamento completo de pedidos
- Notificações automáticas via WhatsApp
- Pagamento integrado (Stripe)
- Nota fiscal automática (FocusNFe)

## 🚀 Stack Tecnológica

### Frontend
- **React** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **React Router DOM** - Roteamento
- **Axios** - HTTP client
- **Tailwind CSS** - Estilização

### Backend
- **Node.js** - Runtime
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **Prisma** - ORM
- **MySQL** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Criptografia de senhas

### Integrações
- **Stripe** - Pagamentos
- **FocusNFe** - Emissão de nota fiscal
- **WhatsApp API** - Notificações
- **Docker** - Containerização do banco

## 📁 Estrutura do Projeto

```
CintosFashion/
├── frontend/              # Aplicação React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # Serviços API
│   │   ├── types/         # Tipos TypeScript
│   │   ├── utils/         # Funções utilitárias
│   │   └── App.tsx        # Componente principal
│   ├── public/            # Arquivos públicos
│   └── package.json
│
├── backend/               # API Express
│   ├── src/
│   │   ├── controllers/  # Controllers
│   │   ├── routes/       # Rotas da API
│   │   ├── middleware/   # Middlewares
│   │   ├── services/    # Serviços de negócio
│   │   ├── utils/        # Utilitários
│   │   └── server.ts     # Servidor Express
│   ├── prisma/
│   │   ├── schema.prisma # Schema do banco
│   │   └── migrations/   # Migrations do Prisma
│   └── package.json
│
├── docker-compose.yml     # Configuração MySQL
├── .gitignore            # Arquivos ignorados pelo Git
└── README.md             # Este arquivo
```

## 🛠️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (v18 ou superior)
- **npm** ou **yarn**
- **Docker** e **Docker Compose**
- **Git**

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd CintosFashion
```

### 2. Configure o Banco de Dados (MySQL)

Suba o container MySQL usando Docker:

```bash
docker compose up -d
```

Isso criará um container MySQL rodando na porta **3307** com:
- **Usuário**: `root`
- **Senha**: `rootpassword`
- **Banco**: `cintos_fashion`

Verifique se está rodando:
```bash
docker ps
```

### 3. Configure o Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` na pasta `backend/`:

```env
PORT=3001
DATABASE_URL="mysql://root:rootpassword@localhost:3307/cintos_fashion"
JWT_SECRET="sua-chave-secreta-super-forte-aqui-mude-em-producao-123456789"
NODE_ENV=development

# Stripe (preencher depois)
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""

# FocusNFe (preencher depois)
FOCUSNFE_TOKEN=""
FOCUSNFE_EMAIL=""

# WhatsApp (preencher depois)
WHATSAPP_API_URL=""
WHATSAPP_API_KEY=""
WHATSAPP_INSTANCE=""
```

Gere o Prisma Client e crie as tabelas:

```bash
npm run prisma:generate
npx prisma migrate dev --name init
```

### 4. Configure o Frontend

```bash
cd ../frontend
npm install
```

Crie o arquivo `.env` na pasta `frontend/`:

```env
VITE_API_URL=http://localhost:3001/api
```

## 🚀 Como Rodar

### Desenvolvimento

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

O backend estará rodando em: `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

O frontend estará rodando em: `http://localhost:5173` (ou porta que o Vite indicar)

### Produção

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## 📚 Comandos Úteis

### Backend

```bash
# Desenvolvimento
npm run dev              # Inicia servidor com nodemon

# Prisma
npm run prisma:generate  # Gera Prisma Client
npm run prisma:migrate   # Cria nova migration
npm run prisma:studio    # Abre Prisma Studio (interface gráfica)

# Build
npm run build           # Compila TypeScript
npm start               # Inicia produção
```

### Frontend

```bash
# Desenvolvimento
npm run dev             # Inicia Vite dev server

# Build
npm run build           # Gera build de produção
npm run preview         # Preview do build de produção
```

### Docker

```bash
# Subir MySQL
docker compose up -d

# Ver logs
docker compose logs -f mysql

# Parar MySQL
docker compose stop

# Parar e remover
docker compose down
```

## 🗄️ Banco de Dados

### Modelos Principais

- **User** - Usuários (Clientes e Admins)
- **Product** - Produtos (Modelos de fivelas)
- **Order** - Pedidos
- **OrderItem** - Itens do pedido
- **Fabric** - Tecidos com QR Code
- **StatusHistory** - Histórico de status
- **PriceRule** - Regras de preço
- **Notification** - Notificações

### Visualizar Dados

Use o Prisma Studio para visualizar e editar dados:

```bash
cd backend
npm run prisma:studio
```

Acesse: `http://localhost:5555`

### Resetar Banco (CUIDADO!)

```bash
cd backend
npx prisma migrate reset --force
npx prisma migrate dev --name init
```

**⚠️ ATENÇÃO**: Isso apaga TODOS os dados!

## 🔐 Variáveis de Ambiente

### Backend (.env)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `PORT` | Porta do servidor | `3001` |
| `DATABASE_URL` | URL de conexão MySQL | `mysql://root:password@localhost:3307/cintos_fashion` |
| `JWT_SECRET` | Chave secreta para JWT | `sua-chave-super-secreta` |
| `STRIPE_SECRET_KEY` | Chave secreta do Stripe | `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Webhook secret do Stripe | `whsec_...` |

### Frontend (.env)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_API_URL` | URL da API backend | `http://localhost:3001/api` |

## 📖 Scripts do Package.json

### Backend

```json
{
  "dev": "nodemon --exec ts-node src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev",
  "prisma:studio": "prisma studio"
}
```

### Frontend

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "preview": "vite preview"
}
```

## 🧪 Testando a Conexão

Para testar se tudo está funcionando:

**Backend:**
```bash
cd backend
curl http://localhost:3001/health
```

Deve retornar:
```json
{"status": "ok"}
```

**Banco de Dados:**
```bash
docker exec -it cintos_fashion_db mysql -u root -prootpassword cintos_fashion -e "SHOW TABLES;"
```

## 🐛 Troubleshooting

### Erro: "Port already in use"
- Pare outros processos na porta ou mude a porta no `.env`

### Erro: "Cannot connect to database"
- Verifique se o Docker está rodando: `docker ps`
- Verifique se o container MySQL está up: `docker compose ps`
- Verifique as credenciais no `.env`

### Erro: "Prisma Client not generated"
```bash
cd backend
npm run prisma:generate
```

### Erro: "Module not found"
```bash
# No backend ou frontend
rm -rf node_modules package-lock.json
npm install
```

## 📝 Convenções de Código

- **TypeScript**: Sempre usar tipos explícitos
- **Nomes**: camelCase para variáveis/funções, PascalCase para componentes/classes
- **Estrutura**: Seguir a organização de pastas estabelecida
- **Commits**: Mensagens descritivas em português

## 🤝 Contribuindo

1. Crie uma branch para sua feature: `git checkout -b feature/nova-feature`
2. Faça commit das mudanças: `git commit -m 'Adiciona nova feature'`
3. Push para a branch: `git push origin feature/nova-feature`
4. Abra um Pull Request

## 📄 Licença

Este projeto é privado e propriedade da empresa.

## 👥 Equipe

Desenvolvido para automatizar e otimizar o processo de fabricação de acessórios de moda.

---

**Desenvolvido com ❤️ para otimizar processos e aumentar produtividade**

