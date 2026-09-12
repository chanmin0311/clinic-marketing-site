import Link from "next/link";
import type { LegalDisclosureProfile } from "@/domain/site-config/types";

/**
 * Full legal disclosure set (FR-024) on every page. Receives its data as
 * props from the route/layout layer — never imports infrastructure directly
 * (contexts/architecture.md §2, layer boundary).
 */
export function Footer({
  legalDisclosure,
}: {
  legalDisclosure: LegalDisclosureProfile;
}) {
  return (
    <footer className="border-border bg-background border-t">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-foreground text-sm leading-relaxed font-medium break-keep">
          {legalDisclosure.demoNoticeText}
        </p>
        <dl className="text-muted-foreground mt-6 grid gap-2 text-sm leading-relaxed break-keep sm:grid-cols-2">
          <div className="flex gap-2">
            <dt className="shrink-0">의료기관명</dt>
            <dd>{legalDisclosure.institutionName}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0">원장</dt>
            <dd>{legalDisclosure.directorName}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0">사업자등록번호</dt>
            <dd>{legalDisclosure.businessRegistrationNumber}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0">전화</dt>
            <dd>{legalDisclosure.phone}</dd>
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <dt className="shrink-0">주소</dt>
            <dd>{legalDisclosure.address}</dd>
          </div>
        </dl>
        <Link
          href={legalDisclosure.privacyPolicyHref}
          className="text-foreground hover:text-primary focus-visible:ring-ring mt-6 inline-block text-sm break-keep underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          개인정보처리방침
        </Link>
      </div>
    </footer>
  );
}
