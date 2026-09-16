import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const verifyToken = url.searchParams.get('hub.verify_token')
  const challenge = url.searchParams.get('hub.challenge')

  // تحقق من التوكن — ضع التوكن في متغير البيئة WEBHOOK_VERIFY_TOKEN
  if (verifyToken && (verifyToken === process.env.WEBHOOK_VERIFY_TOKEN || verifyToken === 'YOUR_VERIFY_TOKEN')) {
    return new NextResponse(challenge ?? '', { status: 200 })
  }

  return new NextResponse(null, { status: 403 })
}

export async function POST(request: Request) {
  let body: any
  try {
    body = await request.json()
  } catch (e) {
    const text = await request.text()
    try {
      body = JSON.parse(text)
    } catch {
      body = text
    }
  }

  // استقبال الرسائل الواردة — يسجل في لوج الخادم
  console.log('Webhook received:', body)

  return NextResponse.json({ received: true })
}
