import React, { JSX } from 'react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

export function Provider({ children }: { children: React.ReactNode }): JSX.Element {
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
}

export default Provider
