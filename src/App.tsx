import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster, toast } from 'sonner'
import { Header } from '@/components/Header'
import { Transport } from '@/components/Transport'
import { GlobalControls } from '@/components/GlobalControls'
import { StepGrid } from '@/components/StepGrid'
import { StepControls } from '@/components/StepControls'
import { Keyboard } from '@/components/Keyboard'
import { SynthEngine } from '@/components/SynthEngine'
import { SavedPatterns } from '@/components/SavedPatterns'
import { useSynth } from '@/hooks/useSynth'
import { useSequencer } from '@/hooks/useSequencer'
import { useScale } from '@/hooks/useScale'
import { addPattern } from '@/utils/storage'
import { GENRES } from '@/data/genres'
import type { SynthParams } from '@/types'

const DEFAULT_SYNTH_PARAMS: SynthParams = {
  wave: 'triangle',
  glide: 0,
  cutoff: 4000,
  resonance: 1,
  attack: 0.02,
  decay: 0.3,
  sustain: 0.6,
  release: 0.5,
  volume: -6,
}

function ChordMachineApp() {
  const synth = useSynth()
  const seq = useSequencer(synth)
  const { scaleNotes } = useScale(seq.root, seq.scale)
  const [synthParams, setSynthParams] = useState<SynthParams>(DEFAULT_SYNTH_PARAMS)
  const [savedKey, setSavedKey] = useState(0)

  const handleSynthChange = useCallback((p: Partial<SynthParams>) => {
    setSynthParams(prev => ({ ...prev, ...p }))
    synth.updateParams(p)
  }, [synth])

  const handleStepClick = useCallback((idx: number) => {
    if (seq.selectedStep === idx) {
      seq.toggleStepActive(idx)
    } else {
      seq.selectStep(idx)
    }
  }, [seq])

  const handleNoteClick = useCallback(async (note: string) => {
    if (seq.selectedStep === null) return
    seq.toggleNoteOnStep(seq.selectedStep, note)
    await synth.triggerNote(note)
  }, [seq, synth])

  const handleSave = useCallback(() => {
    const activeGenre = seq.activeGenreIndex !== null ? GENRES[seq.activeGenreIndex] : null
    const name = activeGenre
      ? `${activeGenre.name} edit`
      : `Pattern ${new Date().toLocaleTimeString()}`
    addPattern({ name, steps: seq.steps, bpm: seq.bpm, root: seq.root, scale: seq.scale })
    setSavedKey(k => k + 1)
    toast.success('Pattern saved', { description: 'Stored in this browser.' })
  }, [seq])

  const selectedStepData = seq.selectedStep !== null ? seq.steps[seq.selectedStep] ?? null : null

  return (
    <div className="min-h-screen w-full pb-16">
      <Header isPlaying={seq.isPlaying} />
      <main className="container flex flex-col gap-3 sm:gap-4">
        <Transport
          isPlaying={seq.isPlaying}
          bpm={seq.bpm}
          step={seq.currentStep}
          activeGenreIndex={seq.activeGenreIndex}
          onTogglePlay={seq.togglePlay}
          onLoadGenre={seq.loadGenre}
          root={seq.root}
          scale={seq.scale}
        />
        <GlobalControls
          root={seq.root}
          scale={seq.scale}
          bpm={seq.bpm}
          onRoot={seq.setRoot}
          onScale={seq.setScale}
          onBpm={seq.setBpm}
          onRandomize={seq.randomize}
          onClear={seq.clearSteps}
          onSave={handleSave}
        />
        <StepGrid
          steps={seq.steps}
          currentStep={seq.currentStep}
          selectedStep={seq.selectedStep}
          onStepClick={handleStepClick}
        />
        <StepControls
          selectedStep={seq.selectedStep}
          step={selectedStepData}
          onUpdate={update => seq.selectedStep !== null && seq.setStep(seq.selectedStep, update)}
        />
        <Keyboard
          selectedStep={seq.selectedStep}
          stepNotes={selectedStepData?.notes ?? []}
          root={seq.root}
          scale={seq.scale}
          scaleNotes={scaleNotes}
          onNoteClick={handleNoteClick}
        />
        <SynthEngine params={synthParams} onChange={handleSynthChange} />
        <SavedPatterns refreshKey={savedKey} onLoad={seq.loadPattern} />
      </main>
      <footer className="container mt-10 flex items-center justify-between border-t border-white/5 pt-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/70">
        <span>{GENRES.length} genres · 16 steps · chord sequencer</span>
        <span>Built for the dancefloor.</span>
      </footer>
      <Toaster theme="dark" position="bottom-right" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<ChordMachineApp />} />
      </Routes>
    </BrowserRouter>
  )
}
