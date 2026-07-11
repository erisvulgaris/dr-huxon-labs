"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HuxonButton } from "@/components/huxon-button";
import {
  IconClose,
  IconCheck,
  IconArrowRight,
  IconLocation,
  IconPlus,
  IconRefresh,
} from "@/components/icons";
import { Pill } from "@/components/primitives";
import { cn } from "@/lib/utils";

type Address = {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

const SEED_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    label: "Home",
    name: "Arjun Mehta",
    phone: "+91 98765 43210",
    line1: "12 Indiranagar, 2nd Stage",
    line2: "Near Metro Station",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "Office",
    name: "Arjun Mehta",
    phone: "+91 98765 43210",
    line1: "WeWork, Prestige Atlanta",
    line2: "80 Feet Rd, Koramangala",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560034",
    isDefault: false,
  },
];

/**
 * AddressBookSheet — manage saved delivery addresses.
 * Opens from Profile → Addresses quick action.
 */
export function AddressBookSheet({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [addresses, setAddresses] = React.useState(SEED_ADDRESSES);
  const [editing, setEditing] = React.useState<Address | null>(null);
  const [adding, setAdding] = React.useState(false);

  const setDefault = (id: string) => {
    setAddresses((addrs) =>
      addrs.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  const remove = (id: string) => {
    setAddresses((addrs) => addrs.filter((a) => a.id !== id));
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
                <IconLocation size={11} />
                Saved Addresses
              </div>
              <h2 className="mt-1 font-display text-[22px] font-semibold text-cream-gradient">
                {addresses.length} address{addresses.length !== 1 ? "es" : ""}
              </h2>

              {/* Add new button */}
              <button
                onClick={() => { setAdding(true); setEditing(null); }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border py-3 text-[13px] font-medium text-muted-foreground hover:border-[oklch(var(--gold)/0.4)] hover:text-text-gold transition-colors"
              >
                <IconPlus size={16} />
                Add new address
              </button>

              {/* Address list */}
              <div className="mt-3 space-y-2.5">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className={cn(
                      "rounded-2xl border p-3.5 transition-colors",
                      addr.isDefault
                        ? "border-[oklch(var(--gold)/0.3)] bg-[oklch(var(--gold)/0.04)]"
                        : "border-border glass"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[oklch(var(--gold)/0.14)]">
                          <IconLocation size={14} className="text-text-gold" />
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[13px] font-semibold">{addr.label}</span>
                            {addr.isDefault && <Pill tone="gold">Default</Pill>}
                          </div>
                          <div className="text-[11px] text-muted-foreground">{addr.name} · {addr.phone}</div>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-[12px] text-muted-foreground leading-relaxed">
                      {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}<br />
                      {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                    <div className="mt-3 flex gap-2">
                      {!addr.isDefault && (
                        <button
                          onClick={() => setDefault(addr.id)}
                          className="flex-1 rounded-full glass py-1.5 text-[11px] font-medium"
                        >
                          Set default
                        </button>
                      )}
                      <button
                        onClick={() => { setEditing(addr); setAdding(false); }}
                        className="flex-1 rounded-full glass py-1.5 text-[11px] font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => remove(addr.id)}
                        className="rounded-full glass px-3 py-1.5 text-[11px] font-medium text-[oklch(0.72_0.18_25)]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
