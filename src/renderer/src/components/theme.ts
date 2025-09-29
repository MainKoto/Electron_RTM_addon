// src/renderer/src/components/theme.ts
import { defaultConfig, defineConfig, createSystem } from '@chakra-ui/react'

const config = defineConfig({
  globalCss: {
    html: {
      colorPalette: 'orange', //グローバルカラーの設定ができます
      fontSize: '20px' // コンポーネント全体の大きさを設定できます
    }
  }
})

export const system = createSystem(defaultConfig, config)
