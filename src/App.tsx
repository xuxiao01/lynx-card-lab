import './App.css'
import { RestaurantPage } from './pages/restaurant/index'

export function App(props: {
  onRender?: () => void
}) {
  props.onRender?.()

  return (
    <view className='App'>
      <RestaurantPage />
    </view>
  )
}
