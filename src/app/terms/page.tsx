import styles from "./terms.module.css";

export const metadata = {
  title: "이용약관 — Good Bye! BOJ!",
};

export default function TermsPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <a href="/" className={styles.backLink}>← 홈으로</a>
        <h1 className={styles.title}>이용약관</h1>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. 목적</h2>
          <p className={styles.text}>
            본 서비스는 2026년 4월 28일 서비스 종료를 앞둔 백준 온라인 저지(Baekjoon Online Judge)를
            추모하기 위한 메모리얼 사이트입니다. 이용자는 Google 계정으로 로그인하여 방명록에 메시지를
            남길 수 있습니다.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. 수집하는 정보</h2>
          <p className={styles.text}>
            Google OAuth를 통한 로그인 시 이메일 주소만 수집됩니다. 닉네임, 티어, 풀어본 문제 수,
            주력 언어는 이용자가 직접 입력하는 선택 정보입니다.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. 게시물 관리</h2>
          <p className={styles.text}>
            방명록에 남긴 메시지는 공개됩니다. 타인을 비방하거나 서비스 취지에 맞지 않는 내용은
            운영자 판단 하에 삭제될 수 있습니다.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. 면책</h2>
          <p className={styles.text}>
            본 서비스는 백준 온라인 저지의 공식 서비스가 아닌 팬 메이드 추모 프로젝트입니다.
          </p>
        </section>
      </div>
    </main>
  );
}
