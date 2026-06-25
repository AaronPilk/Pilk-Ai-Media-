"use client";

import { useEffect, useState } from "react";

export type Attribution = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  landingPage: string;
  referrer: string;
  gclid: string;
  fbclid: string;
};

const EMPTY: Attribution = {
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmContent: "",
  utmTerm: "",
  landingPage: "",
  referrer: "",
  gclid: "",
  fbclid: "",
};

const KEY = "pilk-attribution";

/** Captures + persists campaign attribution for the session. */
export function useUTMParameters(): Attribution {
  const [attr, setAttr] = useState<Attribution>(EMPTY);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(KEY);
      if (stored) {
        setAttr(JSON.parse(stored) as Attribution);
        return;
      }
    } catch {
      /* ignore */
    }

    const params = new URLSearchParams(window.location.search);
    const next: Attribution = {
      utmSource: params.get("utm_source") ?? "",
      utmMedium: params.get("utm_medium") ?? "",
      utmCampaign: params.get("utm_campaign") ?? "",
      utmContent: params.get("utm_content") ?? "",
      utmTerm: params.get("utm_term") ?? "",
      landingPage: window.location.pathname + window.location.search,
      referrer: document.referrer ?? "",
      gclid: params.get("gclid") ?? "",
      fbclid: params.get("fbclid") ?? "",
    };

    setAttr(next);
    try {
      sessionStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  return attr;
}
