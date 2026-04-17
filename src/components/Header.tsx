"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { TierBadge, getTierLabel } from "@/components/TierBadge";
import styles from "./Header.module.css";

interface Profile {
  nickname: string | null;
  tier: string | null;
  solved_count: number | null;
}

interface Props {
  userEmail: string | null;
  profile: Profile | null;
}

export function Header({ userEmail, profile }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const displayName = profile?.nickname ?? userEmail?.split("@")[0] ?? null;

  return (
    <>
      <button
        className={styles.hamburger}
        onClick={() => setOpen(true)}
        aria-label="메뉴 열기"
      >
        MENU
      </button>

      {open && (
        <div
          className={styles.backdrop}
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside className={`${styles.drawer} ${open ? styles.drawerOpen : ""}`}>
        <button
          className={styles.closeBtn}
          onClick={() => setOpen(false)}
          aria-label="메뉴 닫기"
        >
          ✕
        </button>

        <div className={styles.userSection}>
          {userEmail ? (
            <>
              <div className={styles.nameRow}>
                <TierBadge tier={profile?.tier} size={24} />
                <p className={styles.displayName}>{displayName}</p>
              </div>
              {profile?.tier && (
                <span className={styles.tierLabel}>
                  {getTierLabel(profile.tier)}
                </span>
              )}
              {profile?.solved_count != null && (
                <p className={styles.solvedCount}>
                  {profile.solved_count.toLocaleString()}문제 해결
                </p>
              )}
              <p className={styles.email}>{userEmail}</p>
            </>
          ) : (
            <p className={styles.guestLabel}>로그인 후 방명록을 남겨보세요</p>
          )}
        </div>

        <div className={styles.divider} />

        <nav className={styles.navList}>
          {userEmail ? (
            <a href="/mypage" className={styles.navItem} onClick={() => setOpen(false)}>
              <span className={styles.navIcon}>👤</span>
              마이페이지
            </a>
          ) : (
            <a href="/login" className={styles.navItem} onClick={() => setOpen(false)}>
              <span className={styles.navIcon}>🔑</span>
              로그인
            </a>
          )}
          <a href="/guestbook" className={styles.navItem} onClick={() => setOpen(false)}>
            <span className={styles.navIcon}>📖</span>
            전체 방명록
          </a>
          <a href="/terms" className={styles.navItem} onClick={() => setOpen(false)}>
            <span className={styles.navIcon}>📋</span>
            이용약관
          </a>
        </nav>

        <div className={styles.spacer} />
        {userEmail && (
          <button
            className={styles.logoutBtn}
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            로그아웃
          </button>
        )}
      </aside>
    </>
  );
}
