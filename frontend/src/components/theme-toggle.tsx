"use client"

import { useCallback, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string,
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const setTheme = useCallback((theme: "light" | "dark") => {
    document.documentElement.classList[theme === "dark" ? "add" : "remove"]("dark");

    try {
      window.localStorage.setItem("theme", theme);
    } catch { }
  }, []);

  const initTheme = useCallback(() => {
    let preferredTheme: string | null = null;

    try {
      preferredTheme = window.localStorage.getItem("theme");
    } catch { }

    if (preferredTheme === "light" || preferredTheme === "dark") {
      setTheme(preferredTheme);
      return;
    }

    const watchSystemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    watchSystemTheme.addEventListener("change", (e) => {
      setTheme(e.matches ? "dark" : "light");
    });

  }, [setTheme]);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <div className={cn("flex items-center h-7 w-7 w-max", className)}>
      <div
        aria-label="Use dark theme"
        aria-hidden="true"
        className="flex dark:hidden"
        onClick={() => setTheme("dark")}
      >
        <Sun className="h-full w-full transition-all" />
      </div>
      <div
        aria-label="Use light theme"
        aria-hidden="true"
        className="hidden dark:flex"
        onClick={() => setTheme("light")}
      >
        <Moon className="h-full w-full transition-all" />
      </div>
    </div >
  );
}