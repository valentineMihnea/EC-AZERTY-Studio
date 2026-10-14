# AZERTY Studio — Online store for custom PC keyboards

We sell keyboards, cases, keycaps, switches and accessories.

Developed for the **E-Commerce Course (Semester Project 2026–2027)**.

> **Status: Presentation 1 (Week 3).** This README is the initial version. The requirement table, setup instructions and test accounts will be completed as the project progresses. The final version is delivered at P3.

---
## Team

| Member | Role | Main requirements |
|---|---|---|
| Mihai | Backend and payments lead | A3, A4, A5, A6, A7, A10 |
| Mihnea | Frontend and administration lead | A1, A2, A8, A9, A11, A12 |

---

## Requirements status
 
Codes follow the project specification. Status values: `Planned`, `In progress`, `Done`.
 
### Mandatory
 
| Code | Requirement | Status |
|---|---|---|
| A1 | Product catalog | Planned |
| A2 | Basic search | Planned |
| A3 | Shopping cart | Planned |
| A4 | User accounts | Planned |
| A5 | Checkout | Planned |
| A6 | Sandbox payment | Planned |
| A7 | Stock management | Planned |
| A8 | Order history | Planned |
| A9 | Administration panel | Planned |
| A10 | Basic security | Planned |
| A11 | Responsive design | Planned |
| A12 | Automated tests | Planned |

---


## Technology stack

| Component | Choice |
|---|---|
| Frontend | Next.js (React) + Tailwind CSS + shadcn/ui |
| Backend | Next.js API Routes / Server Actions + Prisma ORM |
| Database | PostgreSQL (in Docker) |
| Payments | Stripe (Test Mode + Stripe CLI) |
| Testing | Vitest / Jest |

The administration panel is written by us, not generated.

---

## AI tools used

- Claude Sonnet 5.5
- Gemini 4 Argon

---

## Project structure

> Planned layout, to be updated as the code grows.

```
.
├── prisma/              # schema, migrations, seed script
├── src/
│   ├── app/             # Next.js pages, API routes and server actions
│   ├── components/      # UI components (shadcn/ui)
│   └── lib/             # database client, Stripe, validation, helpers
├── tests/               # automated tests
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## License and sources

Product descriptions are written by the team. Images are freely licensed or generated. No ready-made e-commerce platforms or store templates are used.
