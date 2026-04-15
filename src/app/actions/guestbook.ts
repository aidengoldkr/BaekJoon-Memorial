"use server";

import { auth } from "@/lib/auth";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function createGuestbookEntry(content: string) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  if (!content || content.trim().length === 0) {
    return { success: false, error: "내용을 입력해주세요." };
  }

  if (content.length > 140) {
    return { success: false, error: "140자 이내로 입력해주세요." };
  }

  const supabase = createServiceClient();

  const { error } = await supabase.from("guestbooks").insert({
    email: session.user.email,
    content: content.trim(),
    flower_count: 0,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function getGuestbookEntries() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("guestbooks")
    .select("id, email, content, flower_count, created_at, profiles(nickname, tier)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) return [];

  return data ?? [];
}

export async function addFlower(id: string) {
  const supabase = createServiceClient();

  const { error } = await supabase.rpc("increment_flower_count", { row_id: id });

  if (error) {
    // RPC가 없을 경우 수동 업데이트
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
