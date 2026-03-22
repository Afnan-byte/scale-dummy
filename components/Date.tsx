"use client";

import React, { useEffect, useState } from "react";

function DateSection() {
  const targetDate = new Date("2026-03-25T09:00:00");
  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const seconds = totalSeconds % 60;
      const totalMinutes = Math.floor(totalSeconds / 60);
      const minutes = totalMinutes % 60;
      const totalHours = Math.floor(totalMinutes / 60);
      const hours = totalHours % 24;
      const days = Math.floor(totalHours / 24);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section
      className="w-full px-4 sm:px-8 xl:px-12 pt-4 flex flex-col-reverse xl:flex-row items-start lg:items-center justify-between gap-6 xl:gap-10"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Stats (below on mobile, left on desktop) */}
      <div className="font-gilmer leading-[42px] md:leading-[85.97px] p-4 text-2xl sm:text-3xl md:text-[60px] text-left"
        style={{ color: "var(--color-text)", fontWeight: "600" }}
      >
        <p className="flex items-center justify-start gap-2 font-light text-3xl md:text-[60px]" style={{ fontFamily: "Calsans, sans-serif" }}>
          2 Days
          <img
            src="/assets/images/star_icon.svg"
            alt="rose-icon"
            className="h-6 w-6 md:h-9 md:w-9"
          />
        </p>
        <p className="flex items-center justify-start gap-2 text-3xl font-light sm:text-2xl md:text-[60px]" style={{ fontFamily: "Calsans, sans-serif" }}>
          50+ Speakers
          <img
            src="/assets/images/Union.svg"
            alt="green-icon"
            className="h-6 w-6 md:h-9 md:w-9"
          />
        </p>
        <p className="flex items-center justify-start gap-2 text-3xl font-light sm:text-2xl md:text-[60px]" style={{ fontFamily: "Calsans, sans-serif" }}>
          5000+ Innovators
          <img
            src="/assets/images/four_dot.svg"
            alt="blue-icon"
            className="h-6 w-6 md:h-9 md:w-9"
          />
        </p>
      </div>

      {/* Timer (top on mobile, right on desktop) */}
      <div className="font-gilmer text-center w-full md:w-auto mt-2 md:mt-0">
        <div className="flex justify-center gap-2 md:gap-4 flex-nowrap overflow-x-auto">
          {Object.entries(timeLeft).map(([label, value], index) => (
            <div
              key={index}
              className="flex flex-col items-center min-w-[50px] md:min-w-auto"
            >
              <span
                className="text-4xl  sm:text-4xl md:text-8xl tracking-[0.10em]"
                style={{ color: "#000000", fontWeight: "400", fontFamily: "Calsans, sans-serif" }}
              >
                {value}
              </span>
              <span
                className="border rounded-full sm:px-6 px-5 py-1 md:px-14 md:py-1 -mt-2 sm:-mt-2 md:-mt-4 text-xs sm:text-sm md:text-base"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderColor: "#000000",
                  color: "#000000",
                }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
        <p
          className="font-gilmer mt-3 text-xs sm:text-sm md:text-xl"
          style={{ color: "#4B5563" }}
        >
          Kerala's biggest AI & Technology Conclave
        </p>
      </div>
    </section>
  );
}

export default DateSection;