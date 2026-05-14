export type Step = {
  active: boolean
  notes: string[]
  gate: number
  poly: boolean
}

export type Pattern = {
  id: string
  name: string
  steps: Step[]
  bpm: number
  root: string
  scale: string
  createdAt: number
}

export type Genre = {
  name: string
  bpm: number
  key: string
  scale: string
  vibe: string
  desc: string
  progression: (number | null)[]
}

export type WaveType = 'sine' | 'triangle' | 'sawtooth' | 'square'

export type SynthParams = {
  wave: WaveType
  glide: number
  cutoff: number
  resonance: number
  attack: number
  decay: number
  sustain: number
  release: number
  volume: number
}
