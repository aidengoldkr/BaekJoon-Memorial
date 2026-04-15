import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Good Bye! BaekJoon! - 백준 추모관",
  description:
    "16년간 대한민국 개발 생태계의 뿌리가 되어준 백준 온라인 저지의 마지막을 기록합니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
