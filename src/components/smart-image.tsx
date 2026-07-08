"use client";

import * as React from "react";
import Image from "next/image";

/**
 * SmartImage — optimized image with blur placeholder + lazy loading.
 * Uses next/image for automatic format conversion, resizing, and caching.
 * Falls back gracefully if the image fails to load.
 */
export function SmartImage({
  src,
  alt,
  width,
  height,
  fill,
  className,
  priority = false,
  sizes,
  quality = 85,
  style,
  onClick,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  const [error, setError] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  if (error || !src) {
    return (
      <div
        className={className}
        style={{
          width: fill ? "100%" : width,
          height: fill ? "100%" : height,
          ...style,
        }}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      className={className}
      priority={priority}
      sizes={sizes || "(max-width: 460px) 100vw, 460px"}
      quality={quality}
      style={style}
      onClick={onClick}
      onError={() => setError(true)}
      onLoad={() => setLoaded(true)}
      loading={priority ? "eager" : "lazy"}
      placeholder="empty"
    />
  );
}
