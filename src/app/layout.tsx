import type { Metadata } from "next";
import "./globals.css";
import { auth } from "@/lib/auth";
import { getProfileByEmail } from "@/app/actions/profile";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QueryProvider } from "@/components/QueryProvider";

export const metadata: Metadata = {
  // 메타데이터 기준 URL (OG 이미지 등의 상대 경로를 절대 경로로 변환하는 데 필수)
  metadataBase: new URL("https://goodbye-boj.com"),

  title: {
    default: "Welcome Back, Baekjoon! - 백준 메모리얼",
    template: "%s | Welcome Back, Baekjoon!", // 하위 페이지 발생 시 타이틀 템플릿
  },
  description: "16년간 대한민국 알고리즘 트레이닝의 뿌리가 되어준 백준 온라인 저지(BOJ)가 돌아왔습니다. 우리의 치열했던 알고리즘 풀이 기록과 추억을 남겨주세요.",
  keywords: ["백준", "BOJ", "백준 온라인 저지", "알고리즘", "코딩테스트", "메모리얼", "개발자", "회고", "welcome back baekjoon", "백준 메모리얼"],
  authors: [{ name: "aidengoldkr", url: "https://github.com/aidengoldkr" }],

  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://goodbye-boj.com",
    title: "Welcome Back, Baekjoon! - 백준 메모리얼",
    description: "16년간 대한민국 알고리즘 트레이닝의 뿌리가 되어준 백준 온라인 저지가 돌아왔습니다.",
    siteName: "Welcome Back, Baekjoon!",
    images: [
      {
        url: "/asset/og.png",
        width: 1200,
        height: 630,
        alt: "Welcome Back, Baekjoon! - 백준 메모리얼 오픈그래프 이미지",
      },
    ],
  },

  // 개발자 커뮤니티 공유 시 노출을 위한 트위터 카드 추가
  twitter: {
    card: "summary_large_image",
    title: "Welcome Back, Baekjoon! - 백준 메모리얼",
    description: "16년간 대한민국 알고리즘 트레이닝의 뿌리가 되어준 백준 온라인 저지가 돌아왔습니다.",
    images: ["/asset/og.png"],
  },

};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const userEmail = session?.user?.email ?? null;
  const profile = userEmail ? await getProfileByEmail(userEmail) : null;

  return (
    <html lang="ko">
      <body>
        <Header userEmail={userEmail} profile={profile} />
        <QueryProvider>
          {children}
        </QueryProvider>
        <Footer />
      </body>
    </html>
  );
}
