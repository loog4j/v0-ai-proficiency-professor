"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChatInterface } from "@/components/chat-interface"
import { ProficiencyDashboard } from "@/components/proficiency-dashboard"
import { AssessmentResults } from "@/components/assessment-results"
import { Brain, MessageSquare, BarChart3, Target } from "lucide-react"

export default function JimmyAIPage() {
  const [currentView, setCurrentView] = useState<"chat" | "dashboard" | "results">("chat")
  const [userProficiency, setUserProficiency] = useState({
    overall: 0,
    promptEngineering: 0,
    aiUnderstanding: 0,
    ethicalAI: 0,
    practicalApplication: 0,
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Jimmy AI</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">The AI Proficiency Professor</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              AI Learning Assistant
            </Badge>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-2">
            <Button
              variant={currentView === "chat" ? "default" : "ghost"}
              onClick={() => setCurrentView("chat")}
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Chat with Jimmy
            </Button>
            <Button
              variant={currentView === "dashboard" ? "default" : "ghost"}
              onClick={() => setCurrentView("dashboard")}
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Proficiency Dashboard
            </Button>
            <Button
              variant={currentView === "results" ? "default" : "ghost"}
              onClick={() => setCurrentView("results")}
              className="flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              Assessment Results
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === "chat" && (
          <ChatInterface onProficiencyUpdate={setUserProficiency} currentProficiency={userProficiency} />
        )}
        {currentView === "dashboard" && <ProficiencyDashboard proficiency={userProficiency} />}
        {currentView === "results" && <AssessmentResults proficiency={userProficiency} />}
      </main>
    </div>
  )
}
