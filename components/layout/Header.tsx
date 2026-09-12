import Link from "next/link";
import { MobileNav } from "@/components/layout/MobileNav";

export const NAV_ITEMS = [
  { href: "/", label: "홈" },
  { href: "/treatments", label: "시술 안내" },
  { href: "/practitioners", label: "원장 소개" },
  { href: "/location", label: "오시는 길" },
] as const;

export function Header() {
  return (
    <header className="border-border bg-background border-b">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-foreground focus-visible:ring-ring text-lg font-semibold tracking-tight break-keep focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          봄빛 피부과의원
        </Link>
        <nav
          aria-label="주요 메뉴"
          className="hidden items-center gap-8 md:flex"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground hover:text-primary focus-visible:ring-ring text-sm break-keep transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="md:hidden">
          <MobileNav items={NAV_ITEMS} />
        </div>
      </div>
    </header>
  );
}
