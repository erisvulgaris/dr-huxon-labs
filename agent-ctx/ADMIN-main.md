# Task ID: ADMIN — Admin Panel Build

**Agent:** main (Z.ai Code)
**Task:** Build enterprise-grade Admin Panel at `src/app/admin/page.tsx`

## Work Log

### Files Created / Modified
- **Created** `src/app/admin/page.tsx` — single-file enterprise admin panel (~1,960 lines)
- **Extended** `src/components/icons.tsx` — added 8 admin-specific icons (IconEdit, IconSettings, IconMenu, IconChartBar, IconTag, IconLogout, IconDots, IconRupee) before the ICON_MAP export. All follow the existing 2px-stroke + gold-gradient-defs pattern.

### Sections Built (7 total)

1. **Executive Dashboard** — 7 KPI cards (Revenue Today/Week/Month, Orders Today/Week/Month, Conversion Rate, AOV) with AnimatedNumber count-up + Trend indicators (up/down arrows, jade/red); 7-day revenue bar chart with gold-gradient bars + hover tooltips (formatINR); SVG donut chart for order status distribution (6 segments) with legend; Top 5 products by revenue with horizontal progress bars; Live Signals panel (active sessions, pending orders, OOD, flash sale burn, coupon redemptions) + AI-style Insight callout.

2. **Product Management** — Search input + 5 category filter chips (all/protein/supplement/snack/performance); shadcn Table with image thumbnail, name, category badge, price+MRP, stock status pill, star rating + review count, action buttons (view/edit/delete with toast feedback); Add Product button (visual only, toast); filters work live via React state.

3. **Order Management** — 7 status filter chips with counts; shadcn Table of 12 mock orders (HUX-48xxx series, Indian customer names, cities, channels); expandable rows reveal OrderDetail with line items, fulfilment timeline (5-stage vertical stepper with check nodes), Track/Refund action buttons; StatusBadge component with per-status color tokens.

4. **Customer Analytics** — 4 KPI cards (Total/New this week/Retention/Avg LTV); 7-day acquisition bar chart; Tier distribution (Bronze/Silver/Gold/Platinum) with animated progress bars and accurate member counts; Top Customers table (6 entries) with avatar initials, email, city, order count, tier badge (color-coded), LTV in formatINR.

5. **Inventory Dashboard** — 4 KPI cards (Total Units, Stock Value, Low Stock SKUs, Active SKUs); Low-stock alert banner (amber/red themed) listing affected SKUs as chips; per-SKU table with stock level bar (color shifts: green→amber→red based on threshold), reorder-at threshold, suggested reorder quantity (only shown for low stock), stock value per SKU; Generate PO button.

6. **Marketing/Coupons** — 4 KPI cards (Active Coupons, Redemptions, Coupon Revenue, Active Flash Sales); Active Coupons table (5 coupons: HUXON10, WELCOME500, PLANT15, FLASH25, FREESHIP) with code chip, discount, usage progress bar, revenue impact, status pill; Flash Sales cards (3 sales) with live pulse indicator, countdown, sold/target progress bar; Campaign Performance table (4 campaigns) with channel, reach, conversions, revenue.

7. **Settings** — 4 cards: Store Profile (5 setting rows), Access Control (5 security rows + Run security audit button), Notifications (5 toggle switches with spring-animated thumb), Connected Services (5 integration rows with connect buttons).

### Layout & Design
- **Forced dark theme** via `<div className="dark min-h-[100dvh] bg-background">` wrapper so the admin is always dark regardless of system theme (matches brand spec).
- **Fixed left sidebar** (`hidden lg:block`, w-64) with brand mark, 7 nav items with `layoutId` morph active indicator (gold gradient pill), badge counts, and admin profile card with sign-out.
- **Mobile drawer** (AnimatePresence + spring slide-in from left, w-72) triggered by hamburger in top bar; backdrop click + close button to dismiss.
- **Top bar** (`glass-dark` sticky): hamburger (mobile), breadcrumb (Huxon Labs › Admin), search input with ⌘K kbd hint, notifications bell with red dot, "Back to Store" button (Link to `/`), admin avatar.
- **Main content** (`max-w-[1400px]` mx-auto): AnimatePresence section transitions (fade + 8px y-shift); footer with status indicator ("All systems operational · v2.4.1").
- All cards use `glass` utility from the main design system; gold gradients on accent text/icons; rounded-2xl premium radius; tabular numbers via AnimatedNumber.

### Mock Data (Indian e-commerce context, INR)
- Revenue: ₹3.1L today, ₹17.9L week, ₹68.4L month (with trend deltas)
- 12 realistic Indian orders (Bengaluru/Chennai/Mumbai/Kochi/Hyderabad/Ahmedabad/Pune/Delhi/Jaipur/Mysuru/Mangaluru customers, Web/App channels)
- 6 SKUs with varied stock (42/18/8/64/127/5 — last one is critical-low)
- 5 coupons with usage/limit/revenue (HUXON10, WELCOME500, PLANT15, FLASH25, FREESHIP)
- 3 flash sales, 4 campaigns (New Year Reset, Protein Awareness Week, First-Order Push, Festive Bundle)
- 4,950 customers, tier distribution (Bronze 2847 / Silver 1247 / Gold 612 / Platinum 244)
- 6 top customers with LTV ranging ₹54K–₹1.85L

### Verification
- ✅ `bun run lint` passes clean (exit 0) — fixed 1 error (react-hooks/immutability on donut-chart `acc +=` reassignment, refactored to pure `reduce` accumulator) and 3 warnings (removed unused `eslint-disable-next-line @next/next/no-img-element` directives via sed).
- ✅ `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/admin` → **200** (1003ms initial compile, 67ms warm).
- ✅ HTML contains expected widgets: "Huxon Admin", "Executive Dashboard", "Revenue Today", "Orders Today", "Conversion Rate", "Avg Order Value", "Top 5 by Revenue", "Order Status", "Live Signals", "Best Sellers".
- ✅ No runtime errors in dev.log; no TypeError/ReferenceError/Cannot-read in HTML output.
- ✅ All 8 new icons follow the existing IconProps pattern and gold-gradient defs.

### Key Implementation Notes
- All toast feedback via `sonner`'s `toast` function (SonnerToaster already mounted globally in `src/app/layout.tsx`).
- Uses `formatINR` from `@/lib/catalog` for all currency display.
- Uses `AnimatedNumber` and `Reveal` from `@/components/primitives` for premium count-up animations.
- Uses shadcn `Card`, `Button`, `Badge`, `Input`, `Table` components.
- Charts are custom SVG / motion.div bars (consistent with the science section pattern) — no recharts dependency needed.
- 100% client-side (`"use client"`), all data is mock/seed defined inline in the component.
- "Back to Store" link → `/` (uses Next.js `<Link>`).
- Fully responsive: sidebar collapses to drawer below `lg`, KPI grid is 2-col on mobile / 4-col on desktop, tables scroll horizontally.
