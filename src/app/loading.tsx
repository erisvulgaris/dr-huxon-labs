/**
 * Root Loading State — premium skeleton shown during route loading.
 * Uses CSS animations (no framer-motion) since this is a server component.
 */
export default function Loading() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background p-6">
      <div className="relative grid h-20 w-20 place-items-center fade-in-up">
        {/* Hexagonal logo mark with CSS spin */}
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          className="animate-spin-slow"
        >
          <path
            d="M24 3l17 9.8v22.4L24 45 7 35.2V12.8L24 3Z"
            stroke="oklch(var(--gold))"
            strokeWidth="1.5"
            strokeLinejoin="round"
            opacity="0.4"
          />
          <path
            d="M24 3l17 9.8"
            stroke="oklch(var(--gold))"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 rounded-full bg-[oklch(var(--gold)/0.15)] blur-xl animate-glow-pulse" />
      </div>

      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="h-3 w-32 rounded-full bg-[oklch(var(--glass-tint)/0.08)] shimmer" />
        <div className="h-2.5 w-24 rounded-full bg-[oklch(var(--glass-tint)/0.06)] shimmer" />
      </div>

      <p className="mt-4 text-[11px] text-muted-foreground fade-in-up">
        Loading premium nutrition…
      </p>
    </div>
  );
}
