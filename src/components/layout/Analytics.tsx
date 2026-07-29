"use client";

import Script from "next/script";

const GA = process.env.NEXT_PUBLIC_GA_ID;
const PIXEL = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * Loads GA4 (Google tag) and the Meta Pixel when their IDs are present.
 * Set NEXT_PUBLIC_GA_ID and NEXT_PUBLIC_META_PIXEL_ID in the environment
 * (Cloudflare Pages → Settings → Environment variables). When unset,
 * nothing is rendered. The existing trackEvent() helper (lib/analytics.ts)
 * forwards custom events to window.gtag and window.fbq once these load.
 */
export function Analytics() {
  return (
    <>
      {GA ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA}');`}
          </Script>
        </>
      ) : null}

      {PIXEL ? (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL}');fbq('track','PageView');`}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${PIXEL}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        </>
      ) : null}
    </>
  );
}
