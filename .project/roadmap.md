# Roadmap — Dr. Huxon Labs

## Current Milestone: Enterprise Production Readiness
Moving the platform from a simulated high-fidelity D2C experience to a production-hardened platform.

---

## Upcoming Milestones

### Milestone 1: Authentication & Access Control (High Priority)
- Integrate NextAuth.js or Appwrite Client SDK session management.
- Guard `/admin` and related subroutes with role-based checks (Admin only).
- Enable customer login/signup for checkout and rewards integration.

### Milestone 2: Payment Integration & Real Checkout (High Priority)
- Integrate Razorpay/UPI gateway.
- Map order status updates to dynamic backend endpoints.
- Secure coupon validations with server-side checks.

### Milestone 3: Image Optimization & Dynamic Assets (Medium Priority)
- Integrate Next.js `<Image>` (SmartImage wrapper) across all grid views and hero components.
- Auto-generate fallback images.

### Milestone 4: Transactional Communications (Medium Priority)
- Configure Twilio SMS / SendGrid Email integrations for notifications.
- Send automated confirmations upon order status changes.

---

## Completed Milestones
- **Phase 1-13 (Core D2C Storefront):** Dark theme, custom button system, 10 home sections, 13 views, 12 overlays, and PWA configuration.
- **Phase 14 (Enterprise Foundations):** 13-section Admin dashboard, security headers, rate limiting, and basic structured data.
