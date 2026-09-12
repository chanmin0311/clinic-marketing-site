import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "시술 안내",
  description: "시술별 이름, 가격, 소요 시간, 효과, 부작용을 안내합니다.",
};

export default function TreatmentsPage() {
  return (
    <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-2xl leading-snug font-semibold tracking-tight break-keep md:text-3xl">
        시술 안내
      </h1>
    </main>
  );
}
