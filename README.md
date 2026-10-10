# Skincare Ecommerce

Single-brand skincare ecommerce skill-test project. Vue 3 + TypeScript
frontend, Express + TypeScript backend (controller → service → repository,
Prisma ORM), MySQL. Dummy payment only — see `PRD_Skincare_Ecommerce.pdf`
for the full spec.

## Local setup (without Docker)

```bash
# 1. Start MySQL (adjust to your own instance, or use docker-compose up mysql)
docker compose up -d mysql

# 2. Backend
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev        # http://localhost:4000

# 3. Frontend (new terminal)
cd frontend
cp .env.example .env
npm install
npm run dev         # http://localhost:5173
```

## Local setup (Docker Compose, all services)

```bash
docker compose up --build
```

## Seeded accounts

| Role     | Email                 | Password      |
|----------|------------------------|---------------|
| Admin    | admin@skincare.test    | Admin123!     |
| Customer | dinda@skincare.test    | Customer123!  |

## Architecture

```
frontend (Vue 3 SPA) -> backend (Express REST API) -> MySQL
                         routes -> controller -> service -> repository (Prisma)
```

`backend/src/modules/orders/payment.service.ts` isolates the dummy payment
simulation behind a `PaymentService` interface so a real gateway can be
swapped in later without touching checkout business logic.
