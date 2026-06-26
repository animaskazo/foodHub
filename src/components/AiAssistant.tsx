import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { ChatMessage, Product } from "../types";
import { Bot, Send, User, Sparkles, Plus, Loader2, RefreshCw } from "lucide-react";

interface AiAssistantProps {
  onAddToCart?: (prod: Product) => void;
  isEmbedded?: boolean;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({ onAddToCart, isEmbedded = false }) => {
  const { products, activeBranch } = useApp();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-msg",
      role: "model",
      text: "¡Hola! Soy FoodHub IA, tu consejero gastronómico personal. 🍔🍕\n¿Qué te gustaría comer hoy? Puedo recomendarte las mejores combinaciones de nuestro menú, resolver dudas sobre ingredientes, o ayudarte a armar tu carrito de compras.",
      timestamp: new Date().toISOString()
    }
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsgText = inputValue;
    setInputValue("");
    setIsLoading(true);

    const newUserMessage: ChatMessage = {
      id: "msg-" + Date.now(),
      role: "user",
      text: userMsgText,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, newUserMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsgText,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          catalog: products,
          currentSucursal: activeBranch?.name || "Principal"
        })
      });

      if (!response.ok) {
        throw new Error("Ocurrió un error al comunicarse con el servidor de IA.");
      }

      const data = await response.json();

      const newModelMessage: ChatMessage = {
        id: "msg-ai-" + Date.now(),
        role: "model",
        text: data.text || "Lo siento, no pude procesar tu solicitud.",
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, newModelMessage]);
    } catch (error: any) {
      console.error("AI Assistant Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: "msg-err-" + Date.now(),
          role: "model",
          text: "¡Ups! Ocurrió un inconveniente al conectar con el servidor. Revisa tu clave GEMINI_API_KEY o tu conexión e intenta de nuevo.",
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Agentic Action: Parse message text to find if any available catalog product is mentioned,
  // so we can render a beautiful inline shortcut to add it to the cart!
  const getMentionedProducts = (text: string): Product[] => {
    if (!text) return [];
    return products.filter((p) => {
      if (!p.isAvailable) return false;
      const nameLower = p.name.toLowerCase();
      // Look for full matches or partial matches of key names
      return text.toLowerCase().includes(nameLower) || 
             (nameLower.includes("burger") && text.toLowerCase().includes("hamburguesa")) ||
             (nameLower.includes("pizza") && text.toLowerCase().includes("pizza"));
    });
  };

  return (
    <div className={`flex flex-col h-full bg-neutral-50 ${isEmbedded ? "" : "max-w-2xl mx-auto border border-neutral-200 rounded-3xl overflow-hidden shadow-xl"}`}>
      
      {/* Mini Title if not embedded */}
      {!isEmbedded && (
        <div className="bg-neutral-950 p-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5 text-neutral-950" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight font-sans">Asistente Gastronómico de FoodHub</h2>
              <p className="text-[10px] text-amber-400 font-mono tracking-wider uppercase">Fase 1 / IA delgada</p>
            </div>
          </div>
          <button 
            onClick={() => setMessages([messages[0]])}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Reiniciar chat"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => {
          const isUser = m.role === "user";
          const mentionedProducts = !isUser ? getMentionedProducts(m.text) : [];

          return (
            <div key={m.id} className={`flex gap-2.5 max-w-[85%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
              {/* Avatar circle */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                isUser ? "bg-neutral-200 text-neutral-800" : "bg-neutral-950 text-white"
              }`}>
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-amber-400" />}
              </div>

              {/* Text Bubble */}
              <div className="space-y-2">
                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isUser 
                    ? "bg-neutral-950 text-white rounded-tr-none" 
                    : "bg-white border border-neutral-200 text-neutral-800 rounded-tl-none shadow-sm whitespace-pre-wrap"
                }`}>
                  {m.text}
                </div>

                {/* Agentic Inline Shortcut - dynamically lists recommendation chips! */}
                {!isUser && onAddToCart && mentionedProducts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {mentionedProducts.slice(0, 3).map((prod) => (
                      <button
                        key={prod.id}
                        onClick={() => onAddToCart(prod)}
                        className="bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 text-[10px] font-bold px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer shadow-sm shrink-0"
                      >
                        <Plus className="w-3 h-3" />
                        Agregar {prod.name.split(" ")[0]} (${prod.price.toLocaleString("es-CL")})
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="flex gap-2.5 max-w-[80%]">
            <div className="w-8 h-8 bg-neutral-950 text-white rounded-full flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-amber-400" />
            </div>
            <div className="bg-white border border-neutral-200 text-neutral-500 rounded-2xl rounded-tl-none p-3.5 shadow-sm text-xs flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-neutral-600" />
              <span>FoodHub IA está saboreando una respuesta...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-neutral-200 bg-white flex gap-2 shrink-0">
        <input
          id="input-ai-chat"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={isLoading ? "FoodHub IA está escribiendo..." : "Pregunta por ingredientes, pídele recomendar o pídele armar tu combo..."}
          disabled={isLoading}
          className="flex-1 bg-neutral-100 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-neutral-950"
        />
        <button
          id="btn-send-ai-message"
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className={`px-3 py-2.5 rounded-xl font-bold transition-all flex items-center justify-center cursor-pointer ${
            !inputValue.trim() || isLoading
              ? "bg-neutral-100 text-neutral-400"
              : "bg-neutral-950 text-white hover:bg-neutral-800 shadow"
          }`}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};
