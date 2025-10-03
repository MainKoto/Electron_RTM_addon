import React, { JSX } from 'react'
import { ThemeProvider } from 'next-themes'

export function ColorModeProvider({ children }: { children: React.ReactNode }): JSX.Element {
  //defaultTheme="dark"でダークモード。defaultTheme="light"でライトモード
  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      {children}
    </ThemeProvider>
  )
}
