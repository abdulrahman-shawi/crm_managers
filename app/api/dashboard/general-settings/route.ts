import { NextResponse } from "next/server";

import { getGeneralSettings } from "@/lib/settings";

export async function GET() {
  try {
    const settings = await getGeneralSettings();

    return NextResponse.json(
      {
        openingBalance: Number(settings?.openingBalance ?? 0),
        currency: settings?.currency ?? "SAR",
        siteName: settings?.siteName ?? "",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch general settings:", error);
    return NextResponse.json({ error: "فشل في جلب الإعدادات العامة" }, { status: 500 });
  }
}