import { useEffect, useLayoutEffect } from "react";

/**
 * useLayoutEffect on the client (so GSAP/ScrollTrigger cleanup runs synchronously
 * BEFORE React unmounts the DOM — preventing leftover pin-spacers on navigation),
 * useEffect on the server (avoids the SSR warning).
 */
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
