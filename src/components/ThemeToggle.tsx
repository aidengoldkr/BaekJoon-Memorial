"use client";

import { useEffect, useState } from "react";
import styles from "@/components/Header.module.css";

export function ThemeToggle({ onToggle }: { onToggle?: () => void }) {
  // null = 아직 localStorage 읽기 전 (hydration 완료 전)
  const [theme, setTheme] = useState<"dark" | "light" | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("boj-theme") as "dark" | "light" | null;
    const current = (document.documentElement.getAttribute("data-theme") ?? "dark") as "dark" | "light";
    setTheme(stored ?? current);
  }, []);

  const toggle = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("boj-theme", next);
    onToggle?.();
  };

  // hydration 전에는 렌더링 생략 (버튼 껍데기만 표시해도 무방)
  if (theme === null) {
    return <div className={styles.themeToggle} style={{ visibility: "hidden" }} />;
  }

  return (
    <button className={styles.themeToggle} onClick={toggle}>
      <span>{theme === "dark" ? "라이트 모드" : "다크 모드"}</span>
      <span className={styles.themeToggleIcon}>
        {theme === "dark" ? "☀️" : "🌙"}
      </span>
    </button>
  );
}
