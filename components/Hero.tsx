"use client";
import { ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import Image from "next/image";

import Registration from "./Registration";
import AiModalPop from "./AiModalPop";
import { analytics } from "@/lib/analytics";
const venueMapUrl = "/assets/venue-map.pdf";

// ── Shared Venue Map Button ──────────────────────────────────────────────────
function VenueMapButton({ className = "" }) {
  return (
    <a
      href="/assets/venue-map.pdf"
      download
      className={`venue-map-btn ${className}`}
    >
      {/* animated ping dot */}
      <span className="venue-map-ping">
        <span className="venue-map-ping-inner" />
      </span>

      {/* pin icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="venue-map-icon"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>

      <span className="venue-map-label">Venue Map</span>

      {/* download arrow */}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="venue-map-arrow"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>

      <style>{`
        .venue-map-btn {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 999px;
          font-family: 'Calsans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.03em;
          color: #ffffff;
          text-decoration: none;
          overflow: hidden;
          border: 1px solid rgba(224, 82, 255, 0.5);
          background: linear-gradient(135deg, rgba(224,82,255,0.18) 0%, rgba(122,92,255,0.22) 100%);
          backdrop-filter: blur(10px);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          white-space: nowrap;
          cursor: pointer;
        }
        .venue-map-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #E052FF, #7A5CFF);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: inherit;
        }
        .venue-map-btn:hover {
          border-color: rgba(224, 82, 255, 0.9);
          transform: translateY(-2px) scale(1.03);
          box-shadow:
            0 0 20px rgba(224, 82, 255, 0.4),
            0 0 40px rgba(122, 92, 255, 0.2),
            0 8px 24px rgba(0,0,0,0.35);
        }
        .venue-map-btn:hover::before { opacity: 1; }
        .venue-map-btn:active { transform: translateY(0) scale(0.98); }

        .venue-map-ping {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 8px;
          height: 8px;
          z-index: 1;
        }
        .venue-map-ping::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #E052FF;
          animation: venuePing 1.6s ease-out infinite;
        }
        .venue-map-ping-inner {
          position: relative;
          display: block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #f0aaff;
          z-index: 1;
        }
        @keyframes venuePing {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(2.8); opacity: 0;   }
        }

        .venue-map-icon,
        .venue-map-label,
        .venue-map-arrow { position: relative; z-index: 1; }

        .venue-map-arrow {
          opacity: 0.7;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        .venue-map-btn:hover .venue-map-arrow {
          transform: translateY(2px);
          opacity: 1;
        }
      `}</style>
    </a>
  );
}

function Hero() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsRegisterModalOpen(true);
    window.addEventListener("open-registration-modal", handler);
    return () => window.removeEventListener("open-registration-modal", handler);
  }, []);

  return (
    <section className="w-full flex flex-col items-center px-2 py-2 relative overflow-hidden">
      {/* --- RESPONSIVE HEADING SECTION --- */}
      <div className="w-[100%] text-right md:text-center mb-8 md:mb-8 lg:mb-7 pr-4 md:pr-6">
        <h1 className="text-[23.83px] md:text-[65px] lg:text-[76px] mb-2 md:mb-6 lg:mb-18 text-right pr-4 lg:pr-14">
          <span
            style={{ color: "#418CFF", fontWeight: "400", fontFamily: "Calsans, sans-serif" }}
            className="font-gilmer"
          >
            ScaleUp Conclave
          </span>
        </h1>

        <h1
          className="text-right text-5xl sm:text-6xl -mb-10 -mt-4 md:text-[180px] md:-mt-29 md:mb-5"
          style={{ color: "#4028C8" }}
        >
          <span
            className="font-gilmer !fw-400 sm:text-[56.63px] md:text-[100px] font-normal lg:text-[150px] xl:text-[190px]"
            style={{ color: "#060832", fontFamily: "Calsans, sans-serif" }}
          >
            The
          </span>{" "}
          <span
            className="font-gilmer tracking-tight sm:text-[56.63px] md:text-[100px] lg:text-[150px] xl:text-[190px] font-normal"
            style={{ fontFamily: "Calsans, sans-serif" }}
          >
            Ai Summit
          </span>
        </h1>
      </div>

      {/* --- MAIN CARD --- */}
      <div
        className="w-full max-w-md md:max-w-full rounded-3xl md:rounded-4xl 
             p-6 md:p-10 relative flex justify-between 
             mt-0 md:-mt-[76px] leading-normal md:leading-relaxed"
        style={{ backgroundColor: "#202020", color: "#FFFFFF" }}
      >
        {/* Top Right Icon — mobile only */}
        <div className="absolute top-6 right-7 md:hidden">
          <Image
            src="/assets/images/img_icon2.svg"
            alt="icons"
            width={120}
            height={120}
            className="w-16 sm:w-10 md:w-[120px]"
          />
        </div>

        {/* ── LEFT / MAIN CONTENT ── */}
        <div>
          <p
            className="font-gilmer text-3xl sm:text-3xl md:text-5xl font-normal leading-tight md:leading-normal"
            style={{ fontFamily: "Calsans, sans-serif" }}
          >
            ScaleUp <br className="block md:hidden" /> Conclave{" "}
            <span
              className="font-gilmer font-medium underline underline-offset-4 decoration-[3px]"
              style={{ textDecorationColor: "#9CF694" }}
            >
              2026
            </span>{" "}
            <br /> is back and this <br className="block md:hidden" /> time,{" "}
            <span
              className="font-gilmer font-medium underline underline-offset-4 decoration-[3px]"
              style={{ textDecorationColor: "#9CF694" }}
            >
              it's AI.
            </span>
          </p>

          <div className="flex lg:grid items-center gap-6 mt-10">
            <div className="flex items-center justify-center bg-[#3399FF] rounded-full w-[70px] h-[70px] md:w-[100px] md:h-[100px] shrink-0">
              <svg width="104" height="104" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="51.8322" cy="51.8327" r="51.8322" />
                <path
                  d="M41.832 29.0979L63.9735 45.704C66.0634 47.2715 67.2935 49.7315 67.2935 52.3439V52.3439C67.2935 54.8909 66.1241 57.2968 64.1214 58.8703L41.832 76.3834"
                  stroke="black"
                  strokeWidth="7.27469"
                />
              </svg>
            </div>
            <h2
              className="font-gilmer text-[30.6px] md:text-[70px] font-medium text-white leading-[1.05] tracking-tight"
              style={{ fontFamily: "Calsans, sans-serif" }}
            >
              Scale to <br /> Intelligence
            </h2>
          </div>

          {/* ── MOBILE: Book Tickets button ── */}
          <div className="flex mt-10 lg:hidden">
            <button
              onClick={() => {
                setIsRegisterModalOpen(true);
                analytics.heroRegisterClick();
              }}
              className="lg:w-[481px] flex items-center justify-between
                bg-[#9df094] hover:bg-[#b0f5a8] 
                text-black font-semibold text-xl md:text-[36px]
                py-4 px-6 md:px-8
                rounded-l-xl rounded-r-[50px]
                transition-all duration-200 active:scale-95
                group relative"
            >
              <span className="mr-6 tracking-tight">Book Tickets Now</span>
              <img
                src="/assets/images/arrow_circle.svg"
                alt="arrow button"
                className="w-12 md:w-18 absolute right-0"
              />
            </button>
          </div>

          {/* ── MOBILE: Date · Location · Venue Map row ── */}
          <div className="mt-8 flex flex-col md:flex-row items-start gap-3 lg:hidden">
            <button
              className="w-[193px] font-gilmer flex items-center rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl gap-2 px-4 py-2 text-sm text-white"
              style={{ backgroundColor: "#3F26DB" }}
            >
              <img src="/assets/images/calender.svg" alt="calendar" width={18} height={18} />
              March 25th & 26th, 2026
            </button>

            <button
              className="w-[193px] font-gilmer text-center px-4 py-2 rounded-tl-3xl rounded-tr-3xl rounded-br-3xl text-sm text-white"
              style={{ border: "1px solid #4B4DFF" }}
            >
              Shifa Convention Center
              <br />
              Perinthalmanna
            </button>

            {/* ✅ MOBILE Venue Map button — clean, consistent width */}
            <div className="w-[193px]">
              <VenueMapButton />
            </div>
          </div>
        </div>

        {/* Vertical divider — desktop */}
        <div className="mx-3 hidden lg:flex items-center">
          <span className="block h-full w-px bg-white opacity-70" />
        </div>

        {/* ── RIGHT PANEL — desktop only ── */}
        <div className="mt-8 md:mt-0 w-[581px] hidden lg:flex flex-col items-center">
          <div className="hidden md:flex justify-center mb-3">
            <Image
              src="/assets/images/img_icon2.svg"
              alt="icons"
              width={120}
              height={120}
              className="mt-22 w-16 sm:w-10 md:w-[120px]"
            />
          </div>

          {/* Book Tickets button */}
          <div className="flex mb-2 mt-10">
            <button
              onClick={() => {
                setIsRegisterModalOpen(true);
                analytics.heroRegisterClick();
              }}
              className="w-[441px] xl:w-[481px]
                flex items-center justify-between
                bg-[#9df094] hover:bg-[#b0f5a8]
                text-black font-light text-xl md:text-[36px]
                py-4 px-6 md:px-8
                rounded-l-xl rounded-r-[50px]
                transition-all duration-200 active:scale-95
                group relative"
            >
              <span className="mr-6 tracking-tight" style={{ fontFamily: "Calsans, sans-serif" }}>
                Book Tickets Now
              </span>
              <img
                src="/assets/images/arrow_circle.svg"
                alt="arrow button"
                className="w-12 md:w-18 absolute right-0"
              />
            </button>
          </div>

          {/* ✅ DESKTOP: Date · Location · Venue Map — all inline, perfectly aligned */}
          <div className="hidden lg:flex flex-row items-center gap-3 mt-8 flex-wrap justify-center">
            <button
              className="font-gilmer flex items-center gap-2 px-4 py-3 rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl h-[50px]"
              style={{ backgroundColor: "#3F26DB", color: "#FFFFFF" }}
            >
              <img src="/assets/images/calender.svg" alt="calendar" width={18} height={18} />
              March 25th & 26th, 2026
            </button>

            <button
              className="font-gilmer flex flex-col justify-center px-4 py-3 rounded-tl-3xl rounded-tr-3xl rounded-br-3xl h-[50px] leading-tight text-sm"
              style={{
                backgroundColor: "transparent",
                border: "1px solid #4B4DFF",
                color: "#FFFFFF",
              }}
            >
              Shifa Convention Center
              <span className="font-gilmer text-xs leading-tight">Perinthalmanna</span>
            </button>

            {/* ✅ DESKTOP Venue Map button — same row as date/location */}
            <VenueMapButton />
          </div>
        </div>
      </div>

      <Registration
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
      <AiModalPop
        showFloatingIcon={true}
        showFloatingform={true}
        onOpenRegistration={() => setIsRegisterModalOpen(true)}
      />
    </section>
  );
}

export default Hero;