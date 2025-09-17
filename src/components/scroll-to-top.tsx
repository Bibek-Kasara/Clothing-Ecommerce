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
    // Disable the browser's native scroll restoration behavior
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Function to handle the scroll reset
    const reset = () => {
      // If navigating to a hash, scroll to that element instead
      if (hash) {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ block: "start", inline: "nearest", behavior: "smooth" });
          return;
        }
      }

      // Scroll to the top of the window/document
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;

      // Optional: If you have a custom scroll container, scroll it to the top
      const scroller = document.getElementById("app-scroll");
      if (scroller) scroller.scrollTo(0, 0);
    };

    // Reset immediately, on the next tick, and on the next frame to handle layout shifts
    reset();
    const t = setTimeout(reset, 0);
    const r = requestAnimationFrame(reset);

    // Cleanup timeout and animation frame on component unmount
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(r);
    };
  }, [pathname, hash]); // Run when either pathname or hash changes

  return null;
}
