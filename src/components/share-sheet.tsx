"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNav } from "@/lib/store";
import { PRODUCTS, formatINR, discountPercent } from "@/lib/catalog";
import {
  IconClose,
  IconShare,
  IconCopy,
  IconCheck,
  IconArrowUpRight,
  IconHeart,
  IconBolt,
  IconCompare,
} from "@/components/icons";
import { Pill } from "@/components/primitives";
import { useWishlist } from "@/lib/store";

/**
 * ShareSheet — premium bottom sheet for sharing a product.
 * Supports native Web Share API, copy link, and social channels.
 */
// Inline escape-to-close hook
function useEscapeClose(isOpen: boolean, onClose: () => void) {
  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);
}

export function ShareSheet() {
  const { shareProductId, setShareProductId } = useShareSheetState();
  const product = PRODUCTS.find((p) => p.id === shareProductId);
  useEscapeClose(!!shareProductId, () => setShareProductId(null));
  const isOpen = !!product;
  const [copied, setCopied] = React.useState(false);

  const shareUrl = product
    ? `https://drhuxon.com/p/${product.slug}`
    : "https://drhuxon.com";
  const shareText = product
    ? `Check out ${product.name} — ${product.tagline}. Only ${formatINR(product.price)} at Dr. Huxon Labs.`
    : "";

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: shareText,
          url: shareUrl,
        });
        setShareProductId(null);
      } catch {
        // user cancelled
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShareProductId(null);
      }, 1500);
    } catch {
      // fallback
    }
  };

  return (
    <AnimatePresence>
      {isOpen && product ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShareProductId(null)}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-md"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 flex w-full max-w-[460px] flex-col overflow-hidden rounded-t-[28px] border-t border-border bg-background"
          >
            <div className="mx-auto my-3 h-1 w-10 rounded-full bg-[oklch(var(--glass-border)/0.2)]" />
            <button
              onClick={() => setShareProductId(null)}
              aria-label="Close"
              className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full glass"
            >
              <IconClose size={16} />
            </button>

            <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-8">
              {/* Product preview */}
              <div className="flex items-center gap-3 rounded-2xl glass p-3">
                <div className="relative h-14 w-14 shrink-0">
                  <div
                    className="absolute inset-0 rounded-full blur-md"
                    style={{ background: `${product.accent.replace(")", " / 0.3)")}` }}
                  />
                  <img
                    src={product.heroImage}
                    alt={product.name}
                    className="relative h-full w-full object-contain"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.opacity = "0";
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold text-cream-gradient">
                    {product.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {formatINR(product.price)} · {product.proteinGrams}g protein
                  </div>
                </div>
              </div>

              {/* Native share button (prominent) */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleNativeShare}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[oklch(var(--gold))] to-[oklch(var(--bronze))] py-3.5 text-[14px] font-semibold text-[oklch(var(--charcoal))] shadow-gold"
              >
                <IconShare size={16} />
                Share via…
              </motion.button>

              {/* Copy link */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleCopy}
                className="mt-2.5 flex w-full items-center justify-between rounded-2xl glass p-3.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-[oklch(var(--glass-tint)/0.08)]">
                    {copied ? (
                      <IconCheck size={15} className="text-[oklch(var(--jade))]" />
                    ) : (
                      <IconCopy size={14} />
                    )}
                  </span>
                  <div className="text-left">
                    <div className="text-[12px] font-semibold">
                      {copied ? "Link copied!" : "Copy link"}
                    </div>
                    <div className="max-w-[180px] truncate text-[10px] text-muted-foreground">
                      {shareUrl}
                    </div>
                  </div>
                </div>
              </motion.button>

              {/* Social channels */}
              <div className="mt-4">
                <div className="mb-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                  Share to
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {SOCIAL_CHANNELS.map((ch) => (
                    <motion.button
                      key={ch.id}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => {
                        if (ch.id === "native") handleNativeShare();
                        else handleCopy();
                      }}
                      className="flex flex-col items-center gap-1.5 rounded-2xl glass p-3"
                    >
                      <span
                        className="grid h-10 w-10 place-items-center rounded-full"
                        style={{ background: `${ch.color}20`, color: ch.color }}
                      >
                        <ch.Icon size={18} />
                      </span>
                      <span className="text-[9px] text-muted-foreground">{ch.label}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className="mt-4 flex gap-2">
                <QuickAction
                  icon={<IconHeart size={13} />}
                  label="Wishlist"
                  onClick={() => {
                    useWishlist.getState().toggle(product.id);
                    setShareProductId(null);
                  }}
                />
                <QuickAction
                  icon={<IconCompare size={13} />}
                  label="Compare"
                  onClick={() => {
                    useNav.getState().toggleCompare(product.id);
                    setShareProductId(null);
                  }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-1 items-center justify-center gap-1.5 rounded-full glass py-2.5 text-[11px] font-medium text-muted-foreground"
    >
      {icon}
      {label}
    </button>
  );
}

// Social channel definitions with inline SVG brand icons
const SOCIAL_CHANNELS = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    color: "oklch(0.62 0.18 145)",
    Icon: ({ size = 18 }: { size?: number }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.7.8-2.7-.2-.3A8 8 0 1 1 12 20Zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.1-.3.2-.5.1-.7-.3-1.4-.6-2-1.3-.4-.4-.7-.9-.9-1.4-.1-.2 0-.4.1-.5l.4-.4.2-.4v-.3c0-.1-.5-1.3-.7-1.7-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.4c.1.2 1.6 2.5 4 3.4.5.2 1 .4 1.3.4.5.1 1 .1 1.3 0 .4-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    label: "Instagram",
    color: "oklch(0.62 0.20 350)",
    Icon: ({ size = 18 }: { size?: number }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: "twitter",
    label: "X",
    color: "oklch(0.95 0 0)",
    Icon: ({ size = 18 }: { size?: number }) => (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 3h3l-7 8 8 10h-6l-5-6-5 6H3l7-9L3 3h6l4 5 5-5Z" />
      </svg>
    ),
  },
  {
    id: "native",
    label: "More",
    color: "oklch(0.78 0.13 75)",
    Icon: IconArrowUpRight,
  },
] as const;

// Hook to access share sheet state from the nav store
function useShareSheetState() {
  const shareProductId = useNav((s) => (s as any).shareProductId ?? null);
  const setShareProductId = useNav(
    (s) => (s as any).setShareProductId ?? (() => {})
  );
  return { shareProductId, setShareProductId };
}
