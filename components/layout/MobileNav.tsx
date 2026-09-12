"use client";

import Link from "next/link";
import { MenuIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

/**
 * Mobile navigation sheet. Receives its items as props — no infrastructure
 * import here (contexts/architecture.md §2, layer boundary).
 */
export function MobileNav({
  items,
}: {
  items: readonly { href: string; label: string }[];
}) {
  return (
    <Dialog>
      <DialogTrigger
        render={<Button variant="ghost" size="icon" aria-label="메뉴 열기" />}
      >
        <MenuIcon aria-hidden="true" />
      </DialogTrigger>
      <DialogContent className="top-0 right-0 left-auto h-full max-w-xs translate-x-0 translate-y-0 rounded-none">
        <DialogTitle>메뉴</DialogTitle>
        <nav aria-label="주요 메뉴" className="flex flex-col gap-4">
          {items.map((item) => (
            <DialogClose
              key={item.href}
              render={
                <Link
                  href={item.href}
                  className="text-foreground hover:text-primary focus-visible:ring-ring text-base break-keep transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                />
              }
            >
              {item.label}
            </DialogClose>
          ))}
        </nav>
      </DialogContent>
    </Dialog>
  );
}
