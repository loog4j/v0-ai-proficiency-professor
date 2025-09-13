"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, MessageSquare, Shield, Wrench, TrendingUp } from "lucide-react"

interface ProficiencyDashboardProps {
  proficiency: {
    overall: number
    promptEngineering: number
    aiUnderstanding: number
    ethicalAI: number
    practicalApplication: number
  }
}

export function ProficiencyDashboard({ proficiency }: ProficiencyDashboardProps) {
  const getProficiencyLevel = (score: number) => {
    if (score >= 80) return { level: "Expert", color: "bg-green-500", textColor: "text-green-700" }
    if (score >= 60) return { level: "Advanced", color: "bg-blue-500", textColor: "text-blue-700" }
    if (score >= 40) return { level: "Intermediate", color: "bg-yellow-500", textColor: "text-yellow-700" }
    if (score >= 20) return { level: "Beginner", color: "bg-orange-500", textColor: "text-orange-700" }
    return { level: "Novice", color: "bg-red-500", textColor: "text-red-700" }
  }

  const categories = [
    {
      name: "Prompt Engineering",
      key: "promptEngineering",
      icon: MessageSquare,
      description: "Crafting effective prompts for AI systems",
    },
    {
      name: "AI Understanding",
      key: "aiUnderstanding",
      icon: Brain,
      description: "Comprehending AI capabilities and limitations",
    },
    {
      name: "Ethical AI",
      key: "ethicalAI",
      icon: Shield,
      description: "Understanding responsible AI usage and implications",
    },
    {
      name: "Practical Application",
      key: "practicalApplication",
      icon: Wrench,
      description: "Applying AI tools to solve real-world problems",
    },
  ]

  const overallLevel = getProficiencyLevel(proficiency.overall)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Overall Proficiency */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Overall AI Proficiency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{proficiency.overall}%</div>
              <Badge className={`${overallLevel.color} text-white mt-2`}>{overallLevel.level}</Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-2">Progress to next level</p>
              <Progress value={proficiency.overall} className="w-32" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Your overall AI proficiency is based on your performance across all categories. Keep engaging with Jimmy to
            improve your score!
          </p>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => {
          const score = proficiency[category.key as keyof typeof proficiency]
          const level = getProficiencyLevel(score)
          const Icon = category.icon

          return (
            <Card key={category.key} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3 text-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  {category.name}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{score}%</span>
                    <Badge variant="secondary" className={level.textColor}>
                      {level.level}
                    </Badge>
                  </div>
                  <Progress value={score} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {score < 20 && "Just getting started! Keep practicing with Jimmy."}
                    {score >= 20 && score < 40 && "Making progress! Continue engaging to improve."}
                    {score >= 40 && score < 60 && "Good foundation! Focus on advanced concepts."}
                    {score >= 60 && score < 80 && "Strong skills! Refine your expertise."}
                    {score >= 80 && "Excellent mastery! You're an expert in this area."}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
