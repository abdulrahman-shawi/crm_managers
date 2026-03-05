'use client';

import { FormEvent, useMemo, useState } from 'react';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const ChatPage = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const sessionId = useMemo(() => {
    if (typeof window === 'undefined') return 'default-session';

    const key = 'langchain_session_id';
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;

    const generated = `session-${crypto.randomUUID()}`;
    window.localStorage.setItem(key, generated);
    return generated;
  }, []);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setError('');
    setIsLoading(true);

    const userMessage: ChatMessage = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          sessionId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'حدث خطأ أثناء التواصل مع LangChain.');
      }

      const assistantText =
        typeof data?.output === 'string'
          ? data.output
          : JSON.stringify(data?.output ?? 'لا يوجد رد.');

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: assistantText },
      ]);
    } catch (submitError: any) {
      setError(submitError?.message || 'تعذر إرسال الرسالة.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-4xl flex-col gap-4 px-4 py-6 md:px-6">
      <header className="rounded-lg border bg-background p-4">
        <h1 className="text-2xl font-bold">محادثة LangChain</h1>
        <p className="text-sm text-muted-foreground">
          اكتب سؤالك وسيتم إرساله إلى الوكيل عبر المسار API.
        </p>
      </header>

      <section className="flex-1 space-y-3 overflow-y-auto rounded-lg border bg-background p-4">
        {messages.length === 0 ? (
          <p className="text-sm text-muted-foreground">ابدأ بإرسال أول رسالة.</p>
        ) : (
          messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                message.role === 'user'
                  ? 'ml-auto bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              {message.content}
            </div>
          ))
        )}

        {isLoading && (
          <p className="text-sm text-muted-foreground">جاري انتظار رد LangChain...</p>
        )}
      </section>

      <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border bg-background p-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="اكتب رسالتك هنا..."
          rows={4}
          className="w-full resize-none rounded-md border bg-transparent p-3 text-sm outline-none"
        />

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center justify-end gap-2">
          <button
            type="submit"
            disabled={isLoading || input.trim().length === 0}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? 'جاري الإرسال...' : 'إرسال'}
          </button>
        </div>
      </form>
    </main>
  );
};

export default ChatPage;
