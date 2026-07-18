# Risk Log — Dr. Huxon Labs

## 1. Simulated Checkout Vulnerability
- **Description:** Order database updates are simulated. If deployed in production without real Razorpay integration, users might bypass billing.
- **Severity:** High
- **Mitigation:** Require transaction verification IDs from Razorpay before persisting order states.

---

## 2. Admin Authentication Bypass
- **Description:** Anyone browsing `/admin` has read/write privileges over products and orders.
- **Severity:** Critical
- **Mitigation:** Gating the layout.tsx in the `/admin` folder with an auth middleware check.

---

## 3. Appwrite Data Limits
- **Description:** Fallback query mechanisms work under local storage constraints, but syncing massive analytics logs could hit limit caps.
- **Severity:** Medium
- **Mitigation:** Rollup logs daily to keep the Appwrite collections optimized.
