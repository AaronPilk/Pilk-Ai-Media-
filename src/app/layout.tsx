import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { buildMetadata, siteGraph } from "@/lib/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { Cursor } from "@/components/layout/Cursor";
import { Preloader } from "@/components/layout/Preloader";
import { SceneCanvas } from "@/components/canvas/SceneCanvas";
import { DomPatch } from "@/components/layout/DomPatch";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = buildMetadata({});

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

// Runs before first paint: applies the saved theme (or the OS preference) to
// <html data-theme> so there is no flash of the wrong color scheme.
const themeInit = `(function(){try{var t=localStorage.getItem('pilk-theme');if(t!=='light'&&t!=='dark'){t=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches)?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />

        <JsonLd data={siteGraph()} />

        <DomPatch />
        <Preloader />
        <SceneCanvas />
        <div className="grain" aria-hidden="true" />
        <Cursor />

        <Header />
        <SmoothScrollProvider>
          <main id="main">{children}</main>
        </SmoothScrollProvider>
        <Footer />
      </body>
    </html>
  );
}
