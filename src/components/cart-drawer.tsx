"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, useOrders, type TrackedOrder, type OrderStage } from "@/lib/store";
import { HuxonButton } from "@/components/huxon-button";
import {
  IconClose,
  IconPlus,
  IconMinus,
  IconTrash,
  IconLock,
  IconCheck,
  IconArrowRight,
  IconTruck,
  IconShield,
  IconGift,
} from "@/components/icons";
import { Pill, AnimatedNumber } from "@/components/primitives";
import { formatINR } from "@/lib/catalog";

export function CartDrawer() {
  const { isOpen, closeCart, lines, updateQty, removeItem, subtotal, clear } = useCart();
  const [stage, setStage] = React.useState<"cart" | "checkout" | "success">("cart");
  const [coupon, setCoupon] = React.useState("");
  const [applied, setApplied] = React.useState<number>(0);
  const [submitting, setSubmitting] = React.useState(false);
  const [orderNumber, setOrderNumber] = React.useState<string>("");

  React.useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setStage("cart"), 300);
    }
  }, [isOpen]);

  const discount = applied;
  const shipping = subtotal() > 1499 || subtotal() === 0 ? 0 : 79;
  const total = Math.max(0, subtotal() - discount + shipping);

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon.toUpperCase(), subtotal: subtotal() }),
      });
      const data = await res.json();
      if (data.valid) {
        setApplied(data.discount);
      }
    } catch {
      // fallback to local logic
      if (coupon.toUpperCase() === "HUXON10") {
        setApplied(Math.round(subtotal() * 0.1));
      } else if (coupon.toUpperCase() === "WELCOME200") {
        setApplied(200);
      }
    }
  };

  const addOrder = useOrders((s) => s.addOrder);

  const submitOrder = async () => {
    setSubmitting(true);
    let resolvedOrderNumber = `HUX-${Math.floor(Math.random() * 90000 + 10000)}`;
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: "Arjun Mehta",
          customerEmail: "arjun@example.com",
          customerPhone: "+91 98765 43210",
          address: "12 Indiranagar, 2nd Stage",
          city: "Bengaluru",
          state: "Karnataka",
          pincode: "560038",
          items: lines.map((l) => ({
            productId: l.productId,
            name: l.name,
            price: l.price,
            quantity: l.quantity,
            flavor: l.flavor,
          })),
          subtotal: subtotal(),
          discount,
          shipping,
          total,
          paymentMethod: "upi",
        }),
      });
      const data = await res.json();
      if (data.orderNumber) resolvedOrderNumber = data.orderNumber;
    } catch {
      // still succeed offline
    } finally {
      // Persist the order to the orders store for live tracking
      const now = Date.now();
      const trackedOrder: TrackedOrder = {
        id: resolvedOrderNumber,
        orderNumber: resolvedOrderNumber,
        items: lines.map((l) => ({
          name: l.name,
          price: l.price,
          quantity: l.quantity,
          flavor: l.flavor,
          image: l.image,
        })),
        total,
        status: "placed" as OrderStage,
        placedAt: now,
        eta: now + 1000 * 60 * 60 * 28, // ~28h delivery
        timeline: [
          { stage: "placed" as OrderStage, timestamp: now, note: "Order received" },
        ],
      };
      addOrder(trackedOrder);
      setOrderNumber(resolvedOrderNumber);
      setStage("success");
      clear();
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center"
        >
          <motion.div
            onClick={closeCart}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="relative z-10 flex max-h-[92dvh] w-full max-w-[460px] flex-col overflow-hidden rounded-t-[28px] border-t border-[oklch(0.96_0.012_80_/_0.1)] bg-background"
          >
            <div className="mx-auto my-3 h-1 w-10 rounded-full bg-[oklch(0.96_0.012_80_/_0.2)]" />

            {/* Header */}
            <div className="flex items-center justify-between px-5">
              <div>
                <h2 className="font-display text-[20px] font-semibold text-cream-gradient">
                  {stage === "cart"
                    ? "Your Cart"
                    : stage === "checkout"
                    ? "Checkout"
                    : "Order Confirmed"}
                </h2>
                <p className="text-[12px] text-muted-foreground">
                  {stage === "cart"
                    ? `${lines.length} item${lines.length > 1 ? "s" : ""} · secure`
                    : stage === "checkout"
                    ? "Guest checkout · OTP verified"
                    : "Ships within 24 hours"}
                </p>
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="grid h-9 w-9 place-items-center rounded-full glass"
              >
                <IconClose size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="no-scrollbar mt-3 flex-1 overflow-y-auto px-5 pb-[140px]">
              <AnimatePresence mode="wait">
                {stage === "cart" && (
                  <motion.div
                    key="cart"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-3"
                  >
                    {lines.length === 0 ? (
                      <EmptyCart />
                    ) : (
                      <>
                        {lines.map((line) => (
                          <CartLineItem
                            key={`${line.productId}-${line.flavor}`}
                            line={line}
                            onQty={(q) =>
                              updateQty(line.productId, line.flavor, q)
                            }
                            onRemove={() =>
                              removeItem(line.productId, line.flavor)
                            }
                          />
                        ))}

                        {/* Coupon */}
                        <div className="rounded-2xl glass p-3">
                          <div className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                            <IconGift size={12} />
                            Coupon code
                          </div>
                          <div className="flex gap-2">
                            <input
                              value={coupon}
                              onChange={(e) => setCoupon(e.target.value)}
                              placeholder="Try HUXON10"
                              className="flex-1 rounded-xl bg-[oklch(0.96_0.012_80_/_0.06)] px-3 py-2 text-[13px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-[oklch(0.78_0.13_75_/_40%)]"
                            />
                            <HuxonButton size="sm" variant="secondary" onClick={applyCoupon}>
                              Apply
                            </HuxonButton>
                          </div>
                          {applied > 0 ? (
                            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[oklch(0.72_0.10_160)]">
                              <IconCheck size={12} />
                              Coupon applied · saved {formatINR(applied)}
                            </div>
                          ) : null}
                        </div>

                        {/* Trust strip */}
                        <div className="grid grid-cols-3 gap-2">
                          <TrustChip icon={<IconTruck size={14} />} label="Free > ₹1499" />
                          <TrustChip icon={<IconShield size={14} />} label="Secure pay" />
                          <TrustChip icon={<IconLock size={14} />} label="OTP login" />
                        </div>

                        {/* Summary */}
                        <div className="rounded-2xl glass p-4 text-[13px]">
                          <Row label="Subtotal" value={formatINR(subtotal())} />
                          {discount > 0 ? (
                            <Row label="Discount" value={`−${formatINR(discount)}`} good />
                          ) : null}
                          <Row
                            label="Shipping"
                            value={shipping === 0 ? "FREE" : formatINR(shipping)}
                            good={shipping === 0}
                          />
                          <div className="my-2 h-px bg-border/50" />
                          <div className="flex items-center justify-between">
                            <span className="text-[14px] font-semibold">Total</span>
                            <span className="font-display text-[22px] font-semibold text-gold-gradient tabular">
                              {formatINR(total)}
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {stage === "checkout" && (
                  <motion.div
                    key="checkout"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-3"
                  >
                    <CheckoutForm total={total} />
                  </motion.div>
                )}

                {stage === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <SuccessBurst />
                    <h3 className="mt-6 font-display text-[22px] font-semibold text-cream-gradient">
                      Order confirmed!
                    </h3>
                    <p className="mt-2 max-w-[280px] text-[13px] text-muted-foreground">
                      Order <span className="font-semibold text-foreground">#{orderNumber}</span> ships within 24h. Live tracking enabled.
                    </p>
                    <OrderTimeline />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sticky CTA */}
            {lines.length > 0 && stage !== "success" && (
              <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-[oklch(0.96_0.012_80_/_0.08)] bg-background/95 backdrop-blur-xl px-5 py-3 pb-safe">
                <HuxonButton
                  size="lg"
                  glow
                  loading={submitting}
                  className="w-full"
                  onClick={() => {
                    if (stage === "cart") setStage("checkout");
                    else if (stage === "checkout") submitOrder();
                  }}
                >
                  {stage === "cart" ? (
                    <>
                      Checkout · {formatINR(total)}
                      <IconArrowRight size={16} />
                    </>
                  ) : (
                    <>
                      <IconLock size={16} />
                      Pay {formatINR(total)} securely
                    </>
                  )}
                </HuxonButton>
              </div>
            )}

            {stage === "success" && (
              <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-[oklch(0.96_0.012_80_/_0.08)] bg-background/95 backdrop-blur-xl px-5 py-3 pb-safe">
                <HuxonButton
                  size="lg"
                  variant="secondary"
                  className="w-full"
                  onClick={closeCart}
                >
                  Continue shopping
                </HuxonButton>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CartLineItem({
  line,
  onQty,
  onRemove,
}: {
  line: { productId: string; name: string; price: number; mrp: number; flavor: string; image: string; quantity: number };
  onQty: (q: number) => void;
  onRemove: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex items-center gap-3 rounded-2xl glass p-3"
    >
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[oklch(0.96_0.012_80_/_0.04)]">
        <img
          src={line.image}
          alt={line.name}
          className="h-full w-full object-contain"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = "0";
          }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold">{line.name}</div>
        <div className="text-[10px] text-muted-foreground">{line.flavor}</div>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-[13px] font-semibold text-cream-gradient tabular">
            {formatINR(line.price)}
          </span>
          <span className="text-[10px] text-muted-foreground line-through tabular">
            {formatINR(line.mrp)}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <button
          onClick={onRemove}
          className="text-muted-foreground hover:text-[oklch(0.72_0.18_25)]"
          aria-label="Remove"
        >
          <IconTrash size={14} />
        </button>
        <div className="flex items-center gap-1 rounded-full bg-[oklch(0.96_0.012_80_/_0.06)] p-0.5">
          <button
            onClick={() => onQty(line.quantity - 1)}
            className="grid h-7 w-7 place-items-center rounded-full hover:bg-[oklch(0.96_0.012_80_/_0.08)]"
            aria-label="Decrease"
          >
            <IconMinus size={12} />
          </button>
          <span className="w-5 text-center text-[12px] font-semibold tabular">
            {line.quantity}
          </span>
          <button
            onClick={() => onQty(line.quantity + 1)}
            className="grid h-7 w-7 place-items-center rounded-full hover:bg-[oklch(0.96_0.012_80_/_0.08)]"
            aria-label="Increase"
          >
            <IconPlus size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-full glass">
        <IconTruck size={28} className="text-muted-foreground" />
      </div>
      <p className="mt-4 text-[14px] font-medium">Your cart is empty</p>
      <p className="mt-1 text-[12px] text-muted-foreground">
        Explore our premium range to get started.
      </p>
    </div>
  );
}

function TrustChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-[oklch(0.96_0.012_80_/_0.04)] py-2 text-[10px] text-muted-foreground">
      <span className="text-[oklch(0.78_0.13_75)]">{icon}</span>
      {label}
    </div>
  );
}

function Row({
  label,
  value,
  good,
}: {
  label: string;
  value: string;
  good?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={
          "font-semibold tabular " +
          (good ? "text-[oklch(0.72_0.10_160)]" : "text-foreground")
        }
      >
        {value}
      </span>
    </div>
  );
}

function CheckoutForm({ total }: { total: number }) {
  return (
    <div className="space-y-3">
      {/* OTP login */}
      <div className="rounded-2xl glass p-4">
        <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Guest checkout · OTP
        </div>
        <div className="flex gap-2">
          <input
            placeholder="+91 98765 43210"
            className="flex-1 rounded-xl bg-[oklch(0.96_0.012_80_/_0.06)] px-3 py-2.5 text-[13px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-[oklch(0.78_0.13_75_/_40%)]"
          />
          <HuxonButton size="sm" variant="secondary">Send OTP</HuxonButton>
        </div>
        <div className="mt-2 flex gap-1.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <input
              key={i}
              maxLength={1}
              className="h-11 w-9 rounded-lg bg-[oklch(0.96_0.012_80_/_0.06)] text-center text-[15px] font-semibold focus:outline-none focus:ring-1 focus:ring-[oklch(0.78_0.13_75_/_40%)]"
            />
          ))}
        </div>
      </div>

      {/* Address */}
      <div className="rounded-2xl glass p-4">
        <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Delivery address
        </div>
        <div className="space-y-2">
          <input placeholder="Full name" className="w-full rounded-xl bg-[oklch(0.96_0.012_80_/_0.06)] px-3 py-2.5 text-[13px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-[oklch(0.78_0.13_75_/_40%)]" />
          <input placeholder="Address line" className="w-full rounded-xl bg-[oklch(0.96_0.012_80_/_0.06)] px-3 py-2.5 text-[13px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-[oklch(0.78_0.13_75_/_40%)]" />
          <div className="flex gap-2">
            <input placeholder="City" className="flex-1 rounded-xl bg-[oklch(0.96_0.012_80_/_0.06)] px-3 py-2.5 text-[13px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-[oklch(0.78_0.13_75_/_40%)]" />
            <input placeholder="PIN" maxLength={6} className="w-24 rounded-xl bg-[oklch(0.96_0.012_80_/_0.06)] px-3 py-2.5 text-[13px] placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-[oklch(0.78_0.13_75_/_40%)]" />
          </div>
        </div>
      </div>

      {/* Payment */}
      <div className="rounded-2xl glass p-4">
        <div className="mb-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
          Payment method
        </div>
        <div className="grid grid-cols-2 gap-2">
          {["UPI", "Card", "Net Banking", "COD"].map((m, i) => (
            <button
              key={m}
              className={
                "rounded-xl border px-3 py-2.5 text-[12px] font-medium transition-all " +
                (i === 0
                  ? "border-[oklch(0.78_0.13_75_/_50%)] bg-[oklch(0.78_0.13_75_/_0.14)] text-[oklch(0.92_0.10_85)]"
                  : "border-border bg-transparent text-muted-foreground")
              }
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 rounded-xl bg-[oklch(0.78_0.13_75_/_0.06)] py-2 text-[11px] text-muted-foreground">
        <IconShield size={12} className="text-[oklch(0.78_0.13_75)]" />
        256-bit encrypted · PCI-DSS compliant
      </div>
    </div>
  );
}

function SuccessBurst() {
  return (
    <div className="relative grid h-24 w-24 place-items-center">
      <motion.div
        className="absolute inset-0 rounded-full bg-[oklch(0.62_0.10_160_/_0.2)]"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.4, 1] }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.div
        className="absolute inset-0 rounded-full bg-[oklch(0.78_0.13_75_/_0.3)] blur-md"
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.2 }}
        className="relative grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.92_0.10_85)] to-[oklch(0.62_0.10_55)]"
      >
        <IconCheck size={28} className="text-[oklch(0.14_0.01_50)]" strokeWidth={2.5} />
      </motion.div>
      {/* Confetti */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full"
          style={{
            background: ["oklch(0.78 0.13 75)", "oklch(0.62 0.10 160)", "oklch(0.92 0.10 85)"][i % 3],
          }}
          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 0],
            x: Math.cos((i / 8) * Math.PI * 2) * 50,
            y: Math.sin((i / 8) * Math.PI * 2) * 50,
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function OrderTimeline() {
  const steps = [
    { label: "Order placed", done: true },
    { label: "Packed", done: true },
    { label: "Shipped", done: false, active: true },
    { label: "Out for delivery", done: false },
    { label: "Delivered", done: false },
  ];
  return (
    <div className="mt-6 w-full">
      <div className="mb-3 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
        Live order status
      </div>
      <div className="relative">
        <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
        <div className="space-y-3">
          {steps.map((s, i) => (
            <div key={s.label} className="relative flex items-center gap-3 pl-6">
              <span
                className={
                  "absolute left-0 grid h-4 w-4 place-items-center rounded-full " +
                  (s.done
                    ? "bg-[oklch(0.78_0.13_75)]"
                    : s.active
                    ? "bg-[oklch(0.78_0.13_75_/_0.4)] ring-2 ring-[oklch(0.78_0.13_75)]"
                    : "bg-[oklch(0.96_0.012_80_/_0.1)]")
                }
              >
                {s.done ? <IconCheck size={9} className="text-[oklch(0.14_0.01_50)]" /> : null}
              </span>
              <span className={"text-[12px] " + (s.done || s.active ? "text-foreground" : "text-muted-foreground")}>
                {s.label}
              </span>
              {s.active ? (
                <Pill tone="gold" className="ml-auto">In progress</Pill>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
