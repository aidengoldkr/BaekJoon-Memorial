import Link from "next/link";
import { getGuestbookPage } from "@/app/actions/guestbook";
import { auth } from "@/lib/auth";
import { GuestbookListClient } from "@/components/GuestbookListClient";
import styles from "./guestbook.module.css";

export const metadata = {
  title: "전체 방명록 — Good Bye! BOJ!",
};

const PAGE_SIZE = 20;

type Sort = "latest" | "likes";

export default async function GuestbookPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const sort: Sort = params.sort === "likes" ? "likes" : "latest";

  const session = await auth();

  const { entries, total } = await getGuestbookPage(page, PAGE_SIZE, sort);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  // 정렬 변경 시 page=1로 초기화
  const sortHref = (s: Sort) => `/guestbook?sort=${s}&page=1`;
  const pageHref = (p: number) => `/guestbook?sort=${sort}&page=${p}`;

  return (
    <main className={styles.main}>
      <div className={styles.inner}>

        {/* 헤더 */}
        <div className={styles.pageHeader}>
          <a href="/" className={styles.backLink}>← 홈으로</a>
          <div className={styles.titleRow}>
            <h1 className={styles.title}>전체 방명록</h1>
            {total > 0 && (
              <span className={styles.count}>{total.toLocaleString()}개</span>
            )}
          </div>
        </div>

        {/* 정렬 탭 */}
        <div className={styles.sortTabs}>
          <Link
            href={sortHref("latest")}
            className={`${styles.sortTab} ${sort === "latest" ? styles.sortTabActive : ""}`}
          >
            최신순
          </Link>
          <Link
            href={sortHref("likes")}
            className={`${styles.sortTab} ${sort === "likes" ? styles.sortTabActive : ""}`}
          >
            ❤️ 좋아요 순
          </Link>
        </div>

        {/* 카드 목록 */}
        <GuestbookListClient
          initialEntries={entries as any}
          initialTotal={total}
          page={page}
          sort={sort}
          pageSize={PAGE_SIZE}
          currentUserEmail={session?.user?.email}
        />

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <nav className={styles.pagination}>
            {page > 1 ? (
              <Link href={pageHref(page - 1)} className={styles.pageBtn}>← 이전</Link>
            ) : (
              <span className={`${styles.pageBtn} ${styles.pageBtnDisabled}`}>← 이전</span>
            )}

            <div className={styles.pageNumbers}>
              {buildPageNumbers(page, totalPages).map((item, i) =>
                item === "…" ? (
                  <span key={`e${i}`} className={styles.ellipsis}>…</span>
                ) : (
                  <Link
                    key={item}
                    href={pageHref(item as number)}
                    className={`${styles.pageNum} ${item === page ? styles.pageNumActive : ""}`}
                  >
                    {item}
                  </Link>
                )
              )}
            </div>

            {page < totalPages ? (
              <Link href={pageHref(page + 1)} className={styles.pageBtn}>다음 →</Link>
            ) : (
              <span className={`${styles.pageBtn} ${styles.pageBtnDisabled}`}>다음 →</span>
            )}
          </nav>
        )}

      </div>
    </main>
  );
}

function buildPageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  if (current > 3) pages.push("…");
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < total - 2) pages.push("…");
  pages.push(total);
  return pages;
}
