import { DealCard } from './DealCard'
import type { DealItem } from '../../../types/restaurant'
import foodDefaultImage from '../../../assets/food-default.png'
import './DealList.css'

export function DealList() {
  // 写死的 mock 数据，添加更多数据以支持横向滚动
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
    {
      dealId: '4',
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
      dealId: '5',
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
    <list
      className='deal-list-container'
      scroll-orientation='horizontal'
      list-type='single'
      span-count={1}
    >
      {mockDeals.map((deal) => (
        <list-item
          key={deal.dealId}
          item-key={`deal-${deal.dealId}`}
          className='deal-list-item'
        >
          <DealCard deal={deal} />
        </list-item>
      ))}
    </list>
  )
}

