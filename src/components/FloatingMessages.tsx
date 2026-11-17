"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import styles from "./FloatingMessages.module.css";

const SPEED = 90;          // px/s — 레퍼런스와 동일
const TICK_MS = 100;       // ms — 더 자주 생성
const NUM_LANES = 20;      // 더 많은 레인 사용
const LANE_BUFFER_MS = 300; // 레인 간격 단축

const FALLBACK_MESSAGES = [
  "백준과 함께한 모든 날들이 소중했습니다.",
  "맞았습니다!! 언제나 가슴이 뛰었어요.",
  "수많은 밤을 함께해줘서 고마워, 백준.",
  "이 곳에서 처음 알고리즘을 배웠습니다.",
  "PS 시작은 백준이었습니다. 돌아와줘서 고마워요.",
  "16년의 역사, 앞으로도 함께해요.",
  "틀렸습니다도 반갑습니다, 다시 만나서 기뻐요!",
  "덕분에 개발자가 되었습니다. 감사해요.",
  "다시 백준으로 돌아왔습니다!",
  "소마 코테 준비할 때 정말 유용했습니다.",
];

interface ActiveComment {
  id: number;
  text: string;
  lane: number;
  duration: number;
}

interface Entry {
  content: string;
  flower_count: number;
}

interface Props {
  entries?: Entry[];
}

export function FloatingMessages({ entries }: Props) {
  const src = useMemo(() => {
    // 50자 넘는 메시지 제외
    const validEntries = (entries || []).filter(e => e.content.length <= 50);

    if (validEntries.length === 0) return FALLBACK_MESSAGES;

    if (validEntries.length < 10) {
      // 10개 미만: 실제 메시지 + FALLBACK 믹스
      return [...validEntries.map(e => e.content), ...FALLBACK_MESSAGES];
    } else {
      // 10개 이상: 좋아요(flower_count) 높은 순으로 정렬
      return [...validEntries]
        .sort((a, b) => b.flower_count - a.flower_count)
        .map(e => e.content);
    }
  }, [entries]);

  const containerRef = useRef<HTMLDivElement>(null);
  const laneAvailableAt = useRef<number[]>(Array(NUM_LANES).fill(0));
  const msgIndex = useRef(0);
  const nextId = useRef(0);
  const [comments, setComments] = useState<ActiveComment[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    const tick = () => {
      const container = containerRef.current;
      if (!container) {
        timer = setTimeout(tick, TICK_MS);
        return;
      }

      const now = Date.now();
      const containerW = container.clientWidth;
      if (containerW === 0) {
        timer = setTimeout(tick, TICK_MS);
        return;
      }

      const available = laneAvailableAt.current
        .map((t, i) => (now >= t ? i : -1))
        .filter((i): i is number => i >= 0);

      // 확률적 생성 + 랜덤 딜레이로 가로 뭉침 방지
      if (available.length > 0 && Math.random() < 0.6) {
        const lane = available[Math.floor(Math.random() * available.length)];
        const text = src[msgIndex.current % src.length];
        msgIndex.current++;

        const estimatedTextWidth = text.length * 13 + 60;
        const travel = containerW + estimatedTextWidth + 40;
        
        const variedSpeed = SPEED * (0.8 + Math.random() * 0.4);
        const duration = travel / variedSpeed;

        laneAvailableAt.current[lane] = now + duration * 1000 + LANE_BUFFER_MS;

        const id = nextId.current++;
        setComments(prev => [...prev, { id, text, lane, duration }]);

        setTimeout(() => {
          setComments(prev => prev.filter(c => c.id !== id));
        }, (duration + 1.5) * 1000);
      }

      const nextDelay = TICK_MS + Math.random() * (TICK_MS * 5); // 딜레이 폭 확대
      timer = setTimeout(tick, nextDelay);
    };

    timer = setTimeout(tick, TICK_MS);
    return () => clearTimeout(timer);
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
