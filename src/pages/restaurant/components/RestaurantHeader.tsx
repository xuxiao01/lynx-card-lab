import type { RestaurantInfo } from '../../../types/restaurant'
import fullHeartIcon from '../../../assets/heart-full.png'
import halfHeartIcon from '../../../assets/heart-half.png'
import outlineHeartIcon from '../../../assets/heart-outline.png'
import './RestaurantHeader.css'

interface RestaurantHeaderProps {
  restaurant: RestaurantInfo
}

export function RestaurantHeader({ restaurant }: RestaurantHeaderProps) {
  // 固定显示 5 个心，根据评分显示满心、半心、空心
  const renderRatingHearts = () => {
    const hearts = []
    const rating = restaurant.rating

    for (let i = 0; i < 5; i++) {
      const heartValue = rating - i
      let heartSrc
      let heartKey

      if (heartValue >= 1) {
        heartSrc = fullHeartIcon
        heartKey = `full-${i}`
      } else if (heartValue >= 0.5) {
        heartSrc = halfHeartIcon
        heartKey = `half-${i}`
      } else {
        heartSrc = outlineHeartIcon
        heartKey = `outline-${i}`
      }

      hearts.push(
        <image
          key={heartKey}
          className='heart-icon'
          src={heartSrc}
        />,
      )
    }

    return hearts
  }

  return (
    <view className='header-container'>
      <view className='left-cover'>
        <image
          className='cover-image'
          src={restaurant.restaurantCover}
        />
        {/* 左上角角标先不写 */}
      </view>

      <view className='right-content'>
        <view className='top-row'>
          <text className='restaurant-name'>{restaurant.restaurantName}</text>
        </view>

        <view className='rating-row'>
          <view className='hearts-container'>{renderRatingHearts()}</view>
          <text className='rating-number'>{restaurant.rating}</text>
          <text className='rating-text'>{restaurant.ratingText}</text>
          <text className='review-count'>{restaurant.reviewCount}条评价</text>
        </view>

        <view className='meta-row'>
          <view className='meta-left'>
            <text className='category'>{restaurant.category}</text>
            <text className='area'>{restaurant.area}</text>
            <text className='avg-price'>人均¥{restaurant.avgPrice}</text>
          </view>
          <text className='distance'>{restaurant.distance}</text>
        </view>

        <view className='tags-row'>
          {restaurant.tags.map((tag, index) => (
            <view key={index} className='tag'>
              <text className='tag-text'>{tag}</text>
            </view>
          ))}
        </view>
      </view>
    </view>
  )
}

