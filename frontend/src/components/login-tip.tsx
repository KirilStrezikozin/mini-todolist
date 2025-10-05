"use client"

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { Info, X } from "lucide-react";

export default function LoginTip() {
  const session = useSession();

  const [showLoginTip, setShowLoginTip] = useState(false);

  useEffect(() => {
    if (session.status === "unauthenticated") setShowLoginTip(true);
  }, [session])

  return showLoginTip ? (
    <button
      className="flex group justify-center items-center align-center w-full p-8 space-x-2"
      onClick={() => setShowLoginTip(false)}
    >
      <Info className="h-6 w-6 sm:h-4 sm:w-4 stroke-gray-500" />
      <span className="text-sm text-muted-foreground text-center">
        Login to synchronize to-dos between devices
      </span>
      <div className="invisible group-hover:visible p-2">
        <X className="h-4 w-4 stroke-gray-500 stroke-2" />
      </div>
    </button>
  ) : null;
}