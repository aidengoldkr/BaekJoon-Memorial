// Server Component (img only — works in both Server & Client trees)

const TIER_NAMES: Record<string, string> = {
  b: "Bronze", s: "Silver", g: "Gold",
  p: "Platinum", d: "Diamond", r: "Ruby",
};

const LEGACY_MAP: Record<string, string> = {
  Unrated: "u", Bronze: "b3", Silver: "s3", Gold: "g3",
  Platinum: "p3", Diamond: "d3", Ruby: "r3", Master: "m",
};

/** "g4", "u", "m" 형식의 코드로 정규화. 레거시 "Gold" 등도 처리 */
export function normalizeTier(tier: string | null | undefined): string {
  if (!tier) return "u";
  if (/^(u|m|[bsgpdr][1-5])$/.test(tier)) return tier;
  return LEGACY_MAP[tier] ?? "u";
}

/** "g4" → "Gold 4", "u" → "Unrated" */
export function getTierLabel(tier: string | null | undefined): string {
  if (!tier) return "Unrated";
  const code = normalizeTier(tier);
  if (code === "u") return "Unrated";
  if (code === "m") return "Master";
  const m = code.match(/^([bsgpdr])([1-5])$/);
  if (!m) return tier;
  return `${TIER_NAMES[m[1]]} ${m[2]}`;
}

interface Props {
  tier: string | null | undefined;
  size?: number;
  className?: string;
}

export function TierBadge({ tier, size = 20, className }: Props) {
  const code = normalizeTier(tier);
  return (
    <img
      src={`/tier/${code}.svg`}
      alt={getTierLabel(tier)}
      title={getTierLabel(tier)}
      width={size}
      height={size}
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
    />
  );
}
