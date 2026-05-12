"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/services/api";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatPage() {
  const [chatId, setChatId] = useState<string | undefined>();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Como posso ajudar com seu curriculo, entrevista ou plano de skills?" }
  ]);
  const [loading, setLoading] = useState(false);
  async function send(formData: FormData) {
    const message = String(formData.get("message"));
    if (!message.trim()) return;
    setMessages((items) => [...items, { role: "user", content: message }]);
    setLoading(true);
    try {
      const { data } = await api.post("/chat", { chatId, message });
      setChatId(data.chatId);
      setMessages((items) => [...items, { role: "assistant", content: data.message.content }]);
    } catch {
      toast.error("Chat indisponivel no momento");
    } finally {
      setLoading(false);
    }
  }
  return (
    <Card className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-4xl flex-col p-5">
      <h1 className="text-2xl font-bold">Chat IA de carreira</h1>
      <div className="mt-5 flex-1 space-y-3 overflow-auto">
        {messages.map((message, index) => (
          <div key={index} className={`max-w-[85%] rounded-lg p-3 text-sm leading-6 ${message.role === "user" ? "ml-auto bg-primary text-white" : "bg-muted"}`}>
            {message.content}
          </div>
        ))}
      </div>
      <form action={send} className="mt-4 flex gap-2">
        <Input name="message" placeholder="Pergunte sobre entrevista, curriculo ou skills..." disabled={loading} />
        <Button disabled={loading}><Send size={16} /></Button>
      </form>
    </Card>
  );
}
