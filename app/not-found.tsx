import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:px-6 lg:px-8">
      <h1 className="max-w-2xl text-2xl leading-snug font-semibold tracking-tight break-keep md:text-3xl">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-relaxed tracking-tight break-keep md:text-lg">
        요청하신 페이지가 존재하지 않거나 이동되었습니다.
      </p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring mt-8 inline-flex items-center rounded-full px-6 py-3 break-keep transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        홈으로 돌아가기
      </Link>
    </main>
  );
}
