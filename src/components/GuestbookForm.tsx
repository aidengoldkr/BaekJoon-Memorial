"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createGuestbookEntry, addFlower } from "@/app/actions/guestbook";
import { TierBadge, getTierLabel } from "@/components/TierBadge";
import styles from "./GuestbookForm.module.css";

interface GuestbookEntry {
  id: string;
  email: string;
  content: string;
  flower_count: number;
  created_at: string;
  profiles?: { nickname: string | null; tier: string | null }[] | { nickname: string | null; tier: string | null } | null;
}

interface Props {
  initialEntries: GuestbookEntry[];
  userEmail?: string | null;
}

const MAX_LENGTH = 140;

function getProfile(profiles: GuestbookEntry["profiles"]) {
  if (!profiles) return null;
  return Array.isArray(profiles) ? profiles[0] ?? null : profiles;
}

export function GuestbookForm({ initialEntries, userEmail }: Props) {
  const [entries, setEntries] = useState(initialEntries);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await createGuestbookEntry(content);
      if (!result.success) {
        setError(result.error ?? "오류가 발생했습니다.");
        return;
      }
      setContent("");
      router.refresh();
    });
  };

  const handleFlower = (id: string) => {
    if (!userEmail) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }
    startTransition(async () => {
      await addFlower(id);
      setEntries((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, flower_count: e.flower_count + 1 } : e
        )
      );
    });
  };

  return (
    <div className={styles.container}>
      {/* 작성 폼 — 비로그인 시 blur overlay 표시 */}
      <div className={styles.writeSection}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.textareaWrapper}>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, MAX_LENGTH))}
              placeholder="백준의 귀환을 축하하며 한마디를 남겨주세요..."
              rows={2}
              className={styles.textarea}
              disabled={!userEmail}
            />
            <span className={styles.charCount}>
              {content.length}/{MAX_LENGTH}
            </span>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button
            type="submit"
            disabled={isPending || content.trim().length === 0 || !userEmail}
            className={styles.submitBtn}
          >
            {isPending ? "등록 중..." : "방명록 남기기"}
          </button>
        </form>

        {/* 비로그인 blur overlay */}
        {!userEmail && (
          <div className={styles.blurOverlay}>
            <p className={styles.blurOverlayTitle}>
              🌸 로그인하고 방명록을 남겨보세요
            </p>
            <a href="/login" className={styles.blurOverlayBtn}>
              Google로 로그인하기
            </a>
          </div>
        )}
      </div>

      {/* 방명록 목록 — 항상 표시 */}

    </div>
  );
}
