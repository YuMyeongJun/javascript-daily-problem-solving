import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import axios from 'axios'

interface DailyProblem {
  date: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard'
  solved: boolean
}

interface Statistics {
  weeklyProgress: number
  streak: number
  totalSolved: number
}

const API_URL = 'http://localhost:3000/api'

export default function Home() {
  const [problem, setProblem] = useState<DailyProblem | null>(null)
  const [statistics, setStatistics] = useState<Statistics>({
    weeklyProgress: 0,
    streak: 0,
    totalSolved: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTodayProblem()
    fetchStatistics()
  }, [])

  const fetchTodayProblem = async () => {
    try {
      const response = await axios.get(`${API_URL}/problems/today`)
      setProblem(response.data)
    } catch (error) {
      console.error('문제를 불러오는데 실패했습니다:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_URL}/problems/statistics`)
      setStatistics(response.data)
    } catch (error) {
      console.error('통계를 불러오는데 실패했습니다:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-400"></div>
      </div>
    )
  }

  const today = format(new Date(), 'yyyy-MM-dd', { locale: ko })
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
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">오늘의 문제</h1>
        <p className="text-slate-400">{format(new Date(), 'yyyy년 MM월 dd일', { locale: ko })}</p>
      </div>

      {problem ? (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">{problem.title}</h2>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                difficultyColors[problem.difficulty]
              }`}
            >
              {difficultyLabels[problem.difficulty]}
            </span>
          </div>

          <p className="text-slate-300 mb-6 whitespace-pre-line">{problem.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {problem.solved ? (
                <span className="text-green-400 flex items-center">
                  <span className="mr-2">✅</span>
                  완료
                </span>
              ) : (
                <span className="text-slate-400 flex items-center">
                  <span className="mr-2">⏳</span>
                  미완료
                </span>
              )}
            </div>
            <Link
              to={`/problem/${today}`}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              문제 풀기
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 text-center">
          <p className="text-slate-400">오늘의 문제가 아직 없습니다.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-semibold mb-2">📊 진행률</h3>
          <p className="text-3xl font-bold text-primary-400">{statistics.weeklyProgress}%</p>
          <p className="text-slate-400 text-sm mt-1">이번 주 완료</p>
        </div>
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-semibold mb-2">🔥 연속</h3>
          <p className="text-3xl font-bold text-primary-400">{statistics.streak}일</p>
          <p className="text-slate-400 text-sm mt-1">연속 학습</p>
        </div>
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-semibold mb-2">🎯 총 문제</h3>
          <p className="text-3xl font-bold text-primary-400">{statistics.totalSolved}개</p>
          <p className="text-slate-400 text-sm mt-1">해결한 문제</p>
        </div>
      </div>
    </div>
  )
}

