import React, { JSX } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { system } from '../theme'
import { ColorModeProvider } from './color-mode'

export function Provider({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  )
}
