import Link from 'next/link';
import { CountdownTimer } from '@/components/CountdownTimer';
import { MessageMarquee } from '@/components/MessageMarquee';
import styles from './page.module.css';

export default function LandingPage() {
  return (
    <main className={styles.main}>
      {/* 1. 배경: 방명록 마키 */}
      <div className={styles.marqueeBackground}>
        <MessageMarquee speed="slow" direction="left" />
        <MessageMarquee speed="fast" direction="right" />
        <MessageMarquee speed="normal" direction="left" />
      </div>

      {/* 2. 메인 컨텐츠 섹션 */}
      <section className={styles.heroSection}>
        {/* 히어로 타이틀 */}
        <h1 className={styles.title}>
          Good Bye! <span className={styles.titleAccent}>BOJ!</span>
        </h1>

        {/* 섭종 카운트다운 */}
        <div className={styles.countdownWrapper}>
          <CountdownTimer targetDate="2026-04-28T00:00:00" />
        </div>

        {/* 헌정 문구 */}
        <p className={styles.description}>
          16년간 대한민국 알고리즘 문제풀이의 뿌리가 되어준 백준 온라인 저지.<br />
          수만 번의 '맞았습니다!!'와 함께 성장한 우리들의 마지막 푸른 봄을 기록합니다.
        </p>

        {/* CTA 버튼 */}
        <div className={styles.ctaGroup}>
          <Link href="/login" className={styles.ctaButton}>
            로그인하고 방명록 남기기
          </Link>
        </div>

        {/* 하단 공식 링크 영역 */}
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
