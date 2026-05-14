import { useState, useRef, useCallback, useEffect } from 'react'
import * as Tone from 'tone'
import type { Step, Pattern } from '@/types'
import type { useSynth } from './useSynth'
import { GENRES } from '@/data/genres'
import { NOTE_NAMES } from '@/data/scales'

const STEPS_COUNT = 16

function emptyStep(): Step {
  return { active: false, notes: [], gate: 80, poly: false }
}

function emptySteps(): Step[] {
  return Array.from({ length: STEPS_COUNT }, emptyStep)
}

function degreeToNote(degree: number, root: string, scale: string, octave = 4): string {
  const scaleIntervals: Record<string, number[]> = {
    minor:            [0,2,3,5,7,8,10],
    major:            [0,2,4,5,7,9,11],
    dorian:           [0,2,3,5,7,9,10],
    phrygian:         [0,1,3,5,7,8,10],
    mixolydian:       [0,2,4,5,7,9,10],
    pentatonic_minor: [0,3,5,7,10],
    pentatonic_major: [0,2,4,7,9],
    blues:            [0,3,5,6,7,10],
  }
  const intervals = scaleIntervals[scale] ?? scaleIntervals['minor']!
  const rootIdx = NOTE_NAMES.indexOf(root)
  const interval = intervals[degree % intervals.length] ?? 0
  const noteIdx = (rootIdx + interval) % 12
  return `${NOTE_NAMES[noteIdx]}${octave}`
}

export function useSequencer(synth: ReturnType<typeof useSynth>) {
  const [steps, setSteps] = useState<Step[]>(() => {
    const g = GENRES[0]!
    return emptySteps().map((s, i) => {
      const deg = g.progression[i]
      if (deg === null || deg === undefined) return s
      return { ...s, active: true, notes: [degreeToNote(deg, g.key, g.scale)] }
    })
  })
  const [bpm, setBpmState] = useState(GENRES[0]!.bpm)
  const [root, setRoot] = useState(GENRES[0]!.key)
  const [scale, setScale] = useState(GENRES[0]!.scale)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [selectedStep, setSelectedStep] = useState<number | null>(null)
  const [activeGenreIndex, setActiveGenreIndex] = useState<number | null>(0)

  const stepsRef = useRef(steps)
  stepsRef.current = steps

  const sequenceRef = useRef<Tone.Sequence | null>(null)

  useEffect(() => {
    Tone.getTransport().bpm.value = bpm
  }, [bpm])

  useEffect(() => {
    const seq = new Tone.Sequence(
      (time, idx: number) => {
        const step = stepsRef.current[idx]
        if (step?.active && step.notes.length > 0) {
          const gateDuration = Tone.Time('16n').toSeconds() * (step.gate / 100)
          synth.triggerNotes(step.notes, gateDuration, time)
        }
        Tone.getDraw().schedule(() => setCurrentStep(idx), time)
      },
      Array.from({ length: STEPS_COUNT }, (_, i) => i),
      '16n'
    )
    seq.start(0)
    sequenceRef.current = seq
    return () => { seq.stop(); seq.dispose(); sequenceRef.current = null }
  }, [synth])

  const play = useCallback(async () => {
    await Tone.start()
    if (Tone.getTransport().state !== 'started') Tone.getTransport().start()
    setIsPlaying(true)
  }, [])

  const stop = useCallback(() => {
    Tone.getTransport().stop()
    Tone.getTransport().position = 0
    setIsPlaying(false)
    setCurrentStep(-1)
  }, [])

  const togglePlay = useCallback(async () => {
    if (isPlaying) stop()
    else await play()
  }, [isPlaying, play, stop])

  const setBpm = useCallback((v: number) => setBpmState(v), [])

  const setStep = useCallback((idx: number, update: Partial<Step>) => {
    setSteps(prev => prev.map((s, i) => i === idx ? { ...s, ...update } : s))
  }, [])

  const toggleStepActive = useCallback((idx: number) => {
    setSteps(prev => prev.map((s, i) => i === idx ? { ...s, active: !s.active } : s))
  }, [])

  const selectStep = useCallback((idx: number) => {
    setSelectedStep(prev => prev === idx ? null : idx)
  }, [])

  const toggleNoteOnStep = useCallback((idx: number, note: string) => {
    setSteps(prev => prev.map((s, i) => {
      if (i !== idx) return s
      const hasNote = s.notes.includes(note)
      if (s.poly) {
        const notes = hasNote ? s.notes.filter(n => n !== note) : [...s.notes, note]
        return { ...s, notes, active: notes.length > 0 }
      } else {
        const notes = hasNote ? [] : [note]
        return { ...s, notes, active: notes.length > 0 }
      }
    }))
  }, [])

  const loadGenre = useCallback((idx: number) => {
    const g = GENRES[idx]
    if (!g) return
    const newSteps = emptySteps().map((s, i) => {
      const deg = g.progression[i]
      if (deg === null || deg === undefined) return s
      return { ...s, active: true, notes: [degreeToNote(deg, g.key, g.scale)] }
    })
    setSteps(newSteps)
    setBpmState(g.bpm)
    setRoot(g.key)
    setScale(g.scale)
    setActiveGenreIndex(idx)
    Tone.getTransport().bpm.value = g.bpm
  }, [])

  const loadPattern = useCallback((pattern: Pattern) => {
    setSteps(pattern.steps)
    setBpmState(pattern.bpm)
    setRoot(pattern.root)
    setScale(pattern.scale)
    setActiveGenreIndex(null)
    Tone.getTransport().bpm.value = pattern.bpm
  }, [])

  const clearSteps = useCallback(() => {
    setSteps(emptySteps())
    setActiveGenreIndex(null)
  }, [])

  const randomize = useCallback(() => {
    setSteps(prev => prev.map(s => ({
      ...s,
      active: Math.random() > 0.5,
      notes: s.notes.length > 0 ? s.notes : [],
    })))
  }, [])

  return {
    steps, bpm, root, scale, isPlaying, currentStep, selectedStep, activeGenreIndex,
    setRoot, setScale, setBpm, setStep, toggleStepActive, selectStep,
    toggleNoteOnStep, togglePlay, play, stop, loadGenre, loadPattern, clearSteps, randomize,
  }
}
