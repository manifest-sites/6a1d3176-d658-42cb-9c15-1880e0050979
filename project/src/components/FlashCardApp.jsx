import { useState, useEffect } from 'react'
import { Button, Card, Input, Radio, Progress, message } from 'antd'
import { FlashCard } from '../entities/FlashCard'

function FlashCardApp() {
  const [currentProblem, setCurrentProblem] = useState({ num1: 0, num2: 0 })
  const [userAnswer, setUserAnswer] = useState('')
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [level, setLevel] = useState('easy')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [sessions, setSessions] = useState([])

  const generateProblem = (difficulty) => {
    let num1, num2
    switch (difficulty) {
      case 'easy':
        num1 = Math.floor(Math.random() * 10) + 1
        num2 = Math.floor(Math.random() * 10) + 1
        break
      case 'medium':
        num1 = Math.floor(Math.random() * 50) + 1
        num2 = Math.floor(Math.random() * 50) + 1
        break
      case 'hard':
        num1 = Math.floor(Math.random() * 100) + 1
        num2 = Math.floor(Math.random() * 100) + 1
        break
      default:
        num1 = Math.floor(Math.random() * 10) + 1
        num2 = Math.floor(Math.random() * 10) + 1
    }
    return { num1, num2 }
  }

  const checkAnswer = () => {
    const correctAnswer = currentProblem.num1 + currentProblem.num2
    const userAnswerNum = parseInt(userAnswer)
    const correct = userAnswerNum === correctAnswer
    
    setIsCorrect(correct)
    setShowResult(true)
    setTotalQuestions(prev => prev + 1)
    
    if (correct) {
      setScore(prev => prev + 1)
      message.success('Correct! Well done!')
    } else {
      message.error(`Incorrect. The answer is ${correctAnswer}`)
    }
  }

  const nextProblem = () => {
    setCurrentProblem(generateProblem(level))
    setUserAnswer('')
    setShowResult(false)
  }

  const saveSession = async () => {
    try {
      const sessionData = {
        correctAnswers: score,
        totalQuestions: totalQuestions,
        level: level,
        sessionDate: new Date().toISOString().split('T')[0]
      }
      
      const result = await FlashCard.create(sessionData)
      if (result.success) {
        message.success('Session saved!')
        loadSessions()
      }
    } catch (error) {
      message.error('Failed to save session')
    }
  }

  const loadSessions = async () => {
    try {
      const result = await FlashCard.list()
      if (result.success) {
        setSessions(result.data)
      }
    } catch (error) {
      console.error('Failed to load sessions:', error)
    }
  }

  const resetSession = () => {
    setScore(0)
    setTotalQuestions(0)
    setCurrentProblem(generateProblem(level))
    setUserAnswer('')
    setShowResult(false)
  }

  useEffect(() => {
    setCurrentProblem(generateProblem(level))
    loadSessions()
  }, [level])

  const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Addition Flash Cards</h1>
          <p className="text-gray-600">Practice your addition skills!</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Flash Card */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <div className="text-center mb-6">
                <div className="mb-4">
                  <Radio.Group value={level} onChange={(e) => setLevel(e.target.value)}>
                    <Radio.Button value="easy">Easy (1-10)</Radio.Button>
                    <Radio.Button value="medium">Medium (1-50)</Radio.Button>
                    <Radio.Button value="hard">Hard (1-100)</Radio.Button>
                  </Radio.Group>
                </div>
                
                <div className="text-6xl font-bold text-gray-800 mb-6">
                  {currentProblem.num1} + {currentProblem.num2} = ?
                </div>
                
                <div className="mb-6">
                  <Input
                    size="large"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter your answer"
                    className="text-center text-2xl max-w-xs mx-auto"
                    onPressEnter={!showResult ? checkAnswer : nextProblem}
                    disabled={showResult}
                  />
                </div>
                
                {showResult && (
                  <div className={`text-2xl font-semibold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? '✓ Correct!' : `✗ Incorrect. Answer: ${currentProblem.num1 + currentProblem.num2}`}
                  </div>
                )}
                
                <div className="flex gap-4 justify-center">
                  {!showResult ? (
                    <Button type="primary" size="large" onClick={checkAnswer} disabled={!userAnswer}>
                      Check Answer
                    </Button>
                  ) : (
                    <Button type="primary" size="large" onClick={nextProblem}>
                      Next Problem
                    </Button>
                  )}
                  <Button size="large" onClick={resetSession}>
                    Reset Session
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Stats Panel */}
          <div className="space-y-6">
            <Card title="Current Session" className="shadow-lg">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Accuracy</span>
                    <span className="font-semibold">{accuracy}%</span>
                  </div>
                  <Progress percent={accuracy} strokeColor="#10b981" />
                </div>
                <div className="flex justify-between">
                  <span>Correct:</span>
                  <span className="font-semibold text-green-600">{score}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span className="font-semibold">{totalQuestions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span className="font-semibold capitalize">{level}</span>
                </div>
                {totalQuestions >= 10 && (
                  <Button type="default" block onClick={saveSession}>
                    Save Session
                  </Button>
                )}
              </div>
            </Card>

            {sessions.length > 0 && (
              <Card title="Recent Sessions" className="shadow-lg">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {sessions.slice(0, 5).map((session) => (
                    <div key={session._id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div className="text-sm">
                        <div className="font-medium">{session.level}</div>
                        <div className="text-gray-500">{session.sessionDate}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {Math.round((session.correctAnswers / session.totalQuestions) * 100)}%
                        </div>
                        <div className="text-xs text-gray-500">
                          {session.correctAnswers}/{session.totalQuestions}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlashCardApp