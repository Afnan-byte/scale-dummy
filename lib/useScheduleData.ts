"use client";

import { useState, useEffect } from "react";
import Papa from "papaparse";
import { convertDriveUrl, type ScheduleItem, type Speaker } from "./googleSheets";

// ─────────────────────────────────────────────────────────────────────────────
// 🔧 SET YOUR GOOGLE SHEET CSV URL HERE
//
// Steps to get this URL:
//   1. Open your Google Sheet
//   2. File → Share → Publish to web
//   3. Choose "Comma-separated values (.csv)" and click Publish
//   4. Copy the URL and paste it below
//
// It should look like:
//   https://docs.google.com/spreadsheets/d/SHEET_ID/pub?output=csv
// ─────────────────────────────────────────────────────────────────────────────
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRLPx5G8UUeixg2G66PwJX3MMO5hbg6if5lcb_32I88bQbBkis3WgUkyo61_tCb7bhqOKsHDhcYgQuk/pub?gid=0&single=true&output=csv";

// Maximum number of speakers to scan per row
const MAX_SPEAKERS = 10;

// ─────────────────────────────────────────────────────────────────────────────
// Row → ScheduleItem conversion
// ─────────────────────────────────────────────────────────────────────────────

function rowToScheduleItem(row: Record<string, string>): ScheduleItem | null {
  // Skip completely empty rows
  const values = Object.values(row).map((v) => v.trim());
  if (values.every((v) => v === "")) return null;

  // Collect speakers dynamically (speaker1_name … speaker10_name)
  const speakers: Speaker[] = [];
  for (let i = 1; i <= MAX_SPEAKERS; i++) {
    const name = (row[`speaker${i}_name`] ?? "").trim();
    const role = (row[`speaker${i}_role`] ?? "").trim();
    const img = convertDriveUrl((row[`speaker${i}_img`] ?? "").trim());

    if (name) {
      speakers.push({ name, role, img });
    }
  }

  return {
    title: (row["title"] ?? "").trim(),
    type: (row["type"] ?? "").trim(),
    startTime: (row["startTime"] ?? "").trim(),
    endTime: (row["endTime"] ?? "").trim(),
    posterImg: convertDriveUrl((row["posterImg"] ?? "").trim()),
    speakers,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

interface UseScheduleDataResult {
  data: ScheduleItem[];
  loading: boolean;
  error: string | null;
}

export function useScheduleData(): UseScheduleDataResult {
  const [data, setData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAndParse() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(SHEET_CSV_URL);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch schedule data (HTTP ${response.status})`
          );
        }

        const csvText = await response.text();

        Papa.parse<Record<string, string>>(csvText, {
          header: true,         // first row = column names
          skipEmptyLines: true, // skip blank lines automatically
          transformHeader: (h) => h.trim(),
          transform: (v) => v,  // keep raw; row conversion does the trimming
          complete: (result) => {
            if (cancelled) return;

            const items = result.data
              .map(rowToScheduleItem)
              .filter((item): item is ScheduleItem => item !== null);

            setData(items);
            setLoading(false);
          },
          error: (err: Error) => {
            if (cancelled) return;
            setError(`CSV parse error: ${err.message}`);
            setLoading(false);
          },
        });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
          setLoading(false);
        }
      }
    }

    fetchAndParse();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}