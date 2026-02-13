"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Send, Heart } from "lucide-react";
import Header from "../../_components/header";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const Chat = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [done, setDone] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatMutation = api.llm.chat.useMutation();
  // Always fetch fresh data on mount to avoid stale cache redirects
  const profileStatusQuery = api.user.getProfileStatus.useQuery(undefined, {
    staleTime: 0, // Always consider data stale
    refetchOnMount: "always", // Always refetch when component mounts
  });
  const greetingQuery = api.llm.greeting.useQuery(undefined, {
    enabled: messages.length === 0 && profileStatusQuery.data?.hasFilledQuestionnaire && !profileStatusQuery.data?.hasCompletedChat,
  });

  // Redirect based on profile status - only after fresh data is loaded
  useEffect(() => {
    // Don't redirect while still fetching fresh data
    if (profileStatusQuery.isFetching) return;
    
    if (profileStatusQuery.data) {
      // If user hasn't filled questionnaire, redirect to questionnaire
      if (!profileStatusQuery.data.hasFilledQuestionnaire) {
        router.push("/questionnaire");
      }
      // If user has completed chat, redirect to waiting
      else if (profileStatusQuery.data.hasCompletedChat) {
        router.push("/waiting");
      }
    }
  }, [profileStatusQuery.data, profileStatusQuery.isFetching, router]);

  // Show bot greeting as first message - use ref to track if greeting was set
  const greetingSetRef = useRef(false);
  useEffect(() => {
    if (greetingQuery.data && !greetingSetRef.current) {
      greetingSetRef.current = true;
      setMessages([
        {
          id: "greeting",
          role: "assistant",
          content: greetingQuery.data.content,
        },
      ]);
    }
  }, [greetingQuery.data]);

  // Throttled scroll to bottom to prevent excessive reflows
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollToBottom = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      if (messagesEndRef.current) {
        // Use requestAnimationFrame for smoother scrolling
        requestAnimationFrame(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        });
      }
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
    // Cleanup timeout on unmount
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [messages, scrollToBottom]);

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
        // Redirect to waiting page after a short delay
        setTimeout(() => {
          router.push("/waiting");
        }, 2000);
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
    <div className="bg-background-light font-display text-wine relative flex h-screen w-full flex-col overflow-hidden transition-colors duration-300">
      {/* Header */}
      <Header />

      {/* Online status indicator */}
      <div className="fixed top-20 right-4 z-20 flex items-center gap-2 rounded-full border border-pink-100 bg-white/80 px-3 py-1.5 shadow-md backdrop-blur-sm">
        <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
        <span className="text-rose-brown text-sm">En línea</span>
      </div>

      {/* Messages Area */}
      <div className="gradient-bg relative z-10 flex-1 overflow-y-auto px-4 py-6 pt-20">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.map((message, index) => {
            // Only animate the last 3 messages to reduce CPU usage
            const isRecentMessage = index >= messages.length - 3;
            const animationClass = isRecentMessage
              ? "animate-in fade-in slide-in-from-bottom-4 duration-500"
              : "";
            
            return (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} ${animationClass}`}
              >
                <div
                  className={`group relative max-w-[85%] md:max-w-[70%] ${
                    message.role === "user" ? "order-2" : "order-1"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="absolute top-0 -left-12 hidden md:block">
                      <div className="bg-primary rounded-full p-2">
                        <Heart className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}

                  <div
                    className={`rounded-2xl px-5 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-white shadow-lg"
                        : "border border-pink-100 bg-white text-wine shadow-md"
                    }`}
                  >
                    <p className="leading-relaxed">{message.content}</p>
                  </div>

                  {message.role === "user" && (
                    <div className="bg-primary/30 absolute inset-0 -z-10 rounded-2xl blur-xl" />
                  )}
                </div>
              </div>
            );
          })}

          {chatMutation.isPending && (
            <div className="animate-in fade-in flex justify-start duration-300">
              <div className="flex items-center gap-3 rounded-2xl border border-pink-100 bg-white px-5 py-4 shadow-md">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="bg-primary h-2 w-2 animate-bounce rounded-full"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
                <span className="text-rose-brown text-sm">
                  RoBoCupido está escribiendo...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="relative z-10 border-t border-pink-100 bg-white/80 backdrop-blur-xl">
        {done ? (
          <div className="mx-auto max-w-3xl px-4 py-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="bg-primary h-2 w-2 animate-bounce rounded-full"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
              <p className="text-rose-brown">
                Preparando tu perfil... Redirigiendo...
              </p>
            </div>
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
                  className="text-wine placeholder-rose-brown/50 w-full rounded-full border border-pink-200 bg-white px-6 py-4 transition-all focus:border-pink-400 focus:ring-2 focus:ring-pink-200 focus:outline-none"
                  disabled={chatMutation.isPending}
                />
              </div>
              <button
                type="submit"
                disabled={chatMutation.isPending || !input.trim()}
                className="bg-primary shadow-primary/30 group relative rounded-full p-4 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
            <p className="text-rose-brown/60 mt-3 text-center text-xs">
              Tus respuestas nos ayudarán a encontrar tu match perfecto •{" "}
              <span className="font-medium">Escribe &quot;terminar&quot; cuando quieras finalizar</span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Chat;
