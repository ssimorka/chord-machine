import { Slider } from './ui/slider'
import { cn } from '@/utils/cn'
import type { Step } from '@/types'

interface Props {
  selectedStep: number | null
  step: Step | null
  onUpdate: (update: Partial<Step>) => void
}

export function StepControls({ selectedStep, step, onUpdate }: Props) {
  if (selectedStep === null || !step) {
    return (
      <div className="panel flex items-center justify-center p-4 text-[13px] text-muted">
        Select a step to edit
      </div>
    )
  }

  return (
    <div className="panel flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <span className="label-mono">Step {selectedStep + 1} Controls</span>
        <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
          {(['mono', 'poly'] as const).map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => onUpdate({ poly: mode === 'poly' })}
              className={cn(
                'rounded-md px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors',
                (mode === 'poly') === step.poly
                  ? 'bg-purple text-white'
                  : 'text-muted hover:text-foreground'
              )}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="label-mono">Gate</span>
          <span className="font-mono text-sm tabular-nums text-foreground/90">{step.gate}%</span>
        </div>
        <Slider min={5} max={100} step={1} value={[step.gate]} onValueChange={([v]) => onUpdate({ gate: v ?? step.gate })} />
      </div>

      {step.notes.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="label-mono">Notes</span>
          <div className="flex flex-wrap gap-1">
            {step.notes.map(n => (
              <span key={n} className="rounded-md border border-purple/30 bg-purple/10 px-2 py-0.5 font-mono text-[11px] text-purple">
                {n}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
