const envSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteUrl = envSiteUrl?.replace(/\/+$/, "") || "https://lease.aihp.in";
