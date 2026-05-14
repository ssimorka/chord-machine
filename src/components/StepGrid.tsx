import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'
import type { Step } from '@/types'

interface Props {
  steps: Step[]
  currentStep: number
  selectedStep: number | null
  onStepClick: (idx: number) => void
}

export function StepGrid({ steps, currentStep, selectedStep, onStepClick }: Props) {
  return (
    <div className="panel p-3 sm:p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="label-mono">Step Sequencer</span>
        <span className="label-mono">{steps.filter(s => s.active).length} active</span>
      </div>
      <div className="grid grid-cols-16 gap-1 sm:gap-1.5">
        {steps.map((step, i) => {
          const isCurrent = currentStep === i
          const isSelected = selectedStep === i
          const isActive = step.active
          const hasPoly = step.poly && step.notes.length > 1
          const rootNote = step.notes[0]?.replace(/\d/, '') ?? ''

          return (
            <motion.button
              key={i}
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => onStepClick(i)}
              className={cn(
                'relative flex aspect-square flex-col items-center justify-center rounded-lg border text-[10px] font-mono font-bold transition-colors',
                isCurrent && isActive && 'border-purple bg-purple text-white shadow-[0_0_16px_rgba(155,92,255,0.7)] ring-glow-purple',
                isCurrent && !isActive && 'border-purple/50 bg-purple/10',
                !isCurrent && isActive && !isSelected && 'border-purple/50 bg-purple/20 text-purple',
                !isCurrent && isActive && isSelected && 'border-white bg-purple/25 text-purple ring-1 ring-white/60',
                !isCurrent && !isActive && isSelected && 'border-white/60 bg-white/5 text-muted-foreground ring-1 ring-white/40',
                !isCurrent && !isActive && !isSelected && 'border-white/8 bg-white/[0.02] text-muted-foreground hover:border-white/20',
                (Math.floor(i / 4) % 2 === 1) && !isActive && !isCurrent && 'bg-white/[0.015]'
              )}
            >
              {isActive && rootNote ? rootNote : <span className="text-[9px] text-muted-foreground/40">{i + 1}</span>}
              {hasPoly && (
                <span className="absolute bottom-0.5 right-0.5 h-1 w-1 rounded-full bg-purple/80" />
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
