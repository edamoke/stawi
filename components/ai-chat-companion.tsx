"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Loader2, Sparkles, ShoppingBag } from "lucide-react"
import Image from "next/image"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  products?: {
    id: string
    name: string
    price: number
    image_url: string
    slug: string
  }[]
}

export function AIChatCompanion() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I'm Stawi's AI Beauty Consultant. I can help you find the perfect natural beauty products from our Glow Collection, answer questions about skincare routines, ingredients, or current offers. How can I help you radiance today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content,
        products: data.products,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("[v0] Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I apologize, but I'm having trouble responding right now. Please try again in a moment.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const quickPrompts = ["Show me skincare", "What's on sale?", "Skincare rituals", "Help me find a serum"]

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 bg-[#2C2420] text-white p-4 rounded-full shadow-lg hover:bg-[#8B4513] transition-all duration-300 ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-label="Open chat assistant"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#8B4513] rounded-full animate-pulse" />
      </button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-[400px] h-[100dvh] sm:h-[600px] sm:max-h-[80vh] bg-white sm:rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${
          isOpen ? "translate-y-0 opacity-100" : "translate-y-full sm:translate-y-8 opacity-0 pointer-events-none"
        }`}
      >
        {/* Header - Updated branding */}
        <div className="bg-[#2C2420] text-white p-4 sm:rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8B4513] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg">Stawi Beauty Assistant</h3>
              <p className="text-xs text-white/70">AI-powered style help</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAF8F5]">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] ${
                  message.role === "user"
                    ? "bg-[#2C2420] text-white rounded-2xl rounded-br-md"
                    : "bg-white text-[#2C2420] rounded-2xl rounded-bl-md shadow-sm"
                } p-4`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

                {/* Product Cards */}
                {message.products && message.products.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {message.products.map((product) => (
                      <a
                        key={product.id}
                        href={`/products/${product.slug}`}
                        className="flex items-center gap-3 bg-[#FAF8F5] p-3 rounded-lg hover:bg-[#F5F3F0] transition-colors group"
                      >
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-[#2C2420] group-hover:text-[#8B4513] transition-colors truncate">
                            {product.name}
                          </h4>
                          <p className="text-xs text-[#6B6560]">KSh {product.price.toLocaleString()}</p>
                        </div>
                        <ShoppingBag className="w-4 h-4 text-[#8B4513] flex-shrink-0" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-md shadow-sm p-4">
                <div className="flex items-center gap-2 text-[#6B6560]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length <= 1 && (
          <div className="px-4 pb-2 bg-[#FAF8F5]">
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setInput(prompt)
                    inputRef.current?.focus()
                  }}
                  className="text-xs bg-white border border-[#E8E4DE] px-3 py-1.5 rounded-full text-[#6B6560] hover:border-[#8B4513] hover:text-[#8B4513] transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-[#E8E4DE] bg-white sm:rounded-b-2xl">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about skincare, rituals, or offers..."
              className="flex-1 bg-[#FAF8F5] border-0 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8B4513]/50 placeholder:text-[#8B8178]"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-[#2C2420] text-white p-3 rounded-full hover:bg-[#8B4513] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
