import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMessage } from '../api';

export default function CreateMessageForm() {
  const qc = useQueryClient();
  const [text, setText] = useState('');
  const [sessionId, setSessionId] = useState<number>(1);
  const [userId, setUserId] = useState<string>('');

  const m = useMutation({
    mutationFn: () => createMessage({
      text,
      session_id: sessionId,
      user_id: userId.trim() === '' ? null : Number(userId),
    }),
    onSuccess: () => {
      setText('');
      qc.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); if (!text.trim()) return; m.mutate(); }}
      className="w-full max-w-3xl mx-auto my-4 p-4 rounded-2xl shadow border flex flex-col gap-3"
    >
      <div className="flex items-center gap-2">
        <input
          className="flex-1 px-3 py-2 rounded-xl border"
          placeholder="Write a message…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button
          type="submit"
          disabled={m.isPending}
          className="px-4 py-2 rounded-xl shadow disabled:opacity-50 border"
        >
          {m.isPending ? 'Saving…' : 'Add'}
        </button>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <label className="flex items-center gap-2">
          <span>Session ID</span>
          <input
            className="w-24 px-2 py-1 rounded-lg border"
            type="number"
            min={1}
            value={sessionId}
            onChange={(e) => setSessionId(Number(e.target.value))}
          />
        </label>
        <label className="flex items-center gap-2">
          <span>User ID (optional)</span>
          <input
            className="w-28 px-2 py-1 rounded-lg border"
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </label>
      </div>
      {m.isError && <p className="text-red-600 text-sm">Failed to save. Check API & IDs.</p>}
    </form>
  );
}

