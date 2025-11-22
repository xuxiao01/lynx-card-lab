import './App.css'

export function App(props: {
  onRender?: () => void
}) {
  props.onRender?.()

  return (
    <view className='App'>
      <text className='HelloWorld'>hello world</text>
    </view>
  )
}
