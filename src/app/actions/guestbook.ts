"use server";

import { auth } from "@/lib/auth";
import { createClient, createServiceClient } from "@/lib/supabase/server";

// ── 내부 헬퍼: 이메일 목록으로 프로필 맵 조회 ─────────────────────────
async function fetchProfileMap(emails: string[]) {
  if (emails.length === 0) return new Map<string, ProfileData>();

  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("email, nickname, tier, solved_count, top_languages")
    .in("email", emails);

  return new Map<string, ProfileData>(
    (data ?? []).map(({ email, ...rest }) => [email, rest])
  );
}

type ProfileData = {
  nickname: string | null;
  tier: string | null;
  solved_count: number | null;
  top_languages: string[] | null;
};

// ── 방명록 작성 ────────────────────────────────────────────────────────
export async function createGuestbookEntry(content: string) {
  const session = await auth();
  if (!session?.user?.email)
    return { success: false, error: "로그인이 필요합니다." };

  if (!content || content.trim().length === 0)
    return { success: false, error: "내용을 입력해주세요." };

  if (content.length > 140)
    return { success: false, error: "140자 이내로 입력해주세요." };

  const supabase = createServiceClient();
  const email = session.user.email;

  // 사용자별 일일 작성 한도 조회 (없으면 기본값 1)
  const { data: limitRow } = await supabase
    .from("user_limits")
    .select("daily_limit")
    .eq("email", email)
    .maybeSingle();

  const dailyLimit: number = limitRow?.daily_limit ?? 1;

  // 오늘(UTC 기준) 작성 수 확인
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const { count: todayCount } = await supabase
    .from("guestbooks")
    .select("id", { count: "exact", head: true })
    .eq("email", email)
    .gte("created_at", todayStart.toISOString());

  if ((todayCount ?? 0) >= dailyLimit) {
    return {
      success: false,
      error: `오늘의 작성 횟수(${dailyLimit}회)를 모두 사용했습니다.`,
    };
  }

  const { error } = await supabase.from("guestbooks").insert({
    email,
    content: content.trim(),
    flower_count: 0,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── 최근 방명록 조회 (메인 페이지 마키·폼 용) ─────────────────────────
export async function getGuestbookEntries(limit = 100) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("guestbooks")
    .select("id, email, content, flower_count, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];

  const profileMap = await fetchProfileMap(data.map((e) => e.email));

  return data.map((entry) => ({
    ...entry,
    profiles: profileMap.get(entry.email) ?? null,
  }));
}

// ── 페이지네이션 조회 (/guestbook 전용) ──────────────────────────────
export async function getGuestbookPage(
  page: number,
  limit = 20,
  sort: "latest" | "likes" = "latest"
) {
  const supabase = createClient();
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("guestbooks")
    .select("id, email, content, flower_count, created_at", { count: "exact" });

  if (sort === "likes") {
    query = query
      .order("flower_count", { ascending: false })
      .order("created_at", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error, count } = await query.range(from, to);

  if (error || !data) return { entries: [], total: 0 };

  const profileMap = await fetchProfileMap(data.map((e) => e.email));

  return {
    entries: data.map((entry) => ({
      ...entry,
      profiles: profileMap.get(entry.email) ?? null,
    })),
    total: count ?? 0,
  };
}

// ── 좋아요 추가 ────────────────────────────────────────────────────────
export async function addFlower(id: string) {
  const supabase = createServiceClient();

  const { error } = await supabase.rpc("increment_flower_count", { row_id: id });

  if (error) {
    const { data: entry } = await supabase
      .from("guestbooks")
      .select("flower_count")
      .eq("id", id)
      .single();

    if (entry) {
      await supabase
        .from("guestbooks")
        .update({ flower_count: entry.flower_count + 1 })
        .eq("id", id);
    }
  }

  return { success: true };
}

// ── 좋아요 취소 ────────────────────────────────────────────────────────
export async function removeFlower(id: string) {
  const supabase = createServiceClient();

  const { data: entry } = await supabase
    .from("guestbooks")
    .select("flower_count")
    .eq("id", id)
    .single();

  if (entry) {
    await supabase
      .from("guestbooks")
      .update({ flower_count: Math.max(0, entry.flower_count - 1) })
      .eq("id", id);
  }

  return { success: true };
}
