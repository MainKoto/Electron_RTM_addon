// src/renderer/src/components/theme.ts
import { defaultConfig, defineConfig, createSystem } from '@chakra-ui/react'

// グローバルのカラーパレットを orange に設定
const config = defineConfig({
  globalCss: {
    html: {
      colorPalette: 'orange'
    }
  }
})

// defaultConfig に上書きしてシステムを生成
export const system = createSystem(defaultConfig, config)
