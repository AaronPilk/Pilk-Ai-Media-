"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

type Theme = "light" | "dark";

function currentTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

/**
 * Light / dark toggle. The real initial theme is applied by the inline script in
 * layout.tsx before paint, so this only reflects + flips it. The user's choice is
 * remembered in localStorage; with no stored choice the OS preference is used.
 */
export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(currentTheme());
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = currentTheme() === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("pilk-theme", next);
    } catch {
      /* private mode — non-fatal */
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", next === "light" ? "#faf9f7" : "#0a0a0b");
    setTheme(next);
  };

  const isLight = mounted && theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      className={`theme-toggle ${className}`}
      aria-label={mounted ? `Switch to ${isLight ? "dark" : "light"} mode` : "Toggle color theme"}
      title="Toggle light / dark mode"
      data-cursor="open"
    >
      {isLight ? <Moon size={17} aria-hidden /> : <Sun size={17} aria-hidden />}
      <span className="sr-only">Toggle light and dark mode</span>
    </button>
  );
}
