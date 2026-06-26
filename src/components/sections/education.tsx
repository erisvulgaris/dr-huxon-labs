"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ARTICLES, type Article } from "@/lib/catalog";
import {
  IconArrowRight,
  IconArrowLeft,
  IconClose,
  IconClock,
  IconCheck,
  IconBolt,
} from "@/components/icons";
import { SectionHeader, Reveal, Pill } from "@/components/primitives";
import { cn } from "@/lib/utils";

const CATEGORY_LABELS: Record<Article["category"], string> = {
  science: "Science",
  nutrition: "Nutrition",
  fitness: "Fitness",
  lifestyle: "Lifestyle",
};

const CATEGORY_COLORS: Record<Article["category"], string> = {
  science: "oklch(0.78 0.13 75)",
  nutrition: "oklch(0.62 0.10 160)",
  fitness: "oklch(0.65 0.15 30)",
  lifestyle: "oklch(0.72 0.10 65)",
};

/**
 * EducationSection — nutrition science articles for the home page.
 */
export function EducationSection() {
  const [activeArticle, setActiveArticle] = React.useState<string | null>(null);

  return (
    <section className="relative px-4 py-12">
      <SectionHeader
        kicker="The Journal"
        title={
          <>
            Nutrition <span className="text-gold-gradient">science,</span> decoded.
          </>
        }
        subtitle="Evidence-based articles from our lab. No hype, just peer-reviewed science."
      />

      {/* Featured article (first one, larger) */}
      <Reveal className="mt-7">
        <FeaturedArticle
          article={ARTICLES[0]}
          onClick={() => setActiveArticle(ARTICLES[0].id)}
        />
      </Reveal>

      {/* Article grid */}
      <div className="mt-3 grid grid-cols-2 gap-2.5">
        {ARTICLES.slice(1, 5).map((article, i) => (
          <Reveal key={article.id} delay={i * 0.05}>
            <ArticleCard
              article={article}
              onClick={() => setActiveArticle(article.id)}
              compact
            />
          </Reveal>
        ))}
      </div>

      {/* See all */}
      <Reveal className="mt-4">
        <button className="flex w-full items-center justify-center gap-1.5 rounded-full glass py-3 text-[12px] font-medium text-muted-foreground">
          Browse all articles
          <IconArrowRight size={13} />
        </button>
      </Reveal>

      {/* Article detail modal */}
      <AnimatePresence>
        {activeArticle && (
          <ArticleModal
            article={ARTICLES.find((a) => a.id === activeArticle)!}
            onClose={() => setActiveArticle(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}

function FeaturedArticle({
  article,
  onClick,
}: {
  article: Article;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl glass p-4 text-left"
    >
      {/* Emoji hero */}
      <div
        className="relative grid h-20 w-20 shrink-0 place-items-center rounded-xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${article.accent.replace(")", " / 0.2)")}, ${article.accent.replace(")", " / 0.05)")})`,
        }}
      >
        <span className="text-[36px]">{article.emoji}</span>
        <div className="absolute left-1.5 top-1.5">
          <span
            className="rounded-full px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wide"
            style={{ background: `${article.accent.replace(")", " / 0.3)")}`, color: article.accent }}
          >
            {CATEGORY_LABELS[article.category]}
          </span>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-display text-[15px] font-semibold leading-tight text-cream-gradient line-clamp-2">
          {article.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
          {article.excerpt}
        </p>
        <div className="mt-1.5 flex items-center gap-2 text-[9px] text-muted-foreground">
          <span className="flex items-center gap-0.5">
            <IconClock size={9} />
            {article.readTime}
          </span>
          <span>·</span>
          <span>{article.date}</span>
        </div>
      </div>
    </motion.button>
  );
}

function ArticleCard({
  article,
  onClick,
  compact,
}: {
  article: Article;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl glass p-3 text-left"
    >
      <div
        className="relative grid h-16 w-full place-items-center rounded-xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${article.accent.replace(")", " / 0.18)")}, ${article.accent.replace(")", " / 0.04)")})`,
        }}
      >
        <span className="text-[28px]">{article.emoji}</span>
        <div className="absolute left-1.5 top-1.5">
          <span
            className="rounded-full px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wide"
            style={{ background: `${article.accent.replace(")", " / 0.3)")}`, color: article.accent }}
          >
            {CATEGORY_LABELS[article.category]}
          </span>
        </div>
      </div>
      <h3 className="mt-2 line-clamp-2 text-[12px] font-semibold leading-tight text-cream-gradient">
        {article.title}
      </h3>
      <div className="mt-1 flex items-center gap-1 text-[9px] text-muted-foreground">
        <IconClock size={8} />
        {article.readTime}
      </div>
    </motion.button>
  );
}

function ArticleModal({
  article,
  onClose,
}: {
  article: Article;
  onClose: () => void;
}) {
  return (
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
        <div className="mx-auto my-3 h-1 w-10 rounded-full bg-[oklch(var(--glass-border)/0.2)]" />
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full glass"
        >
          <IconClose size={16} />
        </button>

        <div className="no-scrollbar flex-1 overflow-y-auto pb-8">
          {/* Hero */}
          <div
            className="relative grid h-[180px] w-full place-items-center overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${article.accent.replace(")", " / 0.25)")}, ${article.accent.replace(")", " / 0.05)")})`,
            }}
          >
            <div className="bg-molecular absolute inset-0 opacity-30" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.1 }}
              className="relative text-[64px]"
            >
              {article.emoji}
            </motion.span>
            <div className="absolute bottom-3 left-5">
              <Pill tone="gold">{CATEGORY_LABELS[article.category]}</Pill>
            </div>
          </div>

          <div className="px-5 pt-4">
            {/* Meta */}
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <IconClock size={10} /> {article.readTime}
              </span>
              <span>·</span>
              <span>{article.author}</span>
            </div>

            {/* Title */}
            <h2 className="mt-2 font-display text-[22px] font-semibold leading-tight text-cream-gradient text-balance">
              {article.title}
            </h2>

            {/* Key takeaway */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 flex items-start gap-2 rounded-2xl border border-[oklch(var(--gold)/0.25)] bg-[oklch(var(--gold)/0.06)] p-3"
            >
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[oklch(var(--gold)/0.18)]">
                <IconBolt size={13} className="text-gold-gradient" />
              </div>
              <div>
                <div className="text-[9px] uppercase tracking-wide text-gold-gradient">
                  Key takeaway
                </div>
                <div className="text-[12px] font-medium text-foreground/90">
                  {article.keyTakeaway}
                </div>
              </div>
            </motion.div>

            {/* Body */}
            <div className="mt-5 space-y-3">
              <p className="text-[13px] leading-relaxed text-foreground/80 text-pretty">
                {article.excerpt}
              </p>
              <p className="text-[13px] leading-relaxed text-foreground/80 text-pretty">
                At Dr. Huxon Labs, we believe transparency is the foundation of trust. Every claim we make is backed by peer-reviewed research, and every batch is verified in our NABL-accredited laboratory.
              </p>
              <p className="text-[13px] leading-relaxed text-foreground/80 text-pretty">
                Our approach combines the rigor of pharmaceutical manufacturing with the accessibility of modern nutrition. This means you get products that are not only effective but also safe, consistent, and honestly labeled.
              </p>

              {/* Highlights */}
              <div className="space-y-2 pt-2">
                <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
                  What you'll learn
                </div>
                {[
                  "The science behind protein quality scoring",
                  "How to read and interpret lab reports",
                  "Why source transparency matters",
                  "Practical tips for optimizing your protein intake",
                ].map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    className="flex items-start gap-2"
                  >
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[oklch(var(--jade)/0.18)]">
                      <IconCheck size={9} className="text-[oklch(var(--jade))]" />
                    </span>
                    <span className="text-[12px] text-foreground/85">{point}</span>
                  </motion.div>
                ))}
              </div>

              {/* Date */}
              <div className="pt-3 text-[10px] text-muted-foreground">
                Published {article.date}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
