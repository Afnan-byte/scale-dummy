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
// DAY SPLIT
// ─────────────────────────────────────────
function splitByDay(data: ScheduleItem[]) {
  const separatorIndex = data.findIndex(
    (item) => !item.title?.trim() && !item.type?.trim()
  );

  if (separatorIndex === -1) {
    const secondMorningIdx = data.findIndex(
      (item, i) => i > 0 && item.startTime?.includes("10:00")
    );
    if (secondMorningIdx > 0) {
      return {
        day1: data.slice(0, secondMorningIdx),
        day2: data.slice(secondMorningIdx),
      };
    }
    return { day1: data, day2: [] };
  }

  return {
    day1: data.slice(0, separatorIndex),
    day2: data.slice(separatorIndex + 1),
  };
}

// ─────────────────────────────────────────
// Schedule Card (POSTER REMOVED)
// ─────────────────────────────────────────
function ScheduleCard({ item }: { item: ScheduleItem }) {
  const cfg = getTypeConfig(item.type);

  return (
    <div
      className={`bg-white rounded-2xl p-6 md:p-7 flex border-l-4 ${cfg.cardAccent} shadow-md w-full max-w-[520px]`}
    >
      <div className="flex-1">
        {/* Badge + Time */}
        <div className="flex items-center justify-between gap-5 mb-4">
          <div
            className={`px-2 pr-4 py-1.5 rounded-full flex items-center gap-3 text-[13px] ${cfg.badge}`}
            style={{ fontFamily: "Calsans, sans-serif" }}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center ${cfg.iconBg}`}
            >
              <img src={cfg.icon} className="w-3 h-3" alt="" />
            </div>
            <span className={cfg.textColor}>
              {item.type || "Session"}
            </span>
          </div>

          <div className="bg-black text-white px-3 py-1.5 rounded-full text-[13px]">
            {item.startTime}
            {item.endTime ? ` – ${item.endTime}` : ""}
          </div>
        </div>

        {/* Title */}
        <h3
          className={`text-lg sm:text-xl mb-4 leading-snug ${cfg.textColor}`}
          style={{ fontFamily: "Calsans, sans-serif" }}
        >
          {item.title}
        </h3>

        {/* Speakers */}
        {item.speakers.length > 0 && (
          <div className="flex gap-4 flex-wrap">
            {item.speakers.map((s, i) => (
              <div key={i} className="text-center w-[65px]">
                <div
                  className={` rounded-lg h-[65px] relative mb-2`}
                >
                  {s.img && (
                    <img
                      src={s.img}
                      alt={s.name}
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[115%] h-[115%] object-contain"
                    />
                  )}
                </div>
                <p
                  className={`text-[11px] leading-tight ${cfg.textColor}`}
                  style={{ fontFamily: "Calsans, sans-serif" }}
                >
                  {s.name}
                </p>
                {s.role && (
                  <p className="text-[11px] text-gray-500 leading-tight">
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
// Day Banner
// ─────────────────────────────────────────
function DayBanner({ day, label }: { day: number; label: string }) {
  return (
    <div className="relative flex items-center justify-center my-8">
      <div className="absolute inset-x-0 top-1/2 h-px bg-gray-300 -translate-y-1/2" />
      <div className="relative z-10 inline-flex items-center gap-3 bg-black text-white px-6 py-2.5 rounded-full shadow-md">
        <span className="text-xs uppercase text-gray-400">Day</span>
        <span className="text-lg font-bold">{day}</span>
        <span className="w-px h-4 bg-gray-600" />
        <span className="text-xs text-gray-300">{label}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Timeline Section
// ─────────────────────────────────────────
function TimelineSection({ items }: { items: ScheduleItem[] }) {
  return (
    <div className="relative max-w-6xl mx-auto">
      <div className="hidden md:block absolute left-1/2 top-0 h-full w-[2px] bg-gray-300 -translate-x-1/2" />
      <div className="md:hidden absolute left-4 top-0 h-full w-[2px] bg-gray-300" />

      <div className="flex flex-col gap-10">
        {items.map((item, index) => {
          const isLeft = index % 2 === 0;

          return (
            <div key={index} className="relative flex items-center">
              <div className="absolute md:left-1/2 left-4 w-3 h-3 bg-black rounded-full -translate-x-1/2" />

              <div className={`hidden md:flex w-1/2 ${isLeft ? "pr-8 justify-end" : ""}`}>
                {isLeft && <ScheduleCard item={item} />}
              </div>

              <div className={`hidden md:flex w-1/2 ${!isLeft ? "pl-8 justify-start" : ""}`}>
                {!isLeft && <ScheduleCard item={item} />}
              </div>

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
// MAIN PAGE
// ─────────────────────────────────────────
export default function TimelinePage() {
  const { data, loading, error } = useScheduleData();
  const [activeDay, setActiveDay] = useState<1 | 2>(1);

  const { day1, day2 } = splitByDay(data);

  return (
    <main className="min-h-screen bg-[#F8F9FB] py-16 px-4">
      <div className="mb-10 lg:mb-16 grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-6 lg:gap-12 items-center max-w-7xl mx-auto">
  {/* Title */}
  <div className="flex flex-col items-center lg:items-start">
    <div className="mt-3 inline-flex items-center justify-center px-5 py-2.5 border-2 border-black rounded-full bg-white">
      <span
        className="text-lg sm:text-xl lg:text-3xl"
        style={{ fontFamily: "Calsans, sans-serif" }}
      >
        Event Schedule
      </span>
    </div>
  </div>

  {/* Subtitle */}
  <p className="text-base sm:text-lg lg:text-2xl text-gray-600">
    ScaleUp 2026 brings diverse experts, leaders, innovators empowering
    entrepreneurs with global insights, collaboration, and unstoppable
    business growth.
  </p>
</div>


{/* Day Tabs */}
{!loading && !error && (
  <div className="flex justify-center gap-3 mb-10 max-w-7xl mx-auto">
    <button
      onClick={() => setActiveDay(1)}
      className={`px-6 py-2.5 rounded-full text-sm transition-all duration-200 ${
        activeDay === 1
          ? "bg-black text-white shadow-md"
          : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
      }`}
      style={{ fontFamily: "Calsans, sans-serif" }}
    >
      Day 1
    </button>

    <button
      onClick={() => setActiveDay(2)}
      className={`px-6 py-2.5 rounded-full text-sm transition-all duration-200 ${
        activeDay === 2
          ? "bg-black text-white shadow-md"
          : "bg-white text-gray-600 border border-gray-200 hover:border-gray-400"
      }`}
      style={{ fontFamily: "Calsans, sans-serif" }}
    >
      Day 2
    </button>
  </div>
)}

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && activeDay === 1 && (
        <>
          <DayBanner day={1} label="Opening Day" />
          <TimelineSection items={day1} />
        </>
      )}

      {!loading && !error && activeDay === 2 && (
        <>
          <DayBanner day={2} label="Innovation Day" />
          <TimelineSection items={day2} />
        </>
      )}
    </main>
  );
}