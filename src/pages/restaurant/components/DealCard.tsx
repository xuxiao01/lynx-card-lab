import type { DealItem } from '../../../types/restaurant'
import foodDefaultImage from '../../../assets/food-default.png'
import food01Image from '../../../assets/food-01.png'
import food02Image from '../../../assets/food-02.png'
import food03Image from '../../../assets/food-03.png'
import promoPillBg from '../../../assets/promo-pill-bg.png'
import { useCountdown } from '../../../hooks/useCountdown'
import './DealCard.css'

// 图片映射表：根据图片文件名（不包含 hash）映射到实际导入的图片
const IMAGE_MAP: Record<string, string> = {
  'food-default': foodDefaultImage,
  'food-01': food01Image,
  'food-02': food02Image,
  'food-03': food03Image,
}

const getImageByPath = (imagePath?: string): string => {
  if (!imagePath) return foodDefaultImage

  const key = Object.keys(IMAGE_MAP).find((k) => imagePath.includes(k))
  return key ? IMAGE_MAP[key] : imagePath
}

interface DealCardProps {
  deal: DealItem
}

export function DealCard({ deal }: DealCardProps) {
  const badge = deal.badges?.[0] ?? null
  const isCountdown = badge?.type === 'countdown'

  const countdownTime = useCountdown(
    isCountdown && badge?.subText ? badge.subText : '00:00:00'
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
              <text
                className={`badge-sub-text ${isCountdown ? 'badge-sub-text-countdown' : ''}`}
              >
                {isCountdown ? countdownTime : badge.subText}
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

