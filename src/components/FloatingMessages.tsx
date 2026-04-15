"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./FloatingMessages.module.css";

const SPEED = 90;          // px/s — 레퍼런스와 동일
const TICK_MS = 150;       // ms — 레퍼런스와 동일
const NUM_LANES = 10;
const LANE_BUFFER_MS = 500;

const FALLBACK_MESSAGES = [
  "백준과 함께한 모든 날들이 소중했습니다.",
  "맞았습니다!! 언제나 가슴이 뛰었어요.",
  "수많은 밤을 함께해줘서 고마워, 백준.",
  "이 곳에서 처음 알고리즘을 배웠습니다.",
  "PS 시작은 백준이었습니다. 안녕히.",
  "16년의 역사, 고생 많으셨습니다.",
  "틀렸습니다도 그리울 것 같아요.",
  "덕분에 개발자가 되었습니다. 감사해요.",
  "마지막 커밋을 백준에게 바칩니다.",
  "소마 코테 준비할 때 정말 유용했습니다.",
];

interface ActiveComment {
  id: number;
  text: string;
  lane: number;
  duration: number;
}

interface Props {
  messages?: string[];
}

export function FloatingMessages({ messages }: Props) {
  const src = (messages && messages.length > 0) ? messages : FALLBACK_MESSAGES;

  const containerRef = useRef<HTMLDivElement>(null);
  const laneAvailableAt = useRef<number[]>(Array(NUM_LANES).fill(0));
  const msgIndex = useRef(0);
  const nextId = useRef(0);
  const [comments, setComments] = useState<ActiveComment[]>([]);

  useEffect(() => {
    const tick = () => {
      const container = containerRef.current;
      if (!container) return;

      const now = Date.now();
      const containerW = container.clientWidth;
      if (containerW === 0) return;

      // 현재 사용 가능한 레인 목록
      const available = laneAvailableAt.current
        .map((t, i) => (now >= t ? i : -1))
        .filter((i): i is number => i >= 0);

      if (available.length === 0) return;

      // 랜덤 레인 선택
      const lane = available[Math.floor(Math.random() * available.length)];

      const text = src[msgIndex.current % src.length];
      msgIndex.current++;

      // 이동 거리 추정: 컨테이너 너비 + 텍스트 너비 여유
      const estimatedTextWidth = text.length * 13 + 60;
      const travel = containerW + estimatedTextWidth + 40;
      const duration = travel / SPEED;

      // 레인 잠금
      laneAvailableAt.current[lane] = now + duration * 1000 + LANE_BUFFER_MS;

      const id = nextId.current++;
      setComments(prev => [...prev, { id, text, lane, duration }]);

      // 애니메이션 종료 후 정리
      setTimeout(() => {
        setComments(prev => prev.filter(c => c.id !== id));
      }, (duration + 1.5) * 1000);
    };

    const interval = setInterval(tick, TICK_MS);
    return () => clearInterval(interval);
  }, [src]);

  return (
    <div ref={containerRef} className={styles.container}>
      {comments.map(c => (
        <span
          key={c.id}
          className={styles.comment}
          style={{
            top: `${((c.lane + 0.5) / NUM_LANES) * 100}%`,
            "--duration": `${c.duration.toFixed(2)}s`,
          } as React.CSSProperties}
        >
          ✦ {c.text}
        </span>
      ))}
    </div>
  );
}
