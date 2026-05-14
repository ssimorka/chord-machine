import { Shuffle, Trash2, Save } from 'lucide-react'
import { Slider } from './ui/slider'
import { NOTE_NAMES } from '@/data/scales'
import { SCALE_LABELS } from '@/data/scales'
import { cn } from '@/utils/cn'

interface Props {
  root: string
  scale: string
  bpm: number
  onRoot: (r: string) => void
  onScale: (s: string) => void
  onBpm: (b: number) => void
  onRandomize: () => void
  onClear: () => void
  onSave: () => void
}

export function GlobalControls({ root, scale, bpm, onRoot, onScale, onBpm, onRandomize, onClear, onSave }: Props) {
  return (
    <div className="panel flex flex-col gap-4 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Root note */}
        <div className="flex flex-col gap-2">
          <span className="label-mono">Root Note</span>
          <div className="flex flex-wrap gap-1">
            {NOTE_NAMES.map(n => (
              <button
                key={n}
                type="button"
                onClick={() => onRoot(n)}
                className={cn(
                  'h-7 rounded-md border px-2 font-mono text-[11px] font-bold transition-colors',
                  root === n
                    ? 'border-purple/60 bg-purple/20 text-purple'
                    : 'border-white/5 bg-white/[0.03] text-muted hover:border-white/15 hover:text-foreground'
                )}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Scale */}
        <div className="flex flex-col gap-2">
          <span className="label-mono">Scale</span>
          <div className="flex flex-wrap gap-1">
            {Object.entries(SCALE_LABELS).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => onScale(k)}
                className={cn(
                  'h-7 rounded-md border px-2 font-mono text-[11px] font-bold transition-colors',
                  scale === k
                    ? 'border-purple/60 bg-purple/20 text-purple'
                    : 'border-white/5 bg-white/[0.03] text-muted hover:border-white/15 hover:text-foreground'
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tempo */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="label-mono">Tempo</span>
          <span className="font-mono text-sm font-bold tabular-nums text-purple text-glow-purple">
            {bpm} <span className="text-[10px] font-normal text-muted">BPM</span>
          </span>
        </div>
        <Slider min={60} max={200} step={1} value={[bpm]} onValueChange={([v]) => onBpm(v ?? bpm)} />
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: <Shuffle className="h-4 w-4" />, label: 'Random', onClick: onRandomize },
          { icon: <Trash2 className="h-4 w-4" />, label: 'Clear', onClick: onClear },
          { icon: <Save className="h-4 w-4" />, label: 'Save', onClick: onSave },
        ].map(({ icon, label, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            className="flex h-10 w-full items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-[12px] font-semibold text-foreground/85 transition-colors hover:border-white/20 hover:bg-white/[0.06]"
          >
            {icon}{label}
          </button>
        ))}
      </div>
    </div>
  )
}
