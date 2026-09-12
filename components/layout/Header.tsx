"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNav } from "@/components/layout/MobileNav";

export const NAV_ITEMS = [
  { href: "/", label: "홈" },
  { href: "/treatments", label: "시술 안내" },
  { href: "/practitioners", label: "원장 소개" },
  { href: "/location", label: "오시는 길" },
] as const;

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-border bg-background border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-foreground hover:text-primary focus-visible:ring-ring text-lg font-semibold tracking-tight break-keep transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          봄빛 피부과의원
        </Link>
        <nav
          aria-label="주요 메뉴"
          className="hidden items-center gap-8 md:flex"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`group focus-visible:ring-ring relative py-1 text-sm break-keep transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none ${
                  isActive
                    ? "text-primary"
                    : "text-foreground hover:text-primary"
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`bg-primary absolute inset-x-0 -bottom-0.5 h-px origin-left transition-transform duration-200 ease-in-out group-hover:scale-x-100 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </nav>
        <div className="md:hidden">
          <MobileNav items={NAV_ITEMS} />
        </div>
      </div>
    </header>
  );
}
