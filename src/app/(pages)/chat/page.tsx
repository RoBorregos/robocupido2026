"use client";

import { useState, useRef, useEffect } from "react";
import { api } from "~/trpc/react";
import { Send, Heart, Sparkles } from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [done, setDone] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = api.llm.chat.useMutation();
  const greetingQuery = api.llm.greeting.useQuery(undefined, {
    enabled: messages.length === 0,
  });

  // Show bot greeting as first message
  useEffect(() => {
    if (greetingQuery.data && messages.length === 0) {
      setMessages([
        {
          id: "greeting",
          role: "assistant",
          content: greetingQuery.data.content,
        },
      ]);
    }
  }, [greetingQuery.data, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending || done) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    try {
      const response = await chatMutation.mutateAsync({
        messages: updatedMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
      };
      setMessages((prev) => [...prev, botMessage]);

      if (response.done) {
        setDone(true);
      }
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Lo siento, hubo un error. Por favor intenta de nuevo.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-linear-to-br from-slate-950 via-purple-950 to-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 h-96 w-96 animate-pulse rounded-full bg-pink-500/20 blur-3xl" />
        <div
          className="absolute top-1/4 -right-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute -bottom-1/4 left-1/3 h-96 w-96 animate-pulse rounded-full bg-rose-500/20 blur-3xl"
          style={{ animationDelay: "2s" }}
        />
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 animate-pulse rounded-full bg-white/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <header className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <div className="relative">
              <Heart className="h-8 w-8 fill-pink-500 text-pink-500" />
              <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400" />
            </div>
            <div>
              <h1 className="bg-linear-to-r from-pink-400 via-rose-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
                RoBoCupido
              </h1>
              <p className="text-xs text-white/50">
                Tu match perfecto te espera
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            <span className="text-sm text-white/60">En linea</span>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-4 duration-500`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={`group relative max-w-[85%] md:max-w-[70%] ${
                  message.role === "user" ? "order-2" : "order-1"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="absolute top-0 -left-12 hidden md:block">
                    <div className="rounded-full bg-linear-to-br from-pink-500 to-purple-600 p-2">
                      <Heart className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}

                <div
                  className={`rounded-2xl px-5 py-3 ${
                    message.role === "user"
                      ? "bg-linear-to-r from-pink-600 to-purple-600 text-white"
                      : "border border-white/10 bg-white/5 text-white/90 backdrop-blur-sm"
                  }`}
                >
                  <p className="leading-relaxed">{message.content}</p>
                </div>

                {message.role === "user" && (
                  <div className="absolute inset-0 -z-10 rounded-2xl bg-linear-to-r from-pink-600 to-purple-600 opacity-50 blur-xl" />
                )}
              </div>
            </div>
          ))}

          {chatMutation.isPending && (
            <div className="animate-in fade-in flex justify-start duration-300">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-2 w-2 animate-bounce rounded-full bg-pink-400"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
                <span className="text-sm text-white/50">
                  RoBoCupido esta escribiendo...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="relative z-10 border-t border-white/10 bg-black/30 backdrop-blur-xl">
        {done ? (
          <div className="mx-auto max-w-3xl px-4 py-4 text-center">
            <p className="text-sm text-white/50">
              Tu perfil ha sido guardado. ¡Nos vemos el 14 de febrero!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="w-full rounded-full border border-white/20 bg-white/5 px-6 py-4 text-white placeholder-white/40 backdrop-blur-sm transition-all focus:border-pink-500/50 focus:bg-white/10 focus:ring-2 focus:ring-pink-500/20 focus:outline-none"
                  disabled={chatMutation.isPending}
                />
              </div>
              <button
                type="submit"
                disabled={chatMutation.isPending || !input.trim()}
                className="group relative rounded-full bg-linear-to-r from-pink-600 to-purple-600 p-4 text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-pink-500/25 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-white/30">
              Tus respuestas nos ayudaran a encontrar tu match perfecto
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Chat;
