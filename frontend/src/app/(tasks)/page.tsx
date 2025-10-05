"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";

import { siteConfig } from "@/config/site";

import { Github } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { TaskListHeader } from "@/components/tasklist/header";
import { TaskList } from "@/components/tasklist/task-list";

import StoreProvider from "@/components/store-provider";
import { signOut, useSession } from "next-auth/react";
import LoginTip from "@/components/login-tip";


export default function Page() {
  const router = useRouter();
  const session = useSession();

  return (
    <>
      <header className="sticky top-0 w-full border-b bg-background">
        <div className="flex h-16 items-center space-x-0 sm:space-x-4 sm:justify-between px-4 lg:px-32">
          <div className="container flex flex-1 px-2">
            <MainNav />
          </div>
          <nav className="flex flex-1 justify-between sm:justify-end">
            <Button
              className="font-sans" variant="ghost"
              onClick={() => {
                if (session.status === "authenticated") signOut();
                else router.push("/login");
              }}
            >
              {session.status === "authenticated" ? "Logout" : "Login"}
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
      <main className="flex-1">
        <StoreProvider>
          <div className="font-sans grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
            <main className="flex flex-col gap-[32px] items-start">
              <LoginTip />
              <TaskListHeader />
              <TaskList />
            </main>
          </div >
        </StoreProvider>
      </main>
    </>
  );
}