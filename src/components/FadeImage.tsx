"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

/**
 * next/image that fades in once loaded instead of popping in, and zooms
 * gently when its card (`group`) is hovered. Pair with the `img-premium`
 * class rules in globals.css.
 *
 * It only hides an image that is confirmed still loading after hydration, so
 * an image is never left invisible: if it already loaded (cached, or before
 * JS ran), or it fails, it simply shows.
 */
export function FadeImage({ className = "", onLoad, onError, ...props }: ImageProps) {
  const ref = useRef<HTMLImageElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const img = ref.current;
    if (img && !img.complete) setLoading(true);
  }, []);

  return (
    <Image
      {...props}
      ref={ref}
      className={`img-premium ${loading ? "is-loading" : ""} ${className}`}
      onLoad={(e) => {
        setLoading(false);
        onLoad?.(e);
      }}
      onError={(e) => {
        setLoading(false);
        onError?.(e);
      }}
    />
  );
}
