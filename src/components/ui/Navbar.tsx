"use client";
import {
  AcademicCapIcon,
  BellIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { cx } from "class-variance-authority";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const pathName = usePathname();

  return (
    <div className="flex justify-evenly sticky bottom-0 w-full gap-2 py-4 border">
      <Link href="/home">
        <AcademicCapIcon
          className={cx(
            "w-6 h-6",
            pathName === "/home" ? "text-green-700" : null
          )}
        />
      </Link>
      <Link href="/notifications">
        <BellIcon
          className={cx(
            "w-6 h-6",
            pathName === "/notifications" ? "text-green-700" : null
          )}
        />
      </Link>
      <Link href="/alerts">
        <ExclamationTriangleIcon
          className={cx(
            "w-6 h-6",
            pathName === "/alerts" ? "text-green-700" : null
          )}
        />
      </Link>
    </div>
  );
};

export { Navbar };
