"use client";

import {
  CpuChipIcon,
  GlobeEuropeAfricaIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { cx } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";

const pages = [
  {
    href: "/",
    icon: HomeIcon,
  },
  {
    href: "/device",
    icon: CpuChipIcon,
  },
  {
    href: "/about",
    icon: GlobeEuropeAfricaIcon,
  },
];

const Navbar = () => {
  const pathName = usePathname();

  return (
    <div className="flex justify-evenly sticky bottom-0 w-full gap-2 pb-2 pt-3 border-t">
      {pages.map(({ href, icon: Icon }) => (
        <Link
          href={href}
          key={href}
          className={cx(
            pathName === href ? "bg-muted" : "",
            "rounded-xl px-6 py-1",
          )}
        >
          <Icon
            className={cx(
              "w-6 h-6",
              pathName === href ? "text-primary" : "text-primary/50",
            )}
          />
        </Link>
      ))}
    </div>
  );
};

export { Navbar };
