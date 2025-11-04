import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

interface Problem {
  date: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  starterCode: string
  testCases: Array<{
    input: string
    expectedOutput: string
  }>
  solved?: boolean
  solvedAt?: string
}

interface SubmissionResult {
  success: boolean
  message: string
  alreadyCompleted?: boolean
  solvedAt?: string
  testResults?: Array<{
    passed: boolean
    input: string
    expected: string
    output: string
  }>
}

const API_URL = 'http://localhost:3000/api'

export default function Problem() {
  const { date } = useParams<{ date: string }>()
  const navigate = useNavigate()
  const [problem, setProblem] = useState<Problem | null>(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<SubmissionResult | null>(null)

  useEffect(() => {
    if (date) {
      fetchProblem(date)
    }
  }, [date])

  const fetchProblem = async (problemDate: string) => {
    try {
      const response = await axios.get(`${API_URL}/problems/${problemDate}`)
      setProblem(response.data)
      setCode(response.data.starterCode || '')
      
      // 이미 완료된 문제인 경우 완료 메시지 표시
      if (response.data.solved) {
        setResult({
          success: true,
          message: `이미 오늘의 문제를 완료하셨습니다! 🎉\n완료 시간: ${response.data.solvedAt ? new Date(response.data.solvedAt).toLocaleString('ko-KR') : ''}`,
          alreadyCompleted: true,
          solvedAt: response.data.solvedAt,
        })
      }
    } catch (error) {
      console.error('문제를 불러오는데 실패했습니다:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!problem || !code.trim() || problem.solved) return

    setSubmitting(true)
    setResult(null)

    try {
      const response = await axios.post(`${API_URL}/problems/${date}/submit`, {
        code,
      })
      setResult(response.data)

      if (response.data.success) {
        // 문제 완료 상태 업데이트
        setProblem({ ...problem, solved: true, solvedAt: new Date().toISOString() })
        setTimeout(() => {
          navigate('/')
        }, 2000)
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.response?.data?.message || '제출 중 오류가 발생했습니다.',
        alreadyCompleted: error.response?.data?.alreadyCompleted || false,
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
      </div>
    )
  }

  if (!problem) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">문제를 찾을 수 없습니다.</p>
      </div>
    )
  }

  const difficultyColors = {
    easy: 'text-green-400 bg-green-400/10',
    medium: 'text-yellow-400 bg-yellow-400/10',
    hard: 'text-red-400 bg-red-400/10',
  }

  const difficultyLabels = {
    easy: '쉬움',
    medium: '보통',
    hard: '어려움',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{problem.title}</h1>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
              difficultyColors[problem.difficulty]
            }`}
          >
            {difficultyLabels[problem.difficulty]}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h2 className="text-xl font-semibold mb-4">문제 설명</h2>
            <p className="text-slate-300 whitespace-pre-line">{problem.description}</p>
          </div>

          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h2 className="text-xl font-semibold mb-4">테스트 케이스</h2>
            <div className="space-y-3">
              {problem.testCases.map((testCase, index) => (
                <div key={index} className="bg-slate-900 rounded p-3">
                  <p className="text-sm text-slate-400 mb-1">입력:</p>
                  <code className="text-slate-300">{testCase.input}</code>
                  <p className="text-sm text-slate-400 mb-1 mt-2">예상 출력:</p>
                  <code className="text-slate-300">{testCase.expectedOutput}</code>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">코드 작성</h2>
              <button
                onClick={() => setCode(problem.starterCode || '')}
                className="text-sm text-slate-400 hover:text-slate-300"
              >
                초기화
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 bg-slate-900 text-slate-100 font-mono text-sm p-4 rounded border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              placeholder="코드를 작성하세요..."
            />
          </div>

          {problem.solved ? (
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-6 text-center">
              <div className="text-green-400 text-xl mb-2">✅ 완료</div>
              <p className="text-slate-300 text-sm">
                오늘의 문제를 이미 완료하셨습니다!
                {problem.solvedAt && (
                  <span className="block mt-1 text-slate-400">
                    완료 시간: {new Date(problem.solvedAt).toLocaleString('ko-KR')}
                  </span>
                )}
              </p>
              <p className="text-slate-400 text-xs mt-2">
                내일 새로운 문제로 다시 도전해보세요! 🎯
              </p>
            </div>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || !code.trim()}
              className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors"
            >
              {submitting ? '제출 중...' : '제출하기'}
            </button>
          )}

          {result && !result.alreadyCompleted && (
            <div
              className={`rounded-lg border p-6 ${
                result.success
                  ? 'bg-green-900/20 border-green-700'
                  : 'bg-red-900/20 border-red-700'
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-2 ${
                  result.success ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {result.success ? '✅ 성공!' : '❌ 실패'}
              </h3>
              <p className="text-slate-300 mb-4">{result.message}</p>

              {result.testResults && (
                <div className="space-y-2">
                  {result.testResults.map((test, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded ${
                        test.passed ? 'bg-green-900/30' : 'bg-red-900/30'
                      }`}
                    >
                      <p className="text-sm font-medium mb-1">
                        테스트 {index + 1}: {test.passed ? '✅ 통과' : '❌ 실패'}
                      </p>
                      {!test.passed && (
                        <div className="text-xs text-slate-400 space-y-1">
                          <p>입력: {test.input}</p>
                          <p>예상: {test.expected}</p>
                          <p>출력: {test.output}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

