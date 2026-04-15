"use server";

import { auth } from "@/lib/auth";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export interface ProfileFormData {
  nickname: string;
  tier: string;
  solved_count: number;
  top_languages: string[];
}

export async function upsertProfile(data: ProfileFormData) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  if (!data.nickname || !data.nickname.trim()) {
    return { success: false, error: "닉네임을 입력해주세요." };
  }

  const supabase = createServiceClient();

  const { error } = await supabase.from("profiles").upsert(
    {
      email: session.user.email,
      nickname: data.nickname,
      tier: data.tier,
      solved_count: data.solved_count,
      top_languages: data.top_languages,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "email" }
  );

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getProfileByEmail(email: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("profiles")
    .select("nickname, tier, solved_count")
    .eq("email", email)
    .single();
  return data as { nickname: string | null; tier: string | null; solved_count: number | null } | null;
}

export async function getMyProfile() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const supabase = createServiceClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", session.user.email)
    .single();

  return data;
}
