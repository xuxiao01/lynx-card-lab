import type { RestaurantInfo } from '../../../types/restaurant'
import fullHeartIcon from '../../../assets/heart-full.png'
import halfHeartIcon from '../../../assets/heart-half.png'
import outlineHeartIcon from '../../../assets/heart-outline.png'
import badgeBg from '../../../assets/badge-bg.png'
import xindongTagBg from '../../../assets/xindong-tag-bg.png'
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

      let heartClassName = 'heart-icon'
      if (heartValue >= 1) {
        heartSrc = fullHeartIcon
        heartKey = `full-${i}`
      } else if (heartValue >= 0.5) {
        heartSrc = halfHeartIcon
        heartKey = `half-${i}`
        heartClassName = 'heart-icon heart-icon-half'
      } else {
        heartSrc = outlineHeartIcon
        heartKey = `outline-${i}`
      }

      hearts.push(
        <image
          key={heartKey}
          className={heartClassName}
          src={heartSrc}
        />,
      )
    }

    return hearts
  }

  // 渲染标签文本，如果包含"心动榜"，给这三个字加上背景
  const renderTagText = (tag: string) => {
    const keyword = '心动榜'
    const index = tag.indexOf(keyword)

    if (index === -1) {
      // 不包含"心动榜"，直接返回原文本
      return <text className='tag-text'>{tag}</text>
    }

    // 包含"心动榜"，拆分成三部分：前部分、心动榜、后部分
    const before = tag.substring(0, index)
    const after = tag.substring(index + keyword.length)

    return (
      <>
        {before && <text className='tag-text'>{before}</text>}
        <view className='tag-xindong-wrapper'>
          <image className='tag-xindong-bg' src={xindongTagBg} />
          <text className='tag-xindong-text'>{keyword}</text>
        </view>
        {after && <text className='tag-text tag-text-after'>{after}</text>}
      </>
    )
  }

  return (
    <view className='header-container'>
      <view className='left-cover'>
        <image
          className='cover-image'
          src={restaurant.restaurantCover}
        />
        <view className='badge'>
          <image className='badge-bg' src={badgeBg} />
          <text className='badge-text'>心动榜</text>
        </view>
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
          {restaurant.tags.map((tag, index) => {
            const hasXindong = tag.includes('心动榜')
            return (
              <view
                key={index}
                className={hasXindong ? 'tag tag-with-xindong' : 'tag'}
              >
                {renderTagText(tag)}
              </view>
            )
          })}
        </view>
      </view>
    </view>
  )
}

