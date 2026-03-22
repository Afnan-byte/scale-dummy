"use client";

import React, { useState } from "react";
import { useScheduleData } from "@/lib/useScheduleData";
import type { ScheduleItem } from "@/lib/googleSheets";

// ─────────────────────────────────────────
// 🎨 TYPE CONFIG
// ─────────────────────────────────────────
const typeConfig: Record<
  string,
  {
    badge: string;
    textColor: string;
    iconBg: string;
    icon: string;
    cardAccent: string;
    avatarBg: string;
  }
> = {
  "Expert Talk": {
    badge: "bg-[#DFF5E1]",
    textColor: "text-[#2E7D32]",
    iconBg: "bg-[#2E7D32]",
    icon: "/assets/images/Schedule/icon1.png",
    cardAccent: "border-[#2E7D32]",
    avatarBg: "bg-[#E8F5E9]",
  },
  "Fireside Chat": {
    badge: "bg-[#FFE8D6]",
    textColor: "text-[#FF6D00]",
    iconBg: "bg-[#FF6D00]",
    icon: "/assets/images/Schedule/icon2.png",
    cardAccent: "border-[#FF6D00]",
    avatarBg: "bg-[#FFF3E0]",
  },
  "Panel Discussion": {
    badge: "bg-[#E8F2FF]",
    textColor: "text-[#4285F4]",
    iconBg: "bg-[#4285F4]",
    icon: "/assets/images/Schedule/icon.png",
    cardAccent: "border-[#4285F4]",
    avatarBg: "bg-[#E3F2FD]",
  },
  "Inaugration": {
    badge: "bg-[#fff1b8]",
    textColor: "text-[#d8b940]",
    iconBg: "bg-[#d8b940]",
    icon: "/assets/images/Schedule/icon3.png",
    cardAccent: "border-[#d8b940]",
    avatarBg: "bg-[#FFF3CD]",
  },
  "Workshop": {
    badge: "bg-[#f6d2ff]",
    textColor: "text-[#9310b4]",
    iconBg: "bg-[#9310b4]",
    icon: "/assets/images/Schedule/icon4.png",
    cardAccent: "border-[#9310b4]",
    avatarBg: "bg-[#F3E5F5]",
  },
  DEFAULT: {
    badge: "bg-gray-100",
    textColor: "text-gray-700",
    iconBg: "bg-gray-500",
    icon: "/assets/icons/default.svg",
    cardAccent: "border-gray-300",
    avatarBg: "bg-gray-100",
  },
};

// ─────────────────────────────────────────
// 🧠 SMART TYPE MATCH
// ─────────────────────────────────────────
function getTypeConfig(type: string) {
  const t = type?.toLowerCase().trim();
  if (t.includes("expert")) return typeConfig["Expert Talk"];
  if (t.includes("fire")) return typeConfig["Fireside Chat"];
  if (t.includes("panel")) return typeConfig["Panel Discussion"];
  if (t.includes("inaug")) return typeConfig["Inaugration"];
  if (t.includes("work")) return typeConfig["Workshop"];
  return typeConfig.DEFAULT;
}

// ─────────────────────────────────────────
// DAY SPLIT UTILITY
// The sheet has a blank/empty row separating Day 1 and Day 2.
// We detect it by checking if the item has no title and no type.
// ─────────────────────────────────────────
function splitByDay(data: ScheduleItem[]): {
  day1: ScheduleItem[];
  day2: ScheduleItem[];
} {
  // Find the index of the separator row (empty title + empty type)
  const separatorIndex = data.findIndex(
    (item) => !item.title?.trim() && !item.type?.trim()
  );

  if (separatorIndex === -1) {
    // No separator found — fall back to splitting by first occurrence of
    // a repeated start time block heuristic (first item starting at 10:00 AM
    // after index 0). This handles the case where the hook already strips blanks.
    const secondMorningIdx = data.findIndex(
      (item, i) => i > 0 && item.startTime?.includes("10:00")
    );
    if (secondMorningIdx > 0) {
      return {
        day1: data.slice(0, secondMorningIdx),
        day2: data.slice(secondMorningIdx),
      };
    }
    // Final fallback: treat everything as day 1
    return { day1: data, day2: [] };
  }

  return {
    day1: data.slice(0, separatorIndex),
    day2: data.slice(separatorIndex + 1),
  };
}

// ─────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl p-4 flex gap-4 border border-gray-100 shadow-sm w-full animate-pulse">
      <div className="hidden sm:block w-[90px] bg-gray-200 rounded-lg" />
      <div className="flex-1 space-y-3">
        <div className="flex justify-between">
          <div className="h-5 w-28 bg-gray-200 rounded-full" />
          <div className="h-5 w-16 bg-gray-200 rounded-full" />
        </div>
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Schedule Card
// ─────────────────────────────────────────
function ScheduleCard({ item }: { item: ScheduleItem }) {
  const cfg = getTypeConfig(item.type);

  return (
    <div
      className={`bg-white rounded-2xl p-4 flex gap-4 border-l-4 ${cfg.cardAccent} shadow-sm w-full`}
    >
      {/* Poster (ONLY if exists) */}
      <div className="hidden sm:block w-[150px] flex-shrink-0">
        {item.posterImg && (
          <img
            src={item.posterImg}
            alt={item.title}
            className="w-full h-full object-cover rounded-lg"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        {/* Badge + Time */}
        <div className="flex justify-between items-center mb-2">
          <div
            className={`px-3 py-1 rounded-full flex items-center gap-2 text-[10px] ${cfg.badge}`}
            style={{ fontFamily: "Calsans, sans-serif" }}
          >
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center ${cfg.iconBg}`}
            >
              <img src={cfg.icon} className="w-2.5 h-2.5" alt="" />
            </div>
            <span className={`${cfg.textColor}`}>
              {item.type || "Session"}
            </span>
          </div>

          <div className="bg-black text-white px-2 py-1 rounded-full text-[10px]">
            {item.startTime}
            {item.endTime ? ` – ${item.endTime}` : ""}
          </div>
        </div>

        {/* Title */}
        <h3
          className={`text-sm mb-2 mt-5 leading-tight ${cfg.textColor}`}
          style={{ fontFamily: "Calsans, sans-serif" }}
        >
          {item.title}
        </h3>

        {/* Speakers */}
        {item.speakers.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {item.speakers.map((s, i) => (
              <div key={i} className="text-center w-[50px]">
                <div
                  className={`${cfg.avatarBg} rounded-lg h-[50px] relative mb-1`}
                >
                  {s.img && (
                    <img
                      src={s.img}
                      alt={s.name}
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[110%] h-[110%] object-contain"
                    />
                  )}
                </div>
                <p
                  className={`text-[9px] leading-tight ${cfg.textColor}`}
                  style={{ fontFamily: "Calsans, sans-serif" }}
                >
                  {s.name}
                </p>
                {s.role && (
                  <p
                    className="text-[8px] text-gray-500 leading-tight"
                    style={{ fontFamily: "Calsans, sans-serif" }}
                  >
                    {s.role}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Day Label Banner
// ─────────────────────────────────────────
function DayBanner({ day, label }: { day: number; label: string }) {
  return (
    <div className="relative flex items-center justify-center my-8">
      {/* Horizontal rule */}
      <div className="absolute inset-x-0 top-1/2 h-px bg-gray-300 -translate-y-1/2" />
      {/* Pill */}
      <div className="relative z-10 inline-flex items-center gap-3 bg-black text-white px-6 py-2.5 rounded-full shadow-md">
        <span
          className="text-xs tracking-widest uppercase text-gray-400"
          style={{ fontFamily: "Calsans, sans-serif" }}
        >
          Day
        </span>
        <span
          className="text-lg font-bold"
          style={{ fontFamily: "Calsans, sans-serif" }}
        >
          {day}
        </span>
        <span className="w-px h-4 bg-gray-600" />
        <span
          className="text-xs tracking-wide text-gray-300"
          style={{ fontFamily: "Calsans, sans-serif" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Day Tab Button
// ─────────────────────────────────────────
function DayTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2.5 rounded-full text-sm transition-all duration-200 ${
        active
          ? "bg-black text-white shadow-md"
          : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
      }`}
      style={{ fontFamily: "Calsans, sans-serif" }}
    >
      {children}
    </button>
  );
}

// ─────────────────────────────────────────
// Timeline Section (reusable for each day)
// ─────────────────────────────────────────
function TimelineSection({ items }: { items: ScheduleItem[] }) {
  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Vertical line */}
      <div className="hidden md:block absolute left-1/2 top-0 h-full w-[2px] bg-gray-300 -translate-x-1/2" />
      <div className="md:hidden absolute left-4 top-0 h-full w-[2px] bg-gray-300" />

      <div className="flex flex-col gap-10">
        {items.map((item, index) => {
          const isLeft = index % 2 === 0;

          return (
            <div key={index} className="relative flex items-center">
              {/* Dot */}
              <div className="absolute md:left-1/2 left-4 w-3 h-3 bg-blue-500 rounded-full -translate-x-1/2" />

              {/* Desktop left */}
              <div
                className={`hidden md:flex w-1/2 ${
                  isLeft ? "pr-8 justify-end" : ""
                }`}
              >
                {isLeft && <ScheduleCard item={item} />}
              </div>

              {/* Desktop right */}
              <div
                className={`hidden md:flex w-1/2 ${
                  !isLeft ? "pl-8 justify-start" : ""
                }`}
              >
                {!isLeft && <ScheduleCard item={item} />}
              </div>

              {/* Mobile */}
              <div className="md:hidden w-full pl-10">
                <ScheduleCard item={item} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────
export default function TimelinePage() {
  const { data, loading, error } = useScheduleData();
  const [activeDay, setActiveDay] = useState<1 | 2>(1);

  const { day1, day2 } = splitByDay(data);

  return (
    <main className="min-h-screen bg-[#F8F9FB] py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 lg:mb-16 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 lg:gap-12 items-center max-w-7xl mx-auto">
        <div className="flex flex-col items-center lg:items-start">
          <div className="mt-3 inline-flex items-center justify-center px-5 py-2.5 border-2 border-black rounded-full bg-white">
            <span className="text-lg sm:text-xl lg:text-3xl">
              Event Schedule
            </span>
          </div>
        </div>

        <p className="text-base sm:text-lg lg:text-2xl text-gray-600">
          ScaleUp 2026 brings diverse experts, leaders, innovators empowering
          entrepreneurs with global insights, collaboration, and unstoppable
          business growth.
        </p>
      </div>

      {/* Day Tabs */}
      {!loading && !error && (
        <div className="flex justify-center gap-3 mb-10 max-w-7xl mx-auto">
          <DayTab active={activeDay === 1} onClick={() => setActiveDay(1)}>
            Day 1
          </DayTab>
          <DayTab active={activeDay === 2} onClick={() => setActiveDay(2)}>
            Day 2
          </DayTab>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="relative max-w-6xl mx-auto">
          <div className="md:hidden absolute left-4 top-0 h-full w-[2px] bg-gray-300" />
          <div className="flex flex-col gap-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="md:hidden w-full pl-10">
                <SkeletonCard />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-500 text-sm text-center">{error}</p>
      )}

      {/* Day 1 Timeline */}
      {!loading && !error && activeDay === 1 && day1.length > 0 && (
        <>
          <DayBanner day={1} label="Opening Day" />
          <TimelineSection items={day1} />
        </>
      )}

      {/* Day 2 Timeline */}
      {!loading && !error && activeDay === 2 && day2.length > 0 && (
        <>
          <DayBanner day={2} label="Innovation Day" />
          <TimelineSection items={day2} />
        </>
      )}

      {/* Empty state */}
      {!loading && !error && activeDay === 2 && day2.length === 0 && (
        <p className="text-center text-gray-400 text-sm mt-10">
          Day 2 schedule coming soon.
        </p>
      )}
    </main>
  );
}