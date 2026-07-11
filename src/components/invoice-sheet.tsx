"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOrders, type TrackedOrder } from "@/lib/store";
import { HuxonButton } from "@/components/huxon-button";
import {
  IconClose,
  IconArrowRight,
  IconCheck,
  IconPackage,
  IconDownload,
} from "@/components/icons";
import { formatINR } from "@/lib/catalog";

/**
 * InvoiceSheet — generates and downloads a PDF-like invoice for an order.
 * Opens from Orders page → Order detail → "Download Invoice".
 */
export function InvoiceSheet({
  order,
  onClose,
}: {
  order: TrackedOrder | null;
  onClose: () => void;
}) {
  const isOpen = !!order;

  const handleDownload = () => {
    if (!order) return;
    // Generate a text-based invoice (in production, use a PDF library)
    const invoice = `
====================================
    DR. HUXON LABS — TAX INVOICE
====================================

Invoice No: INV-${order.orderNumber}
Order No: ${order.orderNumber}
Date: ${new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
Status: ${order.status.toUpperCase()}

------------------------------------
BILL TO:
------------------------------------
Arjun Mehta
+91 98765 43210
12 Indiranagar, 2nd Stage
Bengaluru, Karnataka - 560038

------------------------------------
ITEMS:
------------------------------------
${order.items.map((item, i) => `
${i + 1}. ${item.name}
   ${item.flavor ? `Flavor: ${item.flavor}` : ""}
   Qty: ${item.quantity} × ${formatINR(item.price)} = ${formatINR(item.price * item.quantity)}
`).join("")}

------------------------------------
SUMMARY:
------------------------------------
Subtotal:          ${formatINR(order.total)}
Shipping:          FREE
GST (18% incl.):   ${formatINR(Math.round(order.total * 0.18 / 1.18))}
Round Off:         ₹0
------------------------------------
TOTAL:             ${formatINR(order.total)}
====================================

Thank you for choosing Dr. Huxon Labs!
www.drhuxon.com | care@drhuxon.com
FSSAI Lic: 10024031000234
GSTIN: 29AABCD1234E1Z5

This is a computer-generated invoice.
`;
    const blob = new Blob([invoice], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `invoice-${order.orderNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && order && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-md"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 flex max-h-[92dvh] w-full max-w-[460px] flex-col overflow-hidden rounded-t-[28px] border-t border-border bg-background"
          >
            <div className="mx-auto my-3 h-1 w-10 rounded-full bg-[oklch(var(--glass-tint)/0.2)]" />
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full glass"
            >
              <IconClose size={16} />
            </button>

            <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-8">
              <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-text-gold">
                <IconPackage size={11} />
                Invoice
              </div>
              <h2 className="mt-1 font-display text-[20px] font-semibold text-cream-gradient">
                Order #{order.orderNumber}
              </h2>

              {/* Invoice preview */}
              <div className="mt-4 rounded-2xl glass p-4">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-border/50 pb-3">
                  <div>
                    <div className="font-display text-[14px] font-bold text-cream-gradient">DR. HUXON LABS</div>
                    <div className="text-[9px] text-muted-foreground">FSSAI: 10024031000234</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-muted-foreground">Invoice</div>
                    <div className="text-[12px] font-semibold">INV-{order.orderNumber}</div>
                  </div>
                </div>

                {/* Date + status */}
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-muted-foreground">Date: </span>
                    <span className="font-medium">
                      {new Date(order.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <div className="rounded-full bg-[oklch(var(--jade)/0.14)] px-2 py-0.5 text-[9px] font-bold uppercase text-text-accent-jade">
                    {order.status}
                  </div>
                </div>

                {/* Bill to */}
                <div className="mt-3 text-[11px]">
                  <div className="text-[9px] uppercase tracking-wide text-muted-foreground">Bill To</div>
                  <div className="mt-0.5 font-medium">Arjun Mehta</div>
                  <div className="text-muted-foreground">12 Indiranagar, 2nd Stage</div>
                  <div className="text-muted-foreground">Bengaluru, Karnataka - 560038</div>
                </div>

                {/* Items */}
                <div className="mt-3 space-y-1.5">
                  <div className="text-[9px] uppercase tracking-wide text-muted-foreground">Items</div>
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px]">
                      <div className="flex-1">
                        <span className="font-medium">{item.name}</span>
                        {item.flavor ? <span className="text-muted-foreground"> · {item.flavor}</span> : null}
                        <span className="text-muted-foreground"> × {item.quantity}</span>
                      </div>
                      <span className="font-semibold tabular">{formatINR(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="mt-3 space-y-1 border-t border-border/50 pt-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="tabular">{formatINR(order.total)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="tabular text-text-accent-jade">FREE</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">GST (18% incl.)</span>
                    <span className="tabular">{formatINR(Math.round(order.total * 0.18 / 1.18))}</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between border-t border-border/50 pt-2">
                    <span className="text-[13px] font-bold">Total</span>
                    <span className="font-display text-[16px] font-bold text-text-gold tabular">{formatINR(order.total)}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 rounded-lg bg-[oklch(var(--glass-tint)/0.04)] p-2.5 text-center">
                  <div className="text-[9px] text-muted-foreground">
                    Thank you for choosing Dr. Huxon Labs!
                  </div>
                  <div className="text-[9px] text-muted-foreground">
                    care@drhuxon.com · www.drhuxon.com
                  </div>
                  <div className="text-[8px] text-muted-foreground/60">GSTIN: 29AABCD1234E1Z5</div>
                </div>
              </div>

              <HuxonButton size="lg" glow className="mt-4 w-full" onClick={handleDownload}>
                <IconDownload size={16} />
                Download Invoice
                <IconArrowRight size={14} />
              </HuxonButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
