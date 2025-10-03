import { useChat } from "../store/useChat";

export default function MessageList() {
  const messages = useChat((s) => s.messages);
  const list = Array.isArray(messages) ? messages : [];
  return (
    <div className="flex-1 overflow-auto p-4 space-y-2">
      {list.map((m) => (
        <div key={m.id} className="text-sm">
          <span className="text-white/50 mr-2">{m.user}</span>
          <span>{m.text}</span>
        </div>
      ))}
    </div>
  );
}
