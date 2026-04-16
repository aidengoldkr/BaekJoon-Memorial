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


  return (
    <main className={styles.main}>
      {/* 1. 배경: 플로팅 메시지 */}
      <div className={styles.floatingBackground}>
        <FloatingMessages entries={entries} />
      </div>

      {/* 2. 히어로 섹션 */}
      <section className={styles.heroSection}>

        <h1 className={styles.title}>
          Good Bye!
          <Image
            src="/asset/logo.png"
            alt="BOJ"
            width={240}
            height={240}
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
          수만 번의 '맞았습니다!!'와 함께 성장한 우리들의 마지막 봄을 기록하며.
        </p>
        <div className={styles.guestbookInner}>
          <div className={styles.guestbookHeader}>
            <h2 className={styles.guestbookTitle}>방명록</h2>
            <p className={styles.guestbookSubtitle}>
              지금까지 {entries.length.toLocaleString()}개의 방명록이 남겨졌어요!
            </p>
          </div>
          <GuestbookForm
            initialEntries={entries}
            userEmail={session?.user?.email ?? null}
          />
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
    </main>
  );
}
