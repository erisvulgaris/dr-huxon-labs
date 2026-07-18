# Engineering Decisions — Dr. Huxon Labs

## Decision 1: Mobile-First Containment (max-width 460px)
- **Context:** Supplement shoppers are predominantly mobile-first. Designing a responsive layout that spans large desktop displays often dilutes high-end aesthetic details.
- **Decision:** Restrict storefront interface to a central vertical layout with `max-w-[460px]`, centered on larger screens.
- **Rationale:** Focuses resources on perfecting mobile-based user journeys, enabling a highly polished, app-like experience.

---

## Decision 2: Zustand Local Persistence with Appwrite Fallback
- **Context:** To ensure instant rendering and minimize loading latency for critical core flows (Cart, Wishlist, settings), we need client-side caching.
- **Decision:** Persist client cart and settings in localStorage via Zustand middleware. Network calls to Appwrite are triggered as background queries with local fallback schemas.
- **Rationale:** Guaranteeing that page transitions remain fluid and checkout works even during flaky network connectivity.

---

## Decision 3: Dokploy + Nginx Proxy Manager Topology
- **Context:** Managing deployment domains, SSL, and network mapping under Docker Swarm configuration.
- **Decision:** Keep NPM on host port `80`/`443` for central reverse proxying and Let's Encrypt validation. Route traffic to Dokploy's internal Traefik listening on alternative port `8085`.
- **Rationale:** Allows deploying separate microservices without port conflicts.
