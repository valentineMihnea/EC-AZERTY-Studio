# AZERTY Studio - Online store for custom PC keyboards

We sell keyboards, cases, keycaps, switches and accessories.

---

## Team

| Member | Role                             | Main requirements        |
| ------ | -------------------------------- | ------------------------ |
| Mihai  | Backend and payments lead        | A3, A4, A5, A6, A7, A10  |
| Mihnea | Frontend and administration lead | A1, A2, A8, A9, A11, A12 |

---

## Requirements status

Codes follow the project specification. Status values: `Planned`, `In progress`, `Done`.

### Mandatory

| Code | Requirement          | Status      |
| ---- | -------------------- | ----------- |
| A1   | Product catalog      | Done        |
| A2   | Basic search         | Done        |
| A3   | Shopping cart        | Planned     |
| A4   | User accounts        | Done        |
| A5   | Checkout             | Planned     |
| A6   | Sandbox payment      | Planned     |
| A7   | Stock management     | Planned     |
| A8   | Order history        | Planned     |
| A9   | Administration panel | Planned     |
| A10  | Basic security       | Planned     |
| A11  | Responsive design    | Planned     |
| A12  | Automated tests      | In progress |

---

## Technology stack

| Component | Choice                                           |
| --------- | ------------------------------------------------ |
| Frontend  | Next.js (React 19) + Tailwind CSS + shadcn/ui    |
| Backend   | Next.js API Routes / Server Actions + Prisma ORM |
| Database  | PostgreSQL (in Docker)                           |
| Payments  | Stripe (Test Mode + Stripe CLI)                  |
| Testing   | Vitest                                           |

---

## Getting Started

### 1. Environment & Database

```bash
# Copy environment configuration
cp .env.example .env

# Start PostgreSQL database with Docker
docker compose up -d db

# Push Prisma schema and seed 35 keyboard products
npx prisma db push
npm run db:seed
```

### 2. Run Tests (A12)

```bash
npm test
```

### 3. Run Development Server

```bash
npm run dev
# Open http://localhost:3000
```

---

## Specification Documents (Weeks 4–5 Deliverables)

- [API Endpoints Specification](docs/api-specification.md)
- [UI Wireframes & Component Blueprints](docs/wireframes.md)

---

## AI tools used

- Claude Sonnet 5.5
- Gemini 4 Argon
- Gemini 3.8 Flash
- Antigravity Coding Assistant

---

## License and sources

Product descriptions are written by the team. Images are freely licensed or generated. No ready-made e-commerce platforms or store templates are used.
