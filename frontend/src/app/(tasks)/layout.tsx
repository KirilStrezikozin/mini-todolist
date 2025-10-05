"use client"

import { SessionProvider } from "next-auth/react";

export default function TasksLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <SessionProvider>
        {children}
      </SessionProvider>
    </div >
  );
}