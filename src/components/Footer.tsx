import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        {/* 브랜드 */}
        <div className={styles.brand}>
          <p className={styles.brandName}>Good Bye! BOJ!</p>
          <p className={styles.brandDesc}>
            16년간 대한민국 알고리즘 문화를 이끌어온 백준 온라인 저지를 기억합니다.
          </p>
        </div>

        {/* 링크 그룹 */}
        <div className={styles.links}>
          <div className={styles.linkGroup}>
            <p className={styles.linkGroupTitle}>사이트</p>
            <a href="/" className={styles.link}>홈</a>
            <a href="/guestbook" className={styles.link}>전체 방명록</a>
            <a href="/terms" className={styles.link}>이용약관</a>
          </div>

          <div className={styles.linkGroup}>
            <p className={styles.linkGroupTitle}>공식 링크</p>
            <a
              href="https://www.acmicpc.net/board/view/165799"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              백준 공지사항 →
            </a>
            <a
              href="https://help.solved.ac/ko/updates/260415"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              solved.ac 공지사항 →
            </a>
          </div>
        </div>

      </div>

      {/* 하단 바 */}
      <div className={styles.bottom}>
        <p className={styles.copyright}>© 2026 Good Bye! BOJ! — 팬 메이드 추모 프로젝트</p>
        <p className={styles.disclaimer}>백준 온라인 저지의 공식 서비스가 아닙니다.</p>
      </div>
    </footer>
  );
}
