import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

interface Props {
  selectedStep: number | null
  stepNotes: string[]
  root: string
  scale: string
  scaleNotes: string[]
  onNoteClick: (note: string) => void
}

// White keys in order, black key positions
const WHITE_NOTES = ['C','D','E','F','G','A','B']
const BLACK_NOTES: (string | null)[] = ['C#', 'D#', null, 'F#', 'G#', 'A#', null]

export function Keyboard({ selectedStep, stepNotes, scaleNotes, onNoteClick }: Props) {
  const [octave, setOctave] = useState(4)

  const getFullNote = (n: string) => `${n}${octave}`

  const isActive = (n: string) => stepNotes.includes(getFullNote(n))
  const inScale = (n: string) => scaleNotes.includes(n)

  if (selectedStep === null) {
    return (
      <div className="panel flex items-center justify-center p-4 text-[13px] text-muted-foreground">
        Select a step to assign notes
      </div>
    )
  }

  return (
    <div className="panel flex flex-col gap-3 p-4">
      <div className="flex items-center justify-between">
        <span className="label-mono">Keyboard — Octave {octave}</span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setOctave(o => Math.max(1, o - 1))}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="w-6 text-center font-mono text-[12px] text-foreground">{octave}</span>
          <button
            type="button"
            onClick={() => setOctave(o => Math.min(7, o + 1))}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-white/[0.03] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Piano keyboard */}
      <div className="relative flex h-20 sm:h-24 select-none">
        {WHITE_NOTES.map((note, wi) => {
          const active = isActive(note)
          const ins = inScale(note)
          const blackNote = BLACK_NOTES[wi]

          return (
            <div key={note} className="relative flex-1">
              {/* White key */}
              <button
                type="button"
                disabled={!ins}
                onClick={() => ins && onNoteClick(getFullNote(note))}
                className={cn(
                  'absolute inset-0 rounded-b-md border border-white/15 transition-colors',
                  active ? 'bg-purple shadow-[inset_0_-2px_0_rgba(155,92,255,0.5)]' : '',
                  ins && !active ? 'bg-white/90 hover:bg-white' : '',
                  !ins ? 'bg-white/20 cursor-not-allowed opacity-30' : 'cursor-pointer'
                )}
              >
                {ins && <span className={cn('absolute bottom-1 left-0 right-0 text-center font-mono text-[8px]', active ? 'text-white' : 'text-black/40')}>{note}</span>}
              </button>

              {/* Black key */}
              {blackNote && (
                <button
                  type="button"
                  disabled={!inScale(blackNote)}
                  onClick={() => inScale(blackNote) && onNoteClick(getFullNote(blackNote))}
                  className={cn(
                    'absolute -right-[30%] top-0 z-10 h-[58%] w-[60%] rounded-b-sm border border-black/40 transition-colors',
                    isActive(blackNote) ? 'bg-purple shadow-[0_0_10px_rgba(155,92,255,0.7)]' : '',
                    inScale(blackNote) && !isActive(blackNote) ? 'bg-[#1a1a1a] hover:bg-[#2a2a2a]' : '',
                    !inScale(blackNote) ? 'bg-[#111] cursor-not-allowed opacity-25' : 'cursor-pointer'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>
      <p className="text-[11px] text-muted-foreground">Dimmed keys are outside the scale · {scaleNotes.join(' · ')}</p>
    </div>
  )
}
