# Requirements — Dr. Huxon Labs

## Storefront Features & User Requirements
1. **Interactive Hero Section:** Premium plant particles, gyroscope rotation, protein ring score, and clean CTAs.
2. **Product Catalog & Filters:** Shop grid with category-specific chips and filter/sort options.
3. **Immersive Product Detail View (PDP):** Image previews with fallback, review ratings, weekly use guide, and Q&A accordions.
4. **Local Cart & Checkout:** Persistent cart drawer with multi-step validated form (phone, OTP, name, address, pincode).
5. **Wellness Widgets (Explore View):** Daily water tracker, sleep logs, and calculated protein goals.
6. **Gamified Rewards System:** Interactive streaks, challenges, points ledger, and referral multipliers.

---

## Admin Dashboard Requirements
1. **Analytics:** Traffic indicators, daily orders, conversion funnels.
2. **Catalog Management:** Add, edit, bulk select, and delete products, with dynamic CSV exports.
3. **Fulfillment Queue:** Order status trackers (Processing, Shipped, Delivered) with timelines.
4. **Moderation Queue:** Customer reviews approval/moderation with star limits.
5. **Financial Accounting:** State-wise GST calculations (CGST, SGST, IGST) and tax report print sheets.

---

## Security & Performance Requirements
- **Secure Headers:** Strict HSTS, frame options, and MIME-type sniffing locks on all routes.
- **API Rate Limiting:** Exclude health endpoints, limit other routes to 100 requests per minute per IP.
- **Image Performance:** Lazy load images using optimized file formats (AVIF/WebP).
- **Lighthouse Gates:** Mobile LCP < 2.5s, accessibility score >= 95, and dynamic content accessibility (ARIA).
