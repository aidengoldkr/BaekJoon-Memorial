"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@supabase/supabase-js";
import styles from "./MessageMarquee.module.css";

interface Props {
  speed: "slow" | "normal" | "fast";
  direction: "left" | "right";
}

const FALLBACK_MESSAGES = [
  "백준과 함께한 모든 날들이 소중했습니다.",
  "맞았습니다!! 언제나 가슴이 뛰었어요.",
  "수많은 밤을 함께해줘서 고마워, 백준.",
  "이 곳에서 처음 알고리즘을 배웠습니다.",
  "PS 시작은 백준이었습니다. 함께해줘서 고마워요.",
  "16년의 역사, 오래도록 기억할게요.",
  "틀렸습니다도 이제는 소중한 추억이에요.",
  "덕분에 개발자가 되었습니다. 감사해요.",
  "알고리즘을 배우던 시간을 기억합니다.",
  "백준에서의 추억을 잊지 않겠습니다.",
];

const SPEED_MAP = {
  slow: 60,
  normal: 40,
  fast: 25,
};

export function MessageMarquee({ speed, direction }: Props) {
  const [messages, setMessages] = useState<string[]>(FALLBACK_MESSAGES);

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseUrl.startsWith("your-")) return;

    const client = createClient(supabaseUrl, supabaseKey);

    client
      .from("guestbooks")
      .select("content")
      .order("created_at", { ascending: false })
      .limit(30)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setMessages(data.map((row) => row.content));
        }
      });
  }, []);

  const duration = SPEED_MAP[speed];
  const xFrom = direction === "left" ? "0%" : "-50%";
  const xTo = direction === "left" ? "-50%" : "0%";

  const doubled = [...messages, ...messages];

  return (
    <div className={styles.wrapper}>
      <motion.div
        className={styles.track}
        animate={{ x: [xFrom, xTo] }}
        transition={{
          repeat: Infinity,
          duration,
          ease: "linear",
        }}
      >
        {doubled.map((msg, i) => (
          <span key={i} className={styles.message}>
            ✦ {msg}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
