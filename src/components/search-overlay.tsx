"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearch } from "@/lib/store";
import { PRODUCTS } from "@/lib/catalog";

// Inline escape key hook
function useEscapeKey(isOpen: boolean, onClose: () => void) {
  React.useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);
}
import { HuxonButton } from "@/components/huxon-button";
import {
  IconClose,
  IconSearch,
  IconMic,
  IconCamera,
  IconArrowRight,
  IconClock,
  IconFlame,
  IconStar,
  IconTrending,
} from "@/components/icons";
import { StarRating, Pill } from "@/components/primitives";
import { useCart, useNav } from "@/lib/store";

const TRENDING = ["Gold Isolate", "Plant protein", "Pre-workout", "Recovery", "Vegan BCAA"];
const POPULAR = ["High protein bars", "Curcumin", "Ashwagandha KSM-66", "Daily greens"];

export function SearchOverlay() {
  const { isOpen, close } = useSearch();
  const overlayRef = React.useRef<HTMLDivElement>(null);
  useEscapeKey(isOpen, close);
  const [q, setQ] = React.useState("");
  const [recent, setRecent] = React.useState<string[]>([
    "Gold Isolate",
    "Protein bars",
    "Recovery Matrix",
  ]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      setQ("");
    }
  }, [isOpen]);

  const results = q
    ? PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.tagline.toLowerCase().includes(q.toLowerCase()) ||
          p.category.toLowerCase().includes(q.toLowerCase())
      )
    : [];

  const commitSearch = (term: string) => {
    if (!term.trim()) return;
    setRecent((r) => [term, ...r.filter((x) => x !== term)].slice(0, 5));
    setQ(term);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 mx-auto flex max-w-[460px] flex-col bg-background"
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-4 pt-safe pb-3">
            <div className="flex flex-1 items-center gap-2 rounded-full glass px-4 py-2.5">
              <IconSearch size={16} className="text-muted-foreground" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitSearch(q);
                }}
                placeholder="Search products, ingredients..."
                className="flex-1 bg-transparent text-[14px] placeholder:text-muted-foreground/70 focus:outline-none"
              />
              {q ? (
                <button onClick={() => setQ("")} aria-label="Clear">
                  <IconClose size={14} className="text-muted-foreground" />
                </button>
              ) : null}
            </div>
            <button
              onClick={close}
              className="text-[13px] font-medium text-muted-foreground"
            >
              Cancel
            </button>
          </div>

          {/* Quick input modes */}
          <div className="flex gap-2 px-4 pb-3">
            <QuickMode icon={<IconMic size={14} />} label="Voice" />
            <QuickMode icon={<IconCamera size={14} />} label="Visual" />
          </div>

          {/* Content */}
          <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-8">
            {q ? (
              <SearchResults results={results} onPick={commitSearch} />
            ) : (
              <>
                {/* Recent */}
                {recent.length ? (
                  <section className="mb-5">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                        Recent
                      </span>
                      <button
                        onClick={() => setRecent([])}
                        className="text-[11px] text-muted-foreground"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recent.map((r) => (
                        <button
                          key={r}
                          onClick={() => commitSearch(r)}
                          className="flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-[12px]"
                        >
                          <IconClock size={11} className="text-muted-foreground" />
                          {r}
                        </button>
                      ))}
                    </div>
                  </section>
                ) : null}

                {/* Trending */}
                <section className="mb-5">
                  <div className="mb-2 flex items-center gap-1.5">
                    <IconFlame size={12} className="text-[oklch(0.72_0.18_25)]" />
                    <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Trending now
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {TRENDING.map((t) => (
                      <button
                        key={t}
                        onClick={() => commitSearch(t)}
                        className="rounded-full border border-[oklch(0.78_0.13_75_/_0.25)] bg-[oklch(0.78_0.13_75_/_0.08)] px-3 py-1.5 text-[12px] text-text-gold"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Popular */}
                <section className="mb-5">
                  <div className="mb-2 flex items-center gap-1.5">
                    <IconTrending size={12} className="text-[oklch(0.62_0.10_160)]" />
                    <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                      Popular products
                    </span>
                  </div>
                  <div className="space-y-2">
                    {PRODUCTS.slice(0, 3).map((p) => (
                      <PopularRow key={p.id} product={p} onPick={() => commitSearch(p.name)} />
                    ))}
                  </div>
                </section>

                {/* Smart recommendations */}
                <section>
                  <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                    Smart recommendations
                  </div>
                  <div className="rounded-2xl glass p-3 text-[12px] text-muted-foreground">
                    Based on your activity, you might like{" "}
                    <button
                      onClick={() => commitSearch("Recovery")}
                      className="font-medium text-text-gold underline-offset-2 hover:underline"
                    >
                      Recovery Matrix
                    </button>{" "}
                    for post-workout.
                  </div>
                </section>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function QuickMode({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-[11px] font-medium text-foreground/80">
      {icon}
      {label}
    </button>
  );
}

function PopularRow({
  product,
  onPick,
}: {
  product: (typeof PRODUCTS)[number];
  onPick: () => void;
}) {
  const { addItem } = useCart();
  const { setQuickView } = useNav();
  return (
    <div className="flex items-center gap-3 rounded-2xl glass p-2.5">
      <button onClick={() => setQuickView(product.id)} className="flex flex-1 items-center gap-3 text-left">
        <div className="relative h-12 w-12 shrink-0">
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
          <div className="truncate text-[13px] font-semibold">{product.name}</div>
          <div className="flex items-center gap-2">
            <StarRating value={product.rating} size={9} />
            <span className="text-[10px] text-muted-foreground">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </button>
      <button
        onClick={() => addItem(product)}
        className="grid h-8 w-8 place-items-center rounded-full bg-[oklch(0.78_0.13_75_/_0.16)] text-text-gold"
        aria-label="Add to cart"
      >
        <IconArrowRight size={14} />
      </button>
    </div>
  );
}

function SearchResults({
  results,
  onPick,
}: {
  results: (typeof PRODUCTS)[number][];
  onPick: (s: string) => void;
}) {
  if (!results.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full glass">
          <IconSearch size={24} className="text-muted-foreground" />
        </div>
        <p className="mt-4 text-[14px] font-medium">No matches found</p>
        <p className="mt-1 text-[12px] text-muted-foreground">
          Try a different term or browse trending.
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        {results.length} result{results.length > 1 ? "s" : ""}
      </div>
      {results.map((p) => (
        <PopularRow key={p.id} product={p} onPick={() => onPick(p.name)} />
      ))}
    </div>
  );
}
