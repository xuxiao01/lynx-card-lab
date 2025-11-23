import type { DealItem } from '../../../types/restaurant'
import foodDefaultImage from '../../../assets/food-default.png'
import './DealCard.css'

interface DealCardProps {
  deal: DealItem
}

export function DealCard({ deal }: DealCardProps) {
  // 获取第一个 badge，如果没有则显示空
  const badge = deal.badges && deal.badges.length > 0 ? deal.badges[0] : null
  const badgeText = badge
    ? badge.subText
      ? `${badge.text} ${badge.subText}`
      : badge.text
    : ''

  const imageSrc = deal.dealImage || foodDefaultImage

  return (
    <view className='deal-card'>
      <view className='image-wrapper'>
        <image className='product-image' src={imageSrc} />
        {badgeText && (
          <view className='badge-bar'>
            <text className='badge-text'>{badgeText}</text>
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
          <text className='buy-button-text'>{deal.buttonText}</text>
        </view>
      </view>
    </view>
  )
}

