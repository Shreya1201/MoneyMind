import { useState } from 'react';
import { useHttp } from "../api/Http";

const SUGGESTED = [
  "Am I saving enough this month?",
  "Which category am I overspending on?",
  "How can I improve my balance?",
];

export default function AIChatWidget() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { httpGet, httpPost } = useHttp();

  const send = async (text) => {
    const question = text || input;
    if (!question.trim()) return;
    setMessages(m => [...m, { role: 'user', text: question }]);
    setInput('');
    setLoading(true);
    try {
      const res = await httpPost('/ai/insights', { question });
      setMessages(m => [...m, { role: 'ai', text: res.answer }]);
    } catch {
      setMessages(m => [...m, { role: 'ai', text: 'Sorry, unable to fetch insights right now.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="ai-widget">
      <div className="ai-messages">
        {messages.length === 0 && (
          <div className="ai-suggestions">
            {SUGGESTED.map(s => (
              <button key={s} onClick={() => send(s)} className="suggestion-chip">{s}</button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`ai-bubble ${m.role}`}>{m.text}</div>
        ))}
        {loading && <div className="ai-bubble ai">Thinking...</div>}
      </div>
      <div className="ai-input-row">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask about your finances..." />
        <button onClick={() => send()}>Send</button>
      </div>
    </div>
  );
}