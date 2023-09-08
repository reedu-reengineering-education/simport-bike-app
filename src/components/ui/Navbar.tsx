"use client";
import {
  AcademicCapIcon,
  BellIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { cx } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";

const pages = [
  {
    href: "/",
    icon: AcademicCapIcon,
  },
  {
    href: "/notifications",
    icon: BellIcon,
  },
  {
    href: "/alerts",
    icon: ExclamationTriangleIcon,
  },
];

const Navbar = () => {
  const pathName = usePathname();

  return (
    <div className="flex justify-evenly sticky bottom-0 w-full gap-2 py-4 border-t">
      {pages.map(({ href, icon: Icon }) => (
        <Link href={href} key={href}>
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
