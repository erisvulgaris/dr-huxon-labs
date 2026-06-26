"use client";

import * as React from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  PRODUCTS,
  formatINR,
  discountPercent,
  PRODUCT_OFFERS,
  calcProductReward,
  NUTRITION_HIGHLIGHTS,
  RATING_BREAKDOWN,
  LAB_REPORTS,
  CERTIFICATIONS,
  PRODUCT_QAS,
  PRODUCT_RECIPES,
  type Offer,
} from "@/lib/catalog";
import { ICON_MAP } from "@/components/icons";
import {
  IconHeart,
  IconPlus,
  IconMinus,
  IconStar,
  IconArrowRight,
  IconArrowLeft,
  IconArrowDown,
  IconCheck,
  IconFlask,
  IconLeaf,
  IconShield,
  IconBolt,
  IconGift,
  IconClock,
  IconShare,
  IconChevronRight,
  IconChevronDown,
  IconSpark,
  IconCrown,
  IconFlame,
  IconTruck,
  IconLocation,
  IconRefresh,
  IconCertificate,
  IconClose,
} from "@/components/icons";
import { HuxonButton } from "@/components/huxon-button";
import {
  ProteinRing,
  StarRating,
  Pill,
  Reveal,
  AnimatedNumber,
  Stagger,
  StaggerItem,
} from "@/components/primitives";
import { useCart, useNav, useWishlist, useReward, useRecent, useSubscriptions } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Product Detail Page — premium, immersive.
 * Image carousel, offers section, rewards, nutrition, reviews, similar, sticky CTA.
 */
export function ProductView() {
  const { activeProductId, setRoute, openProduct, setShareProductId, setReviewProductId, toggleCompare, compareIds } = useNav();
  const product = PRODUCTS.find((p) => p.id === activeProductId) ?? PRODUCTS[0];
  const inCompare = compareIds.includes(product.id);
  const pushRecent = useRecent((s) => s.push);
  const addSubscription = useSubscriptions((s) => s.addSubscription);

  const [qty, setQty] = React.useState(1);
  const [flavor, setFlavor] = React.useState(product.flavor);
  const [activeImg, setActiveImg] = React.useState(0);

  // Reset state when product changes + track recently viewed
  React.useEffect(() => {
    setQty(1);
    setFlavor(product.flavor);
    setActiveImg(0);
    pushRecent(product.id);
    // scroll to top on product change
    const main = document.querySelector(".app-scroll") as HTMLElement | null;
    if (main) main.scrollTo({ top: 0, behavior: "smooth" });
  }, [product.id, pushRecent]);

  const { addItem, openCart } = useCart();
  const wishlist = useWishlist();
  const fav = wishlist.ids.includes(product.id);
  const { points, tier, streak, addPoints, pushToast } = useReward();

  const discount = discountPercent(product.price, product.mrp);
  const reward = calcProductReward(product.price * qty, tier, streak);

  // gallery images — use hero + a few others for carousel feel
  const gallery = [product.heroImage, ...PRODUCTS.filter(p => p.id !== product.id).slice(0, 3).map(p => p.heroImage)];

  // similar products
  const similar = PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 4);
  if (similar.length < 4) {
    similar.push(
      ...PRODUCTS.filter((p) => p.id !== product.id && !similar.includes(p)).slice(0, 4 - similar.length)
    );
  }

  // pairings
  const pairings = PRODUCTS.filter((p) =>
    product.pairings?.includes(p.id)
  );
  if (pairings.length < 2) {
    pairings.push(
      ...PRODUCTS.filter((p) => p.id !== product.id && !pairings.includes(p)).slice(0, 2 - pairings.length)
    );
  }

  const handleAddToCart = () => {
    addItem(product, flavor, qty);
    addPoints(reward.totalPoints);
    pushToast({
      title: `+${reward.totalPoints} reward points`,
      description: `Added ${qty} × ${product.name} to cart`,
    });
  };

  const handleBuyNow = () => {
    addItem(product, flavor, qty);
    addPoints(reward.totalPoints);
    openCart();
  };

  return (
    <div className="pb-[120px]">
      {/* Back button (floating) */}
      <button
        onClick={() => setRoute("shop")}
        className="fixed left-4 top-[calc(env(safe-area-inset-top)+52px)] z-30 grid h-10 w-10 place-items-center rounded-full glass-dark"
        aria-label="Back"
      >
        <IconArrowLeft size={18} />
      </button>

      {/* Share + favorite (floating) */}
      <div className="fixed right-4 top-[calc(env(safe-area-inset-top)+52px)] z-30 flex gap-2">
        <button
          onClick={() => setShareProductId(product.id)}
          className="grid h-10 w-10 place-items-center rounded-full glass-dark"
          aria-label="Share"
        >
          <IconShare size={16} />
        </button>
        <button
          onClick={() => wishlist.toggle(product.id)}
          className={cn(
            "grid h-10 w-10 place-items-center rounded-full glass-dark transition-colors",
            fav && "text-[oklch(var(--gold))]"
          )}
          aria-label="Wishlist"
        >
          <IconHeart size={16} active={fav} />
        </button>
      </div>

      {/* Image carousel */}
      <ImageCarousel
        images={gallery}
        activeIndex={activeImg}
        onChange={setActiveImg}
        accent={product.accent}
        proteinGrams={product.proteinGrams}
      />

      <div className="px-4">
        {/* Title block */}
        <Reveal className="mt-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-1.5">
                {product.badge ? <Pill tone="gold">{product.badge}</Pill> : null}
                <Pill tone="green">
                  <span className="h-1.5 w-1.5 rounded-full bg-[oklch(var(--jade))]" />
                  In stock
                </Pill>
                <Pill>
                  <IconFlask size={10} />
                  Lab verified
                </Pill>
              </div>
              <h1 className="font-display text-[26px] font-semibold leading-tight text-cream-gradient">
                {product.name}
              </h1>
              <p className="mt-1 text-[13px] text-muted-foreground text-pretty">
                {product.tagline}
              </p>
            </div>
            <ProteinRing
              value={Math.min(100, Math.round((product.proteinGrams / 30) * 100))}
              size={64}
              stroke={6}
              color={product.accent}
            >
              <div className="flex flex-col items-center leading-none">
                <span className="text-[13px] font-bold text-gold-gradient">
                  {product.proteinGrams}g
                </span>
                <span className="text-[7px] uppercase tracking-wide text-muted-foreground">
                  protein
                </span>
              </div>
            </ProteinRing>
          </div>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">
            <StarRating value={product.rating} count={product.reviewCount} size={13} />
          </div>

          {/* Price */}
          <div className="mt-4 flex items-end gap-2">
            <span className="font-display text-[32px] font-semibold text-gold-gradient tabular">
              {formatINR(product.price)}
            </span>
            {discount > 0 ? (
              <>
                <span className="text-[15px] text-muted-foreground line-through tabular">
                  {formatINR(product.mrp)}
                </span>
                <Pill tone="green">{discount}% off</Pill>
              </>
            ) : null}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Inclusive of all taxes · {product.servings} servings ·{" "}
            {formatINR(Math.round(product.price / product.servings))}/serving
          </p>
        </Reveal>

        {/* OFFERS SECTION */}
        <Reveal className="mt-6">
          <OffersSection offers={PRODUCT_OFFERS} productPrice={product.price} />
        </Reveal>

        {/* REWARDS SECTION */}
        <Reveal className="mt-4">
          <RewardsSection reward={reward} tier={tier} streak={streak} />
        </Reveal>

        {/* Nutrition highlights */}
        <Reveal className="mt-6">
          <div className="grid grid-cols-4 gap-2">
            {NUTRITION_HIGHLIGHTS.map((h) => {
              const Icon = ICON_MAP[h.icon] ?? IconFlask;
              return (
                <div
                  key={h.label}
                  className="flex flex-col items-center gap-1 rounded-2xl glass p-2.5 text-center"
                >
                  <Icon size={16} active />
                  <span className="text-[12px] font-bold text-cream-gradient tabular">
                    {h.value}
                  </span>
                  <span className="text-[8px] uppercase tracking-wide text-muted-foreground">
                    {h.label}
                  </span>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* Flavor selector */}
        <Reveal className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              Flavor
            </span>
            <span className="text-[11px] text-muted-foreground">{flavor}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[product.flavor, "Chocolate", "Vanilla", "Mixed Berry"].map((f, i) => {
              const active = f === flavor;
              return (
                <button
                  key={f}
                  onClick={() => setFlavor(f)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-2 text-[12px] font-medium transition-all",
                    active
                      ? "border-[oklch(var(--gold)/50%)] bg-[oklch(var(--gold)/0.14)] text-gold-gradient"
                      : "border-border bg-transparent text-muted-foreground"
                  )}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{
                      background: [
                        product.flavorColor,
                        "oklch(0.50 0.08 50)",
                        "oklch(0.85 0.05 80)",
                        "oklch(0.55 0.15 0)",
                      ][i],
                    }}
                  />
                  {f}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Quantity + Buy options */}
        <Reveal className="mt-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full glass p-1">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-[oklch(var(--glass-tint)/0.1)]"
                aria-label="Decrease"
              >
                <IconMinus size={14} />
              </button>
              <span className="w-8 text-center text-[15px] font-semibold tabular">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="grid h-10 w-10 place-items-center rounded-full hover:bg-[oklch(var(--glass-tint)/0.1)]"
                aria-label="Increase"
              >
                <IconPlus size={14} />
              </button>
            </div>
            <div className="flex-1 text-right">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Total
              </div>
              <div className="font-display text-[20px] font-semibold text-gold-gradient tabular">
                {formatINR(product.price * qty)}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Description + features */}
        <Reveal className="mt-6">
          <h2 className="mb-2 text-[15px] font-semibold">Overview</h2>
          <p className="text-[13px] leading-relaxed text-foreground/80 text-pretty">
            {product.description}
          </p>
          <div className="mt-3 space-y-2">
            {product.features.map((f) => (
              <div key={f} className="flex items-start gap-2 text-[13px]">
                <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[oklch(var(--jade)/0.18)]">
                  <IconCheck size={10} />
                </span>
                <span className="text-foreground/85">{f}</span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Nutrition facts */}
        <Reveal className="mt-6">
          <h2 className="mb-2 text-[15px] font-semibold">Nutrition facts</h2>
          <div className="rounded-2xl glass p-4">
            <div className="mb-3 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Per {product.servingSize} serving
            </div>
            <div className="grid grid-cols-2 gap-2">
              {product.nutritionFacts.map((n) => (
                <div
                  key={n.label}
                  className="flex items-center justify-between rounded-xl bg-[oklch(var(--glass-tint)/0.04)] px-3 py-2"
                >
                  <span className="text-[12px] text-muted-foreground">{n.label}</span>
                  <span className="text-[13px] font-semibold text-cream-gradient tabular">
                    {n.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Ingredients */}
        <Reveal className="mt-6">
          <h2 className="mb-2 text-[15px] font-semibold">Ingredients</h2>
          <div className="space-y-2">
            {product.ingredients.map((ing) => (
              <div
                key={ing.name}
                className="flex items-center justify-between rounded-xl glass px-3 py-2.5"
              >
                <span className="text-[13px] text-foreground/85">{ing.name}</span>
                <span className="text-[13px] font-semibold text-gold-gradient tabular">
                  {ing.amount}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Trust badges */}
        <Reveal className="mt-6 grid grid-cols-3 gap-2">
          <TrustChip icon={<IconShield size={14} />} label="Lab tested" />
          <TrustChip icon={<IconLeaf size={14} />} label="Plant based" />
          <TrustChip icon={<IconFlask size={14} />} label="FSSAI" />
        </Reveal>

        {/* Reviews */}
        <Reveal className="mt-6">
          <ReviewsSection
            productId={product.id}
            rating={product.rating}
            reviewCount={product.reviewCount}
            onWriteReview={() => setReviewProductId(product.id)}
          />
        </Reveal>

        {/* Q&A Section */}
        <Reveal className="mt-6">
          <QASection />
        </Reveal>

        {/* Lab Reports / Certificate of Analysis */}
        <Reveal className="mt-6">
          <LabReportsSection productPrice={product.price} />
        </Reveal>

        {/* Subscribe & Save */}
        <Reveal className="mt-6">
          <SubscribeSection
            price={product.price}
            onSubscribe={(frequency, quantities) => {
              const discountedPrice = Math.round(product.price * 0.85);
              addSubscription({
                id: `sub-${Date.now()}`,
                productId: product.id,
                productName: product.name,
                productImage: product.heroImage,
                productAccent: product.accent,
                flavor,
                quantity: quantities,
                frequencyDays: frequency,
                nextDelivery: Date.now() + frequency * 24 * 60 * 60 * 1000,
                pricePerDelivery: discountedPrice * quantities,
                originalPricePerDelivery: product.price * quantities,
                status: "active",
                totalSaved: 0,
                deliveriesCount: 0,
                createdAt: Date.now(),
              });
              addPoints(100);
              pushToast({
                title: "+100 reward points",
                description: "Subscription activated — 15% off every order",
              });
            }}
          />
        </Reveal>

        {/* Recipes / Usage ideas */}
        <Reveal className="mt-6">
          <RecipesSection />
        </Reveal>

        {/* Pairings */}
        {pairings.length > 0 ? (
          <Reveal className="mt-6">
            <h2 className="mb-3 text-[15px] font-semibold">Pairs well with</h2>
            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              {pairings.map((p) => (
                <ProductMiniCard key={p.id} product={p} onClick={() => openProduct(p.id)} />
              ))}
            </div>
          </Reveal>
        ) : null}

        {/* Similar products */}
        <Reveal className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">You may also like</h2>
            <button
              onClick={() => setRoute("shop")}
              className="flex items-center gap-0.5 text-[11px] text-gold-gradient"
            >
              View all <IconChevronRight size={12} />
            </button>
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto">
            {similar.map((p) => (
              <ProductMiniCard key={p.id} product={p} onClick={() => openProduct(p.id)} />
            ))}
          </div>
        </Reveal>

        {/* Delivery info */}
        <Reveal className="mt-6">
          <div className="rounded-2xl glass p-4">
            <div className="flex items-center gap-2 text-[12px]">
              <IconTruck size={16} className="text-gold-gradient" />
              <span className="font-semibold">Free delivery</span>
              <span className="text-muted-foreground">on orders over ₹1,499</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[12px]">
              <IconLocation size={16} className="text-gold-gradient" />
              <span className="text-muted-foreground">Deliver to:</span>
              <span className="font-semibold">Bengaluru 560038</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-[12px]">
              <IconClock size={16} className="text-gold-gradient" />
              <span className="text-muted-foreground">Ships in 24h · Arrives</span>
              <span className="font-semibold">Tomorrow, 7 PM</span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Sticky purchase bar */}
      <StickyPurchaseBar
        price={product.price * qty}
        onAdd={handleAddToCart}
        onBuy={handleBuyNow}
      />
    </div>
  );
}

/* ============================================================
   Image Carousel — gesture-controlled, with protein ring overlay
   ============================================================ */
function ImageCarousel({
  images,
  activeIndex,
  onChange,
  accent,
  proteinGrams,
}: {
  images: string[];
  activeIndex: number;
  onChange: (i: number) => void;
  accent: string;
  proteinGrams: number;
}) {
  return (
    <div className="relative h-[380px] w-full overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: `${accent.replace(")", " / 0.25)")}` }}
      />
      {/* Carousel */}
      <div
        className="no-scrollbar flex h-full w-full snap-x-mandatory overflow-x-auto"
        onScroll={(e) => {
          const idx = Math.round(
            e.currentTarget.scrollLeft / e.currentTarget.clientWidth
          );
          if (idx !== activeIndex && idx >= 0 && idx < images.length) {
            onChange(idx);
          }
        }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            className="relative h-full w-full shrink-0 snap-center"
          >
            <motion.img
              src={img}
              alt={`Product view ${i + 1}`}
              className="relative z-10 h-full w-full object-contain drop-shadow-[0_20px_40px_oklch(var(--shadow-color)/0.6)]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.opacity = "0";
              }}
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const el = document.querySelector(".snap-x-mandatory") as HTMLElement;
              if (el) el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
            }}
            aria-label={`Image ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === activeIndex ? "w-6 bg-[oklch(var(--gold))]" : "w-1.5 bg-[oklch(var(--glass-border)/0.3)]"
            )}
          />
        ))}
      </div>

      {/* 360 hint */}
      <div className="absolute bottom-4 right-4 rounded-full glass px-2.5 py-1 text-[9px] font-medium text-muted-foreground">
        ← Swipe to rotate →
      </div>
    </div>
  );
}

/* ============================================================
   Offers Section — flash sale, bundles, coupons, bank offers
   ============================================================ */
function OffersSection({
  offers,
  productPrice,
}: {
  offers: Offer[];
  productPrice: number;
}) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-1.5">
        <IconGift size={14} className="text-gold-gradient" />
        <h2 className="text-[15px] font-semibold">Offers & rewards</h2>
        <span className="ml-auto rounded-full bg-[oklch(var(--gold)/0.12)] px-2 py-0.5 text-[9px] font-semibold text-gold-gradient">
          {offers.length} available
        </span>
      </div>
      <div className="space-y-2">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} productPrice={productPrice} />
        ))}
      </div>
    </div>
  );
}

function OfferCard({ offer, productPrice }: { offer: Offer; productPrice: number }) {
  const [expanded, setExpanded] = React.useState(false);

  if (offer.type === "flash") {
    return <FlashSaleCard offer={offer} />;
  }

  return (
    <motion.div
      whileTap={{ scale: 0.99 }}
      onClick={() => setExpanded((e) => !e)}
      className="overflow-hidden rounded-2xl border border-[oklch(var(--gold)/0.2)] bg-[oklch(var(--gold)/0.04)] p-3"
    >
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[oklch(var(--gold)/0.14)] text-gold-gradient">
          {offer.type === "bundle" ? <IconBolt size={18} /> : offer.type === "coupon" ? <IconGift size={18} /> : offer.type === "bank" ? <IconShield size={18} /> : <IconSpark size={18} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold text-gold-gradient">{offer.badge}</span>
          </div>
          <div className="truncate text-[13px] font-semibold text-cream-gradient">
            {offer.title}
          </div>
          <div className="truncate text-[11px] text-muted-foreground">
            {offer.description}
          </div>
        </div>
        {offer.type === "coupon" ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigator.clipboard?.writeText(offer.code);
            }}
            className="shrink-0 rounded-lg border border-dashed border-[oklch(var(--gold)/0.4)] px-2 py-1 font-mono text-[11px] font-bold text-gold-gradient"
          >
            {offer.code}
          </button>
        ) : offer.type === "bundle" ? (
          <div className="shrink-0 text-right">
            <div className="text-[13px] font-bold text-gold-gradient tabular">
              {formatINR(offer.bundlePrice)}
            </div>
            <div className="text-[9px] text-muted-foreground line-through tabular">
              {formatINR(offer.originalPrice)}
            </div>
          </div>
        ) : (
          <div className="shrink-0 rounded-full bg-[oklch(var(--jade)/0.16)] px-2 py-0.5 text-[11px] font-bold text-[oklch(var(--jade))]">
            {offer.discount}
          </div>
        )}
      </div>

      {offer.type === "bundle" && expanded ? (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="mt-3 space-y-1 border-t border-[oklch(var(--gold)/0.15)] pt-2"
        >
          {offer.items.map((item) => (
            <div key={item} className="flex items-center gap-2 text-[12px] text-muted-foreground">
              <IconCheck size={12} className="text-[oklch(var(--jade))]" />
              {item}
            </div>
          ))}
          <HuxonButton size="sm" className="mt-2 w-full">
            Add bundle to cart · Save {formatINR(offer.originalPrice - offer.bundlePrice)}
          </HuxonButton>
        </motion.div>
      ) : null}
    </motion.div>
  );
}

function FlashSaleCard({ offer }: { offer: Extract<Offer, { type: "flash" }> }) {
  const [remaining, setRemaining] = React.useState(offer.endsAt - Date.now());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.max(0, offer.endsAt - Date.now()));
    }, 1000);
    return () => clearInterval(interval);
  }, [offer.endsAt]);

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  const secs = Math.floor((remaining % (1000 * 60)) / 1000);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[oklch(0.72_0.18_25/0.3)] bg-gradient-to-br from-[oklch(0.72_0.18_25/0.1)] to-[oklch(0.62_0.10_55/0.04)] p-3">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[oklch(0.72_0.18_25/0.2)]">
          <IconFlame size={18} className="text-[oklch(0.72_0.18_25)]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold text-[oklch(0.72_0.18_25)]">{offer.badge}</span>
          </div>
          <div className="text-[13px] font-semibold text-cream-gradient">{offer.title}</div>
          <div className="text-[11px] text-muted-foreground">{offer.description}</div>
        </div>
        <div className="flex gap-1">
          <TimeBlock value={hours} label="HRS" />
          <TimeBlock value={mins} label="MIN" />
          <TimeBlock value={secs} label="SEC" />
        </div>
      </div>
    </div>
  );
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-[oklch(0.14_0.01_50)] font-mono text-[13px] font-bold text-cream-gradient tabular">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-0.5 text-[7px] uppercase tracking-wide text-muted-foreground">{label}</span>
    </div>
  );
}

/* ============================================================
   Rewards Section — earn points, tier bonus, streak bonus
   ============================================================ */
function RewardsSection({
  reward,
  tier,
  streak,
}: {
  reward: ReturnType<typeof calcProductReward>;
  tier: string;
  streak: number;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[oklch(var(--gold)/0.25)] bg-gradient-to-br from-[oklch(var(--gold)/0.1)] to-[oklch(var(--gold)/0.02)] p-4">
      <div className="bg-molecular absolute inset-0 opacity-30" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <IconCrown size={14} className="text-gold-gradient" />
            <span className="text-[11px] uppercase tracking-[0.16em] text-gold-gradient">
              Earn rewards
            </span>
          </div>
          <Pill tone="gold">{tier} tier</Pill>
        </div>

        <div className="mt-3 flex items-end gap-2">
          <AnimatedNumber
            value={reward.totalPoints}
            className="font-display text-[34px] font-semibold leading-none text-gold-gradient tabular"
          />
          <span className="mb-1 text-[12px] text-muted-foreground">points on this order</span>
        </div>

        {/* Breakdown */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <RewardStat label="Base" value={reward.basePoints} icon={<IconSpark size={12} />} />
          <RewardStat label="Tier bonus" value={reward.tierBonus} icon={<IconCrown size={12} />} />
          <RewardStat
            label="Streak"
            value={reward.streakBonus}
            icon={<IconFlame size={12} />}
            suffix={streak >= 7 ? `·${streak}d` : ""}
          />
        </div>

        {/* Unlocks */}
        <div className="mt-3 space-y-1.5">
          {reward.unlocks.map((u) => (
            <div key={u} className="flex items-center gap-1.5 text-[11px] text-foreground/80">
              <IconCheck size={12} className="text-[oklch(var(--jade))]" />
              {u}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RewardStat({
  label,
  value,
  icon,
  suffix,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  suffix?: string;
}) {
  return (
    <div className="rounded-xl bg-[oklch(var(--glass-tint)/0.06)] p-2 text-center">
      <div className="mb-0.5 flex items-center justify-center gap-1 text-gold-gradient">
        {icon}
      </div>
      <div className="text-[14px] font-bold text-cream-gradient tabular">
        +{value}
        {suffix ? <span className="text-[8px] text-muted-foreground">{suffix}</span> : null}
      </div>
      <div className="text-[8px] uppercase tracking-wide text-muted-foreground">{label}</div>
    </div>
  );
}

/* ============================================================
   Reviews Section — rating breakdown + review cards
   ============================================================ */
function ReviewsSection({
  productId,
  rating,
  reviewCount,
  onWriteReview,
}: {
  productId: string;
  rating: number;
  reviewCount: number;
  onWriteReview: () => void;
}) {
  const reviews = [
    {
      id: "1",
      author: "Arjun Mehta",
      avatar: "AM",
      rating: 5,
      title: "Best plant protein in India",
      body: "Tried 6+ brands. Huxon Gold Isolate mixes clean, tastes like real cocoa, and my recovery has never been better. Lab reports on the site gave me total confidence.",
      date: "2 weeks ago",
      verified: true,
    },
    {
      id: "2",
      author: "Priya Sharma",
      avatar: "PS",
      rating: 5,
      title: "Finally a clean label",
      body: "No sucralose, no fillers, no junk. Belgian cocoa is genuinely delicious. As a vegan athlete this is exactly what I needed.",
      date: "1 month ago",
      verified: true,
    },
    {
      id: "3",
      author: "Rohan Kapoor",
      avatar: "RK",
      rating: 4,
      title: "Great value for premium quality",
      body: "Premium quality, fair price for what you get. Wish the tub was a bit bigger but the protein density is unreal.",
      date: "5 days ago",
      verified: true,
    },
  ];

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold">Reviews & ratings</h2>
        <button
          onClick={onWriteReview}
          className="text-[11px] text-gold-gradient"
        >
          Write a review
        </button>
      </div>

      {/* Rating summary */}
      <div className="flex gap-4 rounded-2xl glass p-4">
        <div className="flex flex-col items-center justify-center">
          <span className="font-display text-[36px] font-semibold text-cream-gradient tabular">
            {rating.toFixed(1)}
          </span>
          <StarRating value={rating} size={11} />
          <span className="mt-1 text-[10px] text-muted-foreground">
            {reviewCount.toLocaleString("en-IN")} reviews
          </span>
        </div>
        <div className="flex-1 space-y-1">
          {RATING_BREAKDOWN.map((r) => (
            <div key={r.stars} className="flex items-center gap-2">
              <span className="w-3 text-[10px] text-muted-foreground tabular">{r.stars}</span>
              <IconStar size={9} active />
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[oklch(var(--glass-tint)/0.08)]">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[oklch(var(--gold))] to-[oklch(0.62_0.10_55)]"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${r.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
              <span className="w-10 text-right text-[9px] text-muted-foreground tabular">
                {r.count.toLocaleString("en-IN")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Review cards */}
      <Stagger className="mt-3 space-y-2" staggerChildren={0.08}>
        {reviews.map((r) => (
          <StaggerItem key={r.id}>
            <div className="rounded-2xl glass p-4">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[oklch(var(--gold)/0.18)] text-[11px] font-bold text-gold-gradient">
                  {r.avatar}
                </span>
                <div className="flex flex-col">
                  <span className="text-[13px] font-semibold">{r.author}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {r.date} · {r.verified ? "✓ Verified" : ""}
                  </span>
                </div>
                <div className="ml-auto flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <IconStar key={i} size={11} active={i <= r.rating} />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-[13px] font-medium">{r.title}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                {r.body}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      <button className="mt-3 w-full rounded-full glass py-2.5 text-[12px] font-medium text-muted-foreground">
        See all {reviewCount.toLocaleString("en-IN")} reviews
      </button>
    </div>
  );
}

/* ============================================================
   Product Mini Card — for pairings & similar products
   ============================================================ */
function ProductMiniCard({
  product,
  onClick,
}: {
  product: (typeof PRODUCTS)[number];
  onClick: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="group relative w-36 shrink-0 overflow-hidden rounded-2xl glass p-3 text-left"
    >
      <div className="relative h-20 w-full">
        <div
          className="absolute inset-0 rounded-full blur-md"
          style={{ background: `${product.accent.replace(")", " / 0.3)")}` }}
        />
        <img
          src={product.heroImage}
          alt={product.name}
          className="relative h-full w-full object-contain transition-transform group-hover:scale-110"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = "0";
          }}
        />
      </div>
      <div className="mt-2 truncate text-[12px] font-semibold">{product.name}</div>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-gold-gradient tabular">
          {formatINR(product.price)}
        </span>
        <IconStar size={9} active />
      </div>
    </motion.button>
  );
}

function TrustChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-[oklch(var(--glass-tint)/0.04)] py-2.5 text-[10px] text-muted-foreground">
      <span className="text-gold-gradient">{icon}</span>
      {label}
    </div>
  );
}

/* ============================================================
   Q&A Section — customer questions & answers
   ============================================================ */
function QASection() {
  const [expanded, setExpanded] = React.useState<string | null>(PRODUCT_QAS[0]?.id ?? null);
  const [helpful, setHelpful] = React.useState<Record<string, boolean>>({});

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold">Questions & answers</h2>
        <button className="text-[11px] text-gold-gradient">Ask a question</button>
      </div>

      <Stagger className="space-y-2" staggerChildren={0.06}>
        {PRODUCT_QAS.map((qa) => {
          const isOpen = expanded === qa.id;
          const isHelpful = helpful[qa.id];
          return (
            <StaggerItem key={qa.id}>
              <div
                className={cn(
                  "overflow-hidden rounded-2xl border transition-colors",
                  isOpen
                    ? "border-[oklch(var(--gold)/0.25)] bg-[oklch(var(--gold)/0.04)]"
                    : "border-border glass"
                )}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : qa.id)}
                  className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left"
                  aria-expanded={isOpen}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold text-gold-gradient">Q</span>
                      {qa.answeredBy === "brand" ? (
                        <Pill tone="gold">Brand answer</Pill>
                      ) : (
                        <Pill>Verified buyer</Pill>
                      )}
                    </div>
                    <p className="mt-1 text-[13px] font-medium leading-snug text-cream-gradient">
                      {qa.question}
                    </p>
                  </div>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 22 }}
                    className={cn(
                      "grid h-6 w-6 shrink-0 place-items-center rounded-full",
                      isOpen ? "bg-[oklch(var(--gold)/0.18)] text-gold-gradient" : "bg-[oklch(var(--glass-tint)/0.06)] text-muted-foreground"
                    )}
                  >
                    <IconChevronDown size={12} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4">
                        <div className="flex gap-2">
                          <span className="text-[10px] font-semibold text-[oklch(var(--jade))]">A</span>
                          <div className="flex-1">
                            <p className="text-[12.5px] leading-relaxed text-foreground/80 text-pretty">
                              {qa.answer}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <span className="text-[10px] text-muted-foreground">
                                — {qa.author} · {qa.date}
                              </span>
                              <button
                                onClick={() =>
                                  setHelpful((h) => ({ ...h, [qa.id]: !h[qa.id] }))
                                }
                                className={cn(
                                  "flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium transition-colors",
                                  isHelpful
                                    ? "bg-[oklch(var(--jade)/0.18)] text-[oklch(var(--jade))]"
                                    : "bg-[oklch(var(--glass-tint)/0.06)] text-muted-foreground"
                                )}
                              >
                                <IconCheck size={10} />
                                Helpful · {qa.helpful + (isHelpful ? 1 : 0)}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
      <button className="mt-3 w-full rounded-full glass py-2.5 text-[12px] font-medium text-muted-foreground">
        See all {PRODUCT_QAS.length + 47} questions
      </button>
    </div>
  );
}

/* ============================================================
   Lab Reports / Certificate of Analysis
   ============================================================ */
function LabReportsSection({ productPrice }: { productPrice: number }) {
  const [activeCategory, setActiveCategory] = React.useState<
    "heavy-metals" | "microbial" | "protein-assay" | "contaminants"
  >("heavy-metals");
  const [showCert, setShowCert] = React.useState(false);

  const categories = [
    { id: "heavy-metals" as const, label: "Heavy Metals", icon: "shield" },
    { id: "microbial" as const, label: "Microbial", icon: "flask" },
    { id: "protein-assay" as const, label: "Protein Assay", icon: "dumbbell" },
    { id: "contaminants" as const, label: "Contaminants", icon: "check" },
  ];

  const tests = LAB_REPORTS.filter((t) => t.category === activeCategory);
  const allPass = LAB_REPORTS.every((t) => t.status === "pass" || t.status === "nd");

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <IconFlask size={14} className="text-gold-gradient" />
          <h2 className="text-[15px] font-semibold">Lab reports</h2>
        </div>
        <button
          onClick={() => setShowCert(true)}
          className="flex items-center gap-1 text-[11px] text-gold-gradient"
        >
          <IconCertificate size={12} />
          Certificates
        </button>
      </div>

      {/* Summary banner */}
      <div className="mb-3 flex items-center gap-3 rounded-2xl border border-[oklch(var(--jade)/0.25)] bg-[oklch(var(--jade)/0.06)] p-3">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-[oklch(var(--jade)/0.18)]">
          <IconCheck size={20} className="text-[oklch(var(--jade))]" />
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-cream-gradient">
            All {LAB_REPORTS.length} tests passed
          </div>
          <div className="text-[10px] text-muted-foreground">
            Batch #HXL-2025-{Math.floor(Math.random() * 9000 + 1000)} · Tested {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </div>
        </div>
        <button className="flex items-center gap-1 rounded-full bg-[oklch(var(--glass-tint)/0.08)] px-2.5 py-1.5 text-[10px] font-medium">
          <IconArrowDown size={11} />
          COA PDF
        </button>
      </div>

      {/* Category tabs */}
      <div className="no-scrollbar mb-3 flex gap-1.5 overflow-x-auto">
        {categories.map((cat) => {
          const Icon = ICON_MAP[cat.icon] ?? IconShield;
          const active = cat.id === activeCategory;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-all",
                active
                  ? "border-[oklch(var(--gold)/0.5)] bg-[oklch(var(--gold)/0.14)] text-gold-gradient"
                  : "border-border bg-transparent text-muted-foreground"
              )}
            >
              <Icon size={12} active={active} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Test results table */}
      <div className="overflow-hidden rounded-2xl glass">
        <div className="grid grid-cols-[1fr_auto_auto] gap-2 border-b border-border px-3 py-2 text-[9px] uppercase tracking-wide text-muted-foreground">
          <span>Test</span>
          <span className="text-right">Result</span>
          <span className="text-right">Limit</span>
        </div>
        <Stagger className="divide-y divide-border/40" staggerChildren={0.04}>
          {tests.map((test) => (
            <StaggerItem key={test.id}>
              <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "grid h-5 w-5 shrink-0 place-items-center rounded-full",
                      test.status === "nd"
                        ? "bg-[oklch(var(--jade)/0.18)]"
                        : "bg-[oklch(var(--jade)/0.18)]"
                    )}
                  >
                    <IconCheck size={10} className="text-[oklch(var(--jade))]" />
                  </span>
                  <span className="text-[12px] text-foreground/85">{test.testName}</span>
                </div>
                <div className="text-right">
                  <span
                    className={cn(
                      "text-[12px] font-semibold tabular",
                      test.status === "nd" ? "text-[oklch(var(--jade))]" : "text-cream-gradient"
                    )}
                  >
                    {test.result}
                  </span>
                  <span className="ml-0.5 text-[9px] text-muted-foreground">{test.unit}</span>
                </div>
                <span className="text-right text-[10px] text-muted-foreground tabular">
                  {test.limit}
                </span>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <p className="mt-2 px-1 text-[10px] text-muted-foreground">
        ND = Not Detected · Tests conducted at our NABL-accredited in-house lab and verified by an independent third party.
      </p>

      {/* Certificates modal */}
      <AnimatePresence>
        {showCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCert(false)}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 flex max-h-[80dvh] w-full max-w-[460px] flex-col overflow-hidden rounded-t-[28px] border-t border-border bg-background"
            >
              <div className="mx-auto my-3 h-1 w-10 rounded-full bg-[oklch(var(--glass-border)/0.2)]" />
              <button
                onClick={() => setShowCert(false)}
                aria-label="Close"
                className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full glass"
              >
                <IconClose size={16} />
              </button>
              <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-8">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-gold-gradient">
                  <IconCertificate size={12} />
                  Certifications
                </div>
                <h2 className="mt-1 font-display text-[22px] font-semibold text-cream-gradient">
                  Verified by 6 bodies
                </h2>
                <p className="mt-1 text-[12px] text-muted-foreground">
                  Every batch is audited quarterly.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  {CERTIFICATIONS.map((cert, i) => {
                    const Icon = ICON_MAP[cert.image] ?? IconShield;
                    return (
                      <motion.div
                        key={cert.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="rounded-2xl glass p-3"
                      >
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-[oklch(var(--gold)/0.14)]">
                          <Icon size={18} active />
                        </div>
                        <div className="mt-2 text-[13px] font-semibold text-cream-gradient">
                          {cert.name}
                        </div>
                        <div className="text-[9px] text-muted-foreground">
                          License: {cert.license}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
                <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full glass py-3 text-[12px] font-medium">
                  <IconArrowDown size={14} />
                  Download all certificates (PDF, 2.4MB)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ============================================================
   Subscribe & Save Section
   ============================================================ */
function SubscribeSection({
  price,
  onSubscribe,
}: {
  price: number;
  onSubscribe: (frequency: number, quantities: number) => void;
}) {
  const [mode, setMode] = React.useState<"one-time" | "subscription">("subscription");
  const [frequency, setFrequency] = React.useState(30);
  const [quantities, setQuantities] = React.useState(2);

  const discount = mode === "subscription" ? 0.15 : 0;
  const discountedPrice = Math.round(price * (1 - discount));
  const perDelivery = discountedPrice * quantities;
  const deliveriesPerYear = Math.round(365 / frequency);
  const annualSavings = mode === "subscription"
    ? (price - discountedPrice) * quantities * deliveriesPerYear
    : 0;

  const frequencies = [
    { days: 15, label: "Every 2 weeks", recommended: false },
    { days: 30, label: "Monthly", recommended: true },
    { days: 45, label: "Every 6 weeks", recommended: false },
    { days: 60, label: "Bi-monthly", recommended: false },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-[oklch(var(--gold)/0.25)] bg-gradient-to-br from-[oklch(var(--gold)/0.08)] to-[oklch(var(--gold)/0.02)] p-4">
      <div className="bg-molecular absolute inset-0 opacity-30" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <IconRefresh size={14} className="text-gold-gradient" />
            <span className="text-[11px] uppercase tracking-[0.16em] text-gold-gradient">
              Subscribe & save
            </span>
          </div>
          <Pill tone="green">15% off forever</Pill>
        </div>

        {/* Mode toggle */}
        <div className="mt-3 flex gap-1 rounded-full bg-[oklch(var(--glass-tint)/0.06)] p-1">
          <button
            onClick={() => setMode("one-time")}
            className={cn(
              "relative flex-1 rounded-full px-3 py-2 text-[12px] font-medium",
              mode === "one-time" ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {mode === "one-time" && (
              <motion.span layoutId="sub-mode" className="absolute inset-0 rounded-full bg-[oklch(var(--glass-tint)/0.12)]" />
            )}
            <span className="relative z-10">One-time</span>
          </button>
          <button
            onClick={() => setMode("subscription")}
            className={cn(
              "relative flex-1 rounded-full px-3 py-2 text-[12px] font-medium",
              mode === "subscription" ? "text-gold-gradient" : "text-muted-foreground"
            )}
          >
            {mode === "subscription" && (
              <motion.span layoutId="sub-mode" className="absolute inset-0 rounded-full bg-[oklch(var(--gold)/0.18)]" />
            )}
            <span className="relative z-10 flex items-center justify-center gap-1">
              Subscription
              <span className="rounded-full bg-[oklch(var(--jade)/0.2)] px-1.5 py-0.5 text-[8px] font-bold text-[oklch(var(--jade))]">
                -15%
              </span>
            </span>
          </button>
        </div>

        {mode === "subscription" ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
          >
            {/* Frequency selector */}
            <div className="mt-3">
              <div className="mb-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Delivery frequency
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {frequencies.map((f) => (
                  <button
                    key={f.days}
                    onClick={() => setFrequency(f.days)}
                    className={cn(
                      "relative rounded-xl border px-2 py-2 text-[11px] font-medium transition-all",
                      frequency === f.days
                        ? "border-[oklch(var(--gold)/0.5)] bg-[oklch(var(--gold)/0.14)] text-gold-gradient"
                        : "border-border bg-transparent text-muted-foreground"
                    )}
                  >
                    {f.recommended ? (
                      <span className="absolute -top-1.5 right-1.5 rounded-full bg-[oklch(var(--jade))] px-1.5 py-0.5 text-[7px] font-bold text-background">
                        POPULAR
                      </span>
                    ) : null}
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mt-3 flex items-center justify-between rounded-xl bg-[oklch(var(--glass-tint)/0.06)] p-2.5">
              <span className="text-[11px] text-muted-foreground">Tubs per delivery</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setQuantities((q) => Math.max(1, q - 1))}
                  className="grid h-7 w-7 place-items-center rounded-full bg-[oklch(var(--glass-tint)/0.1)]"
                  aria-label="Decrease"
                >
                  <IconMinus size={12} />
                </button>
                <span className="w-6 text-center text-[13px] font-semibold tabular">{quantities}</span>
                <button
                  onClick={() => setQuantities((q) => Math.min(6, q + 1))}
                  className="grid h-7 w-7 place-items-center rounded-full bg-[oklch(var(--glass-tint)/0.1)]"
                  aria-label="Increase"
                >
                  <IconPlus size={12} />
                </button>
              </div>
            </div>

            {/* Savings breakdown */}
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-muted-foreground">One-time price</span>
                <span className="text-muted-foreground line-through tabular">{formatINR(price * quantities)}</span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-muted-foreground">Subscriber discount (15%)</span>
                <span className="text-[oklch(var(--jade))] tabular">−{formatINR(price * quantities - perDelivery)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border/50 pt-1.5">
                <span className="text-[13px] font-semibold">Per delivery</span>
                <span className="font-display text-[18px] font-semibold text-gold-gradient tabular">
                  {formatINR(perDelivery)}
                </span>
              </div>
            </div>

            {/* Annual savings highlight */}
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-[oklch(var(--jade)/0.1)] p-2.5">
              <IconBolt size={14} className="text-[oklch(var(--jade))]" />
              <span className="text-[11px] text-foreground/85">
                You save <span className="font-bold text-[oklch(var(--jade))]">{formatINR(annualSavings)}</span> per year vs one-time
              </span>
            </div>

            {/* Perks */}
            <div className="mt-3 grid grid-cols-3 gap-1.5">
              {["Pause anytime", "Swap flavors", "Free shipping"].map((perk) => (
                <div key={perk} className="flex flex-col items-center gap-1 rounded-lg bg-[oklch(var(--glass-tint)/0.04)] py-2 text-center text-[9px] text-muted-foreground">
                  <IconCheck size={11} className="text-[oklch(var(--jade))]" />
                  {perk}
                </div>
              ))}
            </div>

            <HuxonButton size="md" glow className="mt-3 w-full" onClick={() => onSubscribe(frequency, quantities)}>
              <IconRefresh size={14} />
              Start subscription · {formatINR(perDelivery)}/delivery
            </HuxonButton>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 rounded-xl bg-[oklch(var(--glass-tint)/0.06)] p-3 text-center text-[12px] text-muted-foreground"
          >
            Switch to subscription to save <span className="font-bold text-gold-gradient">15%</span> on every order.
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   Recipes / Usage Ideas Section
   ============================================================ */
function RecipesSection() {
  const [activeRecipe, setActiveRecipe] = React.useState<string | null>(null);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <IconBolt size={14} className="text-gold-gradient" />
          <h2 className="text-[15px] font-semibold">Ways to use it</h2>
        </div>
        <span className="text-[11px] text-muted-foreground">{PRODUCT_RECIPES.length} recipes</span>
      </div>

      {/* Recipe cards */}
      <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
        {PRODUCT_RECIPES.map((recipe, i) => (
          <motion.button
            key={recipe.id}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveRecipe(recipe.id)}
            className="group relative w-[200px] shrink-0 overflow-hidden rounded-2xl glass p-3 text-left"
          >
            {/* Emoji header */}
            <div
              className="relative grid h-20 w-full place-items-center rounded-xl overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${recipe.accent.replace(")", " / 0.18)")}, ${recipe.accent.replace(")", " / 0.04)")})`,
              }}
            >
              <span className="text-[36px]">{recipe.emoji}</span>
              <div className="absolute left-2 top-2">
                <Pill tone="gold">{recipe.category}</Pill>
              </div>
              <div className="absolute right-2 top-2 rounded-full bg-black/30 px-2 py-0.5 text-[9px] font-medium text-cream/90 backdrop-blur-sm">
                {recipe.prepTime}
              </div>
            </div>
            {/* Info */}
            <h3 className="mt-2 text-[13px] font-semibold leading-tight text-cream-gradient">
              {recipe.title}
            </h3>
            <div className="mt-1.5 flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <IconBolt size={9} className="text-gold-gradient" />
                {recipe.protein}g protein
              </span>
              <span>·</span>
              <span>{recipe.calories} kcal</span>
            </div>
            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground">
              <IconCheck size={9} className="text-[oklch(var(--jade))]" />
              {recipe.difficulty}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Recipe detail modal */}
      <AnimatePresence>
        {activeRecipe && (
          <RecipeDetailModal
            recipe={PRODUCT_RECIPES.find((r) => r.id === activeRecipe)!}
            onClose={() => setActiveRecipe(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function RecipeDetailModal({
  recipe,
  onClose,
}: {
  recipe: (typeof PRODUCT_RECIPES)[number];
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
        className="relative z-10 flex max-h-[88dvh] w-full max-w-[460px] flex-col overflow-hidden rounded-t-[28px] border-t border-border bg-background"
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
            className="relative grid h-[140px] w-full place-items-center overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${recipe.accent.replace(")", " / 0.25)")}, ${recipe.accent.replace(")", " / 0.05)")})`,
            }}
          >
            <div className="bg-molecular absolute inset-0 opacity-30" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.1 }}
              className="relative text-[56px]"
            >
              {recipe.emoji}
            </motion.span>
            <div className="absolute bottom-3 left-5">
              <Pill tone="gold">{recipe.category}</Pill>
            </div>
          </div>

          <div className="px-5 pt-4">
            <h2 className="font-display text-[22px] font-semibold text-cream-gradient">
              {recipe.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
              <span className="flex items-center gap-1 rounded-full bg-[oklch(var(--glass-tint)/0.06)] px-2.5 py-1">
                <IconClock size={10} /> {recipe.prepTime}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-[oklch(var(--glass-tint)/0.06)] px-2.5 py-1">
                <IconBolt size={10} className="text-gold-gradient" /> {recipe.protein}g protein
              </span>
              <span className="rounded-full bg-[oklch(var(--glass-tint)/0.06)] px-2.5 py-1">
                {recipe.calories} kcal
              </span>
              <span className="rounded-full bg-[oklch(var(--glass-tint)/0.06)] px-2.5 py-1">
                Serves {recipe.servings}
              </span>
            </div>

            {/* Ingredients */}
            <div className="mt-5">
              <h3 className="mb-2 text-[13px] font-semibold">Ingredients</h3>
              <div className="space-y-1.5">
                {recipe.ingredients.map((ing, i) => (
                  <motion.div
                    key={ing}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.05 }}
                    className="flex items-start gap-2 rounded-xl glass px-3 py-2"
                  >
                    <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[oklch(var(--jade)/0.18)]">
                      <IconCheck size={9} className="text-[oklch(var(--jade))]" />
                    </span>
                    <span className="text-[12px] text-foreground/85">{ing}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="mt-5">
              <h3 className="mb-2 text-[13px] font-semibold">Method</h3>
              <div className="space-y-2.5">
                {recipe.steps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="flex gap-3"
                  >
                    <span
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[oklch(var(--gold)/0.18)] text-[11px] font-bold text-gold-gradient"
                    >
                      {i + 1}
                    </span>
                    <span className="pt-0.5 text-[12px] leading-relaxed text-foreground/85">
                      {step}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Nutrition bar */}
            <div className="mt-5 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-[oklch(var(--glass-tint)/0.04)] p-2.5 text-center">
                <div className="text-[14px] font-bold text-gold-gradient tabular">{recipe.protein}g</div>
                <div className="text-[8px] uppercase tracking-wide text-muted-foreground">Protein</div>
              </div>
              <div className="rounded-xl bg-[oklch(var(--glass-tint)/0.04)] p-2.5 text-center">
                <div className="text-[14px] font-bold text-cream-gradient tabular">{recipe.calories}</div>
                <div className="text-[8px] uppercase tracking-wide text-muted-foreground">Calories</div>
              </div>
              <div className="rounded-xl bg-[oklch(var(--glass-tint)/0.04)] p-2.5 text-center">
                <div className="text-[14px] font-bold text-cream-gradient tabular">{recipe.servings}</div>
                <div className="text-[8px] uppercase tracking-wide text-muted-foreground">Servings</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ============================================================
   Sticky Purchase Bar
   ============================================================ */
function StickyPurchaseBar({
  price,
  onAdd,
  onBuy,
}: {
  price: number;
  onAdd: () => void;
  onBuy: () => void;
}) {
  return (
    <div className="fixed bottom-0 left-1/2 z-30 w-full max-w-[460px] -translate-x-1/2 border-t border-border bg-background/95 px-4 py-3 pb-[calc(env(safe-area-inset-bottom)+90px)] backdrop-blur-xl">
      <div className="flex gap-2">
        <HuxonButton variant="secondary" size="lg" className="flex-1" onClick={onAdd}>
          Add to cart
        </HuxonButton>
        <HuxonButton size="lg" glow className="flex-[1.4]" onClick={onBuy}>
          <IconBolt size={16} />
          Buy · {formatINR(price)}
        </HuxonButton>
      </div>
    </div>
  );
}
