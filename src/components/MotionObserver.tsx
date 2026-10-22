"use client";

import { useEffect } from "react";

/**
 * One observer for the whole site that drives scroll reveals (see "Motion
 * system" in globals.css). Mounted once in the root layout.
 *
 * Every [data-reveal] element is checked once, after layout settles:
 * - already on screen: left alone, so its CSS entrance plays undisturbed;
 * - below the fold: armed (hidden while still off screen) and revealed as it
 *   scrolls in.
 *
 * A MutationObserver picks up elements added later, such as a new page after
 * client-side navigation. Users who prefer reduced motion are never armed.
 */
export function MotionObserver() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      },
      // Reveal once the top edge is a little way up from the bottom.
      { rootMargin: "0px 0px -8% 0px", threshold: 0 },
    );

    const pending = new Set<Element>();
    let frame = 0;

    const arm = (el: Element) => {
      if (el.hasAttribute("data-armed") || el.classList.contains("is-revealed")) return;
      const r = el.getBoundingClientRect();
      const onScreen = r.top < window.innerHeight && r.bottom > 0;
      if (onScreen) {
        // Mark as handled; its CSS entrance animation does the work.
        el.classList.add("is-revealed");
        return;
      }
      el.setAttribute("data-armed", "");
      io.observe(el);
    };

    // Wait two frames so the router has restored or reset scroll position
    // before we decide what is on screen.
    const flush = () => {
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          frame = 0;
          pending.forEach(arm);
          pending.clear();
        });
      });
    };

    const queue = (root: ParentNode) => {
      if (root instanceof Element && root.matches("[data-reveal]")) pending.add(root);
      root.querySelectorAll("[data-reveal]").forEach((el) => pending.add(el));
      if (!frame) flush();
    };

    queue(document);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((n) => {
          if (n instanceof Element) queue(n);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      mo.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
}
