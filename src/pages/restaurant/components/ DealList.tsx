import { DealCard } from './DealCard'
import type { DealItem } from '../../../types/restaurant'
import { useEffect, useState, useRef, useLayoutEffect } from 'react'
import { getDeals } from '../../../services/shop'
import { processImageUrl } from '../../../utils/url'
import { usePerformanceMetrics } from '../../../hooks/usePerformanceMetrics'
import foodDefaultImage from '../../../assets/food-default.png'
import './DealList.css'

export function DealList() {
  const [deals, setDeals] = useState<DealItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 懒加载：控制可见卡片数量
  // 初始只渲染首屏可见的卡片，延后渲染不可见部分
  const [visibleCount, setVisibleCount] = useState(4) // 首屏显示4个卡片

  // 自定义 FMP 性能监控：记录开始请求团购数据的时间
  const renderStartTimeRef = useRef<number | null>(null)
  const hasReportedFmpRef = useRef(false)

  // 启用性能监控
  usePerformanceMetrics()

  useEffect(() => {
    async function fetchDeals() {
      try {
        console.log('开始获取团购数据...')
        setLoading(true)
        
        // 记录开始时间（数据开始加载时）
        const startTime = typeof performance !== 'undefined' && performance.now 
          ? performance.now() 
          : Date.now()
        renderStartTimeRef.current = startTime
        console.log('📊 [自定义 FMP] 开始时间:', startTime, 'ms')
        
        // 获取餐厅 ID 为 '1' 的团购商品
        const dealsData = await getDeals('1')
        console.log('✅ 获取团购数据成功！', dealsData)
        
        if (dealsData && dealsData.length > 0) {
          // 处理图片路径
          const processedDeals = dealsData.map(deal => ({
            ...deal,
            dealImage: processImageUrl(deal.dealImage, foodDefaultImage),
          }))
          
          // 重置可见数量为初始值（首屏显示4个卡片）
          setVisibleCount(4)
          setDeals(processedDeals)
        } else {
          setError('没有找到团购数据')
        }
      } catch (err) {
        console.error('❌ 获取团购数据失败:', err)
        setError(err instanceof Error ? err.message : '获取数据失败')
      } finally {
        setLoading(false)
      }
    }

    fetchDeals()
  }, [])

  // 加载中状态
  if (loading) {
    return (
      <view className='deal-list-container' style={{ padding: '20px', textAlign: 'center' }}>
        <text style={{ fontSize: '14px', color: '#999' }}>加载团购中...</text>
      </view>
    )
  }

  // 错误状态
  if (error) {
    return (
      <view className='deal-list-container' style={{ padding: '20px', textAlign: 'center' }}>
        <text style={{ fontSize: '14px', color: 'red' }}>
          {error}
        </text>
      </view>
    )
  }

  // 无数据状态
  if (deals.length === 0) {
    return (
      <view className='deal-list-container' style={{ padding: '20px', textAlign: 'center' }}>
        <text style={{ fontSize: '14px', color: '#999' }}>暂无团购商品</text>
      </view>
    )
  }

  // 懒加载：延后渲染不可见部分的卡片
  useEffect(() => {
    if (deals.length === 0 || visibleCount >= deals.length) return
    
    // 延迟加载剩余卡片，给首屏渲染留出时间
    // 使用分批次加载，避免一次性渲染太多导致卡顿
    const loadMoreCards = () => {
      if (visibleCount >= deals.length) return
      
      // 每次加载4个卡片
      const nextCount = Math.min(visibleCount + 4, deals.length)
      setVisibleCount(nextCount)
      
      // 如果还有未加载的卡片，继续延迟加载
      if (nextCount < deals.length) {
        // 使用 requestAnimationFrame 确保在下一帧加载，不阻塞渲染
        requestAnimationFrame(() => {
          setTimeout(loadMoreCards, 50) // 每 50ms 加载一批
        })
      }
    }
    
    // 首屏渲染完成后，延迟 200ms 开始加载剩余卡片
    const timer = setTimeout(() => {
      loadMoreCards()
    }, 200)
    
    return () => clearTimeout(timer)
  }, [deals.length, visibleCount])

  // 检测首屏关键内容渲染完成（FMP）
  useLayoutEffect(() => {
    // 只统计首屏可见的卡片数量（用于 FMP 计算）
    const firstScreenCount = Math.min(visibleCount, deals.length)
    
    if (firstScreenCount > 0 && renderStartTimeRef.current && !hasReportedFmpRef.current) {
      // 使用 requestAnimationFrame 确保 DOM 更新完成
      requestAnimationFrame(() => {
        const currentTime = typeof performance !== 'undefined' && performance.now 
          ? performance.now() 
          : Date.now()
        
        const fmpDuration = currentTime - renderStartTimeRef.current!
        hasReportedFmpRef.current = true
        
        console.log('='.repeat(60))
        console.log('📊 [自定义 FMP] 首屏关键内容渲染完成')
        console.log('='.repeat(60))
        console.log('⏱️  FMP 耗时:', fmpDuration.toFixed(2), 'ms')
        console.log('📦 首屏卡片数量:', firstScreenCount, '(总数量:', deals.length, ')')
        console.log('🚀 性能优化: 已启用懒加载，延后渲染不可见部分')
        console.log('='.repeat(60))
      })
    }
  }, [deals, visibleCount])

  // 正常渲染：只渲染可见的卡片
  const visibleDeals = deals.slice(0, visibleCount)

  return (
    <list
      className='deal-list-container'
      scroll-orientation='horizontal'
      list-type='single'
      span-count={1}
      // Lynx 性能监控标记：标记团购列表为首屏关键内容
      // 当此元件渲染完成时，触发 Actual FMP 性能指标上报
      __lynx_timing_flag="__lynx_timing_actual_fmp"
    >
      {visibleDeals.map((deal) => (
        <list-item
          key={deal.dealId}
          item-key={`deal-${deal.dealId}`}
          className='deal-list-item'
        >
          <DealCard deal={deal} />
        </list-item>
      ))}
    </list>
  )
}

