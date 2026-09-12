import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "포트폴리오 데모 클리닉",
  description: "포트폴리오 목적의 가상 미용피부과 데모 사이트입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
