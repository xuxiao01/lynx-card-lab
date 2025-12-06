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
   // 在这里加 output 配置
   output: {
    filename: {
      image: '[name].xuxiao.[contenthash:8][ext]',
    },
  },
    // 开发环境代理配置
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
      },
    },
    tools: {
      rspack(config, { rspack }) {
        config.plugins = config.plugins || []

        config.plugins.push(
          new rspack.BannerPlugin({
            banner: [
              '作者：徐潇',
              '完成功能：开发注释插入功能',
            ].join('\n'),
            // 不写 raw，默认会包成块注释 /*! ... */
          }),
        )
      },
    },
  }
})