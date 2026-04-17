"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TierBadge, getTierLabel } from "@/components/TierBadge";
import { addFlower, removeFlower, updateGuestbookEntry, deleteGuestbookEntry } from "@/app/actions/guestbook";
import styles from "./GuestbookCard.module.css";

interface Profile {
  nickname: string | null;
  tier: string | null;
  solved_count: number | null;
  top_languages: string[] | null;
}

export interface GuestbookEntry {
  id: string;
  email: string;
  content: string;
  flower_count: number;
  created_at: string;
  profiles?: Profile[] | Profile | null;
  user_liked?: boolean;
}

function resolveProfile(profiles: GuestbookEntry["profiles"]): Profile | null {
  if (!profiles) return null;
  return Array.isArray(profiles) ? (profiles[0] ?? null) : profiles;
}

export function GuestbookCard({ entry, currentUserEmail }: { entry: GuestbookEntry; currentUserEmail?: string | null }) {
  const [likes, setLikes] = useState(entry.flower_count);
  const [liked, setLiked] = useState(entry.user_liked ?? false);
  const [pending, setPending] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const pendingRef = useRef(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(entry.content);
  const [isPendingTrans, startTransition] = useTransition();
  const router = useRouter();

  const wrapperRef = useRef<HTMLDivElement>(null);

  const profile = resolveProfile(entry.profiles);
  const displayName = profile?.nickname ?? entry.email.split("@")[0];

  // 서버 데이터가 바뀌면(리페치, 유저 전환) 로컬 상태 동기화
  // pendingRef=true(서버 액션 진행 중)일 때는 optimistic 상태 유지
  useEffect(() => {
    if (pendingRef.current) return;
    setLiked(entry.user_liked ?? false);
    setLikes(entry.flower_count);
  }, [entry.id, entry.user_liked, entry.flower_count]);

  // 팝업 외부 클릭 닫기
  useEffect(() => {
    if (!popupOpen) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [popupOpen]);

  const handleLike = async () => {
    if (!currentUserEmail) {
      alert("로그인이 필요한 기능입니다.");
      return;
    }
    if (pending) return;
    pendingRef.current = true;
    setPending(true);

    const wasLiked = liked;
    // optimistic update
    setLiked(!wasLiked);
    setLikes((n) => n + (wasLiked ? -1 : 1));

    try {
      const result = wasLiked
        ? await removeFlower(entry.id)
        : await addFlower(entry.id);

      if (result && !result.success) {
        alert(result.error);
        throw new Error(result.error);
      }
    } catch {
      // 실패 시 롤백
      setLiked(wasLiked);
      setLikes((n) => n + (wasLiked ? 1 : -1));
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  };

  const handleUpdate = () => {
    if (editContent.trim().length === 0) return;
    startTransition(async () => {
      const result = await updateGuestbookEntry(entry.id, editContent);
      if (result.success) {
        setIsEditing(false);
        window.location.reload();
      } else {
        alert(result.error);
      }
    });
  };

  const handleDelete = () => {
    if (!window.confirm("정말로 삭제하시겠습니까? (이 작업은 되돌릴 수 없습니다.)")) return;
    startTransition(async () => {
      const result = await deleteGuestbookEntry(entry.id);
      if (result.success) {
        window.location.reload();
      } else {
        alert(result.error);
      }
    });
  };

  const isOwner = currentUserEmail === entry.email;

  return (
    <article className={styles.card}>
      {/* 본문 영역 */}
      <div className={styles.body}>
        {isEditing ? (
          <div className={styles.editArea}>
            <textarea
              className={styles.editTextarea}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value.slice(0, 140))}
              disabled={isPendingTrans}
            />
            <div className={styles.editActions}>
              <span className={styles.editCount}>{editContent.length}/140</span>
              <div className={styles.editBtns}>
                <button 
                  className={styles.cancelBtn} 
                  onClick={() => { setIsEditing(false); setEditContent(entry.content); }}
                  disabled={isPendingTrans}
                >취소</button>
                <button 
                  className={styles.saveBtn} 
                  onClick={handleUpdate}
                  disabled={isPendingTrans || editContent.trim().length === 0}
                >저장</button>
              </div>
            </div>
          </div>
        ) : (
          <p className={styles.content}>{entry.content}</p>
        )}

        <div className={styles.meta}>
          <div className={styles.authorWrapper} ref={wrapperRef}>
            <button
              className={styles.authorBtn}
              onClick={() => profile && setPopupOpen((v) => !v)}
              style={{ cursor: profile ? "pointer" : "default" }}
            >
              <TierBadge tier={profile?.tier} size={15} />
              <span className={styles.authorName}>{displayName}</span>
              {profile && <span className={styles.caret}>▾</span>}
            </button>

            {popupOpen && profile && (
              <div className={styles.popup}>
                <div className={styles.popupHeader}>
                  <TierBadge tier={profile.tier} size={30} />
                  <div>
                    <p className={styles.popupName}>{profile.nickname ?? displayName}</p>
                    <p className={styles.popupTier}>{getTierLabel(profile.tier)}</p>
                  </div>
                </div>
                {(profile.solved_count ?? 0) > 0 && (
                  <p className={styles.popupStat}>
                    {profile.solved_count!.toLocaleString()}문제 해결
                  </p>
                )}
                {(profile.top_languages?.length ?? 0) > 0 && (
                  <div className={styles.popupLangs}>
                    {profile.top_languages!.map((l) => (
                      <span key={l} className={styles.popupLang}>{l}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className={styles.metaRight}>
            {isOwner && !isEditing && (
              <div className={styles.ownerActions}>
                <button className={styles.actionBtn} onClick={() => setIsEditing(true)}>수정</button>
                <button className={styles.actionBtn} onClick={handleDelete}>삭제</button>
              </div>
            )}
            <span className={styles.date}>
              {new Date(entry.created_at).toLocaleDateString("ko-KR")}
            </span>
          </div>
        </div>
      </div>

      {/* 좋아요 영역 */}
      <div className={styles.likeArea}>
        <button
          className={`${styles.likeBtn} ${liked ? styles.likeBtnActive : ""}`}
          onClick={handleLike}
          disabled={pending}
          title={liked ? "좋아요 취소" : "좋아요"}
          aria-label={liked ? "좋아요 취소" : "좋아요"}
        >
          {liked ? "❤️" : "🤍"}
        </button>
        <span className={`${styles.likeCount} ${liked ? styles.likeCountActive : ""}`}>
          {likes}
        </span>
      </div>
    </article>
  );
}
