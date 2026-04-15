"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createGuestbookEntry, addFlower } from "@/app/actions/guestbook";
import styles from "./GuestbookForm.module.css";

interface GuestbookEntry {
  id: string;
  email: string;
  content: string;
  flower_count: number;
  created_at: string;
  profiles?: { nickname: string | null; tier: string | null } | null;
}

interface Props {
  initialEntries: GuestbookEntry[];
  userEmail?: string | null;
}

const MAX_LENGTH = 140;

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
      {userEmail ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.textareaWrapper}>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, MAX_LENGTH))}
              placeholder="백준에게 마지막 한마디를 남겨주세요..."
              rows={3}
              className={styles.textarea}
            />
            <span className={styles.charCount}>
              {content.length}/{MAX_LENGTH}
            </span>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button
            type="submit"
            disabled={isPending || content.trim().length === 0}
            className={styles.submitBtn}
          >
            {isPending ? "등록 중..." : "방명록 남기기"}
          </button>
        </form>
      ) : (
        <p className={styles.loginPrompt}>
          방명록을 남기려면{" "}
          <a href="/login" className={styles.loginLink}>
            로그인
          </a>
          이 필요합니다.
        </p>
      )}

      <ul className={styles.entries}>
        {entries.map((entry) => (
          <li key={entry.id} className={styles.entry}>
            <div className={styles.entryBody}>
              <div className={styles.entryMeta}>
                <span className={styles.nickname}>
                  {entry.profiles?.nickname ?? entry.email.split("@")[0]}
                </span>
                {entry.profiles?.tier && (
                  <span>[{entry.profiles.tier}]</span>
                )}
                <span>{new Date(entry.created_at).toLocaleDateString("ko-KR")}</span>
              </div>
              <p className={styles.entryContent}>{entry.content}</p>
            </div>
            <button
              onClick={() => handleFlower(entry.id)}
              className={styles.flowerBtn}
              title="꽃 보내기"
            >
              🌸 <span>{entry.flower_count}</span>
            </button>
          </li>
        ))}
        {entries.length === 0 && (
          <li className={styles.emptyMessage}>
            아직 방명록이 없습니다. 첫 번째 메시지를 남겨보세요!
          </li>
        )}
      </ul>
    </div>
  );
}
