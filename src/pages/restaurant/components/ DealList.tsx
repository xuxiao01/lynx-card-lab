import { DealCard } from './DealCard'
import type { DealItem } from '../../../types/restaurant'
import foodDefaultImage from '../../../assets/food-default.png'
import './DealList.css'

export function DealList() {
  // 写死的 3 条 mock 数据
  const mockDeals: DealItem[] = [
    {
      dealId: '1',
      dealImage: foodDefaultImage,
      badges: [
        {
          text: '特惠补贴',
          subText: '减10',
          type: 'normal',
        },
      ],
      dealTitle: '【神仙下午茶】椒麻鸡+椒麻鱼+配菜+超大杯柠檬茶',
      price: 168,
      originalPrice: 298,
      buttonText: '抢购',
    },
    {
      dealId: '2',
      dealImage: foodDefaultImage,
      badges: [
        {
          text: '特惠补贴',
          subText: '减10',
          type: 'normal',
        },
      ],
      dealTitle: '【神仙下午茶】椒麻鸡+椒麻鱼+配菜+超大杯柠檬茶',
      price: 168,
      originalPrice: 298,
      buttonText: '抢购',
    },
    {
      dealId: '3',
      dealImage: foodDefaultImage,
      badges: [
        {
          text: '特惠补贴',
          subText: '减10',
          type: 'normal',
        },
      ],
      dealTitle: '【神仙下午茶】椒麻鸡+椒麻鱼+配菜+超大杯柠檬茶',
      price: 168,
      originalPrice: 298,
      buttonText: '抢购',
    },
  ]

  return (
    <view className='deal-list-container'>
      {mockDeals.map((deal) => (
        <DealCard key={deal.dealId} deal={deal} />
      ))}
    </view>
  )
}

