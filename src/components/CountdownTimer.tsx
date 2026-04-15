"use client";

import { useEffect, useState } from "react";
import styles from "./CountdownTimer.module.css";

interface Props {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: string): TimeLeft | null {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function CountdownTimer({ targetDate }: Props) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    calcTimeLeft(targetDate)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <p className={styles.ended}>서비스가 종료되었습니다.</p>
    );
  }

  const units = [
    { label: "일", value: timeLeft.days },
    { label: "시간", value: timeLeft.hours },
    { label: "분", value: timeLeft.minutes },
    { label: "초", value: timeLeft.seconds },
  ];

  return (
    <div className={styles.container}>
      {units.map(({ label, value }) => (
        <div key={label} className={styles.unit}>
          <span className={styles.number}>
            {String(value).padStart(2, "0")}
          </span>
          <span className={styles.label}>{label}</span>
        </div>
      ))}
    </div>
  );
}
