import { RestaurantHeader } from './components/RestaurantHeader'
import { DealList } from './components/ DealList'
import type { RestaurantInfo } from '../../types/restaurant'
import { useEffect, useState } from 'react'
import { getShops } from '../../services/shop'
import defaultCover from '../../assets/default-cover.png'

/**
 * 获取前端服务器地址
 */
function getFrontendURL(): string {
  // 从当前访问地址自动获取
  if (typeof window !== 'undefined' && window.location) {
    const { protocol, hostname, port } = window.location
    // 如果有端口，使用端口；否则使用默认端口
    const actualPort = port || (import.meta.env.VITE_DEV_PORT || '3001')
    return `${protocol}//${hostname}:${actualPort}`
  }
  
  // 降级方案：使用环境变量
  return import.meta.env.VITE_DEV_URL || 'http://192.168.0.100:3001'
}

/**
 * 处理图片路径
 * 如果是相对路径，转换为可访问的完整 URL
 */
function processImageUrl(url: string): string {
  // 如果已经是完整 URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // 如果是后端返回的静态资源路径（如 /static/image/xxx.png）
  // 在 Lynx 环境中需要转换为完整 URL
  if (url.startsWith('/static/')) {
    const isLynx = typeof __MAIN_THREAD__ !== 'undefined'
    if (isLynx) {
      // Lynx 环境：自动获取前端服务器的完整 URL
      const frontendURL = getFrontendURL()
      return `${frontendURL}${url}`
    }
    // 浏览器环境：保持相对路径
    return url
  }
  
  // 其他情况使用默认图片
  return defaultCover
}

export function RestaurantPage() {
  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRestaurant() {
      try {
        console.log('开始获取餐厅数据...')
        setLoading(true)
        
        const shops = await getShops()
        console.log('✅ 获取餐厅数据成功！', shops)
        
        if (shops && shops.length > 0) {
          // 处理图片路径
          const shop = shops[0]
          const processedShop = {
            ...shop,
            restaurantCover: processImageUrl(shop.restaurantCover),
          }
          console.log('处理后的图片路径:', processedShop.restaurantCover)
          setRestaurant(processedShop)
        } else {
          setError('没有找到餐厅数据')
        }
      } catch (err) {
        console.error('❌ 获取餐厅数据失败:', err)
        setError(err instanceof Error ? err.message : '获取数据失败')
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurant()
  }, [])

  // 加载中状态
  if (loading) {
    return (
      <view style={{ padding: '20px', textAlign: 'center' }}>
        <text style={{ fontSize: '16px' }}>加载中...</text>
      </view>
    )
  }

  // 错误状态
  if (error) {
    return (
      <view style={{ padding: '20px', textAlign: 'center' }}>
        <text style={{ fontSize: '16px', color: 'red' }}>
          错误: {error}
        </text>
        <text style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
          请确保后端服务器已启动 (node mock/server.cjs)
        </text>
      </view>
    )
  }

  // 无数据状态
  if (!restaurant) {
    return (
      <view style={{ padding: '20px', textAlign: 'center' }}>
        <text style={{ fontSize: '16px' }}>没有数据</text>
      </view>
    )
  }

  // 正常渲染
  return (
    <view>
      <RestaurantHeader restaurant={restaurant} />
      <DealList />
    </view>
  )
}

