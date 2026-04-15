import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { CountdownTimer } from '@/components/CountdownTimer';
import { FloatingMessages } from '@/components/FloatingMessages';
import { GuestbookForm } from '@/components/GuestbookForm';
import { auth } from '@/lib/auth';
import { getGuestbookEntries } from '@/app/actions/guestbook';
import { getMyProfile } from '@/app/actions/profile';
import styles from './page.module.css';

export default async function LandingPage() {
  const [session, entries] = await Promise.all([
    auth(),
    getGuestbookEntries(),
  ]);

  // 최초 로그인: 프로필 미등록 → 마이페이지로 이동
  if (session?.user?.email) {
    const profile = await getMyProfile();
    if (!profile) redirect('/mypage');
  }

  const floatingMessages = entries.length > 0
    ? entries.map(e => e.content)
    : undefined;

  return (
    <main className={styles.main}>
      {/* 1. 배경: 플로팅 메시지 */}
      <div className={styles.floatingBackground}>
        <FloatingMessages messages={floatingMessages} />
      </div>

      {/* 2. 히어로 섹션 */}
      <section className={styles.heroSection}>
        <p className={styles.eyebrow}>2010 — 2026 · Baekjoon Online Judge</p>

        <h1 className={styles.title}>
          Good Bye!
          <Image
            src="/logo.webp"
            alt="BOJ"
            width={120}
            height={120}
            className={styles.titleLogo}
            priority
          />
        </h1>

        <div className={styles.countdownWrapper}>
          <p className={styles.countdownLabel}>서비스 종료까지</p>
          <CountdownTimer targetDate="2026-04-28T00:00:00" />
        </div>

        <p className={styles.description}>
          16년간 대한민국 알고리즘 문제풀이의 뿌리가 되어준 백준 온라인 저지.<br />
          수만 번의 '맞았습니다!!'와 함께 성장한 우리들의 마지막 봄을 기록합니다.
        </p>

        <div className={styles.ctaGroup}>
          <Link href="#guestbook" className={styles.ctaButton}>
            방명록 남기기 ↓
          </Link>
        </div>

        <div className={styles.footer}>
          <a
            href="https://www.acmicpc.net/board/view/165799"
            target="_blank"
            className={styles.footerLink}
          >
            백준 공식 문서 →
          </a>
          <a
            href="https://help.solved.ac/ko/updates/260415"
            target="_blank"
            className={styles.footerLink}
          >
            solved.ac 공식 문서
          </a>
        </div>
      </section>

      {/* 3. 방명록 섹션 */}
      <section id="guestbook" className={styles.guestbookSection}>
        <div className={styles.guestbookInner}>
          <h2 className={styles.guestbookTitle}>방명록</h2>
          <p className={styles.guestbookSubtitle}>
            백준에게 마지막 한마디를 남겨주세요.
          </p>
          <GuestbookForm
            initialEntries={entries}
            userEmail={session?.user?.email ?? null}
          />
        </div>
      </section>
    </main>
  );
}
