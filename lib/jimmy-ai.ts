// Jimmy AI Assessment and Response Logic

interface Assessment {
  category: "promptEngineering" | "aiUnderstanding" | "ethicalAI" | "practicalApplication"
  score: number
  feedback: string
}

const assessmentQuestions = [
  {
    pattern: /what.*ai|define.*ai|artificial intelligence/i,
    category: "aiUnderstanding" as const,
    responses: {
      basic: { score: 5, feedback: "Good start! Try to be more specific about AI capabilities." },
      intermediate: { score: 10, feedback: "Nice understanding! Consider mentioning different types of AI." },
      advanced: { score: 15, feedback: "Excellent grasp of AI fundamentals!" },
    },
  },
  {
    pattern: /prompt|instruction|ask.*ai|tell.*ai/i,
    category: "promptEngineering" as const,
    responses: {
      basic: { score: 5, feedback: "You're thinking about prompts! Try to be more specific and detailed." },
      intermediate: { score: 10, feedback: "Good prompt awareness! Consider adding context and examples." },
      advanced: { score: 15, feedback: "Great prompt engineering mindset!" },
    },
  },
  {
    pattern: /bias|ethical|responsible|fair|privacy|harm/i,
    category: "ethicalAI" as const,
    responses: {
      basic: { score: 5, feedback: "Important ethical consideration! Explore this topic further." },
      intermediate: { score: 10, feedback: "Good ethical awareness! Think about specific scenarios." },
      advanced: { score: 15, feedback: "Excellent ethical AI thinking!" },
    },
  },
  {
    pattern: /use.*ai|apply|tool|solve|problem|work|business/i,
    category: "practicalApplication" as const,
    responses: {
      basic: { score: 5, feedback: "Good practical thinking! Be more specific about applications." },
      intermediate: { score: 10, feedback: "Nice application ideas! Consider implementation challenges." },
      advanced: { score: 15, feedback: "Excellent practical AI application!" },
    },
  },
]

export function assessUserResponse(response: string, messageCount: number): Assessment | null {
  const responseLength = response.length
  const wordCount = response.split(" ").length

  // Find matching assessment pattern
  for (const question of assessmentQuestions) {
    if (question.pattern.test(response)) {
      let level: "basic" | "intermediate" | "advanced" = "basic"

      // Determine response quality based on length, detail, and specific keywords
      if (wordCount > 30 && responseLength > 150) {
        level = "advanced"
      } else if (wordCount > 15 && responseLength > 75) {
        level = "intermediate"
      }

      // Bonus points for specific technical terms or detailed examples
      const technicalTerms =
        /machine learning|neural network|algorithm|model|training|data|nlp|computer vision|deep learning/i
      const examples = /example|instance|such as|like|for example/i

      if (technicalTerms.test(response) || examples.test(response)) {
        level = level === "basic" ? "intermediate" : "advanced"
      }

      const assessment = question.responses[level]
      return {
        category: question.category,
        score: assessment.score,
        feedback: assessment.feedback,
      }
    }
  }

  // Default assessment for general responses
  if (wordCount > 10) {
    return {
      category: "aiUnderstanding",
      score: 3,
      feedback: "Thanks for sharing! Try to be more specific about AI concepts.",
    }
  }

  return null
}

export function generateJimmyResponse(userInput: string, assessment: Assessment | null, messageCount: number): string {
  const responses = [
    // Introduction and basic questions
    [
      "That's a great start! I can see you have some understanding of AI. Let me ask you this: Can you describe a specific situation where you think AI might be helpful in your daily life?",
      "Interesting perspective! Now, let's dive deeper. What do you think are some limitations or challenges that AI systems face today?",
      "I appreciate your thoughtful response. Here's a scenario for you: If you were to use AI to help write an email, how would you structure your request to get the best result?",
    ],
    // Intermediate questions
    [
      "Excellent thinking! Let's explore prompt engineering. Can you give me an example of how you would ask an AI to help you solve a specific problem you're facing?",
      "Great insight! Now, considering AI ethics: What concerns might arise when AI systems are used to make important decisions about people's lives?",
      "That shows good understanding! Let's talk about practical applications. Can you think of three different ways AI could be used in education?",
    ],
    // Advanced questions
    [
      "Impressive knowledge! Here's a challenge: How would you explain the difference between narrow AI and general AI to someone who's never heard these terms?",
      "Excellent analysis! Let's discuss bias in AI. Can you describe how bias might creep into an AI system and suggest ways to mitigate it?",
      "Outstanding! Now for a practical scenario: You're tasked with implementing an AI solution for a small business. Walk me through your approach.",
    ],
  ]

  // Determine response level based on message count and assessment
  let responseLevel = 0
  if (messageCount > 6) responseLevel = 2
  else if (messageCount > 3) responseLevel = 1

  // Add assessment-specific feedback
  let baseResponse = responses[responseLevel][messageCount % responses[responseLevel].length]

  if (assessment) {
    const encouragement = [
      "I can see you're developing strong skills in " +
        assessment.category.replace(/([A-Z])/g, " $1").toLowerCase() +
        ". ",
      "Your understanding of " + assessment.category.replace(/([A-Z])/g, " $1").toLowerCase() + " is improving! ",
      "Great progress in " + assessment.category.replace(/([A-Z])/g, " $1").toLowerCase() + "! ",
    ]

    baseResponse = encouragement[Math.floor(Math.random() * encouragement.length)] + baseResponse
  }

  // Add helpful tips occasionally
  if (messageCount % 4 === 0) {
    const tips = [
      "\n\n💡 Tip: When working with AI, always be specific about what you want and provide context for better results.",
      "\n\n💡 Tip: Remember that AI systems learn from data, so they can reflect biases present in that data.",
      "\n\n💡 Tip: The key to good prompting is being clear, specific, and providing examples when possible.",
    ]
    baseResponse += tips[Math.floor(Math.random() * tips.length)]
  }

  return baseResponse
}
