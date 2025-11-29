import { get, post } from '../utils/http'
import type { RestaurantInfo, DealItem } from '../types/restaurant'

/**
 * 获取商家列表
 */
export async function getShops() {
  const response = await get<RestaurantInfo[]>('/api/shops')
  return response.data
}

/**
 * 获取商家团购商品列表
 */
export async function getDeals(restaurantId: string) {
  const response = await post<DealItem[]>('/api/deals', { restaurantId })
  return response.data
}

