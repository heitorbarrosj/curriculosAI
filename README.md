# Curriculo IA

Curriculo IA e um SaaS fullstack para analise, melhoria e otimizacao de curriculos com IA. Ele permite upload de curriculos em PDF, analise ATS, comparacao com vagas usando embeddings, reescrita profissional, chatbot de carreira e exportacao em PDF/DOCX.

## Stack

- Frontend: Next.js, TypeScript, TailwindCSS, Shadcn/UI-style components, Framer Motion, Axios
- Backend: Node.js, Express, TypeScript
- Banco: MySQL
- ORM: Prisma
- Auth: JWT, refresh token, bcrypt
- IA: OpenAI API, GPT-4.1-mini e embeddings
- Upload/PDF: Multer e pdf-parse
- Deploy: Docker e docker-compose

## Estrutura

```txt
curriculoIA
  backend
    prisma
    src
      ai
      controllers
      jobs
      middlewares
      prompts
      repositories
      routes
      services
      utils
      validators
  frontend
    app
    components
    contexts
    hooks
    lib
    providers
    services
```

## Variaveis de ambiente

Copie os exemplos:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

Configure `backend/.env`:

```env
DATABASE_URL="mysql://root:sua_senha@localhost:3306/curriculoia"
PORT=4000
NODE_ENV=development
JWT_ACCESS_SECRET=troque-este-access-secret
JWT_REFRESH_SECRET=troque-este-refresh-secret
JWT_RESET_SECRET=troque-este-reset-secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
OPENAI_API_KEY=sua-chave-openai
OPENAI_MODEL=gpt-4.1-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
FRONTEND_URL=http://localhost:3000
UPLOAD_DIR=uploads
```

## Execucao local

1. Suba o MySQL:

```bash
docker compose up -d mysql
```

2. Backend:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init_mysql
npm run dev
```

3. Frontend:

```bash
cd frontend
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## Docker

Com `.env` configurado:

```bash
docker compose up --build
```

O frontend roda em `http://localhost:3000`, a API em `http://localhost:4000/api` e o MySQL em `localhost:3306`.

## Principais endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/dashboard`
- `POST /api/resumes/upload`
- `GET /api/resumes`
- `GET /api/resumes/:id`
- `POST /api/ats/:resumeId/analyze`
- `POST /api/jobs`
- `POST /api/jobs/:jobId/match/:resumeId`
- `POST /api/improvements/:resumeId`
- `POST /api/chat`
- `GET /api/export/resumes/:resumeId.pdf`
- `GET /api/export/resumes/:resumeId.docx`

## Producao

- Use secrets fortes para JWT.
- Habilite TLS no proxy reverso.
- Configure CORS para o dominio real.
- Persistencia de uploads deve ir para storage externo em ambientes maiores.
- Execute `npx prisma migrate deploy` no deploy.
- Configure observabilidade e backups do MySQL.

