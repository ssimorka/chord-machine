import { useEffect, useRef, useCallback } from 'react'
import * as Tone from 'tone'
import type { SynthParams } from '@/types'

export function useSynth() {
  const synthRef = useRef<Tone.PolySynth | null>(null)
  const filterRef = useRef<Tone.Filter | null>(null)

  useEffect(() => {
    const filter = new Tone.Filter(4000, 'lowpass').toDestination()
    const synth = new Tone.PolySynth(Tone.Synth).connect(filter)
    synth.set({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.02, decay: 0.3, sustain: 0.6, release: 0.5 },
    })
    filterRef.current = filter
    synthRef.current = synth
    return () => {
      synth.dispose()
      filter.dispose()
    }
  }, [])

  const updateParams = useCallback((params: Partial<SynthParams>) => {
    const synth = synthRef.current
    const filter = filterRef.current
    if (!synth || !filter) return
    if (params.wave !== undefined) synth.set({ oscillator: { type: params.wave } })
    if (params.glide !== undefined) synth.set({ portamento: params.glide / 1000 })
    if (params.cutoff !== undefined) filter.frequency.value = params.cutoff
    if (params.resonance !== undefined) filter.Q.value = params.resonance
    if (params.attack !== undefined || params.decay !== undefined || params.sustain !== undefined || params.release !== undefined) {
      synth.set({ envelope: {
        ...(params.attack !== undefined ? { attack: params.attack } : {}),
        ...(params.decay !== undefined ? { decay: params.decay } : {}),
        ...(params.sustain !== undefined ? { sustain: params.sustain } : {}),
        ...(params.release !== undefined ? { release: params.release } : {}),
      }})
    }
    if (params.volume !== undefined) synth.volume.value = params.volume
  }, [])

  const triggerNote = useCallback(async (note: string, duration = '8n') => {
    await Tone.start()
    synthRef.current?.triggerAttackRelease(note, duration)
  }, [])

  const triggerNotes = useCallback((notes: string[], duration: number, time: number) => {
    synthRef.current?.triggerAttackRelease(notes, duration, time)
  }, [])

  return { synthRef, filterRef, updateParams, triggerNote, triggerNotes }
}
