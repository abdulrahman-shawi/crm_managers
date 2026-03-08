import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { DynamicTool } from "@langchain/core/tools";
import { createAgent } from "langchain";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

if (!geminiApiKey) {
  throw new Error("GEMINI_API_KEY is not set");
}

const checkpointer = PostgresSaver.fromConnString(databaseUrl);

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: geminiApiKey,
});

const pool = new Pool({ connectionString: databaseUrl });

const PRISMA_CAMEL_CASE_COLUMNS: Record<string, string> = {
  invoiceid: "invoiceId",
  productid: "productId",
  unitprice: "unitPrice",
  subtotal: "subTotal",
  totalamount: "totalAmount",
  pricelow: "priceLow",
  createdat: "createdAt",
};

const normalizeSqlForPrismaIdentifiers = (query: string): string => {
  let nextQuery = query;

  nextQuery = nextQuery.replace(
    /\b([a-zA-Z_][a-zA-Z0-9_]*)\.(invoiceid|invoiceId|productid|productId|unitprice|unitPrice|subtotal|subTotal|totalamount|totalAmount|pricelow|priceLow|createdat|createdAt)\b/g,
    (_full, alias: string, column: string) => {
      const normalized = PRISMA_CAMEL_CASE_COLUMNS[column.toLowerCase()] ?? column;
      return `${alias}."${normalized}"`;
    }
  );

  nextQuery = nextQuery.replace(
    /(?<![".\w])(invoiceid|invoiceId|productid|productId|unitprice|unitPrice|subtotal|subTotal|totalamount|totalAmount|pricelow|priceLow|createdat|createdAt)(?!["\w])/g,
    (column: string) => {
      const normalized = PRISMA_CAMEL_CASE_COLUMNS[column.toLowerCase()] ?? column;
      return `"${normalized}"`;
    }
  );

  return nextQuery;
};

const sqlReadOnlyTool = new DynamicTool({
  name: "query_crm_database",
  description:
    "Use this tool to run READ-ONLY SQL queries on the CRM PostgreSQL database. Input must be a SQL string and should start with SELECT or WITH. Important: use Prisma table names and camelCase columns with double quotes like \"Invoice\", \"InvoiceItem\", \"Product\", \"FixedExpense\", and columns like \"invoiceId\", \"productId\", \"unitPrice\", \"totalAmount\", \"priceLow\", \"createdAt\".",
  func: async (query: string) => {
    const normalized = query.trim().toLowerCase();

    if (!(normalized.startsWith("select") || normalized.startsWith("with"))) {
      return "Only read-only SELECT/WITH queries are allowed.";
    }

    try {
      const normalizedQuery = normalizeSqlForPrismaIdentifiers(query);
      const result = await pool.query(normalizedQuery);
      return JSON.stringify(result.rows.slice(0, 200));
    } catch (error: any) {
      const errorMessage = String(error?.message ?? "Unknown SQL error");

      const missingColumnMatch = errorMessage.match(/column\s+([a-zA-Z0-9_."]+)\s+does not exist/i);
      const missingColumnRaw = missingColumnMatch?.[1]?.replaceAll('"', "") ?? "";
      const missingColumnName = missingColumnRaw.includes(".")
        ? missingColumnRaw.split(".").pop() ?? ""
        : missingColumnRaw;

      if (missingColumnName) {
        const correctedColumn = PRISMA_CAMEL_CASE_COLUMNS[missingColumnName.toLowerCase()];

        if (correctedColumn) {
          try {
            const correctedQuery = normalizeSqlForPrismaIdentifiers(query);
            const retriedResult = await pool.query(correctedQuery);
            return JSON.stringify(retriedResult.rows.slice(0, 200));
          } catch {
          }
        }
      }

      if (errorMessage.includes("does not exist")) {
        return `SQL error: ${errorMessage}. Hint: In PostgreSQL with Prisma, quote table and camelCase column names with double quotes. Example join: FROM "InvoiceItem" ii JOIN "Invoice" i ON ii."invoiceId" = i."id". Use tables: "Invoice", "InvoiceItem", "Product", "FixedExpense", "User", "Category", "Customer". Common columns: "invoiceId", "productId", "unitPrice", "discount", "subTotal", "totalAmount", "priceLow", "createdAt", "date".`;
      }

      return `SQL error: ${errorMessage}`;
    }
  },
});

const extractTextContent = (content: unknown): string => {
  if (typeof content === "string") {
    return content.trim();
  }

  if (Array.isArray(content)) {
    const textParts = content
      .map((item: any) => {
        if (typeof item === "string") {
          return item;
        }

        if (item && typeof item === "object") {
          if (typeof item.text === "string") {
            return item.text;
          }

          if (typeof item.content === "string") {
            return item.content;
          }
        }

        return "";
      })
      .filter((part) => part && part.trim().length > 0);

    return textParts.join("\n").trim();
  }

  if (content && typeof content === "object") {
    const maybeText = (content as any).text;
    if (typeof maybeText === "string") {
      return maybeText.trim();
    }
  }

  return "";
};

const extractBestTextResponse = (messages: any[] | undefined): string => {
  if (!Array.isArray(messages) || messages.length === 0) {
    return "";
  }

  for (let index = messages.length - 1; index >= 0; index--) {
    const message = messages[index];
    const text = extractTextContent(message?.content);
    if (text) {
      return text;
    }
  }

  return "";
};

const looksLikeRawSqlDump = (text: string): boolean => {
  const trimmed = text.trim();
  if (!trimmed) {
    return false;
  }

  const startsLikeJson = trimmed.startsWith("[") || trimmed.startsWith("{");
  const containsSqlRowKeys =
    /"invoiceId"|"productId"|"unitPrice"|"subTotal"|"totalAmount"|"createdAt"/i.test(
      trimmed
    );

  return startsLikeJson && containsSqlRowKeys;
};

const looksUnstructuredOrTooLong = (text: string): boolean => {
  const trimmed = text.trim();
  if (!trimmed) {
    return true;
  }

  const hasMainSections =
    trimmed.includes("📅 **الشهر") &&
    trimmed.includes("💰 **إجمالي المبيعات") &&
    trimmed.includes("📦 **إجمالي تكلفة البضائع") &&
    trimmed.includes("📈 **الربح قبل المصاريف");

  const productMentions = (trimmed.match(/Product ID/gi) ?? []).length;
  const veryLong = trimmed.length > 7000;
  const tooManyProductLines = productMentions > 25;

  return !hasMainSections || veryLong || tooManyProductLines;
};

const parseRetrySeconds = (errorMessage: string): number | null => {
  const directSecondsMatch = errorMessage.match(/retry in\s+(\d+(?:\.\d+)?)s?/i);
  if (directSecondsMatch?.[1]) {
    return Math.ceil(Number(directSecondsMatch[1]));
  }

  const delayMatch = errorMessage.match(/"retryDelay"\s*:\s*"(\d+)s"/i);
  if (delayMatch?.[1]) {
    return Number(delayMatch[1]);
  }

  return null;
};

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }

    const threadId =
      typeof sessionId === "string" && sessionId.trim().length > 0
        ? sessionId
        : "default_session";

    // 1. إعداد جداول الحفظ (ضروري جداً في المرة الأولى)
    await checkpointer.setup();
    // 3. إنشاء الوكيل (Agent)
    // ملاحظة: الأدوات (tools) يجب أن تحتوي على أدوات SQL التي سنضيفها لاحقاً
    const agent = createAgent({
      model: model,
      tools: [sqlReadOnlyTool],
      checkpointer,
      systemPrompt: `أنت مساعد ذكاء اصطناعي متخصص في تحليل بيانات المبيعات من قاعدة بيانات PostgreSQL داخل نظام CRM.

⚠️ قواعد إلزامية:
- لا تعتمد على التخمين أو المعرفة المسبقة.
- استخدم فقط الأدوات المتاحة لك (Postgres Tools).
- أي عملية حسابية يجب أن تعتمد على بيانات فعلية من الجداول.
- لا تفترض وجود خصومات إلا إذا كانت الأعمدة موجودة في الجداول.
- استخدم أسماء الجداول كما هي في PostgreSQL مع علامات تنصيص مزدوجة عند الحاجة.
- أسماء الجداول الأساسية في هذا النظام: "Invoice", "InvoiceItem", "Product", "FixedExpense", "User", "Category", "Customer".
- ملاحظة SQL مهمة: استخدم علامات تنصيص مزدوجة دائمًا مع أسماء الأعمدة camelCase مثل "invoiceId", "productId", "unitPrice", "totalAmount", "priceLow", "createdAt".

🎯 الهدف:
حساب أرباح شهر يحدده المستخدم بدقة محاسبية، مع الأخذ بالحسبان:
- خصومات الفواتير
- خصومات المنتجات
- المصاريف الثابتة (اختياري)

---


📌 خطوات التنفيذ الإلزامية:

1️⃣ التحقق من المدخلات:
- إذا لم يذكر المستخدم الشهر والسنة → اسأله عنهما.
- بعد تحديد الشهر والسنة → اسأل المستخدم:

❓ "هل تريد احتساب المصاريف الثابتة (Fixed Expenses) ضمن الحساب؟ (نعم / لا)"

---

2️⃣ جدول Invoice:
- استخرج جميع الفواتير ضمن الشهر المحدد من الجدول "Invoice".
- لكل فاتورة احصل على: جميع المعلومات المتعلقة بها، خصوصاً:
  - id
  - date
  - createdAt
  - totalAmount (المبلغ الإجمالي قبل الخصم)

---

3️⃣ جدول InvoiceItem:
- استخرج جميع العناصر المرتبطة بالفواتير من الجدول "InvoiceItem".
- لكل عنصر احصل على: 
  - invoiceId (لربطه بالفاتورة)
  - productId
  - quantity
  - unitPrice (سعر الوحدة قبل الخصم)
  - discount (خصم المنتج)
  - subTotal

⚠️ إذا لم يوجد خصم على المنتج → اعتبره 0.
⚠️ عند كتابة SQL لا تكتب invoiceId بدون تنصيص، اكتبها "invoiceId".

---

4️⃣ جدول Product:
- لكل productId مستخدم من الجدول "Product":
  - احصل على priceLow (سعر الجملة)
  - name

---

5️⃣ منطق الحساب المحاسبي الصحيح:

أ) سعر البيع الفعلي للمنتج:
(unitPrice - discount) × quantity

ب) لا تفترض وجود خصم على مستوى الفاتورة:
- إذا لم يوجد عمود خصم في "Invoice"، استخدم خصم العناصر من "InvoiceItem.discount" فقط.

ج) الربح لكل عنصر:
(سعر البيع الفعلي بعد الخصومات - priceLow × quantity)

---

6️⃣ المجاميع:
- إجمالي المبيعات بعد الخصومات
- إجمالي تكلفة البضائع (سعر الجملة)
- الربح قبل المصاريف

---

7️⃣ المصاريف الثابتة (اختياري):
- إذا وافق المستخدم:
  - استخرج المصاريف من الجدول "FixedExpense" لنفس الشهر
  - احسب مجموعها
  - صافي الربح = الربح قبل المصاريف - المصاريف الثابتة

---

8️⃣ الإخراج النهائي:

📅 الشهر: (اسم الشهر / السنة)

💰 إجمالي المبيعات (بعد الخصومات): XXX  
📦 إجمالي تكلفة البضائع: XXX  
📈 الربح قبل المصاريف: XXX  

إذا تم احتساب المصاريف:
🏢 المصاريف الثابتة: XXX  
✅ صافي الربح النهائي: XXX  

---

📊 تفصيل اختياري:
- اسم المنتج
- الكمية
- إجمالي الخصم
- الربح لكل منتج

⚠️ في حال عدم وجود بيانات:
أبلغ المستخدم بوضوح.
`
    });

    // 4. التشغيل مع تحديد thread_id لضمان تذكر المحادثة
    const config = { configurable: { thread_id: threadId } };
    
    const result = await agent.invoke(
      { messages: [{ role: "user", content: message }] },
      config
    );

    // 5. الحصول على أفضل رسالة نصية من الوكيل
    let output = extractBestTextResponse(result.messages);

    if (looksLikeRawSqlDump(output)) {
      const recoveryPrompt = `الرد السابق كان عبارة عن JSON خام من قاعدة البيانات، وهذا غير مقبول للمستخدم النهائي.

أعد الإجابة الآن كتقرير محاسبي عربي مفصل وواضح بدون أي JSON أو SQL خام.

التزم بالنقاط التالية:
- اعرض: إجمالي المبيعات بعد الخصومات، إجمالي تكلفة البضائع، الربح قبل المصاريف.
- إذا اختار المستخدم عدم احتساب المصاريف الثابتة، اذكر ذلك صراحة.
- أضف تفصيلًا لكل منتج (الاسم، الكمية، إجمالي الخصم، الربح).
- إذا البيانات غير كافية، قم بجلب المطلوب عبر الأداة ثم أعطِ النتيجة النهائية مباشرة.
- لا تطلب من المستخدم أسماء أعمدة ولا تفاصيل تقنية.`;

      const recoveredResult = await agent.invoke(
        { messages: [{ role: "user", content: recoveryPrompt }] },
        config
      );

      const recoveredOutput = extractBestTextResponse(recoveredResult.messages);
      if (recoveredOutput) {
        output = recoveredOutput;
      }
    }

    if (looksUnstructuredOrTooLong(output)) {
      const formattingPrompt = `أعد صياغة الإجابة السابقة فقط بصيغة عربية منظمة ومختصرة، بدون أي JSON خام، وبدون شرح خطوات داخلية.

التزم بهذا القالب حرفيًا:

📅 **الشهر:** <اسم الشهر> <السنة>

💰 **إجمالي المبيعات (بعد الخصومات):** <رقم>
📦 **إجمالي تكلفة البضائع:** <رقم>
📈 **الربح قبل المصاريف:** <رقم>
🏢 **المصاريف الثابتة:** غير محتسبة (حسب طلبك)

📊 **تفصيل الربحية حسب المنتج (مختصر):**
- اعرض بحد أقصى 15 سطرًا فقط.
- كل سطر: اسم المنتج/المعرف | الكمية | إجمالي الخصم | الربح.

⚠️ **أعلى العناصر الخاسرة (إن وجدت):**
- اعرض بحد أقصى 5 عناصر خاسرة.

✅ **خلاصة سريعة:**
- سطران فقط يوضحان حالة الربحية العامة.

ممنوع عرض أكثر من 15 منتج في التفصيل.`;

      const formattedResult = await agent.invoke(
        { messages: [{ role: "user", content: formattingPrompt }] },
        config
      );

      const formattedOutput = extractBestTextResponse(formattedResult.messages);
      if (formattedOutput) {
        output = formattedOutput;
      }
    }

    return NextResponse.json({ 
      output: output || "تعذر استخراج رد نصي من النموذج. حاول إعادة صياغة السؤال."
    });

  } catch (error: any) {
    const errorMessage = String(error?.message ?? "Unknown error");
    console.error("Agent Error:", errorMessage);

    const isQuotaError =
      errorMessage.includes("429") ||
      errorMessage.toLowerCase().includes("quota exceeded") ||
      errorMessage.toLowerCase().includes("too many requests");

    if (isQuotaError) {
      const retryAfterSeconds = parseRetrySeconds(errorMessage);
      const retryMessage =
        retryAfterSeconds && retryAfterSeconds > 0
          ? `تم تجاوز حد استخدام Gemini مؤقتًا. حاول مرة أخرى بعد ${retryAfterSeconds} ثانية.`
          : "تم تجاوز حد استخدام Gemini مؤقتًا. حاول مرة أخرى بعد دقيقة تقريبًا.";

      return NextResponse.json(
        {
          error: retryMessage,
          code: "GEMINI_QUOTA_EXCEEDED",
          retryAfterSeconds: retryAfterSeconds ?? 60,
        },
        { status: 429 }
      );
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}