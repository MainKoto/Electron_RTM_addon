// src/renderer/src/components/GlobalDragBlocker.tsx
import { useEffect, type JSX } from 'react'

export default function GlobalDragBlocker(): JSX.Element | null {
  useEffect(() => {
    const onDragStart = (e: DragEvent): void => {
      e.preventDefault()
    }
    const onDragOver = (e: DragEvent): void => {
      e.preventDefault()
    }
    const onDrop = (e: DragEvent): void => {
      e.preventDefault()
    }

    window.addEventListener('dragstart', onDragStart, { passive: false })
    window.addEventListener('dragover', onDragOver, { passive: false })
    window.addEventListener('drop', onDrop, { passive: false })

    return () => {
      window.removeEventListener('dragstart', onDragStart)
      window.removeEventListener('dragover', onDragOver)
      window.removeEventListener('drop', onDrop)
    }
  }, [])

  return null
}
