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
      className="flex flex-col sm:flex-row group justify-center items-center align-center w-full p-8 focus:outline-none"
      onClick={() => setShowLoginTip(false)}
    >
      <Info className="h-4 w-4 stroke-gray-500" />
      <span className="text-sm text-muted-foreground text-center p-2">
        Login to synchronize to-dos between devices
      </span>
      <span className="block sm:hidden text-sm text-muted-foreground text-center p-2">
        Click to hide
      </span>
      <div className="hidden sm:block sm:invisible group-hover:visible group-focus:visible p-2">
        <X className="h-4 w-4 stroke-gray-500 stroke-2" />
      </div>
    </button>
  ) : null;
}