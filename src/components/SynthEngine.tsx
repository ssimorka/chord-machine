import { Slider } from './ui/slider'
import { cn } from '@/utils/cn'
import type { SynthParams, WaveType } from '@/types'

interface Props {
  params: SynthParams
  onChange: (p: Partial<SynthParams>) => void
}

const WAVES: { value: WaveType; label: string }[] = [
  { value: 'sine', label: 'Sin' },
  { value: 'triangle', label: 'Tri' },
  { value: 'sawtooth', label: 'Saw' },
  { value: 'square', label: 'Sqr' },
]

function ParamSlider({ label, value, min, max, step = 0.01, format, onChange }: {
  label: string; value: number; min: number; max: number; step?: number
  format?: (v: number) => string; onChange: (v: number) => void
}) {
  const display = format ? format(value) : value.toFixed(2)
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="label-mono">{label}</span>
        <span className="font-mono text-[11px] tabular-nums text-foreground/80">{display}</span>
      </div>
      <Slider min={min} max={max} step={step} value={[value]} onValueChange={([v]) => onChange(v ?? value)} />
    </div>
  )
}

export function SynthEngine({ params, onChange }: Props) {
  return (
    <div className="panel flex flex-col gap-4 p-4">
      <span className="label-mono">Synth Engine</span>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Oscillator */}
        <div className="panel-sm flex flex-col gap-3 p-3">
          <span className="label-mono">Oscillator</span>
          <div className="flex gap-1">
            {WAVES.map(w => (
              <button
                key={w.value}
                type="button"
                onClick={() => onChange({ wave: w.value })}
                className={cn(
                  'flex-1 rounded-md border py-1.5 font-mono text-[11px] font-bold transition-colors',
                  params.wave === w.value
                    ? 'border-purple/60 bg-purple/20 text-purple'
                    : 'border-white/5 bg-white/[0.03] text-muted hover:text-foreground'
                )}
              >
                {w.label}
              </button>
            ))}
          </div>
          <ParamSlider label="Glide" value={params.glide} min={0} max={500} step={1}
            format={v => `${v}ms`} onChange={v => onChange({ glide: v })} />
        </div>

        {/* Filter */}
        <div className="panel-sm flex flex-col gap-3 p-3">
          <span className="label-mono">Filter</span>
          <ParamSlider label="Cutoff" value={params.cutoff} min={100} max={8000} step={10}
            format={v => v >= 1000 ? `${(v/1000).toFixed(1)}kHz` : `${Math.round(v)}Hz`}
            onChange={v => onChange({ cutoff: v })} />
          <ParamSlider label="Resonance" value={params.resonance} min={0.1} max={15} step={0.1}
            format={v => v.toFixed(1)} onChange={v => onChange({ resonance: v })} />
        </div>

        {/* Envelope */}
        <div className="panel-sm flex flex-col gap-3 p-3">
          <span className="label-mono">Envelope</span>
          <ParamSlider label="Attack" value={params.attack} min={0.001} max={2} step={0.001}
            format={v => `${v.toFixed(3)}s`} onChange={v => onChange({ attack: v })} />
          <ParamSlider label="Decay" value={params.decay} min={0.001} max={2} step={0.001}
            format={v => `${v.toFixed(3)}s`} onChange={v => onChange({ decay: v })} />
          <ParamSlider label="Sustain" value={params.sustain} min={0} max={1} step={0.01}
            format={v => `${Math.round(v * 100)}%`} onChange={v => onChange({ sustain: v })} />
          <ParamSlider label="Release" value={params.release} min={0.001} max={4} step={0.001}
            format={v => `${v.toFixed(3)}s`} onChange={v => onChange({ release: v })} />
        </div>

        {/* Amplifier */}
        <div className="panel-sm flex flex-col gap-3 p-3">
          <span className="label-mono">Amplifier</span>
          <ParamSlider label="Volume" value={params.volume} min={-30} max={0} step={0.5}
            format={v => `${v.toFixed(1)}dB`} onChange={v => onChange({ volume: v })} />
        </div>
      </div>
    </div>
  )
}
