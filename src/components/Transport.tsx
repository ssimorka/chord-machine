import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, LayoutGrid, X } from 'lucide-react'
import { cn } from '@/utils/cn'
import { GenreLibrary } from './GenreLibrary'
import { GENRES } from '@/data/genres'
import { SCALE_LABELS } from '@/data/scales'

interface Props {
  isPlaying: boolean
  bpm: number
  step: number
  activeGenreIndex: number | null
  onTogglePlay: () => void
  onLoadGenre: (idx: number) => void
  root: string
  scale: string
}

export function Transport({ isPlaying, bpm, step, activeGenreIndex, onTogglePlay, onLoadGenre, root, scale }: Props) {
  const [genreOpen, setGenreOpen] = useState(false)
  const activeGenre = activeGenreIndex !== null ? GENRES[activeGenreIndex] : null

  return (
    <div className="panel flex flex-col gap-4 p-4">
      {/* Play + genre info */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        {/* Play button + step counter */}
        <div className="flex shrink-0 items-center gap-3">
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.03 }}
            onClick={onTogglePlay}
            className={cn(
              'relative flex h-14 w-14 items-center justify-center rounded-full border-2 transition-colors',
              isPlaying
                ? 'border-purple bg-purple text-white shadow-[0_0_24px_rgba(155,92,255,0.55)]'
                : 'border-white/15 bg-white/[0.03] text-foreground hover:border-white/30'
            )}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying
              ? <Pause className="h-6 w-6" fill="currentColor" />
              : <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />}
          </motion.button>

          <div className="ml-1 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className={isPlaying ? 'led animate-cm-pulse' : 'led-off'} />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {isPlaying ? 'Running' : 'Idle'}
              </span>
            </div>
            <span className="font-mono text-[11px] tabular-nums text-foreground/70">
              STEP {String(step >= 0 ? step + 1 : 1).padStart(2, '0')} / 16
            </span>
          </div>
        </div>

        {/* Genre info */}
        <AnimatePresence mode="wait">
          {activeGenre && (
            <motion.div
              key={activeGenre.name}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              className="min-w-0 flex-1 border-l border-white/5 pl-4 sm:pl-6"
            >
              <p className="mb-1 label-mono">Production Notes</p>
              <div className="mb-0.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-[15px] font-bold tracking-tight">{activeGenre.name}</span>
                <span className="font-mono text-[11px] tabular-nums text-purple">{bpm} BPM</span>
                <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                  · {root} {SCALE_LABELS[scale]}
                </span>
              </div>
              <p className="text-[12px] italic text-muted-foreground">{activeGenre.vibe}</p>
              <p className="mt-0.5 line-clamp-2 text-[12px] leading-relaxed text-foreground/75">{activeGenre.desc}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Genre Library toggle */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.98 }}
        onClick={() => setGenreOpen(v => !v)}
        className={cn(
          'flex w-full items-center justify-center gap-2 rounded-xl border py-2.5 text-[13px] font-semibold transition-colors',
          genreOpen
            ? 'border-purple/50 bg-purple/10 text-purple'
            : 'border-purple/30 bg-purple/10 text-purple hover:bg-purple/15'
        )}
      >
        {genreOpen ? <X className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
        {genreOpen ? 'Close' : 'Genre Library'}
      </motion.button>

      <GenreLibrary
        open={genreOpen}
        activeIndex={activeGenreIndex}
        onPick={(idx) => { onLoadGenre(idx); setGenreOpen(false) }}
      />
    </div>
  )
}
