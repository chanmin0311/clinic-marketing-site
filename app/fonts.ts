import localFont from "next/font/local";

// Self-hosted Pretendard Variable, subset to the glyphs actually used in the
// current page copy (research.md §2). Regenerate
// public/fonts/PretendardVariable-subset.woff2 with fontTools.subset whenever
// new Korean copy introduces glyphs outside the current subset — see
// specs/001-clinic-marketing-site/research.md §2.
export const pretendard = localFont({
  src: "../public/fonts/PretendardVariable-subset.woff2",
  variable: "--font-pretendard",
  weight: "45 930",
  display: "swap",
});
