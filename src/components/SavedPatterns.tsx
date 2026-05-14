import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { loadPatterns, removePattern } from '@/utils/storage'
import type { Pattern } from '@/types'

interface Props {
  refreshKey: number
  onLoad: (p: Pattern) => void
}

export function SavedPatterns({ refreshKey, onLoad }: Props) {
  const [patterns, setPatterns] = useState<Pattern[]>([])

  useEffect(() => {
    setPatterns(loadPatterns())
  }, [refreshKey])

  const handleDelete = (id: string) => {
    removePattern(id)
    setPatterns(loadPatterns())
  }

  return (
    <div className="panel flex flex-col gap-3 p-4">
      <span className="label-mono">Saved Patterns</span>
      {patterns.length === 0 ? (
        <p className="py-4 text-center text-[13px] text-muted">No saved patterns yet · hit Save to store one</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {patterns.map(p => (
            <div key={p.id} className="flex items-center justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold">{p.name}</p>
                <p className="font-mono text-[10px] text-muted">{p.bpm} BPM · {p.root} {p.scale} · {p.steps.filter(s => s.active).length} steps</p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onLoad(p)}
                  className="rounded-md border border-purple/30 bg-purple/10 px-2.5 py-1 font-mono text-[11px] font-bold text-purple transition-colors hover:bg-purple/20"
                >
                  Load
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(p.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-white/5 bg-white/[0.03] text-muted transition-colors hover:border-red-400/40 hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
