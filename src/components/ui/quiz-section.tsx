"use client"

import { useState } from "react"
import { CheckCircle2, XCircle, Trophy, Star } from "lucide-react"
import { type Bite } from "@/data/bites"

interface QuizSectionProps {
  bite: Bite
  onComplete?: (score: number, total: number) => void
}

export function QuizSection({ bite, onComplete }: QuizSectionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(bite.options?.length || 0).fill(null)
  )

  // Only works with quiz-type bites with options
  if (!bite.options || !bite.answer) {
    return (
      <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          This is not a quiz-type bite. No questions available.
        </p>
      </div>
    )
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(answerIndex)
    setShowFeedback(true)

    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answerIndex
    setAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < (bite.options?.length || 0) - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(answers[currentQuestion + 1] ?? null)
      setShowFeedback(answers[currentQuestion + 1] !== null)
    } else {
      const finalScore = calculateScore()
      setQuizCompleted(true)
      onComplete?.(finalScore, bite.options?.length || 0)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(answers[currentQuestion - 1] ?? null)
      setShowFeedback(answers[currentQuestion - 1] !== null)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setQuizCompleted(false)
    setAnswers(Array(bite.options?.length || 0).fill(null))
  }

  const calculateScore = () => {
    return answers.reduce((total, answer) => {
      if (answer === 0 && bite.answer === bite.options?.[answer]) {
        return total + 1
      }
      return total
    }, 0)
  }

  const isCorrect = selectedAnswer === 0 && bite.answer === bite.options?.[selectedAnswer]

  if (quizCompleted) {
    const finalScore = calculateScore()
    const percentage = (finalScore / (bite.options?.length || 1)) * 100

    const getScoreMessage = () => {
      if (percentage >= 80) return "Excellent! You understand this concept!"
      if (percentage >= 60) return "Great job! Keep practicing!"
      if (percentage >= 40) return "Not bad! Review and try again!"
      return "Keep studying and try again!"
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl shadow-2xl bg-white/95 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="text-center pb-8 p-6 md:p-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-200/20 via-purple-200/20 to-blue-200/20 dark:from-blue-400/30 dark:via-purple-400/30 dark:to-blue-400/30 rounded-full blur-xl animate-pulse"></div>
              <div className="relative flex justify-center">
                <div className="animate-bounce">
                  <Trophy className="w-16 h-16 md:w-20 md:h-20 text-blue-500 dark:text-blue-400 drop-shadow-lg" />
                </div>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
              Quiz Complete!
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg">
              Great effort completing this knowledge bite challenge!
            </p>
          </div>
          <div className="space-y-6 md:space-y-8 p-6 md:p-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/10 via-purple-100/10 to-blue-100/10 dark:from-blue-400/20 dark:via-purple-400/20 dark:to-blue-400/20 rounded-2xl blur-sm"></div>
              <div className="relative bg-gradient-to-br from-white to-blue-50/5 dark:from-slate-800 dark:to-blue-900/10 rounded-2xl p-6 md:p-8 border border-blue-200/20 dark:border-blue-400/30">
                <div className="text-center space-y-4">
                  <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                    {finalScore}/{bite.options?.length}
                  </div>
                  <div className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium">
                    {Math.round(percentage)}% Correct
                  </div>
                  <div className="flex justify-center space-x-1 mt-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`transition-all duration-300 ${
                          i < Math.ceil((finalScore / (bite.options?.length || 1)) * 5)
                            ? "animate-pulse"
                            : ""
                        }`}
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        <Star
                          className={`w-8 h-8 md:w-10 md:h-10 ${
                            i < Math.ceil((finalScore / (bite.options?.length || 1)) * 5)
                              ? "text-yellow-400"
                              : "text-slate-300/30 dark:text-slate-600/20"
                          }`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <div className="inline-block bg-gradient-to-r from-blue-50/10 to-purple-50/10 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full px-4 md:px-6 py-2 md:py-3 border border-blue-200/20 dark:border-blue-400/30">
                <span className="text-base md:text-lg font-medium text-slate-900 dark:text-slate-100">
                  {getScoreMessage()}
                </span>
              </div>
            </div>

            <button
              onClick={resetQuiz}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 md:py-4 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-400/30 p-6 md:p-8 space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Question {currentQuestion + 1} of {bite.options?.length}
          </div>
          <div className="flex-1 mx-4 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / (bite.options?.length || 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 dark:text-white">
            {bite.content}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {bite.options?.map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrectAnswer = option === bite.answer
              const showCorrect = showFeedback && isCorrectAnswer
              const showIncorrect = showFeedback && isSelected && !isCorrectAnswer

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                  className={`w-full p-4 rounded-lg border-2 transition-all duration-300 flex items-center gap-3 text-left disabled:cursor-not-allowed ${
                    showCorrect
                      ? "bg-green-100/50 dark:bg-green-900/30 border-green-500 text-green-900 dark:text-green-200"
                      : showIncorrect
                      ? "bg-red-100/50 dark:bg-red-900/30 border-red-500 text-red-900 dark:text-red-200"
                      : isSelected
                      ? "bg-blue-100/50 dark:bg-blue-900/30 border-blue-500 text-blue-900 dark:text-blue-200"
                      : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:border-blue-400 dark:hover:border-blue-500"
                  }`}
                >
                  <span className="flex-1">{option}</span>
                  {showCorrect && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                  {showIncorrect && <XCircle className="w-5 h-5 flex-shrink-0" />}
                </button>
              )
            })}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <div
              className={`p-4 rounded-lg ${
                isCorrect
                  ? "bg-green-100/50 dark:bg-green-900/30 text-green-900 dark:text-green-200 border border-green-200 dark:border-green-800"
                  : "bg-red-100/50 dark:bg-red-900/30 text-red-900 dark:text-red-200 border border-red-200 dark:border-red-800"
              }`}
            >
              <p className="font-medium">
                {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
              </p>
              <p className="text-sm mt-1">
                The correct answer is: <strong>{bite.answer}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3 pt-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!showFeedback}
            className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {currentQuestion === (bite.options?.length || 0) - 1 ? "Finish" : "Next →"}
          </button>
        </div>
      </div>
    </div>
  )
}
