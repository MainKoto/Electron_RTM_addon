import React, { JSX } from 'react'
import { ThemeProvider, useTheme } from 'next-themes'
import { IconButton } from '@chakra-ui/react'

export function ColorModeProvider({ children }: { children: React.ReactNode }): JSX.Element {
  // 既定をダークにしたいなら defaultTheme="dark"
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
    </ThemeProvider>
  )
}

export function ColorModeButton(): JSX.Element {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  return (
    <IconButton
      size="sm"
      aria-label="Toggle color mode"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? '☀' : '🌙'}
    </IconButton>
  )
}
