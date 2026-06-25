"use client";

import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  active?: boolean;
};

const base = (size = 24): React.SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  xmlns: "http://www.w3.org/2000/svg",
});

/**
 * Dr. Huxon Labs — custom icon system.
 * Every icon hand-built with rounded precision, premium proportions,
 * and a consistent 2px stroke language. Icons morph between
 * inactive (outline) and active (filled) states via the `active` prop.
 */

const stroke = (active?: boolean) =>
  active ? "url(#huxon-gold)" : "currentColor";

function Defs() {
  return (
    <defs>
      <linearGradient id="huxon-gold" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="oklch(0.92 0.10 85)" />
        <stop offset="0.5" stopColor="oklch(0.78 0.13 75)" />
        <stop offset="1" stopColor="oklch(0.62 0.10 55)" />
      </linearGradient>
      <linearGradient id="huxon-gold-soft" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="oklch(0.92 0.10 85)" stopOpacity="0.6" />
        <stop offset="1" stopColor="oklch(0.62 0.10 55)" stopOpacity="0.6" />
      </linearGradient>
    </defs>
  );
}

export function IconHome({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <Defs />
      <path
        d="M4 11.5L12 4l8 7.5V19a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1v-7.5Z"
        stroke={stroke(active)}
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={active ? "url(#huxon-gold-soft)" : "none"}
      />
    </svg>
  );
}

export function IconShop({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <Defs />
      <path
        d="M5 8h14l-1 12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 8Z"
        stroke={stroke(active)}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={active ? "url(#huxon-gold-soft)" : "none"}
      />
      <path
        d="M9 8V6a3 3 0 0 1 6 0v2"
        stroke={stroke(active)}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconExplore({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <Defs />
      <circle cx="12" cy="12" r="8.5" stroke={stroke(active)} strokeWidth="1.8" />
      <path
        d="M14.8 9.2l-1.6 4.4-4.4 1.6 1.6-4.4 4.4-1.6Z"
        stroke={stroke(active)}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={active ? "url(#huxon-gold)" : "none"}
      />
    </svg>
  );
}

export function IconRewards({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <Defs />
      <path
        d="M5 8.5h14v3a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4v-3Z"
        stroke={stroke(active)}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={active ? "url(#huxon-gold-soft)" : "none"}
      />
      <path
        d="M9 8.5V7a3 3 0 0 1 6 0v1.5"
        stroke={stroke(active)}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9 18l1.2-2.5M15 18l-1.2-2.5"
        stroke={stroke(active)}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconCart({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <Defs />
      <path
        d="M3.5 5h2l1.2 2m0 0L8 13a1.5 1.5 0 0 0 1.5 1.2h6.3a1.5 1.5 0 0 0 1.5-1.2l1.4-5.2H6.7Z"
        stroke={stroke(active)}
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill={active ? "url(#huxon-gold-soft)" : "none"}
      />
      <circle cx="9.5" cy="18" r="1.3" fill={stroke(active)} />
      <circle cx="16.5" cy="18" r="1.3" fill={stroke(active)} />
    </svg>
  );
}

export function IconProfile({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <Defs />
      <circle cx="12" cy="8.5" r="3.5" stroke={stroke(active)} strokeWidth="1.8" fill={active ? "url(#huxon-gold-soft)" : "none"} />
      <path
        d="M5 19a7 7 0 0 1 14 0"
        stroke={stroke(active)}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconSearch({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <Defs />
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16 16l4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconHeart({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <Defs />
      <path
        d="M12 20s-7-4.3-7-9.5C5 7.5 7 6 9 6c1.5 0 2.5 1 3 2 .5-1 1.5-2 3-2 2 0 4 1.5 4 4.5C19 15.7 12 20 12 20Z"
        stroke={active ? stroke(true) : "currentColor"}
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill={active ? "url(#huxon-gold)" : "none"}
      />
    </svg>
  );
}

export function IconBell({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2H4.5L6 16Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconClose({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconChevronRight({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconChevronDown({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconArrowRight({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconArrowLeft({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconArrowDown({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M12 5v14M6 13l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconArrowUpRight({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPlus({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconMinus({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconCheck({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconStar({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <Defs />
      <path
        d="M12 4l2.4 5 5.6.8-4 3.9 1 5.6L12 17l-5 2.3 1-5.6-4-3.9 5.6-.8L12 4Z"
        fill={active ? "url(#huxon-gold)" : "none"}
        stroke={active ? stroke(true) : "currentColor"}
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconMic({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="9" y="4" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6 12a6 6 0 0 0 12 0M12 18v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconCamera({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M4 8.5h3l1.5-2h7L17 8.5h3V18H4V8.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="13" r="3.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function IconFlask({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M9 3h6M10 3v6L5 18a2 2 0 0 0 1.8 3h10.4A2 2 0 0 0 19 18l-5-9V3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M7.5 14h9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconDumbbell({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M3 9v6M6 7v10M18 7v10M21 9v6M6 12h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconLotus({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M12 6c2 3 2 6 0 9-2-3-2-6 0-9ZM12 15c-3-1-5-3-6-6 3 0 5 2 6 6ZM12 15c3-1 5-3 6-6-3 0-5 2-6 6ZM5 16c2 2 5 3 7 3s5-1 7-3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function IconLeaf({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M5 19C5 11 11 5 19 5c0 8-6 14-14 14Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 15c2-2 4-3 7-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconShield({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6l7-3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconGlobe({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3.5 12h17M12 3.5c2.5 2.5 2.5 14.5 0 17M12 3.5c-2.5 2.5-2.5 14.5 0 17" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function IconCertificate({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="9" r="5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9 13l-2 8 5-3 5 3-2-8" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSprout({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M12 20v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path
        d="M12 13c0-3 2-5 6-5 0 3-2 5-6 5ZM12 11c0-3-2-5-6-5 0 3 2 5 6 5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconBlend({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M5 8h14l-1.5 11a1 1 0 0 1-1 1H7.5a1 1 0 0 1-1-1L5 8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9 8V6h6v2M9 13h6M9 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconPackage({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M4 7.5L12 12l8-4.5M12 12v9" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function IconScan({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M4 12h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function IconTruck({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M3 7h10v9H3V7ZM13 10h4l3 3v3h-7" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="7" cy="18" r="1.8" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17" cy="18" r="1.8" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function IconSpark({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconFlame({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M12 3c1 3-1 4-1 6 0-2-2-3-2-5 0 0-3 2-3 6a6 6 0 0 0 12 0c0-4-3-5-3-7 0 0-2 1-3 0Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconCrown({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M4 8l4 4 4-6 4 6 4-4-1.5 10h-13L4 8Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function IconUsers({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 19a6 6 0 0 1 12 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M16 6.5a3 3 0 0 1 0 5.8M21 19a6 6 0 0 0-4-5.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function IconRefresh({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M4 12a8 8 0 0 1 13.5-5.8L20 8M20 4v4h-4M20 12a8 8 0 0 1-13.5 5.8L4 16M4 20v-4h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconDrop({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M12 3c3 4 5 6.5 5 9.5A5 5 0 0 1 7 12.5C7 9.5 9 7 12 3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function IconBolt({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M13 3L5 13h6l-1 8 8-10h-6l1-8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function IconTarget({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

export function IconTrophy({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M7 4h10v4a5 5 0 0 1-10 0V4Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M7 6H4v1a4 4 0 0 0 4 4M17 6h3v1a4 4 0 0 1-4 4M9 14h6M10 18h4M12 14v4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconGift({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M4 11h16v8H4v-8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M4 8h16v3H4V8ZM12 8v11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 8S10 4 8 4s-2 4 4 4ZM12 8s2-4 4-4 2 4-4 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function IconLogo({ size = 32, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <Defs />
      {/* Stylized H monogram inside a hexagon — molecular precision */}
      <path
        d="M12 2.5l8.2 4.7v9.6L12 21.5 3.8 16.8V7.2L12 2.5Z"
        stroke="url(#huxon-gold)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        fill="oklch(0.78 0.13 75 / 0.08)"
      />
      <path
        d="M8.5 8.5v7M15.5 8.5v7M8.5 12h7"
        stroke="url(#huxon-gold)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="1.2" fill="url(#huxon-gold)" />
    </svg>
  );
}

export function IconLock({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="5" y="10" width="14" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="15" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function IconFilter({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconGrid({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function IconLocation({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M12 21s-6-5.5-6-11a6 6 0 0 1 12 0c0 5.5-6 11-6 11Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function IconClock({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function IconCopy({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function IconShare({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <circle cx="6" cy="12" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="18" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="18" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 11l8-4M8 13l8 4" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function IconWheat({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M12 21V8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M12 9c-2 0-3.5-1.5-3.5-3.5C10.5 5.5 12 7 12 9ZM12 9c2 0 3.5-1.5 3.5-3.5C13.5 5.5 12 7 12 9ZM12 14c-2 0-3.5-1.5-3.5-3.5C10.5 10.5 12 12 12 14ZM12 14c2 0 3.5-1.5 3.5-3.5C13.5 10.5 12 12 12 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

export function IconEye({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function IconTrash({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M5 7h14M10 7V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2M7 7l1 12a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconTrending({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path d="M4 16l5-5 3 3 7-7M16 7h4v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconQuote({ size = 24, active, ...p }: IconProps) {
  return (
    <svg {...base(size)} {...p}>
      <path
        d="M10 7c-3 1-5 3.5-5 7v3h5v-5H7c0-2 1.5-3.5 3.5-4.2L10 7ZM19 7c-3 1-5 3.5-5 7v3h5v-5h-3c0-2 1.5-3.5 3.5-4.2L19 7Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const ICON_MAP: Record<string, React.FC<IconProps>> = {
  flask: IconFlask,
  dumbbell: IconDumbbell,
  lotus: IconLotus,
  leaf: IconLeaf,
  shield: IconShield,
  globe: IconGlobe,
  check: IconCheck,
  certificate: IconCertificate,
  sprout: IconSprout,
  blend: IconBlend,
  package: IconPackage,
  scan: IconScan,
  truck: IconTruck,
  spark: IconSpark,
  flame: IconFlame,
  crown: IconCrown,
  star: IconStar,
  users: IconUsers,
  refresh: IconRefresh,
};
