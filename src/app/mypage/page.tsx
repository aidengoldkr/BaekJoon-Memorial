import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getMyProfile, upsertProfile } from "@/app/actions/profile";
import styles from "./mypage.module.css";

const TIERS = ["Unrated", "Bronze", "Silver", "Gold", "Platinum", "Diamond", "Ruby"];
const LANGUAGES = ["C++", "Python", "Java", "C", "Kotlin", "JavaScript", "TypeScript", "Go", "Rust"];

export default async function MyPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const profile = await getMyProfile();

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
            await upsertProfile({
              nickname: formData.get("nickname") as string,
              tier: formData.get("tier") as string,
              solved_count: Number(formData.get("solved_count")) || 0,
              top_languages: languages,
            });
            redirect("/mypage");
          }}
          className={styles.form}
        >
          {/* 닉네임 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>닉네임</label>
            <input
              name="nickname"
              defaultValue={profile?.nickname ?? ""}
              placeholder="사용할 닉네임을 입력하세요"
              className={styles.input}
            />
          </div>

          {/* 티어 */}
          <div className={styles.formGroup}>
            <label className={styles.label}>solved.ac 티어</label>
            <select
              name="tier"
              defaultValue={profile?.tier ?? "Unrated"}
              className={styles.input}
            >
              {TIERS.map((tier) => (
                <option key={tier} value={tier}>
                  {tier}
                </option>
              ))}
            </select>
          </div>

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
            <div className={styles.languageGrid}>
              {LANGUAGES.map((lang) => {
                const checked = profile?.top_languages?.includes(lang) ?? false;
                return (
                  <label key={lang} className={styles.langOption}>
                    <input
                      type="checkbox"
                      name="top_languages"
                      value={lang}
                      defaultChecked={checked}
                      className={styles.checkbox}
                    />
                    {lang}
                  </label>
                );
              })}
            </div>
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
      </div>
    </main>
  );
}
