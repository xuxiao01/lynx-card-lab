import { RestaurantHeader } from './components/RestaurantHeader'
import { DealList } from './components/ DealList'
import type { RestaurantInfo } from '../../types/restaurant'
import restaurantDefaultCover from '../../assets/default-cover.png'
// 测试数据
const mockRestaurant: RestaurantInfo = {
  restaurantId: '1',
  restaurantName: '椒鸣椒麻馆(五道口店)',
  restaurantCover: restaurantDefaultCover,
  rating: 3.5,
  ratingText: '可以一试',
  reviewCount: 170,
  category: '中餐',
  area: '龙柏地区',
  avgPrice: 220,
  distance: '842m',
  tags: ['心动榜2025年上榜餐厅', '多人聚餐', '生日轰趴', '可订桌'],
}

export function RestaurantPage() {
  return (
    <view>
      <RestaurantHeader restaurant={mockRestaurant} />
      <DealList />
    </view>
  )
}

