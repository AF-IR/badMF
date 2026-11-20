'use client';
/* دستیار هوشمند شناور — متصل به /api/assistant (z.ai + fallback) */
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

const CHIPS = [
  ['چطور سانس رزرو کنم؟', 'چطور رزرو کنم؟'],
  ['تعرفه‌ها چقدر است؟', 'تعرفه‌ها'],
  ['آدرس مجموعه کجاست؟', 'آدرس'],
  ['کلوپ کی افتتاح می‌شود؟', 'زمان افتتاح']
];

export default function Assistant() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [busy, setBusy] = useState(false);
  const [input, setInput] = useState('');
  const historyRef = useRef([]);
  const msgsRef = useRef(null);

  /* دستیار در پنل ادمین نمایش داده نمی‌شود */
  if (pathname && pathname.startsWith('/admin')) return null;

  useEffect(() => {
    if (open && msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [msgs, busy, open]);

  const send = async (q) => {
    const text = (q || input || '').trim();
    if (!text || busy) return;
    setInput('');
    setMsgs(m => [...m, { role: 'user', content: text }]);
    setBusy(true);
    try {
      const r = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...historyRef.current.slice(-11), { role: 'user', content: text }],
          page: pathname
        })
      });
      const j = await r.json();
      const reply = (j && j.reply) || 'الان نمی‌توانم پاسخ بدهم؛ لطفاً بعداً دوباره تلاش کنید.';
      setMsgs(m => [...m, { role: 'bot', content: reply }]);
      historyRef.current.push({ role: 'user', content: text }, { role: 'assistant', content: reply });
      if (historyRef.current.length > 12) historyRef.current = historyRef.current.slice(-12);
    } catch (e) {
      setMsgs(m => [...m, { role: 'bot', content: 'ارتباط با دستیار برقرار نشد. برای رزرو از صفحه «رزرو سانس» استفاده کنید یا با مجموعه تماس بگیرید.' }]);
    }
    setBusy(false);
  };

  return (
    <>
      <button className="ai-fab" id="aiFab" onClick={() => setOpen(v => !v)} aria-label="دستیار هوشمند" title="دستیار هوشمند مجموعه">
        💬<span className="ai-dot" />
      </button>
      <div className={'ai-panel' + (open ? ' open' : '')} role="dialog" aria-label="دستیار هوشمند">
        <div className="ai-head">
          <div>
            <div className="ai-title">🤖 دستیار هوشمند فاضل</div>
            <div className="ai-sub">پاسخ فوری درباره رزرو، تعرفه‌ها و مجموعه</div>
          </div>
          <button className="ai-close" onClick={() => setOpen(false)} aria-label="بستن">✕</button>
        </div>
        <div className="ai-msgs" ref={msgsRef}>
          {msgs.length === 0 && (
            <div className="ai-msg bot">سلام! 👋 من دستیار هوشمند مجموعه تفریحی فاضل هستم.\nدرباره رزرو سانس، تعرفه‌ها، ساعات کاری و آدرس می‌توانم کمک‌تان کنم. بپرسید!</div>
          )}
          {msgs.map((m, i) => <div key={i} className={'ai-msg ' + (m.role === 'user' ? 'user' : 'bot')}>{m.content}</div>)}
          {busy && (
            <div className="ai-typing"><span className="tdot" /><span className="tdot" /><span className="tdot" /> در حال نوشتن…</div>
          )}
        </div>
        <div className="ai-chips">
          {CHIPS.map(([q, label]) => <button key={q} onClick={() => send(q)}>{label}</button>)}
        </div>
        <div className="ai-input">
          <input
            id="aiInput"
            type="text"
            placeholder="سوال خود را بنویسید…"
            aria-label="پیام به دستیار"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') send(); }}
          />
          <button className="ai-send" onClick={() => send()}>ارسال</button>
        </div>
      </div>
    </>
  );
}
