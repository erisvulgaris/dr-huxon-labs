# Gaps & Deviations — Dr. Huxon Labs

Below is the log of gaps, deviations, and deferred requirements identified in the current platform implementation:

---

## 1. Authentication & Role-Based Access Control (RBAC) `[INFERRED]`
- **Gap:** The Admin Panel at `/admin` is currently fully accessible to any visitor. There is no session guard or admin check.
- **Impact:** High security risk. Production deployment requires NextAuth.js or Appwrite Session configuration with role checks.
- **Status:** Banned/Deferred (Demo mode).

---

## 2. Dynamic Admin Data Fetching `[INFERRED]`
- **Gap:** The admin panel sections (analytics, orders, customers, reviews) render using hardcoded mock states from client side instead of pulling from the Appwrite/Prisma database.
- **Impact:** Administrative updates to inventory or product listings will not reflect in the storefront catalog.
- **Status:** Pending.

---

## 3. Real Payment Gateway Integration `[INFERRED]`
- **Gap:** The checkout flow in the cart drawer simulates payment completion. No real PG (Razorpay, PayU, or UPI Intent) is wired.
- **Impact:** Inability to collect payments.
- **Status:** Pending.

---

## 4. Transactional Notifications `[INFERRED]`
- **Gap:** No backend SMS/Email dispatching mechanism.
- **Impact:** Customers do not receive order confirmations, shipping tracking numbers, or abandoned cart recovery triggers beyond standard toast notifications.
- **Status:** Pending.

---

## 5. Offline PWA Capabilities `[INFERRED]`
- **Gap:** The `manifest.json` and icons are configured, but no custom Service Worker is registered to handle asset precaching or offline cart queue processing.
- **Impact:** Reduced reliability under spotty mobile network conditions.
- **Status:** Pending.
