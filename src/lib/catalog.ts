/**
 * Dr. Huxon Labs — shared brand + utility data (client-safe, no DB)
 * Used to keep the storefront lightning-fast; mirror of seeded DB rows.
 */

export type BrandProduct = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  category: "protein" | "supplement" | "snack" | "performance";
  description: string;
  price: number;
  mrp: number;
  proteinGrams: number;
  servingSize: string;
  servings: number;
  flavor: string;
  flavorColor: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  badge?: string;
  features: string[];
  ingredients: { name: string; amount: string }[];
  nutritionFacts: { label: string; value: string }[];
  pairings?: string[];
  heroImage: string;
  galleryImages: string[];
  accent: string; // oklch accent for the card
};

export const PRODUCTS: BrandProduct[] = [
  {
    id: "p1",
    slug: "huxon-gold-isolate",
    name: "Huxon Gold Isolate",
    tagline: "Pea + Rice protein isolate, 27g per scoop",
    category: "protein",
    description:
      "Our flagship plant protein. A clinically-balanced pea and sprouted brown rice isolate, micro-filtered for 90% protein density. Engineered for maximum bioavailability with added digestive enzymes.",
    price: 2499,
    mrp: 3199,
    proteinGrams: 27,
    servingSize: "33g",
    servings: 30,
    flavor: "Belgian Cocoa",
    flavorColor: "oklch(0.55 0.08 50)",
    rating: 4.9,
    reviewCount: 2148,
    inStock: true,
    badge: "Bestseller",
    features: [
      "27g complete plant protein",
      "5.5g BCAAs per serving",
      "Added DigeZyme® enzymes",
      "No artificial sweeteners",
      "Heavy-metal tested",
    ],
    ingredients: [
      { name: "Pea Protein Isolate", amount: "18g" },
      { name: "Sprouted Brown Rice", amount: "9g" },
      { name: "Cocoa", amount: "2.5g" },
      { name: "DigeZyme® Blend", amount: "100mg" },
      { name: "Stevia", amount: "60mg" },
    ],
    nutritionFacts: [
      { label: "Calories", value: "118" },
      { label: "Protein", value: "27g" },
      { label: "Carbs", value: "3.2g" },
      { label: "Sugar", value: "0.4g" },
      { label: "Fat", value: "1.1g" },
      { label: "Sodium", value: "110mg" },
    ],
    pairings: ["p2", "p4"],
    heroImage: "/products/gold-isolate.png",
    galleryImages: ["/products/gold-isolate.png"],
    accent: "oklch(0.78 0.13 75)",
  },
  {
    id: "p2",
    slug: "huxon-recovery-matrix",
    name: "Recovery Matrix",
    tagline: "Post-workout recovery with curcumin + tart cherry",
    category: "performance",
    description:
      "A precision recovery formula combining plant protein with bioavailable curcumin, tart cherry extract and electrolytes. Reduces DOMS and accelerates muscle repair.",
    price: 2199,
    mrp: 2799,
    proteinGrams: 22,
    servingSize: "35g",
    servings: 25,
    flavor: "Tart Cherry",
    flavorColor: "oklch(0.55 0.16 25)",
    rating: 4.8,
    reviewCount: 894,
    inStock: true,
    badge: "New",
    features: [
      "22g protein + 500mg curcumin",
      "Tart cherry for inflammation",
      "Electrolyte balanced",
      "3x faster recovery",
    ],
    ingredients: [
      { name: "Pea Protein Isolate", amount: "15g" },
      { name: "Tart Cherry Extract", amount: "500mg" },
      { name: "Curcumin C3®", amount: "250mg" },
      { name: "Coconut Water Powder", amount: "1g" },
    ],
    nutritionFacts: [
      { label: "Calories", value: "98" },
      { label: "Protein", value: "22g" },
      { label: "Carbs", value: "4.5g" },
      { label: "Sugar", value: "1.2g" },
      { label: "Fat", value: "0.8g" },
      { label: "Sodium", value: "180mg" },
    ],
    pairings: ["p1"],
    heroImage: "/products/recovery-matrix.png",
    galleryImages: ["/products/recovery-matrix.png"],
    accent: "oklch(0.62 0.10 160)",
  },
  {
    id: "p3",
    slug: "huxon-plant-pre-workout",
    name: "Plant Pre-Workout",
    tagline: "Clean caffeine + beetroot nitric oxide boost",
    category: "performance",
    description:
      "A stimulant-balanced pre-workout with natural caffeine from green coffee, beetroot-derived nitrates, and L-citrulline for sustained pump without the crash.",
    price: 1899,
    mrp: 2399,
    proteinGrams: 0,
    servingSize: "12g",
    servings: 30,
    flavor: "Blood Orange",
    flavorColor: "oklch(0.62 0.18 35)",
    rating: 4.7,
    reviewCount: 612,
    inStock: true,
    features: [
      "180mg natural caffeine",
      "6g L-Citrulline",
      "Beetroot nitrate boost",
      "Zero artificial colors",
    ],
    ingredients: [
      { name: "L-Citrulline", amount: "6g" },
      { name: "Green Coffee Extract", amount: "350mg" },
      { name: "Beetroot Powder", amount: "1.5g" },
      { name: "L-Tyrosine", amount: "500mg" },
    ],
    nutritionFacts: [
      { label: "Calories", value: "12" },
      { label: "Protein", value: "0g" },
      { label: "Carbs", value: "2.8g" },
      { label: "Sugar", value: "0.5g" },
      { label: "Caffeine", value: "180mg" },
      { label: "Sodium", value: "60mg" },
    ],
    pairings: ["p1"],
    heroImage: "/products/pre-workout.png",
    galleryImages: ["/products/pre-workout.png"],
    accent: "oklch(0.65 0.15 30)",
  },
  {
    id: "p4",
    slug: "huxon-daily-greens",
    name: "Daily Greens+",
    tagline: "21 superfoods + probiotic blend",
    category: "supplement",
    description:
      "A daily greens powder with 21 cold-dried superfoods, adaptogenic herbs and a 5-strain probiotic blend for gut health, immunity and sustained energy.",
    price: 1599,
    mrp: 2099,
    proteinGrams: 4,
    servingSize: "8g",
    servings: 30,
    flavor: "Mint Cucumber",
    flavorColor: "oklch(0.65 0.10 150)",
    rating: 4.6,
    reviewCount: 1102,
    inStock: true,
    badge: "Clean Label",
    features: [
      "21 superfoods",
      "5-strain probiotic (10B CFU)",
      "Adaptogen blend",
      "Naturally sweetened",
    ],
    ingredients: [
      { name: "Spirulina", amount: "1g" },
      { name: "Wheat Grass", amount: "800mg" },
      { name: "Ashwagandha", amount: "300mg" },
      { name: "Probiotic Blend", amount: "10B CFU" },
    ],
    nutritionFacts: [
      { label: "Calories", value: "22" },
      { label: "Protein", value: "4g" },
      { label: "Carbs", value: "3.1g" },
      { label: "Fiber", value: "1.4g" },
      { label: "Sugar", value: "0.3g" },
      { label: "Sodium", value: "15mg" },
    ],
    pairings: ["p1", "p5"],
    heroImage: "/products/daily-greens.png",
    galleryImages: ["/products/daily-greens.png"],
    accent: "oklch(0.62 0.10 160)",
  },
  {
    id: "p5",
    slug: "huxon-protein-bars",
    name: "Huxon Protein Bars",
    tagline: "20g protein, zero sugar, 12-pack",
    category: "snack",
    description:
      "Decadent plant protein bars with 20g protein, zero added sugar, and a crisp quinoa crunch. Perfect on-the-go fuel without compromise.",
    price: 1299,
    mrp: 1599,
    proteinGrams: 20,
    servingSize: "60g",
    servings: 12,
    flavor: "Salted Caramel",
    flavorColor: "oklch(0.70 0.10 65)",
    rating: 4.8,
    reviewCount: 3274,
    inStock: true,
    badge: "Bestseller",
    features: [
      "20g protein per bar",
      "Zero added sugar",
      "Quinoa crunch",
      "No palm oil",
    ],
    ingredients: [
      { name: "Pea Protein Crisps", amount: "12g" },
      { name: "Almond Butter", amount: "8g" },
      { name: "Quinoa Crisps", amount: "4g" },
      { name: "Cocoa", amount: "2g" },
    ],
    nutritionFacts: [
      { label: "Calories", value: "210" },
      { label: "Protein", value: "20g" },
      { label: "Carbs", value: "18g" },
      { label: "Sugar", value: "0.8g" },
      { label: "Fat", value: "7.2g" },
      { label: "Fiber", value: "5g" },
    ],
    pairings: ["p1"],
    heroImage: "/products/protein-bars.png",
    galleryImages: ["/products/protein-bars.png"],
    accent: "oklch(0.72 0.10 65)",
  },
  {
    id: "p6",
    slug: "huxon-omega-plant",
    name: "Omega Plant 3-6-9",
    tagline: "Algae + flax + chia omega blend",
    category: "supplement",
    description:
      "A 100% plant-sourced omega blend from microalgae oil (DHA), cold-pressed flax and chia. Supports heart, brain and joint health without fish.",
    price: 999,
    mrp: 1299,
    proteinGrams: 0,
    servingSize: "2 softgels",
    servings: 45,
    flavor: "Unflavored",
    flavorColor: "oklch(0.55 0.06 90)",
    rating: 4.7,
    reviewCount: 487,
    inStock: true,
    features: [
      "300mg DHA from algae",
      "Cold-pressed flax + chia",
      "Fish-free, burp-free",
      "45-day supply",
    ],
    ingredients: [
      { name: "Algae Oil", amount: "500mg" },
      { name: "Flaxseed Oil", amount: "400mg" },
      { name: "Chia Oil", amount: "300mg" },
    ],
    nutritionFacts: [
      { label: "Calories", value: "15" },
      { label: "Total Fat", value: "1.5g" },
      { label: "Omega-3", value: "450mg" },
      { label: "Omega-6", value: "180mg" },
      { label: "Omega-9", value: "200mg" },
      { label: "DHA", value: "300mg" },
    ],
    pairings: ["p4"],
    heroImage: "/products/omega-plant.png",
    galleryImages: ["/products/omega-plant.png"],
    accent: "oklch(0.60 0.08 90)",
  },
];

export type BrandIngredient = {
  id: string;
  slug: string;
  name: string;
  origin: string;
  originLat: number;
  originLng: number;
  benefits: string[];
  qualityScore: number;
  processingMethod: string;
  nutritionalContribution: string;
  macroImage: string;
  category: string;
};

export const INGREDIENTS: BrandIngredient[] = [
  {
    id: "i1",
    slug: "yellow-pea-isolate",
    name: "Yellow Pea Isolate",
    origin: "Madhya Pradesh, India",
    originLat: 22.9734,
    originLng: 78.6569,
    benefits: [
      "Complete amino acid profile",
      "Easily digestible hypoallergenic protein",
      "Rich in BCAAs and arginine",
      "Supports muscle synthesis",
    ],
    qualityScore: 96,
    processingMethod: "Cold-water extraction + micro-filtration",
    nutritionalContribution: "27g protein / 100kcal — 90% protein density",
    macroImage: "/ingredients/pea.png",
    category: "protein-source",
  },
  {
    id: "i2",
    slug: "sprouted-brown-rice",
    name: "Sprouted Brown Rice",
    origin: "Andhra Pradesh, India",
    originLat: 15.9129,
    originLng: 79.7400,
    benefits: [
      "Complementary amino profile to pea",
      "High in methionine and cysteine",
      "Low allergen, easy digestion",
      "Sustained-release protein",
    ],
    qualityScore: 94,
    processingMethod: "Enzyme sprouting + low-temp drying",
    nutritionalContribution: "Pairs with pea for PDCAAS 1.0",
    macroImage: "/ingredients/rice.png",
    category: "protein-source",
  },
  {
    id: "i3",
    slug: "curcumin-c3",
    name: "Curcumin C3 Complex®",
    origin: "Erode, Tamil Nadu",
    originLat: 11.3410,
    originLng: 77.7172,
    benefits: [
      "Clinically studied anti-inflammatory",
      "Reduces exercise-induced DOMS",
      "Powerful antioxidant",
      "Supports joint mobility",
    ],
    qualityScore: 97,
    processingMethod: "Supercritical CO₂ extraction + piperine",
    nutritionalContribution: "95% curcuminoids standardized",
    macroImage: "/ingredients/curcumin.png",
    category: "botanical",
  },
  {
    id: "i4",
    slug: "tart-cherry",
    name: "Tart Cherry Extract",
    origin: "Kashmir Valley, India",
    originLat: 34.0837,
    originLng: 74.7973,
    benefits: [
      "Natural melatonin for sleep",
      "Reduces muscle soreness",
      "Anthocyanin antioxidant",
      "Supports uric acid balance",
    ],
    qualityScore: 92,
    processingMethod: "Cold-pressed + freeze-dried",
    nutritionalContribution: "Standardized to 10% anthocyanins",
    macroImage: "/ingredients/cherry.png",
    category: "botanical",
  },
  {
    id: "i5",
    slug: "spirulina",
    name: "Spirulina",
    origin: "Odisha Coast, India",
    originLat: 19.8209,
    originLng: 85.9080,
    benefits: [
      "60%+ complete protein",
      "Rich in B12 and iron",
      "Detoxifying chlorophyll",
      "Immune support",
    ],
    qualityScore: 93,
    processingMethod: "Pond-cultivated + low-temp drying",
    nutritionalContribution: "60% protein, B12, iron, chlorophyll",
    macroImage: "/ingredients/spirulina.png",
    category: "protein-source",
  },
  {
    id: "i6",
    slug: "ashwagandha-ksm66",
    name: "Ashwagandha KSM-66®",
    origin: "Rajasthan, India",
    originLat: 27.0238,
    originLng: 74.2179,
    benefits: [
      "Clinically-studied adaptogen",
      "Reduces cortisol & stress",
      "Improves VO2 max",
      "Supports testosterone balance",
    ],
    qualityScore: 98,
    processingMethod: "Full-spectrum root extraction",
    nutritionalContribution: "5% withanolides standardized",
    macroImage: "/ingredients/ashwagandha.png",
    category: "botanical",
  },
];

export type Review = {
  id: string;
  productId: string;
  author: string;
  avatar?: string;
  rating: number;
  title: string;
  body: string;
  verified: boolean;
  date: string;
};

export const REVIEWS: Review[] = [
  {
    id: "r1",
    productId: "p1",
    author: "Arjun Mehta",
    rating: 5,
    title: "Best plant protein in India, period.",
    body: "Tried 6+ brands. Huxon Gold Isolate mixes clean, tastes like real cocoa, and my recovery has never been better. Lab reports on the site gave me total confidence.",
    verified: true,
    date: "2 weeks ago",
  },
  {
    id: "r2",
    productId: "p1",
    author: "Priya Sharma",
    rating: 5,
    title: "Finally a clean-label protein",
    body: "No sucralose, no fillers, no junk. Belgian cocoa is genuinely delicious. As a vegan athlete this is exactly what I needed.",
    verified: true,
    date: "1 month ago",
  },
  {
    id: "r3",
    productId: "p5",
    author: "Rohan Kapoor",
    rating: 5,
    title: "My go-to travel fuel",
    body: "20g protein, zero sugar, salted caramel is unreal. Carry these everywhere now.",
    verified: true,
    date: "3 days ago",
  },
  {
    id: "r4",
    productId: "p2",
    author: "Sneha Iyer",
    rating: 4,
    title: "Noticeable recovery boost",
    body: "DOMS reduced significantly after switching. Tart cherry flavor is refreshing post-workout.",
    verified: true,
    date: "5 days ago",
  },
];

export const TRUST_BADGES = [
  { id: "lab-tested", label: "Lab Tested", icon: "flask" },
  { id: "high-protein", label: "High Protein", icon: "dumbbell" },
  { id: "made-in-india", label: "Made in India", icon: "lotus" },
  { id: "plant-based", label: "Plant Based", icon: "leaf" },
  { id: "no-fillers", label: "No Artificial Fillers", icon: "shield" },
  { id: "export-quality", label: "Export Quality", icon: "globe" },
  { id: "clean-label", label: "Clean Label", icon: "check" },
  { id: "fssai", label: "FSSAI Approved", icon: "certificate" },
];

export const MANUFACTURING_STAGES = [
  {
    id: "raw",
    title: "Raw Material",
    description: "Sourced from certified Indian farms, every batch verified for purity.",
    icon: "sprout",
    duration: "Day 1",
  },
  {
    id: "testing",
    title: "Testing",
    description: "Heavy metals, microbes, and protein assay in our in-house NABL lab.",
    icon: "flask",
    duration: "Day 2-3",
  },
  {
    id: "blending",
    title: "Blending",
    description: "Precision micro-blending in humidity-controlled clean rooms.",
    icon: "blend",
    duration: "Day 4",
  },
  {
    id: "qc",
    title: "Quality Control",
    description: "Inline spectroscopy checks every 15 minutes for consistency.",
    icon: "shield",
    duration: "Day 4-5",
  },
  {
    id: "packaging",
    title: "Packaging",
    description: "Nitrogen-flushed, UV-sealed recycled-kraft containers.",
    icon: "package",
    duration: "Day 6",
  },
  {
    id: "inspection",
    title: "Final Inspection",
    description: "Manual + AI visual inspection before release.",
    icon: "scan",
    duration: "Day 7",
  },
  {
    id: "distribution",
    title: "Distribution",
    description: "Climate-controlled logistics to your doorstep.",
    icon: "truck",
    duration: "Day 8+",
  },
];

export const FAQS = [
  {
    id: "f1",
    q: "Are your products third-party lab tested?",
    a: "Every single batch is tested in our NABL-accredited in-house lab and independently verified by a third party for heavy metals (Pb, As, Cd, Hg), microbial load, and protein assay. Certificates of Analysis are published on each product page.",
  },
  {
    id: "f2",
    q: "Is plant protein as effective as whey?",
    a: "When properly formulated, yes. Our pea + sprouted rice blend achieves a PDCAAS of 1.0, matching whey's amino acid score. We add DigeZyme® digestive enzymes to maximize absorption. Independent studies show equivalent muscle protein synthesis to whey.",
  },
  {
    id: "f3",
    q: "Are your products FSSAI certified?",
    a: "Yes. Dr. Huxon Labs operates under FSSAI License No. 10024031000234, with ISO 22000:2018 and GMP certifications. Our facility is audited quarterly.",
  },
  {
    id: "f4",
    q: "What sweeteners do you use?",
    a: "We use a blend of steviol glycosides (stevia) and monk fruit extract — never sucralose, aspartame, or artificial sweeteners. Our cocoa and natural flavors are all plant-derived.",
  },
  {
    id: "f5",
    q: "How fast is delivery across India?",
    a: "Metro cities receive orders in 1-2 business days; rest of India in 3-5 days. All orders ship within 24 hours from our Bengaluru facility with live tracking.",
  },
  {
    id: "f6",
    q: "Do you offer subscriptions?",
    a: "Yes — subscribe & save 15% on every recurring order, with the flexibility to pause, skip, or swap flavors anytime from your profile dashboard.",
  },
  {
    id: "f7",
    q: "What is your return policy?",
    a: "Unopened products can be returned within 30 days for a full refund. For quality concerns on opened products, contact care@drhuxon.com — we'll make it right.",
  },
];

export const CUSTOMER_STORIES = [
  {
    id: "s1",
    name: "Arjun Mehta",
    role: "Marathon runner · Bengaluru",
    avatar: "AM",
    accent: "oklch(0.78 0.13 75)",
    quote:
      "Cut my recovery time by a third. The Gold Isolate + Recovery Matrix stack is non-negotiable now.",
    metric: "-32% recovery time",
    duration: "12 weeks",
  },
  {
    id: "s2",
    name: "Priya Sharma",
    role: "CrossFit athlete · Mumbai",
    avatar: "PS",
    accent: "oklch(0.62 0.10 160)",
    quote:
      "First plant protein that doesn't bloat me. Tastes unreal and the lab transparency won me over.",
    metric: "+8kg lean mass",
    duration: "6 months",
  },
  {
    id: "s3",
    name: "Rohan Kapoor",
    role: "Hybrid athlete · Delhi",
    avatar: "RK",
    accent: "oklch(0.65 0.15 30)",
    quote:
      "Bars replaced my airport junk food habit. 20g protein, zero sugar, actually delicious.",
    metric: "0 → 5 workouts/wk",
    duration: "3 months",
  },
];

export const REWARDS_TIERS = [
  {
    id: "bronze",
    name: "Bronze",
    min: 0,
    perk: "5% back on every order",
    accent: "oklch(0.55 0.06 55)",
  },
  {
    id: "silver",
    name: "Silver",
    min: 2500,
    perk: "8% back + early access",
    accent: "oklch(0.72 0.02 80)",
  },
  {
    id: "gold",
    name: "Gold",
    min: 7500,
    perk: "12% back + free shipping",
    accent: "oklch(0.82 0.13 75)",
  },
  {
    id: "platinum",
    name: "Platinum",
    min: 15000,
    perk: "15% back + concierge nutritionist",
    accent: "oklch(0.88 0.06 85)",
  },
];

export const ACHIEVEMENTS = [
  { id: "a1", name: "First Order", icon: "spark", earned: true },
  { id: "a2", name: "Protein Streak — 7 days", icon: "flame", earned: true },
  { id: "a3", name: "Reviewed a Product", icon: "star", earned: true },
  { id: "a4", name: "Referred a Friend", icon: "users", earned: true },
  { id: "a5", name: "Gold Tier", icon: "crown", earned: false },
  { id: "a6", name: "Subscription Member", icon: "refresh", earned: false },
];

export const formatINR = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN");

export const discountPercent = (price: number, mrp: number) =>
  Math.round(((mrp - price) / mrp) * 100);

/* ============================================================
   OFFERS & REWARDS — for Product Detail Page
   ============================================================ */

export type Offer =
  | {
      id: string;
      type: "flash";
      title: string;
      description: string;
      endsAt: number; // epoch ms
      badge: string;
    }
  | {
      id: string;
      type: "bundle";
      title: string;
      description: string;
      items: string[];
      bundlePrice: number;
      originalPrice: number;
      badge: string;
    }
  | {
      id: string;
      type: "coupon";
      code: string;
      title: string;
      description: string;
      discount: string;
      badge: string;
    }
  | {
      id: string;
      type: "bank";
      title: string;
      description: string;
      discount: string;
      badge: string;
    }
  | {
      id: string;
      type: "first-order";
      title: string;
      description: string;
      discount: string;
      badge: string;
    };

export const PRODUCT_OFFERS: Offer[] = [
  {
    id: "o1",
    type: "flash",
    title: "Flash Sale — 22% off",
    description: "Ends soon. Limited stock at this price.",
    endsAt: Date.now() + 1000 * 60 * 60 * 5 + 1000 * 60 * 42, // ~5h 42m from now
    badge: "🔥 Flash",
  },
  {
    id: "o2",
    type: "bundle",
    title: "Complete Stack — Save ₹1,098",
    description: "Gold Isolate + Recovery Matrix + Protein Bars",
    items: ["Huxon Gold Isolate", "Recovery Matrix", "Protein Bars (12-pack)"],
    bundlePrice: 5398,
    originalPrice: 6496,
    badge: "📦 Bundle",
  },
  {
    id: "o3",
    type: "coupon",
    code: "HUXON10",
    title: "10% off your order",
    description: "Apply code HUXON10 at checkout. Min order ₹1,499.",
    discount: "10%",
    badge: "🎫 Coupon",
  },
  {
    id: "o4",
    type: "bank",
    title: "5% instant discount on Axis Bank cards",
    description: "Up to ₹250 off on orders above ₹2,000.",
    discount: "5%",
    badge: "🏦 Bank",
  },
  {
    id: "o5",
    type: "first-order",
    title: "First order? Get ₹200 off",
    description: "Auto-applied at checkout for new customers.",
    discount: "₹200",
    badge: "✨ First",
  },
];

export type ProductReward = {
  basePoints: number;
  tierBonus: number;
  streakBonus: number;
  totalPoints: number;
  unlocks: string[];
};

export function calcProductReward(
  price: number,
  tier: string,
  streak: number
): ProductReward {
  // 1 point per ₹10 spent
  const base = Math.round(price / 10);
  const tierMult =
    tier === "platinum"
      ? 0.15
      : tier === "gold"
      ? 0.12
      : tier === "silver"
      ? 0.08
      : 0.05;
  const tierBonus = Math.round(base * tierMult);
  const streakBonus = streak >= 7 ? 50 : streak >= 3 ? 25 : 0;
  return {
    basePoints: base,
    tierBonus,
    streakBonus,
    totalPoints: base + tierBonus + streakBonus,
    unlocks:
      base + tierBonus + streakBonus > 250
        ? ["Free shipping unlocked", "Early access to new drops"]
        : ["Free shipping unlocked"],
  };
}

export const NUTRITION_HIGHLIGHTS = [
  { label: "Protein Density", value: "90%", icon: "dumbbell" },
  { label: "BCAAs", value: "5.5g", icon: "bolt" },
  { label: "Absorption", value: "96%", icon: "drop" },
  { label: "Sugar", value: "0.4g", icon: "leaf" },
];

export const RATING_BREAKDOWN = [
  { stars: 5, count: 1820, pct: 85 },
  { stars: 4, count: 248, pct: 11 },
  { stars: 3, count: 52, pct: 3 },
  { stars: 2, count: 18, pct: 1 },
  { stars: 1, count: 10, pct: 0 },
];

/* ============================================================
   LAB REPORTS / CERTIFICATE OF ANALYSIS — for PDP
   ============================================================ */

export type LabTest = {
  id: string;
  category: "heavy-metals" | "microbial" | "protein-assay" | "contaminants";
  testName: string;
  result: string;
  unit: string;
  limit: string;
  status: "pass" | "nd"; // pass or "not detected"
};

export const LAB_REPORTS: LabTest[] = [
  // Heavy metals
  { id: "hm1", category: "heavy-metals", testName: "Lead (Pb)", result: "ND", unit: "ppm", limit: "< 0.5", status: "nd" },
  { id: "hm2", category: "heavy-metals", testName: "Arsenic (As)", result: "ND", unit: "ppm", limit: "< 0.3", status: "nd" },
  { id: "hm3", category: "heavy-metals", testName: "Cadmium (Cd)", result: "ND", unit: "ppm", limit: "< 0.1", status: "nd" },
  { id: "hm4", category: "heavy-metals", testName: "Mercury (Hg)", result: "ND", unit: "ppm", limit: "< 0.1", status: "nd" },
  // Microbial
  { id: "mb1", category: "microbial", testName: "Total Plate Count", result: "120", unit: "CFU/g", limit: "< 10,000", status: "pass" },
  { id: "mb2", category: "microbial", testName: "E. coli", result: "Absent", unit: "/ 25g", limit: "Absent", status: "pass" },
  { id: "mb3", category: "microbial", testName: "Salmonella", result: "Absent", unit: "/ 25g", limit: "Absent", status: "pass" },
  { id: "mb4", category: "microbial", testName: "Yeast & Mould", result: "40", unit: "CFU/g", limit: "< 100", status: "pass" },
  // Protein assay
  { id: "pa1", category: "protein-assay", testName: "Protein Content (Dumas)", result: "90.2", unit: "%", limit: "≥ 85", status: "pass" },
  { id: "pa2", category: "protein-assay", testName: "Amino Acid Score", result: "1.0", unit: "PDCAAS", limit: "≥ 1.0", status: "pass" },
  { id: "pa3", category: "protein-assay", testName: "Solubility", result: "98", unit: "%", limit: "≥ 95", status: "pass" },
  // Contaminants
  { id: "ct1", category: "contaminants", testName: "Melamine", result: "ND", unit: "ppm", limit: "< 2.5", status: "nd" },
  { id: "ct2", category: "contaminants", testName: "Pesticide Residue", result: "ND", unit: "ppm", limit: "MRL", status: "nd" },
  { id: "ct3", category: "contaminants", testName: "Aflatoxin B1", result: "ND", unit: "ppb", limit: "< 5", status: "nd" },
];

export const CERTIFICATIONS = [
  { id: "cert1", name: "FSSAI", license: "10024031000234", image: "shield" },
  { id: "cert2", name: "ISO 22000:2018", license: "HXL-ISO-2024", image: "certificate" },
  { id: "cert3", name: "GMP Certified", license: "GMP-IN-2023-0891", image: "check" },
  { id: "cert4", name: "NABL Accredited", license: "LAB-NABL-1145", image: "flask" },
  { id: "cert5", name: "Vegan Society", license: "VS-IND-44820", image: "leaf" },
  { id: "cert6", name: "Halal India", license: "HI-2024-1129", image: "check" },
];

/* ============================================================
   Q&A — Customer Questions for PDP
   ============================================================ */

export type QA = {
  id: string;
  question: string;
  answer: string;
  author: string;
  date: string;
  helpful: number;
  answeredBy: "verified" | "brand";
};

export const PRODUCT_QAS: QA[] = [
  {
    id: "qa1",
    question: "Is this safe for people with lactose intolerance?",
    answer: "Absolutely. Our Gold Isolate is 100% plant-based (pea + rice), contains zero dairy, and is produced in a dairy-free facility. It's ideal for lactose-intolerant and vegan consumers.",
    author: "Sneha I.",
    date: "3 weeks ago",
    helpful: 28,
    answeredBy: "brand",
  },
  {
    id: "qa2",
    question: "How does this compare to whey protein for muscle building?",
    answer: "Our pea + sprouted rice blend achieves a PDCAAS of 1.0, matching whey's amino acid score. Independent studies show equivalent muscle protein synthesis. We add DigeZyme® enzymes for maximum absorption. Honestly, you won't notice a difference in results.",
    author: "Rohan K.",
    date: "1 month ago",
    helpful: 45,
    answeredBy: "verified",
  },
  {
    id: "qa3",
    question: "Can I mix this with hot water or only cold?",
    answer: "Both work! Cold water or plant milk gives the best flavor. Hot water (up to 70°C) is fine and won't denature the protein. Avoid boiling water. Try it with oat milk and a banana for a killer smoothie.",
    author: "Priya S.",
    date: "2 weeks ago",
    helpful: 19,
    answeredBy: "verified",
  },
  {
    id: "qa4",
    question: "What's the shelf life after opening?",
    answer: "12 months unopened (see date on tub). After opening, consume within 90 days for best freshness — our nitrogen-flushed packaging keeps it stable. The desiccant pack inside absorbs moisture.",
    author: "Customer Care",
    date: "1 week ago",
    helpful: 12,
    answeredBy: "brand",
  },
  {
    id: "qa5",
    question: "Does it contain any artificial sweeteners or colors?",
    answer: "No. We use only stevia and monk fruit for sweetness. Zero sucralose, aspartame, or artificial colors/flavors. The cocoa color comes from real Belgian cocoa powder.",
    author: "Arjun M.",
    date: "5 days ago",
    helpful: 8,
    answeredBy: "verified",
  },
];

/* ============================================================
   RECIPES / USAGE IDEAS — for PDP
   ============================================================ */

export type Recipe = {
  id: string;
  title: string;
  category: "smoothie" | "breakfast" | "pre-workout" | "dessert";
  prepTime: string;
  difficulty: "Easy" | "Medium";
  calories: number;
  protein: number;
  servings: number;
  ingredients: string[];
  steps: string[];
  emoji: string;
  accent: string;
};

export const PRODUCT_RECIPES: Recipe[] = [
  {
    id: "r1",
    title: "Belgian Cocoa Power Smoothie",
    category: "smoothie",
    prepTime: "3 min",
    difficulty: "Easy",
    calories: 320,
    protein: 35,
    servings: 1,
    ingredients: [
      "1 scoop Huxon Gold Isolate",
      "1 frozen banana",
      "250ml oat milk",
      "1 tbsp peanut butter",
      "1 tsp cocoa powder",
      "Ice cubes",
    ],
    steps: [
      "Add all ingredients to a blender",
      "Blend on high for 45 seconds until smooth",
      "Pour into a chilled glass and enjoy",
    ],
    emoji: "🥤",
    accent: "oklch(0.78 0.13 75)",
  },
  {
    id: "r2",
    title: "Protein Overnight Oats",
    category: "breakfast",
    prepTime: "5 min + overnight",
    difficulty: "Easy",
    calories: 410,
    protein: 32,
    servings: 1,
    ingredients: [
      "1 scoop Huxon Gold Isolate",
      "40g rolled oats",
      "150ml almond milk",
      "1 tbsp chia seeds",
      "1 tsp honey",
      "Berries for topping",
    ],
    steps: [
      "Mix oats, chia seeds, and protein powder in a jar",
      "Add almond milk and honey, stir well",
      "Refrigerate overnight (min 6 hours)",
      "Top with berries in the morning",
    ],
    emoji: "🥣",
    accent: "oklch(0.72 0.10 65)",
  },
  {
    id: "r3",
    title: "Pre-Workout Energy Bowl",
    category: "pre-workout",
    prepTime: "5 min",
    difficulty: "Easy",
    calories: 280,
    protein: 28,
    servings: 1,
    ingredients: [
      "1 scoop Huxon Gold Isolate",
      "1 medium banana, sliced",
      "2 tbsp Greek yogurt",
      "1 tbsp granola",
      "Drizzle of honey",
    ],
    steps: [
      "Layer banana slices in a bowl",
      "Mix protein powder with 2 tbsp water, drizzle over banana",
      "Add yogurt, granola, and honey",
      "Eat 45-60 min before workout",
    ],
    emoji: "🍌",
    accent: "oklch(0.65 0.15 30)",
  },
  {
    id: "r4",
    title: "Chocolate Protein Mug Cake",
    category: "dessert",
    prepTime: "2 min",
    difficulty: "Easy",
    calories: 240,
    protein: 26,
    servings: 1,
    ingredients: [
      "1 scoop Huxon Gold Isolate",
      "1 egg",
      "1 tbsp cocoa powder",
      "1/2 tsp baking powder",
      "1 tsp stevia",
      "1 tbsp dark chocolate chips",
    ],
    steps: [
      "Mix all ingredients in a microwave-safe mug",
      "Microwave on high for 60-90 seconds",
      "Let cool for 1 minute",
      "Top with chocolate chips and enjoy warm",
    ],
    emoji: "🍰",
    accent: "oklch(0.55 0.08 50)",
  },
];
