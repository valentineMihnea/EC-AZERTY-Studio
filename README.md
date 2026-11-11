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

### Bonus Features (Approved & Frozen at P2)

| Code | Bonus Feature        | Points | Status      |
| ---- | -------------------- | ------ | ----------- |
| B1   | Filtered search      | 5      | In progress |
| B2   | Recommendations      | 4      | Planned     |
| B4   | Sales dashboard      | 3      | Planned     |
| B5   | Discount codes       | 3      | Planned     |
| B6   | Transactional email  | 5      | Planned     |
| **Total** | **Max Bonus Capped** | **20** |             |

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

## Deliverables & Documentation

- **Presentation 1 (Week 3)**: [AZERTY Studio - Presentation 1.pdf](../AZERTY%20Studio%20-%20Presentation%201.pdf) (Git tag `P1`)
- **Presentation 2 (Week 7)**: [AZERTY Studio - Presentation 2.pdf](../AZERTY%20Studio%20-%20Presentation%202.pdf) (Git tag `P2`)
- **Specification Document (Week 7)**: [AZERTY Studio - Specification Document.pdf](../docs/AZERTY%20Studio%20-%20Specification%20Document.pdf)
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
