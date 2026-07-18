# Technical Debt — Dr. Huxon Labs

## 1. Mock Data in Admin Panel
- **Description:** The admin dashboard, orders list, and customer profiles use mock data objects stored inside `src/app/admin/page.tsx`.
- **Mitigation:** Re-wire tables to query the Appwrite/Prisma database dynamically.

---

## 2. Hardcoded OKLCH Background Values
- **Description:** In some legacy custom components, hardcoded OKLCH opacity overrides are used.
- **Mitigation:** Unify all colors under css variables (`oklch(var(--glass-tint)...)`) to make dark-light switching completely clean.

---

## 3. SQLite Database Setup
- **Description:** SQLite database schema is defined in `prisma/schema.prisma` but not fully utilized for production queries (fallback handles data storage).
- **Mitigation:** Set up Postgres or Appwrite database collections and migrate client states.
