import { useEffect, type RefObject } from "react";

/**
 * Locks body scroll while the chat is mounted and, on mobile, shifts the chat
 * up so the composer stays above the on-screen keyboard (via visualViewport).
 */
export function useChatViewport(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = rootRef.current;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const vv = window.visualViewport;

    function onResize() {
      if (!vv || !el) return;
      const offset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      el.style.transform = offset > 0 ? `translateY(-${offset}px)` : "";
    }

    vv?.addEventListener("resize", onResize);
    vv?.addEventListener("scroll", onResize);
    return () => {
      document.body.style.overflow = prevOverflow;
      vv?.removeEventListener("resize", onResize);
      vv?.removeEventListener("scroll", onResize);
      if (el) el.style.transform = "";
    };
  }, [rootRef]);
}
