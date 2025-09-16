import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scroll to top on every route change.
 * - Disables browser scroll restoration
 * - Handles #hash links
 * - Resets window and (optionally) a custom scroller with id="app-scroll"
 * - Runs now, next tick, and next frame to beat layout shifts
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const reset = () => {
      // If navigating to a hash, scroll to that element instead.
      if (hash) {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ block: "start", inline: "nearest", behavior: "auto" });
          return;
        }
      }

      // Window/document
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Optional custom scroll container
      const scroller = document.getElementById("app-scroll");
      if (scroller) scroller.scrollTo(0, 0);
    };

    // Run immediately, on next tick, and on next frame.
    reset();
    const t = setTimeout(reset, 0);
    const r = requestAnimationFrame(reset);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(r);
    };
  }, [pathname, hash]);

  return null;
}
