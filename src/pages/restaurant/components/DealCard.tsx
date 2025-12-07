import type { DealItem } from '../../../types/restaurant'
import foodDefaultImage from '../../../assets/food-default.png'
import food01Image from '../../../assets/food-01.png'
import food02Image from '../../../assets/food-02.png'
import food03Image from '../../../assets/food-03.png'
import promoPillBg from '../../../assets/promo-pill-bg.png'
import { useCountdown } from '../../../hooks/useCountdown'
import './DealCard.css'

// 图片映射表：根据图片文件名（不包含 hash）映射到实际导入的图片
const getImageByPath = (imagePath: string): string => {
  if (!imagePath) return foodDefaultImage
  
  // 匹配图片文件名（支持带或不带 hash）
  if (imagePath.includes('food-default')) return foodDefaultImage
  if (imagePath.includes('food-01')) return food01Image
  if (imagePath.includes('food-02')) return food02Image
  if (imagePath.includes('food-03')) return food03Image
  
  // 如果都不匹配，返回原路径或默认图片
  return imagePath || foodDefaultImage
}

interface DealCardProps {
  deal: DealItem
}

export function DealCard({ deal }: DealCardProps) {
  // 获取第一个 badge，如果没有则显示空
  const badge = deal.badges && deal.badges.length > 0 ? deal.badges[0] : null

  // 如果是倒计时类型，使用倒计时 hook
  const countdownTime = useCountdown(
    badge?.type === 'countdown' && badge?.subText ? badge.subText : '00:00:00'
  )

  // 根据图片路径获取对应的导入图片
  const imageSrc = getImageByPath(deal.dealImage)

  return (
    <view className='deal-card'>
      <view className='image-wrapper'>
        <image className='product-image' src={imageSrc} mode='aspectFill' />
        {badge && (
          <view className='badge-bar'>
            <view className='badge-text-wrapper' style={{ backgroundImage: `url(${promoPillBg})` }}>
              <text className='badge-text'>{badge.text}</text>
            </view>
            {badge.subText && (
              <text className={`badge-sub-text ${badge.type === 'countdown' ? 'badge-sub-text-countdown' : ''}`}>
                {badge.type === 'countdown' ? countdownTime : badge.subText}
              </text>
            )}
          </view>
        )}
      </view>

      <view className='title-wrapper'>
        <text className='deal-title'>{deal.dealTitle}</text>
      </view>
      
      <view className='bottom-row'>
        <view className='price-wrapper'>
          <text className='price-current'>¥{deal.price}</text>
          <text className='price-original'>¥{deal.originalPrice}</text>
        </view>
        <view className='buy-button'>
          <view className='buy-button-slant' />
          <text className='buy-button-text'>{deal.buttonText}</text>
        </view>
      </view>
    </view>
  )
}

