import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import axios from 'axios'

interface ProblemHistory {
  date: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  solved: boolean
  solvedAt?: string
}

const API_URL = 'http://localhost:3000/api'

export default function History() {
  const [problems, setProblems] = useState<ProblemHistory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/problems/history`)
      setProblems(response.data)
    } catch (error) {
      console.error('히스토리를 불러오는데 실패했습니다:', error)
    } finally {
      setLoading(false)
    }
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">문제 히스토리</h1>
        <p className="text-slate-400">지금까지 풀었던 문제들을 확인하세요</p>
      </div>

      {problems.length === 0 ? (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-12 text-center">
          <p className="text-slate-400">아직 풀었던 문제가 없습니다.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {problems.map((problem) => (
            <Link
              key={problem.date}
              to={`/problem/${problem.date}`}
              className="bg-slate-800 rounded-lg border border-slate-700 p-6 hover:border-primary-500 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold">{problem.title}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        difficultyColors[problem.difficulty]
                      }`}
                    >
                      {difficultyLabels[problem.difficulty]}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">
                    {format(new Date(problem.date), 'yyyy년 MM월 dd일', { locale: ko })}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  {problem.solved ? (
                    <span className="text-green-400 flex items-center">
                      <span className="mr-2">✅</span>
                      완료
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center">
                      <span className="mr-2">⏳</span>
                      미완료
                    </span>
                  )}
                  {problem.solvedAt && (
                    <span className="text-slate-400 text-sm">
                      {format(new Date(problem.solvedAt), 'HH:mm', { locale: ko })} 완료
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

