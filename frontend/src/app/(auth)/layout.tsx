"use client"

import Link from "next/link";

import { siteConfig } from "@/config/site";

import { Github } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";

import StoreProvider from "@/components/store-provider";
import { usePathname, useRouter } from "next/navigation";

export default function TasksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  const navName = pathname === "/login" ? "Register" : "Login";
  const navTo = pathname === "/login" ? "/register" : "/login";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 w-full border-b bg-background">
        <div className="flex h-16 items-center space-x-0 sm:space-x-4 sm:justify-between px-4 lg:px-32">
          <div className="container flex flex-1 px-2">
            <MainNav />
          </div>
          <nav className="flex flex-1 justify-between sm:justify-end">
            <Button
              className="font-sans"
              variant="ghost"
              onClick={() => router.push(navTo)}
            >
              {navName}
            </Button>
          </nav>
          <div className="flex items-center">
            <nav>
              <Link
                className="px-2"
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </nav>
            <ThemeToggle className="px-2" />
          </div>
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center align-center justify-center">
        <StoreProvider>
          {children}
        </StoreProvider>
      </main>
    </div >
  );
}