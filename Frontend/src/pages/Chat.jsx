import Layout from "../components/Layout";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendChatMessage } from "../api/chatApi";
import {
  Send,
  Sparkles,
  Wind,
  Calendar,
  Headphones,
  RotateCcw,
  AlertCircle,
  Bot,
  User,
} from "lucide-react";

export default function Chat() {
  const navigate = useNavigate();

  // ==========================================
  // USER / CHAT STORAGE
  // ==========================================
  const getCurrentUser = () => {
    try {
      const storedUser =
        localStorage.getItem("mannovaCurrentUser") ||
        localStorage.getItem("user");

      if (!storedUser) return null;
      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Unable to read current user:", error);
      return null;
    }
  };

  const currentUser = getCurrentUser();
  const userId =
    currentUser?._id ||
    currentUser?.id ||
    currentUser?.email ||
    "guest";

  const CHAT_STORAGE_KEY = `mannova_chat_${userId}`;

  // ==========================================
  // DEFAULT WELCOME MESSAGE
  // ==========================================
  const defaultMessage = {
    id: "mannova-welcome-message",
    type: "ai",
    text: "Hello! Welcome to your digital sanctuary. I'm your Mannova wellness companion. How are you feeling today? You can share anything on your mind or try a guided prompt below.",
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  // ==========================================
  // LOAD SAVED CHAT
  // ==========================================
  const getInitialMessages = () => {
    try {
      const savedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
      if (!savedMessages) {
        return [defaultMessage];
      }
      const parsed = JSON.parse(savedMessages);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return [defaultMessage];
    } catch (error) {
      console.error("Unable to load saved chat:", error);
      return [defaultMessage];
    }
  };

  // ==========================================
  // STATE
  // ==========================================
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState(getInitialMessages);
  const chatMessagesRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Lock body scroll so ONLY the chat messages container can scroll
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Auto-save chat
  useEffect(() => {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error("Unable to save chat:", error);
    }
  }, [messages, CHAT_STORAGE_KEY]);

  // Auto-scroll strictly inside messages container
  const scrollToBottom = (behavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    } else if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages, isLoading]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Prepare Gemini history
  const prepareHistory = (currentMessages) => {
    return currentMessages
      .map((msg) => ({
        role: msg.type === "ai" ? "model" : "user",
        text: msg.text,
      }))
      .slice(-20);
  };

  // ==========================================
  // SEND MESSAGE
  // ==========================================
  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      text,
      time: getCurrentTime(),
    };

    const history = prepareHistory(messages);
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendChatMessage(text, history);
      const aiReply =
        response?.reply ||
        response?.message ||
        "I'm here with you. Tell me a little more about what's going on.";

      const aiMessage = {
        id: `ai-${Date.now()}`,
        type: "ai",
        text: aiReply,
        time: getCurrentTime(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          type: "ai",
          text: "I'm having a little trouble connecting right now. Please take a deep breath and try again in a moment.",
          time: getCurrentTime(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // QUICK ACTION PROMPTS
  // ==========================================
  const handleQuickAction = async (actionText) => {
    if (isLoading) return;

    if (actionText === "Breathe together") {
      navigate("/breathing");
      return;
    }

    if (actionText === "Book a Therapist") {
      const userMessage = {
        id: `user-${Date.now()}`,
        type: "user",
        text: "How can I book an appointment with a therapist?",
        time: getCurrentTime(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            type: "ai",
            text: "Therapist consultations are currently in preparation for our upcoming release! In the meantime, I'm here 24/7 to support you with mindful listening, guided breathing, and mood reflections.",
            time: getCurrentTime(),
          },
        ]);
        setIsLoading(false);
      }, 500);
      return;
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      text: actionText,
      time: getCurrentTime(),
    };

    const history = prepareHistory(messages);
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(actionText, history);
      const aiReply =
        response?.reply ||
        response?.message ||
        "I'm here with you. Take a moment to pause and breathe.";

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          type: "ai",
          text: aiReply,
          time: getCurrentTime(),
        },
      ]);
    } catch (error) {
      console.error("Quick action error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          type: "ai",
          text: "I'm having a little trouble connecting right now. Please try again in a moment.",
          time: getCurrentTime(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewChat = () => {
    if (isLoading) return;
    if (
      window.confirm(
        "Start a new conversation? Your previous chat will be cleared."
      )
    ) {
      setMessages([defaultMessage]);
    }
  };

  return (
    <Layout>
      <div className="fixed inset-x-0 top-16 bottom-16 md:bottom-0 z-20 bg-[#f8f9ff] dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 flex flex-col overflow-hidden transition-colors duration-300">
        <div className="flex flex-1 min-h-0 overflow-hidden max-w-7xl w-full mx-auto">
          {/* =====================================================
              DESKTOP SIDEBAR
          ===================================================== */}
          <aside className="hidden md:flex w-72 flex-col flex-shrink-0 border-r border-gray-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#101726]/80 p-5 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center shadow-sm">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                    Mannova Support
                  </h2>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    AI Active
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={startNewChat}
                title="Start new conversation"
                className="p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            {/* Quick Wellness Resources */}
            <div className="space-y-3 mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-1">
                Quick Shortcuts
              </span>

              <button
                type="button"
                onClick={() => navigate("/breathing")}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#141d2e] border border-gray-200/70 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-600 hover:shadow-md transition text-left cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Wind size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-white">
                    Guided Breathing
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    5 min Box breath cycle
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate("/exercises")}
                className="w-full flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-[#141d2e] border border-gray-200/70 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-600 hover:shadow-md transition text-left cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Headphones size={18} />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-white">
                    Soundscapes
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Forest rain & sleep drift
                  </p>
                </div>
              </button>

              <button
                type="button"
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#141d2e] border border-gray-200/70 dark:border-slate-800 hover:border-violet-300 dark:hover:border-slate-700 text-left transition group cursor-default"
                title="Therapist Consultations (Coming Soon)"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-pink-100 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-white">
                      Book a Therapist
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      1-on-1 verified video calls
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300">
                  Soon
                </span>
              </button>
            </div>

            {/* Disclaimer */}
            <div className="mt-auto p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/30">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-400 mb-1">
                <AlertCircle size={14} /> Safety Notice
              </div>
              <p className="text-[11px] text-amber-700/90 dark:text-amber-300/80 leading-relaxed">
                Mannova AI provides wellness reflection and is not a substitute for clinical emergency help. If you're in distress, please contact national crisis lines.
              </p>
            </div>
          </aside>

          {/* =====================================================
              MAIN CHAT CONTAINER (FIXED VIEWPORT)
          ===================================================== */}
          <section className="flex flex-1 flex-col min-w-0 min-h-0 h-full bg-transparent overflow-hidden">
            {/* Top Bar on Mobile */}
            <div className="flex md:hidden items-center justify-between px-4 py-2.5 bg-white/90 dark:bg-[#101726]/90 backdrop-blur border-b border-gray-200 dark:border-slate-800 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-violet-600 text-white flex items-center justify-center shadow">
                  <Bot size={16} />
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Mannova AI Companion
                </span>
              </div>
              <button
                type="button"
                onClick={startNewChat}
                className="text-xs text-violet-600 dark:text-violet-400 font-semibold px-2 py-1 rounded-md hover:bg-violet-50 dark:hover:bg-slate-800"
              >
                New Chat
              </button>
            </div>

            {/* Messages Scroll Area - ONLY THIS AREA SCROLLS */}
            <div
              ref={chatMessagesRef}
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-5"
            >
              <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5">
                {messages.map((msg) => {
                  const isUser = msg.type === "user";

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${
                        isUser ? "flex-row-reverse" : "flex-row"
                      } items-start`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                          isUser
                            ? "bg-violet-600 text-white"
                            : "bg-white dark:bg-[#1a253c] text-violet-600 dark:text-violet-400 border border-gray-200 dark:border-slate-700"
                        }`}
                      >
                        {isUser ? <User size={18} /> : <Bot size={18} />}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${
                          isUser ? "items-end" : "items-start"
                        }`}
                      >
                        <div
                          className={`px-4 py-3.5 rounded-3xl text-sm leading-relaxed shadow-sm ${
                            isUser
                              ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-tr-sm"
                              : "bg-white dark:bg-[#131b2e] text-slate-800 dark:text-slate-100 border border-gray-200/80 dark:border-slate-800 rounded-tl-sm"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>

                        <span className="text-[10px] text-gray-400 dark:text-slate-500 mt-1 px-1">
                          {isUser ? `You • ${msg.time}` : `Mannova AI • ${msg.time}`}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-3 items-start">
                    <div className="w-9 h-9 rounded-2xl bg-white dark:bg-[#1a253c] text-violet-600 dark:text-violet-400 border border-gray-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Bot size={18} />
                    </div>
                    <div className="bg-white dark:bg-[#131b2e] border border-gray-200/80 dark:border-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" />
                        <span
                          className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Mannova AI is reflecting...
                      </span>
                    </div>
                  </div>
                )}

                {/* Scroll Anchor */}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Quick Action Chips (Sticky above Input) */}
            <div className="px-4 sm:px-6 py-2 border-t border-gray-200/50 dark:border-slate-800/60 bg-white/70 dark:bg-[#0d1422]/70 backdrop-blur flex-shrink-0">
              <div className="max-w-3xl mx-auto flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {[
                  "🌿 Breathe together",
                  "🧘 Feeling anxious",
                  "💡 Need motivation",
                  "🌙 Sleep soundscape",
                  "📅 Book a Therapist",
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() =>
                      handleQuickAction(chip.replace(/^[^a-zA-Z]+/, ""))
                    }
                    disabled={isLoading}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap bg-white dark:bg-[#131b2e] border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-violet-300 hover:bg-violet-50 dark:hover:bg-slate-800 hover:border-violet-300 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar (Stuck to bottom) */}
            <div className="p-3 sm:p-4 border-t border-gray-200/80 dark:border-slate-800 bg-white dark:bg-[#101726] flex-shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="max-w-3xl mx-auto flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isLoading}
                  placeholder="Tell me what's on your mind or how you're feeling..."
                  className="flex-1 px-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#162238] border border-gray-200 dark:border-slate-700/80 text-sm sm:text-base text-slate-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500 transition"
                />

                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 text-white flex items-center justify-center shadow-md hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-all cursor-pointer flex-shrink-0"
                  title="Send message"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}