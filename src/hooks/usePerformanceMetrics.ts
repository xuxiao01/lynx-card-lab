import { useEffect } from 'react'

/**
 * 性能指标类型
 * 根据 Lynx Performance API 文档定义
 * https://lynxjs.org/zh/api/lynx-api/performance-api/performance-entry/metric-actual-fmp-entry.html
 */
interface PerformanceMetric {
  value: number
  unit: string
}

interface MetricActualFmpEntry {
  entryType: 'metric'
  name: 'actualFmp'
  actualFmp?: PerformanceMetric
  lynxActualFmp: PerformanceMetric
  totalActualFmp?: PerformanceMetric
}

/**
 * 性能监控 Hook
 * 用于监听 Lynx 的 Actual FMP 性能指标
 * 
 * ⚠️ 重要说明：
 * Performance API 仅在生产环境的 Lynx 容器中可用（如抖音 App）
 * 在开发环境和 Lynx Explorer 中不可用，这是正常的！
 * 
 * 工作原理：
 * 1. 开发环境：Performance API 不可用，但 __lynx_timing_flag 标记会被保留
 * 2. 生产环境：当页面在真实 App 中运行时，性能数据会自动上报到监控平台
 * 3. 查看数据：登录字节跳动内部的性能监控平台查看
 * 
 * @param enabled - 是否启用性能监控，默认为 true
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   usePerformanceMetrics()
 *   
 *   return (
 *     <view __lynx_timing_flag="__lynx_timing_actual_fmp">
 *       {// 首屏内容}
 *     </view>
 *   )
 * }
 * ```
 */
/**
 * 备选方案：直接从 performance API 获取性能条目
 */
function tryAlternativeMethod(perfApi?: any) {
  console.log('🔄 使用备选方案获取性能数据...')
  
  const perf = perfApi || (typeof globalThis !== 'undefined' && globalThis.performance)
  
  // 尝试使用 performance.getEntries()
  if (perf && perf.getEntries) {
    const checkPerformance = () => {
      const entries = perf.getEntries()
      console.log('📊 所有性能条目数量:', entries.length)
      console.log('📊 所有性能条目:', entries)
      
      // 打印所有条目的类型
      const entryTypes = new Set(entries.map((e: any) => e.entryType))
      console.log('📊 发现的条目类型:', Array.from(entryTypes))
      
      // 查找 metric 类型的条目
      const metricEntries = entries.filter((entry: any) => entry.entryType === 'metric')
      console.log('📊 Metric 条目数量:', metricEntries.length)
      
      if (metricEntries.length > 0) {
        console.log('📊 Metric 条目详情:', metricEntries)
        
        // 查找 actualFmp
        const fmpEntries = metricEntries.filter((entry: any) => entry.name === 'actualFmp')
        if (fmpEntries.length > 0) {
          console.log('✅ 找到 Actual FMP 数据:', fmpEntries)
          fmpEntries.forEach((entry: any) => printMetrics(entry as MetricActualFmpEntry))
        } else {
          console.log('⏳ 未找到 actualFmp，可用的 metric 名称:', 
            metricEntries.map((e: any) => e.name))
        }
      }
    }
    
    // 立即检查一次
    console.log('🔍 第一次检查...')
    checkPerformance()
    
    // 定期检查（因为性能条目可能延迟产生）
    let checkCount = 0
    const interval = setInterval(() => {
      checkCount++
      console.log(`🔍 第 ${checkCount + 1} 次检查...`)
      checkPerformance()
    }, 1000)
    
    // 10秒后停止检查
    setTimeout(() => {
      clearInterval(interval)
      console.log('⏹️ 性能监控：停止轮询（共检查了 ' + (checkCount + 1) + ' 次）')
    }, 10000)
  } else {
    console.warn('❌ performance.getEntries() 也不可用')
    console.log('💡 可用的 performance 方法:', perf ? Object.keys(perf) : '无')
  }
}

/**
 * 打印性能指标
 */
function printMetrics(fmpEntry: MetricActualFmpEntry) {
  console.log('='.repeat(60))
  console.log('📊 Lynx 性能指标 - Actual FMP')
  console.log('='.repeat(60))
  
  // 打印 actualFmp（如果有）
  if (fmpEntry.actualFmp) {
    console.log('✅ actualFmp:', {
      value: fmpEntry.actualFmp.value,
      unit: fmpEntry.actualFmp.unit,
      description: '从准备 TemplateBundle 到首屏渲染完成',
    })
  } else {
    console.log('⏳ actualFmp: 等待容器时间戳...')
  }
  
  // 打印 lynxActualFmp（总是有）
  console.log('✅ lynxActualFmp:', {
    value: fmpEntry.lynxActualFmp.value,
    unit: fmpEntry.lynxActualFmp.unit,
    description: '从加载 TemplateBundle 到首屏渲染完成',
  })
  
  // 打印 totalActualFmp（如果有）
  if (fmpEntry.totalActualFmp) {
    console.log('✅ totalActualFmp:', {
      value: fmpEntry.totalActualFmp.value,
      unit: fmpEntry.totalActualFmp.unit,
      description: '从用户打开页面到首屏渲染完成',
    })
  } else {
    console.log('⏳ totalActualFmp: 等待容器时间戳...')
  }
  
  console.log('='.repeat(60))
  
  // 如果有完整的指标数据，计算并显示总结
  if (fmpEntry.actualFmp && fmpEntry.totalActualFmp) {
    const total = fmpEntry.totalActualFmp.value
    const lynx = fmpEntry.lynxActualFmp.value
    const containerTime = total - lynx
    
    console.log('📈 性能总结:')
    console.log(`  容器耗时: ${containerTime.toFixed(2)} ${fmpEntry.totalActualFmp.unit}`)
    console.log(`  Lynx 耗时: ${lynx.toFixed(2)} ${fmpEntry.lynxActualFmp.unit}`)
    console.log(`  总耗时: ${total.toFixed(2)} ${fmpEntry.totalActualFmp.unit}`)
    console.log('='.repeat(60))
  }
}

export function usePerformanceMetrics(enabled = true) {
  useEffect(() => {
    if (!enabled) return

    // 检查是否在 Lynx 环境中
    const isLynx = typeof __MAIN_THREAD__ !== 'undefined'
    
    console.log('='.repeat(60))
    console.log('🔍 Lynx 性能监控环境检测')
    console.log('='.repeat(60))
    console.log('环境信息:')
    console.log('  - 是否 Lynx 环境:', isLynx)
    console.log('  - __MAIN_THREAD__:', typeof __MAIN_THREAD__)
    console.log('  - global:', typeof global)
    console.log('  - globalThis:', typeof globalThis)
    
    // 尝试查找 Lynx 的全局对象
    const lynxGlobal = typeof globalThis !== 'undefined' ? globalThis : 
                       typeof global !== 'undefined' ? global : 
                       {} as any
    
    console.log('Performance API 检测:')
    console.log('  - globalThis.performance:', typeof lynxGlobal.performance)
    console.log('  - globalThis.PerformanceObserver:', typeof lynxGlobal.PerformanceObserver)
    
    if (!isLynx) {
      console.log('⚠️ 非 Lynx 环境，性能监控不可用')
      console.log('='.repeat(60))
      return
    }

    // 在 Lynx 环境中，尝试使用 globalThis 的 performance API
    const perfApi = lynxGlobal.performance
    const PerfObserver = lynxGlobal.PerformanceObserver
    
    // 检查 performance API
    if (!perfApi && !PerfObserver) {
      console.log('')
      console.log('📋 性能监控状态: 不可用')
      console.log('─'.repeat(60))
      console.log('💡 说明:')
      console.log('   Lynx Performance API 在开发环境中不可用')
      console.log('   __lynx_timing_flag 标记已添加到团购列表组件')
      console.log('')
      console.log('🎯 实际使用场景:')
      console.log('   - 在真实的 Lynx 客户端中运行时，性能数据会被收集')
      console.log('   - 数据将上报到字节跳动的性能监控平台')
      console.log('   - 开发环境中无法直接查看，这是正常的')
      console.log('')
      console.log('✅ 性能标记位置:')
      console.log('   组件: DealList')
      console.log('   元件: <list __lynx_timing_flag="__lynx_timing_actual_fmp">')
      console.log('   说明: 标记团购列表的首屏渲染完成时机')
      console.log('='.repeat(60))
      return
    }

    console.log('✅ 找到 performance API，开始监听...')
    console.log('='.repeat(60))

    // 创建性能观察器（使用 Lynx 的 PerformanceObserver）
    const observer = new PerfObserver((list: any) => {
      const entries = list.getEntries()
      
      entries.forEach((entry: any) => {
        // 只处理 metric 类型的 actualFmp 事件
        if (entry.entryType === 'metric' && entry.name === 'actualFmp') {
          const fmpEntry = entry as unknown as MetricActualFmpEntry
          printMetrics(fmpEntry)
        }
      })
    })

    // 开始观察 metric 类型的性能事件
    try {
      observer.observe({ 
        type: 'metric',
        buffered: true, // 获取缓冲的事件
      })
      
      console.log('✅ 性能监控：PerformanceObserver 已启动')
    } catch (error) {
      console.error('❌ 性能监控启动失败:', error)
    }

    // 清理函数
    return () => {
      observer.disconnect()
      console.log('🔚 性能监控：PerformanceObserver 已停止')
    }
  }, [enabled])
}

