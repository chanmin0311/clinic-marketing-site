import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "원장 소개",
  description: "시술을 담당하는 의료진과 자격을 소개합니다.",
};

export default function PractitionersPage() {
  return (
    <main className="flex-1 px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-2xl leading-snug font-semibold tracking-tight break-keep md:text-3xl">
        원장 소개
      </h1>
    </main>
  );
}
