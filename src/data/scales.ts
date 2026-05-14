export const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

export const SCALES: Record<string, number[]> = {
  minor:            [0,2,3,5,7,8,10],
  major:            [0,2,4,5,7,9,11],
  dorian:           [0,2,3,5,7,9,10],
  phrygian:         [0,1,3,5,7,8,10],
  mixolydian:       [0,2,4,5,7,9,10],
  pentatonic_minor: [0,3,5,7,10],
  pentatonic_major: [0,2,4,7,9],
  blues:            [0,3,5,6,7,10],
}

export const SCALE_LABELS: Record<string, string> = {
  minor: 'Minor',
  major: 'Major',
  dorian: 'Dorian',
  phrygian: 'Phrygian',
  mixolydian: 'Mixolydian',
  pentatonic_minor: 'Pent. Minor',
  pentatonic_major: 'Pent. Major',
  blues: 'Blues',
}

export function getScaleNotes(root: string, scale: string): string[] {
  const rootIdx = NOTE_NAMES.indexOf(root)
  if (rootIdx === -1) return []
  return (SCALES[scale] ?? []).map(i => NOTE_NAMES[(rootIdx + i) % 12])
}

export function isInScale(note: string, root: string, scale: string): boolean {
  return getScaleNotes(root, scale).includes(note)
}
