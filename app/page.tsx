'use client';

import { useState } from 'react';

export default function AiSalesPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'حدث خطأ غير متوقع');
      }

      const data = await res.json();
      setResponse(data.output);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          📊 تحليل أرباح المبيعات (CRM AI)
        </h1>

        <p className="text-gray-600 text-sm">
          اكتب طلبك مثل: <br />
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
            احسب أرباح شهر 1 سنة 2025
          </span>
        </p>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="اكتب سؤالك هنا..."
          rows={5}
          className="w-full border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? '⏳ جاري التحليل...' : '🚀 تنفيذ التحليل'}
        </button>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
            ❌ {error}
          </div>
        )}

        {response && (
          <div className="bg-gray-50 border rounded-xl p-4 whitespace-pre-wrap text-gray-800">
            {response}
          </div>
        )}
      </div>
    </div>
  );
}
