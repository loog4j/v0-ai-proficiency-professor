"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Lightbulb } from "lucide-react"
import { assessUserResponse } from "@/lib/jimmy-ai"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
  assessment?: {
    category: string
    score: number
    feedback: string
  }
}

interface ChatInterfaceProps {
  onProficiencyUpdate: (proficiency: any) => void
  currentProficiency: any
}

export function ChatInterface({ onProficiencyUpdate, currentProficiency }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! I'm Jimmy AI, your AI Proficiency Professor. I'm here to help you improve your AI skills through interactive conversations. Let's start with a simple question: What do you think AI is, and how do you currently use it in your daily life?",
      timestamp: new Date(),
    },
  ])

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [assessments, setAssessments] = useState<Record<string, any>>({})
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    // Add user message
    setMessages((prev) => [...prev, userMessage])

    // Assess user response
    const assessment = assessUserResponse(input, messages.length)

    // Update proficiency based on assessment
    if (assessment) {
      const updatedProficiency = { ...currentProficiency }
      updatedProficiency[assessment.category as keyof typeof updatedProficiency] = Math.min(
        100,
        updatedProficiency[assessment.category as keyof typeof updatedProficiency] + assessment.score,
      )
      updatedProficiency.overall = Math.round(
        (updatedProficiency.promptEngineering +
          updatedProficiency.aiUnderstanding +
          updatedProficiency.ethicalAI +
          updatedProficiency.practicalApplication) /
          4,
      )
      onProficiencyUpdate(updatedProficiency)

      // Store assessment for this message
      setAssessments((prev) => ({
        ...prev,
        [messages.length]: assessment,
      }))
    }

    const currentInput = input
    setInput("")
    setIsLoading(true)

    try {
      console.log("[v0] Making API call to /api/chat")
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      })

      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] API error response:", errorText)
        throw new Error(`Failed to get response: ${response.status}`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ""

      if (reader) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "",
          role: "assistant",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, assistantMessage])

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          assistantContent += chunk

          setMessages((prev) =>
            prev.map((msg) => (msg.id === assistantMessage.id ? { ...msg, content: assistantContent } : msg)),
          )
        }
      }
    } catch (error) {
      console.error("[v0] Chat error:", error)
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I apologize, but I'm having trouble connecting right now. Let me ask you this: Can you tell me more about your experience with AI tools? This will help me understand your current proficiency level.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      const form = e.currentTarget.closest("form")
      if (form) {
        form.requestSubmit()
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="h-[70vh] max-h-[600px] min-h-[500px] flex flex-col">
        <CardHeader className="pb-4 flex-shrink-0">
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            Chat with Jimmy AI
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Engage in conversations to improve your AI proficiency. Jimmy will assess your responses and provide
            personalized feedback.
          </p>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col gap-4 min-h-0">
          <ScrollArea className="flex-1 pr-4 min-h-0" ref={scrollAreaRef}>
            <div className="space-y-4 pb-4">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div className={`max-w-[80%] ${message.role === "user" ? "order-2" : ""}`}>
                    <div
                      className={`p-3 rounded-lg break-words ${
                        message.role === "user"
                          ? "bg-blue-600 text-white ml-auto"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>

                    {message.role === "user" && assessments[index] && (
                      <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-1">
                          <Lightbulb className="w-3 h-3 text-green-600" />
                          <Badge variant="secondary" className="text-xs">
                            {assessments[index].category} +{assessments[index].score}
                          </Badge>
                        </div>
                        <p className="text-xs text-green-700 dark:text-green-300">{assessments[index].feedback}</p>
                      </div>
                    )}

                    <p className="text-xs text-muted-foreground mt-1">{message.timestamp.toLocaleTimeString()}</p>
                  </div>

                  {message.role === "user" && (
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your response to Jimmy..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={!input.trim() || isLoading} className="px-3">
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
