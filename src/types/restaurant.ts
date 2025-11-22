export interface RestaurantInfo {
  restaurantId: string;      // 餐厅ID
  restaurantName: string;    // 餐厅名称（含分店名）
  restaurantCover: string;   // 餐厅封面图
  rating: number;            // 数字评分，如 3.5
  ratingText: string;        // 评分文案，如“可以一试”
  reviewCount: number;       // 评价数量
  category: string;          // 类别，如“中餐”
  area: string;              // 所属地区，如“龙柏地区”
  avgPrice: number;          // 人均消费金额
  distance: string;          // 距离，如“842m”
  tags: string[];            // 标签数组
}


export interface BadgeItem {
  text: string;         // 文本，如“特惠补贴”
  subText?: string;     // 子文案，如“减10”/“12:88:88”
  type?: string;        // 类型：normal / countdown
}

export interface DealItem {
  dealId: string;
  dealImage: string;
  badges: BadgeItem[];   // ← 支持多个角标
  dealTitle: string;
  price: number;
  originalPrice: number;
  buttonText: string;
}