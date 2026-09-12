import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "오시는 길",
  description: "위치, 지도, 대중교통, 주차, 진료 시간을 안내합니다.",
};

// TODO: replace with infrastructure/content/site-config.ts once the
// site-config domain/infrastructure layer lands (specs/001-clinic-marketing-site
// tasks T014, T049) — this literal exists only to prove the static-export
// pipeline end to end.
const placeholderAddress = "서울특별시 강남구 (가상 주소 · 상세 위치는 상담 시 안내)";

export default function LocationPage() {
  return (
    <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold leading-snug tracking-tight break-keep md:text-3xl">
        오시는 길
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed tracking-tight break-keep text-muted-foreground">
        {placeholderAddress}
      </p>
    </main>
  );
}
