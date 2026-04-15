import type { Metadata } from "next";
import "./globals.css";
import { auth } from "@/lib/auth";
import { getProfileByEmail } from "@/app/actions/profile";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { QueryProvider } from "@/components/QueryProvider";

export const metadata: Metadata = {
  title: "Good Bye! BOJ! - 백준 메모리얼",
  description:
    "16년간 대한민국 개발 생태계의 뿌리가 되어준 백준 온라인 저지의 마지막을 기록합니다.",
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
