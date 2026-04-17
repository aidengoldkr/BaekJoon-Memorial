import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getMyProfile, upsertProfile } from "@/app/actions/profile";
import { getMyGuestbooks } from "@/app/actions/guestbook";
import { GuestbookCard } from "@/components/GuestbookCard";
import { normalizeTier } from "@/components/TierBadge";
import { TierSelect } from "@/components/TierSelect";
import styles from "./mypage.module.css";

import { LanguageSelector } from "./LanguageSelector";

export default async function MyPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const [profile, myGuestbooks] = await Promise.all([
    getMyProfile(),
    getMyGuestbooks()
  ]);

  const currentTier = normalizeTier(profile?.tier);
  // 저장된 닉네임 → 없으면 Google 이름 → 없으면 이메일 앞부분
  const defaultNickname =
    profile?.nickname ??
    session.user.name ??
    session.user.email.split("@")[0];

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>내 프로필</h1>
          <p className={styles.email}>{session.user.email}</p>
        </div>

        <form
          action={async (formData: FormData) => {
            "use server";
            const languages = formData.getAll("top_languages") as string[];
            const result = await upsertProfile({
              nickname: formData.get("nickname") as string,
              tier: formData.get("tier") as string,
              solved_count: Number(formData.get("solved_count")) || 0,
              top_languages: languages,
            });
            if (result.success) redirect("/");
            // 실패 시 그대로 (에러 표시는 추후 개선)
          }}
          className={styles.form}
        >
          {/* 닉네임 (필수) */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              닉네임 <span className={styles.required}>*</span>
            </label>
            <input
              name="nickname"
              defaultValue={defaultNickname}
              placeholder="닉네임을 입력해주세요"
              required
              maxLength={30}
              className={styles.input}
            />
          </div>

          {/* 티어 + 레벨 */}
          <TierSelect defaultValue={currentTier} />

          {/* 풀어본 문제 수 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>풀어본 문제 수</label>
            <input
              name="solved_count"
              type="number"
              min={0}
              defaultValue={profile?.solved_count ?? 0}
              className={styles.input}
            />
          </div>

          {/* 주력 언어 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>주력 언어</label>
            <LanguageSelector defaultSelected={profile?.top_languages || []} />
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.submitBtn}>
              저장하기
            </button>
            <a href="/" className={styles.backBtn}>
              돌아가기
            </a>
          </div>
        </form>

        <div className={styles.myGuestbooksSection}>
          <h2 className={styles.myGuestbooksTitle}>내 방명록</h2>
          {myGuestbooks.length > 0 ? (
            <div className={styles.myGuestbooksList}>
              {myGuestbooks.map((entry) => (
                <GuestbookCard 
                  key={entry.id} 
                  entry={entry as any} 
                  currentUserEmail={session.user?.email} 
                />
              ))}
            </div>
          ) : (
            <p className={styles.emptyGuestbook}>작성한 방명록이 없습니다.</p>
          )}
        </div>
      </div>
    </main>
  );
}
