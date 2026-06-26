"use client";

import { useEffect } from "react";

/**
 * Guards against the React "removeChild / insertBefore — node is not a child"
 * crash that happens during client-side navigation when a library (GSAP pinning,
 * Lenis, browser translate, etc.) moves DOM nodes outside React's knowledge.
 * The patched methods no-op safely instead of throwing when the node isn't where
 * React expects it. Industry-standard fix; runs once.
 */
export function DomPatch() {
  useEffect(() => {
    const flagHost = window as unknown as { __pilkDomPatched?: boolean };
    if (flagHost.__pilkDomPatched) return;
    flagHost.__pilkDomPatched = true;

    const proto = Node.prototype as unknown as {
      removeChild: <T extends Node>(child: T) => T;
      insertBefore: <T extends Node>(node: T, ref: Node | null) => T;
    };

    const originalRemoveChild = proto.removeChild;
    proto.removeChild = function <T extends Node>(this: Node, child: T): T {
      if (child.parentNode !== this) {
        return child;
      }
      return originalRemoveChild.call(this, child) as T;
    };

    const originalInsertBefore = proto.insertBefore;
    proto.insertBefore = function <T extends Node>(
      this: Node,
      newNode: T,
      referenceNode: Node | null
    ): T {
      if (referenceNode && referenceNode.parentNode !== this) {
        return newNode;
      }
      return originalInsertBefore.call(this, newNode, referenceNode) as T;
    };
  }, []);

  return null;
}
