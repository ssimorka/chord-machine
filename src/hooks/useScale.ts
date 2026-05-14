import { useMemo } from 'react'
import { getScaleNotes, NOTE_NAMES } from '@/data/scales'

export function useScale(root: string, scale: string) {
  const scaleNotes = useMemo(() => getScaleNotes(root, scale), [root, scale])

  const isInScale = (note: string) => scaleNotes.includes(note)

  // Build octave keyboard notes C4–B4 plus C5
  const keyboardNotes = useMemo(() => {
    const all: { note: string; octave: number; isBlack: boolean; inScale: boolean }[] = []
    for (const n of NOTE_NAMES) {
      const isBlack = n.includes('#')
      const octave = 4
      all.push({ note: n, octave, isBlack, inScale: scaleNotes.includes(n) })
    }
    return all
  }, [scaleNotes])

  return { scaleNotes, isInScale, keyboardNotes }
}
