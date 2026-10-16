import { NextResponse } from "next/server";

import { runDailyOpeningBalanceUpdate } from "@/lib/opening-balance";

export const dynamic = "force-dynamic";

// مسار مجدول (Cron) لتحديث مبلغ فتح الحساب يومياً عند الساعة 12 ليلاً.
// يُستدعى من Vercel Cron (عبر vercel.json) أو من أي مجدول خارجي
// (مثل Windows Task Scheduler أو cron-job.org) مع ترويسة التخويل.
export async function GET(request: Request) {
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret) {
        const authHeader = request.headers.get("authorization");
        if (authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: "غير مصرح بالوصول" }, { status: 401 });
        }
    } else if (process.env.NODE_ENV === "production") {
        // في الإنتاج يجب ضبط CRON_SECRET حتى لا يستطيع أي شخص تشغيل المسار
        return NextResponse.json(
            { error: "متغير البيئة CRON_SECRET غير مضبوط على الخادم" },
            { status: 500 }
        );
    }

    try {
        const dryRun =
            process.env.NODE_ENV !== "production" &&
            new URL(request.url).searchParams.get("dryRun") === "1";

        const result = await runDailyOpeningBalanceUpdate({ dryRun });
        return NextResponse.json(result, { status: 200 });
    } catch (error: any) {
        console.error("Daily opening balance cron failed:", error);
        return NextResponse.json(
            { error: "فشل تحديث مبلغ فتح الحساب", details: error?.message },
            { status: 500 }
        );
    }
}
