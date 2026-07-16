# Changelog — Dr. Huxon Labs

All notable changes to the Dr. Huxon Labs e-commerce storefront are documented below.

## [Unreleased] - 2026-07-16

### Added
- Created `useSettings` Zustand store in `src/lib/store.ts` for managing application-level preferences, specifically the social proof toast interval (defaulting to 30s) and enabled state.
- Implemented a **CRO & Popups** control card inside the Admin panel settings tab (`src/app/admin/page.tsx`) with a slider and switch to configure social proof toast.
- Added Profile sub-tabs (Dashboard, Wellness, and Rewards) inside `src/components/views/profile.tsx` with a premium sliding-underline animated tab switcher.
- Configured dynamic viewport locks in `src/components/app-shell.tsx` `useEffect` hook (`overflow: hidden` on `html` and `body` when storefront is mounted, restored on unmount) to prevent page-level conflicts with app shell scrolling.

### Changed
- Shifted the **Explore** (Wellness) and **Rewards** views from the bottom navigation bar and mapped them inside the **Profile** sub-tab layout.
- Constrained `AppShell` main container to `h-[100dvh]` to enable perfect scroll delegation within the `main` tag.
- Modified Hero Showcase container in `src/components/sections/hero.tsx` from `touch-none` to `touch-pan-y` to allow vertical touch-dragging for smooth mobile scrolling.

### Removed
- Removed the Onboarding Tour popup (`OnboardingTour`) from the main page.
- Removed the Cookie Consent disclaimer popup (`CookieConsent`) from the main page.
- Removed the PWA Install prompt (`PWAInstallPrompt`) from the main page.
