import { NextResponse } from "next/server";

const OPT_IN_REGIONS = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE", "IS", "LI", "NO", "GB", "CH",
]);

export function GET(request: Request) {
  const country = (request.headers.get("cf-ipcountry") || request.headers.get("x-vercel-ip-country") || "").toUpperCase();
  return NextResponse.json({ country, optIn: OPT_IN_REGIONS.has(country) });
}
