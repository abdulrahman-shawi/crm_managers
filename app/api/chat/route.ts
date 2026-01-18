// أو الموديل الذي تفضله
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { NextRequest, NextResponse } from "next/server";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { createAgent } from "langchain";

// ملاحظة: تأكد من أن DATABASE_URL صحيح
const DB_URI = "postgresql://neondb_owner:npg_dHiqULQ0rnz5@ep-restless-mode-a8ga6983-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require";

// إنشاء الحافظ (Checkpointer) خارج نطاق الـ POST لضمان كفاءة الأداء
const checkpointer = PostgresSaver.fromConnString(DB_URI);

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: "AIzaSyBcZrBOrt0icTkQAf-BxaHi1cO4c0gBVQc"
});
export async function POST(req: NextRequest) {
  try {
    
    const { message } = await req.json();

    // 1. إعداد جداول الحفظ (ضروري جداً في المرة الأولى)
    await checkpointer.setup();
    // 3. إنشاء الوكيل (Agent)
    // ملاحظة: الأدوات (tools) يجب أن تحتوي على أدوات SQL التي سنضيفها لاحقاً
    const agent = createAgent({
      model: model,
      tools: [], // أضف أدوات SQL هنا لاحقاً للوصول لبيانات CRM
     checkpointer,
      systemPrompt: `أنت مساعد ذكاء اصطناعي متخصص في تحليل بيانات المبيعات من قاعدة بيانات PostgreSQL داخل نظام CRM.

⚠️ قواعد إلزامية:
- لا تعتمد على التخمين أو المعرفة المسبقة.
- استخدم فقط الأدوات المتاحة لك (Postgres Tools).
- أي عملية حسابية يجب أن تعتمد على بيانات فعلية من الجداول.
- لا تفترض وجود خصومات إلا إذا كانت الأعمدة موجودة في الجداول.

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
- استخرج جميع الفواتير ضمن الشهر المحدد.
- لكل فاتورة احصل على:
  - id
  - discount (خصم الفاتورة إن وُجد)
  - total أو subtotal (إن وُجد)
- خزّن معرفات الفواتير.

⚠️ إذا لم يكن هناك عمود discount → اعتبر الخصم = 0.

---

3️⃣ جدول InvoiceItem:
- استخرج جميع العناصر المرتبطة بالفواتير.
- لكل عنصر احصل على:
  - productId
  - quantity
  - price (سعر البيع للوحدة)
  - discount (خصم المنتج إن وُجد)

⚠️ إذا لم يوجد خصم على المنتج → اعتبره 0.

---

4️⃣ جدول Product:
- لكل productId مستخدم:
  - احصل على priceLow (سعر الجملة)
  - name

---

5️⃣ منطق الحساب المحاسبي الصحيح:

أ) سعر البيع الفعلي للمنتج:
(price - itemDiscount) × quantity

ب) توزيع خصم الفاتورة:
- وزّع خصم الفاتورة بالتناسب على عناصرها (حسب قيمة كل عنصر).

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
  - استخرج المصاريف من جدول FixedExpense لنفس الشهر
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
    const config = { configurable: { thread_id: "user_session_1" } };
    
    const result = await agent.invoke(
      { messages: [{ role: "user", content: message }] },
      config
    );

    // 5. الحصول على آخر رسالة من الوكيل
    const lastMessage = result.messages[result.messages.length - 1];

    return NextResponse.json({ 
        output: lastMessage.content 
    });

  } catch (error: any) {
    console.error("Agent Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}