import { useEffect, useState } from 'react'

// 工具函数：字符串 -> 秒
function parseTimeToSeconds(timeStr: string): number {
  const [h = '0', m = '0', s = '0'] = timeStr.split(':')
  const hours = parseInt(h, 10) || 0
  const minutes = parseInt(m, 10) || 0
  const seconds = parseInt(s, 10) || 0
  return hours * 3600 + minutes * 60 + seconds
}

// 工具函数：秒 -> "HH:MM:SS"
function formatSecondsToString(totalSeconds: number): string {
  if (totalSeconds <= 0) return '00:00:00'

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (num: number) => String(num).padStart(2, '0')

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

/**
 * 倒计时：从 initialTime 开始往下减，刷新会重置
 */
export function useCountdown(initialTime: string): string {
  // 只关心「还剩几秒」
  const [seconds, setSeconds] = useState(() =>
    parseTimeToSeconds(initialTime),
  )

  // initialTime 变化时重置秒数
  useEffect(() => {
    setSeconds(parseTimeToSeconds(initialTime))
  }, [initialTime])

  // 定时每秒 -1
  useEffect(() => {
    if (seconds <= 0) return

    const timer = setInterval(() => {
      setSeconds(prev => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [seconds])

  // 对外仍然是 "HH:MM:SS"
  return formatSecondsToString(seconds)
}