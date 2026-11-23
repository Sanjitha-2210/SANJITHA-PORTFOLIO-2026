import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString?: string) {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Universal date parser for certifications to arrange by newest / most recent date first.
 * Accurately extracts dates from:
 * - Specific formats: "4 August 2026", "September 2024", "24-09-2024"
 * - Subtitles: "SRMV College • September 2024"
 * - Issue date field: "2026", "2025", "2024"
 */
export function getCertificateDateScore(cert: {
  title?: string;
  issuer?: string;
  issue_date?: string;
  description?: string;
  order_index?: number;
}): number {
  const combined = `${cert.issuer || ""} ${cert.title || ""} ${cert.issue_date || ""} ${cert.description || ""}`.toLowerCase();

  const MONTHS: Record<string, number> = {
    january: 1, jan: 1,
    february: 2, feb: 2,
    march: 3, mar: 3,
    april: 4, apr: 4,
    may: 5,
    june: 6, jun: 6,
    july: 7, jul: 7,
    august: 8, aug: 8,
    september: 9, sep: 9, sept: 9,
    october: 10, oct: 10,
    november: 11, nov: 11,
    december: 12, dec: 12,
  };

  // 1. Look for DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = combined.match(/\b(\d{1,2})[-/](\d{1,2})[-/](\d{4})\b/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10);
    const year = parseInt(dmyMatch[3], 10);
    return year * 10000 + month * 100 + day;
  }

  // 2. Look for Day + Month + Year or Month + Year (e.g. "4 August 2026", "September 2024", "Dec 2024")
  const monthNames = Object.keys(MONTHS).join("|");
  const monthYearRegex = new RegExp(`(?:(\\d{1,2})\\s+)?(${monthNames})\\s+(\\d{4})`, "i");
  const myMatch = combined.match(monthYearRegex);
  if (myMatch) {
    const day = myMatch[1] ? parseInt(myMatch[1], 10) : 1;
    const month = MONTHS[myMatch[2].toLowerCase()] || 1;
    const year = parseInt(myMatch[3], 10);
    return year * 10000 + month * 100 + day;
  }

  // 3. Look for 4-digit year (e.g. 2026, 2025, 2024)
  const yearMatch = combined.match(/\b(202\d|203\d)\b/);
  if (yearMatch) {
    const year = parseInt(yearMatch[1], 10);
    return year * 10000 + 101;
  }

  // 4. Fallback based on order_index or 0
  return (cert.order_index ? 1000 - cert.order_index : 0);
}

/**
 * Sorts certifications by date in descending order (newest/most recent first).
 */
export function sortCertificatesByDate<T extends {
  title?: string;
  issuer?: string;
  issue_date?: string;
  description?: string;
  order_index?: number;
}>(certs: T[]): T[] {
  return [...certs].sort((a, b) => {
    const scoreA = getCertificateDateScore(a);
    const scoreB = getCertificateDateScore(b);
    return scoreB - scoreA;
  });
}

