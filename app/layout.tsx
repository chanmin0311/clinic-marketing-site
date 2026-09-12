import type { Metadata } from "next";
import { pretendard } from "./fonts";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/infrastructure/content/site-config";

export const metadata: Metadata = {
  title: "포트폴리오 데모 클리닉",
  description: "포트폴리오 목적의 가상 미용피부과 데모 사이트입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`h-full antialiased ${pretendard.variable}`}>
      <body className="bg-background text-foreground flex min-h-full flex-col">
        <Header />
        {children}
        <Footer legalDisclosure={siteConfig.legalDisclosure} />
      </body>
    </html>
  );
}
