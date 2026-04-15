"use client";

import { useState } from "react";
import { TierBadge, getTierLabel } from "@/components/TierBadge";
import styles from "@/app/mypage/mypage.module.css";

const TIER_GROUPS = [
  { label: "Bronze",   prefix: "b" },
  { label: "Silver",   prefix: "s" },
  { label: "Gold",     prefix: "g" },
  { label: "Platinum", prefix: "p" },
  { label: "Diamond",  prefix: "d" },
  { label: "Ruby",     prefix: "r" },
] as const;

interface Props {
  defaultValue: string;
}

export function TierSelect({ defaultValue }: Props) {
  const [tier, setTier] = useState(defaultValue);

  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>solved.ac 티어</label>
      <div className={styles.tierSelectRow}>
        <TierBadge tier={tier} size={28} />
        <select
          name="tier"
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          className={`${styles.input} ${styles.tierSelect}`}
        >
          <option value="u">Unrated</option>
          {TIER_GROUPS.map(({ label, prefix }) => (
            <optgroup key={prefix} label={label}>
              {([5, 4, 3, 2, 1] as const).map((level) => (
                <option key={`${prefix}${level}`} value={`${prefix}${level}`}>
                  {label} {level}
                </option>
              ))}
            </optgroup>
          ))}
          <option value="m">Master</option>
        </select>
      </div>
      <p className={styles.tierHint}>현재: {getTierLabel(tier)}</p>
    </div>
  );
}
