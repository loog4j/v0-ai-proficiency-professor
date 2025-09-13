"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, BookOpen, Target, ArrowRight } from "lucide-react"

interface AssessmentResultsProps {
  proficiency: {
    overall: number
    promptEngineering: number
    aiUnderstanding: number
    ethicalAI: number
    practicalApplication: number
  }
}

export function AssessmentResults({ proficiency }: AssessmentResultsProps) {
  const getRecommendations = () => {
    const recommendations = []

    if (proficiency.promptEngineering < 60) {
      recommendations.push({
        category: "Prompt Engineering",
        priority: "High",
        title: "Master the Art of Prompting",
        description: "Learn to craft clear, specific, and effective prompts for better AI responses.",
        actions: [
          "Practice writing detailed prompts with context",
          "Learn about prompt templates and structures",
          "Experiment with different prompting techniques",
        ],
      })
    }

    if (proficiency.aiUnderstanding < 60) {
      recommendations.push({
        category: "AI Understanding",
        priority: "High",
        title: "Deepen Your AI Knowledge",
        description: "Build a stronger foundation in AI concepts, capabilities, and limitations.",
        actions: [
          "Study different types of AI models and their uses",
          "Learn about AI training processes and data requirements",
          "Understand the difference between narrow and general AI",
        ],
      })
    }

    if (proficiency.ethicalAI < 60) {
      recommendations.push({
        category: "Ethical AI",
        priority: "Medium",
        title: "Develop Ethical AI Awareness",
        description: "Learn about responsible AI usage, bias, and ethical considerations.",
        actions: [
          "Study AI bias and fairness principles",
          "Learn about privacy and data protection in AI",
          "Understand the societal impact of AI systems",
        ],
      })
    }

    if (proficiency.practicalApplication < 60) {
      recommendations.push({
        category: "Practical Application",
        priority: "Medium",
        title: "Apply AI to Real Problems",
        description: "Practice using AI tools to solve practical, real-world challenges.",
        actions: [
          "Identify problems in your work/life that AI can help solve",
          "Experiment with different AI tools and platforms",
          "Create projects that demonstrate AI application",
        ],
      })
    }

    return recommendations
  }

  const recommendations = getRecommendations()
  const strengths = Object.entries(proficiency)
    .filter(([key, value]) => key !== "overall" && value >= 60)
    .map(([key, value]) => ({ key, value }))

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
      case "Medium":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "Low":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Strengths */}
      {strengths.length > 0 && (
        <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <CheckCircle className="w-5 h-5" />
              Your Strengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {strengths.map(({ key, value }) => (
                <div key={key} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <span className="font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                  <Badge className="bg-green-600 text-white">{value}% - Proficient</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Personalized Learning Recommendations
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Based on your current proficiency, here are targeted areas for improvement:
          </p>
        </CardHeader>
        <CardContent>
          {recommendations.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Excellent Work!</h3>
              <p className="text-muted-foreground">
                You've achieved proficiency in all areas. Keep practicing with Jimmy to maintain and further improve
                your skills.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {recommendations.map((rec, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{rec.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                      </div>
                      <Badge className={getPriorityColor(rec.priority)}>{rec.priority} Priority</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Action Steps:
                      </h4>
                      <ul className="space-y-2">
                        {rec.actions.map((action, actionIndex) => (
                          <li key={actionIndex} className="flex items-start gap-2 text-sm">
                            <ArrowRight className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">Ready to Improve?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-700 dark:text-blue-300 mb-4">
            Continue chatting with Jimmy AI to work on these recommendations and track your progress over time.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-700">Continue Learning with Jimmy</Button>
        </CardContent>
      </Card>
    </div>
  )
}
