import { RestaurantHeader } from './components/RestaurantHeader'
import { DealList } from './components/ DealList'
import type { RestaurantInfo } from '../../types/restaurant'
import { useEffect, useState } from 'react'
import { getShops } from '../../services/shop'
import { processImageUrl } from '../../utils/url'
import defaultCover from '../../assets/default-cover.png'

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
            restaurantCover: processImageUrl(shop.restaurantCover, defaultCover),
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

