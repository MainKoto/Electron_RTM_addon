// src/renderer/src/state/SelectedTrainContext.tsx
import { createContext, useContext, useState, JSX } from 'react'
import type { Train } from '../lib/TrainAPI'

type Ctx = {
  selected: Train | null
  setSelected: (t: Train | null) => void
  panelOpen: boolean
  setPanelOpen: (open: boolean) => void
}

const SelectedTrainContext = createContext<Ctx | undefined>(undefined)

export function SelectedTrainProvider({ children }: { children: React.ReactNode }): JSX.Element {
  const [selected, setSelected] = useState<Train | null>(null)
  const [panelOpen, setPanelOpen] = useState<boolean>(false)
  return (
    <SelectedTrainContext.Provider value={{ selected, setSelected, panelOpen, setPanelOpen }}>
      {children}
    </SelectedTrainContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSelectedTrain(): Ctx {
  const ctx = useContext(SelectedTrainContext)
  if (!ctx) {
    if (import.meta?.env?.DEV) {
      console.warn(
        'useSelectedTrain called outside SelectedTrainProvider. Wrap your tree with <SelectedTrainProvider>.'
      )
    }
    let _sel: Train | null = null
    let _open = false
    return {
      get selected() {
        return _sel
      },
      setSelected: (t) => {
        _sel = t
      },
      get panelOpen() {
        return _open
      },
      setPanelOpen: (o) => {
        _open = o
      }
    }
  }
  return ctx
}
