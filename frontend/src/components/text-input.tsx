"use client"

import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Textarea with automatic width and height adjustment to fill the available
// width. Custom hooks and callbacks are used instead of `field-sizing-content`
// for this component to also function in Firefox and Safari.
export function TextInput({ className, ...props }: React.ComponentProps<"textarea">) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const setAutoHeight = useCallback((elem: HTMLTextAreaElement | null) => {
    if (!elem) return;
    elem.style.height = "auto";
    elem.style.height = elem.scrollHeight + "px";
  }, []);

  useEffect(() => {
    const handleSetAutoHeight = () => setAutoHeight(ref.current);
    handleSetAutoHeight();

    window.addEventListener("resize", handleSetAutoHeight);
    return () => {
      window.removeEventListener("resize", handleSetAutoHeight);
    }
  }, [setAutoHeight, ref])

  return (
    <textarea
      ref={ref}
      data-slot="textarea"
      rows={1}
      onInput={e => setAutoHeight(e.currentTarget)}
      className={
        cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground border-input min-w-0 rounded-md px-3 py-1 text-base transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-hidden w-full",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )
      }
      {...props}
    />
  );
}