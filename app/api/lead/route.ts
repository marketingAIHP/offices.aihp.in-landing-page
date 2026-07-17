import { NextResponse } from "next/server";

const HUBSPOT_PORTAL_ID = "45909301";
const HUBSPOT_FORM_ID = "345ea5aa-a700-41ca-a9b0-f86fac97fc6f";
const HUBSPOT_SUBMIT_URL = `https://api.hsforms.com/submissions/v3/integration/submit/${HUBSPOT_PORTAL_ID}/${HUBSPOT_FORM_ID}`;

type HubSpotField = {
  name: string;
  value: string;
};

type HubSpotPayload = {
  fields?: HubSpotField[];
  context?: {
    hutk?: string;
    pageUri?: string;
    pageName?: string;
  };
  captchaResponse?: string;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HubSpotPayload;

    if (!body.captchaResponse) {
      return NextResponse.json(
        { ok: false, error: "Please complete the CAPTCHA before submitting." },
        { status: 400 },
      );
    }

    const fields = (body.fields || []).filter(
      (field) => field?.name && typeof field.value === "string" && field.value.trim(),
    );

    if (!fields.length) {
      return NextResponse.json(
        { ok: false, error: "Please complete the required fields and try again." },
        { status: 400 },
      );
    }

    const hubspotResponse = await fetch(HUBSPOT_SUBMIT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submittedAt: Date.now(),
        fields,
        context: body.context,
      }),
      cache: "no-store",
    });

    const rawText = await hubspotResponse.text();
    let hubspotJson: Record<string, unknown> | null = null;

    if (rawText) {
      try {
        hubspotJson = JSON.parse(rawText) as Record<string, unknown>;
      } catch {
        hubspotJson = null;
      }
    }

    if (!hubspotResponse.ok) {
      const errorMessage =
        typeof hubspotJson?.message === "string"
          ? hubspotJson.message
          : "HubSpot rejected the submission. Please verify the form fields in HubSpot.";

      return NextResponse.json(
        { ok: false, error: errorMessage, details: hubspotJson ?? rawText },
        { status: hubspotResponse.status },
      );
    }

    return NextResponse.json({
      ok: true,
      redirectUri:
        typeof hubspotJson?.redirectUri === "string" ? hubspotJson.redirectUri : null,
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "We couldn't send your request. Please call us instead." },
      { status: 500 },
    );
  }
}
