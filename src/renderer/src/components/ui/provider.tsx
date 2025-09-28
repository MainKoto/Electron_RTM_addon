// src/renderer/src/components/ui/provider.tsx
import React, { JSX } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { system } from '../theme' // 先ほど作成した theme.ts を import
import { ColorModeProvider } from './color-mode' // 既存のダークモードProvider

export function Provider({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  )
}
