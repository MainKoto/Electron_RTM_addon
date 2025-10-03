import { createContext, useCallback, useContext, useMemo, useState, useEffect } from 'react'
import type { JSX, ReactNode } from 'react'
import { Button, Checkbox, Dialog, Portal, Text } from '@chakra-ui/react'

type OpenOptions = {
  title: string
  body: string
  onAgree?: () => void
}

type TermsDialogContextValue = {
  openDialog: (opts: OpenOptions) => void
}

const TermsDialogContext = createContext<TermsDialogContextValue | null>(null)

export function TermsDialogProvider({ children }: { children: ReactNode }): JSX.Element {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState<string>('利用規約')
  const [body, setBody] = useState<string>('')
  const [onAgree, setOnAgree] = useState<(() => void) | undefined>(undefined)
  const [agreed, setAgreed] = useState(false)

  const openDialog = useCallback((opts: OpenOptions): void => {
    setTitle(opts.title ?? '利用規約')
    setBody(opts.body ?? '')
    setOnAgree(() => opts.onAgree)
    setAgreed(false)
    setOpen(true)
  }, [])

  const close = useCallback((): void => {
    setOpen(false)
  }, [])

  // Context value（公開は openDialog のみ）
  const value = useMemo<TermsDialogContextValue>(() => ({ openDialog }), [openDialog])

  // open が変わったらチェック状態初期化
  useEffect(() => {
    if (open) setAgreed(false)
  }, [open])

  return (
    <TermsDialogContext.Provider value={value}>
      {children}

      {/* ダイアログ本体（アプリに1つ） */}
      <Dialog.Root open={open} onOpenChange={(e) => (!e.open ? close() : undefined)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content maxW="lg" maxH="80vh" overflow="hidden">
              <Dialog.Header>
                <Dialog.Title>{title}</Dialog.Title>
                <Dialog.CloseTrigger />
              </Dialog.Header>

              <Dialog.Body overflow="auto">
                <Text as="p" whiteSpace="pre-wrap">
                  {body}
                </Text>
              </Dialog.Body>

              <Dialog.Footer justifyContent="space-between" alignItems="center" gap="4">
                {/* ✅ 公式どおりの構造 */}
                <Checkbox.Root
                  checked={agreed}
                  onCheckedChange={(e) => setAgreed(!!e.checked)}
                  cursor="pointer"
                >
                  <Checkbox.Control>
                    <Checkbox.Indicator />
                  </Checkbox.Control>
                  <Checkbox.Label>同意します</Checkbox.Label>
                  <Checkbox.HiddenInput />
                </Checkbox.Root>

                <Button
                  colorPalette="orange"
                  disabled={!agreed}
                  onClick={() => {
                    if (!agreed) return
                    onAgree?.()
                    close()
                  }}
                >
                  ダウンロード
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </TermsDialogContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTermsDialog(): TermsDialogContextValue {
  const ctx = useContext(TermsDialogContext)
  if (!ctx) throw new Error('useTermsDialog must be used within TermsDialogProvider')
  return ctx
}
