import { defineConfig } from '@lynx-js/rspeedy'

import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin'
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin'
import { pluginTypeCheck } from '@rsbuild/plugin-type-check'

export default defineConfig(() => {
  return {
    plugins: [
      pluginQRCode({
        schema(url) {
          return `${url}?fullscreen=true`
        },
      }),
      pluginReactLynx(),
      pluginTypeCheck(),
    ],

    // 开发环境代理配置
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
  }
})