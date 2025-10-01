import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Logo } from "./icons";

export function MainNav() {
  return (
    <nav>
      <Link
        className="flex align-start items-center"
        href={siteConfig.url}
        target="_self"
      >
        <Logo className="pr-2 h-7 w-7 w-max px-2" />
        <span className="font-mono hidden sm:flex">
          {`${siteConfig.name}`}
        </span>
      </Link>
    </nav>
  );
}