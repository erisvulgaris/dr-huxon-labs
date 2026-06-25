"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useReward } from "@/lib/store";
import {
  IconClose,
  IconArrowRight,
  IconBolt,
  IconCheck,
  IconSpark,
  IconClock,
} from "@/components/icons";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: number;
};

const QUICK_REPLIES = [
  "Where are my orders?",
  "Are products vegan?",
  "How does Subscribe & Save work?",
  "Talk to a human",
];

const BOT_RESPONSES: Record<string, string> = {
  "Where are my orders?":
    "Your orders are in the Profile → My Orders section. You can track them live with our 5-stage timeline (placed → packed → shipped → out for delivery → delivered). Want me to take you there?",
  "Are products vegan?":
    "Yes! 100% plant-based and vegan-certified. Our pea + sprouted rice protein is produced in a dairy-free facility. We're also certified by the Vegan Society (VS-IND-44820).",
  "How does Subscribe & Save work?":
    "Subscribe to any product and save 15% on every delivery. Choose your frequency (2 weeks to 2 months), pause or skip anytime, and swap flavors freely. Manage everything from Profile → Subscriptions.",
  "Talk to a human":
    "I'm connecting you to our nutrition concierge team. Average response time is under 2 minutes during business hours (9 AM–9 PM IST). You can also email care@drhuxon.com.",
};

/**
 * ChatWidget — floating live chat support button + expandable chat.
 */
export function ChatWidget() {
  const [open, setOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([
    {
      id: "init",
      sender: "bot",
      text: "Hi! I'm Huxi, your nutrition assistant. How can I help you today?",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = React.useState("");
  const [typing, setTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { pushToast } = useReward();

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: text.trim(),
      timestamp: Date.now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const response =
        BOT_RESPONSES[text] ??
        "Great question! Our team will get back to you shortly. In the meantime, you might find the answer in our FAQ section on the home page.";
      setMessages((m) => [
        ...m,
        {
          id: `b-${Date.now()}`,
          sender: "bot",
          text: response,
          timestamp: Date.now(),
        },
      ]);
      setTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setOpen(true)}
            aria-label="Open chat support"
            className="fixed bottom-[calc(env(safe-area-inset-bottom)+100px)] right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[oklch(var(--gold))] to-[oklch(var(--bronze))] shadow-gold"
          >
            {/* Pulse ring */}
            <motion.span
              className="absolute inset-0 rounded-full bg-[oklch(var(--gold)/0.4)]"
              animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8l-4 4V6Z"
                fill="oklch(var(--charcoal))"
              />
              <circle cx="9" cy="10" r="1" fill="oklch(var(--gold))" />
              <circle cx="12" cy="10" r="1" fill="oklch(var(--gold))" />
              <circle cx="15" cy="10" r="1" fill="oklch(var(--gold))" />
            </svg>
            {/* Notification dot */}
            <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-[oklch(0.62_0.20_25)] text-[9px] font-bold text-white">
              1
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-[calc(env(safe-area-inset-bottom)+90px)] right-3 left-3 z-40 mx-auto flex max-w-[440px] flex-col overflow-hidden rounded-3xl border border-border glass-dark shadow-premium"
            style={{ height: "min(520px, 75dvh)" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border/50 px-4 py-3">
              <div className="relative">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-[oklch(var(--gold))] to-[oklch(var(--bronze))]">
                  <IconSpark size={18} className="text-[oklch(var(--charcoal))]" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-[oklch(var(--jade))]" />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold text-cream-gradient">
                  Huxi · Nutrition Assistant
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[oklch(var(--jade))]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[oklch(var(--jade))]" />
                  Online · replies instantly
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="grid h-8 w-8 place-items-center rounded-full glass text-muted-foreground hover:text-foreground"
              >
                <IconClose size={14} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="no-scrollbar flex-1 space-y-3 overflow-y-auto px-4 py-4"
            >
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {typing && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-[oklch(var(--glass-tint)/0.08)] px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-muted-foreground"
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Quick replies (only show if few messages) */}
              {messages.length <= 2 && !typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-1.5 pt-2"
                >
                  <div className="text-[9px] uppercase tracking-wide text-muted-foreground">
                    Quick questions
                  </div>
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="flex w-full items-center justify-between rounded-xl border border-border bg-[oklch(var(--glass-tint)/0.04)] px-3 py-2 text-left text-[12px] text-foreground/80 hover:border-[oklch(var(--gold)/0.3)]"
                    >
                      {q}
                      <IconArrowRight size={11} className="text-muted-foreground" />
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border/50 p-3">
              <div className="flex items-center gap-2 rounded-full bg-[oklch(var(--glass-tint)/0.08)] px-2 py-1.5">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendMessage(input);
                  }}
                  placeholder="Type a message…"
                  className="flex-1 bg-transparent px-2 text-[13px] placeholder:text-muted-foreground/60 focus:outline-none"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim()}
                  className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[oklch(var(--gold))] to-[oklch(var(--bronze))] disabled:opacity-40"
                  aria-label="Send"
                >
                  <IconArrowRight size={14} className="text-[oklch(var(--charcoal))]" />
                </button>
              </div>
              <div className="mt-1.5 flex items-center justify-center gap-1 text-[9px] text-muted-foreground">
                <IconClock size={9} />
                Powered by Huxon AI · Avg response 2 min
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isBot = message.sender === "bot";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("flex", isBot ? "justify-start" : "justify-end")}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-relaxed",
          isBot
            ? "rounded-bl-md bg-[oklch(var(--glass-tint)/0.08)] text-foreground/90"
            : "rounded-br-md bg-gradient-to-br from-[oklch(var(--gold))] to-[oklch(var(--bronze))] text-[oklch(var(--charcoal))]"
        )}
      >
        {message.text}
      </div>
    </motion.div>
  );
}
