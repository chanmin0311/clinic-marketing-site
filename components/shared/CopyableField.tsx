"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Generic single-interaction copy-to-clipboard field (FR-004). Reused for
 * the phone number (US2) and the address (US4) — the value itself and any
 * link behaviour (tel:, etc.) are supplied by the caller via `href`.
 */
export function CopyableField({
  value,
  label,
  href,
  className,
}: {
  value: string;
  label: string;
  href?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access can fail (permissions, insecure context) — the
      // value is still visible and selectable, so there is no hard failure.
    }
  }

  const displayed = href ? (
    <a href={href} className="hover:underline">
      {value}
    </a>
  ) : (
    <span>{value}</span>
  );

  return (
    <div className={cn("inline-flex items-center gap-2 break-keep", className)}>
      {displayed}
      <button
        type="button"
        onClick={handleCopy}
        aria-label={`${label} 복사`}
        className="focus-visible:ring-ring focus-visible:ring-offset-background text-primary hover:bg-blush rounded-full p-1.5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        {copied ? (
          <CheckIcon aria-hidden="true" className="size-4" />
        ) : (
          <CopyIcon aria-hidden="true" className="size-4" />
        )}
        <span className="sr-only">{copied ? "복사됨" : `${label} 복사`}</span>
      </button>
    </div>
  );
}
