// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface Speaker {
  name: string;
  role: string;
  img: string;
}

export interface ScheduleItem {
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  posterImg: string;
  speakers: Speaker[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Google Drive URL normaliser
//
// Accepts any of these formats and returns a working thumbnail link:
//   • https://drive.google.com/file/d/FILE_ID/view?usp=sharing
//   • https://drive.google.com/open?id=FILE_ID
//   • https://drive.google.com/uc?export=view&id=FILE_ID
//   • Any other URL / local path (returned unchanged)
//
// Uses /thumbnail endpoint which works reliably as <img src> without CORS issues
// ─────────────────────────────────────────────────────────────────────────────

export function convertDriveUrl(url: string): string {
  if (!url || !url.includes("drive.google.com")) return url;

  // Already converted to thumbnail format
  if (url.includes("drive.google.com/thumbnail")) return url;

  // Already in uc?export=view format — extract id and convert to thumbnail
  if (url.includes("uc?export=view")) {
    const idMatch = url.match(/[?&]id=([^&]+)/);
    if (idMatch) {
      return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w400`;
    }
    return url;
  }

  // /file/d/FILE_ID/…
  const fileMatch = url.match(/\/file\/d\/([^/?&#]+)/);
  if (fileMatch) {
    return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w400`;
  }

  // ?id=FILE_ID or &id=FILE_ID
  const idMatch = url.match(/[?&]id=([^&]+)/);
  if (idMatch) {
    return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w400`;
  }

  return url;
}