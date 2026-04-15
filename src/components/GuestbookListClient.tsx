"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { getGuestbookPage } from "@/app/actions/guestbook";
import { GuestbookCard, type GuestbookEntry } from "@/components/GuestbookCard";

interface Props {
  initialEntries: GuestbookEntry[];
  initialTotal: number;
  page: number;
  sort: "latest" | "likes";
  pageSize: number;
}

const listVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export function GuestbookListClient({
  initialEntries,
  initialTotal,
  page,
  sort,
  pageSize,
}: Props) {
  const { data, isFetching } = useQuery({
    queryKey: ["guestbook", page, sort],
    queryFn:  () => getGuestbookPage(page, pageSize, sort),
    initialData: { entries: initialEntries, total: initialTotal },
    placeholderData: (prev) => prev,
  });

  const entries = (data?.entries ?? initialEntries) as GuestbookEntry[];

  return (
    <div style={{ position: "relative" }}>
      {/* 페이지 전환 로딩 오버레이 */}
      {isFetching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: "absolute", inset: 0, zIndex: 10,
            backdropFilter: "blur(2px)", borderRadius: "0.875rem",
          }}
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`${page}-${sort}`}
          variants={listVariants}
          initial="hidden"
          animate="show"
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
          {entries.map((entry) => (
            <motion.div key={entry.id} variants={cardVariants}>
              <GuestbookCard entry={entry} />
            </motion.div>
          ))}

          {entries.length === 0 && (
            <motion.p
              variants={cardVariants}
              style={{ textAlign: "center", color: "var(--text-faint)", padding: "4rem 0" }}
            >
              아직 방명록이 없습니다.
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
