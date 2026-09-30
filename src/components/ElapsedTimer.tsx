"use client";

import { useEffect, useState } from "react";
import styles from "./ElapsedTimer.module.css";

interface Props {
  startDate: string;
}

interface ElapsedTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcElapsedTime(start: string): ElapsedTime {
  const diff = Math.max(0, Date.now() - new Date(start).getTime());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function ElapsedTimer({ startDate }: Props) {
  const [elapsedTime, setElapsedTime] = useState<ElapsedTime | null>(null);

  useEffect(() => {
    setElapsedTime(calcElapsedTime(startDate));
    const timer = setInterval(() => {
      setElapsedTime(calcElapsedTime(startDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [startDate]);

  const units = [
    { label: "일", value: elapsedTime?.days },
    { label: "시간", value: elapsedTime?.hours },
    { label: "분", value: elapsedTime?.minutes },
    { label: "초", value: elapsedTime?.seconds },
  ];

  return (
    <div className={styles.container}>
      {units.map(({ label, value }) => (
        <div key={label} className={styles.unit}>
          <span className={styles.number}>
            {value === undefined ? "--" : String(value).padStart(2, "0")}
          </span>
          <span className={styles.label}>{label}</span>
        </div>
      ))}
    </div>
  );
}
