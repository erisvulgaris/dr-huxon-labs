"use client";

import * as React from "react";

// Analytics event types
type AnalyticsEvent =
  | "page_view"
  | "add_to_cart"
  | "remove_from_cart"
  | "begin_checkout"
  | "purchase"
  | "add_to_wishlist"
  | "remove_from_wishlist"
  | "search"
  | "select_item"
  | "view_item"
  | "complete_registration"
  | "earn_reward"
  | "share"
  | "begin_challenge"
  | "log_protein";

type EventParams = Record<string, string | number | boolean | undefined>;

/**
 * Track an analytics event.
 * In production, this would send to GA4/GTM/posthog.
 * For now, logs to console and stores locally.
 */
export function trackEvent(event: AnalyticsEvent, params?: EventParams) {
  const data = {
    event,
    ...params,
    timestamp: Date.now(),
    page: typeof window !== "undefined" ? window.location.pathname : "/",
  };

  // Log in development
  if (process.env.NODE_ENV === "development") {
    console.log("[analytics]", data);
  }

  // Store locally for admin analytics
  if (typeof window !== "undefined") {
    try {
      const stored = JSON.parse(localStorage.getItem("huxon-analytics") || "[]");
      stored.push(data);
      // Keep only last 100 events
      if (stored.length > 100) stored.shift();
      localStorage.setItem("huxon-analytics", JSON.stringify(stored));
    } catch {}
  }

  // In production: send to GA4
  // if (typeof window !== "undefined" && (window as any).gtag) {
  //   (window as any).gtag("event", event, params);
  // }
}

/**
 * Track page view on route change.
 */
export function trackPageView(route: string) {
  trackEvent("page_view", { page_path: route });
}

/**
 * Track add to cart.
 */
export function trackAddToCart(productId: string, productName: string, price: number, quantity: number) {
  trackEvent("add_to_cart", {
    item_id: productId,
    item_name: productName,
    value: price * quantity,
    currency: "INR",
    quantity,
  });
}

/**
 * Track purchase.
 */
export function trackPurchase(orderId: string, total: number, items: { id: string; name: string; price: number; quantity: number }[]) {
  trackEvent("purchase", {
    transaction_id: orderId,
    value: total,
    currency: "INR",
    items: items.length,
  });
}

/**
 * Get stored analytics events (for admin panel).
 */
export function getAnalyticsEvents(): typeof trackedEvents {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("huxon-analytics") || "[]");
  } catch {
    return [];
  }
}

const trackedEvents: any[] = [];
